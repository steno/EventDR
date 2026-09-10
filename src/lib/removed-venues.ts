/**
 * Ingest stub / out-of-scope venue pages — hide and delete from Firestore.
 * Cabarete Bay / Beach are area labels, not venues; Rafaella's Studio was a
 * weak Places snap ("Cabarete fitness"); Caleton Beach Club is Cap Cana
 * (East Coast), not North Coast; others never got a listing.
 */
export const REMOVED_VENUE_SLUGS = new Set([
  "cafe-del-mar",
  "cabarete-bay",
  "cabarete-beach",
  "rafaella-s-studio",
  "cabarete-surf-school",
  "caleton-beach-club",
]);

export function isRemovedVenueSlug(
  slug: string | undefined | null,
): boolean {
  const trimmed = slug?.trim();
  if (!trimmed) return false;
  return REMOVED_VENUE_SLUGS.has(trimmed);
}

export function filterRemovedVenues<T extends { slug: string }>(
  venues: T[],
): T[] {
  return venues.filter((venue) => !isRemovedVenueSlug(venue.slug));
}
