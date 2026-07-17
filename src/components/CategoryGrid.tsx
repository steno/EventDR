import Link from "next/link";
import { getCategoryDefs } from "@/lib/categories";
import type { Dictionary } from "@/i18n/dictionaries";
import type { Locale } from "@/i18n/config";
import type { CitySlug } from "@/lib/cities";
import { allEventsPath, categoryPath } from "@/lib/event-navigation";

const ALL_EVENTS_CHIP =
  "bg-neutral-100 text-neutral-900 ring-neutral-300/80 dark:bg-neutral-800/70 dark:text-neutral-50 dark:ring-neutral-600/50";

interface CategoryGridProps {
  locale: Locale;
  dict: Dictionary;
  /** When set, category links stay scoped to this city. */
  citySlug?: CitySlug | null;
  /** Fires when the user commits to a category (before navigation). */
  onCategorySelect?: () => void;
}

export function CategoryGrid({
  locale,
  dict,
  citySlug = null,
  onCategorySelect,
}: CategoryGridProps) {
  const categories = getCategoryDefs().map((def) => ({
    ...def,
    label: dict.categories[def.id],
  }));
  const allEventsHref = allEventsPath(locale, citySlug);
  const allEventsLabel = dict.browse.allEvents;

  return (
    <section aria-label={dict.browse.ariaLabel}>
      <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:gap-2.5">
        <Link
          href={allEventsHref}
          onClick={onCategorySelect}
          className={`
            col-span-2 inline-flex w-full min-w-0 items-center justify-start gap-1.5 rounded-full
            px-3.5 py-2.5 text-base font-bold leading-none ring-1 shadow-sm
            transition-transform active:scale-[0.98] touch-manipulation
            hover:brightness-[0.97] dark:hover:brightness-110
            sm:w-auto sm:px-4
            ${ALL_EVENTS_CHIP}
          `}
          aria-label={allEventsLabel}
        >
          <span className="shrink-0 text-base leading-none select-none" aria-hidden>
            📅
          </span>
          <span className="min-w-0 truncate text-left">
            {allEventsLabel}
          </span>
        </Link>
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={categoryPath(locale, cat.id, citySlug)}
            onClick={onCategorySelect}
            className={`
              inline-flex w-full min-w-0 items-center justify-start gap-1.5 rounded-full
              px-3.5 py-2.5 text-base font-bold leading-none ring-1 shadow-sm
              transition-transform active:scale-[0.98] touch-manipulation
              hover:brightness-[0.97] dark:hover:brightness-110
              sm:w-auto sm:px-4
              ${cat.chip}
            `}
            aria-label={cat.label}
          >
            <span className="shrink-0 text-base leading-none select-none" aria-hidden>
              {cat.emoji}
            </span>
            <span className="min-w-0 truncate text-left">
              {cat.label}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
