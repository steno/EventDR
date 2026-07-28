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
 * Post-ingest editorial prep for pending (and approved-gap) events:
 * venue link, phone, validated image, POP opinion draft + auto-publish when solid.
 *
 * GET/POST ?secret=&limit=8
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
  const ids = params
    .get("ids")
    ?.split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  const result = await enrichPendingIngestEvents({
    limit: Number.isFinite(limit) ? limit : 8,
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

  return NextResponse.json({
    success: true,
    generatedAt: new Date().toISOString(),
    pendingTotal: result.pendingTotal,
    considered: result.considered,
    imagesUpdated: result.imagesUpdated,
    imagesFailed: result.imagesFailed,
    venuesUpdated: result.venuesUpdated,
    phonesUpdated: result.phonesUpdated,
    opinionsApproved: result.opinionsApproved,
    imageResults: result.imageResults,
    venueResults: result.venueResults,
    opinions: result.opinions ?? { skipped: true },
    message: `Editorial prep: ${result.imagesUpdated} image(s), ${result.venuesUpdated} venue(s), ${result.phonesUpdated} phone(s), ${result.opinionsApproved} opinion(s) live`,
  });
}

export async function GET(request: NextRequest) {
  return handle(request);
}

export async function POST(request: NextRequest) {
  return handle(request);
}
