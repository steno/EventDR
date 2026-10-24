import type { Event } from "./types";
import { eventStartTimeMinutes, localDateISO } from "./event-dates";
import {
  getEventLiveStatus,
  happensOnLocalDate,
  hasEventEndedForToday,
  isEndingSoon,
  isEventActiveToday,
  isMultiDayEvent,
  isRecurringEvent,
  parseEventTimeWindow,
} from "./event-status";

/**
 * Lower rank = higher in the list.
 * Live first, then ending soon, then not-yet-started / happening today,
 * then closed-for-the-day; ended-today sink last.
 */
const LIST_TIER = {
  live: 0,
  endingSoon: 1,
  upcomingToday: 2,
  activeTodayUnknown: 3,
  closedToday: 4,
  future: 5,
  endedToday: 6,
  temporarilyClosed: 7,
  past: 8,
} as const;

export interface SortEventsForDisplayOptions {
  /** Deprioritize recurring events among future peers on the same day (not when live today). */
  recurringLast?: boolean;
  /**
   * Within the same status tier, prefer one-time fixtures, then multi-day
   * festivals, then weekly/weekend nights, then weekdays, then daily — before
   * clock time / date (does not float future one-offs above live/today status).
   * Keep on for visitor lists so multi-day hour-range cards beat recurring
   * single-kickoff nights (hasRange otherwise sorts those kickoffs first).
   */
  oneTimeFirst?: boolean;
  /**
   * After status/time sort: float today’s one-offs and scarce weekly nights
   * (incl. untimed “Happening today”) above evergreen dailies.
   */
  pinTodayOneOffs?: boolean;
  /**
   * Category "All" browse: today’s Thu-only / scarce nights first, then future
   * dated fixtures, then the evergreen daily catalog (even when “Happening now”).
   */
  discoveryMode?: boolean;
  /**
   * On category pages: within the same status tier, prefer events whose
   * primary `category` matches this id over secondary-only matches
   * (before time/schedule among those peers).
   */
  preferPrimaryCategory?: Event["category"];
  now?: Date;
}

/**
 * How often a recurring series runs. Lower = scarcer = higher in lists.
 * 0 ≈ once/twice a week (weekly night, weekends)
 * 1 ≈ several weekdays
 * 2 ≈ everyday / near-daily
 */
function recurringFrequencyRank(
  event: Pick<Event, "recurrence" | "recurrenceDay" | "recurrenceDays">,
): number {
  const recurrence = event.recurrence;
  if (!recurrence) return 0;
  if (recurrence === "daily") return 2;
  if (recurrence === "weekdays") return 1;
  if (recurrence === "weekends") return 0;

  const dayCount =
    event.recurrenceDays && event.recurrenceDays.length > 0
      ? event.recurrenceDays.length
      : 1;
  if (dayCount >= 5) return 2;
  if (dayCount >= 3) return 1;
  return 0;
}

/** Weekly/weekend nights — scarce enough to rank like dated fixtures. */
function isScarceRecurring(event: Event): boolean {
  return isRecurringEvent(event) && recurringFrequencyRank(event) === 0;
}

/**
 * Lower = higher in discovery lists (category “All”).
 * 0 today’s one-offs
 * 1 future dated one-offs (and multi-day festivals)
 * 2 scarce weekly/weekend — today or future (never above a dated one-off)
 * 3 evergreen daily/weekday catalog — even “Happening now” open hours
 *
 * Category rule: one-offs beat recurring. Today’s “Every Sat” must not sit
 * above tomorrow’s brunch or next week’s dinner.
 */
function discoveryBand(tier: number, event: Event): number {
  const oneOff = !isRecurringEvent(event);
  const scarceWeekly = isScarceRecurring(event);
  const todayActive =
    tier === LIST_TIER.live ||
    tier === LIST_TIER.endingSoon ||
    tier === LIST_TIER.upcomingToday ||
    tier === LIST_TIER.activeTodayUnknown;

  if (
    tier === LIST_TIER.endedToday ||
    tier === LIST_TIER.temporarilyClosed ||
    tier === LIST_TIER.past ||
    tier === LIST_TIER.closedToday
  ) {
    return 3;
  }

  if (oneOff && todayActive) return 0;
  if (oneOff) return 1;
  if (scarceWeekly) return 2;
  return 3;
}

/**
 * One-time fixtures before multi-day festivals, then weekly nights, then
 * weekdays, then daily — preserves prior status/time order within each kind.
 * Prefer `sortEventsForDisplay({ oneTimeFirst: true })` so status tiers stay primary.
 */
export function prioritizeOneTimeEvents(events: Event[]): Event[] {
  if (events.length < 2) return events;
  const order = new Map(events.map((event, index) => [event.id, index]));
  return [...events].sort((a, b) => {
    const kindDiff = oneTimeKindRank(a) - oneTimeKindRank(b);
    if (kindDiff !== 0) return kindDiff;
    return (order.get(a.id) ?? 0) - (order.get(b.id) ?? 0);
  });
}

export interface PinTodayOneOffsOptions {
  /**
   * Category hubs: keep primary-category matches ahead of secondary-only
   * (e.g. Sancocho before a sports-bar TV night that only tagged Food & Drinks).
   */
  preferPrimaryCategory?: Event["category"];
  /**
   * When true (category discoveryMode): pin only dated one-offs. Scarce
   * weeklies stay where discoveryBand put them — otherwise today’s
   * “Every Sat” jumps above tomorrow’s brunch.
   */
  oneOffsOnly?: boolean;
}

/**
 * Float today’s one-offs (and scarce weekly nights, unless `oneOffsOnly`)
 * above evergreen dailies (including untimed “Happening today” series like
 * La Peña). Used on home Today and category/city lists.
 */
export function pinTodayOneOffs(
  events: Event[],
  now: Date = new Date(),
  options: PinTodayOneOffsOptions = {},
): Event[] {
  if (events.length < 2) return events;

  const today = localDateISO(now);
  const preferPrimary = options.preferPrimaryCategory;
  const oneOffsOnly = options.oneOffsOnly === true;
  const pinned: Event[] = [];
  const rest: Event[] = [];
  for (const event of events) {
    const recurring = isRecurringEvent(event);
    const everydayRecurring = recurring && !isScarceRecurring(event);
    if (everydayRecurring || !happensOnLocalDate(event, today)) {
      rest.push(event);
      continue;
    }
    // Category All: do not re-pin weeklies above future one-offs.
    if (oneOffsOnly && recurring) {
      rest.push(event);
      continue;
    }
    const status = getEventLiveStatus(event, now);
    // Untimed weekly nights are "unknown" — still pin them; only drop finished.
    if (
      status === "ended" ||
      status === "closedToday" ||
      status === "temporarilyClosed"
    ) {
      rest.push(event);
      continue;
    }
    pinned.push(event);
  }

  if (pinned.length === 0) return events;

  // One-time before weekly → primary hub match → trending → newest createdAt.
  // Same-day one-offs always beat recurring, even when the weekly is primary.
  pinned.sort((a, b) => {
    const kind = oneTimeKindRank(a) - oneTimeKindRank(b);
    if (kind !== 0) return kind;
    if (preferPrimary) {
      const aPrimary = a.category === preferPrimary;
      const bPrimary = b.category === preferPrimary;
      if (aPrimary !== bPrimary) return aPrimary ? -1 : 1;
    }
    const trend =
      Number(Boolean(b.trending)) - Number(Boolean(a.trending));
    if (trend !== 0) return trend;
    return createdAtDesc(a, b);
  });
  return [...pinned, ...rest];
}

/** Newer `createdAt` first; missing timestamps sink among same-kind peers. */
function createdAtDesc(a: Event, b: Event): number {
  const aMs = a.createdAt ? Date.parse(a.createdAt) : Number.NaN;
  const bMs = b.createdAt ? Date.parse(b.createdAt) : Number.NaN;
  const aOk = Number.isFinite(aMs);
  const bOk = Number.isFinite(bMs);
  if (aOk && bOk && aMs !== bMs) return bMs - aMs;
  if (aOk !== bOk) return aOk ? -1 : 1;
  return 0;
}

/**
 * Lower = higher when `oneTimeFirst` is on.
 * 0 one-time · 1 multi-day · 2 weekly/weekend · 3 weekdays · 4 daily
 */
function oneTimeKindRank(event: Event): number {
  if (!isRecurringEvent(event)) {
    return isMultiDayEvent(event) ? 1 : 0;
  }
  return 2 + recurringFrequencyRank(event);
}

function eventEndTimeMinutes(time: string | undefined): number {
  const window = parseEventTimeWindow(time);
  if (!window) return Number.MAX_SAFE_INTEGER;
  return window.end;
}

/** Explicit start–end ranges (dining hours, shows) vs a single kickoff time. */
function hasExplicitTimeRange(time: string | undefined): boolean {
  if (!time) return false;
  const clockTimes = [...time.matchAll(/(\d{1,2})(?::(\d{2}))?\s*(AM|PM)/gi)];
  return clockTimes.length >= 2;
}

function listTier(event: Event, now: Date): number {
  const today = localDateISO(now);
  const onToday = happensOnLocalDate(event, today);

  if (event.temporarilyClosed) return LIST_TIER.temporarilyClosed;

  if (onToday && hasEventEndedForToday(event, now)) {
    return LIST_TIER.endedToday;
  }

  if (onToday && isEventActiveToday(event, now)) {
    if (isEndingSoon(event, now)) return LIST_TIER.endingSoon;
    const status = getEventLiveStatus(event, now);
    if (status === "live") return LIST_TIER.live;
    if (status === "upcoming") return LIST_TIER.upcomingToday;
    if (status === "closedToday") return LIST_TIER.closedToday;
    return LIST_TIER.activeTodayUnknown;
  }

  const endRaw = (event.endDate ?? event.date).trim();
  const endDay = endRaw.length >= 10 ? endRaw.slice(0, 10) : endRaw;
  if (endDay >= today) return LIST_TIER.future;

  return LIST_TIER.past;
}

function isActiveToday(event: Event, now: Date): boolean {
  return (
    happensOnLocalDate(event, localDateISO(now)) && isEventActiveToday(event, now)
  );
}

/** Status-aware list order: live, ending soon, happening today, then closed-for-the-day. */
export function sortEventsForDisplay(
  events: Event[],
  options: SortEventsForDisplayOptions = {},
): Event[] {
  if (events.length < 2) return events.length === 1 ? [...events] : [];

  const now = options.now ?? new Date();
  const recurringLast = options.recurringLast === true;
  const oneTimeFirst = options.oneTimeFirst === true;
  const shouldPinTodayOneOffs = options.pinTodayOneOffs === true;
  const discoveryMode = options.discoveryMode === true;
  const preferPrimary = options.preferPrimaryCategory;

  // Precompute sort keys once — listTier/time parsing is expensive in comparators.
  const keyed = events.map((event) => {
    const tier = listTier(event, now);
    const recurring = isRecurringEvent(event);
    return {
      event,
      tier,
      band: discoveryMode ? discoveryBand(tier, event) : 0,
      start: eventStartTimeMinutes(event.time),
      end: eventEndTimeMinutes(event.time),
      hasRange: hasExplicitTimeRange(event.time),
      recurring,
      kind: oneTimeKindRank(event),
      activeToday: isActiveToday(event, now),
      primaryMatch: preferPrimary ? event.category === preferPrimary : true,
    };
  });

  keyed.sort((a, b) => {
    if (discoveryMode && a.band !== b.band) return a.band - b.band;

    if (a.tier !== b.tier) return a.tier - b.tier;

    // Kind before primary/clock within the same status tier — same-day one-offs
    // beat weekly/daily on every category hub (and Today / Weekend tabs).
    // Never across tiers — a live daily still beats an upcoming one-off.
    if (oneTimeFirst && a.kind !== b.kind) return a.kind - b.kind;

    // Category pages: primary matches before secondary-only, within kind + tier.
    if (preferPrimary && a.primaryMatch !== b.primaryMatch) {
      return a.primaryMatch ? -1 : 1;
    }

    if (
      recurringLast &&
      a.tier === LIST_TIER.future &&
      a.event.date === b.event.date &&
      !a.activeToday &&
      !b.activeToday
    ) {
      const recurrenceDiff = Number(a.recurring) - Number(b.recurring);
      if (recurrenceDiff !== 0) return recurrenceDiff;
    }

    const tier = a.tier;
    if (tier === LIST_TIER.endingSoon) {
      const endDiff = a.end - b.end;
      if (endDiff !== 0) return endDiff;
    }

    if (
      tier === LIST_TIER.endingSoon ||
      tier === LIST_TIER.live ||
      tier === LIST_TIER.upcomingToday ||
      tier === LIST_TIER.closedToday ||
      tier === LIST_TIER.activeTodayUnknown
    ) {
      if (tier === LIST_TIER.upcomingToday || tier === LIST_TIER.live) {
        const rangeDiff = Number(a.hasRange) - Number(b.hasRange);
        if (rangeDiff !== 0) return rangeDiff;
      }
      const startDiff = a.start - b.start;
      if (startDiff !== 0) return startDiff;
    }

    if (tier === LIST_TIER.future || tier === LIST_TIER.past) {
      const dateDiff = a.event.date.localeCompare(b.event.date);
      if (dateDiff !== 0) return dateDiff;
      const timeDiff = a.start - b.start;
      if (timeDiff !== 0) return timeDiff;
    }

    if (a.event.trending && !b.event.trending) return -1;
    if (!a.event.trending && b.event.trending) return 1;

    return a.event.title.localeCompare(b.event.title);
  });

  const sorted = keyed.map((row) => row.event);
  return shouldPinTodayOneOffs
    ? pinTodayOneOffs(sorted, now, {
        preferPrimaryCategory: preferPrimary,
        // discoveryBand already ranks one-offs → scarce weekly → dailies;
        // pinning weeklies here would undo that for future one-offs.
        oneOffsOnly: discoveryMode,
      })
    : sorted;
}
