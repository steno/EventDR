import { unstable_cache } from "next/cache";
import type { Locale } from "@/i18n/config";
import { attachEventImages } from "@/lib/event-images";
import { attachTicketUrls } from "@/lib/event-tickets";
import { attachEventPhones } from "@/lib/event-phone";
import { materializeEventDates } from "@/lib/event-dates";
import { sortEventsForDisplay } from "@/lib/event-sort";
import { attachCoords, attachVenueSlugs, normalizeEventCoordsList } from "@/lib/geo";
import { applyCuratedEventPatches } from "@/lib/curated-events";
import { filterRemovedSeedEvents } from "@/lib/removed-seeds";
import { applyTemporaryClosures } from "@/lib/temporary-closures";
import { localizeEventsForDisplay } from "@/lib/localized-text";
import { getFallbackEvents, getFallbackForCategory } from "@/lib/fallback-events";
import { getCommunityEvents } from "@/lib/community-store";
import { fetchApprovedEvents } from "@/lib/firebase/events";
import type { CitySlug } from "@/lib/cities";
import { eventMatchesCity } from "@/lib/cities";
import type { TimeRange } from "@/lib/filters";
import { filterByTimeRange } from "@/lib/filters";
import { eventInCategory, withResolvedCategories } from "@/lib/categorize";
import { LISTING_REVALIDATE_SECONDS } from "@/lib/http-cache";
import type { Event, EventCategory } from "@/lib/types";

export type PublicEventsFilter = {
  locale: Locale;
  category?: EventCategory;
  city?: CitySlug;
  venueSlug?: string;
  when?: Exclude<TimeRange, "all">;
};

function eventDedupeKey(event: Event): string {
  return event.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 48);
}

function mergeUniqueEvents(base: Event[], extra: Event[]): Event[] {
  const merged: Event[] = [];
  const seen = new Set<string>();
  const seenTitles = new Set<string>();

  for (const event of [...base, ...extra]) {
    const titleKey = eventDedupeKey(event);
    if (seen.has(event.id) || seenTitles.has(titleKey)) continue;
    merged.push(event);
    seen.add(event.id);
    seenTitles.add(titleKey);
  }

  return merged;
}

function applyScopeFilters(events: Event[], filter: PublicEventsFilter): Event[] {
  let result = attachVenueSlugs(filterRemovedSeedEvents(events));

  if (filter.venueSlug) {
    result = result.filter((event) => event.venueSlug === filter.venueSlug);
  }
  if (filter.city) {
    result = result.filter((event) => eventMatchesCity(event, filter.city!));
  }
  if (filter.category) {
    result = result.filter((event) => eventInCategory(event, filter.category!));
  }

  result = materializeEventDates(result);

  if (filter.when) {
    result = filterByTimeRange(result, filter.when);
  }

  return result;
}

async function loadPublicEvents(filter: PublicEventsFilter): Promise<Event[]> {
  const { locale, category, venueSlug } = filter;

  let events = category
    ? getFallbackForCategory(category, locale)
    : getFallbackEvents(locale);

  events = mergeUniqueEvents(events, getCommunityEvents());

  try {
    const dbEvents = normalizeEventCoordsList(
      await fetchApprovedEvents({ category, venueSlug, locale }),
    );
    events = mergeUniqueEvents(
      localizeEventsForDisplay(dbEvents, locale),
      events,
    );
  } catch {
    // Firebase may be unavailable at build time.
  }

  events = applyScopeFilters(events, filter);
  events = attachCoords(events);
  events = sortEventsForDisplay(events, { recurringLast: true });
  // Curated patches may update localized copy — resolve locale after merging.
  events = applyCuratedEventPatches(events);
  events = applyTemporaryClosures(events, locale);
  events = localizeEventsForDisplay(events, locale);
  events = attachEventPhones(events);
  events = attachTicketUrls(events);
  events = attachEventImages(events);
  events = events.map(withResolvedCategories);

  return events;
}

const getCachedPublicEvents = unstable_cache(
  async (
    locale: Locale,
    category: string,
    city: string,
    venueSlug: string,
    when: string,
  ) =>
    loadPublicEvents({
      locale,
      category: (category || undefined) as EventCategory | undefined,
      city: (city || undefined) as CitySlug | undefined,
      venueSlug: venueSlug || undefined,
      when: (when || undefined) as Exclude<TimeRange, "all"> | undefined,
    }),
  ["public-events-v2"],
  { revalidate: LISTING_REVALIDATE_SECONDS, tags: ["events"] },
);

/** Server-side event list for SEO pages — fallbacks, community, and Firebase (no crawl). */
export async function getPublicEvents(
  filter: PublicEventsFilter,
): Promise<Event[]> {
  return getCachedPublicEvents(
    filter.locale,
    filter.category ?? "",
    filter.city ?? "",
    filter.venueSlug ?? "",
    filter.when ?? "",
  );
}
