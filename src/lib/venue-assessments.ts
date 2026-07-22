import { unstable_cache } from "next/cache";
import type { Venue, VenueAssessment } from "@/lib/types";
import { VENUE_AUDIENCE_POOLS } from "@/lib/home-layout";
import { getSeedVenue } from "@/lib/venues-seed";
import { getSeedVenueAssessment } from "@/lib/venue-assessments-seed";
import {
  fetchPlaceDetails,
  findPlaceId,
  isGooglePlacesConfigured,
  type GooglePlaceDetails,
} from "@/lib/google-places";
import {
  fetchVenueBySlug,
  isFirebaseConfigured,
  patchVenueGooglePlacesSnapshot,
} from "@/lib/firebase/events";
import { applyReviewSentiment } from "@/lib/venue-sentiment";

/** Hide assessment UI below this confidence. */
export const ASSESSMENT_CONFIDENCE_THRESHOLD = 0.25;

/** Next.js data cache — Firestore rating snapshot is the real spend lock. */
const PLACES_REVALIDATE_SECONDS = 60 * 60 * 24 * 7; // 7 days

type StoredPlacesMeta = {
  placeId?: string;
  rating?: number;
  reviewCount?: number;
  fetchedAt?: string;
};

function ratingFromVenue(venue?: Pick<
  Venue,
  "googlePlaceId" | "googleRating" | "googleReviewCount" | "googleRatingFetchedAt"
> | null): StoredPlacesMeta {
  if (!venue) return {};
  return {
    placeId: venue.googlePlaceId?.trim() || undefined,
    rating:
      typeof venue.googleRating === "number" && Number.isFinite(venue.googleRating)
        ? venue.googleRating
        : undefined,
    reviewCount:
      typeof venue.googleReviewCount === "number" &&
      Number.isFinite(venue.googleReviewCount)
        ? venue.googleReviewCount
        : undefined,
    fetchedAt: venue.googleRatingFetchedAt?.trim() || undefined,
  };
}

function detailsFromStored(
  placeId: string,
  meta: StoredPlacesMeta,
): GooglePlaceDetails | null {
  if (typeof meta.rating !== "number") return null;
  return {
    placeId,
    rating: meta.rating,
    userRatingCount: meta.reviewCount,
    reviews: [],
    snippets: [],
  };
}

export function areVenueAssessmentsEnabled(): boolean {
  const flag = (
    process.env.NEXT_PUBLIC_VENUE_ASSESSMENTS_ENABLED ??
    process.env.VENUE_ASSESSMENTS_ENABLED
  )
    ?.trim()
    .toLowerCase();
  if (flag === "0" || flag === "false" || flag === "off") return false;
  return true;
}

function inAudiencePool(slug: string): boolean {
  return (
    VENUE_AUDIENCE_POOLS.local.includes(slug) ||
    VENUE_AUDIENCE_POOLS.visitor.includes(slug)
  );
}

function hasVenueBasics(venue: Venue | undefined): boolean {
  if (!venue) return false;
  return Boolean(
    venue.lat &&
      venue.lng &&
      venue.description?.trim() &&
      (venue.phone || venue.website || venue.instagram),
  );
}

/** Recompute confidence from sources + editorial evidence. */
export function computeAssessmentConfidence(
  assessment: VenueAssessment,
  venue?: Venue,
): number {
  let score = 0;
  const google = assessment.sources.find(
    (s) => s.kind === "google_places" && s.rating != null,
  );
  if (google) {
    score += (google.reviewCount ?? 0) >= 20 ? 0.35 : 0.18;
    if ((google.snippets?.length ?? 0) > 0) {
      score += 0.12;
    }
  }
  if (assessment.updatedBy.includes("sentiment")) {
    score += 0.1;
  }
  if (assessment.sources.some((s) => s.kind === "editorial")) {
    score += 0.15;
  }
  if (inAudiencePool(assessment.venueSlug)) {
    score += 0.1;
  }
  if (assessment.themes.length >= 2) {
    score += 0.1;
  }
  if (hasVenueBasics(venue ?? getSeedVenue(assessment.venueSlug))) {
    score += 0.08;
  }
  return Math.min(1, Math.round(score * 100) / 100);
}

function withConfidence(
  assessment: VenueAssessment,
  venue?: Venue,
): VenueAssessment {
  return {
    ...assessment,
    confidence: computeAssessmentConfidence(assessment, venue),
  };
}

/**
 * Sync seed lookup for client components (event sheets).
 * Editorial only — no Google Places network call.
 */
export function getVenueAssessmentSync(
  slug: string | undefined | null,
): VenueAssessment | null {
  if (!slug || !areVenueAssessmentsEnabled()) return null;
  const seed = getSeedVenueAssessment(slug);
  if (!seed) return null;
  const assessment = withConfidence(seed, getSeedVenue(slug));
  if (assessment.confidence < ASSESSMENT_CONFIDENCE_THRESHOLD) return null;
  return assessment;
}

async function resolveStoredPlacesMeta(
  assessment: VenueAssessment,
  venue: Venue | undefined,
): Promise<StoredPlacesMeta> {
  const fromVenue = ratingFromVenue(venue);
  const fromAssessment: StoredPlacesMeta = {
    placeId: assessment.googlePlaceId?.trim() || undefined,
  };
  const googleSource = assessment.sources.find(
    (s) => s.kind === "google_places" && s.rating != null,
  );
  if (googleSource?.rating != null) {
    fromAssessment.rating = googleSource.rating;
    fromAssessment.reviewCount = googleSource.reviewCount;
    fromAssessment.fetchedAt = googleSource.fetchedAt;
  }

  let merged: StoredPlacesMeta = {
    placeId: fromVenue.placeId || fromAssessment.placeId,
    rating: fromVenue.rating ?? fromAssessment.rating,
    reviewCount: fromVenue.reviewCount ?? fromAssessment.reviewCount,
    fetchedAt: fromVenue.fetchedAt || fromAssessment.fetchedAt,
  };

  if (merged.placeId && merged.rating != null) return merged;

  const slug = venue?.slug ?? assessment.venueSlug;
  if (!slug || !isFirebaseConfigured()) return merged;
  try {
    const remote = await fetchVenueBySlug(slug);
    const fromRemote = ratingFromVenue(remote);
    merged = {
      placeId: merged.placeId || fromRemote.placeId,
      rating: merged.rating ?? fromRemote.rating,
      reviewCount: merged.reviewCount ?? fromRemote.reviewCount,
      fetchedAt: merged.fetchedAt || fromRemote.fetchedAt,
    };
  } catch {
    // keep what we have
  }
  return merged;
}

async function persistPlacesSnapshot(
  slug: string | undefined,
  details: GooglePlaceDetails,
  already: StoredPlacesMeta,
): Promise<void> {
  if (!slug) return;
  const sameId = already.placeId === details.placeId;
  const sameRating =
    already.rating === details.rating &&
    already.reviewCount === details.userRatingCount;
  if (sameId && sameRating) return;

  await patchVenueGooglePlacesSnapshot(slug, {
    googlePlaceId: details.placeId,
    googleRating: details.rating,
    googleReviewCount: details.userRatingCount,
    googleRatingFetchedAt: new Date().toISOString(),
  });
}

async function mergeGooglePlaces(
  assessment: VenueAssessment,
  venue: Venue | undefined,
  options?: { findIfMissing?: boolean; forceRefresh?: boolean },
): Promise<VenueAssessment> {
  if (!isGooglePlacesConfigured()) return assessment;

  const stored = await resolveStoredPlacesMeta(assessment, venue);
  let placeId = stored.placeId;

  if (!placeId && options?.findIfMissing) {
    placeId =
      (await findPlaceId(venue?.name ?? assessment.venueSlug, venue)) ??
      undefined;
  }
  if (!placeId) return assessment;

  // Prefer Firestore/seed snapshot — rating-only Place Details becomes static.
  if (!options?.forceRefresh && stored.rating != null) {
    const cached = detailsFromStored(placeId, stored);
    if (cached) {
      await persistPlacesSnapshot(
        venue?.slug ?? assessment.venueSlug,
        cached,
        stored,
      );
      return applyReviewSentiment(assessment, cached);
    }
  }

  // First pull (or explicit refresh) — Enterprise rating SKU only, no Atmosphere.
  const details = await fetchPlaceDetails(placeId, { mode: "rating" });
  if (!details) {
    // Still persist place_id so Text Search isn't repeated.
    if (stored.placeId !== placeId) {
      await patchVenueGooglePlacesSnapshot(
        venue?.slug ?? assessment.venueSlug,
        { googlePlaceId: placeId },
      );
    }
    return assessment;
  }

  await persistPlacesSnapshot(
    venue?.slug ?? assessment.venueSlug,
    details,
    stored,
  );
  return applyReviewSentiment(assessment, details);
}

async function loadVenueAssessment(
  slug: string,
  enrichPlaces: boolean,
): Promise<VenueAssessment | null> {
  const seed = getSeedVenueAssessment(slug);
  if (!seed) return null;

  const venue = getSeedVenue(slug);
  let assessment = seed;
  if (enrichPlaces) {
    // Cached 7d — allow one Places text-search per venue when place_id is missing.
    assessment = await mergeGooglePlaces(assessment, venue, {
      findIfMissing: true,
    });
  }
  return withConfidence(assessment, venue);
}

const getCachedVenueAssessment = unstable_cache(
  (slug: string) => loadVenueAssessment(slug, true),
  ["venue-assessment-sentiment-v5"],
  { revalidate: PLACES_REVALIDATE_SECONDS, tags: ["venue-assessments"] },
);

/**
 * Editorial seed + optional Google Places rating when API key is set.
 * Returns null when disabled, missing, or below confidence threshold.
 */
export async function getVenueAssessment(
  slug: string,
): Promise<VenueAssessment | null> {
  if (!areVenueAssessmentsEnabled()) return null;

  const assessment = isGooglePlacesConfigured()
    ? await getCachedVenueAssessment(slug)
    : await loadVenueAssessment(slug, false);

  if (!assessment) return null;
  if (assessment.confidence < ASSESSMENT_CONFIDENCE_THRESHOLD) return null;
  return assessment;
}

/** All seed assessments with confidence (for cron / ops). */
export async function listVenueAssessments(options?: {
  enrichPlaces?: boolean;
  /** Re-call Places even when a Firestore rating snapshot exists. */
  forceRefresh?: boolean;
}): Promise<VenueAssessment[]> {
  const { SEED_VENUE_ASSESSMENTS } = await import(
    "@/lib/venue-assessments-seed"
  );
  const enrich = Boolean(options?.enrichPlaces) && isGooglePlacesConfigured();
  const results: VenueAssessment[] = [];
  for (const seed of SEED_VENUE_ASSESSMENTS) {
    const venue = getSeedVenue(seed.venueSlug);
    let assessment = {
      ...seed,
      themes: [...seed.themes],
      sources: [...seed.sources],
      crowdFit: [...seed.crowdFit],
      axes: { ...seed.axes },
    };
    if (enrich) {
      assessment = await mergeGooglePlaces(assessment, venue, {
        findIfMissing: true,
        forceRefresh: Boolean(options?.forceRefresh),
      });
    }
    results.push(withConfidence(assessment, venue));
  }
  return results;
}
