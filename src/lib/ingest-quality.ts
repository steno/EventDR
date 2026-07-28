/**
 * Editorial quality gate for ingested events — images, venue copy, phones, opinions.
 * Used by ingest-enrich and approveEvent so moderation is mostly yes/no.
 */
import type { Event } from "@/lib/types";
import type { EventOpinionDraft } from "@/lib/firebase/opinion-drafts";
import { getOpinionDraft, setOpinionDraftStatus } from "@/lib/firebase/opinion-drafts";
import { getSeedVenue } from "@/lib/venues-seed";
import { getVenueImageUrl } from "@/lib/venue-images";
import { normalizeEventPhone, resolveEventPhone } from "@/lib/event-phone";
import { fetchPlacePhone } from "@/lib/google-places";
import { sourceEventImageUrl } from "@/lib/ingest-images";
import { resolveEventVenue } from "@/lib/ingest-venue";
import {
  generateOpinionDraftForEvent,
  type DraftGenerationResult,
} from "@/lib/event-opinion-drafts";

/** OTA / stock hosts — not event or venue photos. */
const WEAK_IMAGE_HOST_RE =
  /(?:^|\.)evendo\.com|unsplash\.com|pexels\.com|pixabay\.com|shutterstock\.com|gettyimages\.com|istockphoto\.com|depositphotos\.com|123rf\.com|alamy\.com|dreamstime\.com|freepik\.com|stock\.adobe\.com/i;

const WEAK_IMAGE_PATH_RE =
  /\/(?:thumb|thumbnail|preview|placeholder|360x263|320x240|200x200|150x150)(?:[_/-]|\.)/i;

/** True when an image URL is unlikely to represent this event or venue. */
export function isWeakIngestImageUrl(
  url: string | undefined,
  event?: Pick<Event, "title" | "venue" | "venueSlug">,
): boolean {
  const trimmed = url?.trim();
  if (!trimmed) return true;
  if (!/^https?:\/\//i.test(trimmed)) return false;

  try {
    const parsed = new URL(trimmed);
    if (WEAK_IMAGE_HOST_RE.test(parsed.hostname)) return true;
    if (WEAK_IMAGE_PATH_RE.test(parsed.pathname)) return true;
  } catch {
    return true;
  }

  // Generic beach/stock queries often lack venue/event tokens in the URL.
  if (event?.venueSlug && getVenueImageUrl(event.venueSlug)) {
    // Prefer curated venue art over unknown remote URLs when we have a local asset.
    if (WEAK_IMAGE_HOST_RE.test(trimmed)) return true;
  }

  return false;
}

/** Build a search hint that prioritizes venue over performer name. */
export function ingestImageSearchHint(event: Event): string {
  const seed = event.venueSlug ? getSeedVenue(event.venueSlug) : undefined;
  const venue = seed?.name ?? event.venue?.trim();
  if (venue) return `${venue} ${event.location} nightclub restaurant`;
  return `${event.title} ${event.location} live music`;
}

/** Align description venue name with the canonical seed venue when linked. */
export function normalizeEventVenueCopy(event: Event): Event {
  if (!event.venueSlug) return event;
  const seed = getSeedVenue(event.venueSlug);
  if (!seed) return event;

  let description = event.description;
  const wrongMoncion = /cacique\s+monci[oó]n/i;
  if (wrongMoncion.test(description) && !seed.name.toLowerCase().includes("moncion")) {
    description = description.replace(wrongMoncion, seed.name);
  }

  return {
    ...event,
    venue: seed.name,
    location: seed.city,
    description,
  };
}

async function resolvePhoneForEvent(event: Event): Promise<string | undefined> {
  const explicit = normalizeEventPhone(event.phone);
  if (explicit) return explicit;

  const fromAttach = resolveEventPhone(event);
  if (fromAttach) return fromAttach;

  const seed = event.venueSlug ? getSeedVenue(event.venueSlug) : undefined;
  if (seed?.phone) return seed.phone;

  const placeId = seed?.googlePlaceId;
  if (placeId) {
    const fromPlaces = await fetchPlacePhone(placeId);
    if (fromPlaces) return fromPlaces;
  }

  return undefined;
}

export function canAutoApproveOpinionDraft(draft: EventOpinionDraft): boolean {
  const body = draft.body?.trim() ?? "";
  if (body.length < 24) return false;

  const rating = draft.googleRating ?? draft.places?.rating;
  const count = draft.googleReviewCount ?? draft.places?.reviewCount ?? 0;
  if (typeof rating === "number" && rating >= 3.5 && count >= 5) return true;

  // Listing-only draft (no Places) — still publish when copy is substantive.
  if (
    body.length >= 48 &&
    draft.attribution?.includes("POP research") &&
    !draft.attribution.includes("not published")
  ) {
    return true;
  }

  return false;
}

async function autoApproveOpinionIfReady(eventId: string): Promise<boolean> {
  const draft = await getOpinionDraft(eventId);
  if (!draft || draft.status !== "draft") return draft?.status === "approved";
  if (!canAutoApproveOpinionDraft(draft)) return false;
  const updated = await setOpinionDraftStatus(eventId, "approved");
  return updated?.status === "approved";
}

export type PrepareEventResult = {
  event: Event;
  fields: Record<string, unknown>;
  imageReplaced: boolean;
  opinion?: DraftGenerationResult;
  opinionApproved: boolean;
};

/**
 * Full editorial prep before approve or during enrich:
 * venue link, copy, phone, validated image, opinion draft + auto-publish.
 */
export async function prepareEventForPublish(
  event: Event,
  options?: { forceImage?: boolean; skipOpinions?: boolean },
): Promise<PrepareEventResult> {
  let working = normalizeEventVenueCopy(await resolveEventVenue(event));
  const fields: Record<string, unknown> = {};
  let imageReplaced = false;

  if (working.venueSlug && working.venueSlug !== event.venueSlug) {
    fields.venueSlug = working.venueSlug;
  }
  if (working.venue && working.venue !== event.venue) {
    fields.venue = working.venue;
    fields.venueName = working.venue;
  }
  if (working.location && working.location !== event.location) {
    fields.location = working.location;
  }
  if (working.description !== event.description) {
    fields.description = working.description;
  }
  if (typeof working.lat === "number") fields.lat = working.lat;
  if (typeof working.lng === "number") fields.lng = working.lng;

  const phone = await resolvePhoneForEvent(working);
  if (phone && phone !== event.phone) {
    working = { ...working, phone };
    fields.phone = phone;
  }

  const needsImage =
    options?.forceImage ||
    !working.imageUrl?.trim() ||
    isWeakIngestImageUrl(working.imageUrl, working);

  if (needsImage) {
    const venueFallback =
      working.venueSlug ? getVenueImageUrl(working.venueSlug) : undefined;

    const sourced = await sourceEventImageUrl(
      working.id,
      [working.sourceUrl, working.ticketUrl],
      ingestImageSearchHint(working),
    );

    const nextUrl =
      sourced && !isWeakIngestImageUrl(sourced, working)
        ? sourced
        : venueFallback;

    if (nextUrl && nextUrl !== working.imageUrl) {
      working = { ...working, imageUrl: nextUrl };
      fields.imageUrl = nextUrl;
      imageReplaced = true;
    } else if (
      working.imageUrl &&
      isWeakIngestImageUrl(working.imageUrl, working) &&
      venueFallback
    ) {
      working = { ...working, imageUrl: venueFallback };
      fields.imageUrl = venueFallback;
      imageReplaced = true;
    } else if (
      working.imageUrl &&
      isWeakIngestImageUrl(working.imageUrl, working)
    ) {
      working = { ...working, imageUrl: undefined };
      fields.imageUrl = null;
      imageReplaced = true;
    }
  }

  const opinion = options?.skipOpinions
    ? undefined
    : await generateOpinionDraftForEvent(working, {
        skipExisting: true,
        allowWithoutPlaces: true,
      });

  let opinionApproved = false;
  if (!options?.skipOpinions) {
    opinionApproved = await autoApproveOpinionIfReady(working.id);
    if (!opinionApproved && opinion?.status === "drafted" && opinion.draft) {
      if (canAutoApproveOpinionDraft(opinion.draft)) {
        opinionApproved =
          (await setOpinionDraftStatus(working.id, "approved"))?.status ===
          "approved";
      }
    }
  }

  return {
    event: working,
    fields,
    imageReplaced,
    opinion,
    opinionApproved,
  };
}
