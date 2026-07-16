/** Sticky list header height published by StickyListHeader. */
export function readStickyListHeaderHeight(): number {
  const raw = getComputedStyle(document.documentElement)
    .getPropertyValue("--sticky-list-header-height")
    .trim();
  const px = parseFloat(raw);
  return Number.isFinite(px) ? px : 0;
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

/** Pin list filters under the sticky page header after a tab/filter change. */
export function scrollToListTop(anchor?: HTMLElement | null): void {
  const headerHeight = readStickyListHeaderHeight();
  const target =
    anchor ??
    document.querySelector<HTMLElement>("[data-list-scroll-anchor]");
  const behavior = scrollBehaviorPreference();
  if (!target) {
    window.scrollTo({ top: 0, behavior });
    return;
  }
  const desired = Math.max(0, readDocumentTop(target) - headerHeight);
  const maxScroll = Math.max(
    0,
    document.documentElement.scrollHeight - window.innerHeight,
  );
  // Short lists can't park the filter bar under the header — go to page top instead.
  const top = desired > maxScroll ? 0 : desired;
  window.scrollTo({ top, behavior });
}
