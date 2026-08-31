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

export type MapsTravelMode = "walking" | "driving";

function formatLatLng(coords: Pick<EventCoords, "lat" | "lng">): string {
  return `${coords.lat},${coords.lng}`;
}

/**
 * Google Maps multi-stop directions.
 * Closed loops pass the same origin and destination (port → stops → port).
 */
export function getLoopGoogleMapsUrl(
  points: Pick<EventCoords, "lat" | "lng">[],
  travelMode: MapsTravelMode,
): string {
  if (points.length < 2) return "";
  const origin = points[0];
  const destination = points[points.length - 1];
  if (!origin || !destination) return "";

  const params = new URLSearchParams({
    api: "1",
    origin: formatLatLng(origin),
    destination: formatLatLng(destination),
    travelmode: travelMode,
  });
  const via = points.slice(1, -1);
  if (via.length > 0) {
    params.set("waypoints", via.map(formatLatLng).join("|"));
  }
  return `https://www.google.com/maps/dir/?${params.toString()}`;
}

/**
 * Apple Maps directions. Extra `daddr` values are the remaining stops
 * (including the return to the ship on a closed loop).
 */
export function getLoopAppleMapsUrl(
  points: Pick<EventCoords, "lat" | "lng">[],
  travelMode: MapsTravelMode,
): string {
  if (points.length < 2) return "";
  const origin = points[0];
  if (!origin) return "";

  const params = new URLSearchParams();
  params.set("saddr", formatLatLng(origin));
  params.set("dirflg", travelMode === "walking" ? "w" : "d");
  for (const point of points.slice(1)) {
    params.append("daddr", formatLatLng(point));
  }
  return `https://maps.apple.com/?${params.toString()}`;
}

/** OSM embed for a set of points (closed loops included). */
export function osmEmbedUrl(
  points: Pick<EventCoords, "lat" | "lng">[],
): string {
  if (points.length === 0) return "";
  const lats = points.map((point) => point.lat);
  const lngs = points.map((point) => point.lng);
  const pad = 0.004;
  const minLng = Math.min(...lngs) - pad;
  const minLat = Math.min(...lats) - pad;
  const maxLng = Math.max(...lngs) + pad;
  const maxLat = Math.max(...lats) + pad;
  const marker = points[0];
  if (!marker) return "";
  const params = new URLSearchParams({
    bbox: `${minLng},${minLat},${maxLng},${maxLat}`,
    layer: "mapnik",
    marker: `${marker.lat},${marker.lng}`,
  });
  return `https://www.openstreetmap.org/export/embed.html?${params.toString()}`;
}
