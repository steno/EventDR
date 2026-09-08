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

/** Apply venue slugs, then canonical coordinates (seed venue wins over stale stored lat/lng). */
export function normalizeEventCoords(event: Event): Event {
  const [prepared] = attachCoords(attachVenueSlugs([event]));
  return prepared;
}

export function normalizeEventCoordsList(events: Event[]): Event[] {
  return attachCoords(attachVenueSlugs(events));
}

/** Normalize seed/ingest events with canonical venue slugs and coordinates. */
export function prepareSeedEvent(event: Event): Event {
  return normalizeEventCoords(event);
}

/** True when the event is hosted at the venue, or lists it as a participant. */
export function eventMatchesVenueSlug(
  event: Event,
  venueSlug: string,
): boolean {
  const target = venueSlug.trim();
  if (!target) return false;
  if (event.venueSlug === target) return true;
  if (
    !event.venueSlug &&
    (matchVenueSlug(event.venue) === target ||
      matchVenueSlug(event.location) === target)
  ) {
    return true;
  }
  return (event.participants ?? []).some(
    (name) => matchVenueSlug(name) === target,
  );
}

export function filterByVenueSlug(events: Event[], venueSlug: string): Event[] {
  return attachVenueSlugs(events).filter((e) =>
    eventMatchesVenueSlug(e, venueSlug),
  );
}
