import { unstable_cache } from "next/cache";
import type { Locale } from "@/i18n/config";
import { applyActiveEditorialClosureToVenue } from "@/lib/alerts";
import { localDateISO } from "@/lib/event-dates";
import { fetchVenueBySlug, fetchVenues, isFirebaseConfigured } from "@/lib/firebase/events";
import { localizeVenue, localizeVenues } from "@/lib/venues-i18n";
import { attachVenueImage, attachVenueImages } from "@/lib/venue-images";
import {
  applyTemporaryVenueClosure,
  applyTemporaryVenueClosures,
} from "@/lib/temporary-closures";
import { getSeedVenue, SEED_VENUES } from "@/lib/venues-seed";
import { VENUES_REVALIDATE_SECONDS } from "@/lib/http-cache";
import type { Venue } from "@/lib/types";

/** Seed venues are canonical; Firebase may add community-only venues.
 * Overlay enrichable fields (place id + rating snapshot) from remote onto seed. */
function overlayPlacesMeta(seed: Venue, remote: Venue): Venue {
  const next: Venue = { ...seed };
  let changed = false;
  if (!next.googlePlaceId && remote.googlePlaceId) {
    next.googlePlaceId = remote.googlePlaceId;
    changed = true;
  }
  if (
    typeof next.googleRating !== "number" &&
    typeof remote.googleRating === "number"
  ) {
    next.googleRating = remote.googleRating;
    next.googleReviewCount = remote.googleReviewCount;
    next.googleRatingFetchedAt = remote.googleRatingFetchedAt;
    changed = true;
  }
  if (
    (!next.googleReviews || next.googleReviews.length === 0) &&
    remote.googleReviews &&
    remote.googleReviews.length > 0
  ) {
    next.googleReviews = remote.googleReviews;
    next.googleReviewsFetchedAt = remote.googleReviewsFetchedAt;
    changed = true;
  }
  return changed ? next : seed;
}

export function mergeVenueLists(seed: Venue[], remote: Venue[]): Venue[] {
  const bySlug = new Map<string, Venue>();
  for (const venue of seed) bySlug.set(venue.slug, venue);
  for (const venue of remote) {
    const existing = bySlug.get(venue.slug);
    if (!existing) {
      bySlug.set(venue.slug, venue);
      continue;
    }
    bySlug.set(venue.slug, overlayPlacesMeta(existing, venue));
  }
  return [...bySlug.values()].sort((a, b) => a.name.localeCompare(b.name));
}

async function loadVenueBySlug(
  slug: string,
  locale: string,
): Promise<Venue | undefined> {
  const seed = getSeedVenue(slug);
  let venue: Venue | undefined = seed;
  // Skip Firestore during SSG (same as public-events) — admin SDK + review dumps OOM Netlify.
  if (
    isFirebaseConfigured() &&
    process.env.NEXT_PHASE !== "phase-production-build"
  ) {
    try {
      const remote = (await fetchVenueBySlug(slug)) ?? undefined;
      if (remote) {
        if (!venue) {
          venue = remote;
        } else {
          venue = overlayPlacesMeta(venue, remote);
        }
      }
    } catch {
      // keep seed
    }
  }
  if (!venue) return undefined;
  venue = applyActiveEditorialClosureToVenue(venue, localDateISO(new Date()));
  const typedLocale = locale ? (locale as Locale) : undefined;
  const localized = typedLocale ? localizeVenue(venue, typedLocale) : venue;
  const withNotice = typedLocale
    ? applyTemporaryVenueClosure(localized, typedLocale)
    : localized;
  return attachVenueImage(withNotice);
}

const getCachedVenueBySlug = unstable_cache(
  loadVenueBySlug,
  ["venue-by-slug"],
  { revalidate: VENUES_REVALIDATE_SECONDS, tags: ["venues"] },
);

/** Single venue lookup — seed coords win over stale Firestore copies.
 * Re-attach curated heroes outside cache so filename bumps aren't frozen. */
export async function getVenueBySlug(
  slug: string,
  locale?: Locale,
): Promise<Venue | undefined> {
  const venue = await getCachedVenueBySlug(slug, locale ?? "");
  return venue ? attachVenueImage(venue) : undefined;
}

async function loadVenues(locale: string): Promise<Venue[]> {
  let venues: Venue[];
  if (
    !isFirebaseConfigured() ||
    process.env.NEXT_PHASE === "phase-production-build"
  ) {
    venues = SEED_VENUES;
  } else {
    try {
      const remote = await fetchVenues();
      venues = mergeVenueLists(SEED_VENUES, remote);
    } catch {
      venues = SEED_VENUES;
    }
  }
  const today = localDateISO(new Date());
  venues = venues.map((venue) =>
    applyActiveEditorialClosureToVenue(venue, today),
  );
  const typedLocale = locale ? (locale as Locale) : undefined;
  if (!typedLocale) return attachVenueImages(venues);
  return attachVenueImages(
    applyTemporaryVenueClosures(localizeVenues(venues, typedLocale), typedLocale),
  );
}

const getCachedVenues = unstable_cache(
  loadVenues,
  ["venues-list"],
  { revalidate: VENUES_REVALIDATE_SECONDS, tags: ["venues"] },
);

/** Venues for SSR and API — full seed list plus any Firebase-only venues.
 * Re-attach curated heroes outside cache so filename bumps aren't frozen. */
export async function getVenues(locale?: Locale): Promise<Venue[]> {
  return attachVenueImages(await getCachedVenues(locale ?? ""));
}
