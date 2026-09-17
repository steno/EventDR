import { isEventFree } from "./event-tickets";
import type { Event, EventRecurrence } from "./types";
import {
  addDaysISO,
  eventMatchesRecurrence,
  findRecurringOccurrenceInRange,
  localDateISO,
  weekdayFromISO,
} from "./event-dates";
import { happensOnLocalDate, isEventActiveToday } from "./event-status";
import { matchVenueSlug } from "./venues-seed";

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

/**
 * Other time tabs (in chip order) that still have matches — for empty-state
 * “try these days” suggestions.
 */
export function listOtherMatchingFilterTimeRanges(
  current: FilterTimeRange,
  hasMatches: (range: FilterTimeRange) => boolean,
): FilterTimeRange[] {
  return FILTER_TIME_RANGES.filter(
    (range) => range !== current && hasMatches(range),
  );
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

/** Visible price modifiers (Gratis / Pago). Combine with time via `filterByTimeAndPrice`. */
export type PriceFilter = "all" | "free" | "paid";

export const PRICE_FILTERS: Array<Exclude<PriceFilter, "all">> = ["free", "paid"];

export const DEFAULT_PRICE_FILTER: PriceFilter = "all";

export function isPriceFilter(value: string): value is PriceFilter {
  return value === "all" || value === "free" || value === "paid";
}

export function filterByPrice<T extends Event>(
  items: T[],
  price: PriceFilter,
): T[] {
  if (price === "all") return items;
  if (price === "free") return items.filter((event) => isEventFree(event));
  return items.filter((event) => !isEventFree(event));
}

/** Time tab AND price toggle — Today + Free is free events today, not all free events. */
export function filterByTimeAndPrice<T extends Event>(
  items: T[],
  range: TimeRange,
  price: PriceFilter,
): T[] {
  return filterByPrice(filterByTimeRange(items, range), price);
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
  now: Date = new Date(),
): T[] {
  if (range === "all") return items;

  const matched: T[] = [];

  for (const item of items) {
    const result = matchesTimeRange(item, range, now);
    if (result) matched.push(result);
  }

  return matched;
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Token match that rejects mid-word hits (`aura` must not match `restaurant`).
 * Boundaries are any non-letter/digit (Unicode-aware), so `Aura Beach` and `Aura,`
 * still match.
 */
function haystackHasToken(hay: string, token: string): boolean {
  if (!token) return true;
  const re = new RegExp(
    `(^|[^\\p{L}\\p{N}])${escapeRegExp(token)}(?=[^\\p{L}\\p{N}]|$)`,
    "iu",
  );
  return re.test(hay);
}

/**
 * Match a free-text search against a haystack.
 * Supports word-boundary tokens, space-stripped brands (cabarete fitness → cabaretefitness),
 * and multi-word AND (all tokens must appear somewhere).
 */
export function textMatchesSearchQuery(haystack: string, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  const hay = haystack.toLowerCase();
  if (haystackHasToken(hay, q)) return true;

  const compactQ = q.replace(/\s+/g, "");
  if (compactQ.length >= 6 && hay.replace(/\s+/g, "").includes(compactQ)) {
    return true;
  }

  const tokens = q.split(/\s+/).filter(Boolean);
  if (tokens.length > 1) {
    return tokens.every((token) => haystackHasToken(hay, token));
  }
  return false;
}

export function searchEvents<
  T extends {
    title: string;
    description: string;
    location: string;
    venue?: string;
    venueSlug?: string;
    address?: string;
    category?: string;
    categories?: string[];
    lineup?: string[];
  },
>(items: T[], query: string): T[] {
  const q = query.trim().toLowerCase();
  if (!q) return items;
  const aliasSlug = matchVenueSlug(q);
  return items.filter((e) => {
    if (aliasSlug && e.venueSlug === aliasSlug) return true;

    const haystack = [
      e.title,
      e.description,
      e.location,
      e.venue ?? "",
      e.address ?? "",
      e.category ?? "",
      e.venueSlug?.replace(/-/g, " ") ?? "",
      ...(e.categories ?? []),
      ...(e.lineup ?? []),
    ].join("\n");

    return textMatchesSearchQuery(haystack, q);
  });
}

/** Match venues by name, city, slug tokens, aliases, or description. */
export function searchVenues<
  T extends {
    name: string;
    city: string;
    slug: string;
    description?: string;
  },
>(items: T[], query: string): T[] {
  const q = query.trim().toLowerCase();
  if (!q) return items;
  const aliasSlug = matchVenueSlug(q);
  const hits = items.filter((v) => {
    if (aliasSlug && v.slug === aliasSlug) return true;

    const haystack = [
      v.name,
      v.city,
      v.slug.replace(/-/g, " "),
      v.description ?? "",
    ].join("\n");

    return textMatchesSearchQuery(haystack, q);
  });

  // Prefer alias / name / slug hits so description noise ("restaurant") cannot bury the place.
  return hits.sort((a, b) => {
    const score = (v: (typeof hits)[number]) => {
      if (aliasSlug && v.slug === aliasSlug) return 0;
      if (textMatchesSearchQuery(v.name, q)) return 1;
      if (textMatchesSearchQuery(v.slug.replace(/-/g, " "), q)) return 2;
      return 3;
    };
    return score(a) - score(b);
  });
}
