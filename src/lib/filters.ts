import type { EventRecurrence } from "./types";
import {
  addDaysISO,
  eventMatchesRecurrence,
  localDateISO,
  weekdayFromISO,
} from "./event-dates";
import { happensOnLocalDate, isEventActiveToday } from "./event-status";

export type TimeRange = "all" | "today" | "tomorrow" | "weekend";

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
  return "all";
}

function getWeekendRangeISO(now: Date): { start: string; end: string } {
  const today = localDateISO(now);
  const day = weekdayFromISO(today);

  // Fri–Sun: current weekend. Mon–Thu: upcoming Sat–Sun.
  if (day === 5) {
    return { start: addDaysISO(today, 1), end: addDaysISO(today, 2) };
  }
  if (day === 6) {
    return { start: today, end: addDaysISO(today, 1) };
  }
  if (day === 0) {
    return { start: addDaysISO(today, -1), end: today };
  }

  const daysUntilSaturday = (6 - day + 7) % 7;
  const saturday = addDaysISO(today, daysUntilSaturday);
  const sunday = addDaysISO(saturday, 1);
  return { start: saturday, end: sunday };
}

function withDisplayDate<
  T extends { date: string; endDate?: string },
>(item: T, dateIso: string): T {
  return { ...item, date: dateIso, endDate: item.endDate ?? dateIso };
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
      return eventStart <= end && eventEnd >= friday ? item : null;
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
    category?: string;
  },
>(items: T[], query: string): T[] {
  const q = query.trim().toLowerCase();
  if (!q) return items;
  return items.filter((e) => {
    const haystack =
      `${e.title} ${e.description} ${e.location} ${e.venue ?? ""} ${e.category ?? ""}`.toLowerCase();
    return haystack.includes(q);
  });
}
