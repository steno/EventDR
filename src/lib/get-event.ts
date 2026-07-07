import type { Locale } from "@/i18n/config";
import type { Event } from "./types";
import { getFallbackEvents } from "./fallback-events";
import { getCommunityEvents } from "./community-store";
import { fetchEventById } from "./firebase/events";
import { attachCoords, attachVenueSlugs } from "./geo";
import { applyCuratedEventPatches } from "./curated-events";
import { attachEventImages } from "./event-images";
import { filterRemovedSeedEvents } from "./removed-seeds";
import { localizeEventsForDisplay } from "./localized-text";
import { materializeEventDates } from "./event-dates";

function finalizeEvent(event: Event, locale: Locale): Event {
  let [result] = attachCoords([event]);
  [result] = localizeEventsForDisplay([result], locale);
  [result] = applyCuratedEventPatches([result]);
  [result] = attachEventImages([result]);
  [result] = attachVenueSlugs(filterRemovedSeedEvents([result]));
  [result] = materializeEventDates([result]);
  return result;
}

export async function getEventById(
  id: string,
  locale: Locale,
): Promise<Event | null> {
  const dbEvent = await fetchEventById(id);
  if (dbEvent) return finalizeEvent(dbEvent, locale);

  const fallback = getFallbackEvents(locale).find((e) => e.id === id);
  if (fallback) return finalizeEvent(fallback, locale);

  const community = getCommunityEvents().find((e) => e.id === id);
  if (community) return finalizeEvent(community, locale);

  return null;
}
