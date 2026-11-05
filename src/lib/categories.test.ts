import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  CATEGORY_IDS,
  getNavCategoryIds,
  isCategoryVisibleInNav,
} from "./categories";
import { sortCategoryIdsByEventCount } from "./event-navigation";

const HALLOWEEN_IN_SEASON = new Date("2026-10-20T16:00:00.000Z");
const HALLOWEEN_OFF_SEASON = new Date("2026-11-05T16:00:00.000Z");
const CHRISTMAS_IN_SEASON = new Date("2026-12-10T16:00:00.000Z");
const CHRISTMAS_OFF_SEASON = new Date("2026-11-05T16:00:00.000Z");
const REYES_IN_SEASON = new Date("2027-01-05T16:00:00.000Z");

describe("Halloween category nav visibility", () => {
  it("keeps halloween in the full taxonomy year-round", () => {
    assert.ok(CATEGORY_IDS.includes("halloween"));
  });

  it("shows halloween in browse nav only inside the seasonal window", () => {
    assert.equal(isCategoryVisibleInNav("halloween", HALLOWEEN_IN_SEASON), true);
    assert.equal(
      isCategoryVisibleInNav("halloween", HALLOWEEN_OFF_SEASON),
      false,
    );
    assert.ok(getNavCategoryIds(HALLOWEEN_IN_SEASON).includes("halloween"));
    assert.equal(
      getNavCategoryIds(HALLOWEEN_OFF_SEASON).includes("halloween"),
      false,
    );
  });

  it("keeps year-round categories in nav off-season", () => {
    assert.ok(getNavCategoryIds(HALLOWEEN_OFF_SEASON).includes("music"));
    assert.ok(getNavCategoryIds(HALLOWEEN_OFF_SEASON).includes("food-drinks"));
  });

  it("pins halloween first in-season and drops it off-season", () => {
    const events = [
      {
        category: "music" as const,
        categories: [] as ("music" | "halloween")[],
      },
      {
        category: "halloween" as const,
        categories: [] as ("music" | "halloween")[],
      },
      {
        category: "halloween" as const,
        categories: [] as ("music" | "halloween")[],
      },
    ];
    assert.equal(
      sortCategoryIdsByEventCount(events, HALLOWEEN_IN_SEASON)[0],
      "halloween",
    );
    assert.equal(
      sortCategoryIdsByEventCount(events, HALLOWEEN_OFF_SEASON).includes(
        "halloween",
      ),
      false,
    );
  });
});

describe("Christmas category nav visibility", () => {
  it("keeps christmas in the full taxonomy year-round", () => {
    assert.ok(CATEGORY_IDS.includes("christmas"));
  });

  it("shows christmas in browse nav only inside Nov 15–Jan 6", () => {
    assert.equal(
      isCategoryVisibleInNav("christmas", CHRISTMAS_IN_SEASON),
      true,
    );
    assert.equal(isCategoryVisibleInNav("christmas", REYES_IN_SEASON), true);
    assert.equal(
      isCategoryVisibleInNav("christmas", CHRISTMAS_OFF_SEASON),
      false,
    );
    assert.ok(getNavCategoryIds(CHRISTMAS_IN_SEASON).includes("christmas"));
    assert.equal(
      getNavCategoryIds(CHRISTMAS_OFF_SEASON).includes("christmas"),
      false,
    );
  });

  it("pins christmas first in-season and drops it off-season", () => {
    const events = [
      {
        category: "music" as const,
        categories: [] as ("music" | "christmas")[],
      },
      {
        category: "christmas" as const,
        categories: [] as ("music" | "christmas")[],
      },
      {
        category: "christmas" as const,
        categories: [] as ("music" | "christmas")[],
      },
    ];
    assert.equal(
      sortCategoryIdsByEventCount(events, CHRISTMAS_IN_SEASON)[0],
      "christmas",
    );
    assert.equal(
      sortCategoryIdsByEventCount(events, CHRISTMAS_OFF_SEASON).includes(
        "christmas",
      ),
      false,
    );
  });
});
