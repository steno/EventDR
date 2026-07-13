"use client";

import { useState } from "react";

const STORAGE_KEY = "pop-today-shuffle-seed";

function createShuffleSeed(): string {
  return Math.random().toString(36).slice(2, 12);
}

function readSessionShuffleSeed(): string {
  if (typeof window === "undefined") return "default";
  try {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    if (stored) return stored;
    const seed = createShuffleSeed();
    sessionStorage.setItem(STORAGE_KEY, seed);
    return seed;
  } catch {
    return createShuffleSeed();
  }
}

/** Stable per browser tab — reshuffles Happening today on each new session. */
export function useTodayHighlightShuffleSeed(): string {
  const [seed] = useState(readSessionShuffleSeed);
  return seed;
}
