import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { getFeaturedCategoryDefs } from "@/lib/categories";
import type { Dictionary } from "@/i18n/dictionaries";
import type { Locale } from "@/i18n/config";
import { CategoryChip } from "./CategoryChip";

interface CategoryGridProps {
  locale: Locale;
  dict: Dictionary;
}

export function CategoryGrid({ locale, dict }: CategoryGridProps) {
  const categories = getFeaturedCategoryDefs().map((def) => ({
    ...def,
    label: dict.categories[def.id],
  }));

  return (
    <section aria-label={dict.browse.ariaLabel}>
      <div className="mb-3 flex items-end justify-between gap-3 px-1">
        <h2 className="text-xl font-black tracking-tight text-neutral-950 dark:text-neutral-100">
          {dict.browse.subtitle}
        </h2>
        <Link
          href={`/${locale}/browse`}
          className="inline-flex items-center gap-0.5 rounded-full bg-orange-50 px-2.5 py-1 text-xs font-bold text-orange-600 transition-colors hover:bg-orange-100 touch-manipulation dark:bg-orange-950/50 dark:hover:bg-orange-950/70"
        >
          {dict.browse.allCategories}
          <ChevronRight className="h-3.5 w-3.5" aria-hidden />
        </Link>
      </div>
      <div className="-mx-4 flex snap-x snap-mandatory gap-2 overflow-x-auto px-4 pb-1 scrollbar-hide">
        {categories.map((cat) => (
          <CategoryChip key={cat.id} category={cat} locale={locale} />
        ))}
      </div>
    </section>
  );
}
