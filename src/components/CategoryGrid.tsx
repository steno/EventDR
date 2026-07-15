import Link from "next/link";
import { getCategoryDefs } from "@/lib/categories";
import type { Dictionary } from "@/i18n/dictionaries";
import type { Locale } from "@/i18n/config";
import type { CitySlug } from "@/lib/cities";
import { categoryPath } from "@/lib/event-navigation";

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

  return (
    <section aria-label={dict.browse.ariaLabel}>
      <div className="flex flex-wrap gap-x-1.5 gap-y-1 sm:gap-2">
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={categoryPath(locale, cat.id, citySlug)}
            onClick={onCategorySelect}
            className={`
              inline-flex items-center gap-1 rounded-full px-3 py-1
              text-xs font-bold leading-5 ring-1 shadow-sm
              transition-transform active:scale-[0.98] touch-manipulation
              hover:brightness-[0.97] dark:hover:brightness-110
              sm:gap-1.5 sm:px-3.5 sm:py-2 sm:text-[13px] sm:leading-none
              ${cat.chip}
            `}
            aria-label={cat.label}
          >
            <span className="text-sm leading-none select-none sm:text-base" aria-hidden>
              {cat.emoji}
            </span>
            <span className="whitespace-nowrap">{cat.label}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
