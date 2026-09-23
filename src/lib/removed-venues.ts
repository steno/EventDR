/**
 * Ingest stub / out-of-scope venue pages — hide and delete from Firestore.
 * Cabarete Bay / Beach are area labels, not venues; Rafaella's Studio was a
 * weak Places snap ("Cabarete fitness"); Caleton Beach Club is Cap Cana
 * (East Coast), not North Coast; `grecialand` was a truncated ingest stub
 * (canonical seed is `grecialandia`); `parque-de-beisbol-jose-briceno` is a
 * Places ingest stub for the same stadium as seed `parque-jose-briceno`;
 * `cowork-cabarete` was an unverified “Blue Coworking” listing with no live
 * Maps/IG/site presence; others never got a listing.
 */
export const REMOVED_VENUE_SLUGS = new Set([
  "cafe-del-mar",
  "cabarete-bay",
  "cabarete-beach",
  "rafaella-s-studio",
  "cabarete-surf-school",
  "caleton-beach-club",
  "grecialand",
  "parque-de-beisbol-jose-briceno",
  // DR365 “Blue Coworking Cabarete” — no Maps place; IG 404; site 500; Co-Cabarete permanently closed.
  "cowork-cabarete",
  // Dropped with freestyle-catamaran-daily — one of many interchangeable snorkel boats.
  "freestyle-catamaran",
]);

/** Stub / alias slugs → canonical seed slug (301 on venue pages). */
export const VENUE_SLUG_REDIRECTS: Record<string, string> = {
  grecialand: "grecialandia",
  "parque-de-beisbol-jose-briceno": "parque-jose-briceno",
};

export function isRemovedVenueSlug(
  slug: string | undefined | null,
): boolean {
  const trimmed = slug?.trim();
  if (!trimmed) return false;
  return REMOVED_VENUE_SLUGS.has(trimmed);
}

/** Canonical venue slug when `slug` is a known stub redirect. */
export function resolveVenueSlugRedirect(
  slug: string | undefined | null,
): string | undefined {
  const trimmed = slug?.trim();
  if (!trimmed) return undefined;
  return VENUE_SLUG_REDIRECTS[trimmed];
}

/** Map removed/alias venue slugs on events onto their canonical seed slug. */
export function canonicalizeVenueSlug(
  slug: string | undefined | null,
): string | undefined {
  const trimmed = slug?.trim();
  if (!trimmed) return undefined;
  return VENUE_SLUG_REDIRECTS[trimmed] ?? trimmed;
}

export function filterRemovedVenues<T extends { slug: string }>(
  venues: T[],
): T[] {
  return venues.filter((venue) => !isRemovedVenueSlug(venue.slug));
}
