import { NextRequest, NextResponse } from "next/server";
import { FACEBOOK_SEED_EVENT_IDS } from "@/lib/facebook-groups";
import { EL_CAREY_WC2026_LEGACY_EVENT_IDS } from "@/lib/world-cup-2026-events";
import {
  upsertApprovedEvents,
  deleteEvent,
  isFirebaseConfigured,
  syncSeedVenues,
} from "@/lib/firebase/events";
import { resolveSeedEvents } from "@/lib/seed-events";
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

/** Idempotent: publish curated Facebook group events from fallback seeds. */
export async function POST(request: NextRequest) {
  if (!checkCronSecret(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!isFirebaseConfigured()) {
    return NextResponse.json({ error: "Firebase not configured" }, { status: 503 });
  }

  const { events, missing, skippedExpired } = resolveSeedEvents(
    FACEBOOK_SEED_EVENT_IDS,
  );

  if (missing.length > 0) {
    return NextResponse.json(
      { error: "Missing fallback seed events", missing, skippedExpired },
      { status: 500 },
    );
  }

  const venuesSynced = await syncSeedVenues({ missingOnly: false });
  const upserted = await upsertApprovedEvents(events, "crawl");

  const deleted: string[] = [];
  for (const legacyId of EL_CAREY_WC2026_LEGACY_EVENT_IDS) {
    if (await deleteEvent(legacyId)) deleted.push(legacyId);
  }

  const skipOpinions =
    request.nextUrl.searchParams.get("opinions") === "0" ||
    request.nextUrl.searchParams.get("opinions") === "false";
  const opinions = skipOpinions
    ? null
    : await generateOpinionDraftsForEvents(events, {
        limit: 5,
        skipExisting: true,
      });

  return NextResponse.json({
    success: true,
    venuesSynced,
    upserted,
    deleted,
    skippedExpired,
    ids: events.map((e) => e.id),
    opinions: opinions
      ? {
          drafted: opinions.results.filter((r) => r.status === "drafted")
            .length,
          skipped: opinions.results.filter((r) => r.status === "skipped")
            .length,
          failed: opinions.results.filter((r) => r.status === "failed").length,
          results: opinions.results,
        }
      : { skipped: true },
  });
}
