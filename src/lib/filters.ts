import type { EventRecurrence } from "./types";
import {
  addDaysISO,
  eventMatchesRecurrence,
  findRecurringOccurrenceInRange,
  localDateISO,
  weekdayFromISO,
} from "./event-dates";
import { happensOnLocalDate, isEventActiveToday } from "./event-status";

export type TimeRange = "all" | "today" | "tomorrow" | "weekend";

/** Visible time-filter chips (home Our picks defaults to All for upcoming one-offs). */
export type FilterTimeRange = TimeRange;

export const FILTER_TIME_RANGES: FilterTimeRange[] = [
  "all",
  "today",
  "tomorrow",
  "weekend",
];

/** Default chip when a list shows the time filter. */
export const DEFAULT_FILTER_TIME_RANGE: FilterTimeRange = "all";

/** Next time-filter chip after `current` (wraps around). */
export function nextFilterTimeRange(current: FilterTimeRange): FilterTimeRange {
  const idx = FILTER_TIME_RANGES.indexOf(current);
  const next = idx < 0 ? 0 : (idx + 1) % FILTER_TIME_RANGES.length;
  return FILTER_TIME_RANGES[next]!;
}

/**
 * Suggest an unselected time tab. Prefers one that still has matches;
 * otherwise the next chip after `current`.
 */
export function suggestOtherFilterTimeRange(
  current: FilterTimeRange,
  hasMatches?: (range: FilterTimeRange) => boolean,
): FilterTimeRange {
  if (hasMatches) {
    for (const range of FILTER_TIME_RANGES) {
      if (range !== current && hasMatches(range)) return range;
    }
  }
  return nextFilterTimeRange(current);
}

/** Map legacy scroll-state values after filter chip changes. */
export function normalizeTimeRange(value: string): TimeRange {
  if (value === "week") return "all";
  if (
    value === "all" ||
    value === "today" ||
    value === "tomorrow" ||
    value === "weekend"
  ) {
    return value;
  }
  return DEFAULT_FILTER_TIME_RANGE;
}

export function isFilterTimeRange(value: string): value is FilterTimeRange {
  return (
    value === "all" ||
    value === "today" ||
    value === "tomorrow" ||
    value === "weekend"
  );
}

function getWeekendRangeISO(now: Date): { start: string; end: string } {
  const today = localDateISO(now);
  const day = weekdayFromISO(today);

  // Fri–Sat: current weekend. Sun and Mon–Thu: upcoming Sat–Sun.
  if (day === 5) {
    return { start: addDaysISO(today, 1), end: addDaysISO(today, 2) };
  }
  if (day === 6) {
    return { start: today, end: addDaysISO(today, 1) };
  }

  const daysUntilSaturday = (6 - day + 7) % 7;
  const saturday = addDaysISO(today, daysUntilSaturday);
  const sunday = addDaysISO(saturday, 1);
  return { start: saturday, end: sunday };
}

function withDisplayDate<
  T extends { date: string; endDate?: string },
>(item: T, dateIso: string): T {
  // Only shift the occurrence date — keep series endDate for live-status logic.
  return { ...item, date: dateIso };
}

function matchesTimeRange<
  T extends {
    date: string;
    endDate?: string;
    time?: string;
    recurrence?: string;
    recurrenceDay?: number;
    recurrenceDays?: number[];
  },
>(item: T, range: TimeRange, now: Date): T | null {
  const todayIso = localDateISO(now);
  const tomorrowIso = addDaysISO(todayIso, 1);
  const recurrence = item.recurrence as EventRecurrence | undefined;
  const recurringItem = item as {
    recurrence?: EventRecurrence;
    recurrenceDay?: number;
    recurrenceDays?: number[];
  };

  if (range === "today") {
    if (recurrence && eventMatchesRecurrence(recurringItem, "today", now)) {
      return withDisplayDate(item, todayIso);
    }
    return happensOnLocalDate(item, todayIso) && isEventActiveToday(item, now)
      ? item
      : null;
  }

  if (range === "tomorrow") {
    if (recurrence && eventMatchesRecurrence(recurringItem, "tomorrow", now)) {
      return withDisplayDate(item, tomorrowIso);
    }
    return happensOnLocalDate(item, tomorrowIso) ? item : null;
  }

  if (range === "weekend") {
    const { start, end } = getWeekendRangeISO(now);
    const friday = addDaysISO(start, -1);
    const eventStart = item.date.trim();
    const eventEnd = (item.endDate ?? item.date).trim();
    if (!eventStart || !eventEnd) return null;

    if (recurrence && eventMatchesRecurrence(recurringItem, "weekend", now)) {
      const occurrence = findRecurringOccurrenceInRange(
        recurringItem,
        friday,
        end,
      );
      if (occurrence) return withDisplayDate(item, occurrence);
      return null;
    }
    return eventStart <= end && eventEnd >= friday ? item : null;
  }

  return item;
}

export function filterByTimeRange<
  T extends {
    date: string;
    endDate?: string;
    time?: string;
    recurrence?: string;
    recurrenceDay?: number;
    recurrenceDays?: number[];
  },
>(
  items: T[],
  range: TimeRange,
): T[] {
  if (range === "all") return items;

  const now = new Date();
  const matched: T[] = [];

  for (const item of items) {
    const result = matchesTimeRange(item, range, now);
    if (result) matched.push(result);
  }

  return matched;
}

export function searchEvents<
  T extends {
    title: string;
    description: string;
    location: string;
    venue?: string;
    address?: string;
    category?: string;
    categories?: string[];
    lineup?: string[];
  },
>(items: T[], query: string): T[] {
  const q = query.trim().toLowerCase();
  if (!q) return items;
  return items.filter((e) => {
    // Cheap fields first — most matches never scan the full description.
    if (e.title.toLowerCase().includes(q)) return true;
    if ((e.venue ?? "").toLowerCase().includes(q)) return true;
    if (e.location.toLowerCase().includes(q)) return true;
    if ((e.address ?? "").toLowerCase().includes(q)) return true;
    if ((e.category ?? "").toLowerCase().includes(q)) return true;
    if (e.categories?.some((c) => c.toLowerCase().includes(q))) return true;
    if (e.lineup?.some((name) => name.toLowerCase().includes(q))) return true;
    return e.description.toLowerCase().includes(q);
  });
}
