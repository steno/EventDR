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

export function haversineKm(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number,
): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

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

export function attachDistances(
  events: Event[],
  userLat: number,
  userLng: number,
): Event[] {
  return events.map((e) => {
    const coords = resolveEventCoords(e);
    const distanceKm = coords
      ? haversineKm(userLat, userLng, coords.lat, coords.lng)
      : Infinity;
    return { ...e, distanceKm };
  });
}

export function sortByDistance(
  events: Event[],
  userLat: number,
  userLng: number,
): Event[] {
  return attachDistances(events, userLat, userLng)
    .sort((a, b) => (a.distanceKm ?? Infinity) - (b.distanceKm ?? Infinity));
}

export function formatDistance(km: number, locale: string): string {
  if (!isFinite(km)) return "";
  if (km < 1) {
    const m = Math.round(km * 1000);
    return locale === "es" ? `${m} m` : locale === "fr" ? `${m} m` : `${m}m`;
  }
  return `${km.toFixed(1)} km`;
}
