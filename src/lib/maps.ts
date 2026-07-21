import type { Event, Venue } from "./types";
import type { EventCoords } from "./event-coords";
import { resolveEventCoords } from "./event-coords";
import { eventDirectionsQuery } from "./event-location";

/** Single OSM tile URL for a muted click-to-load map preview (no Leaflet). */
export function osmTilePreviewUrl(
  lat: number,
  lng: number,
  zoom = 13,
): string {
  const n = 2 ** zoom;
  const x = Math.floor(((lng + 180) / 360) * n);
  const latRad = (lat * Math.PI) / 180;
  const y = Math.floor(
    ((1 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) / 2) * n,
  );
  return `https://tile.openstreetmap.org/${zoom}/${x}/${y}.png`;
}

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
  return getMapPinUrl(venue, venue.name);
}

/** Google Maps place pin at coordinates (optional label for a richer search result). */
export function getMapPinUrl(
  coords: Pick<EventCoords, "lat" | "lng">,
  label?: string,
): string {
  const query = label?.trim()
    ? `${label.trim()} ${coords.lat},${coords.lng}`
    : `${coords.lat},${coords.lng}`;
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

/**
 * Google Maps Street View already aimed at a pin (no API key / no billing).
 * Opens the nearest panorama when Google has coverage near that point.
 * Prefer in-app Street View when coverage is known; this URL can be empty if none exists.
 */
export function getStreetViewUrl(coords: Pick<EventCoords, "lat" | "lng">): string {
  const params = new URLSearchParams({
    api: "1",
    map_action: "pano",
    viewpoint: `${coords.lat},${coords.lng}`,
  });
  return `https://www.google.com/maps/@?${params.toString()}`;
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
