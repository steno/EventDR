"use client";

import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { IntentLink } from "@/components/IntentLink";
import { getCategoryDefs } from "@/lib/categories";
import type { Dictionary } from "@/i18n/dictionaries";
import type { Locale } from "@/i18n/config";
import type { CitySlug } from "@/lib/cities";
import type { Event } from "@/lib/types";
import {
  CATEGORY_PILL_ACTIVE,
  CATEGORY_PILL_BASE,
  CATEGORY_PILL_IDLE,
  CATEGORY_SCROLLER_BAR,
} from "@/components/category-scroller-styles";
import {
  allEventsPath,
  categoryPath,
  sortCategoryIdsByEventCount,
} from "@/lib/event-navigation";

interface CategoryGridProps {
  locale: Locale;
  dict: Dictionary;
  /** When set, category links stay scoped to this city. */
  citySlug?: CitySlug | null;
  /** When set, pills are ordered by how many of these events match each category. */
  events?: Pick<Event, "category" | "categories">[];
  /** Fires when the user commits to a category (before navigation). */
  onCategorySelect?: () => void;
}

export function CategoryGrid({
  locale,
  dict,
  citySlug = null,
  events,
  onCategorySelect,
}: CategoryGridProps) {
  const router = useRouter();
  const defsById = useMemo(
    () => new Map(getCategoryDefs().map((def) => [def.id, def])),
    [],
  );
  const orderedIds = useMemo(
    () =>
      events && events.length > 0
        ? sortCategoryIdsByEventCount(events)
        : getCategoryDefs().map((def) => def.id),
    [events],
  );
  const categories = orderedIds.flatMap((id) => {
    const def = defsById.get(id);
    if (!def) return [];
    return [{ ...def, label: dict.categories[def.id] }];
  });
  const allEventsHref = allEventsPath(locale, citySlug);
  const allEventsLabel = dict.browse.allEvents;
  const label = dict.cities.browseTopCategories;

  const categoryHrefs = useMemo(
    () => orderedIds.map((id) => categoryPath(locale, id, citySlug)),
    [orderedIds, citySlug, locale],
  );

  // Mobile has no hover — warm visible category routes after first paint so
  // the first tap overlaps with an in-flight RSC fetch.
  useEffect(() => {
    const hrefs = [allEventsHref.split("?")[0]!, ...categoryHrefs];
    const idle =
      typeof window !== "undefined" && "requestIdleCallback" in window
        ? window.requestIdleCallback.bind(window)
        : (cb: () => void) => window.setTimeout(cb, 200);
    const cancel =
      typeof window !== "undefined" && "cancelIdleCallback" in window
        ? window.cancelIdleCallback.bind(window)
        : (handle: number) => window.clearTimeout(handle);

    const id = idle(() => {
      for (const href of hrefs.slice(0, 8)) {
        void router.prefetch(href);
      }
    }) as number;
    return () => cancel(id);
  }, [allEventsHref, categoryHrefs, router]);

  return (
    <section aria-label={label}>
      <p className="mb-2.5 text-base font-semibold text-neutral-700 dark:text-neutral-300">
        {label}
      </p>
      <div className={CATEGORY_SCROLLER_BAR}>
        <div className="relative min-w-0 flex-1 overflow-hidden">
          <div className="overflow-x-auto scrollbar-hide">
            <div className="flex w-max gap-3 px-0.5 py-1">
              <IntentLink
                href={allEventsHref}
                onClick={() => onCategorySelect?.()}
                className={`${CATEGORY_PILL_BASE} ${CATEGORY_PILL_ACTIVE}`}
                aria-label={allEventsLabel}
                aria-current="page"
              >
                <span className="text-4xl leading-none select-none" aria-hidden>
                  📅
                </span>
                <span className="line-clamp-2 w-full">{allEventsLabel}</span>
              </IntentLink>
              {categories.map((cat) => {
                const href = categoryPath(locale, cat.id, citySlug);

                return (
                  <IntentLink
                    key={cat.id}
                    href={href}
                    onClick={() => onCategorySelect?.()}
                    className={`${CATEGORY_PILL_BASE} ${CATEGORY_PILL_IDLE}`}
                    aria-label={cat.label}
                  >
                    <span className="text-4xl leading-none select-none" aria-hidden>
                      {cat.emoji}
                    </span>
                    <span className="line-clamp-2 w-full">{cat.label}</span>
                  </IntentLink>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
