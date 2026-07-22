import { unstable_cache } from "next/cache";
import type { Locale } from "@/i18n/config";
import type { Event } from "./types";
import { getFallbackEventById } from "./fallback-events";
import { getCommunityEvents } from "./community-store";
import { fetchEventById } from "./firebase/events";
import { attachVenueSlugs, normalizeEventCoords } from "./geo";
import { applyCuratedEventPatches } from "./curated-events";
import { attachEventImages } from "./event-images";
import { withAdmissionMetadata } from "./event-tickets";
import { attachEventPhones } from "./event-phone";
import { filterRemovedSeedEvents } from "./removed-seeds";
import { applyTemporaryClosures } from "./temporary-closures";
import { localizeEventsForDisplay } from "./localized-text";
import { materializeEventDates } from "./event-dates";
import { withResolvedCategories } from "./categorize";
import { EVENT_REVALIDATE_SECONDS } from "./http-cache";

function finalizeEvent(event: Event, locale: Locale): Event | null {
  let [result] = attachVenueSlugs([event]);
  // Curated patches may update localized copy — resolve locale after merging.
  [result] = applyCuratedEventPatches([result]);
  [result] = applyTemporaryClosures([result], locale);
  [result] = localizeEventsForDisplay([result], locale);
  result = normalizeEventCoords(result);
  [result] = attachEventPhones([result]);
  result = withAdmissionMetadata(result);
  [result] = attachEventImages([result]);

  const kept = filterRemovedSeedEvents([result]);
  if (kept.length === 0) return null;
  result = kept[0];

  // Recurring events get the next occurrence; one-offs keep their date even if past.
  if (result.recurrence) {
    const materialized = materializeEventDates([result]);
    if (materialized.length === 0) return null;
    result = materialized[0];
  }

  return withResolvedCategories(result);
}

async function loadEventById(
  id: string,
  locale: Locale,
): Promise<Event | null> {
  try {
    const dbEvent = await fetchEventById(id);
    if (dbEvent) return finalizeEvent(dbEvent, locale);
  } catch (error) {
    console.error("getEventById: database lookup failed, using fallback:", id, error);
  }

  const fallback = getFallbackEventById(id, locale);
  if (fallback) return finalizeEvent(fallback, locale);

  const community = getCommunityEvents().find((e) => e.id === id);
  if (community) return finalizeEvent(community, locale);

  return null;
}

const getCachedEventById = unstable_cache(
  loadEventById,
  ["event-by-id-v3"],
  { revalidate: EVENT_REVALIDATE_SECONDS, tags: ["events"] },
);

export async function getEventById(
  id: string,
  locale: Locale,
): Promise<Event | null> {
  return getCachedEventById(id, locale);
}
