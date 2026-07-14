"use client";

import { useEffect } from "react";

const SPLASH_ID = "app-boot-splash";
const DONE_CLASS = "app-boot-splash--done";

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

/** Hides the inline HTML boot splash once the app has hydrated. */
export function BootSplashDismiss() {
  useEffect(() => {
    // Wait two frames so first painted content sits under the fade-out.
    let cancelled = false;
    const frame = requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        if (!cancelled) dismissSplash();
      });
    });

    return () => {
      cancelled = true;
      cancelAnimationFrame(frame);
    };
  }, []);

  return null;
}
