import { fetchVenues, isFirebaseConfigured } from "@/lib/firebase/events";
import { SEED_VENUES } from "@/lib/venues-seed";
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

/** Venues for SSR and API — full seed list plus any Firebase-only venues. */
export async function getVenues(): Promise<Venue[]> {
  if (!isFirebaseConfigured()) return SEED_VENUES;
  const remote = await fetchVenues();
  return mergeVenueLists(SEED_VENUES, remote);
}
