import { localDateISO } from "@/lib/event-dates";
import type { Event, Venue } from "@/lib/types";
import { SEED_VENUES } from "@/lib/venues-seed";
import {
  getEventLiveStatus,
  happensOnLocalDate,
  isEndingSoon,
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

const STATUS_TIER_ORDER = [0, 1, 2, 3, 4] as const;

/** Ending soon → starts soon → live → closed today → other. */
function todayHighlightStatusRank(event: Event, now: Date): number {
  const status = getEventLiveStatus(event, now);
  if (status === "live" && isEndingSoon(event, now)) return 0;
  if (status === "upcoming") return 1;
  if (status === "live") return 2;
  if (status === "closedToday") return 3;
  return 4;
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

/** Upcoming before live; shuffle within each status tier. */
function shuffleTodayHighlightsWithinTiers(
  events: Event[],
  shuffleSeed: string,
  now: Date,
): Event[] {
  const byStatus = new Map<number, Event[]>();

  for (const event of events) {
    const rank = todayHighlightStatusRank(event, now);
    const group = byStatus.get(rank) ?? [];
    group.push(event);
    byStatus.set(rank, group);
  }

  return STATUS_TIER_ORDER.filter((rank) => byStatus.has(rank)).flatMap(
    (rank) =>
      seededShuffle(byStatus.get(rank)!, `${shuffleSeed}:status-${rank}`),
  );
}

function venueDedupeKey(event: Event): string {
  return (event.venueSlug ?? event.venue ?? event.location).trim().toLowerCase();
}

/** Prefer one card per venue in the carousel head; fill remaining slots from the pool. */
function pickDiverseCarouselHead(
  events: Event[],
  limit: number,
  shuffleSeed: string,
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

  const filler = seededShuffle(deferred, `${shuffleSeed}:carousel-fill`);
  for (const event of filler) {
    if (picked.length >= limit) break;
    picked.push(event);
  }

  return picked;
}

export interface TodayHighlightOptions {
  now?: Date;
  /** Per-session seed from useTodayHighlightShuffleSeed — new order each visit. */
  sessionSeed?: string;
}

/**
 * Events happening today: starts soon before live, shuffle within each status band,
 * diverse venue mix in the carousel head.
 */
export function getTodayHighlightEvents(
  events: Event[],
  options: TodayHighlightOptions = {},
): Event[] {
  const now = options.now ?? new Date();
  const daySeed = localDateISO(now);
  const shuffleSeed = options.sessionSeed
    ? `${daySeed}:${options.sessionSeed}`
    : daySeed;
  const filtered = events.filter(
    (e) => happensOnLocalDate(e, daySeed) && isEventActiveToday(e, now),
  );
  const shuffled = shuffleTodayHighlightsWithinTiers(
    filtered,
    shuffleSeed,
    now,
  );
  const carouselHead = pickDiverseCarouselHead(
    shuffled,
    HOME_TODAY_LIMIT,
    shuffleSeed,
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
  options: TodayHighlightOptions = {},
): string[] {
  return getTodayHighlightEvents(events, options)
    .slice(0, limit)
    .filter((e) => {
      const status = getEventLiveStatus(e);
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
