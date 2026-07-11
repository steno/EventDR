import type { Event, Venue } from "@/lib/types";
import { SEED_VENUES } from "@/lib/venues-seed";
import {
  getEventLiveStatus,
  happensOnLocalDate,
  isEventActiveToday,
  parseEventTimeWindow,
} from "@/lib/event-status";
import type { TimeRange } from "@/lib/filters";

/** Max cards in the home "Happening today" carousel. */
export const HOME_TODAY_LIMIT = 5;

/** Max events in the home "Our picks" section. */
export const HOME_PICKS_LIMIT = 10;

/** Max venues in the home "Popular venues" strip. */
export const HOME_VENUE_LIMIT = 6;

function todayHighlightSortRank(event: Event): number {
  const status = getEventLiveStatus(event);
  if (status === "live") return 0;
  if (status === "upcoming") return 1;
  return 2;
}

function compareTodayHighlights(a: Event, b: Event): number {
  const rankA = todayHighlightSortRank(a);
  const rankB = todayHighlightSortRank(b);
  if (rankA !== rankB) return rankA - rankB;

  const startA = parseEventTimeWindow(a.time)?.start ?? 0;
  const startB = parseEventTimeWindow(b.time)?.start ?? 0;
  return startA - startB;
}

/** Events happening today, sorted live → upcoming → ended, soonest first. */
export function getTodayHighlightEvents(events: Event[]): Event[] {
  return events
    .filter((e) => happensOnLocalDate(e) && isEventActiveToday(e))
    .sort(compareTodayHighlights);
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

/** Full listing page for the active home time filter. */
export function homeViewAllPath(locale: string, timeRange: TimeRange): string {
  if (timeRange === "today") return `/${locale}/when/today`;
  if (timeRange === "weekend") return `/${locale}/when/weekend`;
  return `/${locale}/when/week`;
}
