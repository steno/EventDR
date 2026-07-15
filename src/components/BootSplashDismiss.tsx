"use client";

import { useEffect } from "react";

const SPLASH_ID = "app-boot-splash";
const DONE_CLASS = "app-boot-splash--done";
/** Brand hold: show at least this long; never add delay if load already took longer. */
const MIN_VISIBLE_MS = 2000;

function dismissSplash() {
  const el = document.getElementById(SPLASH_ID);
  if (!el || el.classList.contains(DONE_CLASS)) return;

  // Hide only — never el.remove(). This node is owned by React's root layout;
  // removing it desyncs the fiber tree (insertBefore / removeChild NotFoundError)
  // on the next client navigation (e.g. language switch).
  el.classList.add(DONE_CLASS);
  el.setAttribute("aria-hidden", "true");
  el.setAttribute("inert", "");
}

/** Hides the inline HTML boot splash after hydrate, with a short brand hold. */
export function BootSplashDismiss() {
  useEffect(() => {
    let cancelled = false;
    let frame = 0;
    let timer: ReturnType<typeof setTimeout> | undefined;

    // performance.now() is ms since navigation — when the splash first painted.
    const elapsed = typeof performance !== "undefined" ? performance.now() : 0;
    const remaining = Math.max(0, MIN_VISIBLE_MS - elapsed);

    const finish = () => {
      if (cancelled) return;
      // Wait two frames so first painted content sits under the fade-out.
      frame = requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          if (!cancelled) dismissSplash();
        });
      });
    };

    if (remaining > 0) {
      timer = setTimeout(finish, remaining);
    } else {
      finish();
    }

    return () => {
      cancelled = true;
      cancelAnimationFrame(frame);
      if (timer) clearTimeout(timer);
    };
  }, []);

  return null;
}
