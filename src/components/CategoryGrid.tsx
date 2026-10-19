"use client";

import type { ReactNode } from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { IntentLink } from "@/components/IntentLink";
import { PillScrollRail } from "@/components/PillScrollRail";
import { trackEvent } from "@/lib/analytics";
import { getCategoryDefs } from "@/lib/categories";
import { useCategoryAutoStepScroll } from "@/hooks/useCategoryAutoStepScroll";
import type { Dictionary } from "@/i18n/dictionaries";
import type { Locale } from "@/i18n/config";
import type { CitySlug } from "@/lib/cities";
import type { Event } from "@/lib/types";
import {
  CATEGORY_PILL_BASE,
  CATEGORY_PILL_DIMMED,
  CATEGORY_PILL_IDLE,
  CATEGORY_PILL_PENDING,
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
  /** Control to the left of the section title (e.g. desktop area select). */
  headerStart?: ReactNode;
  /** Control beside the section title (e.g. cruise ship pill). */
  headerAction?: ReactNode;
}

export function CategoryGrid({
  locale,
  dict,
  citySlug = null,
  events,
  onCategorySelect,
  headerStart,
  headerAction,
}: CategoryGridProps) {
  const router = useRouter();
  const scrollRef = useRef<HTMLDivElement>(null);
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
  const venuesHref = `/${locale}/venues`;
  // All Events + categories + Venues
  const pillCount = categories.length + 2;
  const [pendingHref, setPendingHref] = useState<string | null>(null);
  useCategoryAutoStepScroll(scrollRef, pillCount);

  // Mobile has no hover — warm visible category routes after first paint so
  // the first tap overlaps with an in-flight RSC fetch.
  useEffect(() => {
    const hrefs = [
      allEventsHref.split("?")[0]!,
      venuesHref,
      ...categoryHrefs,
    ];
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
  }, [allEventsHref, categoryHrefs, venuesHref, router]);

  return (
    <section aria-label={label}>
      <div className="mb-3 flex flex-wrap items-center gap-x-3 gap-y-2">
        {headerStart ? (
          <div className="shrink-0">{headerStart}</div>
        ) : null}
        <p className="mr-auto min-w-0 text-base font-semibold text-neutral-700 dark:text-neutral-300">
          {label}
        </p>
        {headerAction ? <div className="contents">{headerAction}</div> : null}
      </div>
      <PillScrollRail
        scrollRef={scrollRef}
        itemCount={pillCount}
        scrollMoreLabel={dict.browse.scrollHint}
        className="mt-1"
      >
        <IntentLink
          href={allEventsHref}
          onClick={() => {
            trackEvent("select_category", { category: "all" });
            setPendingHref(allEventsHref);
            onCategorySelect?.();
          }}
          aria-busy={pendingHref === allEventsHref || undefined}
          className={`${CATEGORY_PILL_BASE} ${CATEGORY_PILL_IDLE}${
            pendingHref === allEventsHref ? ` ${CATEGORY_PILL_PENDING}` : ""
          }${
            pendingHref != null && pendingHref !== allEventsHref
              ? ` ${CATEGORY_PILL_DIMMED}`
              : ""
          }`}
          aria-label={allEventsLabel}
        >
          {allEventsLabel}
        </IntentLink>
        {categories.map((cat) => {
          const href = categoryPath(locale, cat.id, citySlug);
          const pending = pendingHref === href;
          const dimmed = pendingHref != null && pendingHref !== href;

          return (
            <IntentLink
              key={cat.id}
              href={href}
              onClick={() => {
                trackEvent("select_category", { category: cat.id });
                setPendingHref(href);
                onCategorySelect?.();
              }}
              aria-busy={pending || undefined}
              className={`${CATEGORY_PILL_BASE} ${CATEGORY_PILL_IDLE}${
                pending ? ` ${CATEGORY_PILL_PENDING}` : ""
              }${dimmed ? ` ${CATEGORY_PILL_DIMMED}` : ""}`}
              aria-label={cat.label}
            >
              {cat.label}
            </IntentLink>
          );
        })}
        <IntentLink
          href={venuesHref}
          onClick={() => {
            trackEvent("select_category", { category: "venues" });
            setPendingHref(venuesHref);
            onCategorySelect?.();
          }}
          aria-busy={pendingHref === venuesHref || undefined}
          className={`${CATEGORY_PILL_BASE} ${CATEGORY_PILL_IDLE}${
            pendingHref === venuesHref ? ` ${CATEGORY_PILL_PENDING}` : ""
          }${
            pendingHref != null && pendingHref !== venuesHref
              ? ` ${CATEGORY_PILL_DIMMED}`
              : ""
          }`}
          aria-label={dict.venues.directory.title}
        >
          {dict.venues.directory.title}
        </IntentLink>
      </PillScrollRail>
    </section>
  );
}
