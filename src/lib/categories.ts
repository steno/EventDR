import type { CategoryMeta, EventCategory } from "./types";

const CATEGORY_DEFS: Omit<CategoryMeta, "label">[] = [
  {
    id: "music",
    emoji: "🎶",
    gradient: "from-rose-400 via-red-500 to-orange-500",
    chip: "bg-rose-50 text-rose-900 ring-rose-200/80 dark:bg-rose-950/40 dark:text-rose-100 dark:ring-rose-800/50",
  },
  {
    id: "business",
    emoji: "🤝",
    gradient: "from-zinc-600 via-zinc-700 to-zinc-900",
    chip: "bg-zinc-100 text-zinc-800 ring-zinc-200/80 dark:bg-zinc-800/60 dark:text-zinc-100 dark:ring-zinc-600/50",
  },
  {
    id: "concert",
    emoji: "🎸",
    gradient: "from-amber-400 via-orange-500 to-red-500",
    chip: "bg-orange-50 text-orange-900 ring-orange-200/80 dark:bg-orange-950/40 dark:text-orange-100 dark:ring-orange-800/50",
  },
  {
    id: "parties",
    emoji: "🎉",
    gradient: "from-fuchsia-400 via-violet-500 to-indigo-600",
    chip: "bg-fuchsia-50 text-fuchsia-900 ring-fuchsia-200/80 dark:bg-fuchsia-950/40 dark:text-fuchsia-100 dark:ring-fuchsia-800/50",
  },
  {
    id: "food-drinks",
    emoji: "🍹",
    gradient: "from-yellow-400 via-amber-500 to-orange-600",
    chip: "bg-amber-50 text-amber-950 ring-amber-200/80 dark:bg-amber-950/40 dark:text-amber-100 dark:ring-amber-800/50",
  },
  {
    id: "festivals",
    emoji: "🎪",
    gradient: "from-red-500 via-rose-500 to-pink-500",
    chip: "bg-red-50 text-red-900 ring-red-200/80 dark:bg-red-950/40 dark:text-red-100 dark:ring-red-800/50",
  },
  {
    id: "dance",
    emoji: "💃",
    gradient: "from-pink-400 via-fuchsia-500 to-purple-600",
    chip: "bg-pink-50 text-pink-900 ring-pink-200/80 dark:bg-pink-950/40 dark:text-pink-100 dark:ring-pink-800/50",
  },
  {
    id: "health-wellness",
    emoji: "🌿",
    gradient: "from-teal-400 via-emerald-500 to-green-600",
    chip: "bg-emerald-50 text-emerald-950 ring-emerald-200/80 dark:bg-emerald-950/40 dark:text-emerald-100 dark:ring-emerald-800/50",
  },
  {
    id: "performances",
    emoji: "🎭",
    gradient: "from-violet-500 via-purple-600 to-indigo-700",
    chip: "bg-violet-50 text-violet-950 ring-violet-200/80 dark:bg-violet-950/40 dark:text-violet-100 dark:ring-violet-800/50",
  },
  {
    id: "sports",
    emoji: "🏄",
    gradient: "from-lime-400 via-green-500 to-emerald-600",
    chip: "bg-lime-50 text-lime-950 ring-lime-200/80 dark:bg-lime-950/35 dark:text-lime-100 dark:ring-lime-800/50",
  },
  {
    id: "culture",
    emoji: "🥁",
    gradient: "from-amber-500 via-yellow-600 to-orange-700",
    chip: "bg-yellow-50 text-yellow-950 ring-yellow-200/80 dark:bg-yellow-950/35 dark:text-yellow-100 dark:ring-yellow-800/50",
  },
  {
    id: "adventure",
    emoji: "🤿",
    gradient: "from-sky-400 via-blue-500 to-indigo-600",
    chip: "bg-sky-50 text-sky-950 ring-sky-200/80 dark:bg-sky-950/40 dark:text-sky-100 dark:ring-sky-800/50",
  },
];

export const CATEGORY_IDS = CATEGORY_DEFS.map((c) => c.id);

export function getCategoryDefs(): Omit<CategoryMeta, "label">[] {
  return CATEGORY_DEFS;
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
