import { getEventImageUrl } from "@/lib/event-images";
import {
  isWeakIngestImageUrl,
  prepareEventForPublish,
} from "@/lib/ingest-quality";
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
  phonesUpdated: number;
  opinionsApproved: number;
  imageResults: { id: string; title: string; imageUrl?: string; status: string }[];
  venueResults: { id: string; venueSlug?: string; status: string }[];
  opinions: {
    drafted: number;
    skipped: number;
    failed: number;
    approved: number;
  } | null;
};

function mergeById(events: Event[]): Event[] {
  const map = new Map<string, Event>();
  for (const e of events) map.set(e.id, e);
  return [...map.values()];
}

/**
 * Editorial prep for pending (and approved-gap) ingest events:
 * venue, phone, validated image, POP opinion draft + auto-publish when evidence is solid.
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
      const weakImages = approved
        .filter(
          (e) =>
            e.imageUrl?.trim() &&
            isWeakIngestImageUrl(e.imageUrl, e) &&
            !getEventImageUrl(e.id),
        )
        .slice(0, limit);
      const missingVenue = approved
        .filter(
          (e) =>
            !e.venueSlug?.trim() &&
            (e.venue?.trim() || e.id.startsWith("ingest-")),
        )
        .slice(0, limit);
      const prioritized = approvedMissing
        .filter((e) => !getEventImageUrl(e.id))
        .sort((a, b) => {
          const aScore = a.id.startsWith("ingest-") ? 0 : 1;
          const bScore = b.id.startsWith("ingest-") ? 0 : 1;
          if (aScore !== bScore) return aScore - bScore;
          return b.id.localeCompare(a.id);
        });
      pool = mergeById([...pool, ...prioritized, ...missingVenue, ...weakImages]);
    }
  }

  const filtered = pool.filter((e) => e.status !== "rejected");
  const toProcess = filtered.slice(0, limit);

  const imageResults: IngestEnrichResult["imageResults"] = [];
  const venueResults: IngestEnrichResult["venueResults"] = [];
  let imagesUpdated = 0;
  let imagesFailed = 0;
  let venuesUpdated = 0;
  let phonesUpdated = 0;
  let opinionsApproved = 0;
  let drafted = 0;
  let skipped = 0;
  let failed = 0;

  for (const event of toProcess) {
    if (options.skipImages && options.skipVenues && options.skipOpinions) {
      continue;
    }

    const prepared = await prepareEventForPublish(event, {
      forceImage: options.forceImages ?? false,
      skipOpinions: options.skipOpinions ?? false,
    });

    const patch: Record<string, unknown> = {};
    if (!options.skipVenues) {
      for (const key of [
        "venueSlug",
        "venue",
        "venueName",
        "location",
        "description",
        "lat",
        "lng",
      ] as const) {
        if (key in prepared.fields) patch[key] = prepared.fields[key];
      }
    }
    if (!options.skipImages && "imageUrl" in prepared.fields) {
      patch.imageUrl = prepared.fields.imageUrl;
    }
    if ("phone" in prepared.fields) {
      patch.phone = prepared.fields.phone;
    }

    if (Object.keys(patch).length > 0) {
      const ok = await patchEventFields(event.id, patch);
      if (!ok) {
        imageResults.push({
          id: event.id,
          title: event.title,
          status: "patch_failed",
        });
        failed++;
        continue;
      }

      if ("venueSlug" in patch) venuesUpdated++;
      if ("phone" in patch) phonesUpdated++;
      if ("imageUrl" in patch) {
        if (prepared.imageReplaced || !event.imageUrl?.trim()) {
          imagesUpdated++;
          imageResults.push({
            id: event.id,
            title: event.title,
            imageUrl: prepared.event.imageUrl,
            status: "updated",
          });
        } else {
          imageResults.push({
            id: event.id,
            title: event.title,
            imageUrl: prepared.event.imageUrl,
            status: "unchanged",
          });
        }
      }

      venueResults.push({
        id: event.id,
        venueSlug: prepared.event.venueSlug,
        status: prepared.event.venueSlug !== event.venueSlug ? "updated" : "unchanged",
      });
    } else {
      venueResults.push({
        id: event.id,
        venueSlug: event.venueSlug,
        status: event.venueSlug ? "unchanged" : "unresolved",
      });
      if (event.imageUrl?.trim()) {
        imageResults.push({
          id: event.id,
          title: event.title,
          imageUrl: event.imageUrl,
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

    if (!options.skipOpinions && prepared.opinion) {
      if (prepared.opinion.status === "drafted") drafted++;
      else if (prepared.opinion.status === "skipped") skipped++;
      else if (prepared.opinion.status === "failed") failed++;
    }
    if (prepared.opinionApproved) opinionsApproved++;
  }

  return {
    pendingTotal: pending.length,
    considered: toProcess.length,
    imagesUpdated,
    imagesFailed,
    venuesUpdated,
    phonesUpdated,
    opinionsApproved,
    imageResults,
    venueResults,
    opinions: options.skipOpinions
      ? null
      : { drafted, skipped, failed, approved: opinionsApproved },
  };
}
