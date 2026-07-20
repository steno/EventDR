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
  // Skip bare city labels used as venue.
  if (
    /^(cabarete|sos[uú]a|puerto\s*plata|costambar|playa\s*dorada|north\s*coast)$/i.test(
      t,
    )
  ) {
    return false;
  }
  return true;
}

/**
 * Attach venueSlug (+ coords when known) for ingest/approve.
 * 1) Seed / alias match
 * 2) Else Places geocode → upsert lightweight Firestore venue
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

  const slug = slugifyVenue(hint);
  if (!slug) return event;

  const venue: Venue = {
    slug,
    name: place.displayName?.trim() || hint,
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
