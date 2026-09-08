"use client";

import { useCallback, useEffect, useState, type RefObject } from "react";

/** Shared snap-rail peek width — keep Today + venue sliders visually aligned. */
export const SNAP_RAIL_PEEK_CLASS = "w-[88%]";

const EDGE_PX = 8;

/**
 * Tracks horizontal overflow + active snap index for edge fades / dots.
 * Only a trailing-edge (right) fade — left is redundant with the peek.
 * `slideSelector` should match each slide wrapper (e.g. `[data-snap-slide]`).
 */
export function useHorizontalScrollHints(
  scrollRef: RefObject<HTMLElement | null>,
  itemCount: number,
  slideSelector = "[data-snap-slide]",
  gapPx = 12,
) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const sync = useCallback(() => {
    const el = scrollRef.current;
    if (!el || itemCount === 0) {
      setCanScrollRight(false);
      return;
    }
    const maxScroll = el.scrollWidth - el.clientWidth;
    if (maxScroll <= EDGE_PX) {
      setCanScrollRight(false);
      setActiveIndex(0);
      return;
    }

    const left = el.scrollLeft;
    setCanScrollRight(left < maxScroll - EDGE_PX);

    const slide = el.querySelector<HTMLElement>(slideSelector);
    const slideWidth = slide?.offsetWidth ?? el.clientWidth;
    const index = Math.round(left / Math.max(slideWidth + gapPx, 1));
    setActiveIndex(Math.min(Math.max(index, 0), itemCount - 1));
  }, [scrollRef, itemCount, slideSelector, gapPx]);

  useEffect(() => {
    const el = scrollRef.current;
    const id = requestAnimationFrame(() => sync());
    if (!el) return () => cancelAnimationFrame(id);
    const onResize = () => sync();
    window.addEventListener("resize", onResize);
    const ro =
      typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(() => sync())
        : null;
    ro?.observe(el);
    return () => {
      cancelAnimationFrame(id);
      window.removeEventListener("resize", onResize);
      ro?.disconnect();
    };
  }, [sync, itemCount, scrollRef]);

  const scrollToIndex = useCallback(
    (index: number) => {
      const el = scrollRef.current;
      if (!el) return;
      const slide = el.querySelector<HTMLElement>(slideSelector);
      const slideWidth = slide?.offsetWidth ?? el.clientWidth;
      el.scrollTo({ left: index * (slideWidth + gapPx), behavior: "smooth" });
    },
    [scrollRef, slideSelector, gapPx],
  );

  return {
    activeIndex,
    canScrollRight,
    onScroll: sync,
    scrollToIndex,
  };
}
