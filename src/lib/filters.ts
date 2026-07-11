export type TimeRange = "all" | "today" | "weekend" | "week";

import type { EventRecurrence } from "./types";
import {
  addDaysISO,
  eventMatchesRecurrence,
  localDateISO,
  weekdayFromISO,
} from "./event-dates";
import { happensOnLocalDate, isEventActiveToday } from "./event-status";

function getWeekendRangeISO(now: Date): { start: string; end: string } {
  const today = localDateISO(now);
  const day = weekdayFromISO(today);
  const daysUntilSaturday = (6 - day + 7) % 7;
  const saturday = addDaysISO(today, daysUntilSaturday);
  const sunday = addDaysISO(saturday, 1);
  return { start: saturday, end: sunday };
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
  const todayIso = localDateISO(now);

  return items.filter((item) => {
    if (
      item.recurrence &&
      eventMatchesRecurrence(
        item as {
          recurrence?: EventRecurrence;
          recurrenceDay?: number;
          recurrenceDays?: number[];
        },
        range,
        now,
      )
    ) {
      return true;
    }

    const eventStart = item.date.trim();
    const eventEnd = (item.endDate ?? item.date).trim();
    if (!eventStart || !eventEnd) return false;

    if (range === "today") {
      return happensOnLocalDate(item, todayIso) && isEventActiveToday(item, now);
    }

    if (range === "week") {
      const weekEndIso = addDaysISO(todayIso, 7);
      return eventStart <= weekEndIso && eventEnd >= todayIso;
    }

    if (range === "weekend") {
      const { start, end } = getWeekendRangeISO(now);
      const friday = addDaysISO(start, -1);
      return eventStart <= end && eventEnd >= friday;
    }

    return true;
  });
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
