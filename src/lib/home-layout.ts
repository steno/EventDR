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

/** Max venues per audience tab in the home venues strip. */
export const HOME_VENUE_LIMIT = 6;

/** Home strip tabs — Local favorites vs Visitor faves. */
export type VenueAudienceFilter = "local" | "visitor";

export const VENUE_AUDIENCE_FILTERS: readonly VenueAudienceFilter[] = [
  "local",
  "visitor",
] as const;

/**
 * Curated venue order for each audience. Mixed spots can appear in both.
 * Resolve against live/seed venue maps in getFeaturedVenues.
 */
export const FEATURED_VENUE_SLUGS: Record<
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
  ],
};

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
 * Events happening today: same status/time order as lists (live, then ends
 * soon, then starts soon), with venue diversity only in the visible grid head.
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

export function getFeaturedVenues(
  venues: Venue[],
  audience: VenueAudienceFilter = "local",
  limit = HOME_VENUE_LIMIT,
): Venue[] {
  const bySlug = new Map(venues.map((v) => [v.slug, v]));
  // Prefer live/seed map rows; fall back to seed defs so tabs stay filled offline.
  const seedBySlug = new Map(SEED_VENUES.map((v) => [v.slug, v]));

  return FEATURED_VENUE_SLUGS[audience]
    .map((slug) => bySlug.get(slug) ?? seedBySlug.get(slug))
    .filter((v): v is Venue => v != null)
    .slice(0, limit);
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
