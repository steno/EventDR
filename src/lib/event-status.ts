import type { Event } from "./types";
import { APP_TIMEZONE, localDateISO } from "./event-dates";

/** Minutes from midnight (0–1439). */
export type EventTimeWindow = { start: number; end: number };

export type EventLiveStatus = "upcoming" | "live" | "ended" | "unknown";

const DEFAULT_DURATION_MINUTES = 120;

function currentMinutes(now: Date): number {
  const formatted = new Intl.DateTimeFormat("en-GB", {
    timeZone: APP_TIMEZONE,
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).format(now);
  const [hours, minutes] = formatted.split(":").map(Number);
  return hours * 60 + minutes;
}

function eventStartISO(event: Pick<Event, "date">): string | null {
  const start = event.date?.trim();
  return start || null;
}

function eventEndISO(event: Pick<Event, "date" | "endDate">): string | null {
  const end = (event.endDate ?? event.date)?.trim();
  return end || null;
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
  return { start, end };
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
  const start = eventStartISO(event);
  const end = eventEndISO(event);
  if (!start || !end) return false;
  const today = localDateISO(now);
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
 * Live status for the current calendar day in APP_TIMEZONE.
 * Recurring events materialized to today use the same rules.
 */
export function getEventLiveStatus(
  event: Pick<Event, "date" | "endDate" | "time">,
  now: Date = new Date(),
): EventLiveStatus {
  const start = eventStartISO(event);
  const end = eventEndISO(event);
  if (!start || !end) return "unknown";

  const today = localDateISO(now);
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
  // Check if event is currently live
  if (isWithinWindow(nowMin, window)) return "live";
  // Check if event hasn't started yet - must come before hasWindowEnded for overnight events
  if (!hasWindowStarted(nowMin, window)) return "upcoming";
  // Now check if event has ended
  if (hasWindowEnded(nowMin, window)) {
    // Multi-day span still running — today's session closed, not the whole event.
    if (end > today) return "unknown";
    return "ended";
  }
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
  const start = eventStartISO(event);
  const end = eventEndISO(event);
  if (!start || !end) return false;
  return start <= dateISO && end >= dateISO;
}
