import { NextRequest, NextResponse } from "next/server";
import { enrichPendingIngestEvents } from "@/lib/ingest-enrich";
import { isFirebaseConfigured } from "@/lib/firebase/events";

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

/**
 * Post-ingest enrichment for pending moderation events:
 * - Source + validate images (page OG, then Brave image search)
 * - Draft POP expert opinions (Places + OpenAI; never auto-published)
 *
 * GET/POST ?secret=&limit=8&opinionLimit=5
 * Optional: &ids=id1,id2 &skipImages=1 &skipOpinions=1 &forceImages=1
 */
async function handle(request: NextRequest) {
  if (!checkCronSecret(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!isFirebaseConfigured()) {
    return NextResponse.json({ error: "Firebase not configured" }, { status: 503 });
  }

  const params = request.nextUrl.searchParams;
  const limit = Number(params.get("limit") || "8");
  const opinionLimit = Number(params.get("opinionLimit") || "5");
  const ids = params
    .get("ids")
    ?.split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  const result = await enrichPendingIngestEvents({
    limit: Number.isFinite(limit) ? limit : 8,
    opinionLimit: Number.isFinite(opinionLimit) ? opinionLimit : 5,
    eventIds: ids?.length ? ids : undefined,
    includeApprovedMissingImages:
      params.get("includeApproved") !== "0" &&
      params.get("includeApproved") !== "false",
    skipImages:
      params.get("skipImages") === "1" || params.get("skipImages") === "true",
    skipOpinions:
      params.get("skipOpinions") === "1" ||
      params.get("skipOpinions") === "true",
    forceImages:
      params.get("forceImages") === "1" ||
      params.get("forceImages") === "true",
  });

  const opinionDrafted =
    result.opinions?.results.filter((r) => r.status === "drafted").length ?? 0;
  const opinionSkipped =
    result.opinions?.results.filter((r) => r.status === "skipped").length ?? 0;
  const opinionFailed =
    result.opinions?.results.filter((r) => r.status === "failed").length ?? 0;

  return NextResponse.json({
    success: true,
    generatedAt: new Date().toISOString(),
    pendingTotal: result.pendingTotal,
    considered: result.considered,
    imagesUpdated: result.imagesUpdated,
    imagesFailed: result.imagesFailed,
    imageResults: result.imageResults,
    opinions: result.opinions
      ? {
          enabled: result.opinions.enabled,
          placesConfigured: result.opinions.placesConfigured,
          openaiConfigured: result.opinions.openaiConfigured,
          drafted: opinionDrafted,
          skipped: opinionSkipped,
          failed: opinionFailed,
          results: result.opinions.results,
        }
      : { skipped: true },
    message: `Enriched pending ingest: ${result.imagesUpdated} image(s), ${opinionDrafted} opinion draft(s)`,
  });
}

export async function GET(request: NextRequest) {
  return handle(request);
}

export async function POST(request: NextRequest) {
  return handle(request);
}
