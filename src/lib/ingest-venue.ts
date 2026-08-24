import type { Event, Venue } from "@/lib/types";
import { getSeedVenue, matchVenueSlug } from "@/lib/venues-seed";
import { findPlaceLocation } from "@/lib/google-places";
import { upsertVenue } from "@/lib/firebase/events";

function slugifyVenue(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 48);
}

function looksLikeRealVenueName(name: string): boolean {
  const t = name.trim();
  if (t.length < 4 || t.length > 80) return false;
  // Skip bare city / municipality labels used as venue.
  if (
    /^(cabarete|sos[uú]a|puerto\s*plata|san\s*felipe(\s*de\s*puerto\s*plata)?|costambar|playa\s*dorada|imbert|north\s*coast)$/i.test(
      t,
    )
  ) {
    return false;
  }
  return true;
}

/** Strip punctuation / diacritics for containment checks. */
export function compactVenueName(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "");
}

const VENUE_NAME_STOPWORDS = new Set([
  "the",
  "a",
  "an",
  "and",
  "at",
  "of",
  "de",
  "la",
  "el",
  "los",
  "las",
  "del",
  "bar",
  "restaurant",
  "restaurante",
  "hotel",
  "resort",
  "club",
  "cafe",
  "café",
  "studio",
  "gym",
  "center",
  "centre",
  "camp",
  "camps",
]);

/** Content tokens used for venue-name similarity. */
export function venueNameTokens(name: string): string[] {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9\s]+/g, " ")
    .split(/\s+/)
    .map((t) => t.trim())
    .filter((t) => t.length >= 2 && !VENUE_NAME_STOPWORDS.has(t));
}

/**
 * True when two venue labels likely refer to the same place.
 * Rejects weak Places matches like "Rafaella's Studio" → "Cabarete fitness".
 */
export function venueNamesAreCompatible(a: string, b: string): boolean {
  const left = a.trim();
  const right = b.trim();
  if (!left || !right) return false;

  const ca = compactVenueName(left);
  const cb = compactVenueName(right);
  if (!ca || !cb) return false;
  if (ca === cb) return true;
  if (ca.length >= 5 && cb.length >= 5 && (ca.includes(cb) || cb.includes(ca))) {
    return true;
  }

  const ta = venueNameTokens(left);
  const tb = venueNameTokens(right);
  if (ta.length === 0 || tb.length === 0) return false;

  const setB = new Set(tb);
  const overlap = ta.filter((t) => setB.has(t)).length;
  if (overlap === 0) return false;

  const shorter = Math.min(ta.length, tb.length);
  // Single distinctive token (e.g. "Smileys" vs "Smiley's Bar") — require exact token hit.
  if (shorter === 1) return overlap >= 1;
  // Multi-token: need most of the shorter name to appear in the longer.
  return overlap >= Math.ceil(shorter * 0.6);
}

export type PlacesVenueDecision =
  | { action: "use-seed"; slug: string }
  | { action: "create-stub"; name: string }
  | { action: "skip"; reason: "weak-match" | "seed-mismatch" };

/**
 * Decide how to use a Places Text Search hit for an event venue hint.
 * - Rematch Places displayName to curated seeds when the hint is compatible
 * - Otherwise allow a dynamic stub only when names look like the same place
 * - Skip when Places returned a different business (avoids stub pages with no copy/image)
 */
export function decidePlacesVenueLink(
  hint: string,
  placeDisplayName: string | undefined,
): PlacesVenueDecision {
  const display = placeDisplayName?.trim() || hint.trim();
  const seedSlug =
    matchVenueSlug(display) ??
    (placeDisplayName ? matchVenueSlug(placeDisplayName) : undefined);

  if (seedSlug && getSeedVenue(seedSlug)) {
    const seed = getSeedVenue(seedSlug)!;
    const hintCompatible =
      matchVenueSlug(hint) === seedSlug ||
      venueNamesAreCompatible(hint, seed.name) ||
      venueNamesAreCompatible(hint, display);
    if (hintCompatible) {
      return { action: "use-seed", slug: seedSlug };
    }
    // Places snapped to a known venue that the event did not name — do not mislink.
    return { action: "skip", reason: "seed-mismatch" };
  }

  if (!venueNamesAreCompatible(hint, display)) {
    return { action: "skip", reason: "weak-match" };
  }

  return { action: "create-stub", name: display };
}

/**
 * Attach venueSlug (+ coords when known) for ingest/approve.
 * 1) Seed / alias match
 * 2) Else Places geocode → seed rematch or similarity-gated stub
 */
export async function resolveEventVenue(event: Event): Promise<Event> {
  if (event.venueSlug && getSeedVenue(event.venueSlug)) {
    const seed = getSeedVenue(event.venueSlug)!;
    return {
      ...event,
      venue: event.venue?.trim() || seed.name,
      lat: seed.lat,
      lng: seed.lng,
    };
  }

  const hint = event.venue?.trim() || undefined;
  const matched =
    matchVenueSlug(hint) ??
    matchVenueSlug(event.title) ??
    matchVenueSlug(event.location);

  if (matched) {
    const seed = getSeedVenue(matched);
    if (seed) {
      return {
        ...event,
        venueSlug: matched,
        venue: event.venue?.trim() || seed.name,
        lat: seed.lat,
        lng: seed.lng,
      };
    }
  }

  if (!hint || !looksLikeRealVenueName(hint)) {
    return event;
  }

  // Lightweight dynamic venue from Places (when configured).
  const place = await findPlaceLocation(hint, event.location);
  if (!place) return event;

  const decision = decidePlacesVenueLink(hint, place.displayName);

  if (decision.action === "skip") {
    return event;
  }

  if (decision.action === "use-seed") {
    const seed = getSeedVenue(decision.slug);
    if (!seed) return event;
    return {
      ...event,
      venueSlug: seed.slug,
      venue: event.venue?.trim() || seed.name,
      lat: seed.lat,
      lng: seed.lng,
    };
  }

  const slug = slugifyVenue(hint);
  if (!slug) return event;

  const venue: Venue = {
    slug,
    name: decision.name,
    city: event.location || "Cabarete",
    description: `North Coast place linked from ingested events (${hint}).`,
    lat: place.lat,
    lng: place.lng,
    emoji: "📍",
    googlePlaceId: place.placeId,
  };

  await upsertVenue(venue);

  return {
    ...event,
    venueSlug: slug,
    venue: venue.name,
    lat: venue.lat,
    lng: venue.lng,
  };
}

export async function resolveEventVenues(events: Event[]): Promise<Event[]> {
  const out: Event[] = [];
  for (const event of events) {
    out.push(await resolveEventVenue(event));
  }
  return out;
}
