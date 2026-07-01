import type { Event } from "./types";

export function getDirectionsUrl(event: Event): string {
  const destination = [event.venue, event.location, "Dominican Republic"]
    .filter(Boolean)
    .join(", ");
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(destination)}`;
}
