import type { Locale } from "@/i18n/config";
import { localDateISO } from "@/lib/event-dates";
import {
  findNearbyForEventDetail,
  findNearbyOnStrip,
  type NearbyTonightResult,
} from "@/lib/nearby-events";
import { getPublicEvents } from "@/lib/public-events";
import type { Event, Venue } from "@/lib/types";

/**
 * Same-day walkable neighbors for an event detail page.
 * Falls back to the strip look-ahead when that night is quiet.
 */
export async function getNearbyTonightForEvent(
  event: Event,
  locale: Locale,
): Promise<NearbyTonightResult> {
  const pool = await getPublicEvents({ locale });
  return findNearbyForEventDetail(event, pool);
}

/**
 * Upcoming events elsewhere on this venue’s walkable strip (excludes this
 * venue’s own listings — those already appear in the venue schedule).
 */
export async function getNearbyTonightForVenue(
  venue: Venue,
  locale: Locale,
): Promise<NearbyTonightResult> {
  const pool = await getPublicEvents({ locale });
  const today = localDateISO();
  const source: Event = {
    id: `__venue__${venue.slug}`,
    title: venue.name,
    description: "",
    date: today,
    location: venue.city,
    venue: venue.name,
    venueSlug: venue.slug,
    lat: venue.lat,
    lng: venue.lng,
    category: "culture",
    format: "physical",
  };
  return findNearbyOnStrip(source, pool);
}
