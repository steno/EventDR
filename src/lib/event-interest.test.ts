import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  INTEREST_BATCH_MAX,
  isInterestAction,
  isValidInterestDeviceId,
  isValidInterestEventId,
  normalizeInterestEventIds,
  shouldShowInterestCount,
} from "./event-interest";

describe("event interest validation", () => {
  it("accepts seed and Firestore-style event ids", () => {
    assert.equal(isValidInterestEventId("natura-cabana-saturday-live"), true);
    assert.equal(isValidInterestEventId("Ab12_cd-34"), true);
  });

  it("rejects ids that would break a Firestore doc path", () => {
    assert.equal(isValidInterestEventId("a/b"), false);
    assert.equal(isValidInterestEventId(".."), false);
    assert.equal(isValidInterestEventId(""), false);
    assert.equal(isValidInterestEventId(42), false);
  });

  it("accepts crypto.randomUUID device ids only", () => {
    assert.equal(
      isValidInterestDeviceId("3b241101-e2bb-4255-8caf-4136c566a962"),
      true,
    );
    assert.equal(isValidInterestDeviceId("short"), false);
    assert.equal(isValidInterestDeviceId("x".repeat(65)), false);
  });

  it("only allows add / remove", () => {
    assert.equal(isInterestAction("add"), true);
    assert.equal(isInterestAction("remove"), true);
    assert.equal(isInterestAction("going"), false);
  });
});

describe("normalizeInterestEventIds", () => {
  it("dedupes and drops invalid ids", () => {
    assert.deepEqual(
      normalizeInterestEventIds(["a", "a", "b/c", "", null, "d"]),
      ["a", "d"],
    );
  });

  it("caps a backfill batch", () => {
    const ids = Array.from({ length: INTEREST_BATCH_MAX + 10 }, (_, i) => `e-${i}`);
    assert.equal(normalizeInterestEventIds(ids).length, INTEREST_BATCH_MAX);
  });

  it("returns empty for non-arrays", () => {
    assert.deepEqual(normalizeInterestEventIds("a,b"), []);
  });
});

describe("shouldShowInterestCount", () => {
  it("hides counts below 3", () => {
    assert.equal(shouldShowInterestCount(null), false);
    assert.equal(shouldShowInterestCount(0), false);
    assert.equal(shouldShowInterestCount(2), false);
  });

  it("shows counts from 3", () => {
    assert.equal(shouldShowInterestCount(3), true);
    assert.equal(shouldShowInterestCount(120), true);
  });
});
