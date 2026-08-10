"use client";

import type { ReactNode } from "react";
import { PAGE_GUTTER_BLEED_CLASS } from "@/lib/page-shell";

type StickyListFiltersProps = {
  children: ReactNode;
  className?: string;
};

/** Location picker + time tabs stick together under StickyListHeader (or viewport top on home). */
export function StickyListFilters({
  children,
  className = "",
}: StickyListFiltersProps) {
  return (
    <div
      className={`
        sticky top-[calc(var(--sticky-list-header-height,0px)-1px)] z-10 mb-4
        ${PAGE_GUTTER_BLEED_CLASS}
        border-b border-neutral-200/60 bg-neutral-50/95 pb-2 pt-3 backdrop-blur-sm
        dark:border-neutral-800/60 dark:bg-neutral-950/95
        transition-[top] duration-200 ease-out motion-reduce:transition-none
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
