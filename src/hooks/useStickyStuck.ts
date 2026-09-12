"use client";

import { useEffect, useState, type RefObject } from "react";
import { readStickyListHeaderHeight } from "@/lib/list-scroll";

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
  }, [sentinelRef]);

  return stuck;
}
