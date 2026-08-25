import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { parseListTimeRange } from "./list-time-range";

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
