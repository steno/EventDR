"use client";

import { useEffect } from "react";
import { scheduleAutoTheme } from "@/lib/theme";

/** Applies system preference theme when the user has not toggled one. */
export function ThemeAutoSync() {
  useEffect(() => scheduleAutoTheme(), []);
  return null;
}
