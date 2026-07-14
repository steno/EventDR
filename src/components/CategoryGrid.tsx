import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { getFeaturedCategoryDefs } from "@/lib/categories";
import type { Dictionary } from "@/i18n/dictionaries";
import type { Locale } from "@/i18n/config";
import type { CitySlug } from "@/lib/cities";
import { categoryPath } from "@/lib/event-navigation";

interface CategoryGridProps {
  locale: Locale;
  dict: Dictionary;
  /** When set, category links stay scoped to this city. */
  citySlug?: CitySlug | null;
}

export function CategoryGrid({ locale, dict, citySlug = null }: CategoryGridProps) {
  const categories = getFeaturedCategoryDefs().map((def) => ({
    ...def,
    label: dict.categories[def.id],
  }));

  const allCategoriesHref = citySlug
    ? `/${locale}/city/${citySlug}`
    : `/${locale}/browse`;

  return (
    <section aria-label={dict.browse.ariaLabel}>
      <div className="mb-4 flex items-end justify-between gap-3 px-1">
        <h2 className="text-xl font-black tracking-tight text-neutral-950 dark:text-neutral-100">
          {dict.browse.subtitle}
        </h2>
        <Link
          href={allCategoriesHref}
          className="inline-flex items-center gap-0.5 rounded-full bg-orange-50 px-2.5 py-1 text-xs font-bold text-orange-600 transition-colors hover:bg-orange-100 touch-manipulation dark:bg-orange-950/50 dark:hover:bg-orange-950/70"
        >
          {dict.browse.allCategories}
          <ChevronRight className="h-3.5 w-3.5" aria-hidden />
        </Link>
      </div>

      <div className="grid grid-cols-4 gap-x-2 gap-y-4 sm:grid-cols-4 sm:gap-x-3 sm:gap-y-5">
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={categoryPath(locale, cat.id, citySlug)}
            className="group flex flex-col items-center gap-2 text-center touch-manipulation active:scale-[0.97] transition-transform"
            aria-label={cat.label}
          >
            <span
              className={`
                flex h-14 w-14 items-center justify-center rounded-full
                bg-gradient-to-br ${cat.gradient}
                text-3xl shadow-[0_8px_20px_-12px_rgba(0,0,0,0.45)]
                ring-1 ring-black/5 transition-transform duration-200
                group-hover:scale-[1.04] dark:ring-white/10 sm:h-16 sm:w-16 sm:text-4xl
              `}
              aria-hidden
            >
              <span className="drop-shadow-sm select-none leading-none">{cat.emoji}</span>
            </span>
            <span className="max-w-[4.75rem] text-[11px] font-bold leading-tight text-neutral-800 dark:text-neutral-200 sm:max-w-none sm:text-xs">
              {cat.label}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
