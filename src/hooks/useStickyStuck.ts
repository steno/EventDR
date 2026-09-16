"use client";

import { useEffect, useState, type RefObject } from "react";
import { readStickyListHeaderHeight } from "@/lib/list-scroll";

function observeStuck(
  sentinel: HTMLElement,
  setStuck: (stuck: boolean) => void,
): () => void {
  let observer: IntersectionObserver | null = null;

  const connect = () => {
    observer?.disconnect();
    const headerHeight = Math.max(1, readStickyListHeaderHeight());
    observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return;
        setStuck(!entry.isIntersecting);
      },
      {
        // Treat the band under the sticky header as "out" so we flip as soon
        // as the sentinel parks under chrome and the filters pin.
        rootMargin: `-${headerHeight}px 0px 0px 0px`,
        threshold: 0,
      },
    );
    observer.observe(sentinel);
  };

  connect();

  const header = document.querySelector("[data-sticky-list-header]");
  const resizeObserver =
    header && typeof ResizeObserver !== "undefined"
      ? new ResizeObserver(connect)
      : null;
  if (header && resizeObserver) resizeObserver.observe(header);

  return () => {
    observer?.disconnect();
    resizeObserver?.disconnect();
  };
}

/**
 * True once `sentinel` has scrolled under the sticky list header — i.e. the
 * following sticky filter bar is pinned. False again when the sentinel
 * re-enters the viewport below the header (sticky released).
 */
export function useStickyStuck(
  sentinelRef: RefObject<HTMLElement | null>,
): boolean {
  const [stuck, setStuck] = useState(false);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || typeof IntersectionObserver === "undefined") return;
    return observeStuck(sentinel, setStuck);
  }, [sentinelRef]);

  return stuck;
}

/**
 * Same stuck signal for a CSS selector (e.g. `[data-category-nav]`). Used so
 * the sticky category back cue stays after time-tab list parks — pills stay
 * away even when the filter-bar sentinel is at the park line.
 */
export function useStickyStuckSelector(selector: string | null): boolean {
  const [stuck, setStuck] = useState(false);

  useEffect(() => {
    if (!selector || typeof IntersectionObserver === "undefined") {
      setStuck(false);
      return;
    }
    const sentinel = document.querySelector<HTMLElement>(selector);
    if (!sentinel) {
      setStuck(false);
      return;
    }
    return observeStuck(sentinel, setStuck);
  }, [selector]);

  return stuck;
}
