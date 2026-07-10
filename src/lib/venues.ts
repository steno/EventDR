import { fetchVenues, isFirebaseConfigured } from "@/lib/firebase/events";
import { SEED_VENUES } from "@/lib/venues-seed";
import type { Venue } from "@/lib/types";

/** Venues for SSR and API — Firebase when configured, otherwise seed data. */
export async function getVenues(): Promise<Venue[]> {
  if (isFirebaseConfigured()) {
    const venues = await fetchVenues();
    if (venues.length > 0) return venues;
  }
  return SEED_VENUES;
}
