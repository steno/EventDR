"use client";

import { useLayoutEffect, type ReactNode } from "react";
import { PAGE_GUTTER_BLEED_CLASS, STICKY_CHROME_SURFACE_CLASS } from "@/lib/page-shell";
import {
  SCROLL_CHROME_TRANSITION_CLASS,
  syncScrollChromeDom,
} from "@/lib/scroll-chrome";

type StickyListFiltersProps = {
  children: ReactNode;
  className?: string;
  /**
   * Stick under StickyListHeader (default). Set false on home discover where
   * AppHeader scrolls away and the area chip should park at the viewport top.
   */
  belowListHeader?: boolean;
};

/**
 * Area select + time tabs (+ price/view) stick together under StickyListHeader.
 * When hide-on-scroll tucks the header away, this bar eases up by the same
 * distance so event cards cannot show through the empty band at the top.
 * Hide/show transform is owned by `scroll-chrome` (`data-chrome-hidden`).
 */
export function StickyListFilters({
  children,
  className = "",
  belowListHeader = true,
}: StickyListFiltersProps) {
  useLayoutEffect(() => {
    syncScrollChromeDom();
  }, []);

  return (
    <div
      data-sticky-list-filters
      className={`
        sticky z-10 mb-4 md:mb-3
        ${
          belowListHeader
            ? "top-[calc(var(--sticky-list-header-height,3.5rem)-1px)]"
            : "top-0"
        }
        ${PAGE_GUTTER_BLEED_CLASS}
        ${STICKY_CHROME_SURFACE_CLASS}
        pb-2 pt-3
        md:pb-1.5 md:pt-1.5
        ${SCROLL_CHROME_TRANSITION_CLASS}
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
