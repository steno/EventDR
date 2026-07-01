import type { Event, EventRecurrence } from "./types";

function formatISO(d: Date): string {
  return d.toISOString().slice(0, 10);
}

function startOfDay(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

function parseEventDate(dateStr: string): Date | null {
  const d = new Date(dateStr + "T12:00:00");
  return isNaN(d.getTime()) ? null : d;
}

/** Push a past one-off date forward, preserving weekly rhythm when possible. */
function rollForwardDate(dateStr: string, now: Date): string {
  const eventDay = parseEventDate(dateStr);
  if (!eventDay) return dateStr;

  const today = startOfDay(now);
  let cursor = startOfDay(eventDay);

  if (cursor >= today) return formatISO(cursor);

  // Advance by 7 days until upcoming (keeps "every Sunday" style fallbacks alive)
  while (cursor < today) {
    cursor.setDate(cursor.getDate() + 7);
  }
  return formatISO(cursor);
}

function nextWeekday(from: Date, targetDay: number): Date {
  const d = startOfDay(from);
  const diff = (targetDay - d.getDay() + 7) % 7;
  d.setDate(d.getDate() + diff);
  return d;
}

/**
 * Sets display dates for recurring events and rolls stale fixed dates forward.
 */
export function materializeEventDates(
  events: Event[],
  now: Date = new Date(),
): Event[] {
  const today = formatISO(now);

  return events.map((event) => {
    if (event.recurrence === "daily") {
      return { ...event, date: today };
    }
    if (event.recurrence === "weekdays" && now.getDay() >= 1 && now.getDay() <= 5) {
      return { ...event, date: today };
    }
    if (event.recurrence === "weekends" && (now.getDay() === 0 || now.getDay() === 6)) {
      return { ...event, date: today };
    }
    if (event.recurrence === "weekly" && event.recurrenceDay != null) {
      const next = nextWeekday(now, event.recurrenceDay);
      return { ...event, date: formatISO(next) };
    }
    if (!event.recurrence) {
      return { ...event, date: rollForwardDate(event.date, now) };
    }
    return event;
  });
}

export function eventMatchesRecurrence(
  event: { recurrence?: EventRecurrence; recurrenceDay?: number },
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

  if (event.recurrence === "weekly" && event.recurrenceDay != null) {
    const target = event.recurrenceDay;
    if (range === "today") return day === target;
    if (range === "weekend") return target === 0 || target === 6;
    if (range === "week") {
      const today = startOfDay(now);
      const weekEnd = new Date(today);
      weekEnd.setDate(today.getDate() + 7);
      const occurrence = nextWeekday(now, target);
      return occurrence >= today && occurrence <= weekEnd;
    }
    return false;
  }

  return false;
}
