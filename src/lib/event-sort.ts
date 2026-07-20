import type { Event } from "./types";
import { compareEventsBySchedule, eventStartTimeMinutes, localDateISO } from "./event-dates";
import {
  getEventLiveStatus,
  happensOnLocalDate,
  hasEventEndedForToday,
  isEndingSoon,
  isEventActiveToday,
  isMultiDayEvent,
  isRecurringEvent,
  parseEventTimeWindow,
} from "./event-status";

/**
 * Lower rank = higher in the list.
 * Live first, then ending soon, then not-yet-started; ended-today sink last.
 */
const LIST_TIER = {
  live: 0,
  endingSoon: 1,
  upcomingToday: 2,
  closedToday: 3,
  activeTodayUnknown: 4,
  future: 5,
  endedToday: 6,
  past: 7,
} as const;

export interface SortEventsForDisplayOptions {
  /** Deprioritize recurring events among future peers on the same day (not when live today). */
  recurringLast?: boolean;
  /**
   * Within the same status tier, prefer one-time fixtures, then multi-day,
   * then recurring — after time/schedule (does not float future one-offs above live/today).
   */
  oneTimeFirst?: boolean;
  now?: Date;
}

/**
 * One-time fixtures before multi-day festivals, then recurring —
 * preserves prior status/time order within each kind.
 * Prefer `sortEventsForDisplay({ oneTimeFirst: true })` so status tiers stay primary.
 */
export function prioritizeOneTimeEvents(events: Event[]): Event[] {
  if (events.length < 2) return events;
  const order = new Map(events.map((event, index) => [event.id, index]));
  return [...events].sort((a, b) => {
    const kindDiff = oneTimeKindRank(a) - oneTimeKindRank(b);
    if (kindDiff !== 0) return kindDiff;
    return (order.get(a.id) ?? 0) - (order.get(b.id) ?? 0);
  });
}

function oneTimeKindRank(event: Event): number {
  if (isRecurringEvent(event)) return 2;
  if (isMultiDayEvent(event)) return 1;
  return 0;
}

function eventEndTimeMinutes(time: string | undefined): number {
  const window = parseEventTimeWindow(time);
  if (!window) return Number.MAX_SAFE_INTEGER;
  return window.end;
}

/** Explicit start–end ranges (dining hours, shows) vs a single kickoff time. */
function hasExplicitTimeRange(time: string | undefined): boolean {
  if (!time) return false;
  const clockTimes = [...time.matchAll(/(\d{1,2})(?::(\d{2}))?\s*(AM|PM)/gi)];
  return clockTimes.length >= 2;
}

function listTier(event: Event, now: Date): number {
  const today = localDateISO(now);
  const onToday = happensOnLocalDate(event, today);

  if (onToday && hasEventEndedForToday(event, now)) {
    return LIST_TIER.endedToday;
  }

  if (onToday && isEventActiveToday(event, now)) {
    if (isEndingSoon(event, now)) return LIST_TIER.endingSoon;
    const status = getEventLiveStatus(event, now);
    if (status === "live") return LIST_TIER.live;
    if (status === "upcoming") return LIST_TIER.upcomingToday;
    if (status === "closedToday") return LIST_TIER.closedToday;
    return LIST_TIER.activeTodayUnknown;
  }

  const end = (event.endDate ?? event.date).trim();
  if (end >= today) return LIST_TIER.future;

  return LIST_TIER.past;
}

function isActiveToday(event: Event, now: Date): boolean {
  return (
    happensOnLocalDate(event, localDateISO(now)) && isEventActiveToday(event, now)
  );
}

/** Status-aware list order: live, then ending soon, then starts soon; ended today last. */
export function sortEventsForDisplay(
  events: Event[],
  options: SortEventsForDisplayOptions = {},
): Event[] {
  if (events.length < 2) return events.length === 1 ? [...events] : [];

  const now = options.now ?? new Date();
  const recurringLast = options.recurringLast === true;
  const oneTimeFirst = options.oneTimeFirst === true;

  // Precompute sort keys once — listTier/time parsing is expensive in comparators.
  const keyed = events.map((event) => ({
    event,
    tier: listTier(event, now),
    start: eventStartTimeMinutes(event.time),
    end: eventEndTimeMinutes(event.time),
    hasRange: hasExplicitTimeRange(event.time),
    recurring: isRecurringEvent(event),
    kind: oneTimeKindRank(event),
    activeToday: isActiveToday(event, now),
  }));

  keyed.sort((a, b) => {
    if (a.tier !== b.tier) return a.tier - b.tier;

    if (
      recurringLast &&
      a.tier === LIST_TIER.future &&
      a.event.date === b.event.date &&
      !a.activeToday &&
      !b.activeToday
    ) {
      const recurrenceDiff = Number(a.recurring) - Number(b.recurring);
      if (recurrenceDiff !== 0) return recurrenceDiff;
    }

    const tier = a.tier;
    if (tier === LIST_TIER.endingSoon) {
      const endDiff = a.end - b.end;
      if (endDiff !== 0) return endDiff;
    }

    if (
      tier === LIST_TIER.endingSoon ||
      tier === LIST_TIER.live ||
      tier === LIST_TIER.upcomingToday ||
      tier === LIST_TIER.closedToday ||
      tier === LIST_TIER.activeTodayUnknown
    ) {
      if (tier === LIST_TIER.upcomingToday || tier === LIST_TIER.live) {
        const rangeDiff = Number(a.hasRange) - Number(b.hasRange);
        if (rangeDiff !== 0) return rangeDiff;
      }
      const startDiff = a.start - b.start;
      if (startDiff !== 0) return startDiff;
    }

    if (tier === LIST_TIER.future || tier === LIST_TIER.past) {
      const scheduleDiff = compareEventsBySchedule(a.event, b.event);
      if (scheduleDiff !== 0) return scheduleDiff;
    }

    // After schedule/time within the same tier — never across live vs future.
    if (oneTimeFirst && a.kind !== b.kind) return a.kind - b.kind;

    if (a.event.trending && !b.event.trending) return -1;
    if (!a.event.trending && b.event.trending) return 1;

    return a.event.title.localeCompare(b.event.title);
  });

  return keyed.map((row) => row.event);
}
