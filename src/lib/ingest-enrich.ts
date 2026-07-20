import { attachIngestImages } from "@/lib/ingest-images";
import { generateOpinionDraftsForEvents } from "@/lib/event-opinion-drafts";
import {
  fetchPendingEvents,
  patchEventFields,
} from "@/lib/firebase/events";
import type { Event } from "@/lib/types";

export type IngestEnrichOptions = {
  /** Max pending events to enrich this run (gateway budget). */
  limit?: number;
  /** Only these event ids. */
  eventIds?: string[];
  /** Skip image sourcing. */
  skipImages?: boolean;
  /** Skip opinion drafts. */
  skipOpinions?: boolean;
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
  imageResults: { id: string; title: string; imageUrl?: string; status: string }[];
  opinions: Awaited<ReturnType<typeof generateOpinionDraftsForEvents>> | null;
};

/**
 * Source validated images + POP opinion drafts for pending ingest events.
 * Intended as a post-ingest cron step (fast ingest skips both for gateway time).
 */
export async function enrichPendingIngestEvents(
  options: IngestEnrichOptions = {},
): Promise<IngestEnrichResult> {
  const limit = Math.max(1, options.limit ?? 8);
  const idFilter = options.eventIds?.length
    ? new Set(options.eventIds)
    : null;

  const pending = await fetchPendingEvents();
  const filtered = pending.filter((e) => {
    if (idFilter && !idFilter.has(e.id)) return false;
    return true;
  });

  const needsImage = filtered.filter(
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

  // Opinion candidates: imaged batch + other pending in filter (with venue).
  const opinionPoolMap = new Map<string, Event>();
  for (const e of imagedEvents) opinionPoolMap.set(e.id, e);
  for (const e of filtered) {
    if (!opinionPoolMap.has(e.id)) opinionPoolMap.set(e.id, e);
  }
  const opinionPool = [...opinionPoolMap.values()].slice(0, limit);

  const opinions = options.skipOpinions
    ? null
    : await generateOpinionDraftsForEvents(opinionPool, {
        limit: options.opinionLimit ?? Math.min(5, limit),
        skipExisting: true,
        // OTA tour titles often lack a Places match — still draft from listing copy.
        allowWithoutPlaces: true,
      });

  return {
    pendingTotal: pending.length,
    considered: Math.min(filtered.length, limit),
    imagesUpdated,
    imagesFailed,
    imageResults,
    opinions,
  };
}
