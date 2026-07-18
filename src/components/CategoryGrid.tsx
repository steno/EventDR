"use client";

import Link from "next/link";
import { Loader2 } from "lucide-react";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { getCategoryDefs } from "@/lib/categories";
import type { Dictionary } from "@/i18n/dictionaries";
import type { Locale } from "@/i18n/config";
import type { CitySlug } from "@/lib/cities";
import {
  CATEGORY_PILL_ACTIVE,
  CATEGORY_PILL_BASE,
  CATEGORY_PILL_IDLE,
  CATEGORY_SCROLLER_BAR,
} from "@/components/category-scroller-styles";
import { allEventsPath, categoryPath } from "@/lib/event-navigation";

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
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [loadingHref, setLoadingHref] = useState<string | null>(null);

  const categories = getCategoryDefs().map((def) => ({
    ...def,
    label: dict.categories[def.id],
  }));
  const allEventsHref = allEventsPath(locale, citySlug);
  const allEventsLabel = dict.browse.allEvents;

  const handleNavigation = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    onCategorySelect?.();
    setLoadingHref(href);
    startTransition(() => {
      router.push(href);
    });
  };

  return (
    <section aria-label={dict.browse.ariaLabel}>
      <div className={CATEGORY_SCROLLER_BAR}>
        <div className="relative min-w-0 flex-1 overflow-hidden">
          <div className="overflow-x-auto scrollbar-hide">
            <div className="flex w-max gap-3 px-0.5 py-1">
              <Link
                href={allEventsHref}
                onClick={(e) => handleNavigation(e, allEventsHref)}
                className={`${CATEGORY_PILL_BASE} ${CATEGORY_PILL_ACTIVE}`}
                aria-label={allEventsLabel}
                aria-current="page"
              >
                <span className="text-4xl leading-none select-none" aria-hidden>
                  📅
                </span>
                <span className="truncate w-full">{allEventsLabel}</span>
              </Link>
              {categories.map((cat) => {
                const href = categoryPath(locale, cat.id, citySlug);
                const isLoading = isPending && loadingHref === href;
                
                return (
                  <Link
                    key={cat.id}
                    href={href}
                    onClick={(e) => handleNavigation(e, href)}
                    className={`${CATEGORY_PILL_BASE} ${CATEGORY_PILL_IDLE} ${isLoading ? "opacity-70" : ""}`}
                    aria-label={cat.label}
                  >
                    {isLoading ? (
                      <Loader2 className="h-9 w-9 animate-spin shrink-0" aria-hidden />
                    ) : (
                      <span className="text-4xl leading-none select-none" aria-hidden>
                        {cat.emoji}
                      </span>
                    )}
                    <span className="truncate w-full">{cat.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
