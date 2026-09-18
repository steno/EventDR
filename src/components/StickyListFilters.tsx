"use client";

import type { ReactNode } from "react";
import { PAGE_GUTTER_BLEED_CLASS } from "@/lib/page-shell";

type StickyListFiltersProps = {
  children: ReactNode;
  className?: string;
};

/** Area select + time tabs (+ price/view) stick together under StickyListHeader. */
export function StickyListFilters({
  children,
  className = "",
}: StickyListFiltersProps) {
  return (
    <div
      className={`
        sticky top-[calc(var(--sticky-list-header-height,0px)-1px)] z-10 mb-4 md:mb-3
        ${PAGE_GUTTER_BLEED_CLASS}
        border-b border-neutral-200/60 bg-background/95 pb-2 pt-3 backdrop-blur-sm
        md:pb-1.5 md:pt-1.5
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
