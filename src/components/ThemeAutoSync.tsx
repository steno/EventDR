"use client";

import { useEffect } from "react";
import { scheduleAutoTheme } from "@/lib/theme";

/** Applies viewport theme (desktop light / mobile dark) when unset. */
export function ThemeAutoSync() {
  useEffect(() => scheduleAutoTheme(), []);
  return null;
}
