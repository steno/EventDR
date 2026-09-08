import type { Locale } from "@/i18n/config";
import { isPastOneOffEvent } from "@/lib/event-dates";
import { getFallbackEventById } from "@/lib/fallback-events";
import { matchVenueSlug } from "@/lib/venues-seed";

export const RESTAURANT_WEEK_2026_ID = "restaurant-week-puerto-plata-2026";

/**
 * True while Restaurant Week 2026 is still current and this venue is listed
 * as a participant on the seed event.
 */
export function isRestaurantWeekParticipantVenue(
  venueSlug: string,
  locale: Locale = "en",
  now: Date = new Date(),
): boolean {
  const event = getFallbackEventById(RESTAURANT_WEEK_2026_ID, locale);
  if (!event?.participants?.length) return false;
  if (isPastOneOffEvent(event, now)) return false;
  return event.participants.some((name) => matchVenueSlug(name) === venueSlug);
}
