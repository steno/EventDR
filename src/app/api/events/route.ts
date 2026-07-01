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
import { isValidLocale } from "@/i18n/config";
import type { Locale } from "@/i18n/config";
import type { Event, EventCategory } from "@/lib/types";
import { CATEGORY_IDS } from "@/lib/categories";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

const REGION_LABELS: Record<Locale, string> = {
  en: "North Coast, DR",
  es: "Costa Norte, RD",
};

function isValidCategory(value: string): value is EventCategory {
  return CATEGORY_IDS.includes(value as EventCategory);
}

function mergeCommunityEvents(events: Event[], locale: Locale): Event[] {
  const community = getCommunityEvents();
  const seen = new Set(events.map((e) => e.id));
  const merged = [...events];
  for (const e of community) {
    if (!seen.has(e.id)) {
      merged.push(e);
      seen.add(e.id);
    }
  }
  addToPool(locale, community);
  return merged;
}

function sortEvents(events: Event[]): Event[] {
  return [...events].sort((a, b) => {
    if (a.trending && !b.trending) return -1;
    if (!a.trending && b.trending) return 1;
    return a.date.localeCompare(b.date);
  });
}

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const categoryParam = searchParams.get("category");
  const category = categoryParam && isValidCategory(categoryParam)
    ? categoryParam
    : undefined;
  const refresh = searchParams.get("refresh") === "true";
  const localeParam = searchParams.get("locale") ?? "es";
  const locale: Locale = isValidLocale(localeParam) ? localeParam : "es";
  const cacheKey = getCacheKey(locale, category);

  try {
    if (!refresh) {
      const cached = getCachedEvents(cacheKey);
      if (cached?.length) {
        return NextResponse.json({
          events: sortEvents(cached),
          source: "cache",
          region: REGION_LABELS[locale],
        });
      }
    }

    // Skip slow live crawl on serverless unless API keys are configured.
    // Users can tap refresh to force a crawl attempt.
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
    events = mergeCommunityEvents(events, locale);

    if (events.length === 0) {
      events = category
        ? getFallbackForCategory(category, locale)
        : getFallbackEvents(locale);
    }

    events = sortEvents(events);
    setCachedEvents(cacheKey, events);

    return NextResponse.json({
      events,
      source: crawlResults.length > 0 ? "live" : "fallback",
      region: REGION_LABELS[locale],
      crawledAt: new Date().toISOString(),
      crawledSources: crawlResults.length,
    });
  } catch (error) {
    console.error("Events API error:", error);
    const events = sortEvents(
      category
        ? getFallbackForCategory(category, locale)
        : getFallbackEvents(locale),
    );
    return NextResponse.json({
      events,
      source: "fallback",
      region: REGION_LABELS[locale],
      error:
        locale === "es"
          ? "Usando eventos locales curados"
          : "Using curated local events",
    });
  }
}
