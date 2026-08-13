/**
 * Cross-component navigation feedback.
 * Detail/list backs are often `<button>` + `router.back()`, so the anchor
 * capture in NavigationLoading never sees them — use these helpers instead.
 */
export type NavFeedbackMode = "soft" | "full";

export const NAV_PENDING_EVENT = "pop-nav-pending";
export const NAV_DONE_EVENT = "pop-nav-done";

export function signalNavPending(mode: NavFeedbackMode = "soft"): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent(NAV_PENDING_EVENT, { detail: { mode } }),
  );
}

/** Clear soft/full progress (soft-nav pushState, cancelled taps, etc.). */
export function signalNavDone(): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(NAV_DONE_EVENT));
}

type NavRouter = {
  push: (href: string, options?: { scroll?: boolean }) => void;
  back: () => void;
};

/** Soft progress + push. No-op cost beyond one CustomEvent. */
export function navigateSoft(
  router: NavRouter,
  href: string,
  options?: { scroll?: boolean },
): void {
  signalNavPending("soft");
  router.push(href, options);
}

/** Soft progress + history back. */
export function navigateBackSoft(router: NavRouter): void {
  signalNavPending("soft");
  router.back();
}
