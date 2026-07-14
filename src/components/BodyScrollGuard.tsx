"use client";

import { useLayoutEffect, useRef } from "react";
import { usePathname } from "next/navigation";

function releaseBodyScroll(): void {
  document.body.style.overflow = "";
  document.body.style.position = "";
  document.documentElement.style.overflow = "";
}

/** Clears stuck scroll locks after HMR, bfcache, or client navigations. */
export function BodyScrollGuard() {
  const pathname = usePathname();
  /** Browser back/forward — always land at top, even after scroll:false navigations. */
  const pendingPopScrollTop = useRef(false);

  useLayoutEffect(() => {
    releaseBodyScroll();
    if (pendingPopScrollTop.current) {
      window.scrollTo(0, 0);
      pendingPopScrollTop.current = false;
    }
  }, [pathname]);

  useLayoutEffect(() => {
    if ("scrollRestoration" in history) {
      history.scrollRestoration = "manual";
    }

    const onPopState = () => {
      pendingPopScrollTop.current = true;
    };

    const onPageShow = (event: PageTransitionEvent) => {
      if (event.persisted) releaseBodyScroll();
    };

    window.addEventListener("popstate", onPopState);
    window.addEventListener("pageshow", onPageShow);
    return () => {
      window.removeEventListener("popstate", onPopState);
      window.removeEventListener("pageshow", onPageShow);
    };
  }, []);

  return null;
}
