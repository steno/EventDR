/** Maps seed event ids to image files under /public/events (synced from popevent-images). */
const EVENT_IMAGE_FILES: Record<string, string> = {
  "malecon-live-concert": "malecon-live-concert.jpg",
  "rumble-in-paradise-12": "rumble-in-paradise-12.png",
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
  "sea-horse-saturday-market": "sea-horse-saturday-market.png",
  "community-domino-sosua": "community-domino-sosua.jpg",
  "community-pickleball-cabarete": "community-pickleball-cabarete.jpg",
  "ingest-make-authentic-espadrilles-in-puerto-plata":
    "ingest-make-authentic-espadrilles-in-puerto-plata.jpg",
  "ingest-18th-annual-cabarete-butterfly-effect":
    "ingest-18th-annual-cabarete-butterfly-effect.png",
  "cabarete-classic-2026": "cabarete-classic-2026.jpg",
  "cabarete-pilates-reformer": "cabarete-pilates-reformer.png",
  "sancocho-sabados-pingui": "sancocho-sabados-pingui.jpg",
  "inicio-del-campamento-pp-2026": "inicio-del-campamento-pp-2026.jpg",
  "feria-artesanal-verano-2026": "feria-artesanal-verano-2026.jpg",
  "el-carey-wc2026": "el-carey-wc2026.png",
  "el-colibri-karaoke-battle-2026": "el-colibri-karaoke-battle-2026.png",
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
  "coconut-cove-ocean-zipline-daily": "coconut-cove-ocean-zipline-daily.jpeg",
  "brugal-rum-center-weekdays": "brugal-rum-center-weekdays.jpeg",
  "freestyle-catamaran-daily": "freestyle-catamaran-daily.jpeg",
  "outback-safari-daily": "outback-safari-daily.jpeg",
  "cremo-friday-salsa-dance": "cremo-friday-salsa-dance.jpg",
  "anfiteatro-la-puntilla-concerts": "anfiteatro-la-puntilla-concerts.jpg",
  "el-carey-weekend-nightlife": "el-carey-weekend-nightlife.jpg",
  "anfiteatro-cultural-performances": "anfiteatro-cultural-performances.jpg",
  "brugal-corporate-tours": "brugal-rum-center-weekdays.jpeg",
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
  "kite-beach-wind-culture": "kite-beach-wind-culture.jpg",
  "north-coast-tech-meetup": "north-coast-tech-meetup.jpg",
  "sea-horse-saturday-artisan-fair": "sea-horse-saturday-artisan-fair.jpg",
  "puerto-plata-carnaval-2026": "puerto-plata-carnaval-2026.jpg",
  "malecon-morning-wellness-walk": "malecon-morning-wellness-walk.jpg",
};

/** Legacy ingest ids that share a curated event image. */
const EVENT_IMAGE_ALIASES: Record<string, string> = {
  "ingest-1783371784615-0-18th-annual-cabarete-butterfly-effect":
    "ingest-18th-annual-cabarete-butterfly-effect",
  "museo-ambar-saturday": "museo-ambar-weekdays",
};

const EVENT_IMAGE_PREFIXES: { prefix: string; file: string }[] = [
  { prefix: "el-carey-wc2026-", file: "el-carey-wc2026.png" },
];

export function getEventImageUrl(eventId: string): string | undefined {
  const resolvedId = EVENT_IMAGE_ALIASES[eventId] ?? eventId;
  const file =
    EVENT_IMAGE_FILES[resolvedId] ??
    EVENT_IMAGE_PREFIXES.find((p) => resolvedId.startsWith(p.prefix))?.file;
  return file ? `/events/${file}` : undefined;
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
