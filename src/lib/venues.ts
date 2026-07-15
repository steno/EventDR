import { unstable_cache } from "next/cache";
import type { Locale } from "@/i18n/config";
import { fetchVenueBySlug, fetchVenues, isFirebaseConfigured } from "@/lib/firebase/events";
import { localizeVenue, localizeVenues } from "@/lib/venues-i18n";
import { attachVenueImage, attachVenueImages } from "@/lib/venue-images";
import { getSeedVenue, SEED_VENUES } from "@/lib/venues-seed";
import { VENUES_REVALIDATE_SECONDS } from "@/lib/http-cache";
import type { Venue } from "@/lib/types";

/** Seed venues are canonical; Firebase may add community-only venues. */
export function mergeVenueLists(seed: Venue[], remote: Venue[]): Venue[] {
  const bySlug = new Map<string, Venue>();
  for (const venue of seed) bySlug.set(venue.slug, venue);
  for (const venue of remote) {
    if (!bySlug.has(venue.slug)) bySlug.set(venue.slug, venue);
  }
  return [...bySlug.values()].sort((a, b) => a.name.localeCompare(b.name));
}

async function loadVenueBySlug(
  slug: string,
  locale: string,
): Promise<Venue | undefined> {
  const seed = getSeedVenue(slug);
  let venue: Venue | undefined = seed;
  if (!venue && isFirebaseConfigured()) {
    try {
      venue = (await fetchVenueBySlug(slug)) ?? undefined;
    } catch {
      venue = undefined;
    }
  }
  if (!venue) return undefined;
  const typedLocale = locale ? (locale as Locale) : undefined;
  const localized = typedLocale ? localizeVenue(venue, typedLocale) : venue;
  return attachVenueImage(localized);
}

const getCachedVenueBySlug = unstable_cache(
  loadVenueBySlug,
  ["venue-by-slug"],
  { revalidate: VENUES_REVALIDATE_SECONDS, tags: ["venues"] },
);

/** Single venue lookup — seed coords win over stale Firestore copies. */
export async function getVenueBySlug(
  slug: string,
  locale?: Locale,
): Promise<Venue | undefined> {
  return getCachedVenueBySlug(slug, locale ?? "");
}

async function loadVenues(locale: string): Promise<Venue[]> {
  let venues: Venue[];
  if (!isFirebaseConfigured()) {
    venues = SEED_VENUES;
  } else {
    try {
      const remote = await fetchVenues();
      venues = mergeVenueLists(SEED_VENUES, remote);
    } catch {
      venues = SEED_VENUES;
    }
  }
  const typedLocale = locale ? (locale as Locale) : undefined;
  return typedLocale
    ? attachVenueImages(localizeVenues(venues, typedLocale))
    : attachVenueImages(venues);
}

const getCachedVenues = unstable_cache(
  loadVenues,
  ["venues-list"],
  { revalidate: VENUES_REVALIDATE_SECONDS, tags: ["venues"] },
);

/** Venues for SSR and API — full seed list plus any Firebase-only venues. */
export async function getVenues(locale?: Locale): Promise<Venue[]> {
  return getCachedVenues(locale ?? "");
}
