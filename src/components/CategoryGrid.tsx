"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { getCategoryDefs } from "@/lib/categories";
import type { Dictionary } from "@/i18n/dictionaries";
import type { Locale } from "@/i18n/config";
import type { CitySlug } from "@/lib/cities";
import { HorizontalScrollEdgeFades } from "@/components/HorizontalScrollEdgeFades";
import { allEventsPath, categoryPath } from "@/lib/event-navigation";

const ALL_EVENTS_CHIP =
  "bg-neutral-100 text-neutral-900 ring-neutral-300/80 dark:bg-neutral-800/70 dark:text-neutral-50 dark:ring-neutral-600/50";

interface CategoryGridProps {
  locale: Locale;
  dict: Dictionary;
  /** When set, category links stay scoped to this city. */
  citySlug?: CitySlug | null;
  /** Fires when the user commits to a category (before navigation). */
  onCategorySelect?: () => void;
}

const PILL_CLASS = `
  inline-flex shrink-0 items-center justify-start gap-1.5 rounded-full
  px-3.5 py-2.5 text-base font-bold leading-none ring-1 shadow-sm
  transition-transform active:scale-[0.98] touch-manipulation
  hover:brightness-[0.97] dark:hover:brightness-110
  sm:px-4
`;

export function CategoryGrid({
  locale,
  dict,
  citySlug = null,
  onCategorySelect,
}: CategoryGridProps) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [pillsActive, setPillsActive] = useState(false);

  const categories = getCategoryDefs().map((def) => ({
    ...def,
    label: dict.categories[def.id],
  }));
  const allEventsHref = allEventsPath(locale, citySlug);
  const allEventsLabel = dict.browse.allEvents;

  const syncScrollHints = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const maxScroll = el.scrollWidth - el.clientWidth;
    if (maxScroll <= 4) {
      setCanScrollLeft(false);
      setCanScrollRight(false);
      return;
    }
    const left = el.scrollLeft;
    setCanScrollLeft(left > 4);
    setCanScrollRight(left < maxScroll - 4);
  }, []);

  useEffect(() => {
    syncScrollHints();
    const el = scrollerRef.current;
    if (!el) return;
    const onResize = () => syncScrollHints();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [syncScrollHints, categories.length]);

  const isScrollable = canScrollLeft || canScrollRight;
  const showScrollHint = isScrollable && canScrollRight && pillsActive;

  return (
    <section aria-label={dict.browse.ariaLabel}>
      <div
        className="sm:contents"
        onMouseEnter={() => setPillsActive(true)}
        onMouseLeave={() => setPillsActive(false)}
        onTouchStart={() => setPillsActive(true)}
        onTouchEnd={() => setPillsActive(false)}
        onTouchCancel={() => setPillsActive(false)}
      >
        <p
          className={`
            mb-1.5 flex min-h-4 items-center justify-end gap-0.5
            text-[10px] font-bold uppercase tracking-widest text-neutral-400 dark:text-neutral-500
            transition-opacity duration-150 sm:hidden
            ${!isScrollable ? "hidden" : showScrollHint ? "opacity-100" : "invisible opacity-0"}
          `}
          aria-hidden={!showScrollHint}
        >
          {dict.browse.scrollHint}
          <ChevronRight className="h-3 w-3 shrink-0" strokeWidth={2.75} />
        </p>
        <div
          className="
            relative rounded-2xl
            dark:isolate dark:bg-black/45 dark:px-2.5 dark:py-2.5
            sm:rounded-none sm:dark:bg-transparent sm:dark:p-0
          "
        >
          <div
            ref={scrollerRef}
            onScroll={syncScrollHints}
            className="overflow-x-auto scrollbar-hide sm:overflow-visible"
          >
            <div className="flex w-max gap-2 sm:w-auto sm:flex-wrap sm:gap-2.5">
              <Link
                href={allEventsHref}
                onClick={onCategorySelect}
                className={`${PILL_CLASS} ${ALL_EVENTS_CHIP}`}
                aria-label={allEventsLabel}
              >
                <span className="shrink-0 text-base leading-none select-none" aria-hidden>
                  📅
                </span>
                <span className="whitespace-nowrap">{allEventsLabel}</span>
              </Link>
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={categoryPath(locale, cat.id, citySlug)}
                  onClick={onCategorySelect}
                  className={`${PILL_CLASS} ${cat.chip}`}
                  aria-label={cat.label}
                >
                  <span className="shrink-0 text-base leading-none select-none" aria-hidden>
                    {cat.emoji}
                  </span>
                  <span className="whitespace-nowrap">{cat.label}</span>
                </Link>
              ))}
            </div>
          </div>

          <HorizontalScrollEdgeFades
            canScrollLeft={canScrollLeft}
            canScrollRight={canScrollRight}
          />
        </div>
      </div>
    </section>
  );
}
