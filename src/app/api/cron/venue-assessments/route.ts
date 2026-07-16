import { NextRequest, NextResponse } from "next/server";
import {
  ASSESSMENT_CONFIDENCE_THRESHOLD,
  areVenueAssessmentsEnabled,
  listVenueAssessments,
} from "@/lib/venue-assessments";
import {
  isGooglePlacesConfigured,
  probeGooglePlaces,
} from "@/lib/google-places";
import { getSeedVenue } from "@/lib/venues-seed";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

function checkCronSecret(request: NextRequest): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  const provided =
    request.nextUrl.searchParams.get("secret") ??
    request.headers.get("authorization")?.replace("Bearer ", "");
  return provided === secret;
}

/**
 * Ops endpoint: list seed assessments; optionally enrich with Google Places
 * review sentiment (themes/crowd/verdict from review text + ratings).
 * GET /api/cron/venue-assessments?secret=CRON_SECRET&enrich=1
 * GET /api/cron/venue-assessments?secret=CRON_SECRET&probe=d-classico-sosua
 */
async function handle(request: NextRequest) {
  if (!checkCronSecret(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const probeSlug = request.nextUrl.searchParams.get("probe")?.trim();
  if (probeSlug) {
    const venue = getSeedVenue(probeSlug);
    const probe = await probeGooglePlaces(
      venue?.name ?? probeSlug,
      venue ?? undefined,
    );
    return NextResponse.json({
      generatedAt: new Date().toISOString(),
      placesConfigured: isGooglePlacesConfigured(),
      probeSlug,
      venueName: venue?.name ?? null,
      probe,
    });
  }

  const enrich =
    request.nextUrl.searchParams.get("enrich") === "1" ||
    request.nextUrl.searchParams.get("enrich") === "true";

  const assessments = await listVenueAssessments({ enrichPlaces: enrich });
  const visible = assessments.filter(
    (a) => a.confidence >= ASSESSMENT_CONFIDENCE_THRESHOLD,
  );
  const withGoogle = assessments.filter((a) =>
    a.sources.some((s) => s.kind === "google_places"),
  ).length;

  return NextResponse.json({
    generatedAt: new Date().toISOString(),
    enabled: areVenueAssessmentsEnabled(),
    placesConfigured: isGooglePlacesConfigured(),
    enriched: enrich && isGooglePlacesConfigured(),
    total: assessments.length,
    visible: visible.length,
    withGoogle,
    threshold: ASSESSMENT_CONFIDENCE_THRESHOLD,
    assessments: enrich ? assessments : visible,
  });
}

export async function GET(request: NextRequest) {
  return handle(request);
}

export async function POST(request: NextRequest) {
  return handle(request);
}
