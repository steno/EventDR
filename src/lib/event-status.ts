import type { Event } from "./types";
import { localDateISO, parseLocalDate } from "./event-dates";

/** Minutes from midnight (0–1439). */
export type EventTimeWindow = { start: number; end: number };

export type EventLiveStatus = "upcoming" | "live" | "ended" | "unknown";

const DEFAULT_DURATION_MINUTES = 120;

function startOfDay(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

function currentMinutes(now: Date): number {
  return now.getHours() * 60 + now.getMinutes();
}

/** Parse one or two clock times from free-text event.time fields. */
export function parseEventTimeWindow(time?: string): EventTimeWindow | null {
  if (!time) return null;
  const matches = [...time.matchAll(/(\d{1,2})(?::(\d{2}))?\s*(AM|PM)/gi)];
  if (matches.length === 0) return null;

  const times = matches
    .map((match) => {
      let hours = Number(match[1]);
      const minutes = Number(match[2] ?? "0");
      const meridiem = match[3].toUpperCase();
      if (hours < 1 || hours > 12 || minutes < 0 || minutes > 59) return NaN;
      if (meridiem === "PM" && hours !== 12) hours += 12;
      if (meridiem === "AM" && hours === 12) hours = 0;
      return hours * 60 + minutes;
    })
    .filter((value) => Number.isFinite(value));

  if (times.length === 0) return null;

  const start = times[0];
  const end =
    times.length > 1 ? times[times.length - 1] : start + DEFAULT_DURATION_MINUTES;
  return { start, end: Math.max(end, start) };
}

function eventCalendarEnd(event: Pick<Event, "date" | "endDate">): Date | null {
  const end = parseLocalDate(event.endDate ?? event.date);
  return isNaN(end.getTime()) ? null : startOfDay(end);
}

function eventCalendarStart(event: Pick<Event, "date">): Date | null {
  const start = parseLocalDate(event.date);
  return isNaN(start.getTime()) ? null : startOfDay(start);
}

export function isMultiDayEvent(
  event: Pick<Event, "date" | "endDate">,
): boolean {
  return Boolean(event.endDate && event.endDate !== event.date);
}

export function isRecurringEvent(
  event: Pick<Event, "recurrence">,
): boolean {
  return Boolean(event.recurrence);
}

/** Parsed clock span in minutes; unparsed times sort as longest. */
export function getEventDurationMinutes(time?: string): number {
  const window = parseEventTimeWindow(time);
  if (!window) return Number.MAX_SAFE_INTEGER;
  if (window.end < window.start) {
    return 1440 - window.start + window.end;
  }
  return window.end - window.start;
}

export function eventSpansToday(
  event: Pick<Event, "date" | "endDate">,
  now: Date = new Date(),
): boolean {
  const start = eventCalendarStart(event);
  const end = eventCalendarEnd(event);
  if (!start || !end) return false;
  const today = startOfDay(now);
  return start <= today && end >= today;
}

function isWithinWindow(nowMin: number, window: EventTimeWindow): boolean {
  if (window.end < window.start) {
    return nowMin >= window.start || nowMin <= window.end;
  }
  return nowMin >= window.start && nowMin <= window.end;
}

function hasWindowStarted(nowMin: number, window: EventTimeWindow): boolean {
  if (window.end < window.start) {
    return nowMin >= window.start || nowMin <= window.end;
  }
  return nowMin >= window.start;
}

/** Multi-day festivals often use midnight as an all-day placeholder. */
function isMultiDayAllDay(
  event: Pick<Event, "date" | "endDate" | "time">,
): boolean {
  if (!event.endDate || event.endDate === event.date) return false;
  return /^12:00\s*AM$/i.test(event.time?.trim() ?? "");
}

function hasWindowEnded(nowMin: number, window: EventTimeWindow): boolean {
  if (window.end < window.start) {
    return nowMin > window.end && nowMin < window.start;
  }
  return nowMin > window.end;
}

/**
 * Live status for the current calendar day (local time).
 * Recurring events materialized to today use the same rules.
 */
export function getEventLiveStatus(
  event: Pick<Event, "date" | "endDate" | "time">,
  now: Date = new Date(),
): EventLiveStatus {
  const start = eventCalendarStart(event);
  const end = eventCalendarEnd(event);
  if (!start || !end) return "unknown";

  const today = startOfDay(now);
  if (end < today) return "ended";
  if (start > today) return "upcoming";

  if (isMultiDayAllDay(event)) {
    return "live";
  }

  const window = parseEventTimeWindow(event.time);
  if (!window) {
    // Multi-day block still running, or open-ended hours we can't parse.
    if (end > today) return "live";
    return "unknown";
  }

  const nowMin = currentMinutes(now);
  if (hasWindowEnded(nowMin, window)) {
    // Multi-day span still running — today's session closed, not the whole event.
    if (end > today) return "unknown";
    return "ended";
  }
  if (isWithinWindow(nowMin, window)) return "live";
  if (!hasWindowStarted(nowMin, window)) return "upcoming";
  return "unknown";
}

export function hasEventEndedForToday(
  event: Pick<Event, "date" | "endDate" | "time">,
  now: Date = new Date(),
): boolean {
  return getEventLiveStatus(event, now) === "ended";
}

export function isEventActiveToday(
  event: Pick<Event, "date" | "endDate" | "time">,
  now: Date = new Date(),
): boolean {
  if (!eventSpansToday(event, now)) return false;
  return getEventLiveStatus(event, now) !== "ended";
}

export function happensOnLocalDate(
  event: Pick<Event, "date" | "endDate">,
  dateISO: string = localDateISO(),
): boolean {
  const start = eventCalendarStart(event);
  const end = eventCalendarEnd(event);
  const day = parseLocalDate(dateISO);
  if (!start || !end || isNaN(day.getTime())) return false;
  const target = startOfDay(day);
  return start <= target && end >= target;
}
