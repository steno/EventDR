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
};

/** Legacy ingest ids that share a curated event image. */
const EVENT_IMAGE_ALIASES: Record<string, string> = {
  "ingest-1783371784615-0-18th-annual-cabarete-butterfly-effect":
    "ingest-18th-annual-cabarete-butterfly-effect",
};

export function getEventImageUrl(eventId: string): string | undefined {
  const resolvedId = EVENT_IMAGE_ALIASES[eventId] ?? eventId;
  const file = EVENT_IMAGE_FILES[resolvedId];
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
