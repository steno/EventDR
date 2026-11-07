import { addDaysISO, localDateISO } from "@/lib/event-dates";
import { parseEventTimeWindow } from "@/lib/event-status";
import { getWeekendListingBounds } from "@/lib/filters";

type DatedEvent = {
  date: string;
  endDate?: string;
  time?: string;
  recurrence?: string;
};

/**
 * Day key for All / Weekend list headings.
 * Ongoing multi-day fixtures move with the calendar (sit under today) instead
 * of staying glued to the publish/start date. Overnight one-nighters
 * (endDate = next morning + end clock before start) keep their start day.
 */
export function browseDayHeadingDate(
  event: Pick<DatedEvent, "date" | "endDate" | "time">,
  now: Date = new Date(),
): string {
  const start = event.date?.trim();
  if (!start) return event.date;
  const end = (event.endDate ?? event.date)?.trim() || start;
  if (end === start) return start;

  const today = localDateISO(now);
  if (start >= today) return start;
  if (end < today) return start;

  // Fri 10pm–Sat 4am style spillover: stay on the session start day.
  if (end === addDaysISO(start, 1)) {
    const window = parseEventTimeWindow(event.time);
    if (window && window.end < window.start) return start;
  }

  return today;
}

/** Keep each day's existing order, but put calendar days in date order. */
export function eventsInCalendarOrder<T extends DatedEvent>(
  events: T[],
  now: Date = new Date(),
): T[] {
  const buckets = new Map<string, T[]>();
  for (const event of events) {
    const key = browseDayHeadingDate(event, now);
    const list = buckets.get(key);
    if (list) list.push(event);
    else buckets.set(key, [event]);
  }
  return [...buckets.keys()]
    .sort()
    .flatMap((date) => buckets.get(date) ?? []);
}

/**
 * All-tab browse: dated one-offs in calendar day order, then weekly/daily
 * series. Preserves relative order within each day and within the recurring
 * block so status sort (live → soon → later) still applies inside a day.
 */
export function eventsInAllBrowseOrder<T extends DatedEvent>(
  events: T[],
  now: Date = new Date(),
): T[] {
  const dated: T[] = [];
  const recurring: T[] = [];
  for (const event of events) {
    if (event.recurrence) recurring.push(event);
    else dated.push(event);
  }
  return [...eventsInCalendarOrder(dated, now), ...recurring];
}

/** Day heading for a weekend row. Long-running events use today within the weekend. */
export function weekendHeadingDate(
  event: Pick<DatedEvent, "date" | "endDate" | "time">,
  now: Date = new Date(),
): string {
  const { start, end } = getWeekendListingBounds(now);
  const heading = browseDayHeadingDate(event, now);
  if (heading < start) return start;
  if (heading > end) return end;
  return heading;
}

/**
 * Friday, then Saturday, then Sunday. Events that started earlier but are
 * still running sit at the end of Friday so they don't rename the weekend —
 * unless today is Sat/Sun, in which case browseDayHeadingDate already moved
 * them onto today.
 */
export function eventsInWeekendOrder<T extends DatedEvent>(
  events: T[],
  now: Date = new Date(),
): T[] {
  const { start } = getWeekendListingBounds(now);
  const buckets = new Map<string, T[]>();
  const continuing: T[] = [];
  for (const event of events) {
    const key = weekendHeadingDate(event, now);
    // Pre-weekend starts that still land on Friday trail that day's own starts.
    if (event.date < start && key === start) {
      continuing.push(event);
      continue;
    }
    const list = buckets.get(key);
    if (list) list.push(event);
    else buckets.set(key, [event]);
  }
  const days = [...buckets.keys()].sort();
  const ordered = days.flatMap((date) => buckets.get(date) ?? []);
  if (days[0] === start && continuing.length > 0) {
    const fridayCount = buckets.get(start)?.length ?? 0;
    ordered.splice(fridayCount, 0, ...continuing);
    return ordered;
  }
  return [...ordered, ...continuing];
}
