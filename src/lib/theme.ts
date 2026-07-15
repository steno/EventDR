import { APP_TIMEZONE } from "@/lib/event-dates";

export const THEME_STORAGE_KEY = "eventdr-theme";

export type Theme = "light" | "dark";

/** Local hour (0–23) when auto theme switches to dark (inclusive). */
export const THEME_DARK_START_HOUR = 19;

/** Local hour (0–23) when auto theme switches back to light (exclusive end of dark). */
export const THEME_DARK_END_HOUR = 6;

function appTimeParts(date: Date): { hour: number; minute: number; second: number } {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: APP_TIMEZONE,
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hourCycle: "h23",
  }).formatToParts(date);

  const num = (type: Intl.DateTimeFormatPartTypes) =>
    Number(parts.find((p) => p.type === type)?.value ?? "0");

  return { hour: num("hour"), minute: num("minute"), second: num("second") };
}

/** Dark from 19:00 through 05:59 in America/Santo_Domingo. */
export function themeFromTimeOfDay(date: Date = new Date()): Theme {
  const { hour } = appTimeParts(date);
  return hour >= THEME_DARK_START_HOUR || hour < THEME_DARK_END_HOUR
    ? "dark"
    : "light";
}

/** Ms until the next 19:00 or 06:00 boundary (AST has no DST). */
export function msUntilNextThemeBoundary(date: Date = new Date()): number {
  const { hour, minute, second } = appTimeParts(date);
  const msIntoHour = (minute * 60 + second) * 1000;

  let hoursUntil: number;
  if (hour >= THEME_DARK_START_HOUR) {
    hoursUntil = 24 - hour + THEME_DARK_END_HOUR;
  } else if (hour < THEME_DARK_END_HOUR) {
    hoursUntil = THEME_DARK_END_HOUR - hour;
  } else {
    hoursUntil = THEME_DARK_START_HOUR - hour;
  }

  return Math.max(hoursUntil * 3_600_000 - msIntoHour, 1_000);
}

export function getStoredTheme(): Theme | null {
  if (typeof window === "undefined") return null;
  const stored = localStorage.getItem(THEME_STORAGE_KEY);
  return stored === "light" || stored === "dark" ? stored : null;
}

/** Explicit toggle wins; otherwise follow North Coast evening hours. */
export function resolveTheme(date: Date = new Date()): Theme {
  return getStoredTheme() ?? themeFromTimeOfDay(date);
}

export function applyTheme(theme: Theme) {
  document.documentElement.classList.toggle("dark", theme === "dark");
}

/** Keep auto theme fresh across 06:00 / 19:00 until the user picks manually. */
export function scheduleAutoTheme(): () => void {
  if (typeof window === "undefined") return () => {};

  let timeoutId = 0;

  const tick = () => {
    if (getStoredTheme()) return;
    applyTheme(resolveTheme());
    timeoutId = window.setTimeout(tick, msUntilNextThemeBoundary());
  };

  if (!getStoredTheme()) {
    applyTheme(resolveTheme());
    timeoutId = window.setTimeout(tick, msUntilNextThemeBoundary());
  }

  return () => window.clearTimeout(timeoutId);
}
