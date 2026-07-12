import type { Event } from "./types";
import { getSeedVenue, matchVenueSlug } from "./venues-seed";

export interface EventCoords {
  lat: number;
  lng: number;
}

const CITY_COORDS: Record<string, EventCoords> = {
  "puerto plata": { lat: 19.7904, lng: -70.6702 },
  sosúa: { lat: 19.7538, lng: -70.5192 },
  sosua: { lat: 19.7538, lng: -70.5192 },
  cabarete: { lat: 19.7495, lng: -70.4084 },
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

  if (event.lat != null && event.lng != null) {
    return { lat: event.lat, lng: event.lng };
  }

  const loc = event.location.toLowerCase();
  for (const [city, coords] of Object.entries(CITY_COORDS)) {
    if (loc.includes(city)) return coords;
  }
  return null;
}
