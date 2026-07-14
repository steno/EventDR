import Link from "next/link";
import { CategoryIcon } from "@/components/CategoryIcon";
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
}

export function CategoryGrid({ locale, dict, citySlug = null }: CategoryGridProps) {
  const categories = getCategoryDefs().map((def) => ({
    ...def,
    label: dict.categories[def.id],
  }));

  return (
    <section aria-label={dict.browse.ariaLabel}>
      <h2 className="mb-2.5 px-1 text-xl font-black tracking-tight text-neutral-950 dark:text-neutral-100">
        {dict.browse.subtitle}
      </h2>

      <div className="grid grid-cols-4 gap-x-2 gap-y-2.5 sm:gap-x-3 sm:gap-y-3">
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={categoryPath(locale, cat.id, citySlug)}
            className="group flex flex-col items-center gap-1 text-center touch-manipulation active:scale-[0.97] transition-transform"
            aria-label={cat.label}
          >
            <span
              className={`
                flex h-11 w-11 items-center justify-center rounded-full
                bg-gradient-to-br ${cat.gradient}
                shadow-[0_8px_20px_-12px_rgba(0,0,0,0.45)]
                ring-1 ring-black/5 transition-transform duration-200
                group-hover:scale-[1.04] dark:ring-white/10 sm:h-12 sm:w-12
              `}
              aria-hidden
            >
              <CategoryIcon
                id={cat.id}
                className="h-5 w-5 text-white drop-shadow-sm sm:h-6 sm:w-6"
              />
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
