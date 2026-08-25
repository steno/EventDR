import {
  DEFAULT_FILTER_TIME_RANGE,
  isFilterTimeRange,
  type FilterTimeRange,
} from "@/lib/filters";

/** Session chip for All / Today / Tomorrow / Weekend on city & category lists. */
export const LIST_TIME_RANGE_STORAGE_KEY = "pop-event-list-when";

export function parseListTimeRange(
  value: string | null | undefined,
): FilterTimeRange {
  if (value && isFilterTimeRange(value)) return value;
  return DEFAULT_FILTER_TIME_RANGE;
}
