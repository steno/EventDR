import type { EventCoords } from "@/lib/event-coords";

export type LatLngTuple = [number, number];

export type OsrmProfile = "walking" | "driving";

export interface GeocodeResult extends EventCoords {
  /** Short place label from Nominatim (name or first display_name parts). */
  label: string;
}

export interface RouteLeg {
  distanceM: number;
  durationS: number;
}

export interface RouteResult {
  coords: LatLngTuple[];
  distanceM: number;
  durationS: number;
  legs: RouteLeg[];
}

const OSRM_DRIVING_BASE =
  "https://router.project-osrm.org/route/v1/driving";
/** FOSSGIS foot graph — the public OSRM demo only has car routing. */
const OSRM_WALKING_BASE =
  "https://routing.openstreetmap.de/routed-foot/route/v1/driving";
const OSRM_REVALIDATE_SECONDS = 7 * 24 * 60 * 60;
const OSRM_USER_AGENT = "POP-Events/1.0 (https://pop-event.com)";

function shortenPlaceLabel(displayName: string, name?: string): string {
  const named = name?.trim();
  if (named) return named;
  const parts = displayName
    .split(",")
    .map((p) => p.trim())
    .filter(Boolean);
  return parts.slice(0, 2).join(", ") || displayName;
}

function osrmPath(waypoints: EventCoords[]): string {
  return waypoints.map((point) => `${point.lng},${point.lat}`).join(";");
}

/** Public OSRM / FOSSGIS URL for a walking or driving polyline. */
export function osrmRouteUrl(
  waypoints: EventCoords[],
  profile: OsrmProfile = "driving",
): string {
  const base = profile === "walking" ? OSRM_WALKING_BASE : OSRM_DRIVING_BASE;
  return `${base}/${osrmPath(waypoints)}?overview=full&geometries=geojson`;
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

function parseOsrmRoute(data: {
  code?: string;
  routes?: Array<{
    distance: number;
    duration: number;
    geometry?: { coordinates?: [number, number][] };
    legs?: Array<{ distance: number; duration: number }>;
  }>;
}): RouteResult | null {
  if (data.code && data.code !== "Ok") return null;

  const route = data.routes?.[0];
  const coordinates = route?.geometry?.coordinates;
  if (!route || !coordinates?.length) return null;

  return {
    coords: coordinates.map(([lng, lat]) => [lat, lng] as LatLngTuple),
    distanceM: route.distance,
    durationS: route.duration,
    legs: (route.legs ?? []).map((leg) => ({
      distanceM: leg.distance,
      durationS: leg.duration,
    })),
  };
}

async function fetchOsrmJson(
  url: string,
): Promise<RouteResult | null> {
  const init: RequestInit & { next?: { revalidate: number } } = {
    headers: {
      Accept: "application/json",
      "User-Agent": OSRM_USER_AGENT,
    },
  };
  if (typeof window === "undefined") {
    init.next = { revalidate: OSRM_REVALIDATE_SECONDS };
  }

  const res = await fetch(url, init);
  if (!res.ok) return null;

  return parseOsrmRoute(
    (await res.json()) as {
      code?: string;
      routes?: Array<{
        distance: number;
        duration: number;
        geometry?: { coordinates?: [number, number][] };
        legs?: Array<{ distance: number; duration: number }>;
      }>;
    },
  );
}

/** Walking or driving route via OSM OSRM (multi-waypoint). */
export async function fetchOsrmRoute(
  waypoints: EventCoords[],
  profile: OsrmProfile = "driving",
): Promise<RouteResult | null> {
  if (waypoints.length < 2) return null;
  if (
    waypoints.some(
      (point) => !Number.isFinite(point.lat) || !Number.isFinite(point.lng),
    )
  ) {
    return null;
  }

  try {
    return await fetchOsrmJson(osrmRouteUrl(waypoints, profile));
  } catch {
    return null;
  }
}

/** Driving route via public OSRM demo (no API key). */
export async function fetchDrivingRoute(
  origin: EventCoords,
  destination: EventCoords,
): Promise<RouteResult | null> {
  return fetchOsrmRoute([origin, destination], "driving");
}
