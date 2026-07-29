/**
 * Facebook-style chrome: hide on scroll down, show on scroll up,
 * always show near the top or bottom. Desktop / reduced-motion: always on.
 */

/** Tailwind classes for sliding header / bottom nav on / off screen. */
export const SCROLL_CHROME_TRANSITION_CLASS =
  "transition-transform duration-200 ease-out motion-reduce:transition-none";

const TOP_SHOW_PX = 48;
const BOTTOM_SHOW_PX = 120;
const DIR_DELTA_PX = 8;
const LG_QUERY = "(min-width: 1024px)";
const REDUCE_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

let visible = true;
let lastScrollY = 0;
let ticking = false;
let listenerCount = 0;
const listeners = new Set<() => void>();

function isDesktop(): boolean {
  return window.matchMedia(LG_QUERY).matches;
}

function prefersReducedMotion(): boolean {
  return window.matchMedia(REDUCE_MOTION_QUERY).matches;
}

function emit() {
  for (const listener of listeners) listener();
}

function setVisible(next: boolean) {
  if (visible === next) return;
  visible = next;
  emit();
}

function updateFromScroll() {
  ticking = false;

  if (isDesktop() || prefersReducedMotion()) {
    setVisible(true);
    return;
  }

  const y = window.scrollY;
  const maxY = Math.max(
    0,
    document.documentElement.scrollHeight - window.innerHeight,
  );
  const delta = y - lastScrollY;
  lastScrollY = y;

  if (y <= TOP_SHOW_PX || maxY - y <= BOTTOM_SHOW_PX) {
    setVisible(true);
    return;
  }

  if (delta > DIR_DELTA_PX) setVisible(false);
  else if (delta < -DIR_DELTA_PX) setVisible(true);
}

function onScroll() {
  if (ticking) return;
  ticking = true;
  requestAnimationFrame(updateFromScroll);
}

function onMediaChange() {
  if (isDesktop() || prefersReducedMotion()) {
    setVisible(true);
    return;
  }
  lastScrollY = window.scrollY;
  updateFromScroll();
}

export function subscribeScrollChrome(onStoreChange: () => void): () => void {
  listeners.add(onStoreChange);
  if (listenerCount === 0) {
    lastScrollY = window.scrollY;
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onMediaChange);
    window.matchMedia(LG_QUERY).addEventListener("change", onMediaChange);
    window
      .matchMedia(REDUCE_MOTION_QUERY)
      .addEventListener("change", onMediaChange);
  }
  listenerCount += 1;
  return () => {
    listeners.delete(onStoreChange);
    listenerCount -= 1;
    if (listenerCount === 0) {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onMediaChange);
      window.matchMedia(LG_QUERY).removeEventListener("change", onMediaChange);
      window
        .matchMedia(REDUCE_MOTION_QUERY)
        .removeEventListener("change", onMediaChange);
    }
  };
}

export function getScrollChromeVisible(): boolean {
  return visible;
}

export function getScrollChromeServerSnapshot(): boolean {
  return true;
}
