import type { Event } from "./types";
import { normalizeEventLineup } from "./event-lineup";

const NORTH_COAST_CITY =
  /^(Puerto Plata|Sosúa|Sosua|Cabarete|Costambar|Playa Dorada|North Coast, DR)$/i;

const STREET_IN_TEXT =
  /\b(?:Calle|Av\.?|Avenida|Carretera|C\/| Blvd\.?|#)\s*[A-Za-zÁ-ú0-9][^,\n]{2,80}/i;

function samePlace(a?: string | null, b?: string | null): boolean {
  if (!a?.trim() || !b?.trim()) return false;
  return a.trim().toLowerCase() === b.trim().toLowerCase();
}

function pushUniquePlacePart(parts: string[], value?: string | null): void {
  const trimmed = value?.trim();
  if (!trimmed) return;
  const lower = trimmed.toLowerCase();
  if (parts.some((part) => part.toLowerCase() === lower)) return;
  parts.push(trimmed);
}

/** Display: venue, street address, city — omitting empty or duplicate parts. */
export function formatEventPlace(
  event: Pick<Event, "venue" | "address" | "location">,
): string {
  const parts: string[] = [];
  pushUniquePlacePart(parts, event.venue);
  pushUniquePlacePart(parts, event.address);
  if (event.location?.trim()) {
    for (const segment of event.location.split(/,\s*/)) {
      pushUniquePlacePart(parts, segment);
    }
  }
  return parts.join(", ");
}

/** Short place for list cards: venue name, else city — no street address. */
export function formatEventPlaceShort(
  event: Pick<Event, "venue" | "address" | "location">,
): string | null {
  if (event.venue?.trim()) return event.venue.trim();

  const location = event.location?.trim();
  if (!location) return null;

  if (NORTH_COAST_CITY.test(location)) return location;

  for (const segment of location.split(/,\s*/)) {
    const trimmed = segment.trim();
    if (trimmed && !STREET_IN_TEXT.test(trimmed)) return trimmed;
  }

  const first = location.split(/,\s*/)[0]?.trim();
  return first || null;
}

/** Maps / directions query — prefer street address when available. */
export function eventDirectionsQuery(
  event: Pick<Event, "venue" | "address" | "location">,
): string {
  const base = formatEventPlace(event);
  return base.includes("Dominican Republic") ? base : `${base}, Dominican Republic`;
}

/** Split a combined location string or fill missing address from source hints. */
export function normalizeEventLocation(event: Event): Event {
  let { venue, address, location } = event;

  if (!address && location && STREET_IN_TEXT.test(location)) {
    const match = location.match(STREET_IN_TEXT);
    if (match) {
      address = match[0].trim();
      location = location
        .replace(match[0], "")
        .replace(/^[\s,·-]+|[\s,·-]+$/g, "")
        .trim();
    }
  }

  if (!address && event.description && STREET_IN_TEXT.test(event.description)) {
    const match = event.description.match(STREET_IN_TEXT);
    if (match) address = match[0].trim();
  }

  if (location && address && location.toLowerCase().includes(address.toLowerCase())) {
    location = location
      .replace(new RegExp(address.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i"), "")
      .replace(/^[\s,·-]+|[\s,·-]+$/g, "")
      .trim();
  }

  if (!location || location.length < 2) {
    location = inferCity(event) ?? "North Coast, DR";
  }

  if (location && !NORTH_COAST_CITY.test(location) && address) {
    const city = inferCity(event);
    if (city && !location.toLowerCase().includes(city.toLowerCase())) {
      location = city;
    }
  }

  if (venue && address && samePlace(venue, address)) {
    venue = undefined;
  }

  if (venue && !address && STREET_IN_TEXT.test(venue)) {
    address = venue.trim();
    venue = undefined;
  }

  return { ...event, venue, address, location };
}

function inferCity(event: Event): string | null {
  const haystack = `${event.title} ${event.description} ${event.location ?? ""} ${event.venue ?? ""}`;
  if (/cabarete/i.test(haystack)) return "Cabarete";
  if (/sos[uú]a/i.test(haystack)) return "Sosúa";
  if (/costambar/i.test(haystack)) return "Costambar";
  if (/playa dorada/i.test(haystack)) return "Playa Dorada";
  if (/puerto plata/i.test(haystack)) return "Puerto Plata";
  return null;
}

export function sanitizeEventPlaceFields(event: Event): Event {
  let { venue, address, location } = event;

  if (venue && address && samePlace(venue, address)) {
    venue = undefined;
  }

  if (venue && !address && STREET_IN_TEXT.test(venue)) {
    address = venue.trim();
    venue = undefined;
  }

  return { ...event, venue, address, location };
}

export function normalizeExtractedEvents(events: Event[]): Event[] {
  return events.map((event) =>
    normalizeEventLineup(sanitizeEventPlaceFields(normalizeEventLocation(event))),
  );
}
