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
/** Brand hold: show at least this long; never add delay if load already took longer. */
const MIN_VISIBLE_MS = 900;

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

/** Hides the inline HTML boot splash after home data is ready, with a short brand hold. */
export function BootSplashDismiss() {
  useEffect(() => {
    let cancelled = false;
    let frame = 0;
    let minTimer: ReturnType<typeof setTimeout> | undefined;
    let minHoldElapsed = false;

    const tryDismiss = () => {
      if (cancelled || !minHoldElapsed || !isBootReady()) return;

      // Wait two frames so first painted content sits under the fade-out.
      frame = requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          if (!cancelled && isBootReady()) dismissSplash();
        });
      });
    };

    openBootExpectationWindow();

    const elapsed = typeof performance !== "undefined" ? performance.now() : 0;
    const remaining = Math.max(0, MIN_VISIBLE_MS - elapsed);

    minTimer = setTimeout(() => {
      minHoldElapsed = true;
      tryDismiss();
    }, remaining);

    const unsubscribe = subscribeBootReady(tryDismiss);

    return () => {
      cancelled = true;
      cancelAnimationFrame(frame);
      if (minTimer) clearTimeout(minTimer);
      unsubscribe();
    };
  }, []);

  return null;
}
