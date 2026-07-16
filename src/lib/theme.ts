export const THEME_STORAGE_KEY = "eventdr-theme";

export type Theme = "light" | "dark";

/** Matches Tailwind `sm` — below this is mobile (dark), `sm`+ is desktop (light). */
export const THEME_MOBILE_MAX_WIDTH_PX = 639;

export const THEME_MOBILE_QUERY = `(max-width: ${THEME_MOBILE_MAX_WIDTH_PX}px)`;

export function themeFromViewport(): Theme {
  if (typeof window === "undefined") return "light";
  return window.matchMedia(THEME_MOBILE_QUERY).matches ? "dark" : "light";
}

export function getStoredTheme(): Theme | null {
  if (typeof window === "undefined") return null;
  const stored = localStorage.getItem(THEME_STORAGE_KEY);
  return stored === "light" || stored === "dark" ? stored : null;
}

/** Explicit toggle wins; otherwise desktop light / mobile dark. */
export function resolveTheme(): Theme {
  return getStoredTheme() ?? themeFromViewport();
}

export function applyTheme(theme: Theme) {
  document.documentElement.classList.toggle("dark", theme === "dark");
}

/** Keep auto theme in sync when the viewport crosses mobile/desktop. */
export function scheduleAutoTheme(): () => void {
  if (typeof window === "undefined") return () => {};

  const media = window.matchMedia(THEME_MOBILE_QUERY);

  const sync = () => {
    if (getStoredTheme()) return;
    applyTheme(resolveTheme());
  };

  sync();
  media.addEventListener("change", sync);
  return () => media.removeEventListener("change", sync);
}
