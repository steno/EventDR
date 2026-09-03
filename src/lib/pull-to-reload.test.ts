import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  PULL_ARM_PX,
  PULL_MAX_PX,
  canStartPull,
  dampPullDistance,
  isMostlyVertical,
  isPullArmed,
} from "./pull-to-reload";

describe("dampPullDistance", () => {
  it("ignores upward or zero movement", () => {
    assert.equal(dampPullDistance(0), 0);
    assert.equal(dampPullDistance(-40), 0);
  });

  it("applies resistance so a long finger drag maps to a shorter visual pull", () => {
    const visual = dampPullDistance(240);
    assert.equal(visual, 120);
    assert.ok(visual < 240);
  });

  it("caps the visual travel", () => {
    assert.equal(dampPullDistance(10_000), PULL_MAX_PX);
  });
});

describe("isPullArmed", () => {
  it("stays idle below the long-drag threshold", () => {
    assert.equal(isPullArmed(PULL_ARM_PX - 1), false);
  });

  it("arms at the long-drag threshold", () => {
    assert.equal(isPullArmed(PULL_ARM_PX), true);
    assert.equal(isPullArmed(PULL_ARM_PX + 20), true);
  });
});

describe("isMostlyVertical", () => {
  it("accepts a committed downward drag", () => {
    assert.equal(isMostlyVertical(10, 80), true);
  });

  it("rejects a horizontal carousel swipe", () => {
    assert.equal(isMostlyVertical(80, 10), false);
  });
});

describe("canStartPull", () => {
  it("only starts at the top of the page", () => {
    assert.equal(canStartPull(0), true);
    assert.equal(canStartPull(3), true);
    assert.equal(canStartPull(24), false);
  });
});
