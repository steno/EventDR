import type { EventCategory } from "@/lib/types";
import type { CitySlug } from "@/lib/cities";
import type { Locale } from "@/i18n/config";
import { NORTH_COAST_CENTER } from "@/lib/event-coords";
import { localePath } from "@/lib/seo";

/** Mid–North Coast view covering Puerto Plata → Sosúa → Cabarete. */
export const MAP_DEFAULT_CENTER = {
  lat: 19.76,
  lng: -70.55,
} as const;

export const MAP_DEFAULT_ZOOM = 11.2;
/** Phone portrait — pull back so PP → Sosúa → Cabarete fits the short viewport. */
export const MAP_DEFAULT_ZOOM_MOBILE = 10.2;
/**
 * At or below this zoom, zooming out clears the open card / selection.
 * Anchored to desktop default so mobile’s wider start still counts as overview.
 */
export const MAP_OVERVIEW_ZOOM_MAX = MAP_DEFAULT_ZOOM + 1.25;

/** Initial / “North Coast” camera zoom for the current viewport width. */
export function resolveDefaultMapZoom(widthPx?: number): number {
  const w =
    widthPx ??
    (typeof window !== "undefined" ? window.innerWidth : 1024);
  return w < 640 ? MAP_DEFAULT_ZOOM_MOBILE : MAP_DEFAULT_ZOOM;
}
/** Street-level pitch when a pin is selected (3D buildings + labels). */
export const MAP_PIN_ZOOM = 17.2;
/** Town overview when picking an area from the map header. */
export const MAP_AREA_ZOOM = 13.6;
/**
 * @deprecated Thumbs now lazy-load for in-viewport pins after map idle
 * (see NorthCoastMapView). Kept only if an older bundle still imports it.
 */
export const MAP_PIN_THUMB_ZOOM_DELTA = 0.2;
export const MAP_DEFAULT_PITCH = 55;
export const MAP_DEFAULT_BEARING = -28;

export type MapAreaId = "north-coast" | CitySlug;

export type MapCameraTarget = {
  lat: number;
  lng: number;
  zoom: number;
};

/** Header area select → fly-to targets. */
export const MAP_AREAS: Record<MapAreaId, MapCameraTarget> = {
  "north-coast": {
    lat: MAP_DEFAULT_CENTER.lat,
    lng: MAP_DEFAULT_CENTER.lng,
    // Overridden at fly-time via resolveDefaultMapZoom on narrow screens.
    zoom: MAP_DEFAULT_ZOOM,
  },
  "puerto-plata": {
    lat: 19.7976623,
    lng: -70.6932862,
    zoom: MAP_AREA_ZOOM,
  },
  sosua: {
    lat: 19.7572211,
    lng: -70.5171504,
    zoom: 14,
  },
  cabarete: {
    lat: 19.7502745,
    lng: -70.4073077,
    zoom: 14,
  },
};

export const MAP_AREA_IDS: MapAreaId[] = [
  "north-coast",
  "puerto-plata",
  "sosua",
  "cabarete",
];

/**
 * Free pitched 3D basemap (OpenFreeMap Liberty — extruded buildings).
 * Mapbox Standard needs `mapbox-gl` + a token; this trial uses MapLibre so
 * localhost works without billing. Swap the style URL later if you add Mapbox.
 */
export const MAPLIBRE_3D_STYLE_URL =
  "https://tiles.openfreemap.org/styles/liberty";

export function resolveMapStyleUrl(): string {
  return (
    process.env.NEXT_PUBLIC_MAP_STYLE_URL?.trim() || MAPLIBRE_3D_STYLE_URL
  );
}

/** Pin fill colors by category — readable on pitched 3D buildings. */
export const CATEGORY_PIN_COLORS: Record<EventCategory, string> = {
  music: "#e11d48",
  business: "#52525b",
  concert: "#ea580c",
  parties: "#c026d3",
  "food-drinks": "#d97706",
  festivals: "#dc2626",
  dance: "#db2777",
  "health-wellness": "#059669",
  performances: "#7c3aed",
  sports: "#65a30d",
  culture: "#ca8a04",
  adventure: "#0284c8",
};

export function pinColorForCategory(category: EventCategory): string {
  return CATEGORY_PIN_COLORS[category] ?? "#f43f5e";
}

type MapLabelApi = {
  getStyle: () => { layers?: Array<{ id: string; type: string }> } | undefined;
  // MapLibre keys are typed unions — widen so we can walk every symbol layer.
  getLayoutProperty: (layerId: string, name: "text-field" | "text-size") => unknown;
  setLayoutProperty: (
    layerId: string,
    name: "text-size",
    value: unknown,
  ) => unknown;
  getPaintProperty: (layerId: string, name: "text-halo-width") => unknown;
  setPaintProperty: (
    layerId: string,
    name: "text-halo-color" | "text-halo-blur" | "text-halo-width",
    value: unknown,
  ) => unknown;
};

/**
 * Bump symbol label size + halo so street names stay readable when pitched
 * in at pin zoom (~17). Safe to call after `style.load`.
 */
export function enhanceMapLabelLegibility(map: MapLabelApi): void {
  const layers = map.getStyle()?.layers;
  if (!layers) return;

  for (const layer of layers) {
    if (layer.type !== "symbol") continue;
    const { id } = layer;

    let textField: unknown;
    try {
      textField = map.getLayoutProperty(id, "text-field");
    } catch {
      continue;
    }
    if (textField == null || textField === "") continue;

    // Only scale constant sizes — OpenFreeMap already uses zoom expressions,
    // and nesting ["zoom"] inside ["*", size, …] throws (Next issues overlay).
    const size = map.getLayoutProperty(id, "text-size") ?? 12;
    if (typeof size === "number") {
      map.setLayoutProperty(id, "text-size", [
        "interpolate",
        ["linear"],
        ["zoom"],
        12,
        size * 1.05,
        15,
        size * 1.28,
        17,
        size * 1.55,
        19,
        size * 1.75,
      ]);
    }

    map.setPaintProperty(id, "text-halo-color", "rgba(255,255,255,0.95)");
    map.setPaintProperty(id, "text-halo-blur", 0.25);

    const halo = map.getPaintProperty(id, "text-halo-width");
    const haloBase = typeof halo === "number" ? Math.max(halo, 1) : 1.15;
    map.setPaintProperty(id, "text-halo-width", [
      "interpolate",
      ["linear"],
      ["zoom"],
      13,
      haloBase,
      16,
      haloBase + 0.6,
      18,
      haloBase + 1.1,
    ]);
  }
}

export { NORTH_COAST_CENTER };

/** North Coast events map — optional `venue` deep-link zooms that pin on load. */
export function eventsMapPath(
  locale: Locale,
  opts?: { venue?: string | null },
): string {
  const base = localePath(locale, "/map");
  const slug = opts?.venue?.trim();
  if (!slug) return base;
  return `${base}?venue=${encodeURIComponent(slug)}`;
}
