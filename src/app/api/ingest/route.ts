import { NextRequest, NextResponse } from "next/server";
import { ingestSocialEvents } from "@/lib/ingest-social";
import { insertIngestedEvents, isFirebaseConfigured } from "@/lib/firebase/events";
import { generateOpinionDraftsForEvents } from "@/lib/event-opinion-drafts";

export const dynamic = "force-dynamic";
export const maxDuration = 120;

function checkCronSecret(request: NextRequest): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  const provided =
    request.nextUrl.searchParams.get("secret") ??
    request.headers.get("authorization")?.replace("Bearer ", "");
  return provided === secret;
}

export async function POST(request: NextRequest) {
  if (!checkCronSecret(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!isFirebaseConfigured()) {
    return NextResponse.json({ error: "Firebase not configured" }, { status: 503 });
  }

  // Cron passes fast=1 + opinions=0 — Netlify kills idle responses around 26–30s.
  const fast =
    request.nextUrl.searchParams.get("fast") === "1" ||
    request.nextUrl.searchParams.get("fast") === "true";
  const skipOpinions =
    request.nextUrl.searchParams.get("opinions") === "0" ||
    request.nextUrl.searchParams.get("opinions") === "false";
  const opinionLimit = Number(
    request.nextUrl.searchParams.get("opinionLimit") || "3",
  );

  // Stream progress so Netlify's inactivity gateway does not 504 mid-crawl.
  const encoder = new TextEncoder();
  const stream = new TransformStream();
  const writer = stream.writable.getWriter();

  const writeLine = async (payload: unknown) => {
    await writer.write(encoder.encode(`${JSON.stringify(payload)}\n`));
  };

  void (async () => {
    const ping = setInterval(() => {
      void writeLine({ ping: true, t: Date.now() });
    }, 8000);
    try {
      await writeLine({ phase: "start", fast });
      const events = await ingestSocialEvents("en", { fast });
      await writeLine({ phase: "crawled", discovered: events.length });
      const inserted = await insertIngestedEvents(events);
      const upserted = inserted.upserted + inserted.merged;
      await writeLine({
        phase: "inserted",
        upserted,
        merged: inserted.merged,
      });

      const opinions = skipOpinions
        ? null
        : await generateOpinionDraftsForEvents(events, {
            limit: Number.isFinite(opinionLimit) ? opinionLimit : 3,
            skipExisting: true,
          });

      const opinionDrafted =
        opinions?.results.filter((r) => r.status === "drafted").length ?? 0;
      const opinionSkipped =
        opinions?.results.filter((r) => r.status === "skipped").length ?? 0;
      const opinionFailed =
        opinions?.results.filter((r) => r.status === "failed").length ?? 0;

      await writeLine({
        success: true,
        fast,
        discovered: events.length,
        upserted,
        merged: inserted.merged,
        skippedRejected: inserted.skippedRejected,
        opinions: opinions
          ? {
              enabled: opinions.enabled,
              placesConfigured: opinions.placesConfigured,
              openaiConfigured: opinions.openaiConfigured,
              drafted: opinionDrafted,
              skipped: opinionSkipped,
              failed: opinionFailed,
              results: opinions.results,
            }
          : { skipped: true, reason: "disabled_by_query" },
        message: `${upserted} ingested events synced for moderation${
          inserted.merged ? ` (${inserted.merged} merged into existing)` : ""
        }${
          opinions ? `; ${opinionDrafted} POP opinion draft(s)` : ""
        }${fast ? " (fast mode)" : ""}`,
      });
    } catch (err) {
      await writeLine({
        success: false,
        error: err instanceof Error ? err.message : String(err),
      });
    } finally {
      clearInterval(ping);
      await writer.close();
    }
  })();

  return new Response(stream.readable, {
    headers: {
      "Content-Type": "application/x-ndjson; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}
