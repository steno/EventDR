import { unstable_cache } from "next/cache";
import { getFirestoreDb, isFirebaseConfigured } from "@/lib/firebase/admin";
import { getVenueEngagementScores } from "@/lib/firebase/venue-engagement";
import { getAudiencePoolSlugs } from "@/lib/home-layout";
import { localDateISO } from "@/lib/event-dates";
import type { VenueEngagementScores } from "@/lib/venue-engagement";

async function loadAudienceEngagementScores(): Promise<VenueEngagementScores> {
  if (!isFirebaseConfigured()) return {};
  const db = getFirestoreDb();
  if (!db) return {};
  try {
    return await getVenueEngagementScores(db, getAudiencePoolSlugs());
  } catch (error) {
    console.error("venue engagement: home score load failed:", error);
    return {};
  }
}

/**
 * Cached pool scores for home Local / Visitor rails. Day key keeps decay
 * stable across the ISR window; short revalidate picks up new shares.
 */
export async function getHomeVenueEngagementScores(): Promise<VenueEngagementScores> {
  const day = localDateISO();
  return unstable_cache(loadAudienceEngagementScores, [
    "home-venue-engagement-scores",
    day,
  ], {
    revalidate: 120,
  })();
}
