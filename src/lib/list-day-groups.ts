import { getWeekendListingBounds } from "@/lib/filters";

/** Keep each day's existing order, but put calendar days in date order. */
export function eventsInCalendarOrder<T extends { date: string }>(
  events: T[],
): T[] {
  const buckets = new Map<string, T[]>();
  for (const event of events) {
    const list = buckets.get(event.date);
    if (list) list.push(event);
    else buckets.set(event.date, [event]);
  }
  return [...buckets.keys()]
    .sort()
    .flatMap((date) => buckets.get(date) ?? []);
}

/** Day heading for a weekend row. Long-running events use Friday, not their start date. */
export function weekendHeadingDate(
  event: { date: string },
  now: Date = new Date(),
): string {
  const { start, end } = getWeekendListingBounds(now);
  if (event.date < start) return start;
  if (event.date > end) return end;
  return event.date;
}

/**
 * Friday, then Saturday, then Sunday. Events that started earlier but are
 * still running sit at the end of Friday so they don't rename the weekend.
 */
export function eventsInWeekendOrder<T extends { date: string }>(
  events: T[],
  now: Date = new Date(),
): T[] {
  const { start, end } = getWeekendListingBounds(now);
  const buckets = new Map<string, T[]>();
  const continuing: T[] = [];
  for (const event of events) {
    if (event.date < start) {
      continuing.push(event);
      continue;
    }
    const key = event.date > end ? end : event.date;
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
