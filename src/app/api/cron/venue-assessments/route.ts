import { NextRequest, NextResponse } from "next/server";
import { checkCronSecret } from "@/lib/ops-auth";
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


/**
 * Ops endpoint: list seed assessments; optionally enrich with Google Places
 * ratings (Enterprise SKU — no review Atmosphere). Once a rating is stored on
 * the venue doc it is reused (no re-bill) unless refresh=1.
 * Review texts are only fetched on opinion-draft generation.
 * GET /api/cron/venue-assessments?enrich=1  (Authorization: Bearer CRON_SECRET)
 * GET /api/cron/venue-assessments?enrich=1&refresh=1
 * GET /api/cron/venue-assessments?probe=d-classico-sosua
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
  const forceRefresh =
    request.nextUrl.searchParams.get("refresh") === "1" ||
    request.nextUrl.searchParams.get("refresh") === "true";

  const assessments = await listVenueAssessments({
    enrichPlaces: enrich,
    forceRefresh: enrich && forceRefresh,
  });
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
    forceRefresh: enrich && forceRefresh,
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
