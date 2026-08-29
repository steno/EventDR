import type { Locale } from "@/i18n/config";
import { haversineMeters } from "@/lib/distance";
import { resolveEventCoords } from "@/lib/event-coords";
import type { Event } from "@/lib/types";

/**
 * Curated walkable nightlife / day-out strips on the North Coast.
 * Membership is editorial (venue slugs) — not a trip planner.
 */
export type WalkablePocketSlug =
  | "el-batey"
  | "cabarete-bay"
  | "kite-encuentro"
  | "malecon-pp"
  | "playa-dorada"
  | "costambar-beach"
  | "cofresi-beach";

export interface WalkablePocket {
  slug: WalkablePocketSlug;
  /** Soft walk radius for non-member venues near the pocket centroid. */
  radiusMeters: number;
  /** Guest tip — parking is advisory, not inventory. */
  parkOnce: boolean;
  names: Record<Locale, string>;
  /** Short label under place lines. */
  stripLabels: Record<Locale, string>;
  venueSlugs: readonly string[];
  /** Approximate center for radius fallback. */
  lat: number;
  lng: number;
}

export const WALKABLE_POCKETS: readonly WalkablePocket[] = [
  {
    slug: "el-batey",
    radiusMeters: 700,
    parkOnce: true,
    lat: 19.7668,
    lng: -70.5115,
    names: {
      en: "El Batey",
      es: "El Batey",
      fr: "El Batey",
    },
    stripLabels: {
      en: "Walkable strip",
      es: "Zona peatonal",
      fr: "Quartier piéton",
    },
    venueSlugs: [
      "el-batey-sosua",
      "smileys-bar-sosua",
      "cheers-bar-sosua",
      "finish-line-sosua",
      "hard-rock-sosua",
      "bar-39-sosua",
      "playa-sosua",
      "sosua-jewish-museum",
      "sosua-diving-center",
      "d-classico-sosua",
      "blue-ice-pianobar-sosua",
      "pingui-bar",
      "hotel-voramar-sosua",
      "hms-valeria",
      "el-colibri-hotel",
      "love-does-sosua",
      "waterfront-playa-alicia",
      "flip-flop-sports-bar-sosua",
    ],
  },
  {
    slug: "cabarete-bay",
    radiusMeters: 650,
    parkOnce: true,
    lat: 19.7502,
    lng: -70.4072,
    names: {
      en: "Cabarete Bay",
      es: "Bahía de Cabarete",
      fr: "Baie de Cabarete",
    },
    stripLabels: {
      en: "Walkable strip",
      es: "Zona peatonal",
      fr: "Quartier piéton",
    },
    venueSlugs: [
      "lax-cabarete",
      "liquid-blue-cabarete",
      "la-chabola-cabarete",
      "voyvoy-cabarete",
      "aura-beach-club-cabarete",
      "cowork-cabarete",
      "ocean-one-cabarete",
      "big-lees-beach-bar",
      "zen-fitness-cabarete",
      "la-casita-de-papi",
      "sunset-grill-velero",
    ],
  },
  {
    slug: "kite-encuentro",
    radiusMeters: 900,
    parkOnce: true,
    lat: 19.7685,
    lng: -70.4305,
    names: {
      en: "Kite Beach / Encuentro",
      es: "Kite Beach / Encuentro",
      fr: "Kite Beach / Encuentro",
    },
    stripLabels: {
      en: "Beach pocket",
      es: "Zona de playa",
      fr: "Coin de plage",
    },
    venueSlugs: [
      "kite-beach",
      "playa-encuentro",
      "el-parq-cabarete",
      "el-cocotazo-cafe",
    ],
  },
  {
    slug: "malecon-pp",
    radiusMeters: 800,
    parkOnce: true,
    lat: 19.7968,
    lng: -70.6885,
    names: {
      en: "Puerto Plata Malecón",
      es: "Malecón de Puerto Plata",
      fr: "Malecón de Puerto Plata",
    },
    stripLabels: {
      en: "Walkable waterfront",
      es: "Malecón peatonal",
      fr: "Front de mer piéton",
    },
    venueSlugs: [
      "malecon-puerto-plata",
      "victrola-037",
      "fortaleza-san-felipe",
      "letrero-puerto-plata",
      "plaza-independencia",
      "calle-sombrillas",
      "museo-ambar",
      "casa-de-la-cultura",
      "cigar-town-pop",
      "meclao-rooftop",
      "cremo-cigar-bar",
      "rum-legacy-museum",
      "la-confluencia-museum",
      "gregorio-luperon-museum",
      "handmade-the-brand",
      "disco-club-brugal",
      "macorix-house-of-rum",
      "paseo-dona-blanca",
      "anfiteatro-la-puntilla",
    ],
  },
  {
    slug: "playa-dorada",
    radiusMeters: 900,
    parkOnce: true,
    lat: 19.7705,
    lng: -70.648,
    names: {
      en: "Playa Dorada",
      es: "Playa Dorada",
      fr: "Playa Dorada",
    },
    stripLabels: {
      en: "Resort pocket",
      es: "Zona de resorts",
      fr: "Poche resort",
    },
    venueSlugs: [
      "blue-jacktar-playa-dorada",
      "senor-rock-playa-dorada",
      "playa-dorada-golf",
      "coconut-cove",
      "paella-pop-green-one",
      "kviar-costa-dorada",
      "iberostar-waves-costa-dorada",
      "gran-ventana-beach-resort",
      "paella-pop-el-pueblito",
    ],
  },
  {
    slug: "costambar-beach",
    // Tight radius: El Carey is on the sand; Hotel Ocean Winds is inland
    // on Calle Guayacanes (~350 m) and is not a beach venue.
    radiusMeters: 220,
    parkOnce: true,
    lat: 19.81484,
    lng: -70.71532,
    names: {
      en: "Costambar Beach",
      es: "Playa Costambar",
      fr: "Plage Costambar",
    },
    stripLabels: {
      en: "Beach pocket",
      es: "Zona de playa",
      fr: "Coin de plage",
    },
    venueSlugs: ["playa-costambar", "el-carey-puerto-plata"],
  },
  {
    slug: "cofresi-beach",
    radiusMeters: 700,
    parkOnce: true,
    lat: 19.822,
    lng: -70.73,
    names: {
      en: "Cofresí Beach",
      es: "Playa Cofresí",
      fr: "Plage Cofresí",
    },
    stripLabels: {
      en: "West-coast strip",
      es: "Franja oeste",
      fr: "Bande ouest",
    },
    venueSlugs: [
      "playa-cofresi",
      "don-limon-cofresi",
      "ocean-world",
      "cofresi-palm-beach-spa",
      "vip-beach-lifestyles-resort",
    ],
  },
] as const;

const VENUE_TO_POCKET = new Map<string, WalkablePocket>();
for (const pocket of WALKABLE_POCKETS) {
  for (const slug of pocket.venueSlugs) {
    VENUE_TO_POCKET.set(slug, pocket);
  }
}

export function getPocketBySlug(
  slug: string | undefined | null,
): WalkablePocket | null {
  if (!slug) return null;
  return WALKABLE_POCKETS.find((p) => p.slug === slug) ?? null;
}

export function getPocketForVenueSlug(
  venueSlug: string | undefined | null,
): WalkablePocket | null {
  if (!venueSlug) return null;
  return VENUE_TO_POCKET.get(venueSlug) ?? null;
}

/**
 * Resolve pocket for an event: venue membership first, then radius to a
 * pocket centroid when coords are known (covers Places-geocoded venues).
 */
export function getPocketForEvent(
  event: Pick<
    Event,
    "lat" | "lng" | "venueSlug" | "venue" | "location" | "format"
  >,
): WalkablePocket | null {
  if (event.format === "digital") return null;

  const byVenue = getPocketForVenueSlug(event.venueSlug);
  if (byVenue) return byVenue;

  const coords = resolveEventCoords(event);
  if (!coords) return null;

  let best: WalkablePocket | null = null;
  let bestMeters = Number.POSITIVE_INFINITY;

  for (const pocket of WALKABLE_POCKETS) {
    const meters = haversineMeters(coords, pocket);
    if (meters <= pocket.radiusMeters && meters < bestMeters) {
      best = pocket;
      bestMeters = meters;
    }
  }

  return best;
}

export function pocketDisplayName(
  pocket: WalkablePocket,
  locale: Locale,
): string {
  return pocket.names[locale] ?? pocket.names.en;
}

export function pocketStripLabel(
  pocket: WalkablePocket,
  locale: Locale,
): string {
  return pocket.stripLabels[locale] ?? pocket.stripLabels.en;
}
