"use client";

import { useEffect } from "react";
import { scheduleAutoTheme } from "@/lib/theme";

/** Applies time-of-day theme and refreshes at 06:00 / 19:00 AST when unset. */
export function ThemeAutoSync() {
  useEffect(() => scheduleAutoTheme(), []);
  return null;
}
