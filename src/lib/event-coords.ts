import type { Event } from "./types";
import { getSeedVenue, matchVenueSlug } from "./venues-seed";

export interface EventCoords {
  lat: number;
  lng: number;
}

const CITY_COORDS: Record<string, EventCoords> = {
  "puerto plata": { lat: 19.7976623, lng: -70.6932862 },
  sosúa: { lat: 19.7572211, lng: -70.5171504 },
  sosua: { lat: 19.7572211, lng: -70.5171504 },
  cabarete: { lat: 19.7502745, lng: -70.4073077 },
  costambar: { lat: 19.8145, lng: -70.7151 },
  "playa dorada": { lat: 19.7695, lng: -70.643 },
};

export const NORTH_COAST_CENTER = CITY_COORDS["puerto plata"];

function venueCoords(slug: string): EventCoords | null {
  const venue = getSeedVenue(slug);
  if (!venue) return null;
  return { lat: venue.lat, lng: venue.lng };
}

/** Resolve map pin coordinates — seed venue first, then explicit event coords, then city fallback. */
export function resolveEventCoords(
  event: Pick<Event, "lat" | "lng" | "venueSlug" | "venue" | "location" | "format">,
): EventCoords | null {
  if (event.format === "digital") return null;

  if (event.venueSlug) {
    const coords = venueCoords(event.venueSlug);
    if (coords) return coords;
  }

  const slug =
    matchVenueSlug(event.venue) ?? matchVenueSlug(event.location);
  if (slug) {
    const coords = venueCoords(slug);
    if (coords) return coords;
  }

  // Trust stored pins (e.g. Places-geocoded ingest venues not yet in seed).
  if (event.lat != null && event.lng != null) {
    return { lat: event.lat, lng: event.lng };
  }

  const loc = event.location.toLowerCase();
  for (const [city, coords] of Object.entries(CITY_COORDS)) {
    if (!loc.includes(city)) continue;
    if (event.venue?.trim()) {
      if (process.env.NODE_ENV === "development") {
        console.warn(
          `[event-coords] Named venue "${event.venue}" (${event.location}) has no pin — add venueSlug or lat/lng`,
        );
      }
      return null;
    }
    return coords;
  }
  return null;
}
