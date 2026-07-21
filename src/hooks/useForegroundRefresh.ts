"use client";

import { useEffect, useRef } from "react";

/** Skip rapid tab switches / resume storms. */
const MIN_INTERVAL_MS = 30_000;

/**
 * Soft-refresh when the app returns to the foreground (PWA resume, tab focus,
 * bfcache restore). Does not run on initial mount — callers fetch once themselves.
 */
export function useForegroundRefresh(
  onRefresh: () => void,
  enabled = true,
): void {
  const onRefreshRef = useRef(onRefresh);
  const lastRefreshAtRef = useRef(0);

  useEffect(() => {
    onRefreshRef.current = onRefresh;
  }, [onRefresh]);

  useEffect(() => {
    if (!enabled) return;

    const maybeRefresh = () => {
      const now = Date.now();
      if (now - lastRefreshAtRef.current < MIN_INTERVAL_MS) return;
      lastRefreshAtRef.current = now;
      onRefreshRef.current();
    };

    const onVisible = () => {
      if (document.visibilityState === "visible") maybeRefresh();
    };

    const onPageShow = (event: PageTransitionEvent) => {
      if (event.persisted) maybeRefresh();
    };

    document.addEventListener("visibilitychange", onVisible);
    window.addEventListener("pageshow", onPageShow);
    return () => {
      document.removeEventListener("visibilitychange", onVisible);
      window.removeEventListener("pageshow", onPageShow);
    };
  }, [enabled]);
}
