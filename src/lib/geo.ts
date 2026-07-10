import type { Event } from "./types";
import { SEED_VENUES, matchVenueSlug } from "./venues-seed";

const CITY_COORDS: Record<string, { lat: number; lng: number }> = {
  "puerto plata": { lat: 19.7934, lng: -70.6884 },
  sosúa: { lat: 19.7528, lng: -70.5261 },
  sosua: { lat: 19.7528, lng: -70.5261 },
  cabarete: { lat: 19.7495, lng: -70.4084 },
  costambar: { lat: 19.8145, lng: -70.7151 },
  "playa dorada": { lat: 19.78, lng: -70.65 },
};

export const NORTH_COAST_CENTER = { lat: 19.7934, lng: -70.6884 };

export function resolveEventCoords(event: Event): { lat: number; lng: number } | null {
  if (event.venueSlug) {
    const venue = SEED_VENUES.find((v) => v.slug === event.venueSlug);
    if (venue) return { lat: venue.lat, lng: venue.lng };
  }

  const slug = matchVenueSlug(event.venue);
  if (slug) {
    const venue = SEED_VENUES.find((v) => v.slug === slug);
    if (venue) return { lat: venue.lat, lng: venue.lng };
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

export function attachCoords(events: Event[]): Event[] {
  return events.map((e) => {
    const coords = resolveEventCoords(e);
    if (!coords) return e;
    return { ...e, lat: coords.lat, lng: coords.lng };
  });
}

export function attachVenueSlugs(events: Event[]): Event[] {
  return events.map((e) => {
    if (e.venueSlug) return e;
    const slug = matchVenueSlug(e.venue) ?? matchVenueSlug(e.location);
    return slug ? { ...e, venueSlug: slug } : e;
  });
}

export function filterByVenueSlug(events: Event[], venueSlug: string): Event[] {
  return attachVenueSlugs(events).filter((e) => e.venueSlug === venueSlug);
}
