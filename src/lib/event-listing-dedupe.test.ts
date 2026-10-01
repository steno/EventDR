import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { eventListingDedupeKey } from "./event-listing-dedupe";

describe("eventListingDedupeKey", () => {
  it("keeps Serie Final Game 2 and Game 4 distinct via date", () => {
    const game2 = eventListingDedupeKey({
      title: "Atléticos de Puerto Plata vs Mineros de Bonao — Serie Final Game 2",
      date: "2026-09-27",
    });
    const game4 = eventListingDedupeKey({
      title: "Atléticos de Puerto Plata vs Mineros de Bonao — Serie Final Game 4",
      date: "2026-10-03",
    });
    assert.notEqual(game2, game4);
    assert.match(game2, /:2026-09-27$/);
    assert.match(game4, /:2026-10-03$/);
  });

  it("still collapses same title + same date (true duplicates)", () => {
    const a = eventListingDedupeKey({
      title: "Summer Acoustics with Ed Mahon at Casa Coco",
      date: "2026-10-03",
    });
    const b = eventListingDedupeKey({
      title: "Summer Acoustics with Ed Mahon at Casa Coco",
      date: "2026-10-03",
    });
    assert.equal(a, b);
  });
});
