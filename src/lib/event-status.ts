import type { Event, EventCategory } from "./types";
import { addDaysISO, APP_TIMEZONE, localDateISO } from "./event-dates";

/** Fields used for live/ended status (recurrence may arrive as string from filters). */
export type EventLiveFields = Pick<
  Event,
  | "date"
  | "endDate"
  | "time"
  | "temporarilyClosed"
  | "soldOut"
  | "category"
  | "categories"
> & {
  recurrence?: Event["recurrence"] | string;
};

/**
 * Categories that usually mean evening/late club or stage nights when the
 * listing has no clock time. Venue seeds rarely carry structured open/close
 * hours yet — until they do, treat these as “expire at calendar midnight”
 * instead of the daytime 9 PM cutoff.
 */
const LATE_NIGHT_UNTIMED_CATEGORIES = new Set<EventCategory>([
  "parties",
  "dance",
  "music",
  "concert",
  "performances",
]);

/** True when a missing-time listing should stay listable past 9 PM. */
export function isLikelyLateNightUntimedListing(
  event: Pick<EventLiveFields, "category" | "categories">,
): boolean {
  if (event.category && LATE_NIGHT_UNTIMED_CATEGORIES.has(event.category)) {
    return true;
  }
  for (const cat of event.categories ?? []) {
    if (LATE_NIGHT_UNTIMED_CATEGORIES.has(cat)) return true;
  }
  return false;
}

/** Minutes from midnight (0–1439). */
export type EventTimeWindow = { start: number; end: number };

export type EventLiveStatus =
  | "upcoming"
  | "live"
  | "ending"
  | "closedToday"
  | "temporarilyClosed"
  | "soldOut"
  | "ended"
  | "unknown";

const DEFAULT_DURATION_MINUTES = 120;
/** Show "ends soon" when a multi-hour event is within this many minutes of closing. */
export const ENDS_SOON_MINUTES = 60;
/** Show "starts soon" only when doors are actually close — not all morning on event day. */
export const STARTS_SOON_MINUTES = 120;

function currentMinutes(now: Date): number {
  const formatted = new Intl.DateTimeFormat("en-GB", {
    timeZone: APP_TIMEZONE,
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).format(now);
  const [hours, minutes] = formatted.split(":").map(Number);
  return hours * 60 + minutes;
}

/** Sunday=0 … Saturday=6 in APP_TIMEZONE. */
function localDayOfWeek(now: Date): number {
  const weekday = new Intl.DateTimeFormat("en-US", {
    timeZone: APP_TIMEZONE,
    weekday: "short",
  }).format(now);
  const map: Record<string, number> = {
    Sun: 0,
    Mon: 1,
    Tue: 2,
    Wed: 3,
    Thu: 4,
    Fri: 5,
    Sat: 6,
  };
  return map[weekday] ?? now.getUTCDay();
}

const WEEKDAY_TOKEN_TO_DOW: Record<string, number> = {
  sun: 0,
  dom: 0,
  dim: 0,
  mon: 1,
  lun: 1,
  tue: 2,
  mar: 2, // ES martes / FR mardi
  wed: 3,
  mie: 3,
  mié: 3,
  mer: 3,
  thu: 4,
  jue: 4,
  jeu: 4,
  fri: 5,
  vie: 5,
  ven: 5,
  sat: 6,
  sab: 6,
  sáb: 6,
  sam: 6,
};

type DayLabeledSession = { dow: number; minutes: number };

/**
 * "Sat 5:30 PM · Sun 1:00 PM" style schedules — per-day starts, not a
 * start→end range (which would falsely look overnight when Sun < Sat).
 */
function parseDayLabeledSessions(time: string): DayLabeledSession[] | null {
  const re =
    /\b(Sun|Mon|Tue|Wed|Thu|Fri|Sat|Dom|Lun|Mar|Mi[eé]|Jue|Vie|S[aá]b|Sam|Dim|Mer|Jeu|Ven)\b\.?\s+(\d{1,2})(?::(\d{2}))?\s*(AM|PM)/gi;
  const sessions: DayLabeledSession[] = [];
  for (const match of time.matchAll(re)) {
    const dow = WEEKDAY_TOKEN_TO_DOW[match[1].toLowerCase()];
    if (dow === undefined) continue;
    let hours = Number(match[2]);
    const minutes = Number(match[3] ?? "0");
    const meridiem = match[4].toUpperCase();
    if (hours < 1 || hours > 12 || minutes < 0 || minutes > 59) continue;
    if (meridiem === "PM" && hours !== 12) hours += 12;
    if (meridiem === "AM" && hours === 12) hours = 0;
    sessions.push({ dow, minutes: hours * 60 + minutes });
  }
  return sessions.length >= 2 ? sessions : null;
}

function windowFromSessionStart(startMinutes: number): EventTimeWindow {
  const end = startMinutes + DEFAULT_DURATION_MINUTES;
  return {
    start: startMinutes,
    end: end >= 1440 ? end - 1440 : end,
  };
}

/** True when `dateISO` falls inside the event's inclusive calendar span. */
function dateInEventSpan(
  event: Pick<Event, "date" | "endDate">,
  dateISO: string,
): boolean {
  const start = eventStartISO(event);
  const end = eventEndISO(event);
  if (!start || !end) return false;
  return start <= dateISO && end >= dateISO;
}

function eventStartISO(event: Pick<Event, "date">): string | null {
  const start = event.date?.trim();
  return start || null;
}

function eventEndISO(event: Pick<Event, "date" | "endDate">): string | null {
  const end = (event.endDate ?? event.date)?.trim();
  return end || null;
}

/**
 * Parse one or two clock times from free-text event.time fields.
 * Pass `now` for day-labeled multi-session strings (Sat X · Sun Y) so today's
 * start is used with the default duration — not an overnight Sat→Sun span.
 */
export function parseEventTimeWindow(
  time?: string,
  now?: Date,
): EventTimeWindow | null {
  if (!time) return null;

  const daySessions = parseDayLabeledSessions(time);
  if (daySessions) {
    if (now) {
      const todayDow = localDayOfWeek(now);
      const today = daySessions.find((session) => session.dow === todayDow);
      if (!today) return null;
      return windowFromSessionStart(today.minutes);
    }
    // No date context (sort/SEO): one session length, never overnight.
    const start = Math.min(...daySessions.map((session) => session.minutes));
    return windowFromSessionStart(start);
  }

  const matches = [...time.matchAll(/(\d{1,2})(?::(\d{2}))?\s*(AM|PM)/gi)];
  if (matches.length === 0) return null;

  const times = matches
    .map((match) => {
      let hours = Number(match[1]);
      const minutes = Number(match[2] ?? "0");
      const meridiem = match[3].toUpperCase();
      if (hours < 1 || hours > 12 || minutes < 0 || minutes > 59) return NaN;
      if (meridiem === "PM" && hours !== 12) hours += 12;
      if (meridiem === "AM" && hours === 12) hours = 0;
      return hours * 60 + minutes;
    })
    .filter((value) => Number.isFinite(value));

  if (times.length === 0) return null;

  const start = times[0];
  const end =
    times.length > 1 ? times[times.length - 1] : start + DEFAULT_DURATION_MINUTES;
  return { start, end };
}

export function isMultiDayEvent(
  event: Pick<Event, "date" | "endDate">,
): boolean {
  return Boolean(event.endDate && event.endDate !== event.date);
}

export function isRecurringEvent(
  event: Pick<Event, "recurrence">,
): boolean {
  return Boolean(event.recurrence);
}

/**
 * Dated one-off that starts on the local calendar day (including overnight
 * parties whose `endDate` is the next morning). Recurring and multi-day
 * festivals that started earlier are not specials.
 */
export function isTodayOnlySpecial(
  event: Pick<Event, "date" | "recurrence">,
  today: string = localDateISO(),
): boolean {
  if (isRecurringEvent(event)) return false;
  return event.date?.trim() === today;
}

/** Multi-day span or recurring series still has future occurrences after today. */
export function eventContinuesBeyondToday(
  event: EventLiveFields,
  now: Date = new Date(),
): boolean {
  const today = localDateISO(now);
  const end = eventEndISO(event);
  if (!end) return false;

  if (end > today) return true;

  if (!event.recurrence) return false;
  if (event.endDate && today > event.endDate) return false;
  // Last calendar day of the series — tonight is the final session.
  if (event.endDate && event.endDate === today) return false;

  return true;
}

/** Parsed clock span in minutes; unparsed times sort as longest. */
export function getEventDurationMinutes(time?: string): number {
  const window = parseEventTimeWindow(time);
  if (!window) return Number.MAX_SAFE_INTEGER;
  return getWindowDurationMinutes(window);
}

function getWindowDurationMinutes(window: EventTimeWindow): number {
  if (window.end < window.start) {
    return 1440 - window.start + window.end;
  }
  return window.end - window.start;
}

export function isMultiHourEvent(time?: string): boolean {
  return getEventDurationMinutes(time) > ENDS_SOON_MINUTES;
}

function minutesUntilWindowStart(
  nowMin: number,
  window: EventTimeWindow,
): number {
  if (nowMin >= window.start) return 0;
  return window.start - nowMin;
}

function minutesUntilWindowEnd(
  nowMin: number,
  window: EventTimeWindow,
): number {
  if (window.end < window.start) {
    if (nowMin >= window.start) {
      return 1440 - nowMin + window.end;
    }
    return window.end - nowMin;
  }
  return window.end - nowMin;
}

/** Same-day event whose parsed start is within STARTS_SOON_MINUTES. */
export function isStartingSoon(
  event: EventLiveFields,
  now: Date = new Date(),
): boolean {
  const window = parseEventTimeWindow(event.time, now);
  if (!window) return false;
  if (getEventLiveStatus(event, now) !== "upcoming") return false;
  if (!happensOnLocalDate(event, localDateISO(now))) return false;

  const minutesLeft = minutesUntilWindowStart(currentMinutes(now), window);
  return minutesLeft > 0 && minutesLeft <= STARTS_SOON_MINUTES;
}

/** Live multi-hour event in its final hour before the parsed end time. */
export function isEndingSoon(
  event: Pick<Event, "date" | "endDate" | "time">,
  now: Date = new Date(),
): boolean {
  const window = parseEventTimeWindow(event.time, now);
  if (!window || !isMultiHourEvent(event.time)) return false;
  if (!isEventInProgress(event, now, window)) return false;

  const minutesLeft = minutesUntilWindowEnd(currentMinutes(now), window);
  return minutesLeft > 0 && minutesLeft <= ENDS_SOON_MINUTES;
}

export function eventSpansToday(
  event: Pick<Event, "date" | "endDate">,
  now: Date = new Date(),
): boolean {
  const start = eventStartISO(event);
  const end = eventEndISO(event);
  if (!start || !end) return false;
  const today = localDateISO(now);
  return start <= today && end >= today;
}

function isSameDayWithinWindow(
  nowMin: number,
  window: EventTimeWindow,
): boolean {
  return nowMin >= window.start && nowMin <= window.end;
}

/**
 * Overnight windows (end < start) span two calendar days: doors on day D from
 * `start` until midnight, then midnight until `end` on day D+1.
 * Clock-only checks incorrectly treat early morning as live for tonight's show.
 */
function isOvernightInProgress(
  event: Pick<Event, "date" | "endDate">,
  now: Date,
  window: EventTimeWindow,
  nowMin: number,
): boolean {
  const today = localDateISO(now);
  const yesterday = addDaysISO(today, -1);

  // Post-midnight tail of a session that started yesterday.
  if (dateInEventSpan(event, yesterday) && nowMin <= window.end) {
    return true;
  }
  // Evening of a session day (before midnight).
  if (dateInEventSpan(event, today) && nowMin >= window.start) {
    return true;
  }
  return false;
}

function isEventInProgress(
  event: Pick<Event, "date" | "endDate">,
  now: Date,
  window: EventTimeWindow,
): boolean {
  const nowMin = currentMinutes(now);
  if (window.end < window.start) {
    return isOvernightInProgress(event, now, window, nowMin);
  }
  if (!dateInEventSpan(event, localDateISO(now))) return false;
  return isSameDayWithinWindow(nowMin, window);
}

function hasSameDayWindowStarted(
  nowMin: number,
  window: EventTimeWindow,
): boolean {
  return nowMin >= window.start;
}

/** Multi-day festivals often misuse midnight as an all-day placeholder. */
export function isAllDayTimePlaceholder(time?: string): boolean {
  return /^12:00\s*AM$/i.test(time?.trim() ?? "");
}

/**
 * Default daytime window when a multi-day event only has a midnight placeholder.
 * Avoids marking festivals "happening now" at 12:30 AM.
 */
const ALL_DAY_DEFAULT_WINDOW: EventTimeWindow = {
  start: 9 * 60,
  end: 21 * 60,
};

function isMultiDayAllDayPlaceholder(
  event: Pick<Event, "date" | "endDate" | "time">,
): boolean {
  if (!event.endDate || event.endDate === event.date) return false;
  return isAllDayTimePlaceholder(event.time);
}

function hasSameDayWindowEnded(
  nowMin: number,
  window: EventTimeWindow,
): boolean {
  return nowMin > window.end;
}

/**
 * Overnight status on a session calendar day (or its morning spillover).
 */
function getOvernightLiveStatus(
  event: EventLiveFields,
  now: Date,
  window: EventTimeWindow,
  nowMin: number,
): EventLiveStatus {
  const today = localDateISO(now);
  const yesterday = addDaysISO(today, -1);
  const end = eventEndISO(event);
  if (!end) return "unknown";

  if (isOvernightInProgress(event, now, window, nowMin)) {
    return "live";
  }

  // Today is a scheduled day and doors haven't opened yet (incl. early morning).
  if (dateInEventSpan(event, today) && nowMin < window.start) {
    return "upcoming";
  }

  // Past the last calendar day — spillover already handled above.
  if (end < today) return "ended";

  // Between last night's close and tonight's open on a continuing series day
  // shouldn't happen when today is in span (handled as upcoming). Fallback:
  if (dateInEventSpan(event, yesterday) && nowMin > window.end) {
    if (eventContinuesBeyondToday(event, now) || dateInEventSpan(event, today)) {
      return dateInEventSpan(event, today) ? "upcoming" : "closedToday";
    }
    return "ended";
  }

  return "unknown";
}

/**
 * Live status for the current calendar day in APP_TIMEZONE.
 * Recurring events materialized to today use the same rules.
 */
export function getEventLiveStatus(
  event: EventLiveFields,
  now: Date = new Date(),
): EventLiveStatus {
  if (event.temporarilyClosed) return "temporarilyClosed";
  // soldOut is a badge only — keep calendar live/upcoming/ended for list sort.

  const start = eventStartISO(event);
  const end = eventEndISO(event);
  if (!start || !end) return "unknown";

  const today = localDateISO(now);
  if (end < today) {
    // Last night's overnight session may still be running past midnight.
    const window = parseEventTimeWindow(event.time, now);
    if (
      window &&
      window.end < window.start &&
      end === addDaysISO(today, -1) &&
      currentMinutes(now) <= window.end
    ) {
      return "live";
    }
    return "ended";
  }
  if (start > today) return "upcoming";

  // Midnight placeholders are not real start times — use daytime hours.
  if (isMultiDayAllDayPlaceholder(event)) {
    const nowMin = currentMinutes(now);
    const window = ALL_DAY_DEFAULT_WINDOW;
    if (isSameDayWithinWindow(nowMin, window)) return "live";
    if (!hasSameDayWindowStarted(nowMin, window)) return "upcoming";
    if (eventContinuesBeyondToday(event, now)) return "closedToday";
    return "ended";
  }

  const window = parseEventTimeWindow(event.time, now);
  if (!window) {
    // No parseable clock time (missing, free-text, "by reservation").
    // Never claim "happening now". Daytime / business listings leave the
    // home specials rail after 9 PM; club/stage nights without hours stay
    // listable until the local calendar day rolls (specials also key on date).
    if (isLikelyLateNightUntimedListing(event)) {
      return "unknown";
    }
    const nowMin = currentMinutes(now);
    const daytime = ALL_DAY_DEFAULT_WINDOW;
    if (nowMin > daytime.end) {
      if (eventContinuesBeyondToday(event, now)) return "closedToday";
      return "ended";
    }
    return "unknown";
  }

  const nowMin = currentMinutes(now);

  if (window.end < window.start) {
    return getOvernightLiveStatus(event, now, window, nowMin);
  }

  if (isSameDayWithinWindow(nowMin, window)) return "live";
  if (!hasSameDayWindowStarted(nowMin, window)) return "upcoming";
  if (hasSameDayWindowEnded(nowMin, window)) {
    if (eventContinuesBeyondToday(event, now)) return "closedToday";
    return "ended";
  }
  return "unknown";
}

export function hasWindowEndedForToday(
  event: EventLiveFields,
  now: Date = new Date(),
): boolean {
  return getEventLiveStatus(event, now) === "closedToday";
}

export function hasEventEndedForToday(
  event: EventLiveFields,
  now: Date = new Date(),
): boolean {
  return getEventLiveStatus(event, now) === "ended";
}

/**
 * One-off listings that belong on a venue Past tab (and should leave home
 * specials / upcoming rails). Matches {@link getEventLiveStatus} `"ended"` —
 * same clock cutoff as home “Today’s specials”, not calendar midnight.
 * Recurring nights stay upcoming (`closedToday` ≠ past).
 */
export function isPastOneOffEvent(
  event: EventLiveFields & { recurrence?: Event["recurrence"] | string },
  now: Date = new Date(),
): boolean {
  if (event.recurrence) return false;
  return getEventLiveStatus(event, now) === "ended";
}

export function isEventActiveToday(
  event: EventLiveFields,
  now: Date = new Date(),
): boolean {
  if (!eventSpansToday(event, now)) return false;
  return getEventLiveStatus(event, now) !== "ended";
}

/**
 * Dated one-off still worth a Today’s specials slot.
 * Leaves the rail once the show is in its final hour (“ends soon”) or has ended.
 */
export function isListedTodaySpecial(
  event: EventLiveFields,
  now: Date = new Date(),
): boolean {
  // Inline the isTodayOnlySpecial checks — EventLiveFields.recurrence is
  // `string | EventRecurrence` (ingest/filters), which is not assignable to
  // Pick<Event, "recurrence"> without a cast.
  if (event.recurrence) return false;
  if (event.date?.trim() !== localDateISO(now)) return false;
  if (!isEventActiveToday(event, now)) return false;
  return !isEndingSoon(event, now);
}

export function happensOnLocalDate(
  event: Pick<Event, "date" | "endDate">,
  dateISO: string = localDateISO(),
): boolean {
  const start = eventStartISO(event);
  const end = eventEndISO(event);
  if (!start || !end) return false;
  return start <= dateISO && end >= dateISO;
}
