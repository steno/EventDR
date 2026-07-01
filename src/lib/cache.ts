import type { Event } from "./types";
import type { Locale } from "@/i18n/config";
import { getFallbackEvents } from "./fallback-events";

interface CacheEntry {
  events: Event[];
  fetchedAt: number;
}

const cache = new Map<string, CacheEntry>();
const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour

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

export function mergeWithFallback(
  events: Event[],
  category?: string,
  locale: Locale = "es",
): Event[] {
  if (events.length >= 3) {
    return category
      ? events.filter((e) => e.category === category)
      : events;
  }

  const merged = [...events];
  const seen = new Set(events.map((e) => e.id));
  const fallback = getFallbackEvents(locale);

  for (const fb of fallback) {
    if (category && fb.category !== category) continue;
    if (!seen.has(fb.id)) {
      merged.push(fb);
      seen.add(fb.id);
    }
  }

  return merged;
}
