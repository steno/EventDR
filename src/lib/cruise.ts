import type { Locale } from "@/i18n/config";
import { eventMatchesCity } from "@/lib/cities";
import {
  driveMinutesFromMeters,
  haversineMeters,
  walkMinutesFromMeters,
} from "@/lib/distance";
import { resolveEventCoords } from "@/lib/event-coords";
import { APP_TIMEZONE, localDateISO } from "@/lib/event-dates";
import { venueDetailPath } from "@/lib/event-navigation";
import {
  happensOnLocalDate,
  isEventActiveToday,
  parseEventTimeWindow,
} from "@/lib/event-status";
import type { Event, EventCategory, Venue } from "@/lib/types";
import { getPocketForEvent, type WalkablePocketSlug } from "@/lib/walkable-pockets";

export type CruisePortSlug = "taino-bay" | "amber-cove";

export type CruiseFit =
  | "walk"
  | "short-taxi"
  | "tight"
  | "too-far"
  | "too-late"
  | "too-long"
  | "too-late-night"
  | "ship-excursion";

export type CruisePort = {
  slug: CruisePortSlug;
  lat: number;
  lng: number;
  /** Typical last-call onto the ship (minutes from midnight). */
  defaultAllAboardMinutes: number;
  /** Minutes before all-aboard to be at the terminal. */
  leaveBufferMinutes: number;
  walkablePockets: readonly WalkablePocketSlug[];
  /**
   * Nearby place photo that reads as this terminal (Fortaleza + ship in the
   * bay; Cofresí shore beside Amber Cove). Used by the cruise port switcher.
   */
  heroVenueSlug: string;
};

/** Taino Bay sits beside Fortaleza; Amber Cove is the Maimón private port. */
export const CRUISE_PORTS: Record<CruisePortSlug, CruisePort> = {
  "taino-bay": {
    slug: "taino-bay",
    lat: 19.8054,
    lng: -70.6965,
    defaultAllAboardMinutes: 16 * 60 + 30,
    leaveBufferMinutes: 75,
    walkablePockets: ["malecon-pp"],
    heroVenueSlug: "fortaleza-san-felipe",
  },
  "amber-cove": {
    slug: "amber-cove",
    lat: 19.8278,
    lng: -70.7417,
    defaultAllAboardMinutes: 16 * 60 + 30,
    leaveBufferMinutes: 90,
    walkablePockets: ["cofresi-beach"],
    heroVenueSlug: "playa-cofresi",
  },
};

export const CRUISE_PORT_SLUGS: CruisePortSlug[] = ["taino-bay", "amber-cove"];

export const ALL_ABOARD_PRESETS = [
  15 * 60,
  15 * 60 + 30,
  16 * 60,
  16 * 60 + 30,
  17 * 60,
  17 * 60 + 30,
  18 * 60,
] as const;

export const DEFAULT_ALL_ABOARD_MINUTES = CRUISE_PORTS["taino-bay"].defaultAllAboardMinutes;

const ROAD_FACTOR = 1.35;
const WALK_MAX_MINUTES = 18;
const TAXI_PAD_LONG_MINUTES = 8;
const TAXI_PAD_SHORT_MINUTES = 2;
const LONG_TAXI_METERS = 2000;
const TOO_FAR_DRIVE_MINUTES: Record<CruisePortSlug, number> = {
  "taino-bay": 12,
  "amber-cove": 32,
};
const TIGHT_SLACK_MINUTES = 25;
const ALL_DAY_WINDOW_MINUTES = 4 * 60;

/** DIY-unfriendly: sold on the ship, or a half-day commitment. */
const SHIP_EXCURSION_SLUGS = new Set<string>([
  "charcos-damajagua",
  "cayo-arena",
  "monkeyland-puerto-plata",
  "coconut-cove",
  "freestyle-catamaran",
  "outback-adventures",
  "hacienda-cufa",
  "jamao-al-norte",
  "rio-martinico",
  "finca-papirucho",
  "teleferico-puerto-plata",
]);

const NIGHT_CATEGORIES = new Set<EventCategory>(["parties", "dance"]);

/** Typical stay — not the attraction’s opening hours. */
const VISIT_MINUTES_BY_SLUG: Record<string, number> = {
  "fortaleza-san-felipe": 30,
  "letrero-puerto-plata": 15,
  "malecon-puerto-plata": 45,
  "plaza-independencia": 25,
  "calle-sombrillas": 30,
  "museo-ambar": 45,
  "casa-de-la-cultura": 40,
  "cigar-town-pop": 30,
  "rum-legacy-museum": 45,
  "la-confluencia-museum": 40,
  "gregorio-luperon-museum": 40,
  "handmade-the-brand": 20,
  "macorix-house-of-rum": 40,
  "paseo-dona-blanca": 20,
  "anfiteatro-la-puntilla": 75,
  "victrola-037": 50,
  "meclao-rooftop": 60,
  "cremo-cigar-bar": 45,
  "disco-club-brugal": 45,
  "brugal-rum-center": 45,
  "ocean-world": 150,
  "playa-cofresi": 75,
  "don-limon-cofresi": 70,
  "los-tres-cocos-cofresi": 70,
  "cofresi-palm-beach-spa": 90,
  "crazy-lobster-maimon": 75,
  "paella-pop-el-pueblito": 60,
  "fun-city": 90,
  "playa-dorada-golf": 120,
  "blue-jacktar-playa-dorada": 60,
  "senor-rock-playa-dorada": 60,
  "coconut-cove": 180,
  "playa-costambar": 60,
  "el-carey-puerto-plata": 60,
  "del-oro-chocolate-factory": 45,
};

const DEFAULT_VISIT_BY_CATEGORY: Record<EventCategory, number> = {
  culture: 45,
  "food-drinks": 60,
  adventure: 90,
  sports: 75,
  performances: 75,
  music: 75,
  concert: 90,
  festivals: 90,
  "health-wellness": 60,
  business: 45,
  parties: 90,
  dance: 90,
};

export type CruiseItineraryId =
  | "taino-walk"
  | "taino-culture"
  | "amber-local"
  | "amber-centro";

export type CruiseItinerary = {
  id: CruiseItineraryId;
  port: CruisePortSlug;
  /** Inclusive loop time including walking between stops. */
  typicalMinutes: number;
  /** Extra taxi minutes from the port (Centro from Amber Cove). */
  taxiMinutes: number;
  stopSlugs: readonly string[];
};

export const CRUISE_ITINERARIES: readonly CruiseItinerary[] = [
  {
    id: "taino-walk",
    port: "taino-bay",
    typicalMinutes: 180,
    taxiMinutes: 0,
    stopSlugs: [
      "fortaleza-san-felipe",
      "letrero-puerto-plata",
      "calle-sombrillas",
      "museo-ambar",
    ],
  },
  {
    id: "taino-culture",
    port: "taino-bay",
    typicalMinutes: 120,
    taxiMinutes: 0,
    stopSlugs: [
      "rum-legacy-museum",
      "cigar-town-pop",
      "plaza-independencia",
    ],
  },
  {
    id: "amber-local",
    port: "amber-cove",
    typicalMinutes: 150,
    taxiMinutes: 12,
    stopSlugs: [
      "crazy-lobster-maimon",
      "ocean-world",
      "playa-cofresi",
    ],
  },
  {
    id: "amber-centro",
    port: "amber-cove",
    typicalMinutes: 210,
    taxiMinutes: 50,
    stopSlugs: [
      "fortaleza-san-felipe",
      "calle-sombrillas",
      "museo-ambar",
    ],
  },
];

export function isCruisePortSlug(value: string | null | undefined): value is CruisePortSlug {
  return value === "taino-bay" || value === "amber-cove";
}

export function cruisePath(
  locale: Locale,
  port: CruisePortSlug,
  allAboardMinutes?: number,
): string {
  const base = `/${locale}/cruise/${port}`;
  if (
    allAboardMinutes == null ||
    allAboardMinutes === DEFAULT_ALL_ABOARD_MINUTES
  ) {
    return base;
  }
  return `${base}?allAboard=${formatAllAboardParam(allAboardMinutes)}`;
}

export function parseAllAboardMinutes(
  value: string | null | undefined,
  fallback = DEFAULT_ALL_ABOARD_MINUTES,
): number {
  if (!value?.trim()) return fallback;
  const raw = value.trim();

  const hm = raw.match(/^(\d{1,2})[:.](\d{2})$/);
  if (hm) {
    const hours = Number(hm[1]);
    const minutes = Number(hm[2]);
    if (hours >= 0 && hours <= 23 && minutes >= 0 && minutes <= 59) {
      return hours * 60 + minutes;
    }
  }

  const compact = raw.match(/^(\d{2})(\d{2})$/);
  if (compact) {
    const hours = Number(compact[1]);
    const minutes = Number(compact[2]);
    if (hours >= 0 && hours <= 23 && minutes >= 0 && minutes <= 59) {
      return hours * 60 + minutes;
    }
  }

  const window = parseEventTimeWindow(raw);
  if (window) return window.start;

  return fallback;
}

export function formatAllAboardParam(minutes: number): string {
  const clamped = clampMinutes(minutes);
  const hours = Math.floor(clamped / 60);
  const mins = clamped % 60;
  return `${String(hours).padStart(2, "0")}:${String(mins).padStart(2, "0")}`;
}

export function formatClockMinutes(minutes: number, locale: Locale): string {
  const clamped = clampMinutes(minutes);
  const hours24 = Math.floor(clamped / 60);
  const mins = clamped % 60;
  if (locale === "en") {
    const meridiem = hours24 >= 12 ? "PM" : "AM";
    const hours12 = hours24 % 12 || 12;
    return `${hours12}:${String(mins).padStart(2, "0")} ${meridiem}`;
  }
  return `${String(hours24).padStart(2, "0")}:${String(mins).padStart(2, "0")}`;
}

export function localMinutesOfDay(now: Date = new Date()): number {
  const formatted = new Intl.DateTimeFormat("en-GB", {
    timeZone: APP_TIMEZONE,
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).format(now);
  const [hours, minutes] = formatted.split(":").map(Number);
  return (hours || 0) * 60 + (minutes || 0);
}

export function leaveByMinutes(port: CruisePort, allAboardMinutes: number): number {
  return Math.max(0, clampMinutes(allAboardMinutes) - port.leaveBufferMinutes);
}

export function minutesUntil(targetMinutes: number, now: Date = new Date()): number {
  return targetMinutes - localMinutesOfDay(now);
}

export type CruiseDayPhase = "open" | "leave-now" | "sailed";

/** `sailed` = past the chosen return time; `leave-now` = still before it, but past leave-by. */
export function cruiseDayPhase(
  port: CruisePort,
  allAboardMinutes: number,
  now: Date = new Date(),
): CruiseDayPhase {
  if (minutesUntil(clampMinutes(allAboardMinutes), now) <= 0) return "sailed";
  if (minutesUntil(leaveByMinutes(port, allAboardMinutes), now) <= 0) {
    return "leave-now";
  }
  return "open";
}

/** Same calendar day at `hour`:00 in America/Santo_Domingo (no DST). */
export function atLocalHour(now: Date, hour: number): Date {
  const day = localDateISO(now);
  const utcHour = hour + 4; // AST is UTC−4 year-round
  return new Date(`${day}T${String(utcHour).padStart(2, "0")}:00:00.000Z`);
}

function clampMinutes(minutes: number): number {
  if (!Number.isFinite(minutes)) return DEFAULT_ALL_ABOARD_MINUTES;
  return Math.min(23 * 60 + 59, Math.max(0, Math.round(minutes)));
}

export type CruiseTravel = {
  meters: number;
  walkMinutes: number;
  driveMinutes: number;
  kind: "walk" | "taxi";
};

export function cruiseTravelFromPort(
  port: CruisePort,
  coords: { lat: number; lng: number },
): CruiseTravel {
  const roadMeters = haversineMeters(port, coords) * ROAD_FACTOR;
  const walkMinutes = walkMinutesFromMeters(roadMeters);
  const driveMinutes =
    driveMinutesFromMeters(roadMeters) +
    (roadMeters > LONG_TAXI_METERS ? TAXI_PAD_LONG_MINUTES : TAXI_PAD_SHORT_MINUTES);
  if (walkMinutes <= WALK_MAX_MINUTES) {
    return { meters: roadMeters, walkMinutes, driveMinutes, kind: "walk" };
  }
  return { meters: roadMeters, walkMinutes, driveMinutes, kind: "taxi" };
}

export function getCruiseVisitMinutes(
  event: Pick<Event, "venueSlug" | "category" | "time">,
): number {
  if (event.venueSlug && VISIT_MINUTES_BY_SLUG[event.venueSlug]) {
    return VISIT_MINUTES_BY_SLUG[event.venueSlug]!;
  }
  const window = parseEventTimeWindow(event.time);
  if (window) {
    const span =
      window.end >= window.start
        ? window.end - window.start
        : 1440 - window.start + window.end;
    if (span >= 20 && span < ALL_DAY_WINDOW_MINUTES) {
      return Math.min(span, 75);
    }
  }
  return DEFAULT_VISIT_BY_CATEGORY[event.category] ?? 60;
}

export type CruiseRankedEvent = {
  event: Event;
  fit: CruiseFit;
  travel: CruiseTravel | null;
  visitMinutes: number;
  neededMinutes: number;
  /** Minutes after this stop to still make leave-by (negative = over). */
  slackMinutes: number;
};

function isNightlifeTooLate(
  event: Event,
  leaveBy: number,
): boolean {
  const window = parseEventTimeWindow(event.time);
  if (window && window.start >= 17 * 60) return true;
  if (window && window.start >= leaveBy - 30) return true;
  if (NIGHT_CATEGORIES.has(event.category) && (!window || window.start >= 16 * 60)) {
    return true;
  }
  return false;
}

function classifyCruiseEvent(
  event: Event,
  port: CruisePort,
  leaveBy: number,
  nowMinutes: number,
): CruiseRankedEvent {
  const visitMinutes = getCruiseVisitMinutes(event);
  const coords = resolveEventCoords(event);
  const travel = coords ? cruiseTravelFromPort(port, coords) : null;
  const pocket = getPocketForEvent(event);
  const inWalkablePocket = Boolean(
    pocket && port.walkablePockets.includes(pocket.slug),
  );

  const travelMinutes = travel
    ? travel.kind === "walk"
      ? travel.walkMinutes
      : travel.driveMinutes
    : inWalkablePocket
      ? 12
      : 40;

  const window = parseEventTimeWindow(event.time);
  const notOpenYet =
    window && nowMinutes < window.start ? window.start - nowMinutes : 0;
  const outbound = travel?.kind === "walk" ? travel.walkMinutes : travelMinutes;
  const inbound = outbound;
  const neededMinutes = outbound + Math.max(notOpenYet, 0) + visitMinutes + inbound;
  const remaining = leaveBy - nowMinutes;
  const slackMinutes = remaining - neededMinutes;

  let fit: CruiseFit = "walk";

  if (SHIP_EXCURSION_SLUGS.has(event.venueSlug ?? "")) {
    fit = "ship-excursion";
  } else if (isNightlifeTooLate(event, leaveBy)) {
    fit = "too-late-night";
  } else if (window && window.start > leaveBy) {
    fit = "too-late";
  } else if (!coords && !inWalkablePocket) {
    fit = "too-far";
  } else if (
    travel &&
    travel.kind === "taxi" &&
    travel.driveMinutes > TOO_FAR_DRIVE_MINUTES[port.slug]
  ) {
    fit = "too-far";
  } else if (neededMinutes > remaining) {
    fit = "too-long";
  } else if (!travel || travel.kind === "walk") {
    fit = slackMinutes < TIGHT_SLACK_MINUTES ? "tight" : "walk";
  } else if (slackMinutes < TIGHT_SLACK_MINUTES) {
    fit = "tight";
  } else {
    fit = "short-taxi";
  }

  return {
    event,
    fit,
    travel: travel ?? (inWalkablePocket
      ? {
          meters: 800,
          walkMinutes: 12,
          driveMinutes: 5,
          kind: "walk",
        }
      : null),
    visitMinutes,
    neededMinutes,
    slackMinutes,
  };
}

const FIT_RANK: Record<CruiseFit, number> = {
  walk: 0,
  "short-taxi": 1,
  tight: 2,
  "too-long": 3,
  "too-late": 4,
  "too-late-night": 5,
  "too-far": 6,
  "ship-excursion": 7,
};

export const CRUISE_VISIBLE_FITS: ReadonlySet<CruiseFit> = new Set([
  "walk",
  "short-taxi",
  "tight",
]);

export function rankCruiseEvents(
  events: Event[],
  portSlug: CruisePortSlug,
  allAboardMinutes: number,
  now: Date = new Date(),
): CruiseRankedEvent[] {
  const port = CRUISE_PORTS[portSlug];
  const leaveBy = leaveByMinutes(port, allAboardMinutes);
  const nowMinutes = localMinutesOfDay(now);
  const todayIso = localDateISO(now);

  const ranked: CruiseRankedEvent[] = [];
  for (const event of events) {
    if (event.format === "digital") continue;
    if (event.temporarilyClosed) continue;
    if (!eventMatchesCity(event, "puerto-plata")) continue;
    if (!happensOnLocalDate(event, todayIso)) continue;
    if (!isEventActiveToday(event, now)) continue;
    ranked.push(classifyCruiseEvent(event, port, leaveBy, nowMinutes));
  }

  ranked.sort((a, b) => {
    const fitDelta = FIT_RANK[a.fit] - FIT_RANK[b.fit];
    if (fitDelta !== 0) return fitDelta;
    const aTravel =
      a.travel?.kind === "walk"
        ? a.travel.walkMinutes
        : (a.travel?.driveMinutes ?? 99);
    const bTravel =
      b.travel?.kind === "walk"
        ? b.travel.walkMinutes
        : (b.travel?.driveMinutes ?? 99);
    if (aTravel !== bTravel) return aTravel - bTravel;
    return a.visitMinutes - b.visitMinutes;
  });

  return ranked;
}

export function visibleCruiseEvents(
  ranked: CruiseRankedEvent[],
): CruiseRankedEvent[] {
  return ranked.filter((item) => CRUISE_VISIBLE_FITS.has(item.fit));
}

export function itinerariesForPort(
  port: CruisePortSlug,
  allAboardMinutes: number,
  now: Date = new Date(),
): CruiseItinerary[] {
  const meta = CRUISE_PORTS[port];
  const remaining = minutesUntil(leaveByMinutes(meta, allAboardMinutes), now);
  return CRUISE_ITINERARIES.filter((loop) => {
    if (loop.port !== port) return false;
    if (remaining <= 0) return false;
    if (loop.id === "amber-centro") return remaining >= 210;
    return loop.typicalMinutes + loop.taxiMinutes <= remaining + TIGHT_SLACK_MINUTES;
  });
}

/** Venue slugs that belong on this port’s “near here” rail — not a taxi into Centro. */
export function cruiseVenueAllowlist(port: CruisePortSlug): string[] {
  const slugs = new Set<string>();
  for (const loop of CRUISE_ITINERARIES) {
    if (loop.port !== port) continue;
    if (loop.taxiMinutes > 15) continue;
    for (const slug of loop.stopSlugs) slugs.add(slug);
  }
  if (port === "taino-bay") {
    for (const slug of [
      "malecon-puerto-plata",
      "plaza-independencia",
      "casa-de-la-cultura",
      "paseo-dona-blanca",
      "brugal-rum-center",
      "macorix-house-of-rum",
      "victrola-037",
    ]) {
      slugs.add(slug);
    }
  } else {
    for (const slug of [
      "playa-cofresi",
      "don-limon-cofresi",
      "los-tres-cocos-cofresi",
    ]) {
      slugs.add(slug);
    }
  }
  return [...slugs];
}

export type CruiseStopLink = {
  slug: string;
  name: string;
  href: string;
};

export function resolveItineraryStops(
  itinerary: CruiseItinerary,
  locale: Locale,
  events: Event[],
  venues: Venue[],
): CruiseStopLink[] {
  const bySlug = new Map(venues.map((venue) => [venue.slug, venue]));
  return itinerary.stopSlugs.flatMap((slug) => {
    const venue = bySlug.get(slug);
    const live = events.find((event) => event.venueSlug === slug);
    const name = venue?.name ?? live?.venue ?? slug;
    const href = live
      ? `/${locale}/event/${live.id}`
      : venueDetailPath(locale, slug);
    return [{ slug, name, href }];
  });
}

export function cruiseHeroEvent(ranked: CruiseRankedEvent[]): Event | null {
  const visible = visibleCruiseEvents(ranked);
  return (
    visible.find((item) => Boolean(item.event.imageUrl?.trim()))?.event ??
    visible[0]?.event ??
    null
  );
}
