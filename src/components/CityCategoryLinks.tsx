"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { HorizontalScrollEdgeFades } from "@/components/HorizontalScrollEdgeFades";

export type RelatedCategoryLink = {
  href: string;
  label: string;
};

interface CityCategoryLinksProps {
  label: string;
  links: RelatedCategoryLink[];
  /** Highlights the selected category pill. */
  activeHref?: string;
}

export function CityCategoryLinks({
  label,
  links,
  activeHref,
}: CityCategoryLinksProps) {
  const activeRef = useRef<HTMLAnchorElement>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

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
  }, [syncScrollHints, links]);

  useEffect(() => {
    const active = activeRef.current;
    if (!active) return;

    // Keep the active pill in view on the mobile slider without jumping the page.
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    active.scrollIntoView({
      behavior: prefersReducedMotion ? "auto" : "smooth",
      inline: "nearest",
      block: "nearest",
    });
    // Scroll may be async; refresh fades after layout settles.
    requestAnimationFrame(syncScrollHints);
  }, [activeHref, syncScrollHints]);

  if (links.length === 0) return null;

  return (
    <nav aria-label={label} className="mb-6">
      <p className="mb-2.5 text-xs font-bold uppercase tracking-widest text-neutral-400">
        {label}
      </p>
      {/* Stay inside page gutters so overflow crops at the same edges as the label. */}
      <div className="relative isolate">
        <div
          ref={scrollerRef}
          onScroll={syncScrollHints}
          className="overflow-x-auto scrollbar-hide sm:overflow-visible"
        >
          <div className="flex w-max gap-2 sm:w-auto sm:flex-wrap sm:gap-2.5">
            {links.map((link) => {
              const active = activeHref === link.href;
              return (
                <Link
                  key={link.href}
                  ref={active ? activeRef : undefined}
                  href={link.href}
                  scroll={false}
                  aria-current={active ? "page" : undefined}
                  className={`
                    shrink-0 rounded-full border px-4 py-2 text-sm leading-none font-semibold
                    transition-colors touch-manipulation
                    ${
                      active
                        ? "border-orange-500 bg-transparent text-orange-600 dark:border-orange-400 dark:text-orange-400"
                        : "border-neutral-200 bg-white text-neutral-700 hover:border-neutral-300 hover:text-neutral-900 dark:border-neutral-600 dark:bg-neutral-950 dark:text-neutral-100 dark:hover:border-neutral-500 dark:hover:text-white"
                    }
                  `}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>
        </div>

        <HorizontalScrollEdgeFades
          canScrollLeft={canScrollLeft}
          canScrollRight={canScrollRight}
        />
      </div>
    </nav>
  );
}
