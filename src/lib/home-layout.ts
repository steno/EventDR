import { venueMatchesCity, type CitySlug } from "@/lib/cities";
import { APP_TIMEZONE, localDateISO } from "@/lib/event-dates";
import { sortEventsForDisplay } from "@/lib/event-sort";
import type { Event, Venue } from "@/lib/types";
import {
  getEventLiveStatus,
  happensOnLocalDate,
  isEndingSoon,
  isEventActiveToday,
} from "@/lib/event-status";
import type { TimeRange } from "@/lib/filters";
import { findActiveSpecialEvent } from "@/lib/special-events";

/** Re-export for callers that import discovery helpers from home-layout. */
export { prioritizeOneTimeEvents } from "@/lib/event-sort";

/** Max cards in the home "Happening today" section (desktop 3×2). */
export const HOME_TODAY_LIMIT = 6;

/**
 * Max events before "More events" on home picks / scope lists.
 * 12 keeps short first paints. Desktop auto-fit grids then add a few extra
 * cards (`fillCardGridPage`) so the last row is complete before More events.
 */
export const HOME_PICKS_LIMIT = 12;

/** Extra cards revealed per "More events" tap on capped lists. */
export const LIST_PAGE_SIZE = HOME_PICKS_LIMIT;

/** Cap mounted search-result cards (search has no "view all" paginator). */
export const HOME_SEARCH_LIMIT = 30;

/** Stable empty exclude list — avoids busting EventList memo deps each render. */
export const EMPTY_EVENT_IDS: string[] = [];

/** Default preview cap for city, category, venue, and when listing pages. */
export const SCOPE_LIST_LIMIT = HOME_PICKS_LIMIT;

/** Max venue slides per audience slider on home. */
export const HOME_VENUE_LIMIT = 6;

/** Home audience sections — Local favorites vs Visitor faves. */
export type VenueAudienceFilter = "local" | "visitor";

export const VENUE_AUDIENCE_FILTERS: readonly VenueAudienceFilter[] = [
  "local",
  "visitor",
] as const;

/**
 * Curated pools for each audience. Home sliders sample randomly from these
 * (seeded by local calendar day so order is stable for a visit/day).
 * Edit these lists to grow or rebalance Local vs Visitor coverage.
 * A venue may appear in both pools when it serves mixed crowds.
 */
export const VENUE_AUDIENCE_POOLS: Record<
  VenueAudienceFilter,
  readonly string[]
> = {
  local: [
    "d-classico-sosua",
    "disco-club-brugal",
    "anfiteatro-la-puntilla",
    "el-parq-cabarete",
    "parada-tipica-el-choco",
    "blue-jacktar-playa-dorada",
    "malecon-puerto-plata",
    "parque-jose-briceno",
    "plaza-independencia",
    "ground-zero-disco",
    "la-chabola-cabarete",
    "la-casita-de-papi",
    "waterfront-playa-alicia",
    "sunset-grill-velero",
    "rio-martinico",
    "el-carey-puerto-plata",
    "hotel-ocean-winds",
    "cremo-cigar-bar",
    "senor-rock-playa-dorada",
    "casa-de-la-cultura",
    "calle-sombrillas",
    "paseo-dona-blanca",
    "letrero-puerto-plata",
    "paella-pop-el-pueblito",
    "cheers-bar-sosua",
    "smileys-bar-sosua",
    "finish-line-sosua",
    "brugal-rum-center",
    "rum-legacy-museum",
    "macorix-house-of-rum",
    "playa-los-charamicos",
    "meclao-rooftop",
    "kviar-costa-dorada",
    "don-limon-cofresi",
    "los-tres-cocos-cofresi",
  ],
  visitor: [
    "lax-cabarete",
    "kite-beach",
    "voyvoy-cabarete",
    "natura-cabana",
    "hard-rock-sosua",
    "liquid-blue-cabarete",
    "ocean-world",
    "bar-39-sosua",
    "hotel-voramar-sosua",
    "castaways-sosua",
    "playa-sosua",
    "sosua-diving-center",
    "cowork-cabarete",
    "sea-horse-ranch",
    "big-lees-beach-bar",
    "pingui-bar",
    "el-colibri-hotel",
    "fortaleza-san-felipe",
    "letrero-puerto-plata",
    "museo-ambar",
    "charcos-damajagua",
    "teleferico-puerto-plata",
    "cayo-arena",
    "fun-city",
    "monkeyland-puerto-plata",
    "coconut-cove",
    "freestyle-catamaran",
    "outback-adventures",
    "hms-valeria",
    "waterfront-playa-alicia",
    "finca-papirucho",
    "sunset-grill-velero",
    "charco-los-militares",
    "la-rejoya",
    "rio-martinico",
    "playa-dorada-golf",
    "playa-encuentro",
    "sosua-jewish-museum",
    "del-oro-chocolate-factory",
    "hacienda-cufa",
    "playa-cofresi",
    "don-limon-cofresi",
    "los-tres-cocos-cofresi",
    "crazy-lobster-maimon",
    "kviar-costa-dorada",
    "iberostar-waves-costa-dorada",
    "meclao-rooftop",
    "laguna-sov",
    "santa-fe-sov",
    "restaurant-maria-sov",
  ],
};

/** @deprecated Use VENUE_AUDIENCE_POOLS — same curated pools. */
export const FEATURED_VENUE_SLUGS = VENUE_AUDIENCE_POOLS;

/** Simple string → 32-bit seed for daily shuffle. */
function hashSeed(input: string): number {
  let hash = 2166136261;
  for (let i = 0; i < input.length; i++) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

/** Deterministic Fisher–Yates shuffle (does not mutate input). */
export function seededShuffle<T>(items: readonly T[], seed: number): T[] {
  const result = [...items];
  let state = seed || 1;
  for (let i = result.length - 1; i > 0; i--) {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    const j = state % (i + 1);
    const tmp = result[i]!;
    result[i] = result[j]!;
    result[j] = tmp;
  }
  return result;
}

function venueDedupeKey(event: Event): string {
  return (event.venueSlug ?? event.venue ?? event.location).trim().toLowerCase();
}

/**
 * Prefer one card per venue in the grid head; fill remaining slots in
 * existing order so status/time ranking stays intact.
 */
function pickDiverseCarouselHead(events: Event[], limit: number): Event[] {
  if (events.length <= limit) return events;

  const picked: Event[] = [];
  const usedVenues = new Set<string>();
  const deferred: Event[] = [];

  for (const event of events) {
    if (picked.length >= limit) {
      deferred.push(event);
      continue;
    }
    const venueKey = venueDedupeKey(event);
    if (!usedVenues.has(venueKey)) {
      picked.push(event);
      usedVenues.add(venueKey);
    } else {
      deferred.push(event);
    }
  }

  for (const event of deferred) {
    if (picked.length >= limit) break;
    picked.push(event);
  }

  return picked;
}

export interface TodayHighlightOptions {
  now?: Date;
  /**
   * Override peer shuffle seed. Default: 2-hour bucket in APP_TIMEZONE so
   * revisits feel fresh without reshuffling on every render/hydration.
   */
  shuffleSeed?: string | number;
}

/** Local hour 0–23 in the North Coast timezone. */
function localHour(now: Date): number {
  const formatted = new Intl.DateTimeFormat("en-GB", {
    timeZone: APP_TIMEZONE,
    hour: "2-digit",
    hourCycle: "h23",
  }).format(now);
  return Number.parseInt(formatted, 10) || 0;
}

/**
 * Live and upcoming peers rotate; ending-soon stays time-ordered.
 * `null` = leave this event in its sorted position.
 */
function highlightShuffleGroup(
  event: Event,
  now: Date,
): "live" | "upcoming" | null {
  if (isEndingSoon(event, now)) return null;
  const status = getEventLiveStatus(event, now);
  if (status === "live") return "live";
  if (status === "upcoming") return "upcoming";
  return null;
}

/**
 * Shuffle live / upcoming runs after status sort so the home grid rotates
 * without letting soft all-day events bury urgent ones.
 */
function shuffleHighlightPeers(
  events: Event[],
  seed: number,
  now: Date,
): Event[] {
  if (events.length < 2) return events;

  const result: Event[] = [];
  let i = 0;
  let runIndex = 0;
  while (i < events.length) {
    const group = highlightShuffleGroup(events[i]!, now);
    if (group == null) {
      result.push(events[i]!);
      i += 1;
      continue;
    }
    const run: Event[] = [];
    while (
      i < events.length &&
      highlightShuffleGroup(events[i]!, now) === group
    ) {
      run.push(events[i]!);
      i += 1;
    }
    result.push(
      ...seededShuffle(run, hashSeed(`${seed}:${group}:${runIndex}`)),
    );
    runIndex += 1;
  }
  return result;
}

function resolveHighlightShuffleSeed(
  now: Date,
  override?: string | number,
): number {
  if (typeof override === "number") return override >>> 0 || 1;
  if (typeof override === "string") return hashSeed(override);
  const day = localDateISO(now);
  const bucket = Math.floor(localHour(now) / 2);
  return hashSeed(`today-highlights:${day}:${bucket}`);
}

/**
 * Events happening today: one-time before multi-day/recurring, then the same
 * status/time order as lists, with live/upcoming peers rotated and venue
 * diversity in the visible grid head.
 */
export function getTodayHighlightEvents(
  events: Event[],
  options: TodayHighlightOptions = {},
): Event[] {
  const now = options.now ?? new Date();
  const daySeed = localDateISO(now);
  const filtered = events.filter(
    (e) => happensOnLocalDate(e, daySeed) && isEventActiveToday(e, now),
  );
  const sorted = sortEventsForDisplay(filtered, {
    recurringLast: true,
    oneTimeFirst: true,
    now,
  });
  const rotated = shuffleHighlightPeers(
    sorted,
    resolveHighlightShuffleSeed(now, options.shuffleSeed),
    now,
  );
  const carouselHead = pickDiverseCarouselHead(rotated, HOME_TODAY_LIMIT);
  const headIds = new Set(carouselHead.map((e) => e.id));
  const tail = rotated.filter((e) => !headIds.has(e.id));
  return [...carouselHead, ...tail];
}

/**
 * Dedupe only active carousel highlights from Our picks when scoped to today.
 * Closed-for-today and other inactive-today cards stay in the list with their status badge.
 */
export function getTodayHighlightExcludeIds(
  events: Event[],
  limit = HOME_TODAY_LIMIT,
  options: TodayHighlightOptions = {},
): string[] {
  return getTodayHighlightEvents(events, options)
    .slice(0, limit)
    .filter((e) => {
      const status = getEventLiveStatus(e, options.now);
      return status === "live" || status === "upcoming";
    })
    .map((e) => e.id);
}

/**
 * Featured photo for the home hero: prefer an imaged "today" highlight,
 * then any imaged event, then the first today event.
 */
export function getHomeHeroEvent(
  events: Event[],
  options: TodayHighlightOptions = {},
): Event | null {
  return getHomeDiscoverLayout(events, options).heroEvent;
}

export interface HomeDiscoverLayout {
  heroEvent: Event | null;
  /** Today highlights already sorted (full list, not sliced). */
  todayEvents: Event[];
  /** IDs to hide from Our picks (active today carousel + hero). */
  picksExcludeIds: string[];
  /** Hero only — for the today grid. */
  heroExcludeIds: string[];
}

/**
 * One filter+sort pass for home hero, today grid, and picks dedupe.
 */
export function getHomeDiscoverLayout(
  events: Event[],
  options: TodayHighlightOptions = {},
): HomeDiscoverLayout {
  if (events.length === 0) {
    return {
      heroEvent: null,
      todayEvents: [],
      picksExcludeIds: EMPTY_EVENT_IDS,
      heroExcludeIds: EMPTY_EVENT_IDS,
    };
  }

  const todayEvents = getTodayHighlightEvents(events, options);
  const specialHero = findActiveSpecialEvent(events, {
    placement: "home-hero",
    now: options.now,
  });
  const todayWithImage = todayEvents.find((e) => Boolean(e.imageUrl?.trim()));
  const anyWithImage = events.find((e) => Boolean(e.imageUrl?.trim()));
  const heroEvent =
    specialHero ??
    todayWithImage ??
    anyWithImage ??
    todayEvents[0] ??
    events[0] ??
    null;

  const picksExcludeIds = todayEvents
    .slice(0, HOME_TODAY_LIMIT)
    .filter((e) => {
      const status = getEventLiveStatus(e, options.now);
      return status === "live" || status === "upcoming";
    })
    .map((e) => e.id);

  if (heroEvent && !picksExcludeIds.includes(heroEvent.id)) {
    picksExcludeIds.push(heroEvent.id);
  }

  return {
    heroEvent,
    todayEvents,
    picksExcludeIds,
    heroExcludeIds: heroEvent ? [heroEvent.id] : EMPTY_EVENT_IDS,
  };
}

export interface FeaturedVenuesOptions {
  /**
   * Shuffle seed. Defaults to today's local date so each audience pool
   * rotates daily without reshuffling on every render.
   */
  seed?: string;
  /** When set, only include venues that match this home city. */
  citySlug?: CitySlug | null;
}

/**
 * Resolve up to `limit` venues from the curated audience pool.
 * Order is a seeded shuffle of the pool (not fixed ranking).
 */
export function getFeaturedVenues(
  venues: Venue[],
  audience: VenueAudienceFilter = "local",
  limit = HOME_VENUE_LIMIT,
  options: FeaturedVenuesOptions = {},
): Venue[] {
  const bySlug = new Map(venues.map((v) => [v.slug, v]));
  // SSR `getVenues` already merges seed + remote — don't pull the full seed
  // module into the home client graph for offline fill-ins.
  const citySlug = options.citySlug ?? null;
  const resolved = VENUE_AUDIENCE_POOLS[audience]
    .map((slug) => bySlug.get(slug))
    .filter((v): v is Venue => v != null)
    .filter((v) => (citySlug ? venueMatchesCity(v, citySlug) : true));

  const seedKey = options.seed ?? localDateISO();
  const areaKey = citySlug ?? "all";
  return seededShuffle(
    resolved,
    hashSeed(`${audience}:${areaKey}:${seedKey}`),
  ).slice(0, limit);
}

/** Full listing page for the active home time filter (one-shot expand via ?all=1). */
export function homeViewAllPath(
  locale: string,
  timeRange: TimeRange,
  citySlug?: string | null,
): string | undefined {
  if (timeRange === "all") {
    // Home already lifts its cap on All; city lists open on the All chip.
    return citySlug
      ? `/${locale}/city/${citySlug}?when=all&all=1`
      : undefined;
  }
  if (timeRange === "today") return `/${locale}/when/today?all=1`;
  if (timeRange === "tomorrow") return `/${locale}/when/tomorrow?all=1`;
  if (timeRange === "weekend") return `/${locale}/when/weekend?all=1`;
  return undefined;
}

export function isScopeInitiallyExpanded(
  all: string | string[] | undefined,
): boolean {
  if (Array.isArray(all)) return all[0] === "1";
  return all === "1";
}
