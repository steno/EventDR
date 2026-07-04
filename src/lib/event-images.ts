/** Maps seed event ids to image files under /public/events (synced from popevent-images). */
const EVENT_IMAGE_FILES: Record<string, string> = {
  "sosua-beach-jam": "sosua-beach-jam.jpg",
  "costambar-acoustic": "costambar-acoustic.jpg",
  "malecon-live-concert": "malecon-live-concert.jpg",
  "cabarete-kite-fest": "cabarete-kite-fest.jpg",
  "sosua-beach-volleyball": "sosua-beach-volleyball.jpg",
  "pp-sunday-futbol": "pp-sunday-futbol.jpg",
  "cabarete-surf-comp": "cabarete-surf-comp.jpg",
  "pp-food-truck": "pp-food-truck.jpg",
  "cabarete-brunch-market": "cabarete-brunch-market.jpg",
  "circus-fest": "circus-fest.jpg",
  "pp-cultural-fair": "pp-cultural-fair.jpg",
  "merengue-night": "merengue-night.jpg",
  "wellness-sunrise": "wellness-sunrise.jpg",
  "cabarete-breathwork": "cabarete-breathwork.jpg",
  "pp-comedy-night": "pp-comedy-night.jpg",
  "startup-meetup": "startup-meetup.jpg",
  "virtual-tech-talk": "virtual-tech-talk.jpg",
  "reggaeton-party": "reggaeton-party.jpg",
  "cabarete-full-moon": "cabarete-full-moon.jpg",
  "lax-sunset-daily": "lax-sunset-daily.jpg",
  "malecon-kiosks-daily": "malecon-kiosks-daily.jpg",
  "kite-beach-daily": "kite-beach-daily.jpg",
  "cabarete-yoga-daily": "cabarete-yoga-daily.jpg",
  "cowork-weekdays": "cowork-weekdays.jpg",
  "batey-salsa-weekly": "batey-salsa-weekly.jpg",
  "sosua-volleyball-weekly": "sosua-volleyball-weekly.jpg",
  "malecon-live-weekends": "malecon-live-weekends.jpg",
  "lax-reggae-friday": "lax-reggae-friday.jpg",
  "batey-open-mic-weekly": "batey-open-mic-weekly.jpg",
  "community-domino-sosua": "community-domino-sosua.jpg",
  "community-pickleball-cabarete": "community-pickleball-cabarete.jpg",
};

export function getEventImageUrl(eventId: string): string | undefined {
  const file = EVENT_IMAGE_FILES[eventId];
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
