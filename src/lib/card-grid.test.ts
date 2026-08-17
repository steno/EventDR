import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  CARD_GRID_MOBILE_COLUMNS,
  cardGridRowRemainder,
  countCardGridColumns,
  fillCardGridPage,
} from "./card-grid";

describe("countCardGridColumns", () => {
  it("stays at 2 columns below the sm breakpoint", () => {
    assert.equal(countCardGridColumns(800, 390), CARD_GRID_MOBILE_COLUMNS);
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
