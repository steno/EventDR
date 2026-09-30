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
  it("stays at 2 columns below the xl breakpoint", () => {
    assert.equal(countCardGridColumns(800, 390), CARD_GRID_MOBILE_COLUMNS);
    assert.equal(countCardGridColumns(900, 1024), CARD_GRID_MOBILE_COLUMNS);
  });

  it("fits 5 tracks in the ~1440px listing shell", () => {
    assert.equal(countCardGridColumns(1360, 1440), 5);
  });
});

describe("cardGridRowRemainder", () => {
  it("is 3 when 12 cards sit in 5 columns", () => {
    assert.equal(cardGridRowRemainder(12, 5), 3);
  });

  it("is 0 when the last row is already full", () => {
    assert.equal(cardGridRowRemainder(15, 5), 0);
    assert.equal(cardGridRowRemainder(12, 4), 0);
  });
});

describe("cardGridLastItemSpan", () => {
  it("stretches a lone card across a 2-column row", () => {
    assert.equal(cardGridLastItemSpan(1, 2), 2);
  });

  it("stretches the 3rd card in a 2-column day group", () => {
    assert.equal(cardGridLastItemSpan(3, 2), 2);
  });

  it("keeps a full row at span 1", () => {
    assert.equal(cardGridLastItemSpan(4, 2), 1);
    assert.equal(cardGridLastItemSpan(6, 3), 1);
  });
});

describe("cardGridDayGroupSpans", () => {
  it("fills holes on the 2-col mobile grid when day headers restart", () => {
    // Sat: 3 cards, Sun: 1 card — same as the Puerto Plata weekend hole.
    assert.deepEqual(cardGridDayGroupSpans([3, 1], 2), [1, 1, 2, 2]);
  });

  it("leaves even day groups alone", () => {
    assert.deepEqual(cardGridDayGroupSpans([2, 2], 2), [1, 1, 1, 1]);
  });

  it("keeps desktop auto-fill tiles at span 1 (no billboard stretch)", () => {
    // Fri: 3 cards, Sun: 1 card in a 5-col shell — last cards must not span 3/5.
    assert.deepEqual(cardGridDayGroupSpans([3, 1], 5), [1, 1, 1, 1]);
    assert.deepEqual(cardGridDayGroupSpans([1], 5), [1]);
  });
});

describe("cardGridDayGroupPadSpans", () => {
  it("is empty on the 2-col grid (events stretch instead)", () => {
    assert.equal(cardGridDayGroupPadSpans([3, 1], 2).size, 0);
  });

  it("maps last-of-day indices to leftover columns on desktop", () => {
    const pads = cardGridDayGroupPadSpans([3, 1], 5);
    assert.equal(pads.get(2), 2); // Fri: 3 events → 2 empty
    assert.equal(pads.get(3), 4); // Sun: 1 event → 4 empty
    assert.equal(pads.size, 2);
  });

  it("skips full days", () => {
    assert.equal(cardGridDayGroupPadSpans([5, 5], 5).size, 0);
  });
});

describe("fillCardGridPage", () => {
  it("fills a 5-column last row instead of leaving 2 cards + a hole", () => {
    assert.equal(fillCardGridPage(12, 30, 5), 15);
  });

  it("does not invent cards past the catalog", () => {
    assert.equal(fillCardGridPage(12, 13, 5), 13);
  });

  it("leaves a complete page unchanged", () => {
    assert.equal(fillCardGridPage(12, 40, 4), 12);
  });
});
