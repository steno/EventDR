import {
  DEFAULT_FILTER_TIME_RANGE,
  isFilterTimeRange,
  type FilterTimeRange,
} from "@/lib/filters";

/** Session chip for All / Today / Tomorrow / Weekend on city & category lists. */
export const LIST_TIME_RANGE_STORAGE_KEY = "pop-event-list-when";

/**
 * Last category scope the when-chip was applied to (diagnostics / tests).
 * City and category soft-nav both keep the All/Today/Tomorrow/Weekend chip,
 * except {@link FORCE_ALL_ON_LAND_CATEGORIES}.
 */
export const LIST_TIME_RANGE_CATEGORY_KEY = "pop-event-list-when-category";

/**
 * Seasonal hubs that should open on All, ignoring a stale Today/Weekend chip
 * from another list (Christmas dates span weeks).
 */
const FORCE_ALL_ON_LAND_CATEGORIES = new Set(["christmas"]);

const listeners = new Set<() => void>();
/** In-memory chip so private-mode storage failures still update the UI. */
let memoryRange: FilterTimeRange | null = null;
let memoryCategoryKey: string | null = null;

function readStoredCategoryKey(): string | null {
  if (memoryCategoryKey != null) return memoryCategoryKey;
  if (typeof window === "undefined") return null;
  try {
    return sessionStorage.getItem(LIST_TIME_RANGE_CATEGORY_KEY);
  } catch {
    return null;
  }
}

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
 * Remember which category scope last read the when-chip. Keeps
 * All/Today/Tomorrow/Weekend across most category soft-nav — except Christmas,
 * which always lands on All when you enter that hub.
 *
 * Safe to call during render before reading the chip.
 */
export function syncListTimeRangeForCategory(categoryKey: string): void {
  if (typeof window === "undefined") return;
  const prev = readStoredCategoryKey();
  writeStoredCategoryKey(categoryKey);
  if (
    categoryKey &&
    FORCE_ALL_ON_LAND_CATEGORIES.has(categoryKey) &&
    prev !== categoryKey
  ) {
    writeListTimeRange(DEFAULT_FILTER_TIME_RANGE);
  }
}

/** Force All — rare explicit clears (tests / callers that opt in). */
export function resetListTimeRangeToAll(): void {
  writeListTimeRange(DEFAULT_FILTER_TIME_RANGE);
}

/** Test helper — clears in-memory chip state between cases. */
export function resetListTimeRangeMemoryForTests(): void {
  memoryRange = null;
  memoryCategoryKey = null;
}
