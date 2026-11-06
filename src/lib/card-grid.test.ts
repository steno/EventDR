import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  CARD_GRID_MOBILE_COLUMNS,
  cardGridDayGroupPadSpans,
  cardGridDayGroupSpans,
  cardGridLastItemSpan,
  cardGridRowRemainder,
  countCardGridColumns,
  fillCardGridPage,
} from "./card-grid";

describe("countCardGridColumns", () => {
  it("stays at 3 columns below the xl breakpoint", () => {
    assert.equal(countCardGridColumns(800, 390), CARD_GRID_MOBILE_COLUMNS);
    assert.equal(countCardGridColumns(900, 1024), CARD_GRID_MOBILE_COLUMNS);
  });

  it("fits 8 poster tracks in the ~1440px listing shell", () => {
    // (1360 + 10) / (148 + 10) ≈ 8.67 → 8
    assert.equal(countCardGridColumns(1360, 1440), 8);
  });
});

describe("cardGridRowRemainder", () => {
  it("is 3 when 13 cards sit in 8 columns", () => {
    assert.equal(cardGridRowRemainder(13, 8), 3);
  });

  it("is 0 when the last row is already full", () => {
    assert.equal(cardGridRowRemainder(16, 8), 0);
    assert.equal(cardGridRowRemainder(12, 3), 0);
  });
});

describe("cardGridLastItemSpan", () => {
  it("stretches a lone card across a 3-column row", () => {
    assert.equal(cardGridLastItemSpan(1, 3), 3);
  });

  it("stretches the 4th card in a 3-column day group", () => {
    assert.equal(cardGridLastItemSpan(4, 3), 3);
  });

  it("keeps a full row at span 1", () => {
    assert.equal(cardGridLastItemSpan(3, 3), 1);
    assert.equal(cardGridLastItemSpan(6, 3), 1);
  });
});

describe("cardGridDayGroupSpans", () => {
  it("fills holes on the 3-col mobile grid when day headers restart", () => {
    // Sat: 4 cards, Sun: 1 card
    assert.deepEqual(cardGridDayGroupSpans([4, 1], 3), [1, 1, 1, 3, 3]);
  });

  it("leaves even day groups alone", () => {
    assert.deepEqual(cardGridDayGroupSpans([3, 3], 3), [1, 1, 1, 1, 1, 1]);
  });

  it("keeps desktop auto-fill tiles at span 1 (no billboard stretch)", () => {
    assert.deepEqual(cardGridDayGroupSpans([3, 1], 8), [1, 1, 1, 1]);
    assert.deepEqual(cardGridDayGroupSpans([1], 8), [1]);
  });
});

describe("cardGridDayGroupPadSpans", () => {
  it("is empty on the fixed mobile grid (events stretch instead)", () => {
    assert.equal(cardGridDayGroupPadSpans([4, 1], 3).size, 0);
  });

  it("maps last-of-day indices to leftover columns on desktop", () => {
    const pads = cardGridDayGroupPadSpans([3, 1], 8);
    assert.equal(pads.get(2), 5); // Fri: 3 events → 5 empty
    assert.equal(pads.get(3), 7); // Sun: 1 event → 7 empty
    assert.equal(pads.size, 2);
  });

  it("skips full days", () => {
    assert.equal(cardGridDayGroupPadSpans([8, 8], 8).size, 0);
  });
});

describe("fillCardGridPage", () => {
  it("raises the cap so the last desktop row fills", () => {
    assert.equal(fillCardGridPage(12, 30, 8), 16);
  });

  it("does not invent events past the catalog", () => {
    assert.equal(fillCardGridPage(12, 13, 8), 13);
  });

  it("leaves a full page alone", () => {
    assert.equal(fillCardGridPage(12, 40, 3), 12);
  });
});
