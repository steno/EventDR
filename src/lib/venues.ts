import { fetchVenueBySlug, fetchVenues, isFirebaseConfigured } from "@/lib/firebase/events";
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
export async function getVenueBySlug(slug: string): Promise<Venue | undefined> {
  const seed = getSeedVenue(slug);
  if (seed) return seed;
  if (!isFirebaseConfigured()) return undefined;
  try {
    return (await fetchVenueBySlug(slug)) ?? undefined;
  } catch {
    return undefined;
  }
}

/** Venues for SSR and API — full seed list plus any Firebase-only venues. */
export async function getVenues(): Promise<Venue[]> {
  if (!isFirebaseConfigured()) return SEED_VENUES;
  try {
    const remote = await fetchVenues();
    return mergeVenueLists(SEED_VENUES, remote);
  } catch {
    return SEED_VENUES;
  }
}
