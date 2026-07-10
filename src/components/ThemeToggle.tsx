"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";
import type { Dictionary } from "@/i18n/dictionaries";

interface ThemeToggleProps {
  dict: Dictionary;
}

export function ThemeToggle({ dict }: ThemeToggleProps) {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="
        flex h-9 w-9 items-center justify-center rounded-full
        bg-white/85 shadow-sm ring-1 ring-neutral-200/70 backdrop-blur
        text-neutral-600 transition-colors
        hover:text-neutral-900 active:scale-95
        dark:bg-neutral-800/85 dark:ring-neutral-700/70 dark:text-neutral-300 dark:hover:text-neutral-100
      "
      aria-label={isDark ? dict.theme.light : dict.theme.dark}
      title={isDark ? dict.theme.light : dict.theme.dark}
    >
      {isDark ? (
        <Sun className="h-4 w-4" aria-hidden />
      ) : (
        <Moon className="h-4 w-4" aria-hidden />
      )}
    </button>
  );
}
