import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { localDateISO, materializeEventDates } from "@/lib/event-dates";
import { attachEventImages } from "@/lib/event-images";
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
 * Process-local pool cache for static generation only. Reloading
 * getPublicEvents hundreds of times (venues × locales) OOMs Netlify
 * build workers (SIGKILL). Runtime uses getPublicEvents' own data cache
 * so newly seeded sibling nights are not stuck behind a process-lifetime map.
 */
const nearbyPoolByLocale = new Map<Locale, Promise<Event[]>>();

function isProductionBuild(): boolean {
  return process.env.NEXT_PHASE === "phase-production-build";
}

/**
 * Event pool for nearby matching and same-venue other nights.
 * Build: seed fallbacks only (no Firebase / full public pipeline).
 * Runtime: full public catalog (unstable_cache).
 */
function getNearbyEventPool(locale: Locale): Promise<Event[]> {
  if (!isProductionBuild()) {
    return getPublicEvents({ locale }).then(attachEventImages);
  }

  const cached = nearbyPoolByLocale.get(locale);
  if (cached) return cached;

  const loading = Promise.resolve(
    attachEventImages(
      attachCoords(
        materializeEventDates(
          attachVenueSlugs(filterRemovedSeedEvents(getFallbackEvents(locale))),
        ),
      ),
    ),
  );
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
