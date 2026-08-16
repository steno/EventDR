import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { shouldScrollDownToListPark } from "./list-scroll";

describe("shouldScrollDownToListPark", () => {
  it("scrolls when the viewport is still above the park target", () => {
    assert.equal(shouldScrollDownToListPark(40, 200), true);
  });

  it("skips when already at the park target", () => {
    assert.equal(shouldScrollDownToListPark(200, 200), false);
  });

  it("skips when further into the list (sticky tabs already placed)", () => {
    assert.equal(shouldScrollDownToListPark(800, 200), false);
  });

  it("treats near-target as parked within epsilon", () => {
    assert.equal(shouldScrollDownToListPark(195, 200), false);
    assert.equal(shouldScrollDownToListPark(191, 200), true);
  });
});
