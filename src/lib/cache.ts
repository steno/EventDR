import type { Event, EventCategory } from "./types";
import type { Locale } from "@/i18n/config";
import { CATEGORY_IDS } from "./categories";
import { getFallbackEvents, getFallbackForCategory } from "./fallback-events";
import { matchesCategory } from "./categorize";

interface CacheEntry {
  events: Event[];
  fetchedAt: number;
}

const cache = new Map<string, CacheEntry>();
const CACHE_TTL_MS = 60 * 60 * 1000;
const POOL_KEY_SUFFIX = ":pool";

export function getCacheKey(locale: Locale, category?: string): string {
  return category ? `${locale}:${category}` : `${locale}:all`;
}

export function getPoolCacheKey(locale: Locale): string {
  return `${locale}${POOL_KEY_SUFFIX}`;
}

export function getCachedEvents(key: string): Event[] | null {
  const entry = cache.get(key);
  if (!entry) return null;
  if (Date.now() - entry.fetchedAt > CACHE_TTL_MS) {
    cache.delete(key);
    return null;
  }
  return entry.events;
}

export function setCachedEvents(key: string, events: Event[]): void {
  cache.set(key, { events, fetchedAt: Date.now() });
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
  return pool.filter((e) => matchesCategory(e, category));
}

function dedupeEvents(events: Event[]): Event[] {
  const seen = new Set<string>();
  return events.filter((e) => {
    if (seen.has(e.id)) return false;
    seen.add(e.id);
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
    events.filter((e) => matchesCategory(e, category)),
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
    if (!merged.some((e) => e.category === cat)) {
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
