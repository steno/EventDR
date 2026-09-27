"use client";

import type { ReactNode } from "react";
import { useScrollChromeVisible } from "@/hooks/useScrollChrome";
import { PAGE_GUTTER_BLEED_CLASS } from "@/lib/page-shell";
import {
  SCROLL_CHROME_TRANSITION_CLASS,
  scrollChromeFilterSlideClass,
} from "@/lib/scroll-chrome";

type StickyListFiltersProps = {
  children: ReactNode;
  className?: string;
};

/**
 * Area select + time tabs (+ price/view) stick together under StickyListHeader.
 * When hide-on-scroll tucks the header away, this bar eases up by the same
 * distance so event cards cannot show through the empty band at the top.
 */
export function StickyListFilters({
  children,
  className = "",
}: StickyListFiltersProps) {
  const chromeVisible = useScrollChromeVisible();

  return (
    <div
      data-sticky-list-filters
      className={`
        sticky top-[calc(var(--sticky-list-header-height,0px)-1px)] z-10 mb-4 md:mb-3
        ${PAGE_GUTTER_BLEED_CLASS}
        border-b border-neutral-200/60 bg-background/95 pb-2 pt-3 backdrop-blur-sm
        md:pb-1.5 md:pt-1.5
        dark:border-neutral-800/60 dark:bg-neutral-950/95
        ${SCROLL_CHROME_TRANSITION_CLASS}
        ${scrollChromeFilterSlideClass(chromeVisible)}
        ${className}
      `}
    >
      {children}
    </div>
  );
}

/** Non-sticky marker at the filter bar — fallback when no category-nav anchor exists. */
export function ListScrollAnchor({
  anchorRef,
  className = "",
}: {
  anchorRef: React.RefObject<HTMLDivElement | null>;
  className?: string;
}) {
  return (
    <div
      ref={anchorRef}
      data-list-scroll-anchor
      className={`pointer-events-none h-0 ${className}`}
      aria-hidden
    />
  );
}
