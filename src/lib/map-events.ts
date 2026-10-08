import { hasMapCoords, resolveEventCoords } from "@/lib/event-coords";
import { eventInCategory } from "@/lib/categorize";
import { haversineMeters } from "@/lib/distance";
import { filterByTimeRange, type TimeRange } from "@/lib/filters";
import type { Event, EventCategory } from "@/lib/types";
import { pinColorForCategory } from "@/lib/map-style";

export type MapTimeFilter = Extract<TimeRange, "all" | "today" | "weekend">;

export type MapPin = {
  id: string;
  lat: number;
  lng: number;
  color: string;
  category: EventCategory;
  events: Event[];
  /** First event image for the pin thumbnail (if any). */
  thumbUrl?: string;
};

function pinKey(lat: number, lng: number): string {
  return `${lat.toFixed(5)},${lng.toFixed(5)}`;
}

/** Events with usable map pins for the North Coast map screen. */
export function eventsWithMapPins(events: Event[]): Event[] {
  return events.filter((event) => {
    if (event.format === "digital") return false;
    return hasMapCoords(resolveEventCoords(event));
  });
}

/**
 * Drop list-search fields the map UI never reads (pins + media-only cards).
 * Keeps the RSC payload leaner on `/map`.
 */
export function slimEventsForMap(events: Event[]): Event[] {
  return events.map((event) => {
    if (!event.searchText && !event.lineup && !event.participants) {
      return event;
    }
    const slim: Event = { ...event };
    delete slim.searchText;
    delete slim.lineup;
    delete slim.participants;
    return slim;
  });
}

export function filterMapEvents(
  events: Event[],
  when: MapTimeFilter,
  category: EventCategory | "all",
): Event[] {
  const timed = filterByTimeRange(eventsWithMapPins(events), when);
  if (category === "all") return timed;
  return timed.filter((event) => eventInCategory(event, category));
}

/** One pin per venue coordinate; stacks multiple events at the same place. */
export function buildMapPins(events: Event[]): MapPin[] {
  const groups = new Map<string, MapPin>();

  for (const event of events) {
    const coords = resolveEventCoords(event);
    if (!coords) continue;
    const key = pinKey(coords.lat, coords.lng);
    const existing = groups.get(key);
    if (existing) {
      existing.events.push(event);
      if (!existing.thumbUrl) {
        const thumb = event.imageUrl?.trim();
        if (thumb) existing.thumbUrl = thumb;
      }
      continue;
    }
    const thumb = event.imageUrl?.trim();
    groups.set(key, {
      id: key,
      lat: coords.lat,
      lng: coords.lng,
      color: pinColorForCategory(event.category),
      category: event.category,
      events: [event],
      ...(thumb ? { thumbUrl: thumb } : {}),
    });
  }

  return [...groups.values()];
}

/** Max hop on card-close “swing next”; farther pins zoom back to overview. */
export const SWING_NEXT_MAX_METERS = 5_000;

/**
 * Nearest other pin by ground distance (for card-close “swing next”).
 * Pass `excludeIds` to skip already-visited pins in a browse chain; when every
 * other pin is excluded, falls back to the nearest among all others.
 * Pins beyond `maxMeters` are ignored (returns null → zoom out).
 */
export function nearestMapPin(
  pins: MapPin[],
  fromId: string,
  excludeIds: Iterable<string> = [],
  maxMeters: number = SWING_NEXT_MAX_METERS,
): MapPin | null {
  const from = pins.find((pin) => pin.id === fromId);
  if (!from || pins.length < 2) return null;

  const excluded = new Set(excludeIds);
  excluded.add(fromId);

  const pickNearest = (candidates: MapPin[]): MapPin | null => {
    let best: MapPin | null = null;
    let bestMeters = Infinity;
    for (const pin of candidates) {
      const meters = haversineMeters(
        { lat: from.lat, lng: from.lng },
        { lat: pin.lat, lng: pin.lng },
      );
      if (meters > maxMeters) continue;
      if (meters < bestMeters) {
        bestMeters = meters;
        best = pin;
      }
    }
    return best;
  };

  const unvisited = pins.filter((pin) => !excluded.has(pin.id));
  if (unvisited.length > 0) return pickNearest(unvisited);

  return pickNearest(pins.filter((pin) => pin.id !== fromId));
}
