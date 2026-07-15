import type { Event } from "./types";

/**
 * Placeholder seed events removed — no verified date, venue booking, or source URL.
 * Kept: recurring happenings at named venues, Facebook/official sourced events, ingested.
 */
export const REMOVED_SEED_EVENT_IDS = new Set([
  "merengue-night",
  "pp-food-truck",
  "pp-cultural-fair",
  "circus-fest",
  "cabarete-breathwork",
  "pp-comedy-night",
  "cabarete-surf-comp",
  "cabarete-kite-fest",
  "reggaeton-party",
  "cabarete-full-moon",
  "virtual-tech-talk",
  "startup-meetup",
  "cabarete-brunch-market",
  "sosua-beach-volleyball",
  "sosua-beach-jam",
  "costambar-acoustic",
  "pp-sunday-futbol",
  "party-puerto-plata-2026",
  // Google Maps: temporarily closed after Jul 2026 soft opening — no verified hours yet.
  "paella-pop-el-pueblito",
  // Duplicate of sea-horse-saturday-market (same venue, day, hours, official page).
  "sea-horse-saturday-artisan-fair",
]);

export function filterRemovedSeedEvents(events: Event[]): Event[] {
  return events.filter((e) => !REMOVED_SEED_EVENT_IDS.has(e.id));
}
