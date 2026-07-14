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

/** Default preview cap for city, category, venue, and when listing pages. */
export const SCOPE_LIST_LIMIT = HOME_PICKS_LIMIT;

/** Max venues in the home "Popular venues" strip. */
export const HOME_VENUE_LIMIT = 6;

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
 * Events happening today: same status/time order as lists (starts soon before
 * live), with venue diversity only in the visible grid head.
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
 * Dedupe only active carousel highlights from Our picks "All".
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
  if (events.length === 0) return null;
  const today = getTodayHighlightEvents(events, options);
  const todayWithImage = today.find((e) => Boolean(e.imageUrl?.trim()));
  if (todayWithImage) return todayWithImage;
  const anyWithImage = events.find((e) => Boolean(e.imageUrl?.trim()));
  if (anyWithImage) return anyWithImage;
  return today[0] ?? events[0] ?? null;
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
