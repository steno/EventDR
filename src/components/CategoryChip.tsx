"use client";

import { IntentLink } from "@/components/IntentLink";
import type { CategoryMeta } from "@/lib/types";
import type { Locale } from "@/i18n/config";
import { categoryPath } from "@/lib/event-navigation";

interface CategoryChipProps {
  category: CategoryMeta;
  locale: Locale;
}

const CHIP_PENDING_CLASS = `
  scale-[0.98] border-orange-400 ring-2 ring-orange-500/80
  shadow-[0_8px_18px_-10px_rgba(251,146,60,0.45)]
  dark:border-orange-500 dark:ring-orange-400/70
`;

export function CategoryChip({ category, locale }: CategoryChipProps) {
  return (
    <IntentLink
      href={categoryPath(locale, category.id)}
      pendingFeedback
      pendingClassName={CHIP_PENDING_CLASS}
      className="
        group inline-flex shrink-0 snap-start items-center gap-1.5 rounded-full
        border border-neutral-300 bg-white px-3.5 py-2 text-sm font-bold
        text-neutral-800 shadow-sm touch-manipulation
        dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100
        transition-[transform,box-shadow,opacity,border-color,color] duration-200
        hover:border-orange-400 hover:text-orange-700
        dark:hover:border-orange-800 dark:hover:text-orange-400
      "
      aria-label={category.label}
    >
      <span className="text-base leading-none select-none" aria-hidden>
        {category.emoji}
      </span>
      <span className="whitespace-nowrap">{category.label}</span>
    </IntentLink>
  );
}
