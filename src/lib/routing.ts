import type { EventCoords } from "@/lib/event-coords";

export type LatLngTuple = [number, number];

export interface GeocodeResult extends EventCoords {
  /** Short place label from Nominatim (name or first display_name parts). */
  label: string;
}

interface RouteResult {
  coords: LatLngTuple[];
  distanceM: number;
  durationS: number;
}

function shortenPlaceLabel(displayName: string, name?: string): string {
  const named = name?.trim();
  if (named) return named;
  const parts = displayName
    .split(",")
    .map((p) => p.trim())
    .filter(Boolean);
  return parts.slice(0, 2).join(", ") || displayName;
}

/** Geocode a free-text start point (Nominatim). Biased to Dominican Republic. */
export async function geocodePlace(query: string): Promise<GeocodeResult | null> {
  const trimmed = query.trim();
  if (!trimmed) return null;

  const url = new URL("https://nominatim.openstreetmap.org/search");
  url.searchParams.set("format", "json");
  url.searchParams.set("q", trimmed);
  url.searchParams.set("limit", "1");
  url.searchParams.set("countrycodes", "do");
  // North Coast DR bias (Puerto Plata / Sosúa / Cabarete)
  url.searchParams.set("viewbox", "-71.25,20.05,-70.55,19.55");
  url.searchParams.set("bounded", "0");

  const res = await fetch(url.toString(), {
    headers: { Accept: "application/json" },
  });
  if (!res.ok) return null;

  const data = (await res.json()) as Array<{
    lat: string;
    lon: string;
    name?: string;
    display_name?: string;
  }>;
  const hit = data[0];
  if (!hit) return null;

  const lat = Number(hit.lat);
  const lng = Number(hit.lon);
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;

  const displayName = hit.display_name?.trim() || trimmed;
  return {
    lat,
    lng,
    label: shortenPlaceLabel(displayName, hit.name),
  };
}

/** Driving route via public OSRM demo (no API key). */
export async function fetchDrivingRoute(
  origin: EventCoords,
  destination: EventCoords,
): Promise<RouteResult | null> {
  const path = `${origin.lng},${origin.lat};${destination.lng},${destination.lat}`;
  const url = `https://router.project-osrm.org/route/v1/driving/${path}?overview=full&geometries=geojson`;

  const res = await fetch(url);
  if (!res.ok) return null;

  const data = (await res.json()) as {
    code?: string;
    routes?: Array<{
      distance: number;
      duration: number;
      geometry?: { coordinates?: [number, number][] };
    }>;
  };

  const route = data.routes?.[0];
  const coordinates = route?.geometry?.coordinates;
  if (!route || !coordinates?.length) return null;

  return {
    coords: coordinates.map(([lng, lat]) => [lat, lng] as LatLngTuple),
    distanceM: route.distance,
    durationS: route.duration,
  };
}
