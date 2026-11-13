import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  CHRISTMAS_BRAND_ASSETS,
  DEFAULT_BRAND_ASSETS,
  getBrandAssets,
} from "./brand-assets";

describe("getBrandAssets", () => {
  it("uses the Santa-P set inside the Christmas window", () => {
    assert.deepEqual(
      getBrandAssets(new Date("2026-11-13T19:00:00.000Z")),
      CHRISTMAS_BRAND_ASSETS,
    );
    assert.deepEqual(
      getBrandAssets(new Date("2027-01-06T19:00:00.000Z")),
      CHRISTMAS_BRAND_ASSETS,
    );
  });

  it("reverts to the year-round mark outside the window", () => {
    assert.deepEqual(
      getBrandAssets(new Date("2026-11-12T19:00:00.000Z")),
      DEFAULT_BRAND_ASSETS,
    );
    assert.deepEqual(
      getBrandAssets(new Date("2027-01-07T19:00:00.000Z")),
      DEFAULT_BRAND_ASSETS,
    );
  });
});
