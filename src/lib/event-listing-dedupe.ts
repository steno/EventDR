import type { Event } from "@/lib/types";

/**
 * Listing-merge key for fallback + community + Firebase catalogs.
 * Title alone is truncated to 48 chars (legacy), so series nights that share a
 * long prefix ("Atléticos … Serie Final Game 2/4") must also key on `date` —
 * otherwise the later game is silently dropped from rails and category pages
 * while its detail URL can still resolve by id.
 */
export function eventListingDedupeKey(
  event: Pick<Event, "title" | "date">,
): string {
  const title = event.title
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 48);
  const date = event.date?.trim();
  return date ? `${title}:${date}` : title;
}
