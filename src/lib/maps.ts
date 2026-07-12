import type { Event } from "./types";
import { resolveEventCoords } from "./event-coords";
import { eventDirectionsQuery } from "./event-location";

export function getDirectionsUrl(event: Event): string {
  const coords = resolveEventCoords(event);
  if (coords) {
    return `https://www.google.com/maps/search/?api=1&query=${coords.lat},${coords.lng}`;
  }
  const destination = eventDirectionsQuery(event);
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(destination)}`;
}
