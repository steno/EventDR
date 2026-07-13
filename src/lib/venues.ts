import type { Locale } from "@/i18n/config";
import { fetchVenueBySlug, fetchVenues, isFirebaseConfigured } from "@/lib/firebase/events";
import { localizeVenue, localizeVenues } from "@/lib/venues-i18n";
import { attachVenueImage, attachVenueImages } from "@/lib/venue-images";
import { getSeedVenue, SEED_VENUES } from "@/lib/venues-seed";
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

/** Single venue lookup — seed coords win over stale Firestore copies. */
export async function getVenueBySlug(
  slug: string,
  locale?: Locale,
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
  const localized = locale ? localizeVenue(venue, locale) : venue;
  return attachVenueImage(localized);
}

/** Venues for SSR and API — full seed list plus any Firebase-only venues. */
export async function getVenues(locale?: Locale): Promise<Venue[]> {
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
  return locale ? attachVenueImages(localizeVenues(venues, locale)) : attachVenueImages(venues);
}
