import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { browseDayTearOffParts, formatBrowseDayHeader } from "./format-date";

describe("formatBrowseDayHeader", () => {
  it("formats full English weekday caps for the All calendar strip", () => {
    assert.equal(formatBrowseDayHeader("2026-11-28", "en"), "SATURDAY - NOV. 28");
    assert.equal(formatBrowseDayHeader("2026-11-09", "en"), "MONDAY - NOV. 9");
  });
});

describe("browseDayTearOffParts", () => {
  it("splits month band + day number for the tear-off badge", () => {
    assert.deepEqual(browseDayTearOffParts("2026-11-28", "en"), {
      weekday: "SATURDAY",
      month: "Nov",
      day: 28,
    });
  });
});
