"use client";

import { useCallback, useEffect, useState, type RefObject } from "react";

const EDGE_PX = 4;

/**
 * Tracks whether a horizontal pill rail can scroll further right
 * (for the trailing chevron affordance).
 */
export function usePillRailOverflow(
  scrollRef: RefObject<HTMLElement | null>,
  itemCount: number,
) {
  const [canScrollRight, setCanScrollRight] = useState(false);

  const sync = useCallback(() => {
    const el = scrollRef.current;
    if (!el || itemCount <= 0) {
      setCanScrollRight(false);
      return;
    }
    const maxScroll = el.scrollWidth - el.clientWidth;
    if (maxScroll <= EDGE_PX) {
      setCanScrollRight(false);
      return;
    }
    setCanScrollRight(el.scrollLeft < maxScroll - EDGE_PX);
  }, [scrollRef, itemCount]);

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

  const scrollMore = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: Math.max(160, el.clientWidth * 0.55), behavior: "smooth" });
  }, [scrollRef]);

  return { canScrollRight, onScroll: sync, scrollMore };
}
