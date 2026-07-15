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

/** Pin list filters under the sticky page header after a tab/filter change. */
export function scrollToListTop(anchor?: HTMLElement | null): void {
  const headerHeight = readStickyListHeaderHeight();
  const target =
    anchor ??
    document.querySelector<HTMLElement>("[data-list-scroll-anchor]");
  if (!target) {
    window.scrollTo({ top: 0, behavior: "auto" });
    return;
  }
  const top = readDocumentTop(target) - headerHeight;
  window.scrollTo({ top: Math.max(0, top), behavior: "auto" });
}
