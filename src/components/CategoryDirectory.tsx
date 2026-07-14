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
    <div className="grid grid-cols-4 gap-x-2 gap-y-2.5 sm:gap-x-3 sm:gap-y-3">
      {categories.map((cat) => (
        <Link
          key={cat.id}
          href={categoryPath(locale, cat.id)}
          className="group flex flex-col items-center gap-1 transition-transform active:scale-95"
        >
          <div
            className={`
              relative flex h-11 w-11 items-center justify-center rounded-2xl
              bg-gradient-to-br ${cat.gradient}
              shadow-[0_8px_20px_-10px_rgba(0,0,0,0.3)]
              ring-1 ring-white/50 transition-all duration-200 group-hover:scale-105
              sm:h-12 sm:w-12
            `}
          >
            <CategoryIcon
              id={cat.id}
              className="h-5 w-5 text-white drop-shadow-sm sm:h-[22px] sm:w-[22px]"
            />
          </div>
          <span className="line-clamp-2 max-w-[88px] text-center text-[12px] font-bold leading-tight text-neutral-900 dark:text-neutral-100 sm:text-[13px]">
            {cat.label}
          </span>
        </Link>
      ))}
    </div>
  );
}
