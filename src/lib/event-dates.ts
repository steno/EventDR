import type { Event, EventRecurrence } from "./types";

const NORTH_COAST_RE =
  /puerto plata|sosúa|sosua|cabarete|costambar|playa dorada|costa norte|north coast/i;

const OFF_REGION_RE =
  /cotui|cotuí|\bmao\b|santiago|cibao|santo domingo|la vega|san francisco de macor[ií]s|santo domingo/i;

/** YYYY-MM-DD in the user's local timezone (never use toISOString for calendar dates). */
export function localDateISO(d: Date = new Date()): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
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
  const today = startOfDay(now);
  const max = new Date(today);
  max.setDate(max.getDate() + maxDays);

  return events.filter((event) => {
    const haystack = `${event.title} ${event.description} ${event.location} ${event.address ?? ""} ${event.venue ?? ""}`;
    if (OFF_REGION_RE.test(haystack)) return false;
    if (!NORTH_COAST_RE.test(haystack)) return false;

    const eventDay = parseFlexibleEventDate(event.date);
    if (!eventDay) return false;

    const day = startOfDay(eventDay);
    return day >= today && day <= max;
  });
}

function startOfDay(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

function parseEventDate(dateStr: string): Date | null {
  const d = parseLocalDate(dateStr);
  return isNaN(d.getTime()) ? null : d;
}

function eventEndDay(event: Pick<Event, "date" | "endDate">): Date | null {
  return parseEventDate(event.endDate ?? event.date);
}

function nextWeekday(from: Date, targetDay: number): Date {
  const d = startOfDay(from);
  const diff = (targetDay - d.getDay() + 7) % 7;
  d.setDate(d.getDate() + diff);
  return d;
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

function nextWeeklyOccurrence(
  from: Date,
  event: { recurrenceDay?: number; recurrenceDays?: number[] },
): Date | null {
  const days = weeklyDays(event);
  if (days.length === 0) return null;

  return days
    .map((day) => nextWeekday(from, day))
    .sort((a, b) => a.getTime() - b.getTime())[0];
}

function nextFromWeekdays(from: Date, days: number[]): Date {
  return days
    .map((day) => nextWeekday(from, day))
    .sort((a, b) => a.getTime() - b.getTime())[0]!;
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

function eventStartTimeMinutes(time: string | undefined): number {
  return parseTimeMinutes(time) ?? Number.MAX_SAFE_INTEGER;
}

function eventDateMs(dateStr: string): number {
  const d = parseEventDate(dateStr);
  return d ? d.getTime() : Number.MAX_SAFE_INTEGER;
}

function compareSortValues(a: number, b: number): number {
  const normalizedA = Number.isFinite(a) ? a : Number.MAX_SAFE_INTEGER;
  const normalizedB = Number.isFinite(b) ? b : Number.MAX_SAFE_INTEGER;
  if (normalizedA === normalizedB) return 0;
  return normalizedA < normalizedB ? -1 : 1;
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

    const dateDiff = compareSortValues(eventDateMs(a.date), eventDateMs(b.date));
    if (dateDiff !== 0) return dateDiff;

    const timeDiff = compareSortValues(
      eventStartTimeMinutes(a.time),
      eventStartTimeMinutes(b.time),
    );
    if (timeDiff !== 0) return timeDiff;

    if (a.trending && !b.trending) return -1;
    if (!a.trending && b.trending) return 1;

    const aDistance = a.distanceKm ?? Infinity;
    const bDistance = b.distanceKm ?? Infinity;
    const distanceDiff = compareSortValues(aDistance, bDistance);
    if (distanceDiff !== 0) return distanceDiff;

    return a.title.localeCompare(b.title);
  });
}

function oneOffIsActive(event: Event, now: Date): boolean {
  const end = eventEndDay(event);
  if (!end) return true;

  const currentDay = startOfDay(now);
  if (end < currentDay) return false;

  return true;
}

/**
 * Sets display dates for recurring events and removes expired one-off events.
 * Always uses local calendar dates (safe on client and server).
 */
export function materializeEventDates(
  events: Event[],
  now: Date = new Date(),
): Event[] {
  const today = localDateISO(now);

  return events.flatMap((event) => {
    if (event.recurrence === "daily") {
      return [{ ...event, date: today }];
    }
    if (event.recurrence === "weekdays") {
      const next = nextFromWeekdays(now, [1, 2, 3, 4, 5]);
      return [{ ...event, date: localDateISO(next) }];
    }
    if (event.recurrence === "weekends") {
      const next = nextFromWeekdays(now, [6, 0]);
      return [{ ...event, date: localDateISO(next) }];
    }
    if (event.recurrence === "weekly") {
      const next = nextWeeklyOccurrence(now, event);
      return next ? [{ ...event, date: localDateISO(next) }] : [];
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
  range: "all" | "today" | "weekend" | "week",
  now: Date = new Date(),
): boolean {
  if (!event.recurrence) return false;

  const day = now.getDay();
  const isWeekend = day === 0 || day === 6;
  const isWeekday = day >= 1 && day <= 5;

  if (event.recurrence === "daily") {
    return range === "all" || range === "today" || range === "week" || range === "weekend";
  }

  if (event.recurrence === "weekdays") {
    if (range === "today") return isWeekday;
    if (range === "weekend") return false;
    if (range === "week") return true;
    return false;
  }

  if (event.recurrence === "weekends") {
    if (range === "today") return isWeekend;
    if (range === "weekend") return true;
    if (range === "week") return true;
    return false;
  }

  if (event.recurrence === "weekly") {
    const targets = weeklyDays(event);
    if (targets.length === 0) return false;
    if (range === "today") return targets.includes(day);
    if (range === "weekend") return targets.some((target) => target === 0 || target === 6);
    if (range === "week") {
      const today = startOfDay(now);
      const weekEnd = new Date(today);
      weekEnd.setDate(today.getDate() + 7);
      const occurrence = nextWeeklyOccurrence(now, event);
      if (!occurrence) return false;
      return occurrence >= today && occurrence <= weekEnd;
    }
    return false;
  }

  return false;
}
