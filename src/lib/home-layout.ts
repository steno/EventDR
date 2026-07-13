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

/** Events happening today: one-time first, then live/upcoming within each tier, trending & shorter next. */
export function getTodayHighlightEvents(events: Event[]): Event[] {
  return events
    .filter((e) => happensOnLocalDate(e) && isEventActiveToday(e))
    .sort(compareTodayHighlights);
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
