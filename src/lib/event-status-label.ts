import type { Dictionary } from "@/i18n/dictionaries";
import type { Event } from "@/lib/types";
import { getEventLiveStatus, type EventLiveStatus } from "@/lib/event-status";

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

export function getEventLiveStatusLabel(
  event: Pick<Event, "date" | "endDate" | "time">,
  dict: Dictionary,
  now?: Date,
): string | null {
  return formatEventLiveStatusLabel(getEventLiveStatus(event, now), dict);
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
