"use client";

import { useCallback, useSyncExternalStore } from "react";
import {
  applyTheme,
  themeFromTimeOfDay,
  THEME_STORAGE_KEY,
  type Theme,
} from "@/lib/theme";

function getThemeSnapshot(): Theme {
  if (typeof document === "undefined") return themeFromTimeOfDay();
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

function subscribeTheme(onStoreChange: () => void): () => void {
  const observer = new MutationObserver(onStoreChange);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["class"],
  });
  return () => observer.disconnect();
}

export function useTheme() {
  const theme = useSyncExternalStore(
    subscribeTheme,
    getThemeSnapshot,
    themeFromTimeOfDay,
  );

  const setTheme = useCallback((next: Theme) => {
    localStorage.setItem(THEME_STORAGE_KEY, next);
    applyTheme(next);
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(theme === "dark" ? "light" : "dark");
  }, [setTheme, theme]);

  return { theme, setTheme, toggleTheme, isDark: theme === "dark" };
}
