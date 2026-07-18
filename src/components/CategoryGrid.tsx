"use client";

import Link from "next/link";
import { ChevronRight, Loader2 } from "lucide-react";
import { useCallback, useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { getCategoryDefs } from "@/lib/categories";
import type { Dictionary } from "@/i18n/dictionaries";
import type { Locale } from "@/i18n/config";
import type { CitySlug } from "@/lib/cities";
import { HorizontalScrollEdgeFades } from "@/components/HorizontalScrollEdgeFades";
import {
  CATEGORY_PILL_ACTIVE,
  CATEGORY_PILL_BASE,
  CATEGORY_PILL_IDLE,
  CATEGORY_SCROLL_BTN,
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
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

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

  const scrollForward = () => {
    const el = scrollerRef.current;
    if (!el) return;
    const step = Math.min(280, Math.max(160, el.clientWidth * 0.55));
    el.scrollBy({ left: step, behavior: "smooth" });
  };

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
        <div className="relative min-w-0 flex-1 overflow-hidden rounded-full">
          <div
            ref={scrollerRef}
            onScroll={syncScrollHints}
            className="overflow-x-auto scrollbar-hide"
          >
            <div className="flex w-max gap-1.5 px-0.5">
              <Link
                href={allEventsHref}
                onClick={(e) => handleNavigation(e, allEventsHref)}
                className={`${CATEGORY_PILL_BASE} ${CATEGORY_PILL_ACTIVE}`}
                aria-label={allEventsLabel}
                aria-current="page"
              >
                <span className="shrink-0 text-sm leading-none select-none" aria-hidden>
                  📅
                </span>
                <span className="whitespace-nowrap">{allEventsLabel}</span>
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
                      <Loader2 className="h-3.5 w-3.5 animate-spin shrink-0" aria-hidden />
                    ) : (
                      <span className="shrink-0 text-sm leading-none select-none" aria-hidden>
                        {cat.emoji}
                      </span>
                    )}
                    <span className="whitespace-nowrap">{cat.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>

          <HorizontalScrollEdgeFades
            canScrollLeft={canScrollLeft}
            canScrollRight={canScrollRight}
            tone="bar"
          />
        </div>

        {canScrollRight ? (
          <button
            type="button"
            onClick={scrollForward}
            className={CATEGORY_SCROLL_BTN}
            aria-label={dict.browse.scrollHint}
          >
            <ChevronRight className="h-4 w-4" strokeWidth={2.5} />
          </button>
        ) : null}
      </div>
    </section>
  );
}
