export type TimeRange = "all" | "today" | "weekend" | "week";

import type { EventRecurrence } from "./types";
import {
  eventMatchesRecurrence,
  localDateISO,
  parseLocalDate,
} from "./event-dates";
import { happensOnLocalDate, isEventActiveToday } from "./event-status";

function parseEventDate(dateStr: string): Date | null {
  const d = parseLocalDate(dateStr);
  return isNaN(d.getTime()) ? null : d;
}

function startOfDay(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

function getWeekendRange(now: Date): { start: Date; end: Date } {
  const day = now.getDay();
  const daysUntilSaturday = (6 - day + 7) % 7;
  const saturday = startOfDay(new Date(now));
  saturday.setDate(now.getDate() + daysUntilSaturday);
  const sunday = new Date(saturday);
  sunday.setDate(saturday.getDate() + 1);
  sunday.setHours(23, 59, 59, 999);
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
  const today = startOfDay(now);

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

    const eventDate = parseEventDate(item.date);
    const eventEndDate = parseEventDate(item.endDate ?? item.date);
    if (!eventDate || !eventEndDate) return false;

    const eventDay = startOfDay(eventDate);
    const eventEndDay = startOfDay(eventEndDate);

    if (range === "today") {
      const todayIso = localDateISO(now);
      return happensOnLocalDate(item, todayIso) && isEventActiveToday(item, now);
    }

    if (range === "week") {
      const weekEnd = new Date(today);
      weekEnd.setDate(today.getDate() + 7);
      return eventDay <= weekEnd && eventEndDay >= today;
    }

    if (range === "weekend") {
      const { start, end } = getWeekendRange(now);
      const friday = new Date(start);
      friday.setDate(start.getDate() - 1);
      return eventDay <= end && eventEndDay >= friday;
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
