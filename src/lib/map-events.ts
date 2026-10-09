import { hasMapCoords, resolveEventCoords } from "@/lib/event-coords";
import { eventInCategory } from "@/lib/categorize";
import { haversineMeters } from "@/lib/distance";
import { filterByTimeRange, type TimeRange } from "@/lib/filters";
import type { Event, EventCategory, Venue } from "@/lib/types";
import { pinColorForCategory } from "@/lib/map-style";

export type MapTimeFilter = Extract<TimeRange, "all" | "today" | "weekend">;

/** Venue deep-link pin when the place has no upcoming event pins. */
export const VENUE_ONLY_PIN_COLOR = "#ea580c";

export type MapPin = {
  id: string;
  lat: number;
  lng: number;
  color: string;
  category: EventCategory;
  events: Event[];
  /** First event image for the pin thumbnail (if any). */
  thumbUrl?: string;
  /** Set when `?venue=` opens a place with no upcoming listings. */
  venueOnly?: { slug: string; name: string; city?: string };
  /**
   * Screen-space Marker offset `[x, y]` (px; negative = left / up) when several
   * venue pins share the same rounded GPS — keeps separate tips readable.
   */
  stackOffset?: [number, number];
  /** 0 = back of the visual stack; higher draws on top. */
  stackIndex?: number;
};

/** ~1.1 m at equator — used to detect shared GPS for visual fanning. */
function pinKey(lat: number, lng: number): string {
  return `${lat.toFixed(5)},${lng.toFixed(5)}`;
}

/**
 * Prefer venue slug so co-located businesses get separate pins.
 * Fall back to rounded lat/lng for events without a slug.
 */
function pinGroupKey(
  event: Pick<Event, "venueSlug">,
  coords: { lat: number; lng: number },
): string {
  const slug = event.venueSlug?.trim();
  if (slug) return `venue:${slug}`;
  return pinKey(coords.lat, coords.lng);
}

/** Horizontal step (px) between fanned tips at the same GPS. */
const STACK_STEP_X = 18;
/** Upward step (px) so the stack reads as cards, not a blob. */
const STACK_STEP_Y = 14;

/**
 * Fan markers that share rounded lat/lng so each venue stays its own pin.
 */
export function withVisualPinStacks(pins: MapPin[]): MapPin[] {
  const byCoord = new Map<string, MapPin[]>();
  for (const pin of pins) {
    const key = pinKey(pin.lat, pin.lng);
    const list = byCoord.get(key);
    if (list) list.push(pin);
    else byCoord.set(key, [pin]);
  }

  return pins.map((pin) => {
    const group = byCoord.get(pinKey(pin.lat, pin.lng));
    if (!group || group.length < 2) return pin;
    const sorted = [...group].sort((a, b) => a.id.localeCompare(b.id));
    const index = sorted.findIndex((p) => p.id === pin.id);
    const mid = (sorted.length - 1) / 2;
    return {
      ...pin,
      stackIndex: index,
      stackOffset: [
        Math.round((index - mid) * STACK_STEP_X),
        Math.round(-index * STACK_STEP_Y),
      ],
    };
  });
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

/**
 * One pin per venue (or bare coordinate); stacks multiple events at that pin.
 * Distinct `venueSlug`s stay separate even when GPS rounds to the same spot —
 * {@link withVisualPinStacks} fans those markers so tips stay tappable.
 */
export function buildMapPins(events: Event[]): MapPin[] {
  const groups = new Map<string, MapPin>();

  for (const event of events) {
    const coords = resolveEventCoords(event);
    if (!coords) continue;
    const key = pinGroupKey(event, coords);
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

  return withVisualPinStacks([...groups.values()]);
}

/** Stable id for a venue-only deep-link pin (no upcoming events). */
export function venueOnlyPinId(slug: string): string {
  return `venue:${slug}`;
}

export function buildVenueOnlyMapPin(
  venue: Pick<Venue, "slug" | "name" | "city" | "lat" | "lng">,
  thumbUrl?: string,
): MapPin {
  return {
    id: venueOnlyPinId(venue.slug),
    lat: venue.lat,
    lng: venue.lng,
    color: VENUE_ONLY_PIN_COLOR,
    category: "parties",
    events: [],
    ...(thumbUrl ? { thumbUrl } : {}),
    venueOnly: { slug: venue.slug, name: venue.name, city: venue.city },
  };
}

/**
 * When “See the area” deep-links a venue with no upcoming event pin, append a
 * venue marker so the map still shows a tip at the place (not a blank fly-to).
 * Does not steal a nearby neighbor’s pin in dense complexes (e.g. Costa Dorada).
 */
export function withVenueDeepLinkPin(
  pins: MapPin[],
  venue: Pick<Venue, "slug" | "name" | "city" | "lat" | "lng"> | null | undefined,
  thumbUrl?: string,
): MapPin[] {
  if (!venue || !hasMapCoords(venue)) return pins;
  const slug = venue.slug;
  if (
    pins.some(
      (pin) =>
        pin.venueOnly?.slug === slug ||
        pin.events.some((event) => event.venueSlug === slug),
    )
  ) {
    return pins;
  }
  return withVisualPinStacks([...pins, buildVenueOnlyMapPin(venue, thumbUrl)]);
}

/** Max hop on card-close “swing next”; farther pins zoom back to overview. */
export const SWING_NEXT_MAX_METERS = 1_000;

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
