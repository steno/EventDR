import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { localDateISO, materializeEventDates } from "@/lib/event-dates";
import { getFallbackEvents } from "@/lib/fallback-events";
import { attachCoords, attachVenueSlugs } from "@/lib/geo";
import {
  findNearbyForEventDetail,
  findNearbyOnStrip,
  type NearbyTonightResult,
} from "@/lib/nearby-events";
import { getPublicEvents } from "@/lib/public-events";
import { filterRemovedSeedEvents } from "@/lib/removed-seeds";
import type { Event, Venue } from "@/lib/types";
import {
  findVenueRecurringSiblings,
  type VenueSiblingNight,
} from "@/lib/venue-recurring-siblings";

/**
 * Process-local pool cache. Static generation hits this hundreds of times
 * (venues × locales); reloading/rematerializing getPublicEvents each call
 * OOMs Netlify's build workers (SIGKILL).
 */
const nearbyPoolByLocale = new Map<Locale, Promise<Event[]>>();

function isProductionBuild(): boolean {
  return process.env.NEXT_PHASE === "phase-production-build";
}

/**
 * Event pool for nearby matching.
 * Build: seed fallbacks only (no Firebase / full public pipeline).
 * Runtime: full public catalog, memoized once per locale per process.
 */
function getNearbyEventPool(locale: Locale): Promise<Event[]> {
  const cached = nearbyPoolByLocale.get(locale);
  if (cached) return cached;

  const loading = (async () => {
    if (isProductionBuild()) {
      return attachCoords(
        materializeEventDates(
          attachVenueSlugs(filterRemovedSeedEvents(getFallbackEvents(locale))),
        ),
      );
    }
    return getPublicEvents({ locale });
  })();

  nearbyPoolByLocale.set(locale, loading);
  return loading;
}

/**
 * Same-day walkable neighbors for an event detail page.
 * Falls back to the strip look-ahead when that night is quiet.
 */
export async function getNearbyTonightForEvent(
  event: Event,
  locale: Locale,
): Promise<NearbyTonightResult> {
  const pool = await getNearbyEventPool(locale);
  return findNearbyForEventDetail(event, pool);
}

/** Other recurring nights/programs at the same venue for event detail. */
export async function getVenueOtherNightsForEvent(
  event: Event,
  locale: Locale,
): Promise<VenueSiblingNight[]> {
  const pool = await getNearbyEventPool(locale);
  const dict = getDictionary(locale);
  return findVenueRecurringSiblings(event, pool, locale, dict);
}

/**
 * Upcoming events elsewhere on this venue’s walkable strip (excludes this
 * venue’s own listings — those already appear in the venue schedule).
 */
export async function getNearbyTonightForVenue(
  venue: Venue,
  locale: Locale,
): Promise<NearbyTonightResult> {
  const pool = await getNearbyEventPool(locale);
  const today = localDateISO();
  const source: Event = {
    id: `__venue__${venue.slug}`,
    title: venue.name,
    description: "",
    date: today,
    location: venue.city,
    venue: venue.name,
    venueSlug: venue.slug,
    lat: venue.lat,
    lng: venue.lng,
    category: "culture",
    format: "physical",
  };
  return findNearbyOnStrip(source, pool, {
    preferEvening: true,
  });
}
