/** External cross-promo (Domenus digital menus). */
export const CROSS_PROMO_URL = "https://tinyurl.com/domenus";

export const CROSS_PROMO_DISMISS_KEY = "eventdr-cross-promo-dismissed";

/** Insert a list banner after this many event cards (0-based index = N). */
export const CROSS_PROMO_LIST_AFTER = 4;

/** After dismiss, show again after this many days. */
export const CROSS_PROMO_DISMISS_DAYS = 7;

const MS_PER_DAY = 24 * 60 * 60 * 1000;

/** True when the user dismissed recently and the cooldown has not expired. */
export function isCrossPromoDismissed(): boolean {
  if (typeof window === "undefined") return true;
  try {
    const raw = localStorage.getItem(CROSS_PROMO_DISMISS_KEY);
    if (!raw) return false;
    // Legacy permanent flag — treat as expired so soft cooldown applies.
    if (raw === "1") {
      localStorage.removeItem(CROSS_PROMO_DISMISS_KEY);
      return false;
    }
    const until = Number(raw);
    if (!Number.isFinite(until)) {
      localStorage.removeItem(CROSS_PROMO_DISMISS_KEY);
      return false;
    }
    if (Date.now() >= until) {
      localStorage.removeItem(CROSS_PROMO_DISMISS_KEY);
      return false;
    }
    return true;
  } catch {
    return false;
  }
}

export function dismissCrossPromo(): void {
  if (typeof window === "undefined") return;
  try {
    const until = Date.now() + CROSS_PROMO_DISMISS_DAYS * MS_PER_DAY;
    localStorage.setItem(CROSS_PROMO_DISMISS_KEY, String(until));
  } catch {
    /* ignore quota / private mode */
  }
}
