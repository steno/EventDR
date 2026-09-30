import { localDateISO } from "@/lib/event-dates";

/**
 * Curated local hero photos (Wikimedia Commons — see public/categories/ATTRIBUTIONS.md).
 * Used as the Discover home photo plane (day-stable random pick).
 */
export const CATEGORY_HERO_IMAGE_URLS = [
  "/categories/dance.jpg",
  "/categories/performances.jpg",
  "/categories/culture.jpg",
  "/categories/festivals.jpg",
  "/categories/sports.jpg",
  "/categories/adventure.jpg",
  "/categories/parties.jpg",
  "/categories/music.jpg",
  "/categories/concert.jpg",
  "/categories/food-drinks.jpg",
  "/categories/business.jpg",
] as const;

function hashSeed(input: string): number {
  let hash = 2166136261;
  for (let i = 0; i < input.length; i++) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function seededPick<T>(items: readonly T[], seed: number): T {
  let state = seed || 1;
  state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
  return items[state % items.length]!;
}

/** Day-stable random category stock photo for the home Discover hero. */
export function pickHomeCategoryHeroImage(options?: {
  now?: Date;
  /** Extra entropy (e.g. city slug) so area swaps can change the photo. */
  seed?: string | number;
}): string {
  const day = localDateISO(options?.now ?? new Date());
  const seed = hashSeed(
    `home-category-hero:${options?.seed ?? "home"}:${day}`,
  );
  return seededPick(CATEGORY_HERO_IMAGE_URLS, seed);
}
