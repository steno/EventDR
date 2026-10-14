export const THEME_STORAGE_KEY = "eventdr-theme";

export type Theme = "light" | "dark";

/** First-run / unset preference — dark until the user toggles. */
export const DEFAULT_THEME: Theme = "dark";

export function getStoredTheme(): Theme | null {
  if (typeof window === "undefined") return null;
  const stored = localStorage.getItem(THEME_STORAGE_KEY);
  return stored === "light" || stored === "dark" ? stored : null;
}

/** Explicit toggle wins; otherwise default dark. */
export function resolveTheme(): Theme {
  return getStoredTheme() ?? DEFAULT_THEME;
}

export function applyTheme(theme: Theme) {
  document.documentElement.classList.toggle("dark", theme === "dark");
}

/** Re-apply stored or default theme on mount (e.g. after hydration). */
export function scheduleAutoTheme(): () => void {
  if (typeof window === "undefined") return () => {};
  applyTheme(resolveTheme());
  return () => {};
}
