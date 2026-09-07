import { createHash } from "node:crypto";
import { addDaysISO, APP_TIMEZONE } from "@/lib/event-dates";
import type { Event } from "@/lib/types";

/** How far ahead of the event to notify. */
export type ReminderOffset = "day_before" | "morning_of" | "hours_before_2";

export const REMINDER_OFFSETS: ReminderOffset[] = [
  "day_before",
  "morning_of",
  "hours_before_2",
];

/** Santo Domingo is UTC−4 year-round (no DST). */
const NORTH_COAST_UTC_OFFSET_HOURS = 4;

const LEAD_MS = 5 * 60 * 1000;

export type ReminderTiming = {
  offset: ReminderOffset;
  remindAt: Date;
};

function parseEventClock(time?: string): { hours: number; minutes: number } {
  if (!time) return { hours: 18, minutes: 0 };
  const match = time.match(/(\d{1,2}):(\d{2})\s*(AM|PM)?/i);
  if (!match) return { hours: 18, minutes: 0 };
  let hours = Number(match[1]);
  const minutes = Number(match[2]);
  const meridiem = match[3]?.toUpperCase();
  if (meridiem === "PM" && hours < 12) hours += 12;
  if (meridiem === "AM" && hours === 12) hours = 0;
  if (!meridiem && hours > 23) return { hours: 18, minutes: 0 };
  return { hours, minutes };
}

/** Wall-clock time on the North Coast → UTC Instant. */
export function northCoastLocalToUtc(
  dateISO: string,
  hours: number,
  minutes: number,
): Date {
  const [y, m, d] = dateISO.split("-").map(Number);
  if (!y || !m || !d) return new Date(NaN);
  return new Date(
    Date.UTC(y, m - 1, d, hours + NORTH_COAST_UTC_OFFSET_HOURS, minutes, 0, 0),
  );
}

export function eventStartUtc(
  eventDate: string,
  eventTime?: string,
): Date {
  const clock = parseEventClock(eventTime);
  return northCoastLocalToUtc(eventDate, clock.hours, clock.minutes);
}

export function computeRemindAt(
  eventDate: string,
  eventTime: string | undefined,
  offset: ReminderOffset,
): Date | null {
  const day = eventDate.trim().slice(0, 10);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(day)) return null;

  const start = eventStartUtc(day, eventTime);
  if (Number.isNaN(start.getTime())) return null;

  if (offset === "hours_before_2") {
    return new Date(start.getTime() - 2 * 60 * 60 * 1000);
  }

  if (offset === "morning_of") {
    return northCoastLocalToUtc(day, 10, 0);
  }

  return northCoastLocalToUtc(addDaysISO(day, -1), 10, 0);
}

/** Offsets still in the future and before the event starts. */
export function availableReminderTimings(
  event: Pick<Event, "date" | "time">,
  now: Date = new Date(),
): ReminderTiming[] {
  const start = eventStartUtc(event.date, event.time);
  if (Number.isNaN(start.getTime()) || start.getTime() <= now.getTime() + LEAD_MS) {
    return [];
  }

  const out: ReminderTiming[] = [];
  for (const offset of REMINDER_OFFSETS) {
    const remindAt = computeRemindAt(event.date, event.time, offset);
    if (!remindAt || Number.isNaN(remindAt.getTime())) continue;
    if (remindAt.getTime() <= now.getTime() + LEAD_MS) continue;
    if (remindAt.getTime() >= start.getTime()) continue;
    out.push({ offset, remindAt });
  }
  return out;
}

/** Prefer day-before, then morning-of, then 2h before. */
export function recommendedReminderOffset(
  timings: ReminderTiming[],
): ReminderOffset | null {
  if (timings.length === 0) return null;
  for (const preferred of REMINDER_OFFSETS) {
    if (timings.some((t) => t.offset === preferred)) return preferred;
  }
  return timings[0]?.offset ?? null;
}

export function reminderDocId(endpoint: string, eventId: string): string {
  return createHash("sha256").update(`${endpoint}\0${eventId}`).digest("hex");
}

export function formatRemindAtLabel(
  remindAt: Date,
  locale: string,
): string {
  return new Intl.DateTimeFormat(locale, {
    timeZone: APP_TIMEZONE,
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(remindAt);
}
