import {
  DEFAULT_FILTER_TIME_RANGE,
  isFilterTimeRange,
  type FilterTimeRange,
} from "@/lib/filters";

/** Session chip for All / Today / Tomorrow / Weekend on city & category lists. */
export const LIST_TIME_RANGE_STORAGE_KEY = "pop-event-list-when";

/**
 * Last category scope the when-chip was applied to. City-only swaps keep the
 * same key so Today/Weekend can stick; a new category resets to All.
 */
export const LIST_TIME_RANGE_CATEGORY_KEY = "pop-event-list-when-category";

const listeners = new Set<() => void>();
/** In-memory chip so private-mode storage failures still update the UI. */
let memoryRange: FilterTimeRange | null = null;
let memoryCategoryKey: string | null = null;

export function parseListTimeRange(
  value: string | null | undefined,
): FilterTimeRange {
  if (value && isFilterTimeRange(value)) return value;
  return DEFAULT_FILTER_TIME_RANGE;
}

function emit() {
  for (const listener of listeners) listener();
}

export function subscribeListTimeRange(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function getListTimeRange(): FilterTimeRange {
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

export function writeListTimeRange(next: FilterTimeRange): void {
  memoryRange = next;
  try {
    sessionStorage.setItem(LIST_TIME_RANGE_STORAGE_KEY, next);
  } catch {
    // Private mode / blocked storage — keep the in-memory chip.
  }
  emit();
}

function readStoredCategoryKey(): string | null {
  if (memoryCategoryKey != null) return memoryCategoryKey;
  if (typeof window === "undefined") return null;
  try {
    return sessionStorage.getItem(LIST_TIME_RANGE_CATEGORY_KEY);
  } catch {
    return null;
  }
}

function writeStoredCategoryKey(categoryKey: string): void {
  memoryCategoryKey = categoryKey;
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(LIST_TIME_RANGE_CATEGORY_KEY, categoryKey);
  } catch {
    // Private mode / blocked storage — keep the in-memory key.
  }
}

/**
 * Keep All/Today/Tomorrow/Weekend across city swaps, but reset to All when the
 * category scope changes (including entering or leaving a category).
 *
 * Safe to call during render before reading the chip — avoids a one-frame flash
 * of the previous category's time tab.
 */
export function syncListTimeRangeForCategory(categoryKey: string): void {
  if (typeof window === "undefined") return;
  const prev = readStoredCategoryKey();
  if (prev != null && prev !== categoryKey) {
    writeListTimeRange(DEFAULT_FILTER_TIME_RANGE);
  }
  writeStoredCategoryKey(categoryKey);
}

/** Force All — e.g. picking a category from a when / “see all” listing. */
export function resetListTimeRangeToAll(): void {
  writeListTimeRange(DEFAULT_FILTER_TIME_RANGE);
}

/** Test helper — clears in-memory chip state between cases. */
export function resetListTimeRangeMemoryForTests(): void {
  memoryRange = null;
  memoryCategoryKey = null;
}
