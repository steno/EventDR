function isTouchDevice(): boolean {
  return (
    window.matchMedia("(pointer: coarse)").matches ||
    window.matchMedia("(hover: none)").matches
  );
}

function getViewportMeta(): HTMLMetaElement {
  let viewport = document.querySelector<HTMLMetaElement>('meta[name="viewport"]');
  if (!viewport) {
    viewport = document.createElement("meta");
    viewport.name = "viewport";
    viewport.content = "width=device-width, initial-scale=1";
    document.head.appendChild(viewport);
  }
  return viewport;
}

function resetViaViewportMeta(): void {
  const viewport = getViewportMeta();
  const original = viewport.content;
  viewport.content = "width=device-width, initial-scale=1, maximum-scale=1";
  window.setTimeout(() => {
    viewport.content = original;
  }, 150);
}

function resetViaScrollNudge(): void {
  // Chrome/Android and installed PWAs often keep a scaled layout until scroll changes.
  const scrollY = window.scrollY;
  if (scrollY === 0) {
    window.scrollTo(0, 1);
    window.scrollTo(0, 0);
  } else {
    window.scrollTo(0, scrollY + 1);
    window.scrollTo(0, scrollY);
  }
}

/** Reset browser zoom after a small-font input submits or blurs (Safari, Chrome, PWA). */
export function resetInputZoom({ blur = true }: { blur?: boolean } = {}): void {
  if (typeof window === "undefined" || typeof document === "undefined") return;
  if (!isTouchDevice()) return;

  if (blur) {
    const active = document.activeElement;
    if (active instanceof HTMLElement) active.blur();
  }

  resetViaViewportMeta();
  resetViaScrollNudge();
}
