import type { Event } from "./types";
import { compareEventsBySchedule, eventStartTimeMinutes, localDateISO } from "./event-dates";
import {
  getEventLiveStatus,
  happensOnLocalDate,
  hasEventEndedForToday,
  isEndingSoon,
  isEventActiveToday,
  isRecurringEvent,
  parseEventTimeWindow,
} from "./event-status";

/**
 * Lower rank = higher in the list.
 * Ending soon, then not-yet-started today, then live; ended-today sink last.
 * Upcoming beats live so users see the next decidable start before open windows.
 */
const LIST_TIER = {
  endingSoon: 0,
  upcomingToday: 1,
  live: 2,
  closedToday: 3,
  activeTodayUnknown: 4,
  future: 5,
  endedToday: 6,
  past: 7,
} as const;

export interface SortEventsForDisplayOptions {
  /** Deprioritize recurring events among future peers on the same day (not when live today). */
  recurringLast?: boolean;
  now?: Date;
}

function eventEndTimeMinutes(time: string | undefined): number {
  const window = parseEventTimeWindow(time);
  if (!window) return Number.MAX_SAFE_INTEGER;
  return window.end;
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

function compareWithinTier(a: Event, b: Event, tier: number, now: Date): number {
  if (tier === LIST_TIER.endingSoon) {
    const endDiff = eventEndTimeMinutes(a.time) - eventEndTimeMinutes(b.time);
    if (endDiff !== 0) return endDiff;
  }

  if (
    tier === LIST_TIER.endingSoon ||
    tier === LIST_TIER.live ||
    tier === LIST_TIER.upcomingToday ||
    tier === LIST_TIER.closedToday ||
    tier === LIST_TIER.activeTodayUnknown
  ) {
    const startDiff =
      eventStartTimeMinutes(a.time) - eventStartTimeMinutes(b.time);
    if (startDiff !== 0) return startDiff;
  }

  if (tier === LIST_TIER.future || tier === LIST_TIER.past) {
    const scheduleDiff = compareEventsBySchedule(a, b);
    if (scheduleDiff !== 0) return scheduleDiff;
  }

  if (a.trending && !b.trending) return -1;
  if (!a.trending && b.trending) return 1;

  return a.title.localeCompare(b.title);
}

function compareEventsForDisplay(
  a: Event,
  b: Event,
  options: SortEventsForDisplayOptions,
): number {
  const now = options.now ?? new Date();
  const tierA = listTier(a, now);
  const tierB = listTier(b, now);
  if (tierA !== tierB) return tierA - tierB;

  if (
    options.recurringLast &&
    tierA === LIST_TIER.future &&
    a.date === b.date &&
    !isActiveToday(a, now) &&
    !isActiveToday(b, now)
  ) {
    const recurrenceDiff = Number(isRecurringEvent(a)) - Number(isRecurringEvent(b));
    if (recurrenceDiff !== 0) return recurrenceDiff;
  }

  return compareWithinTier(a, b, tierA, now);
}

/** Status-aware list order: ending soon, then starts soon, then live; ended today last. */
export function sortEventsForDisplay(
  events: Event[],
  options: SortEventsForDisplayOptions = {},
): Event[] {
  return [...events].sort((a, b) => compareEventsForDisplay(a, b, options));
}
