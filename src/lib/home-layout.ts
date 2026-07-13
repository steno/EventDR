import { localDateISO } from "@/lib/event-dates";
import type { Event, Venue } from "@/lib/types";
import { SEED_VENUES } from "@/lib/venues-seed";
import {
  getEventDurationMinutes,
  getEventLiveStatus,
  happensOnLocalDate,
  isEventActiveToday,
  isMultiDayEvent,
  isRecurringEvent,
  parseEventTimeWindow,
} from "@/lib/event-status";
import type { TimeRange } from "@/lib/filters";

/** Max cards in the home "Happening today" carousel. */
export const HOME_TODAY_LIMIT = 5;

/** Max events in the home "Our picks" section. */
export const HOME_PICKS_LIMIT = 10;

/** Default preview cap for city, category, venue, and when listing pages. */
export const SCOPE_LIST_LIMIT = HOME_PICKS_LIMIT;

/** Max venues in the home "Popular venues" strip. */
export const HOME_VENUE_LIMIT = 6;

function todayHighlightSortRank(event: Event): number {
  const status = getEventLiveStatus(event);
  if (status === "live") return 0;
  if (status === "upcoming") return 1;
  if (status === "closedToday") return 2;
  return 3;
}

function todayHighlightKindRank(event: Event): number {
  if (isRecurringEvent(event)) return 2;
  if (isMultiDayEvent(event)) return 1;
  return 0;
}

function compareTodayHighlights(a: Event, b: Event): number {
  const kindA = todayHighlightKindRank(a);
  const kindB = todayHighlightKindRank(b);
  if (kindA !== kindB) return kindA - kindB;

  const rankA = todayHighlightSortRank(a);
  const rankB = todayHighlightSortRank(b);
  if (rankA !== rankB) return rankA - rankB;

  const trendingA = a.trending ? 0 : 1;
  const trendingB = b.trending ? 0 : 1;
  if (trendingA !== trendingB) return trendingA - trendingB;

  const durationA = getEventDurationMinutes(a.time);
  const durationB = getEventDurationMinutes(b.time);
  if (durationA !== durationB) return durationA - durationB;

  const startA = parseEventTimeWindow(a.time)?.start ?? 0;
  const startB = parseEventTimeWindow(b.time)?.start ?? 0;
  return startA - startB;
}

function todayHighlightTierKey(event: Event): string {
  return `${todayHighlightKindRank(event)}:${todayHighlightSortRank(event)}`;
}

function hashString(seed: string): number {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function seededShuffle<T>(items: T[], seed: string): T[] {
  if (items.length <= 1) return [...items];
  const arr = [...items];
  let state = hashString(seed);
  for (let i = arr.length - 1; i > 0; i--) {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    const j = state % (i + 1);
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/** Preserve priority tiers, shuffle peers so the carousel changes daily. */
function shuffleTodayHighlightsWithinTiers(
  events: Event[],
  daySeed: string,
): Event[] {
  const sorted = [...events].sort(compareTodayHighlights);
  const tierOrder: string[] = [];
  const byTier = new Map<string, Event[]>();

  for (const event of sorted) {
    const tier = todayHighlightTierKey(event);
    if (!byTier.has(tier)) {
      tierOrder.push(tier);
      byTier.set(tier, []);
    }
    byTier.get(tier)!.push(event);
  }

  return tierOrder.flatMap((tier) =>
    seededShuffle(byTier.get(tier)!, `${daySeed}:${tier}`),
  );
}

function venueDedupeKey(event: Event): string {
  return (event.venueSlug ?? event.venue ?? event.location).trim().toLowerCase();
}

/** Prefer one card per venue in the carousel head; fill remaining slots from the pool. */
function pickDiverseCarouselHead(
  events: Event[],
  limit: number,
  daySeed: string,
): Event[] {
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

  const filler = seededShuffle(deferred, `${daySeed}:carousel-fill`);
  for (const event of filler) {
    if (picked.length >= limit) break;
    picked.push(event);
  }

  return picked;
}

/**
 * Events happening today: priority tiers first, daily shuffle within each tier,
 * diverse venue mix in the carousel head.
 */
export function getTodayHighlightEvents(
  events: Event[],
  now: Date = new Date(),
): Event[] {
  const daySeed = localDateISO(now);
  const filtered = events.filter(
    (e) => happensOnLocalDate(e, daySeed) && isEventActiveToday(e, now),
  );
  const shuffled = shuffleTodayHighlightsWithinTiers(filtered, daySeed);
  const carouselHead = pickDiverseCarouselHead(
    shuffled,
    HOME_TODAY_LIMIT,
    daySeed,
  );
  const headIds = new Set(carouselHead.map((e) => e.id));
  const tail = shuffled.filter((e) => !headIds.has(e.id));
  return [...carouselHead, ...tail];
}

/**
 * Dedupe only active carousel highlights from Our picks "All".
 * Closed-for-today and other inactive-today cards stay in the list with their status badge.
 */
export function getTodayHighlightExcludeIds(
  events: Event[],
  limit = HOME_TODAY_LIMIT,
): string[] {
  return getTodayHighlightEvents(events)
    .slice(0, limit)
    .filter((e) => {
      const status = getEventLiveStatus(e);
      return status === "live" || status === "upcoming";
    })
    .map((e) => e.id);
}

export function getFeaturedVenues(
  venues: Venue[],
  limit = HOME_VENUE_LIMIT,
): Venue[] {
  const bySlug = new Map(venues.map((v) => [v.slug, v]));
  return SEED_VENUES.slice(0, limit)
    .map((seed) => bySlug.get(seed.slug))
    .filter((v): v is Venue => v != null);
}

/** Full listing page for the active home time filter (one-shot expand via ?all=1). */
export function homeViewAllPath(
  locale: string,
  timeRange: TimeRange,
): string | undefined {
  if (timeRange === "all") return undefined;
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
