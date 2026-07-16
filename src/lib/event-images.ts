/** Maps seed event ids to image files under /public/events (synced from popevent-images). */
import { getAppVersion } from "./app-version";

const EVENT_IMAGE_FILES: Record<string, string> = {
  "rumble-in-paradise-12": "rumble-in-paradise-12.jpg",
  "lax-sunset-daily": "lax-sunset-daily.jpg",
  "malecon-kiosks-daily": "malecon-kiosks-daily.jpg",
  "kite-beach-daily": "kite-beach-daily.jpg",
  "liquid-blue-sunrise-yoga": "liquid-blue-sunrise-yoga.jpg",
  "cowork-weekdays": "cowork-weekdays.jpg",
  "batey-salsa-weekly": "batey-salsa-weekly.jpg",
  "sosua-volleyball-weekly": "sosua-volleyball-weekly.jpg",
  "lax-reggae-friday": "lax-reggae-friday.jpg",
  "batey-open-mic-weekly": "batey-open-mic-weekly.jpg",
  "hard-rock-weekends": "hard-rock-weekends.jpg",
  "hard-rock-billed-concerts": "hard-rock-billed-concerts.jpg",
  "castaways-classic-rock-wednesday": "castaways-classic-rock-wednesday.jpg",
  "voramar-friday-live": "voramar-friday-live.jpg",
  "smileys-saturday-live": "smileys-saturday-live.jpg",
  "finish-line-live-wednesday": "finish-line-live-wednesday.jpg",
  "sosua-beach-live-weekends": "sosua-beach-live-weekends.jpg",
  "cheers-weekly-live": "cheers-weekly-live.jpg",
  "senor-rock-live-nightly": "senor-rock-live-nightly.jpg",
  "cremo-salsa-friday": "cremo-salsa-friday.jpg",
  "cremo-bohemian-wednesday": "cremo-bohemian-wednesday.jpg",
  "cremo-karaoke-saturday": "cremo-karaoke-saturday.jpg",
  "big-lees-weekend-music": "big-lees-weekend-music.jpg",
  "sea-horse-saturday-market": "sea-horse-saturday-market.jpg",
  "community-domino-sosua": "community-domino-sosua.jpg",
  "community-pickleball-cabarete": "community-pickleball-cabarete.jpg",
  "ingest-make-authentic-espadrilles-in-puerto-plata":
    "ingest-make-authentic-espadrilles-in-puerto-plata.jpg",
  "ingest-18th-annual-cabarete-butterfly-effect":
    "ingest-18th-annual-cabarete-butterfly-effect.jpg",
  "cabarete-classic-2026": "cabarete-classic-2026.jpg",
  "cabarete-pilates-reformer": "cabarete-pilates-reformer.jpg",
  "sancocho-sabados-pingui": "sancocho-sabados-pingui.jpg",
  "inicio-del-campamento-pp-2026": "inicio-del-campamento-pp-2026.jpg",
  "feria-artesanal-verano-2026": "feria-artesanal-verano-2026.jpg",
  "plaza-independencia-daily": "plaza-independencia-daily.jpg",
  "plaza-independencia-weekend-culture": "plaza-independencia-daily.jpg",
  "el-carey-wc2026": "el-carey-wc2026.jpg",
  "el-colibri-karaoke-battle-2026": "el-colibri-karaoke-battle-2026.jpg",
  "ocean-world-daily": "ocean-world-daily.jpeg",
  "charcos-damajagua-daily": "charcos-damajagua-daily.jpeg",
  "fortaleza-san-felipe-daily": "fortaleza-san-felipe-daily.jpeg",
  "museo-ambar-weekdays": "museo-ambar-weekdays.jpeg",
  "teleferico-puerto-plata-daily": "teleferico-puerto-plata-daily.jpeg",
  "cayo-arena-tours-daily": "cayo-arena-tours-daily.jpeg",
  "paseo-dona-blanca-daily": "paseo-dona-blanca-daily.jpeg",
  "calle-sombrillas-daily": "calle-sombrillas-daily.jpeg",
  "fun-city-daily": "fun-city-daily.jpeg",
  "monkeyland-puerto-plata-daily": "monkeyland-puerto-plata-daily.jpeg",
  "coconut-cove-ocean-zipline-daily": "coconut-cove-ocean-zipline-daily.jpg",
  "brugal-rum-center-weekdays": "brugal-rum-center-weekdays.jpg",
  "brugal-corporate-tours": "brugal-corporate-tours.jpg",
  "del-oro-chocolate-factory-weekdays": "del-oro-chocolate-factory-weekdays.jpg",
  "del-oro-chocolate-factory-saturday": "del-oro-chocolate-factory-weekdays.jpg",
  "hacienda-cufa-cacao-tour": "hacienda-cufa-cacao-tour.jpg",
  "tabacalera-cremo-factory-tour": "tabacalera-cremo-factory-tour.jpg",
  "tabacalera-cremo-rolling-experience": "tabacalera-cremo-rolling-experience.jpg",
  "vivonte-cigar-factory-weekdays": "vivonte-cigar-factory-weekdays.jpg",
  "vivonte-cigar-factory-saturday": "vivonte-cigar-factory-weekdays.jpg",
  "freestyle-catamaran-daily": "freestyle-catamaran-daily.jpg",
  "outback-safari-daily": "outback-safari-daily.jpeg",
  "cremo-friday-salsa-dance": "cremo-friday-salsa-dance.jpg",
  "anfiteatro-la-puntilla-concerts": "anfiteatro-la-puntilla-concerts.jpg",
  "el-carey-weekend-nightlife": "el-carey-weekend-nightlife.jpg",
  "sosua-jewish-museum-hours": "sosua-jewish-museum-hours.jpg",
  "sosua-diving-adventures-daily": "sosua-diving-adventures-daily.jpg",
  "el-batey-weekend-nightlife": "el-batey-weekend-nightlife.jpg",
  "d-classico-merengue-nights": "d-classico-merengue-nights.jpg",
  "sosua-pedro-clisante-food-nights": "sosua-pedro-clisante-food-nights.jpg",
  "natura-cabana-yoga-daily": "natura-cabana-yoga-daily.jpg",
  "north-coast-networking-saturday": "north-coast-networking-saturday.jpg",
  "ojo-latin-night-thursday": "ojo-latin-night-thursday.jpg",
  "ojo-weekend-dj-parties": "ojo-weekend-dj-parties.jpg",
  "la-casita-papi-beach-dining": "la-casita-papi-beach-dining.jpg",
  "liquid-blue-watersports-daily": "liquid-blue-watersports-daily.jpg",
  "lax-headline-concerts": "lax-headline-concerts.jpg",
  "voyvoy-monday-live-music": "voyvoy-monday-live-music.jpg",
  "voyvoy-saturday-session": "voyvoy-saturday-session.jpg",
  "voyvoy-sunday-open-mic": "voyvoy-sunday-open-mic.jpg",
  "womens-reconnection-kite-camp-2026": "womens-reconnection-kite-camp-2026.jpg",
  "kite-beach-wind-culture": "kite-beach-wind-culture.jpg",
  "north-coast-tech-meetup": "north-coast-tech-meetup.jpg",
  "puerto-plata-carnaval-2026": "puerto-plata-carnaval-2026.jpg",
  "malecon-morning-wellness-walk": "malecon-morning-wellness-walk.jpg",
  "hms-valeria-spanish-saturday": "hms-valeria-spanish-saturday.jpg",
  "hms-valeria-domingo-dominicano": "hms-valeria-domingo-dominicano.jpg",
  "rum-legacy-museum-daily": "rum-legacy-museum-daily.jpg",
  "la-confluencia-museum-daily": "la-confluencia-museum-daily.jpg",
  "gregorio-luperon-museum": "gregorio-luperon-museum.jpg",
  "macorix-house-of-rum": "macorix-house-of-rum.jpg",
  "casa-de-la-cultura-exhibitions": "casa-de-la-cultura-exhibitions.jpg",
  "paella-pop-el-pueblito": "paella-pop-el-pueblito.jpg",
  "paella-pop-green-one": "paella-pop-green-one.jpg",
  "lil-naay-2026-07-17": "lil-naay-2026-07-17.jpg",
  "cabarete-jazz-festival-2026": "cabarete-jazz-festival-2026.jpg",
  "jandy-ventura-legado-caballo-2026": "jandy-ventura-legado-caballo-2026.jpg",
  "natura-cabana-saturday-live": "natura-cabana-saturday-live.jpg",
  "el-parq-live-bands-saturday": "el-parq-live-bands-saturday.jpg",
  "el-parq-karaoke-thursday": "el-parq-karaoke-thursday.jpg",
  "el-parq-latin-friday": "el-parq-latin-friday.jpg",
  "parada-tipica-el-choco-tuesday-live": "parada-tipica-el-choco-tuesday-live.jpg",
  "atleticos-pp-vs-capitanes-2026-07-11": "atleticos-pp-vs-capitanes-2026-07-11.jpg",
  "atleticos-pp-vs-mangueros-2026-07-17": "atleticos-pp-vs-mangueros-2026-07-17.jpg",
  "atleticos-pp-vs-mineros-2026-07-31": "atleticos-pp-vs-mineros-2026-07-31.jpg",
  "atleticos-pp-vs-granjeros-2026-08-02": "atleticos-pp-vs-granjeros-2026-08-02.jpg",
  "atleticos-pp-vs-bravos-2026-08-07": "atleticos-pp-vs-bravos-2026-08-07.jpg",
  "atleticos-pp-vs-reales-2026-08-09": "atleticos-pp-vs-reales-2026-08-09.jpg",
  "atleticos-pp-vs-arroceros-2026-08-22": "atleticos-pp-vs-arroceros-2026-08-22.jpg",
  "atleticos-pp-vs-capitanes-2026-08-28": "atleticos-pp-vs-capitanes-2026-08-28.jpg",
  "puerto-plata-golf-classic-2026": "puerto-plata-golf-classic-2026.jpg",
  "cac-games-surf-playa-encuentro-2026": "cac-games-surf-playa-encuentro-2026.jpg",
  "puerto-plata-beach-soccer-2026": "puerto-plata-beach-soccer-2026.jpg",
  "la-chabola-wednesday-open-mic": "la-chabola-wednesday-open-mic.jpg",
  "groundzero-domingos-pal-pueblo": "groundzero-domingos-pal-pueblo.jpg",
};

/** Legacy ingest ids that share a curated event image. */
const EVENT_IMAGE_ALIASES: Record<string, string> = {
  "ingest-1783371784615-0-18th-annual-cabarete-butterfly-effect":
    "ingest-18th-annual-cabarete-butterfly-effect",
  "museo-ambar-saturday": "museo-ambar-weekdays",
};

const EVENT_IMAGE_PREFIXES: { prefix: string; file: string }[] = [
  { prefix: "el-carey-wc2026-", file: "el-carey-wc2026.jpg" },
];

/** Tailwind object-position for detail heroes when the focal point isn't center. */
const EVENT_HERO_OBJECT_POSITION: Record<string, string> = {
  // Short mobile heroes keep the sun; desktop centers the sunset composition.
  "lax-sunset-daily": "object-top lg:object-center",
};

export function getEventImageUrl(eventId: string): string | undefined {
  const resolvedId = EVENT_IMAGE_ALIASES[eventId] ?? eventId;
  const file =
    EVENT_IMAGE_FILES[resolvedId] ??
    EVENT_IMAGE_PREFIXES.find((p) => resolvedId.startsWith(p.prefix))?.file;
  return file ? `/events/${file}?v=${getAppVersion()}` : undefined;
}

export function getEventHeroObjectPosition(eventId: string): string {
  const resolvedId = EVENT_IMAGE_ALIASES[eventId] ?? eventId;
  return EVENT_HERO_OBJECT_POSITION[resolvedId] ?? "object-center";
}

export function attachEventImage<T extends { id: string; imageUrl?: string }>(
  event: T,
): T & { imageUrl?: string } {
  const curated = getEventImageUrl(event.id);
  const imageUrl = curated ?? event.imageUrl;
  return imageUrl ? { ...event, imageUrl } : event;
}

export function attachEventImages<T extends { id: string; imageUrl?: string }>(
  events: T[],
): (T & { imageUrl?: string })[] {
  return events.map(attachEventImage);
}
