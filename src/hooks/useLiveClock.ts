"use client";

import { useSyncExternalStore } from "react";

const TICK_MS = 60_000;

let nowMs = Date.now();
const listeners = new Set<() => void>();
let intervalId: ReturnType<typeof setInterval> | null = null;

function emit() {
  nowMs = Date.now();
  for (const listener of listeners) listener();
}

function ensureInterval() {
  if (typeof window === "undefined" || intervalId != null) return;
  intervalId = setInterval(emit, TICK_MS);
}

function subscribe(onStoreChange: () => void): () => void {
  listeners.add(onStoreChange);
  ensureInterval();
  return () => {
    listeners.delete(onStoreChange);
    if (listeners.size === 0 && intervalId != null) {
      clearInterval(intervalId);
      intervalId = null;
    }
  };
}

function getSnapshot(): number {
  return nowMs;
}

function getServerSnapshot(): number {
  return 0;
}

/** Shared minute clock — one interval for all live-status subscribers. */
export function useLiveClockMs(): number {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export function useLiveClockNow(): Date {
  const ms = useLiveClockMs();
  return ms === 0 ? new Date() : new Date(ms);
}
