/** Maps seed event ids to image files under /public/events (synced from popevent-images). */
const EVENT_IMAGE_FILES: Record<string, string> = {
  "malecon-live-concert": "malecon-live-concert.jpg",
  "rumble-in-paradise-12": "rumble-in-paradise-12.png",
  "lax-sunset-daily": "lax-sunset-daily.jpg",
  "malecon-kiosks-daily": "malecon-kiosks-daily.jpg",
  "kite-beach-daily": "kite-beach-daily.jpg",
  "cabarete-yoga-daily": "cabarete-yoga-daily.jpg",
  "cowork-weekdays": "cowork-weekdays.jpg",
  "batey-salsa-weekly": "batey-salsa-weekly.jpg",
  "sosua-volleyball-weekly": "sosua-volleyball-weekly.jpg",
  "lax-reggae-friday": "lax-reggae-friday.jpg",
  "batey-open-mic-weekly": "batey-open-mic-weekly.jpg",
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
  "el-carey-wc2026": "el-carey-wc2026.png",
  "el-colibri-karaoke-battle-2026": "el-colibri-karaoke-battle-2026.png",
  "ocean-world-daily": "ocean-world-daily.jpeg",
  "charcos-damajagua-daily": "charcos-damajagua-daily.jpeg",
  "fortaleza-san-felipe-daily": "fortaleza-san-felipe-daily.jpeg",
  "museo-ambar-weekdays": "museo-ambar-weekdays.jpeg",
  "teleferico-puerto-plata-daily": "teleferico-puerto-plata-daily.jpeg",
  "cayo-arena-tours-daily": "cayo-arena-tours-daily.jpeg",
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
  const imageUrl = event.imageUrl ?? getEventImageUrl(event.id);
  return imageUrl ? { ...event, imageUrl } : event;
}

export function attachEventImages<T extends { id: string; imageUrl?: string }>(
  events: T[],
): (T & { imageUrl?: string })[] {
  return events.map(attachEventImage);
}
