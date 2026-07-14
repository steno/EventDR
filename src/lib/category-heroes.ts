import type { EventCategory } from "@/lib/types";

/**
 * Curated local hero photos for category / city×category scope pages.
 * Sourced from Wikimedia Commons (CC licenses) — see public/categories/ATTRIBUTIONS.md.
 * Prefer Dominican or North Coast subjects when available; otherwise real-event action shots.
 */
const CATEGORY_HERO_IMAGES: Partial<Record<EventCategory, string>> = {
  dance: "/categories/dance.jpg",
  performances: "/categories/performances.jpg",
  culture: "/categories/culture.jpg",
  festivals: "/categories/festivals.jpg",
  sports: "/categories/sports.jpg",
  adventure: "/categories/adventure.jpg",
  parties: "/categories/parties.jpg",
  music: "/categories/music.jpg",
  concert: "/categories/concert.jpg",
  "health-wellness": "/categories/health-wellness.jpg",
};

export function getCategoryHeroImage(
  categoryId: EventCategory | undefined,
): string | undefined {
  if (!categoryId) return undefined;
  return CATEGORY_HERO_IMAGES[categoryId];
}
