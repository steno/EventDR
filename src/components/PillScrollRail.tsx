"use client";

import type { ReactNode, RefObject } from "react";
import { ChevronRight } from "lucide-react";
import {
  CATEGORY_SCROLL_BTN,
  CATEGORY_SCROLLER_BAR,
} from "@/components/category-scroller-styles";
import { HorizontalScrollEdgeFades } from "@/components/HorizontalScrollEdgeFades";
import { usePillRailOverflow } from "@/hooks/usePillRailOverflow";

interface PillScrollRailProps {
  scrollRef: RefObject<HTMLDivElement | null>;
  itemCount: number;
  /** Accessible label for the overflow chevron. */
  scrollMoreLabel: string;
  children: ReactNode;
  className?: string;
}

/** Horizontal pill row with trailing fade + chevron when content overflows. */
export function PillScrollRail({
  scrollRef,
  itemCount,
  scrollMoreLabel,
  children,
  className,
}: PillScrollRailProps) {
  const { canScrollRight, onScroll, scrollMore } = usePillRailOverflow(
    scrollRef,
    itemCount,
  );

  return (
    <div className={`${CATEGORY_SCROLLER_BAR}${className ? ` ${className}` : ""}`}>
      <div className="relative min-w-0 flex-1 overflow-hidden">
        <div
          ref={scrollRef}
          onScroll={onScroll}
          className="overflow-x-auto scrollbar-hide"
        >
          <div className="flex w-max items-center gap-2 px-0.5 py-0.5">
            {children}
          </div>
        </div>
        <HorizontalScrollEdgeFades canScrollRight={canScrollRight} />
        {canScrollRight ? (
          <button
            type="button"
            onClick={scrollMore}
            aria-label={scrollMoreLabel}
            className={`${CATEGORY_SCROLL_BTN} top-1/2 -translate-y-1/2`}
          >
            <ChevronRight className="h-4 w-4" aria-hidden />
          </button>
        ) : null}
      </div>
    </div>
  );
}
