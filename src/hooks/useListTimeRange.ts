"use client";

import { useCallback, useSyncExternalStore } from "react";
import { DEFAULT_FILTER_TIME_RANGE, type FilterTimeRange } from "@/lib/filters";
import {
  LIST_TIME_RANGE_STORAGE_KEY,
  parseListTimeRange,
} from "@/lib/list-time-range";

const listeners = new Set<() => void>();
/** In-memory chip so private-mode storage failures still update the UI. */
let memoryRange: FilterTimeRange | null = null;

function readStoredRange(): FilterTimeRange {
  if (memoryRange) return memoryRange;
  if (typeof window === "undefined") return DEFAULT_FILTER_TIME_RANGE;
  try {
    return parseListTimeRange(
      sessionStorage.getItem(LIST_TIME_RANGE_STORAGE_KEY),
    );
  } catch {
    return DEFAULT_FILTER_TIME_RANGE;
  }
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function emit() {
  for (const listener of listeners) listener();
}

export function useListTimeRange() {
  const timeRange = useSyncExternalStore(
    subscribe,
    readStoredRange,
    () => DEFAULT_FILTER_TIME_RANGE,
  );

  const setTimeRange = useCallback((next: FilterTimeRange) => {
    memoryRange = next;
    try {
      sessionStorage.setItem(LIST_TIME_RANGE_STORAGE_KEY, next);
    } catch {
      // Private mode / blocked storage — keep the in-memory chip.
    }
    emit();
  }, []);

  return { timeRange, setTimeRange };
}
