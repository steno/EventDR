import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  decideSpotlightLockAction,
  lockRecordForWrite,
  rollSpotlightHistory,
  spotlightExclusions,
  SPOTLIGHT_STEP_LEASE_MS,
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

  it("reuses Facebook-only when Instagram was not requested", () => {
    assert.equal(
      decideSpotlightLockAction(
        lock({ facebookId: "fb" }),
        "2026-08-21",
        Date.now(),
        { instagram: false },
      ),
      "reuse",
    );
  });

  it("resumes Instagram when Facebook already posted and the step lease expired", () => {
    const now = 1_000_000;
    assert.equal(
      decideSpotlightLockAction(
        lock({
          status: "in_progress",
          facebookId: "fb",
          stepLockUntil: now - 1,
        }),
        "2026-08-21",
        now,
      ),
      "resume",
    );
  });

  it("waits while another step still holds the lease", () => {
    const now = 1_000_000;
    assert.equal(
      decideSpotlightLockAction(
        lock({
          status: "in_progress",
          stepLockUntil: now + 10_000,
        }),
        "2026-08-21",
        now,
      ),
      "wait",
    );
  });

  it("resumes a previous step after the lease expires, keeping progress", () => {
    const now = 1_000_000;
    assert.equal(
      decideSpotlightLockAction(
        lock({
          status: "in_progress",
          instagramChildIds: ["c1"],
          stepLockUntil: now - SPOTLIGHT_STEP_LEASE_MS - 1,
        }),
        "2026-08-21",
        now,
      ),
      "resume",
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

  it("starts fresh when force is set", () => {
    assert.equal(
      decideSpotlightLockAction(
        lock({ facebookId: "fb", instagramId: "ig" }),
        "2026-08-21",
        Date.now(),
        { force: true },
      ),
      "proceed",
    );
  });
});

describe("lockRecordForWrite", () => {
  it("omits undefined Facebook and Instagram ids so Firestore does not reject the write", () => {
    const doc = lockRecordForWrite(
      lock({ facebookId: undefined, instagramId: undefined }),
    );
    assert.equal("facebookId" in doc, false);
    assert.equal("instagramId" in doc, false);
    assert.equal(doc.source, "today");
    assert.deepEqual(doc.eventIds, ["a"]);
  });

  it("keeps ids and carousel state that are present", () => {
    const doc = lockRecordForWrite(
      lock({
        facebookId: "fb",
        instagramId: "ig",
        instagramChildIds: ["c1", "c2"],
        instagramParentId: "p1",
        caption: "Today on the North Coast.",
        stepLockUntil: 0,
      }),
    );
    assert.equal(doc.facebookId, "fb");
    assert.equal(doc.instagramId, "ig");
    assert.deepEqual(doc.instagramChildIds, ["c1", "c2"]);
    assert.equal(doc.instagramParentId, "p1");
    assert.equal(doc.caption, "Today on the North Coast.");
    assert.equal(doc.stepLockUntil, 0);
  });
});

describe("rollSpotlightHistory", () => {
  it("moves yesterday's post into recent and keeps prior days", () => {
    const recent = rollSpotlightHistory(
      lock({
        date: "2026-08-25",
        eventIds: ["pop-cinemas-week-2026-08-20", "pickleball"],
        repeatKeys: ["venue:pop-cinemas", "venue:cabarete-sports-club"],
        recent: [{ date: "2026-08-24", eventIds: ["zumba"] }],
      }),
      "2026-08-26",
    );
    assert.deepEqual(
      recent.map((day) => day.date),
      ["2026-08-25", "2026-08-24"],
    );
    assert.deepEqual(recent[0]?.eventIds, [
      "pop-cinemas-week-2026-08-20",
      "pickleball",
    ]);
  });
});

describe("spotlightExclusions", () => {
  it("excludes ids from the last week and keys from the last three days", () => {
    const { excludeIds, excludeKeys } = spotlightExclusions(
      lock({
        date: "2026-08-25",
        eventIds: ["pop-cinemas-week-2026-08-20"],
        repeatKeys: ["venue:pop-cinemas"],
        recent: [
          { date: "2026-08-20", eventIds: ["week-old"], keys: ["venue:week"] },
          { date: "2026-08-18", eventIds: ["old-id"], keys: ["venue:old"] },
        ],
      }),
      "2026-08-26",
    );
    assert.equal(excludeIds.includes("pop-cinemas-week-2026-08-20"), true);
    assert.equal(excludeKeys.includes("venue:pop-cinemas"), true);
    assert.equal(excludeIds.includes("week-old"), true);
    assert.equal(excludeKeys.includes("venue:week"), false);
    assert.equal(excludeIds.includes("old-id"), false);
    assert.equal(excludeKeys.includes("venue:old"), false);
  });
});
