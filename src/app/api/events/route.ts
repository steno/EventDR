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
import { attachCoords, sortByDistance, attachVenueSlugs } from "@/lib/geo";
import { materializeEventDates, sortUpcomingEvents } from "@/lib/event-dates";
import { isValidLocale } from "@/i18n/config";
import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import type { Event, EventCategory } from "@/lib/types";
import { CATEGORY_IDS } from "@/lib/categories";
import { attachEventImages } from "@/lib/event-images";
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

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const categoryParam = searchParams.get("category");
  const category = categoryParam && isValidCategory(categoryParam)
    ? categoryParam
    : undefined;
  const venueSlug = searchParams.get("venue") ?? undefined;
  const refresh = searchParams.get("refresh") === "true";
  const localeParam = searchParams.get("locale") ?? "en";
  const locale: Locale = isValidLocale(localeParam) ? localeParam : "en";
  const latParam = searchParams.get("lat");
  const lngParam = searchParams.get("lng");
  const userLat = latParam ? parseFloat(latParam) : null;
  const userLng = lngParam ? parseFloat(lngParam) : null;
  const nearMe = searchParams.get("nearMe") === "true" && userLat != null && userLng != null;
  const cacheKey = getCacheKey(
    locale,
    category,
    venueSlug ? `venue:${venueSlug}` : undefined,
  );

  function applyScopeFilters(list: Event[]): Event[] {
    let result = attachVenueSlugs(list);
    if (venueSlug) {
      result = result.filter((e) => e.venueSlug === venueSlug);
    }
    if (category) {
      result = result.filter((e) => e.category === category);
    }
    return result;
  }

  try {
    if (!refresh) {
      const cached = getCachedEvents(cacheKey);
      if (cached?.length) {
        let events = attachEventImages(sortEvents(cached));
        if (nearMe && userLat != null && userLng != null) {
          events = sortByDistance(events, userLat, userLng);
        }
        return NextResponse.json({
          events,
          source: "cache",
          region: REGION_LABELS[locale],
        });
      }
    }

    // Check DB cache first (5-minute cache)
    const dbCacheKey = `db:${locale}:${category || 'all'}:${venueSlug || ''}`;
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
    events = applyScopeFilters(events);

    if (events.length === 0) {
      const fallbacks = category
        ? getFallbackForCategory(category, locale)
        : getFallbackEvents(locale);
      events = applyScopeFilters(fallbacks);
    }

    events = materializeEventDates(events);
    events = attachCoords(events);
    events = sortEvents(events);
    events = attachEventImages(events);

    setCachedEvents(cacheKey, events);

    if (nearMe && userLat != null && userLng != null) {
      events = sortByDistance(events, userLat, userLng);
    }

    const source =
      dbEvents.length > 0 && crawlResults.length > 0
        ? "live"
        : dbEvents.length > 0
          ? "database"
          : crawlResults.length > 0
            ? "live"
            : "fallback";

    return NextResponse.json({
      events,
      source,
      region: REGION_LABELS[locale],
      crawledAt: new Date().toISOString(),
      crawledSources: crawlResults.length,
      dbCount: dbEvents.length,
    });
  } catch (error) {
    console.error("Events API error:", error);
    let events = applyScopeFilters(
      category
        ? getFallbackForCategory(category, locale)
        : getFallbackEvents(locale),
    );
    events = sortEvents(materializeEventDates(events));
    events = attachEventImages(events);
    if (nearMe && userLat != null && userLng != null) {
      events = sortByDistance(attachCoords(events), userLat, userLng);
    }
    return NextResponse.json({
      events,
      source: "fallback",
      region: REGION_LABELS[locale],
      error: getDictionary(locale).events.sourceFallback,
    });
  }
}
