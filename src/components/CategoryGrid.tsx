import Link from "next/link";
import { getCategoryDefs } from "@/lib/categories";
import type { Dictionary } from "@/i18n/dictionaries";
import type { Locale } from "@/i18n/config";
import { CategoryIcon } from "./CategoryIcon";

interface CategoryGridProps {
  locale: Locale;
  dict: Dictionary;
}

export function CategoryGrid({ locale, dict }: CategoryGridProps) {
  const categories = getCategoryDefs().map((def) => ({
    ...def,
    label: dict.categories[def.id],
  }));

  return (
    <section aria-label={dict.browse.ariaLabel}>
      <div className="mb-4 px-1">
        <h2 className="text-xl font-black tracking-tight text-neutral-950 dark:text-neutral-100">
          {dict.browse.subtitle}
        </h2>
      </div>
      <div
        className="
          flex gap-3.5 overflow-x-auto pb-2 -mx-4 px-4
          snap-x snap-mandatory scrollbar-hide
          sm:grid sm:grid-cols-5 sm:gap-x-2 sm:gap-y-6 sm:overflow-visible sm:mx-0 sm:px-0
        "
      >
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={`/${locale}/category/${cat.id}`}
            className="snap-start"
          >
            <CategoryIcon category={cat} />
          </Link>
        ))}
      </div>
    </section>
  );
}
