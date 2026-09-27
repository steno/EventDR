/**
 * Facebook-style chrome: hide on scroll down, show on scroll up,
 * always show near the top or bottom. Desktop / reduced-motion: always on.
 *
 * Slide motion is CSS `transform` via `data-chrome-hidden` (globals.css).
 * This module owns those attributes on the DOM so reveal can force a reflow and
 * wait for transitionend — React attr updates were racing the transition and
 * making the sticky header snap open on category-back.
 */

import { LG_MEDIA_QUERY } from "@/lib/breakpoints";

/** Keep in sync with `--scroll-chrome-ms` in globals.css. */
export const SCROLL_CHROME_MS = 360;

/** Legacy class kept for SupportNudge bottom offset; slide uses data attrs. */
export const SCROLL_CHROME_TRANSITION_CLASS = "motion-reduce:transition-none";

/** Shared ease for sticky filter row collapses (price panel). */
export const STICKY_FILTER_COLLAPSE_TRANSITION_CLASS =
  "transition-[grid-template-rows,grid-template-columns,opacity] duration-[320ms] ease-[cubic-bezier(0.32,0.72,0,1)] motion-reduce:transition-none";

/** Width collapse for the category back icon — tabs slide when it opens. */
export const STICKY_FILTER_WIDTH_COLLAPSE_CLASS =
  "overflow-hidden transition-[max-width,opacity] duration-[320ms] ease-[cubic-bezier(0.32,0.72,0,1)] motion-reduce:transition-none";

const TOP_SHOW_PX = 48;
const BOTTOM_SHOW_PX = 120;
const DIR_DELTA_PX = 8;
const REDUCE_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

let visible = true;
let lastScrollY = 0;
let ticking = false;
let listenerCount = 0;
/** Ignore hide-on-scroll while list park / category land scrolls run. */
let programmaticDepth = 0;
const listeners = new Set<() => void>();

function isDesktop(): boolean {
  return window.matchMedia(LG_MEDIA_QUERY).matches;
}

function prefersReducedMotion(): boolean {
  return window.matchMedia(REDUCE_MOTION_QUERY).matches;
}

function emit() {
  for (const listener of listeners) listener();
}

/** Sync hide/show transforms on live sticky chrome nodes. */
function applyChromeDom(nextVisible: boolean): void {
  if (typeof document === "undefined") return;

  const header = document.querySelector<HTMLElement>("[data-sticky-list-header]");
  const filters = document.querySelectorAll<HTMLElement>(
    "[data-sticky-list-filters]",
  );
  const nav = document.querySelector<HTMLElement>("[data-scroll-chrome-nav]");

  if (nextVisible) {
    header?.removeAttribute("data-chrome-hidden");
    filters.forEach((el) => el.removeAttribute("data-chrome-hidden"));
    nav?.removeAttribute("data-chrome-hidden");
    return;
  }

  header?.setAttribute("data-chrome-hidden", "true");
  filters.forEach((el) => el.setAttribute("data-chrome-hidden", "true"));
  nav?.setAttribute("data-chrome-hidden", "down");
}

function setVisible(next: boolean) {
  if (visible === next) return;
  visible = next;
  applyChromeDom(next);
  emit();
}

function updateFromScroll() {
  ticking = false;

  if (programmaticDepth > 0) {
    lastScrollY = window.scrollY;
    return;
  }

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
    applyChromeDom(visible);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onMediaChange);
    window.matchMedia(LG_MEDIA_QUERY).addEventListener("change", onMediaChange);
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
      window
        .matchMedia(LG_MEDIA_QUERY)
        .removeEventListener("change", onMediaChange);
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

/** Re-apply hide/show attrs after sticky chrome mounts. */
export function syncScrollChromeDom(): void {
  applyChromeDom(visible);
}

function endProgrammatic(): void {
  lastScrollY = window.scrollY;
  programmaticDepth = Math.max(0, programmaticDepth - 1);
}

/**
 * Reveal sticky chrome, waiting for the header slide when it was tucked away.
 * Invokes `run(end)` after the slide (or immediately if already visible).
 * Always call `end` after the programmatic scroll settles.
 */
export function revealScrollChromeThen(
  run: (end: () => void) => void,
): void {
  programmaticDepth += 1;
  const wasHidden = !visible;
  const reduce = prefersReducedMotion();
  const end = endProgrammatic;

  if (!wasHidden || reduce) {
    visible = true;
    applyChromeDom(true);
    emit();
    run(end);
    return;
  }

  // Keep the painted "hidden" transform, then remove it on the next frames so
  // the browser must interpolate instead of painting the open state cold.
  visible = true;
  applyChromeDom(false);
  const header = document.querySelector<HTMLElement>("[data-sticky-list-header]");
  if (header) void header.offsetHeight;

  let finished = false;
  const finish = () => {
    if (finished) return;
    finished = true;
    header?.removeEventListener("transitionend", onTransitionEnd);
    window.clearTimeout(fallbackTimer);
    run(end);
  };

  const onTransitionEnd = (event: TransitionEvent) => {
    if (event.target !== header) return;
    if (event.propertyName !== "transform") return;
    finish();
  };

  const fallbackTimer = window.setTimeout(finish, SCROLL_CHROME_MS + 80);

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      applyChromeDom(true);
      emit();
      header?.addEventListener("transitionend", onTransitionEnd);
    });
  });
}

/**
 * Reveal sticky chrome for a programmatic scroll. Returns whether the header
 * was off-screen so callers can wait for the slide-down before parking.
 * @deprecated Prefer {@link revealScrollChromeThen} for animated reveals.
 */
export function beginProgrammaticScrollChromeReveal(): {
  end: () => void;
  wasHidden: boolean;
} {
  const wasHidden = !visible;
  programmaticDepth += 1;
  setVisible(true);
  return {
    wasHidden,
    end: endProgrammatic,
  };
}

/** Ignore hide-on-scroll until `end` — does not force the header visible. */
export function beginProgrammaticScrollLock(): () => void {
  programmaticDepth += 1;
  return endProgrammatic;
}

/** Show sticky header/nav and ignore hide-on-scroll until `end` runs. */
export function beginProgrammaticScrollChrome(): () => void {
  programmaticDepth += 1;
  setVisible(true);
  return endProgrammatic;
}
