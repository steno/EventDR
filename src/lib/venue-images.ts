/** Maps venue slugs to image files under /public/venues (synced from popevent-images). */
import { getAppVersion } from "./app-version";

const VENUE_IMAGE_FILES: Record<string, string> = {
  "parque-jose-briceno": "parque-jose-briceno.jpg",
};

export function getVenueImageUrl(slug: string): string | undefined {
  const file = VENUE_IMAGE_FILES[slug];
  return file ? `/venues/${file}?v=${getAppVersion()}` : undefined;
}

export function attachVenueImage<T extends { slug: string; imageUrl?: string }>(
  venue: T,
): T & { imageUrl?: string } {
  const curated = getVenueImageUrl(venue.slug);
  const imageUrl = curated ?? venue.imageUrl;
  return imageUrl ? { ...venue, imageUrl } : venue;
}

export function attachVenueImages<T extends { slug: string; imageUrl?: string }>(
  venues: T[],
): (T & { imageUrl?: string })[] {
  return venues.map(attachVenueImage);
}
