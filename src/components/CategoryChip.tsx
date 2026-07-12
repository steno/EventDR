import Link from "next/link";
import type { CategoryMeta } from "@/lib/types";
import type { Locale } from "@/i18n/config";
import { categoryPath } from "@/lib/event-navigation";

interface CategoryChipProps {
  category: CategoryMeta;
  locale: Locale;
}

export function CategoryChip({ category, locale }: CategoryChipProps) {
  return (
    <Link
      href={categoryPath(locale, category.id)}
      className="
        group inline-flex shrink-0 snap-start items-center gap-1.5 rounded-full
        border border-neutral-200/90 bg-white px-3.5 py-2 text-[13px] font-bold
        text-neutral-800 shadow-sm transition-colors
        hover:border-orange-200 hover:text-orange-700
        active:scale-[0.98] touch-manipulation
        dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100
        dark:hover:border-orange-800 dark:hover:text-orange-400
      "
      aria-label={category.label}
    >
      <span className="text-base leading-none select-none" aria-hidden>
        {category.emoji}
      </span>
      <span className="whitespace-nowrap">{category.label}</span>
    </Link>
  );
}
