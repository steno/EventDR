import type { Event, EventCategory } from "./types";
import type { Locale } from "@/i18n/config";
import { CATEGORY_IDS } from "./categories";
import { getFallbackEvents, getFallbackForCategory } from "./fallback-events";
import { eventInCategory } from "./categorize";
import { getAppVersion } from "./app-version";

interface CacheEntry {
  events: Event[];
  fetchedAt: number;
}

const cache = new Map<string, CacheEntry>();
const dbCache = new Map<string, CacheEntry>();
/** In-memory merged feed cache — busted automatically on each deploy via versioned keys. */
const CACHE_TTL_MS = 15 * 60 * 1000;
const DB_CACHE_TTL_MS = 5 * 60 * 1000;

function versionedCacheKey(key: string): string {
  return `${getAppVersion()}:${key}`;
}
const POOL_KEY_SUFFIX = ":pool";

export function getCacheKey(locale: Locale, category?: string, geoKey?: string): string {
  const base = category ? `${locale}:${category}` : `${locale}:all`;
  return geoKey ? `${base}:${geoKey}` : base;
}

export function getPoolCacheKey(locale: Locale): string {
  return `${locale}${POOL_KEY_SUFFIX}`;
}

export function getCachedEvents(key: string): Event[] | null {
  const entry = cache.get(versionedCacheKey(key));
  if (!entry) return null;
  if (Date.now() - entry.fetchedAt > CACHE_TTL_MS) {
    cache.delete(versionedCacheKey(key));
    return null;
  }
  return entry.events;
}

export function setCachedEvents(key: string, events: Event[]): void {
  cache.set(versionedCacheKey(key), { events, fetchedAt: Date.now() });
}

export function getCachedDbEvents(key: string): Event[] | null {
  const entry = dbCache.get(versionedCacheKey(key));
  if (!entry) return null;
  if (Date.now() - entry.fetchedAt > DB_CACHE_TTL_MS) {
    dbCache.delete(versionedCacheKey(key));
    return null;
  }
  return entry.events;
}

export function setCachedDbEvents(key: string, events: Event[]): void {
  dbCache.set(versionedCacheKey(key), { events, fetchedAt: Date.now() });
}

export function addToPool(locale: Locale, events: Event[]): Event[] {
  const key = getPoolCacheKey(locale);
  const existing = getCachedEvents(key) ?? [];
  const seen = new Set(existing.map((e) => e.id));
  const merged = [...existing];

  for (const event of events) {
    if (!seen.has(event.id)) {
      merged.push(event);
      seen.add(event.id);
    }
  }

  setCachedEvents(key, merged);
  return merged;
}

export function getPoolEvents(
  locale: Locale,
  category?: EventCategory,
): Event[] {
  const pool = getCachedEvents(getPoolCacheKey(locale)) ?? [];
  if (!category) return pool;
  return pool.filter((e) => eventInCategory(e, category));
}

function eventTitleKey(event: Event): string {
  return event.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 48);
}

function dedupeEvents(events: Event[]): Event[] {
  const seenIds = new Set<string>();
  const seenTitles = new Set<string>();
  return events.filter((e) => {
    if (seenIds.has(e.id)) return false;
    const titleKey = eventTitleKey(e);
    if (seenTitles.has(titleKey)) return false;
    seenIds.add(e.id);
    seenTitles.add(titleKey);
    return true;
  });
}

/** Always backfill so no category view is ever empty. */
export function ensureCategoryCoverage(
  events: Event[],
  category: EventCategory,
  locale: Locale,
): Event[] {
  const filtered = dedupeEvents(
    events.filter((e) => eventInCategory(e, category)),
  );

  const seen = new Set(filtered.map((e) => e.id));
  const backfill = getFallbackForCategory(category, locale);

  for (const fb of backfill) {
    if (!seen.has(fb.id)) {
      filtered.push(fb);
      seen.add(fb.id);
    }
  }

  return filtered.length > 0 ? filtered : backfill;
}

export function buildCategoryResponse(
  crawled: Event[],
  category: EventCategory,
  locale: Locale,
): Event[] {
  const poolMatches = getPoolEvents(locale, category);
  const merged = dedupeEvents([...crawled, ...poolMatches]);
  return ensureCategoryCoverage(merged, category, locale);
}

export function buildAllResponse(crawled: Event[], locale: Locale): Event[] {
  const pool = getCachedEvents(getPoolCacheKey(locale)) ?? [];
  const merged = dedupeEvents([...pool, ...crawled]);

  const seen = new Set(merged.map((e) => e.id));
  const fallback = getFallbackEvents(locale);

  for (const fb of fallback) {
    if (!seen.has(fb.id)) {
      merged.push(fb);
      seen.add(fb.id);
    }
  }

  // Guarantee every category has at least one event on the home feed
  for (const cat of CATEGORY_IDS) {
    if (!merged.some((e) => eventInCategory(e, cat as EventCategory))) {
      const [first] = getFallbackForCategory(cat as EventCategory, locale);
      if (first && !seen.has(first.id)) {
        merged.push(first);
        seen.add(first.id);
      }
    }
  }

  return merged;
}

export function mergeWithFallback(
  events: Event[],
  category: EventCategory | undefined,
  locale: Locale,
): Event[] {
  if (category) {
    return buildCategoryResponse(events, category, locale);
  }
  return buildAllResponse(events, locale);
}
