import type { Event, EventRecurrence } from "./types";

const NORTH_COAST_RE =
  /puerto plata|sosúa|sosua|cabarete|costambar|playa dorada|costa norte|north coast/i;

const OFF_REGION_RE =
  /cotui|cotuí|\bmao\b|santiago|cibao|santo domingo|la vega|san francisco de macor[ií]s|santo domingo/i;

/** North Coast events use Atlantic Standard Time (no DST). */
export const APP_TIMEZONE = "America/Santo_Domingo";

/** UTC noon anchor for zone-less YYYY-MM-DD strings (matches format-date.ts). */
function calendarUTC(dateStr: string): Date | null {
  const [y, m, d] = dateStr.split("-").map(Number);
  if (!y || !m || !d) return null;
  return new Date(Date.UTC(y, m - 1, d, 12));
}

/** Weekday 0=Sun … 6=Sat for a calendar date string. */
export function weekdayFromISO(dateStr: string): number {
  const utc = calendarUTC(dateStr);
  return utc ? utc.getUTCDay() : NaN;
}

export function addDaysISO(dateStr: string, days: number): string {
  const utc = calendarUTC(dateStr);
  if (!utc) return dateStr;
  utc.setUTCDate(utc.getUTCDate() + days);
  return utc.toISOString().slice(0, 10);
}

function nextWeekdayISO(fromISO: string, targetDay: number): string {
  const fromDay = weekdayFromISO(fromISO);
  if (!Number.isFinite(fromDay)) return fromISO;
  const diff = (targetDay - fromDay + 7) % 7;
  return addDaysISO(fromISO, diff);
}

function nextFromWeekdaysISO(fromISO: string, days: number[]): string {
  return days
    .map((day) => nextWeekdayISO(fromISO, day))
    .sort()[0]!;
}

/** YYYY-MM-DD in the app region (never use toISOString for calendar dates). */
export function localDateISO(d: Date = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: APP_TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(d);
}

export function parseLocalDate(dateStr: string): Date {
  const [y, m, d] = dateStr.split("-").map(Number);
  if (!y || !m || !d) return new Date(NaN);
  return new Date(y, m - 1, d);
}

export function parseFlexibleEventDate(dateStr: string): Date | null {
  const iso = parseLocalDate(dateStr);
  if (!isNaN(iso.getTime())) return iso;

  const parsed = new Date(dateStr);
  return isNaN(parsed.getTime()) ? null : parsed;
}

/** Keep ingest/crawl events that are local and within the next N days. */
export function filterNorthCoastUpcomingEvents(
  events: Event[],
  now: Date = new Date(),
  maxDays = 90,
): Event[] {
  const today = localDateISO(now);
  const max = addDaysISO(today, maxDays);

  return events.filter((event) => {
    const haystack = `${event.title} ${event.description} ${event.location} ${event.address ?? ""} ${event.venue ?? ""}`;
    if (OFF_REGION_RE.test(haystack)) return false;
    if (!NORTH_COAST_RE.test(haystack)) return false;

    const eventDay = event.date.trim();
    if (!calendarUTC(eventDay)) return false;

    return eventDay >= today && eventDay <= max;
  });
}

function parseTimeMinutes(time: string | undefined): number | null {
  if (!time) return null;
  const matches = [...time.matchAll(/(\d{1,2})(?::(\d{2}))?\s*(AM|PM)/gi)];
  const match = matches.at(-1);
  if (!match) return null;

  let hours = Number(match[1]);
  const minutes = Number(match[2] ?? "0");
  const meridiem = match[3].toUpperCase();
  if (hours < 1 || hours > 12 || minutes < 0 || minutes > 59) return null;
  if (meridiem === "PM" && hours !== 12) hours += 12;
  if (meridiem === "AM" && hours === 12) hours = 0;
  return hours * 60 + minutes;
}

export function eventStartTimeMinutes(time: string | undefined): number {
  return parseTimeMinutes(time) ?? Number.MAX_SAFE_INTEGER;
}

function compareSortValues(a: number, b: number): number {
  const normalizedA = Number.isFinite(a) ? a : Number.MAX_SAFE_INTEGER;
  const normalizedB = Number.isFinite(b) ? b : Number.MAX_SAFE_INTEGER;
  if (normalizedA === normalizedB) return 0;
  return normalizedA < normalizedB ? -1 : 1;
}

/** Chronological order: date, start time, trending, title. */
export function compareEventsBySchedule(a: Event, b: Event): number {
  const dateDiff = a.date.localeCompare(b.date);
  if (dateDiff !== 0) return dateDiff;

  const timeDiff = compareSortValues(
    eventStartTimeMinutes(a.time),
    eventStartTimeMinutes(b.time),
  );
  if (timeDiff !== 0) return timeDiff;

  if (a.trending && !b.trending) return -1;
  if (!a.trending && b.trending) return 1;

  return a.title.localeCompare(b.title);
}

interface SortUpcomingEventsOptions {
  recurringLast?: boolean;
}

function recurringRank(event: Event): number {
  return event.recurrence ? 1 : 0;
}

export function sortUpcomingEvents(
  events: Event[],
  options: SortUpcomingEventsOptions = {},
): Event[] {
  return [...events].sort((a, b) => {
    if (options.recurringLast) {
      const recurrenceDiff = recurringRank(a) - recurringRank(b);
      if (recurrenceDiff !== 0) return recurrenceDiff;
    }

    return compareEventsBySchedule(a, b);
  });
}

function recurringSeriesEnded(
  event: Pick<Event, "endDate">,
  now: Date,
): boolean {
  if (!event.endDate) return false;
  return localDateISO(now) > event.endDate;
}

function recurringOccurrenceIsValid(
  event: Pick<Event, "endDate">,
  occurrenceISO: string,
): boolean {
  if (!event.endDate) return true;
  return occurrenceISO <= event.endDate;
}

function weeklyDays(event: {
  recurrenceDay?: number;
  recurrenceDays?: number[];
}): number[] {
  const days = event.recurrenceDays?.length
    ? event.recurrenceDays
    : event.recurrenceDay != null
      ? [event.recurrenceDay]
      : [];
  return [...new Set(days)].filter((day) => day >= 0 && day <= 6);
}

function nextWeeklyOccurrenceISO(
  fromISO: string,
  event: { recurrenceDay?: number; recurrenceDays?: number[] },
): string | null {
  const days = weeklyDays(event);
  if (days.length === 0) return null;

  return days
    .map((day) => nextWeekdayISO(fromISO, day))
    .sort()[0]!;
}

function oneOffIsActive(event: Event, now: Date): boolean {
  const end = event.endDate ?? event.date;
  return localDateISO(now) <= end;
}

/**
 * Sets display dates for recurring events and removes expired one-off events.
 * Calendar math uses ISO strings in APP_TIMEZONE — never the host system clock day.
 */
export function materializeEventDates(
  events: Event[],
  now: Date = new Date(),
): Event[] {
  const today = localDateISO(now);

  return events.flatMap((event) => {
    if (event.recurrence === "daily") {
      if (recurringSeriesEnded(event, now)) return [];
      return [{ ...event, date: today }];
    }
    if (event.recurrence === "weekdays") {
      if (recurringSeriesEnded(event, now)) return [];
      const next = nextFromWeekdaysISO(today, [1, 2, 3, 4, 5]);
      if (!recurringOccurrenceIsValid(event, next)) return [];
      return [{ ...event, date: next }];
    }
    if (event.recurrence === "weekends") {
      if (recurringSeriesEnded(event, now)) return [];
      const next = nextFromWeekdaysISO(today, [6, 0]);
      if (!recurringOccurrenceIsValid(event, next)) return [];
      return [{ ...event, date: next }];
    }
    if (event.recurrence === "weekly") {
      if (recurringSeriesEnded(event, now)) return [];
      const next = nextWeeklyOccurrenceISO(today, event);
      if (!next || !recurringOccurrenceIsValid(event, next)) return [];
      return [{ ...event, date: next }];
    }
    if (!event.recurrence) {
      return oneOffIsActive(event, now) ? [event] : [];
    }
    return [event];
  });
}

export function eventMatchesRecurrence(
  event: {
    recurrence?: EventRecurrence;
    recurrenceDay?: number;
    recurrenceDays?: number[];
  },
  range: "all" | "today" | "tomorrow" | "weekend",
  now: Date = new Date(),
): boolean {
  if (!event.recurrence) return false;

  const today = localDateISO(now);
  const tomorrow = addDaysISO(today, 1);
  const day = weekdayFromISO(today);
  const tomorrowDay = weekdayFromISO(tomorrow);
  const isWeekend = day === 0 || day === 6;
  const isWeekday = day >= 1 && day <= 5;
  const isTomorrowWeekend = tomorrowDay === 0 || tomorrowDay === 6;
  const isTomorrowWeekday = tomorrowDay >= 1 && tomorrowDay <= 5;

  if (event.recurrence === "daily") {
    return (
      range === "all" ||
      range === "today" ||
      range === "tomorrow" ||
      range === "weekend"
    );
  }

  if (event.recurrence === "weekdays") {
    if (range === "today") return isWeekday;
    if (range === "tomorrow") return isTomorrowWeekday;
    if (range === "weekend") return false;
    return false;
  }

  if (event.recurrence === "weekends") {
    if (range === "today") return isWeekend;
    if (range === "tomorrow") return isTomorrowWeekend;
    if (range === "weekend") return true;
    return false;
  }

  if (event.recurrence === "weekly") {
    const targets = weeklyDays(event);
    if (targets.length === 0) return false;
    if (range === "today") return targets.includes(day);
    if (range === "tomorrow") return targets.includes(tomorrowDay);
    if (range === "weekend") return targets.some((target) => target === 0 || target === 6);
    return false;
  }

  return false;
}
