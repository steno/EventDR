import type { Event } from "./types";
import { matchVenueSlug } from "./venues-seed";
import { NORTH_COAST_CENTER, resolveEventCoords } from "./event-coords";

export { NORTH_COAST_CENTER, resolveEventCoords };

export function attachCoords(events: Event[]): Event[] {
  return events.map((e) => {
    const coords = resolveEventCoords(e);
    if (!coords) return e;
    return { ...e, lat: coords.lat, lng: coords.lng };
  });
}

export function attachVenueSlugs(events: Event[]): Event[] {
  return events.map((e) => {
    if (e.venueSlug) return e;
    const slug = matchVenueSlug(e.venue) ?? matchVenueSlug(e.location);
    return slug ? { ...e, venueSlug: slug } : e;
  });
}

/** Normalize seed/ingest events with canonical venue slugs and coordinates. */
export function prepareSeedEvent(event: Event): Event {
  const [prepared] = attachCoords(attachVenueSlugs([event]));
  return prepared;
}

export function filterByVenueSlug(events: Event[], venueSlug: string): Event[] {
  return attachVenueSlugs(events).filter((e) => e.venueSlug === venueSlug);
}
