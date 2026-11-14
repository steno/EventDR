"use client";

import { useLayoutEffect, useRef, type ReactNode } from "react";
import { PAGE_GUTTER_BLEED_CLASS, STICKY_CHROME_SURFACE_CLASS } from "@/lib/page-shell";
import {
  SCROLL_CHROME_TRANSITION_CLASS,
  syncScrollChromeDom,
} from "@/lib/scroll-chrome";

const STICKY_FILTERS_HEIGHT_VAR = "--sticky-list-filters-height";

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
 * Publishes `--sticky-list-filters-height` so All calendar day labels can park
 * fully underneath (not clipped by the time tabs).
 */
export function StickyListFilters({
  children,
  className = "",
  belowListHeader = true,
}: StickyListFiltersProps) {
  const rootRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    syncScrollChromeDom();
  }, []);

  useLayoutEffect(() => {
    const el = rootRef.current;
    if (!el) return;

    const publishHeight = () => {
      document.documentElement.style.setProperty(
        STICKY_FILTERS_HEIGHT_VAR,
        `${el.offsetHeight}px`,
      );
    };

    publishHeight();
    const observer = new ResizeObserver(publishHeight);
    observer.observe(el);
    const rafId = requestAnimationFrame(publishHeight);

    return () => {
      cancelAnimationFrame(rafId);
      observer.disconnect();
      requestAnimationFrame(() => {
        if (!document.querySelector("[data-sticky-list-filters]")) {
          document.documentElement.style.removeProperty(
            STICKY_FILTERS_HEIGHT_VAR,
          );
        }
      });
    };
  }, []);

  return (
    <div
      ref={rootRef}
      data-sticky-list-filters
      className={`
        sticky z-10 mb-0
        ${
          belowListHeader
            ? "top-[calc(var(--sticky-list-header-height,3.5rem)-4px)]"
            : "top-0"
        }
        ${PAGE_GUTTER_BLEED_CLASS}
        ${STICKY_CHROME_SURFACE_CLASS}
        pb-2 pt-1.5
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
