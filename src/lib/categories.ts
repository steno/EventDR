import type { CategoryMeta, EventCategory } from "./types";

const CATEGORY_DEFS: Omit<CategoryMeta, "label">[] = [
  {
    id: "music",
    emoji: "🎶",
    gradient: "from-rose-400 via-red-500 to-orange-500",
  },
  {
    id: "business",
    emoji: "🤝",
    gradient: "from-zinc-600 via-zinc-700 to-zinc-900",
  },
  {
    id: "concert",
    emoji: "🎸",
    gradient: "from-amber-400 via-orange-500 to-red-500",
  },
  {
    id: "parties",
    emoji: "🎉",
    gradient: "from-fuchsia-400 via-violet-500 to-indigo-600",
  },
  {
    id: "food-drinks",
    emoji: "🍹",
    gradient: "from-yellow-400 via-amber-500 to-orange-600",
  },
  {
    id: "festivals",
    emoji: "🎪",
    gradient: "from-red-500 via-rose-500 to-pink-500",
  },
  {
    id: "dance",
    emoji: "💃",
    gradient: "from-pink-400 via-fuchsia-500 to-purple-600",
  },
  {
    id: "health-wellness",
    emoji: "🌿",
    gradient: "from-teal-400 via-emerald-500 to-green-600",
  },
  {
    id: "performances",
    emoji: "🎭",
    gradient: "from-violet-500 via-purple-600 to-indigo-700",
  },
  {
    id: "sports",
    emoji: "🏄",
    gradient: "from-lime-400 via-green-500 to-emerald-600",
  },
  {
    id: "culture",
    emoji: "🥁",
    gradient: "from-amber-500 via-yellow-600 to-orange-700",
  },
  {
    id: "adventure",
    emoji: "🤿",
    gradient: "from-sky-400 via-blue-500 to-indigo-600",
  },
];

/** Home browse row — full directory lives on /browse. */
export const HOME_FEATURED_CATEGORY_IDS: EventCategory[] = [
  "music",
  "parties",
  "food-drinks",
  "sports",
  "festivals",
  "dance",
  "performances",
  "concert",
];

export const CATEGORY_IDS = CATEGORY_DEFS.map((c) => c.id);

export function getCategoryDefs(): Omit<CategoryMeta, "label">[] {
  return CATEGORY_DEFS;
}

export function getFeaturedCategoryDefs(): Omit<CategoryMeta, "label">[] {
  return HOME_FEATURED_CATEGORY_IDS.map((id) =>
    CATEGORY_DEFS.find((c) => c.id === id),
  ).filter((def): def is Omit<CategoryMeta, "label"> => Boolean(def));
}

export function getCategoryMeta(
  id: string,
  labels?: Record<EventCategory, string>,
): CategoryMeta | undefined {
  const def = CATEGORY_DEFS.find((c) => c.id === id);
  if (!def) return undefined;
  return {
    ...def,
    label: labels?.[def.id as EventCategory] ?? def.id,
  };
}
