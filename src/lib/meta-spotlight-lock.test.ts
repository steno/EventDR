import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  decideSpotlightLockAction,
  SPOTLIGHT_LOCK_STALE_MS,
  type SpotlightLockRecord,
} from "./meta-spotlight-lock";

function lock(
  partial: Partial<SpotlightLockRecord> = {},
): SpotlightLockRecord {
  return {
    date: "2026-08-21",
    locale: "en",
    source: "today",
    status: "complete",
    eventIds: ["a"],
    startedAt: 1,
    updatedAt: 1,
    ...partial,
  };
}

describe("decideSpotlightLockAction", () => {
  it("reuses a completed same-day Facebook+Instagram post", () => {
    assert.equal(
      decideSpotlightLockAction(
        lock({ facebookId: "fb", instagramId: "ig" }),
        "2026-08-21",
      ),
      "reuse",
    );
  });

  it("reuses even if the lock was still marked in progress", () => {
    assert.equal(
      decideSpotlightLockAction(
        lock({
          status: "in_progress",
          facebookId: "fb",
          instagramId: "ig",
        }),
        "2026-08-21",
      ),
      "reuse",
    );
  });

  it("resumes Instagram when Facebook already posted", () => {
    assert.equal(
      decideSpotlightLockAction(
        lock({ status: "in_progress", facebookId: "fb" }),
        "2026-08-21",
      ),
      "resume-instagram",
    );
  });

  it("waits while a fresh publish is in flight", () => {
    const now = 1_000_000;
    assert.equal(
      decideSpotlightLockAction(
        lock({
          status: "in_progress",
          startedAt: now - 10_000,
          facebookId: undefined,
        }),
        "2026-08-21",
        now,
      ),
      "wait",
    );
  });

  it("retries after a stale in-progress lock", () => {
    const now = 1_000_000;
    assert.equal(
      decideSpotlightLockAction(
        lock({
          status: "in_progress",
          startedAt: now - SPOTLIGHT_LOCK_STALE_MS - 1,
        }),
        "2026-08-21",
        now,
      ),
      "proceed",
    );
  });

  it("starts fresh on a new calendar day", () => {
    assert.equal(
      decideSpotlightLockAction(
        lock({ facebookId: "fb", instagramId: "ig" }),
        "2026-08-22",
      ),
      "proceed",
    );
  });
});
