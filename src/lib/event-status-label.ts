import type { Dictionary } from "@/i18n/dictionaries";
import type { Event } from "@/lib/types";
import type { TimeRange } from "@/lib/filters";
import { addDaysISO, localDateISO, APP_TIMEZONE } from "@/lib/event-dates";
import {
  getEventLiveStatus,
  happensOnLocalDate,
  hasWindowEndedForToday,
  isEndingSoon,
  isEventActiveToday,
  parseEventTimeWindow,
  type EventLiveStatus,
} from "@/lib/event-status";

export interface LiveStatusDisplay {
  status: EventLiveStatus;
  label: string;
}

export interface LiveStatusDisplayOptions {
  /** Skip date badges when the parent list is already filtered to that range. */
  listTimeRange?: TimeRange;
}

export function formatEventLiveStatusLabel(
  status: EventLiveStatus,
  dict: Dictionary,
): string | null {
  switch (status) {
    case "live":
      return dict.events.happeningNow;
    case "ending":
      return dict.events.endsSoon;
    case "upcoming":
      return dict.events.startsSoon;
    case "closedToday":
      return dict.events.closedForToday;
    case "ended":
      return dict.events.eventEnded;
    default:
      return null;
  }
}

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

function hasWindowStarted(
  nowMin: number,
  window: { start: number; end: number },
): boolean {
  if (window.end < window.start) {
    return nowMin >= window.start || nowMin <= window.end;
  }
  return nowMin >= window.start;
}

/** Label when status is unknown but the event is still active today. */
function fallbackLiveStatusDisplay(
  event: Pick<Event, "date" | "endDate" | "time" | "recurrence">,
  dict: Dictionary,
  now: Date,
): LiveStatusDisplay | null {
  if (!isEventActiveToday(event, now)) return null;

  const window = parseEventTimeWindow(event.time);
  if (!window) {
    return { status: "live", label: dict.events.happeningNow };
  }
  if (!hasWindowStarted(currentMinutes(now), window)) {
    return { status: "upcoming", label: dict.events.startsSoon };
  }
  if (hasWindowEndedForToday(event, now)) {
    return { status: "closedToday", label: dict.events.closedForToday };
  }
  if (isEndingSoon(event, now)) {
    return { status: "ending", label: dict.events.endsSoon };
  }
  return { status: "live", label: dict.events.eventStarted };
}

export function resolveLiveStatusDisplay(
  event: Pick<Event, "date" | "endDate" | "time" | "recurrence">,
  dict: Dictionary,
  now: Date = new Date(),
  options?: LiveStatusDisplayOptions,
): LiveStatusDisplay | null {
  const today = localDateISO(now);
  const start = event.date?.trim();
  const end = (event.endDate ?? event.date)?.trim();
  if (!start || !end || end < today) return null;

  const status = getEventLiveStatus(event, now);

  if (status === "live" && isEndingSoon(event, now)) {
    return { status: "ending", label: dict.events.endsSoon };
  }

  // Near-future list cards (Our picks "All") — intraday labels are misleading here.
  if (start > today) {
    if (start === addDaysISO(today, 1)) {
      if (options?.listTimeRange === "tomorrow") return null;
      return { status: "upcoming", label: dict.time.tomorrow };
    }
    return null;
  }

  if (!happensOnLocalDate(event, today)) return null;

  const directLabel = formatEventLiveStatusLabel(status, dict);
  if (directLabel) {
    return { status, label: directLabel };
  }

  if (status === "unknown") {
    return fallbackLiveStatusDisplay(event, dict, now);
  }

  return null;
}

export function getEventLiveStatusLabel(
  event: Pick<Event, "date" | "endDate" | "time" | "recurrence">,
  dict: Dictionary,
  now?: Date,
  options?: LiveStatusDisplayOptions,
): string | null {
  return resolveLiveStatusDisplay(event, dict, now, options)?.label ?? null;
}

export function eventStatusBadgeClass(status: EventLiveStatus): string {
  switch (status) {
    case "live":
      return "bg-orange-50 text-orange-600 dark:bg-orange-950/50 dark:text-orange-400";
    case "ending":
      return "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400";
    case "upcoming":
      return "bg-sky-50 text-sky-700 dark:bg-sky-950/40 dark:text-sky-400";
    case "closedToday":
      return "bg-violet-50 text-violet-700 dark:bg-violet-950/40 dark:text-violet-400";
    case "ended":
      return "bg-neutral-100 text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400";
    default:
      return "";
  }
}
