import type { Locale } from "@/i18n/config";
import type { Event } from "./types";
import { getFallbackEventById } from "./fallback-events";
import { getCommunityEvents } from "./community-store";
import { fetchEventById } from "./firebase/events";
import { attachCoords, attachVenueSlugs } from "./geo";
import { applyCuratedEventPatches } from "./curated-events";
import { attachEventImages } from "./event-images";
import { attachEventPhones } from "./event-phone";
import { filterRemovedSeedEvents } from "./removed-seeds";
import { localizeEventsForDisplay } from "./localized-text";
import { materializeEventDates } from "./event-dates";
import { withResolvedCategories } from "./categorize";

function finalizeEvent(event: Event, locale: Locale): Event | null {
  let [result] = attachCoords([event]);
  [result] = localizeEventsForDisplay([result], locale);
  [result] = applyCuratedEventPatches([result]);
  [result] = attachEventPhones([result]);
  [result] = attachEventImages([result]);

  const kept = filterRemovedSeedEvents([result]);
  if (kept.length === 0) return null;
  [result] = attachVenueSlugs(kept);

  // Recurring events get the next occurrence; one-offs keep their date even if past.
  if (result.recurrence) {
    const materialized = materializeEventDates([result]);
    if (materialized.length === 0) return null;
    result = materialized[0];
  }

  return withResolvedCategories(result);
}

export async function getEventById(
  id: string,
  locale: Locale,
): Promise<Event | null> {
  const dbEvent = await fetchEventById(id);
  if (dbEvent) return finalizeEvent(dbEvent, locale);

  const fallback = getFallbackEventById(id, locale);
  if (fallback) return finalizeEvent(fallback, locale);

  const community = getCommunityEvents().find((e) => e.id === id);
  if (community) return finalizeEvent(community, locale);

  return null;
}
