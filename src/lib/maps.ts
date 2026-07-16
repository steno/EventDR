import type { Event, Venue } from "./types";
import type { EventCoords } from "./event-coords";
import { resolveEventCoords } from "./event-coords";
import { eventDirectionsQuery } from "./event-location";

export function getDirectionsUrl(event: Event): string {
  const coords = resolveEventCoords(event);
  if (coords) {
    return `https://www.google.com/maps/search/?api=1&query=${coords.lat},${coords.lng}`;
  }
  const destination = eventDirectionsQuery(event);
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(destination)}`;
}

/** Google Maps pin / search for a venue. */
export function getVenueMapUrl(venue: Pick<Venue, "lat" | "lng" | "name" | "city">): string {
  return `https://www.google.com/maps/search/?api=1&query=${venue.lat},${venue.lng}`;
}

/**
 * Google Maps turn-by-turn to a venue.
 * Pass origin coords, or a free-text start address, or omit for destination-only.
 */
export function getVenueDirectionsUrl(
  venue: Pick<Venue, "lat" | "lng">,
  origin?: EventCoords | string | null,
): string {
  const destination = `${venue.lat},${venue.lng}`;
  const params = new URLSearchParams({
    api: "1",
    destination,
  });

  if (origin && typeof origin === "object") {
    params.set("origin", `${origin.lat},${origin.lng}`);
  } else if (typeof origin === "string" && origin.trim()) {
    params.set("origin", origin.trim());
  }

  return `https://www.google.com/maps/dir/?${params.toString()}`;
}
