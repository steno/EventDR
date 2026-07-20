import { attachIngestImages } from "@/lib/ingest-images";
import { getEventImageUrl } from "@/lib/event-images";
import { generateOpinionDraftsForEvents } from "@/lib/event-opinion-drafts";
import { resolveEventVenue } from "@/lib/ingest-venue";
import {
  fetchApprovedEvents,
  fetchApprovedEventsMissingImages,
  fetchEventsByIds,
  fetchPendingEvents,
  patchEventFields,
} from "@/lib/firebase/events";
import type { Event } from "@/lib/types";

export type IngestEnrichOptions = {
  /** Max events to enrich this run (gateway budget). */
  limit?: number;
  /** Only these event ids (any status — for live backfill). */
  eventIds?: string[];
  /** Also enrich approved events that are missing images. */
  includeApprovedMissingImages?: boolean;
  /** Skip image sourcing. */
  skipImages?: boolean;
  /** Skip opinion drafts. */
  skipOpinions?: boolean;
  /** Skip venue linking. */
  skipVenues?: boolean;
  /** Max opinion drafts to attempt. */
  opinionLimit?: number;
  /** Re-source images even when imageUrl is already set. */
  forceImages?: boolean;
};

export type IngestEnrichResult = {
  pendingTotal: number;
  considered: number;
  imagesUpdated: number;
  imagesFailed: number;
  venuesUpdated: number;
  imageResults: { id: string; title: string; imageUrl?: string; status: string }[];
  venueResults: { id: string; venueSlug?: string; status: string }[];
  opinions: Awaited<ReturnType<typeof generateOpinionDraftsForEvents>> | null;
};

function mergeById(events: Event[]): Event[] {
  const map = new Map<string, Event>();
  for (const e of events) map.set(e.id, e);
  return [...map.values()];
}

/**
 * Source validated images, link venues, and draft POP opinions for ingest events.
 */
export async function enrichPendingIngestEvents(
  options: IngestEnrichOptions = {},
): Promise<IngestEnrichResult> {
  const limit = Math.max(1, options.limit ?? 8);

  const pending = await fetchPendingEvents();
  let pool: Event[] = [];

  if (options.eventIds?.length) {
    pool = await fetchEventsByIds(options.eventIds);
  } else {
    pool = [...pending];
    if (options.includeApprovedMissingImages !== false) {
      const approvedMissing = await fetchApprovedEventsMissingImages(limit * 2);
      const approved = await fetchApprovedEvents();
      const missingVenue = approved
        .filter((e) => !e.venueSlug?.trim() && (e.venue?.trim() || e.id.startsWith("ingest-")))
        .slice(0, limit);
      const prioritized = approvedMissing
        .filter((e) => !getEventImageUrl(e.id))
        .sort((a, b) => {
          const aScore = a.id.startsWith("ingest-") ? 0 : 1;
          const bScore = b.id.startsWith("ingest-") ? 0 : 1;
          if (aScore !== bScore) return aScore - bScore;
          return b.id.localeCompare(a.id);
        });
      pool = mergeById([...pool, ...prioritized, ...missingVenue]);
    }
  }

  const filtered = pool.filter((e) => e.status !== "rejected");

  // Venue linking first so opinions/images can use venueSlug.
  const venueResults: IngestEnrichResult["venueResults"] = [];
  let venuesUpdated = 0;
  const withVenues: Event[] = [];

  if (!options.skipVenues) {
    for (const event of filtered.slice(0, limit)) {
      if (event.venueSlug?.trim()) {
        withVenues.push(event);
        venueResults.push({
          id: event.id,
          venueSlug: event.venueSlug,
          status: "unchanged",
        });
        continue;
      }
      const resolved = await resolveEventVenue(event);
      if (resolved.venueSlug && resolved.venueSlug !== event.venueSlug) {
        const ok = await patchEventFields(event.id, {
          venueSlug: resolved.venueSlug,
          venue: resolved.venue,
          lat: resolved.lat,
          lng: resolved.lng,
        });
        if (ok) {
          venuesUpdated++;
          withVenues.push(resolved);
          venueResults.push({
            id: event.id,
            venueSlug: resolved.venueSlug,
            status: "updated",
          });
          continue;
        }
        venueResults.push({ id: event.id, status: "patch_failed" });
        withVenues.push(event);
        continue;
      }
      withVenues.push(event);
      venueResults.push({ id: event.id, status: "unresolved" });
    }
  } else {
    withVenues.push(...filtered.slice(0, limit));
  }

  const needsImage = withVenues.filter(
    (e) => options.forceImages || !e.imageUrl?.trim(),
  );
  const toImage = options.skipImages ? [] : needsImage.slice(0, limit);

  const imageResults: IngestEnrichResult["imageResults"] = [];
  let imagesUpdated = 0;
  let imagesFailed = 0;
  const imagedEvents: Event[] = [];

  if (toImage.length > 0) {
    const withImages = await attachIngestImages(toImage);
    for (const event of withImages) {
      const original = toImage.find((e) => e.id === event.id);
      const nextUrl = event.imageUrl?.trim();
      if (nextUrl && nextUrl !== original?.imageUrl?.trim()) {
        const ok = await patchEventFields(event.id, { imageUrl: nextUrl });
        if (ok) {
          imagesUpdated++;
          imagedEvents.push({ ...event, imageUrl: nextUrl });
          imageResults.push({
            id: event.id,
            title: event.title,
            imageUrl: nextUrl,
            status: "updated",
          });
          continue;
        }
        imagesFailed++;
        imageResults.push({
          id: event.id,
          title: event.title,
          status: "patch_failed",
        });
        continue;
      }
      if (nextUrl) {
        imagedEvents.push(event);
        imageResults.push({
          id: event.id,
          title: event.title,
          imageUrl: nextUrl,
          status: "unchanged",
        });
      } else {
        imagesFailed++;
        imageResults.push({
          id: event.id,
          title: event.title,
          status: "no_valid_image",
        });
      }
    }
  }

  const opinionPoolMap = new Map<string, Event>();
  for (const e of imagedEvents) opinionPoolMap.set(e.id, e);
  for (const e of withVenues) {
    if (!opinionPoolMap.has(e.id)) opinionPoolMap.set(e.id, e);
  }
  const opinionPool = [...opinionPoolMap.values()].slice(0, limit);

  const opinions = options.skipOpinions
    ? null
    : await generateOpinionDraftsForEvents(opinionPool, {
        limit: options.opinionLimit ?? Math.min(5, limit),
        skipExisting: true,
        allowWithoutPlaces: true,
      });

  return {
    pendingTotal: pending.length,
    considered: Math.min(filtered.length, limit),
    imagesUpdated,
    imagesFailed,
    venuesUpdated,
    imageResults,
    venueResults,
    opinions,
  };
}
