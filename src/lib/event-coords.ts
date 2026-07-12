import type { Event } from "./types";
import { getSeedVenue, matchVenueSlug } from "./venues-seed";

export interface EventCoords {
  lat: number;
  lng: number;
}

/** Resolve map pin coordinates — event coords first, then matched venue. */
export function resolveEventCoords(
  event: Pick<Event, "lat" | "lng" | "venueSlug" | "venue" | "location" | "format">,
): EventCoords | null {
  if (event.format === "digital") return null;

  if (event.lat != null && event.lng != null) {
    return { lat: event.lat, lng: event.lng };
  }

  const slug =
    event.venueSlug ?? matchVenueSlug(event.venue) ?? matchVenueSlug(event.location);
  if (!slug) return null;

  const venue = getSeedVenue(slug);
  if (!venue) return null;

  return { lat: venue.lat, lng: venue.lng };
}
