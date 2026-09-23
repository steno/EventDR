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
  // Duplicate of former anfiteatro-la-puntilla-concerts (same venue, weekends, source URL).
  // Both that series and this id are retired — Anfiteatro shows are billed one-offs only.
  "anfiteatro-cultural-performances",
  // Duplicate of cremo-salsa-friday (same venue, Friday 8–11 PM, source URL).
  "cremo-friday-salsa-dance",
  // Overlaps La Puntilla concerts (same hours/source; older Malecón placeholder).
  "malecon-live-concert",
  // Duplicate of gym-sov-zumba-tuesday (same class, Tue + Thu 9 AM).
  "gym-sov-zumba-lift-thursday",
  // Folded into flip-flop-monday-happy-hour (one flyer, daily schedule).
  "flip-flop-weekday-happy-hour",
  "flip-flop-weekend-happy-hour",
  // Ingest misfire: Expo Amaprosan is Parque Central de Santiago (Cibao), not POP.
  "ingest-expo-amaprosan-2026",
  // Pop Urbano 037 podcast brand — not a verified North Coast dated event.
  "piscinazo-pop-urbano-037-2026-08-02",
  // Demo community seed — no source URL; invents a Tue/Thu meetup (Sea Horse has courts only).
  "community-pickleball-cabarete",
  // Invented meetup — sourceUrl is only the Saturday Market page (already seeded as sea-horse-saturday-market).
  "north-coast-networking-saturday",
  // Invented Wednesday meetup at Cowork Cabarete — no sourceUrl / no verified Caribbean Tech series.
  "north-coast-tech-meetup",
  // Unverified cowork desk listing — venue itself dumped (DR365 Blue Coworking not corroborated).
  "cowork-weekdays",
  // Duplicate of natura-sunbar-special-sunset-sounds-2026-09-24 (same flyer / Thu night).
  "natura-cabana-sunset-sounds-thursday",
  // Unverified weekly — no source URL; Chill & Grill bingo/karaoke stay seeded.
  "castaways-classic-rock-wednesday",
  // Atmosphere placeholders — not verified recurring programs (venue/strip only).
  "batey-salsa-weekly",
  "batey-open-mic-weekly",
  "el-batey-weekend-nightlife",
  "sosua-pedro-clisante-food-nights",
  // Anfiteatro has billed one-offs + renovation limits — no standing weekend/weekday series.
  "anfiteatro-la-puntilla-concerts",
  "anfiteatro-la-puntilla-weekday-culture",
  // Invented Sunday municipal programming; sourceUrl is only the city homepage.
  "ayuntamiento-pp-sunday-malecon",
  // Malecón promenade ambience — stalls/walkers, not events.
  "malecon-kiosks-daily",
  "malecon-morning-wellness-walk",
  // Arbitrary single-operator day tour among many interchangeable catamarans.
  "freestyle-catamaran-daily",
  // Calendar fiction — standing series / hours-as-event with no real program.
  "lax-headline-concerts",
  "casa-de-la-cultura-saturday-stage",
  "sosua-beach-live-weekends",
  "kviar-disco-casino-nights",
]);

export function filterRemovedSeedEvents(events: Event[]): Event[] {
  return events.filter((e) => !REMOVED_SEED_EVENT_IDS.has(e.id));
}
