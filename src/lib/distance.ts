/** Earth-mean radius (meters) for haversine. */
const EARTH_RADIUS_M = 6_371_000;

/** Typical flat-ground walking speed used for guest-facing ETAs. */
const WALK_METERS_PER_MINUTE = 80;

export type LatLng = { lat: number; lng: number };

function toRad(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

/** Great-circle distance in meters between two WGS84 points. */
export function haversineMeters(a: LatLng, b: LatLng): number {
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);

  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;

  return 2 * EARTH_RADIUS_M * Math.asin(Math.min(1, Math.sqrt(h)));
}

/** Guest-facing walk ETA — never claim 0 minutes for a distinct pin. */
export function walkMinutesFromMeters(meters: number): number {
  if (!Number.isFinite(meters) || meters <= 0) return 1;
  return Math.max(1, Math.round(meters / WALK_METERS_PER_MINUTE));
}
