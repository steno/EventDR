import Link from "next/link";
import { getCategoryMeta } from "@/lib/categories";
import { getEventCategoryList } from "@/lib/categorize";
import { categoryPath } from "@/lib/event-navigation";
import type { Dictionary } from "@/i18n/dictionaries";
import type { Locale } from "@/i18n/config";
import type { Event } from "@/lib/types";

interface EventCategoryLinksProps {
  event: Pick<Event, "category" | "categories">;
  locale: Locale;
  dict: Dictionary;
  className?: string;
  /** Set false when rendered inside another link (event cards). */
  linkable?: boolean;
}

function categoryChipClass(index: number, linkable: boolean): string {
  const base =
    index === 0
      ? "inline-flex items-center gap-1 rounded-full bg-neutral-100 dark:bg-neutral-800 px-2.5 py-1 text-[11px] font-bold text-neutral-800 dark:text-neutral-200"
      : "inline-flex items-center gap-1 rounded-full bg-neutral-50 dark:bg-neutral-900 px-2.5 py-1 text-[11px] font-semibold text-neutral-600 dark:text-neutral-400 ring-1 ring-neutral-200/80 dark:ring-neutral-700/80";

  if (!linkable) return base;

  return index === 0
    ? `${base} hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors touch-manipulation`
    : `${base} hover:text-orange-600 hover:ring-orange-200/80 dark:hover:ring-orange-900/50 transition-colors touch-manipulation`;
}

export function EventCategoryLinks({
  event,
  locale,
  dict,
  className = "",
  linkable = true,
}: EventCategoryLinksProps) {
  const ids = getEventCategoryList(event);
  if (ids.length === 0) return null;

  return (
    <div className={`flex flex-wrap gap-1.5 ${className}`}>
      {ids.map((id, index) => {
        const meta = getCategoryMeta(id, dict.categories);
        if (!meta) return null;

        const chipClass = categoryChipClass(index, linkable);
        const content = (
          <>
            <span aria-hidden>{meta.emoji}</span>
            {meta.label}
          </>
        );

        if (!linkable) {
          return (
            <span key={id} className={chipClass}>
              {content}
            </span>
          );
        }

        return (
          <Link key={id} href={categoryPath(locale, id)} className={chipClass}>
            {content}
          </Link>
        );
      })}
    </div>
  );
}
