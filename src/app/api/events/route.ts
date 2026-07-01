import { NextRequest, NextResponse } from "next/server";
import { crawlEventListings } from "@/lib/crawl";
import { enrichCrawlResults } from "@/lib/enrich";
import { getCachedEvents, setCachedEvents, mergeWithFallback } from "@/lib/cache";
import { getFallbackEvents } from "@/lib/fallback-events";
import { isValidLocale } from "@/i18n/config";
import type { Locale } from "@/i18n/config";
import type { Event } from "@/lib/types";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

const REGION_LABELS: Record<Locale, string> = {
  en: "North Coast, DR",
  es: "Costa Norte, RD",
};

function sortEvents(events: Event[]): Event[] {
  return [...events].sort((a, b) => {
    if (a.trending && !b.trending) return -1;
    if (!a.trending && b.trending) return 1;
    return a.date.localeCompare(b.date);
  });
}

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const category = searchParams.get("category") ?? undefined;
  const refresh = searchParams.get("refresh") === "true";
  const localeParam = searchParams.get("locale") ?? "es";
  const locale: Locale = isValidLocale(localeParam) ? localeParam : "es";
  const cacheKey = `${locale}:${category ?? "all"}`;

  try {
    if (!refresh) {
      const cached = getCachedEvents(cacheKey);
      if (cached?.length) {
        const filtered = category
          ? cached.filter((e) => e.category === category)
          : cached;
        return NextResponse.json({
          events: sortEvents(filtered),
          source: "cache",
          region: REGION_LABELS[locale],
        });
      }
    }

    const crawlResults = await crawlEventListings(category);
    let events: Event[] = [];

    if (crawlResults.length > 0) {
      events = await enrichCrawlResults(crawlResults, category, locale);
    }

    events = mergeWithFallback(events, category, locale);

    if (events.length === 0) {
      const fallback = getFallbackEvents(locale);
      events = category
        ? fallback.filter((e) => e.category === category)
        : fallback;
    }

    events = sortEvents(events);
    setCachedEvents(cacheKey, events);

    return NextResponse.json({
      events,
      source: crawlResults.length > 0 ? "live" : "fallback",
      region: REGION_LABELS[locale],
      crawledAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Events API error:", error);
    const fallback = getFallbackEvents(locale);
    const events = sortEvents(
      category ? fallback.filter((e) => e.category === category) : fallback,
    );
    return NextResponse.json({
      events,
      source: "fallback",
      region: REGION_LABELS[locale],
      error: locale === "es" ? "Usando eventos locales curados" : "Using curated local events",
    });
  }
}
