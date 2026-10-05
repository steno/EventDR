import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { isAgeHint, normalizeAgeHint } from "./age-hint";
import { en } from "@/i18n/dictionaries/en";
import type { AgeHint, Event } from "./types";

describe("normalizeAgeHint", () => {
  it("accepts known enum values", () => {
    const values: AgeHint[] = ["all-ages", "family", "18-plus", "21-plus"];
    for (const value of values) {
      assert.equal(normalizeAgeHint(value), value);
      assert.equal(isAgeHint(value), true);
    }
  });

  it("rejects unknown, empty, and non-string values", () => {
    assert.equal(normalizeAgeHint(undefined), undefined);
    assert.equal(normalizeAgeHint(null), undefined);
    assert.equal(normalizeAgeHint(""), undefined);
    assert.equal(normalizeAgeHint("  "), undefined);
    assert.equal(normalizeAgeHint("18+"), undefined);
    assert.equal(normalizeAgeHint("adults"), undefined);
    assert.equal(normalizeAgeHint(18), undefined);
    assert.equal(isAgeHint("nightlife"), false);
  });
});

describe("detail age hint visibility", () => {
  it("has a guest label for every AgeHint", () => {
    const values: AgeHint[] = ["all-ages", "family", "18-plus", "21-plus"];
    for (const value of values) {
      const label = en.detail.ageHint[value];
      assert.ok(label.trim().length > 0);
    }
  });

  it("only surfaces a chip when ageHint is set", () => {
    const withHint: Pick<Event, "ageHint"> = { ageHint: "family" };
    const withoutHint: Pick<Event, "ageHint"> = {};

    const labelWhenSet = withHint.ageHint
      ? en.detail.ageHint[withHint.ageHint]
      : null;
    const labelWhenUnset = withoutHint.ageHint
      ? en.detail.ageHint[withoutHint.ageHint]
      : null;

    assert.equal(labelWhenSet, "Family-friendly");
    assert.equal(labelWhenUnset, null);
  });
});
