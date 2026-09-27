import {
  beginProgrammaticScrollLock,
  revealScrollChromeThen,
} from "@/lib/scroll-chrome";

/** Sticky list header height published by StickyListHeader. */
export function readStickyListHeaderHeight(): number {
  const raw = getComputedStyle(document.documentElement)
    .getPropertyValue("--sticky-list-header-height")
    .trim();
  const px = parseFloat(raw);
  return Number.isFinite(px) ? px : 0;
}

/**
 * Height to reserve when parking scroll under the list header.
 * Uses the live CSS var when chrome is visible; otherwise the header's layout
 * height so auto-hide → show doesn't cover the park target.
 */
export function readStickyListHeaderReserve(): number {
  const published = readStickyListHeaderHeight();
  if (published > 0) return published;
  const el = document.querySelector<HTMLElement>("[data-sticky-list-header]");
  return el ? Math.ceil(el.offsetHeight) : 0;
}

/** Layout Y in the document — use a non-sticky sentinel, not a stuck element. */
export function readDocumentTop(el: HTMLElement): number {
  return el.getBoundingClientRect().top + readScrollY();
}

export function scrollBehaviorPreference(): ScrollBehavior {
  if (typeof window === "undefined") return "auto";
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ? "auto"
    : "smooth";
}

function easeOutCubic(t: number): number {
  return 1 - (1 - t) ** 3;
}

function getScrollingElement(): Element {
  return document.scrollingElement ?? document.documentElement;
}

function readScrollY(): number {
  return getScrollingElement().scrollTop || window.scrollY || 0;
}

function writeScrollY(top: number): void {
  const scroller = getScrollingElement();
  scroller.scrollTop = top;
  // Keep window in sync on engines that split the two.
  if (window.scrollY !== top) window.scrollTo(0, top);
}

/**
 * Tween window scroll — more reliable than `behavior: "smooth"` for short
 * distances and when body is the overflow scroller.
 */
function animateWindowScrollTo(
  top: number,
  durationMs: number,
  onDone: () => void,
): void {
  const from = readScrollY();
  const to = top;
  let settled = false;
  const complete = () => {
    if (settled) return;
    settled = true;
    onDone();
  };

  if (Math.abs(to - from) < 1 || durationMs <= 0) {
    writeScrollY(to);
    complete();
    return;
  }

  const started = performance.now();
  let frame = 0;

  const tick = (now: number) => {
    if (settled) return;
    const t = Math.min(1, (now - started) / durationMs);
    writeScrollY(from + (to - from) * easeOutCubic(t));
    if (t < 1) {
      frame = window.requestAnimationFrame(tick);
      return;
    }
    complete();
  };

  frame = window.requestAnimationFrame(tick);
  window.setTimeout(() => {
    window.cancelAnimationFrame(frame);
    if (!settled) writeScrollY(to);
    complete();
  }, durationMs + 120);
}

function endProgrammaticScrollAfterSettle(
  end: () => void,
  behavior: ScrollBehavior,
): void {
  let finished = false;
  const done = () => {
    if (finished) return;
    finished = true;
    window.removeEventListener("scrollend", done);
    end();
  };
  if (behavior === "smooth" && "onscrollend" in window) {
    window.addEventListener("scrollend", done, { once: true });
    // Fallback if scrollend never fires (already at target / browser quirk).
    window.setTimeout(done, 500);
    return;
  }
  requestAnimationFrame(done);
}

/**
 * Whether parking should run when `onlyScrollDown` is set.
 * True only if the viewport is still above the list chrome (need to scroll down).
 * False when already parked or further into the list — avoids yanking back up
 * to category pills on Today/Tomorrow/Weekend changes.
 */
export function shouldScrollDownToListPark(
  scrollY: number,
  desired: number,
  epsilon = 8,
): boolean {
  return scrollY < desired - epsilon;
}

export type ScrollToListTopOptions = {
  /**
   * Time-tab switches: only scroll down to park list chrome. Never scroll up
   * to re-reveal category pills when the sticky time tabs are already in place.
   */
  onlyScrollDown?: boolean;
};

/**
 * Pin list chrome under the sticky page header after a tab/filter change.
 * Prefers `[data-list-scroll-anchor]` when no explicit anchor is passed
 * (category pills when present, else time filters).
 * Pass the filter-bar sentinel for time-tab switches so list items reset to the
 * top under sticky tabs, even after the user has scrolled deep into the list.
 * Short pages scroll as far as they can — never jump to the hero.
 */
export function scrollToListTop(
  anchor?: HTMLElement | null,
  options?: ScrollToListTopOptions,
): void {
  const behavior = scrollBehaviorPreference();
  const onlyScrollDown = Boolean(options?.onlyScrollDown);
  const target =
    anchor ??
    document.querySelector<HTMLElement>("[data-list-scroll-anchor]");

  revealScrollChromeThen((endChrome) => {
    if (!target) {
      if (onlyScrollDown && window.scrollY > 0) {
        endChrome();
        return;
      }
      window.scrollTo({ top: 0, behavior });
      endProgrammaticScrollAfterSettle(endChrome, behavior);
      return;
    }
    // Measure after chrome reveal so the header is on-screen and the CSS var
    // matches. Park the (non-sticky) sentinel under the sticky header so sticky
    // time tabs sit flush below it and list items start under that stack.
    const headerHeight = readStickyListHeaderReserve();
    const desired = Math.max(0, readDocumentTop(target) - headerHeight);
    if (
      onlyScrollDown &&
      !shouldScrollDownToListPark(window.scrollY, desired)
    ) {
      endChrome();
      return;
    }
    const maxScroll = Math.max(
      0,
      document.documentElement.scrollHeight - window.innerHeight,
    );
    window.scrollTo({ top: Math.min(desired, maxScroll), behavior });
    endProgrammaticScrollAfterSettle(endChrome, behavior);
  });
}

/**
 * Bring the category pill row back under the sticky page header.
 * Eases the page scroll (no jump-to-park) while a fixed clone fades the
 * pills in over the sticky filter bar so they aren't masked mid-tween.
 */
export function scrollCategoryNavIntoView(
  nav?: HTMLElement | null,
  onSettled?: () => void,
): void {
  const target =
    nav ?? document.querySelector<HTMLElement>("[data-category-nav]");
  const reduceMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  // Always ease a bit — instant writeScrollY was the “snap to top” feel.
  const durationMs = reduceMotion ? 220 : 520;
  const endChrome = beginProgrammaticScrollLock();

  let settled = false;
  const finish = () => {
    if (settled) return;
    settled = true;
    document
      .querySelectorAll("[data-category-nav-clone]")
      .forEach((el) => el.remove());
    if (target) {
      target.style.removeProperty("visibility");
      target.removeAttribute("data-category-nav-revealing");
    }
    endChrome();
    onSettled?.();
  };

  if (!target) {
    // Don't yank to document top — stay put if there's no pill row.
    finish();
    return;
  }

  const headerHeight = readStickyListHeaderReserve();
  const from = readScrollY();
  const desired = Math.max(0, readDocumentTop(target) - headerHeight);
  const maxScroll = Math.max(
    0,
    document.documentElement.scrollHeight - window.innerHeight,
  );
  const to = Math.min(desired, maxScroll);

  if (Math.abs(to - from) < 8) {
    finish();
    return;
  }

  document
    .querySelectorAll("[data-category-reveal-fade]")
    .forEach((el) => el.removeAttribute("data-category-reveal-fade"));

  const box = target.getBoundingClientRect();
  const clone = target.cloneNode(true) as HTMLElement;
  clone.removeAttribute("data-category-nav");
  clone.setAttribute("data-category-nav-clone", "");
  clone.setAttribute("aria-hidden", "true");
  clone.style.position = "fixed";
  clone.style.left = `${Math.round(box.left)}px`;
  clone.style.width = `${Math.round(box.width)}px`;
  clone.style.top = `${headerHeight}px`;
  clone.style.zIndex = "20";
  clone.style.margin = "0";
  clone.style.pointerEvents = "none";
  clone.style.boxSizing = "border-box";
  clone.style.backgroundColor = "var(--background)";
  clone.style.paddingBottom = "0.5rem";
  clone.style.opacity = "0";
  clone.style.transform = "translate3d(0, -0.65rem, 0)";
  clone.style.transition = `opacity ${durationMs}ms cubic-bezier(0.32, 0.72, 0, 1), transform ${durationMs}ms cubic-bezier(0.32, 0.72, 0, 1)`;

  document.body.appendChild(clone);
  target.style.visibility = "hidden";
  target.setAttribute("data-category-nav-revealing", "true");

  requestAnimationFrame(() => {
    void clone.offsetHeight;
    clone.style.opacity = "1";
    clone.style.transform = "translate3d(0, 0, 0)";
  });

  // Ease the page up with the pill fade — never jump scrollY in one frame.
  animateWindowScrollTo(to, durationMs, finish);
}

/** Scroll so `el` sits just under the sticky list header. */
export function scrollUnderStickyHeader(
  el: HTMLElement | null | undefined,
  behavior: ScrollBehavior = scrollBehaviorPreference(),
): void {
  if (!el) return;
  revealScrollChromeThen((endChrome) => {
    const top = Math.max(0, readDocumentTop(el) - readStickyListHeaderReserve());
    window.scrollTo({ top, behavior });
    endProgrammaticScrollAfterSettle(endChrome, behavior);
  });
}

/**
 * Scroll so `el` sits just under the sticky header plus any sticky stack
 * above it (e.g. expanded venue map) — keeps forms from vanishing under sticky chrome.
 */
export function scrollBelowStickyStack(
  el: HTMLElement | null | undefined,
  stickyStack?: HTMLElement | null,
  behavior: ScrollBehavior = scrollBehaviorPreference(),
): void {
  if (!el) return;
  revealScrollChromeThen((endChrome) => {
    const headerH = readStickyListHeaderReserve();
    const stackH = stickyStack?.offsetHeight ?? 0;
    const top = Math.max(0, readDocumentTop(el) - headerH - stackH);
    window.scrollTo({ top, behavior });
    endProgrammaticScrollAfterSettle(endChrome, behavior);
  });
}
