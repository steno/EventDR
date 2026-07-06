import type { Event } from "./types";
import { formatEventPlace } from "./event-location";

export async function shareEvent(event: Event): Promise<boolean> {
  const text = `${event.title}\n${event.date}${event.time ? ` · ${event.time}` : ""}\n${formatEventPlace(event)}\n\n${event.description}`;

  if (typeof navigator !== "undefined" && navigator.share) {
    try {
      await navigator.share({
        title: event.title,
        text,
        url: event.sourceUrl ?? window.location.href,
      });
      return true;
    } catch {
      return false;
    }
  }

  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}
