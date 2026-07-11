import type { Dictionary } from "@/i18n/dictionaries";
import type { Event } from "@/lib/types";
import { localDateISO } from "@/lib/event-dates";
import {
  getEventLiveStatus,
  happensOnLocalDate,
  isEventActiveToday,
  parseEventTimeWindow,
  type EventLiveStatus,
} from "@/lib/event-status";

export interface LiveStatusDisplay {
  status: EventLiveStatus;
  label: string;
}

export function formatEventLiveStatusLabel(
  status: EventLiveStatus,
  dict: Dictionary,
): string | null {
  switch (status) {
    case "live":
      return dict.events.happeningNow;
    case "upcoming":
      return dict.events.startsSoon;
    case "ended":
      return dict.events.eventEnded;
    default:
      return null;
  }
}

function currentMinutes(now: Date): number {
  return now.getHours() * 60 + now.getMinutes();
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
  event: Pick<Event, "date" | "endDate" | "time">,
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
  return { status: "live", label: dict.events.eventStarted };
}

export function resolveLiveStatusDisplay(
  event: Pick<Event, "date" | "endDate" | "time">,
  dict: Dictionary,
  now: Date = new Date(),
): LiveStatusDisplay | null {
  if (!happensOnLocalDate(event, localDateISO(now))) return null;

  const status = getEventLiveStatus(event, now);
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
  event: Pick<Event, "date" | "endDate" | "time">,
  dict: Dictionary,
  now?: Date,
): string | null {
  return resolveLiveStatusDisplay(event, dict, now)?.label ?? null;
}

export function eventStatusBadgeClass(status: EventLiveStatus): string {
  switch (status) {
    case "live":
      return "bg-orange-50 text-orange-600 dark:bg-orange-950/50 dark:text-orange-400";
    case "upcoming":
      return "bg-sky-50 text-sky-700 dark:bg-sky-950/40 dark:text-sky-400";
    case "ended":
      return "bg-neutral-100 text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400";
    default:
      return "";
  }
}
