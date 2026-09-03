import { showBootSplashForReload } from "@/lib/boot-splash";

/** Damped visual travel as a fraction of finger movement. */
export const PULL_RESISTANCE = 0.5;

/** Visual pull (px) required to arm reload — a committed long drag. */
export const PULL_ARM_PX = 120;

/** Cap so the shell never slides an entire viewport. */
export const PULL_MAX_PX = 220;

/** Raw downward travel before we steal the gesture from scroll. */
export const PULL_ACTIVATE_PX = 12;

/** Treat the page as scrolled-to-top within this slop. */
export const PULL_TOP_SLOP_PX = 4;

/** |dy| must beat |dx| by this ratio so carousels stay horizontal. */
export const PULL_HORIZONTAL_LOCK = 1.15;

const MOBILE_PULL_QUERY = "(pointer: coarse), (max-width: 768px)";

export type PullReloadStatus = "idle" | "pulling" | "armed" | "reloading";

export function dampPullDistance(rawDeltaY: number): number {
  if (rawDeltaY <= 0) return 0;
  return Math.min(PULL_MAX_PX, rawDeltaY * PULL_RESISTANCE);
}

export function isPullArmed(visualPull: number): boolean {
  return visualPull >= PULL_ARM_PX;
}

export function isMostlyVertical(dx: number, dy: number): boolean {
  return Math.abs(dy) >= Math.abs(dx) * PULL_HORIZONTAL_LOCK;
}

export function canStartPull(scrollY: number): boolean {
  return scrollY <= PULL_TOP_SLOP_PX;
}

export function prefersPullToReload(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia(MOBILE_PULL_QUERY).matches;
}

export function subscribePullToReloadMedia(onChange: () => void): () => void {
  const media = window.matchMedia(MOBILE_PULL_QUERY);
  media.addEventListener("change", onChange);
  return () => media.removeEventListener("change", onChange);
}

export function shouldIgnorePullTarget(target: EventTarget | null): boolean {
  if (!(target instanceof Element)) return false;
  if (
    target.closest(
      "input, textarea, select, [contenteditable='true'], [data-pull-reload='ignore']",
    )
  ) {
    return true;
  }
  if (target.closest('[aria-modal="true"], [role="dialog"]')) return true;
  if (target.closest(".fixed.inset-0")) return true;
  return false;
}

export function hasNestedScrollNotAtTop(target: EventTarget | null): boolean {
  let el: HTMLElement | null =
    target instanceof HTMLElement
      ? target
      : target instanceof Element
        ? target.parentElement
        : null;

  while (el && el !== document.body && el !== document.documentElement) {
    const style = window.getComputedStyle(el);
    const overflowY = String(style.overflowY);
    const canScrollY =
      (overflowY === "auto" || overflowY === "scroll" || overflowY === "overlay") &&
      el.scrollHeight > el.clientHeight + 1;
    if (canScrollY && el.scrollTop > PULL_TOP_SLOP_PX) return true;
    el = el.parentElement;
  }
  return false;
}

export function isBootSplashBlocking(): boolean {
  if (typeof document === "undefined") return false;
  const root = document.documentElement;
  return (
    root.classList.contains("boot-pending") &&
    !root.classList.contains("boot-splash-done")
  );
}

/** Cover the UI with the boot splash, then hard-reload the current page. */
export function reloadCurrentPage(): void {
  showBootSplashForReload();
  const go = () => {
    window.location.reload();
  };
  requestAnimationFrame(() => {
    requestAnimationFrame(go);
  });
}
