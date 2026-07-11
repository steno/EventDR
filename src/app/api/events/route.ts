import { NextRequest, NextResponse } from "next/server";
import { crawlEventListings } from "@/lib/crawl";
import { enrichCrawlResults } from "@/lib/enrich";
import {
  addToPool,
  getCacheKey,
  getCachedEvents,
  mergeWithFallback,
  setCachedEvents,
  getCachedDbEvents,
  setCachedDbEvents,
} from "@/lib/cache";
import { getFallbackEvents, getFallbackForCategory } from "@/lib/fallback-events";
import { getCommunityEvents } from "@/lib/community-store";
import { fetchApprovedEvents } from "@/lib/firebase/events";
import { attachCoords, attachVenueSlugs } from "@/lib/geo";
import { materializeEventDates, sortUpcomingEvents } from "@/lib/event-dates";
import { isValidLocale } from "@/i18n/config";
import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import type { Event, EventCategory } from "@/lib/types";
import { CATEGORY_IDS } from "@/lib/categories";
import { eventMatchesCity, isCitySlug } from "@/lib/cities";
import { filterByTimeRange, type TimeRange } from "@/lib/filters";
import { attachEventImages } from "@/lib/event-images";
import { attachEventPhones } from "@/lib/event-phone";
import { applyCuratedEventPatches } from "@/lib/curated-events";
import { filterRemovedSeedEvents } from "@/lib/removed-seeds";
import { localizeEventsForDisplay } from "@/lib/localized-text";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

const REGION_LABELS: Record<Locale, string> = {
  en: "North Coast, DR",
  es: "Costa Norte, RD",
  fr: "Côte Nord, RD",
};

function isValidCategory(value: string): value is EventCategory {
  return CATEGORY_IDS.includes(value as EventCategory);
}

function isValidWhen(value: string): value is Exclude<TimeRange, "all"> {
  return value === "today" || value === "weekend" || value === "week";
}

function eventDedupeKey(event: Event): string {
  return event.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 48);
}

function mergeUniqueEvents(base: Event[], extra: Event[]): Event[] {
  const seen = new Set(base.map((e) => e.id));
  const seenTitles = new Set(base.map(eventDedupeKey));
  const merged = [...base];
  for (const e of extra) {
    const titleKey = eventDedupeKey(e);
    if (!seen.has(e.id) && !seenTitles.has(titleKey)) {
      merged.push(e);
      seen.add(e.id);
      seenTitles.add(titleKey);
    }
  }
  return merged;
}

function mergeCommunityEvents(events: Event[], locale: Locale): Event[] {
  const community = getCommunityEvents();
  addToPool(locale, community);
  return mergeUniqueEvents(events, community);
}

function mergeDbEvents(events: Event[], dbEvents: Event[]): Event[] {
  return mergeUniqueEvents(dbEvents, events);
}

function sortEvents(events: Event[]): Event[] {
  return sortUpcomingEvents(events);
}

const NO_STORE_HEADERS = {
  "Cache-Control": "no-store, max-age=0, must-revalidate",
};

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const categoryParam = searchParams.get("category");
  const category = categoryParam && isValidCategory(categoryParam)
    ? categoryParam
    : undefined;
  const venueSlug = searchParams.get("venue") ?? undefined;
  const cityParam = searchParams.get("city") ?? undefined;
  const city = cityParam && isCitySlug(cityParam) ? cityParam : undefined;
  const whenParam = searchParams.get("when") ?? undefined;
  const when = whenParam && isValidWhen(whenParam) ? whenParam : undefined;
  const refresh = searchParams.get("refresh") === "true";
  const localeParam = searchParams.get("locale") ?? "en";
  const locale: Locale = isValidLocale(localeParam) ? localeParam : "en";
  const scopeKey = [
    when ? `when:${when}` : null,
    city ? `city:${city}` : null,
    venueSlug ? `venue:${venueSlug}` : null,
  ]
    .filter(Boolean)
    .join("|");
  const cacheKey = getCacheKey(locale, category, scopeKey || undefined);

  function applyScopeFilters(list: Event[]): Event[] {
    let result = attachVenueSlugs(filterRemovedSeedEvents(list));
    if (venueSlug) {
      result = result.filter((e) => e.venueSlug === venueSlug);
    }
    if (city) {
      result = result.filter((e) => eventMatchesCity(e, city));
    }
    if (category) {
      result = result.filter((e) => e.category === category);
    }
    return result;
  }

  function finalizeEvents(list: Event[]): Event[] {
    let events = materializeEventDates(applyScopeFilters(list));
    events = attachCoords(events);
    if (when) {
      events = filterByTimeRange(events, when);
    }
    events = sortEvents(events);
    events = applyCuratedEventPatches(events);
    events = attachEventPhones(events);
    events = attachEventImages(events);
    return events;
  }

  try {
    if (!refresh) {
      const cached = getCachedEvents(cacheKey);
      if (cached?.length) {
        return NextResponse.json(
          {
            events: cached,
            source: "cache",
            region: REGION_LABELS[locale],
          },
          { headers: NO_STORE_HEADERS },
        );
      }
    }

    // Check DB cache first (5-minute cache)
    const dbCacheKey = `db:${locale}:${category || "all"}:${city || ""}:${venueSlug || ""}`;
    let dbEvents = refresh ? [] : getCachedDbEvents(dbCacheKey) ?? [];
    
    if (dbEvents.length === 0) {
      dbEvents = attachCoords(
        await fetchApprovedEvents({ category, venueSlug, locale }),
      );
      dbEvents = localizeEventsForDisplay(dbEvents, locale);
      setCachedDbEvents(dbCacheKey, dbEvents);
    }

    const shouldCrawl = refresh;

    let crawlResults: Awaited<ReturnType<typeof crawlEventListings>> = [];
    let crawled: Event[] = [];

    if (shouldCrawl) {
      crawlResults = await crawlEventListings(category);
      if (crawlResults.length > 0) {
        crawled = await enrichCrawlResults(crawlResults, category, locale);
        addToPool(locale, crawled);
      }
    }

    let events = mergeWithFallback(crawled, category, locale);
    events = mergeDbEvents(events, dbEvents);
    events = mergeCommunityEvents(events, locale);

    if (events.length === 0) {
      events = category
        ? getFallbackForCategory(category, locale)
        : getFallbackEvents(locale);
    }

    events = finalizeEvents(events);
    setCachedEvents(cacheKey, events);

    const source =
      dbEvents.length > 0 && crawlResults.length > 0
        ? "live"
        : dbEvents.length > 0
          ? "database"
          : crawlResults.length > 0
            ? "live"
            : "fallback";

    return NextResponse.json(
      {
        events,
        source,
        region: REGION_LABELS[locale],
        crawledAt: new Date().toISOString(),
        crawledSources: crawlResults.length,
        dbCount: dbEvents.length,
      },
      { headers: NO_STORE_HEADERS },
    );
  } catch (error) {
    console.error("Events API error:", error);
    const events = finalizeEvents(
      category
        ? getFallbackForCategory(category, locale)
        : getFallbackEvents(locale),
    );
    return NextResponse.json(
      {
        events,
        source: "fallback",
        region: REGION_LABELS[locale],
        error: getDictionary(locale).events.sourceFallback,
      },
      { headers: NO_STORE_HEADERS },
    );
  }
}
