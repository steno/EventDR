import { localDateISO } from "@/lib/event-dates";
import { sortEventsForDisplay } from "@/lib/event-sort";
import type { Event, Venue } from "@/lib/types";
import { SEED_VENUES } from "@/lib/venues-seed";
import {
  getEventLiveStatus,
  happensOnLocalDate,
  isEventActiveToday,
} from "@/lib/event-status";
import type { TimeRange } from "@/lib/filters";

/** Re-export for callers that import discovery helpers from home-layout. */
export { prioritizeOneTimeEvents } from "@/lib/event-sort";

/** Max cards in the home "Happening today" grid (even count for 2 columns). */
export const HOME_TODAY_LIMIT = 6;

/** Max events in the home "Our picks" section. */
export const HOME_PICKS_LIMIT = 10;

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

/** Max event cards per audience section on home. */
export const HOME_EVENT_AUDIENCE_LIMIT = 4;

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
    "el-carey-puerto-plata",
    "cremo-cigar-bar",
    "senor-rock-playa-dorada",
    "casa-de-la-cultura",
    "calle-sombrillas",
    "paseo-dona-blanca",
    "paella-pop-el-pueblito",
    "cheers-bar-sosua",
    "smileys-bar-sosua",
    "finish-line-sosua",
    "brugal-rum-center",
    "rum-legacy-museum",
    "macorix-house-of-rum",
    "playa-los-charamicos",
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
    "playa-dorada-golf",
    "playa-encuentro",
    "sosua-jewish-museum",
    "del-oro-chocolate-factory",
    "hacienda-cufa",
  ],
};

/** @deprecated Use VENUE_AUDIENCE_POOLS — same curated pools. */
export const FEATURED_VENUE_SLUGS = VENUE_AUDIENCE_POOLS;

/**
 * Curated event pools for each audience. Home displays a random sample from
 * these lists (seeded by local calendar day for stable daily rotation).
 * Edit these lists to add or rebalance Local vs Visitor event coverage.
 * An event may appear in both pools when it appeals to mixed crowds.
 * 
 * NOTE: Only events that are currently active/upcoming will be displayed.
 * The system automatically filters out past events from these pools.
 */
export const EVENT_AUDIENCE_POOLS: Record<
  VenueAudienceFilter,
  readonly string[]
> = {
  local: [
    // Local nightlife & music
    "batey-salsa-weekly",
    "batey-open-mic-weekly",
    "el-batey-weekend-nightlife",
    "cremo-salsa-friday",
    "cremo-bohemian-wednesday",
    "cremo-karaoke-saturday",
    "d-classico-merengue-nights",
    "el-carey-weekend-nightlife",
    "ojo-latin-night-thursday",
    "ojo-weekend-dj-parties",
    
    // Local food & culture
    "malecon-kiosks-daily",
    "sosua-pedro-clisante-food-nights",
    "parada-tipica-el-choco-tuesday-live",
    "paella-pop-el-pueblito",
    "paella-pop-green-one",
    "hms-valeria-domingo-dominicano",
    
    // Local spots & community
    "el-parq-karaoke-thursday",
    "el-parq-latin-friday",
    "el-parq-live-bands-saturday",
    "paseo-dona-blanca-daily",
    "calle-sombrillas-daily",
    "plaza-independencia-weekend-culture",
    "anfiteatro-la-puntilla-concerts",
    
    // Neighborhood bars & live music
    "smileys-saturday-live",
    "finish-line-live-wednesday",
    "cheers-weekly-live",
    "senor-rock-live-nightly",
    "castaways-classic-rock-wednesday",
    "voramar-friday-live",
    "big-lees-weekend-music",
    "sosua-beach-live-weekends",
    
    // Local sports & recreation
    "sosua-volleyball-weekly",
    
    // Cultural institutions
    "casa-de-la-cultura-exhibitions",
    "rum-legacy-museum-daily",
    "la-confluencia-museum-daily",
    "gregorio-luperon-museum",
    
    // Coworking & networking (local expats & residents)
    "cowork-weekdays",
    "north-coast-networking-saturday",
    "north-coast-tech-meetup",
  ],
  visitor: [
    // Beach & water sports
    "kite-beach-daily",
    "kite-beach-wind-culture",
    "liquid-blue-sunrise-yoga",
    "liquid-blue-watersports-daily",
    "natura-cabana-yoga-daily",
    "sosua-diving-adventures-daily",
    
    // Popular beach bars & nightlife
    "lax-sunset-daily",
    "lax-reggae-friday",
    "lax-headline-concerts",
    "voyvoy-monday-live-music",
    "hard-rock-weekends",
    "hard-rock-billed-concerts",
    "natura-cabana-saturday-live",
    
    // Tourist attractions & tours
    "ocean-world-daily",
    "charcos-damajagua-daily",
    "fortaleza-san-felipe-daily",
    "teleferico-puerto-plata-daily",
    "cayo-arena-tours-daily",
    "freestyle-catamaran-daily",
    "outback-safari-daily",
    "monkeyland-puerto-plata-daily",
    "coconut-cove-ocean-zipline-daily",
    
    // Museums & cultural experiences
    "museo-ambar-weekdays",
    "museo-ambar-saturday",
    "sosua-jewish-museum-hours",
    
    // Rum & chocolate tours
    "brugal-rum-center-weekdays",
    "brugal-corporate-tours",
    "macorix-house-of-rum",
    "del-oro-chocolate-factory-weekdays",
    "del-oro-chocolate-factory-saturday",
    "hacienda-cufa-cacao-tour",
    
    // Cigar experiences
    "tabacalera-cremo-factory-tour",
    "tabacalera-cremo-rolling-experience",
    "vivonte-cigar-factory-weekdays",
    "vivonte-cigar-factory-saturday",
    
    // Markets & family activities
    "sea-horse-saturday-market",
    "fun-city-daily",
    
    // Dining experiences
    "la-casita-papi-beach-dining",
    "hms-valeria-spanish-saturday",
    
    // Workshops & unique experiences
    "ingest-make-authentic-espadrilles-in-puerto-plata",
  ],
};

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
}

/**
 * Events happening today: one-time before multi-day/recurring, then the same
 * status/time order as lists, with venue diversity in the visible grid head.
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
  const carouselHead = pickDiverseCarouselHead(sorted, HOME_TODAY_LIMIT);
  const headIds = new Set(carouselHead.map((e) => e.id));
  const tail = sorted.filter((e) => !headIds.has(e.id));
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
  const todayWithImage = todayEvents.find((e) => Boolean(e.imageUrl?.trim()));
  const anyWithImage = events.find((e) => Boolean(e.imageUrl?.trim()));
  const heroEvent =
    todayWithImage ?? anyWithImage ?? todayEvents[0] ?? events[0] ?? null;

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
  // Prefer live/seed map rows; fall back to seed defs so tabs stay filled offline.
  const seedBySlug = new Map(SEED_VENUES.map((v) => [v.slug, v]));

  const resolved = VENUE_AUDIENCE_POOLS[audience]
    .map((slug) => bySlug.get(slug) ?? seedBySlug.get(slug))
    .filter((v): v is Venue => v != null);

  const seedKey = options.seed ?? localDateISO();
  return seededShuffle(
    resolved,
    hashSeed(`${audience}:${seedKey}`),
  ).slice(0, limit);
}

export interface FeaturedEventsOptions {
  /**
   * Shuffle seed. Defaults to today's local date so each audience pool
   * rotates daily without reshuffling on every render.
   */
  seed?: string;
  /** Current time for filtering active/upcoming events. */
  now?: Date;
}

/**
 * Resolve up to `limit` events from the curated audience pool.
 * Only returns events that are currently active or upcoming.
 * Order is a seeded shuffle of the pool (not fixed ranking).
 */
export function getFeaturedEvents(
  events: Event[],
  audience: VenueAudienceFilter = "local",
  limit = HOME_EVENT_AUDIENCE_LIMIT,
  options: FeaturedEventsOptions = {},
): Event[] {
  const now = options.now ?? new Date();
  const byId = new Map(events.map((e) => [e.id, e]));

  // Resolve events from the curated pool and filter to only active/upcoming
  const resolved = EVENT_AUDIENCE_POOLS[audience]
    .map((id) => byId.get(id))
    .filter((e): e is Event => {
      if (!e) return false;
      // Only include events that are active today or upcoming
      return isEventActiveToday(e, now);
    });

  const seedKey = options.seed ?? localDateISO();
  return seededShuffle(
    resolved,
    hashSeed(`${audience}:events:${seedKey}`),
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
