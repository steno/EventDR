"use client";

import { useEffect } from "react";
import {
  isBootReady,
  openBootExpectationWindow,
  subscribeBootReady,
} from "@/lib/boot-splash";

const BOOT_PENDING_CLASS = "boot-pending";
const BOOT_SPLASH_DONE_CLASS = "boot-splash-done";

function dismissSplash() {
  const root = document.documentElement;
  if (root.classList.contains(BOOT_SPLASH_DONE_CLASS)) return;

  // Only toggle <html> classes — never mutate #app-boot-splash. That node is
  // owned by the root layout; pre-hydration DOM edits (failsafe on slow 3G)
  // would otherwise mismatch React's server HTML.
  root.classList.add(BOOT_SPLASH_DONE_CLASS);
  root.classList.remove(BOOT_PENDING_CLASS);
}

/** Hides the inline HTML boot splash as soon as home events are ready. */
export function BootSplashDismiss() {
  useEffect(() => {
    let cancelled = false;
    let frame = 0;

    const tryDismiss = () => {
      if (cancelled || !isBootReady()) return;

      // Two frames so first painted content sits under the fade-out.
      frame = requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          if (!cancelled && isBootReady()) dismissSplash();
        });
      });
    };

    openBootExpectationWindow();
    tryDismiss();
    const unsubscribe = subscribeBootReady(tryDismiss);

    return () => {
      cancelled = true;
      cancelAnimationFrame(frame);
      unsubscribe();
    };
  }, []);

  return null;
}
