import type { Dictionary } from "@/i18n/dictionaries";
import type { Event } from "@/lib/types";
import type { TimeRange } from "@/lib/filters";
import { addDaysISO, localDateISO } from "@/lib/event-dates";
import {
  getEventLiveStatus,
  happensOnLocalDate,
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
    case "temporarilyClosed":
      return dict.events.temporarilyClosed;
    case "ended":
      return dict.events.eventEnded;
    default:
      return null;
  }
}

/** Label when status is unknown but the event is still active today. */
function fallbackLiveStatusDisplay(
  event: Pick<Event, "date" | "endDate" | "time" | "recurrence">,
  dict: Dictionary,
  now: Date,
): LiveStatusDisplay | null {
  if (!isEventActiveToday(event, now)) return null;

  const status = getEventLiveStatus(event, now);
  if (status === "upcoming") {
    return { status: "upcoming", label: dict.events.startsSoon };
  }
  if (status === "closedToday") {
    return { status: "closedToday", label: dict.events.closedForToday };
  }
  if (status === "ended") {
    return { status: "ended", label: dict.events.eventEnded };
  }
  if (status === "live" && isEndingSoon(event, now)) {
    return { status: "ending", label: dict.events.endsSoon };
  }
  if (status === "live") {
    // Prefer Happening now only when we have a real clock window.
    if (!parseEventTimeWindow(event.time)) {
      return null;
    }
    return { status: "live", label: dict.events.eventStarted };
  }
  return null;
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
  if (!start || !end) return null;

  const status = getEventLiveStatus(event, now);

  // Overnight sessions can still be live after their calendar end date (past midnight).
  if (end < today) {
    if (status === "live" || status === "ending") {
      if (status === "live" && isEndingSoon(event, now)) {
        return { status: "ending", label: dict.events.endsSoon };
      }
      return {
        status,
        label: formatEventLiveStatusLabel(status, dict) ?? dict.events.happeningNow,
      };
    }
    return null;
  }

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
  // Soft pastel on light; black shell only on dark mobile (pastel again from lg up).
  const darkMobileShell =
    "dark:bg-black dark:ring-1 dark:ring-white/15 dark:lg:ring-0";
  switch (status) {
    case "live":
      return `bg-orange-50 text-orange-600 ${darkMobileShell} dark:text-orange-400 dark:lg:bg-orange-950/50`;
    case "ending":
      return `bg-amber-50 text-amber-700 ${darkMobileShell} dark:text-amber-400 dark:lg:bg-amber-950/40`;
    case "upcoming":
      return `bg-sky-50 text-sky-700 ${darkMobileShell} dark:text-sky-400 dark:lg:bg-sky-950/40`;
    case "closedToday":
      return `bg-violet-50 text-violet-700 ${darkMobileShell} dark:text-violet-400 dark:lg:bg-violet-950/40`;
    case "temporarilyClosed":
      return `bg-rose-50 text-rose-700 ${darkMobileShell} dark:text-rose-400 dark:lg:bg-rose-950/40`;
    case "ended":
      return `bg-neutral-100 text-neutral-500 ${darkMobileShell} dark:text-neutral-400 dark:lg:bg-neutral-800`;
    default:
      return "";
  }
}
