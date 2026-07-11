import type { TimeRange } from "@/lib/filters";
import type { AppTab } from "@/i18n/dictionaries";

const STORAGE_PREFIX = "eventdr-list-scroll:";

export interface ListScrollSnapshot {
  scrollY: number;
  home?: {
    tab: AppTab;
    searchQuery: string;
    timeRange: TimeRange;
  };
}

function storageKey(path: string): string {
  return `${STORAGE_PREFIX}${path}`;
}

export function peekListScroll(path: string): ListScrollSnapshot | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(storageKey(path));
    if (!raw) return null;
    return JSON.parse(raw) as ListScrollSnapshot;
  } catch {
    return null;
  }
}

export function saveListScroll(path: string, snapshot: ListScrollSnapshot): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(storageKey(path), JSON.stringify(snapshot));
  } catch {
    // Ignore quota / private mode errors.
  }
}

export function clearListScroll(path: string): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.removeItem(storageKey(path));
  } catch {
    // Ignore.
  }
}

export function saveScrollForReturn(
  path: string,
  extras?: Omit<ListScrollSnapshot, "scrollY">,
): void {
  saveListScroll(path, { scrollY: window.scrollY, ...extras });
}

export function consumeListScroll(path: string): ListScrollSnapshot | null {
  const snapshot = peekListScroll(path);
  if (snapshot) clearListScroll(path);
  return snapshot;
}

export function restoreScrollPosition(scrollY: number): void {
  const apply = () => {
    window.scrollTo({ top: scrollY, left: 0, behavior: "instant" });
  };

  apply();
  requestAnimationFrame(apply);
  requestAnimationFrame(() => requestAnimationFrame(apply));
  window.setTimeout(apply, 0);
  window.setTimeout(apply, 50);
  window.setTimeout(apply, 150);
}
