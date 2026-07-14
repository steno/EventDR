import Link from "next/link";
import { CategoryIcon } from "@/components/CategoryIcon";
import { getCategoryDefs } from "@/lib/categories";
import type { Dictionary } from "@/i18n/dictionaries";
import type { Locale } from "@/i18n/config";
import { categoryPath } from "@/lib/event-navigation";

interface CategoryDirectoryProps {
  locale: Locale;
  dict: Dictionary;
}

export function CategoryDirectory({ locale, dict }: CategoryDirectoryProps) {
  const categories = getCategoryDefs().map((def) => ({
    ...def,
    label: dict.categories[def.id],
  }));

  return (
    <div className="grid grid-cols-4 gap-x-3 gap-y-5 sm:grid-cols-5 sm:gap-y-6">
      {categories.map((cat) => (
        <Link
          key={cat.id}
          href={categoryPath(locale, cat.id)}
          className="group flex flex-col items-center gap-2 transition-transform active:scale-95"
        >
          <div
            className={`
              relative flex h-[52px] w-[52px] items-center justify-center rounded-2xl
              bg-gradient-to-br ${cat.gradient}
              shadow-[0_8px_20px_-10px_rgba(0,0,0,0.3)]
              ring-1 ring-white/50 transition-all duration-200 group-hover:scale-105
            `}
          >
            <CategoryIcon
              id={cat.id}
              className="h-6 w-6 text-white drop-shadow-sm"
            />
          </div>
          <span className="line-clamp-2 max-w-[92px] text-center text-[13px] font-bold leading-snug text-neutral-900 dark:text-neutral-100">
            {cat.label}
          </span>
        </Link>
      ))}
    </div>
  );
}
