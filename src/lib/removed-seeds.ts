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
  // Invented Thursday 4–7 PM pickup — no organizer, schedule, or source URL.
  "sosua-volleyball-weekly",
  "sosua-beach-jam",
  "costambar-acoustic",
  "pp-sunday-futbol",
  "party-puerto-plata-2026",
  // Editor dump — Green One Playa Dorada kitchen retired; keep El Pueblito only.
  "paella-pop-green-one",
  // Duplicate of sea-horse-saturday-market (same venue, day, hours, official page).
  "sea-horse-saturday-artisan-fair",
  // Duplicate of former anfiteatro-la-puntilla-concerts (same venue, weekends, source URL).
  // Both that series and this id are retired — Anfiteatro shows are billed one-offs only.
  "anfiteatro-cultural-performances",
  // Duplicate of cremo-salsa-friday (same venue, Friday 8–11 PM, source URL).
  "cremo-friday-salsa-dance",
  // Overlaps La Puntilla concerts (same hours/source; older Malecón placeholder).
  "malecon-live-concert",
  // Zumba at GYM SOV — editor removed (Tue/Thu series and duplicate Thu lift id).
  "gym-sov-zumba-tuesday",
  "gym-sov-zumba-lift-thursday",
  // Folded into flip-flop-monday-happy-hour (one flyer, daily schedule).
  "flip-flop-weekday-happy-hour",
  "flip-flop-weekend-happy-hour",
  // Ingest misfire: Expo Amaprosan is Parque Central de Santiago (Cibao), not POP.
  "ingest-expo-amaprosan-2026",
  // OTA clone of el-choco-cave-tour-swimming-daily — dated one-off wrongly filled Today's specials.
  "ingest-deep-caves-tour",
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
  // Generic weekly slot — prefer dated named-artist Saturday nights from Natura calendar.
  "natura-cabana-saturday-live",
  // Removed per editor — Congreso de Damas ADN 2026 (Gran Ventana).
  "congreso-damas-adn-2026",
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
  // Wrongly geo-pinned to Disco Restaurant Cacique — venue dropped; kill the listings.
  "ingest-el-blachy",
  "ingest-nacho-estrella-nd-eventos",
  // Drink-special / happy-hour windows only — not a programmed event.
  // Keep karaoke, live music, dance, food specials, and branded lounge packages.
  "aura-beach-club-lunes-especiales",
  "aura-beach-club-miercoles-margaritas",
  // Ended — Latin Flow Dance Wednesdays no longer running at Aura.
  "aura-latin-flow-dance-wednesday",
  "flip-flop-monday-happy-hour",
  // Parked — venue SM stale since 2024; weekly specials unverified for 2026.
  "cheers-weekly-live",
  "cheers-mandarin-mondays",
  "cheers-fire-ice-thursdays",
  // Generic weekly Saturday Session — prefer dated named bills (soft reopen / Halloween).
  "voyvoy-saturday-session",
  // No public venue pin — address only on booking; weekly without a place acts like vapor.
  "cabarete-pilates-reformer",
  // Editor removed — Sunset Laughter Club Cabarete weekly.
  "sunset-laughter-club-cabarete",
  // Editor removed — Sosúa Coastal Pickleball Open (Terramar).
  "sosua-coastal-pickleball-open-2026-10-24",
]);

/**
 * Soft-404 event URLs Google still crawls → 301 path (no locale prefix).
 * Prefer a live venue / city / replacement event over a bare 404.
 */
export const EVENT_PATH_REDIRECTS: Record<string, string> = {
  // Renamed / rescheduled ids
  "nueve-80s-90s-por-siempre-2026-10-10":
    "/event/nueve-80s-90s-por-siempre-2026-10-24",
  "disney-dream-taino-bay-2026-10-08": "/event/disney-dream-taino-bay-2026-10-06",
  // Ended series still in seeds but no next occurrence (materialize empty → 404)
  "el-colibri-karaoke-battle-2026": "/venue/el-colibri-hotel",
  // Removed / retired listings (GSC Coverage 404 drilldown 2026-10-24)
  "lax-headline-concerts": "/venue/lax-cabarete",
  "batey-open-mic-weekly": "/city/sosua",
  "malecon-live-concert": "/city/puerto-plata",
  "kviar-disco-casino-nights": "/venue/kviar-costa-dorada",
  "cowork-weekdays": "/city/cabarete",
  "ambar-lounge-miercoles-rooftop": "/venue/ambar-lounge-pop",
  "community-pickleball-cabarete": "/city/cabarete",
  "malecon-morning-wellness-walk": "/city/puerto-plata",
  "freestyle-catamaran-daily": "/city/puerto-plata",
  "anfiteatro-cultural-performances": "/venue/anfiteatro-la-puntilla",
  "north-coast-tech-meetup": "/city/cabarete",
  "malecon-kiosks-daily": "/city/puerto-plata",
  "congreso-damas-adn-2026": "/venue/gran-ventana-beach-resort",
  "victrola-ladies-night-friday": "/venue/victrola-037",
  "ingest-1783371784615-0-18th-annual-cabarete-butterfly-effect":
    "/city/cabarete",
  "cheers-weekly-live": "/city/sosua",
  "cremo-friday-salsa-dance": "/event/cremo-salsa-friday",
  "piscinazo-pop-urbano-037-2026-08-02": "/venue/victrola-037",
  "el-carey-wc2026-2026-07-15-winner-m99-vs-winner-m100-1500":
    "/venue/el-carey-puerto-plata",
  "sea-horse-saturday-artisan-fair": "/event/sea-horse-saturday-market",
  "gym-sov-zumba-lift-thursday": "/city/sosua",
  "community-domino-sosua": "/city/sosua",
  "cabarete-yoga-daily": "/city/cabarete",
  "zen-fitness-weightloss-camp": "/venue/zen-fitness-cabarete",
  "sosua-coastal-pickleball-open-2026-10-24": "/city/sosua",
};

export function resolveEventPathRedirect(
  id: string | undefined | null,
): string | undefined {
  const trimmed = id?.trim();
  if (!trimmed) return undefined;
  return EVENT_PATH_REDIRECTS[trimmed];
}

export function filterRemovedSeedEvents(events: Event[]): Event[] {
  return events.filter((e) => !REMOVED_SEED_EVENT_IDS.has(e.id));
}
