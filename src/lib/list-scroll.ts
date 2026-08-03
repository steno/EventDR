import { beginProgrammaticScrollChrome } from "@/lib/scroll-chrome";

/** Sticky list header height published by StickyListHeader (0 while chrome is hidden). */
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
  return el.getBoundingClientRect().top + window.scrollY;
}

export function scrollBehaviorPreference(): ScrollBehavior {
  if (typeof window === "undefined") return "auto";
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ? "auto"
    : "smooth";
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
    window.setTimeout(done, 400);
    return;
  }
  requestAnimationFrame(done);
}

/**
 * Pin list chrome under the sticky page header after a tab/filter change.
 * Prefers `[data-list-scroll-anchor]` (category pills when present, else time filters).
 * Short pages scroll as far as they can — never jump to the hero.
 */
export function scrollToListTop(anchor?: HTMLElement | null): void {
  const endChrome = beginProgrammaticScrollChrome();
  const behavior = scrollBehaviorPreference();
  const target =
    anchor ??
    document.querySelector<HTMLElement>("[data-list-scroll-anchor]");

  const park = () => {
    if (!target) {
      window.scrollTo({ top: 0, behavior });
      endProgrammaticScrollAfterSettle(endChrome, behavior);
      return;
    }
    // Measure after chrome reveal so the header is on-screen and the CSS var
    // matches — parks "What are you into?" just under the sticky header.
    const headerHeight = readStickyListHeaderReserve();
    const desired = Math.max(0, readDocumentTop(target) - headerHeight);
    const maxScroll = Math.max(
      0,
      document.documentElement.scrollHeight - window.innerHeight,
    );
    window.scrollTo({ top: Math.min(desired, maxScroll), behavior });
    endProgrammaticScrollAfterSettle(endChrome, behavior);
  };

  // Two frames: React applies chrome-visible classes, then StickyListHeader
  // republishes --sticky-list-header-height.
  requestAnimationFrame(() => requestAnimationFrame(park));
}

/** Scroll so `el` sits just under the sticky list header. */
export function scrollUnderStickyHeader(
  el: HTMLElement | null | undefined,
  behavior: ScrollBehavior = scrollBehaviorPreference(),
): void {
  if (!el) return;
  const endChrome = beginProgrammaticScrollChrome();
  const top = Math.max(0, readDocumentTop(el) - readStickyListHeaderReserve());
  window.scrollTo({ top, behavior });
  endProgrammaticScrollAfterSettle(endChrome, behavior);
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
  const endChrome = beginProgrammaticScrollChrome();
  const headerH = readStickyListHeaderReserve();
  const stackH = stickyStack?.offsetHeight ?? 0;
  const top = Math.max(0, readDocumentTop(el) - headerH - stackH);
  window.scrollTo({ top, behavior });
  endProgrammaticScrollAfterSettle(endChrome, behavior);
}
