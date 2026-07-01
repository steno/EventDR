import { NextRequest, NextResponse } from "next/server";
import { crawlEventListings } from "@/lib/crawl";
import { enrichCrawlResults } from "@/lib/enrich";
import {
  addToPool,
  getCacheKey,
  getCachedEvents,
  mergeWithFallback,
  setCachedEvents,
} from "@/lib/cache";
import { getFallbackEvents, getFallbackForCategory } from "@/lib/fallback-events";
import { getCommunityEvents } from "@/lib/community-store";
import { fetchApprovedEvents } from "@/lib/firebase/events";
import { attachCoords, sortByDistance } from "@/lib/geo";
import { isValidLocale } from "@/i18n/config";
import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import type { Event, EventCategory } from "@/lib/types";
import { CATEGORY_IDS } from "@/lib/categories";

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

function mergeUniqueEvents(base: Event[], extra: Event[]): Event[] {
  const seen = new Set(base.map((e) => e.id));
  const merged = [...base];
  for (const e of extra) {
    if (!seen.has(e.id)) {
      merged.push(e);
      seen.add(e.id);
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
  return [...events].sort((a, b) => {
    if (a.trending && !b.trending) return -1;
    if (!a.trending && b.trending) return 1;
    if (a.distanceKm != null && b.distanceKm != null) {
      return a.distanceKm - b.distanceKm;
    }
    return a.date.localeCompare(b.date);
  });
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
  const cacheKey = getCacheKey(locale, category, nearMe ? `${userLat},${userLng}` : undefined);

  try {
    if (!refresh && !nearMe) {
      const cached = getCachedEvents(cacheKey);
      if (cached?.length) {
        return NextResponse.json({
          events: sortEvents(cached),
          source: "cache",
          region: REGION_LABELS[locale],
        });
      }
    }

    const dbEvents = attachCoords(
      await fetchApprovedEvents({ category, venueSlug, locale }),
    );

    const shouldCrawl =
      refresh ||
      Boolean(process.env.JINA_API_KEY || process.env.OPENAI_API_KEY);

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

    if (venueSlug) {
      events = events.filter((e) => e.venueSlug === venueSlug);
    }

    if (category) {
      events = events.filter((e) => e.category === category);
    }

    if (events.length === 0) {
      events = category
        ? getFallbackForCategory(category, locale)
        : getFallbackEvents(locale);
    }

    events = attachCoords(events);

    if (nearMe && userLat != null && userLng != null) {
      events = sortByDistance(events, userLat, userLng);
    } else {
      events = sortEvents(events);
    }

    if (!nearMe) {
      setCachedEvents(cacheKey, events);
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
    let events = sortEvents(
      category
        ? getFallbackForCategory(category, locale)
        : getFallbackEvents(locale),
    );
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
