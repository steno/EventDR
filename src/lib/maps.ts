import type { Event } from "./types";
import { eventDirectionsQuery } from "./event-location";

export function getDirectionsUrl(event: Event): string {
  const destination = eventDirectionsQuery(event);
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(destination)}`;
}
