import { getFallbackEventById, getFallbackEvents } from "@/lib/fallback-events";
import { enrichEventLocalizedFromFallback } from "@/lib/fallback-localized";
import { prepareSeedEvent } from "@/lib/geo";
import type { Event } from "@/lib/types";

export type SeedEventResolution = {
  events: Event[];
  missing: string[];
  skippedExpired: string[];
};

/**
 * Resolve seed ids from raw fallback data, then keep only events still active
 * for display (recurring or non-expired one-offs). Expired ids are skipped, not errors.
 */
export function resolveSeedEvents(ids: readonly string[]): SeedEventResolution {
  const activeIds = new Set(getFallbackEvents("en").map((event) => event.id));
  const events: Event[] = [];
  const missing: string[] = [];
  const skippedExpired: string[] = [];

  for (const id of ids) {
    const raw = getFallbackEventById(id, "en");
    if (!raw) {
      missing.push(id);
      continue;
    }
    if (!activeIds.has(id)) {
      skippedExpired.push(id);
      continue;
    }
    events.push(prepareSeedEvent(enrichEventLocalizedFromFallback(raw)));
  }

  return { events, missing, skippedExpired };
}
