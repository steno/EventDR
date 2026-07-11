"use client";

import { useLayoutEffect } from "react";
import { usePathname } from "next/navigation";

function releaseBodyScroll(): void {
  document.body.style.overflow = "";
  document.body.style.position = "";
  document.documentElement.style.overflow = "";
}

/** Clears stuck scroll locks after HMR, bfcache, or client navigations. */
export function BodyScrollGuard() {
  const pathname = usePathname();

  useLayoutEffect(() => {
    releaseBodyScroll();
  }, [pathname]);

  useLayoutEffect(() => {
    const onPageShow = (event: PageTransitionEvent) => {
      if (event.persisted) releaseBodyScroll();
    };

    window.addEventListener("pageshow", onPageShow);
    return () => window.removeEventListener("pageshow", onPageShow);
  }, []);

  return null;
}
