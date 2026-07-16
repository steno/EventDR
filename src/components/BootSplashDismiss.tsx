"use client";

import { useEffect } from "react";
import {
  isBootReady,
  openBootExpectationWindow,
  subscribeBootReady,
} from "@/lib/boot-splash";

const SPLASH_ID = "app-boot-splash";
const DONE_CLASS = "app-boot-splash--done";
const BOOT_PENDING_CLASS = "boot-pending";

function dismissSplash() {
  const el = document.getElementById(SPLASH_ID);
  if (!el || el.classList.contains(DONE_CLASS)) return;

  // Hide only — never el.remove(). This node is owned by React's root layout;
  // removing it desyncs the fiber tree (insertBefore / removeChild NotFoundError)
  // on the next client navigation (e.g. language switch).
  el.classList.add(DONE_CLASS);
  el.setAttribute("aria-hidden", "true");
  el.setAttribute("inert", "");
  document.documentElement.classList.remove(BOOT_PENDING_CLASS);
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
