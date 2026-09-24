import assert from "node:assert/strict";
import { describe, it, beforeEach } from "node:test";
import {
  getListTimeRange,
  parseListTimeRange,
  resetListTimeRangeMemoryForTests,
  resetListTimeRangeToAll,
  syncListTimeRangeForCategory,
  writeListTimeRange,
  LIST_TIME_RANGE_CATEGORY_KEY,
  LIST_TIME_RANGE_STORAGE_KEY,
} from "./list-time-range";

function installSessionStorageMock() {
  const store = new Map<string, string>();
  const sessionStorage = {
    getItem(key: string) {
      return store.has(key) ? store.get(key)! : null;
    },
    setItem(key: string, value: string) {
      store.set(key, value);
    },
    removeItem(key: string) {
      store.delete(key);
    },
    clear() {
      store.clear();
    },
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (global as any).window = { sessionStorage };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (global as any).sessionStorage = sessionStorage;
  return store;
}

describe("parseListTimeRange", () => {
  it("keeps a valid time chip", () => {
    assert.equal(parseListTimeRange("today"), "today");
    assert.equal(parseListTimeRange("weekend"), "weekend");
  });

  it("falls back to All for missing or unknown values", () => {
    assert.equal(parseListTimeRange(null), "all");
    assert.equal(parseListTimeRange("week"), "all");
  });
});

describe("syncListTimeRangeForCategory", () => {
  beforeEach(() => {
    resetListTimeRangeMemoryForTests();
    installSessionStorageMock();
  });

  it("keeps the time chip when the category scope stays the same", () => {
    writeListTimeRange("today");
    syncListTimeRangeForCategory("music");
    assert.equal(getListTimeRange(), "today");

    syncListTimeRangeForCategory("music");
    assert.equal(getListTimeRange(), "today");
    assert.equal(
      sessionStorage.getItem(LIST_TIME_RANGE_CATEGORY_KEY),
      "music",
    );
  });

  it("resets to All when the category scope changes", () => {
    writeListTimeRange("weekend");
    syncListTimeRangeForCategory("music");
    assert.equal(getListTimeRange(), "weekend");

    syncListTimeRangeForCategory("parties");
    assert.equal(getListTimeRange(), "all");
    assert.equal(sessionStorage.getItem(LIST_TIME_RANGE_STORAGE_KEY), "all");
    assert.equal(
      sessionStorage.getItem(LIST_TIME_RANGE_CATEGORY_KEY),
      "parties",
    );
  });

  it("resets to All when entering a category from unscoped lists", () => {
    writeListTimeRange("tomorrow");
    syncListTimeRangeForCategory("");
    assert.equal(getListTimeRange(), "tomorrow");

    syncListTimeRangeForCategory("concert");
    assert.equal(getListTimeRange(), "all");
  });

  it("resetListTimeRangeToAll clears a stale chip for the same category", () => {
    writeListTimeRange("today");
    syncListTimeRangeForCategory("music");
    resetListTimeRangeToAll();
    assert.equal(getListTimeRange(), "all");
    syncListTimeRangeForCategory("music");
    assert.equal(getListTimeRange(), "all");
  });
});
