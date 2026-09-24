"use client";

import { useCallback, useSyncExternalStore } from "react";
import { DEFAULT_FILTER_TIME_RANGE, type FilterTimeRange } from "@/lib/filters";
import {
  getListTimeRange,
  subscribeListTimeRange,
  writeListTimeRange,
} from "@/lib/list-time-range";

export function useListTimeRange() {
  const timeRange = useSyncExternalStore(
    subscribeListTimeRange,
    getListTimeRange,
    () => DEFAULT_FILTER_TIME_RANGE,
  );

  const setTimeRange = useCallback((next: FilterTimeRange) => {
    writeListTimeRange(next);
  }, []);

  return { timeRange, setTimeRange };
}
