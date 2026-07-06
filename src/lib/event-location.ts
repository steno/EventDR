import type { Event } from "./types";

const NORTH_COAST_CITY =
  /^(Puerto Plata|Sosúa|Sosua|Cabarete|Costambar|Playa Dorada|North Coast, DR)$/i;

const STREET_IN_TEXT =
  /\b(?:Calle|Av\.?|Avenida|Carretera|C\/| Blvd\.?|#)\s*[A-Za-zÁ-ú0-9][^,\n]{2,80}/i;

/** Display: venue, street address, city — omitting empty parts. */
export function formatEventPlace(
  event: Pick<Event, "venue" | "address" | "location">,
): string {
  const parts: string[] = [];
  if (event.venue?.trim()) parts.push(event.venue.trim());
  if (event.address?.trim()) parts.push(event.address.trim());
  const city = event.location?.trim();
  if (city && !parts.some((p) => p.toLowerCase() === city.toLowerCase())) {
    parts.push(city);
  }
  return parts.join(", ");
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

export function normalizeExtractedEvents(events: Event[]): Event[] {
  return events.map(normalizeEventLocation);
}
