import { unstable_cache } from "next/cache";
import type { Locale } from "@/i18n/config";
import { attachEventImages } from "@/lib/event-images";
import { attachTicketUrls } from "@/lib/event-tickets";
import { attachEventPhones } from "@/lib/event-phone";
import { localDateISO, materializeEventDates } from "@/lib/event-dates";
import { sortEventsForDisplay } from "@/lib/event-sort";
import { attachCoords, attachVenueSlugs, normalizeEventCoordsList } from "@/lib/geo";
import { applyCuratedEventPatches } from "@/lib/curated-events";
import { filterRemovedSeedEvents } from "@/lib/removed-seeds";
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
import { slimEventsForList } from "@/lib/list-payload";
import type { Event, EventCategory } from "@/lib/types";

export type PublicEventsFilter = {
  locale: Locale;
  category?: EventCategory;
  city?: CitySlug;
  venueSlug?: string;
  when?: Exclude<TimeRange, "all">;
  /** Keep ended one-offs (venue Past tab). Default drops them. */
  includePast?: boolean;
};

function eventDedupeKey(event: Event): string {
  return event.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 48);
}

function isLiveCatalogEvent(event: Event): boolean {
  return materializeEventDates([event]).length > 0;
}

function mergeUniqueEvents(base: Event[], extra: Event[]): Event[] {
  const merged: Event[] = [];
  const seenId = new Map<string, number>();
  const seenTitles = new Set<string>();

  for (const event of [...base, ...extra]) {
    const titleKey = eventDedupeKey(event);
    const existingIndex = seenId.get(event.id);
    if (existingIndex !== undefined) {
      const existing = merged[existingIndex]!;
      if (!isLiveCatalogEvent(existing) && isLiveCatalogEvent(event)) {
        merged[existingIndex] = event;
      }
      continue;
    }
    if (seenTitles.has(titleKey)) continue;
    seenId.set(event.id, merged.length);
    seenTitles.add(titleKey);
    merged.push(event);
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

  result = materializeEventDates(result, new Date(), {
    includePastOneOffs: Boolean(filter.includePast),
  });

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

  // Same as nearby-tonight: Firestore + admin SDK during SSG of ~400 pages
  // OOMs Netlify workers (SIGKILL). ISR/runtime still loads approved events.
  if (process.env.NEXT_PHASE !== "phase-production-build") {
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
  }

  events = applyScopeFilters(events, filter);
  events = attachCoords(events);
  events = sortEventsForDisplay(events, {
    recurringLast: true,
    oneTimeFirst: Boolean(category),
    discoveryMode: Boolean(category),
    preferPrimaryCategory: category,
  });
  // Curated patches may update localized copy — resolve locale after merging.
  events = applyCuratedEventPatches(events);
  events = localizeEventsForDisplay(events, locale);
  events = attachEventPhones(events);
  events = attachTicketUrls(events);
  events = attachEventImages(events);
  events = events.map(withResolvedCategories);

  // List routes serialize into RSC/HTML — drop long descriptions.
  return slimEventsForList(events);
}

const getCachedPublicEvents = unstable_cache(
  async (
    _dayKey: string,
    locale: Locale,
    category: string,
    city: string,
    venueSlug: string,
    when: string,
    includePast: string,
  ) =>
    loadPublicEvents({
      locale,
      category: (category || undefined) as EventCategory | undefined,
      city: (city || undefined) as CitySlug | undefined,
      venueSlug: venueSlug || undefined,
      when: (when || undefined) as Exclude<TimeRange, "all"> | undefined,
      includePast: includePast === "1",
    }),
  ["public-events-v9"],
  { revalidate: LISTING_REVALIDATE_SECONDS, tags: ["events"] },
);

/** Server-side event list for SEO pages — fallbacks, community, and Firebase (no crawl). */
export async function getPublicEvents(
  filter: PublicEventsFilter,
): Promise<Event[]> {
  const events = await getCachedPublicEvents(
    // Bust the data cache at midnight AST so weekday/daily dates can't stick
    // from yesterday while the payload is still within revalidate.
    localDateISO(),
    filter.locale,
    filter.category ?? "",
    filter.city ?? "",
    filter.venueSlug ?? "",
    filter.when ?? "",
    filter.includePast ? "1" : "",
  );
  // Rematerialize + re-sort outside the cache: occurrence dates, live/ended
  // tiers, and curated heroes can change without waiting for revalidate.
  return sortEventsForDisplay(
    attachEventImages(
      materializeEventDates(events, new Date(), {
        includePastOneOffs: Boolean(filter.includePast),
      }),
    ),
    {
      recurringLast: true,
      oneTimeFirst: Boolean(filter.category),
      discoveryMode: Boolean(filter.category),
      preferPrimaryCategory: filter.category,
    },
  );
}
