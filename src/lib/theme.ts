export const THEME_STORAGE_KEY = "eventdr-theme";

export type Theme = "light" | "dark";

/** Follow OS appearance when the user has not toggled an explicit theme. */
export const THEME_SYSTEM_QUERY = "(prefers-color-scheme: dark)";

export function themeFromSystem(): Theme {
  if (typeof window === "undefined") return "light";
  return window.matchMedia(THEME_SYSTEM_QUERY).matches ? "dark" : "light";
}

export function getStoredTheme(): Theme | null {
  if (typeof window === "undefined") return null;
  const stored = localStorage.getItem(THEME_STORAGE_KEY);
  return stored === "light" || stored === "dark" ? stored : null;
}

/** Explicit toggle wins; otherwise follow system preference (default light). */
export function resolveTheme(): Theme {
  return getStoredTheme() ?? themeFromSystem();
}

export function applyTheme(theme: Theme) {
  document.documentElement.classList.toggle("dark", theme === "dark");
}

/** Keep auto theme in sync when the OS appearance changes. */
export function scheduleAutoTheme(): () => void {
  if (typeof window === "undefined") return () => {};

  const media = window.matchMedia(THEME_SYSTEM_QUERY);

  const sync = () => {
    if (getStoredTheme()) return;
    applyTheme(resolveTheme());
  };

  sync();
  media.addEventListener("change", sync);
  return () => media.removeEventListener("change", sync);
}
