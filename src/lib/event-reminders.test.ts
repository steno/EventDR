import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { addDaysISO } from "./event-dates";
import {
  availableReminderTimings,
  computeRemindAt,
  northCoastLocalToUtc,
  recommendedReminderOffset,
  resolveRemindableDate,
} from "./event-reminders";

describe("event-reminders", () => {
  it("maps North Coast wall time to UTC (AST = UTC−4)", () => {
    const utc = northCoastLocalToUtc("2026-09-10", 10, 0);
    assert.equal(utc.toISOString(), "2026-09-10T14:00:00.000Z");
  });

  it("computes day-before at 10:00 AST", () => {
    const remindAt = computeRemindAt("2026-09-10", "8:00 PM", "day_before");
    assert.equal(remindAt?.toISOString(), "2026-09-09T14:00:00.000Z");
  });

  it("computes 2 hours before start", () => {
    const remindAt = computeRemindAt("2026-09-10", "8:00 PM", "hours_before_2");
    // 8:00 PM AST → 00:00 UTC next day; minus 2h → 22:00 UTC same calendar day
    assert.equal(remindAt?.toISOString(), "2026-09-10T22:00:00.000Z");
  });

  it("filters past and post-start offsets", () => {
    const eventDate = addDaysISO("2026-09-07", 3);
    const now = northCoastLocalToUtc(eventDate, 9, 0);
    const timings = availableReminderTimings(
      { date: eventDate, time: "8:00 PM" },
      now,
    );
    const offsets = timings.map((t) => t.offset);
    assert.ok(offsets.includes("morning_of"));
    assert.ok(offsets.includes("hours_before_2"));
    assert.ok(!offsets.includes("day_before"));
    assert.equal(recommendedReminderOffset(timings), "morning_of");
  });

  it("returns no timings once a one-off has started", () => {
    const timings = availableReminderTimings(
      { date: "2026-09-01", time: "8:00 PM" },
      northCoastLocalToUtc("2026-09-01", 21, 0),
    );
    assert.deepEqual(timings, []);
  });

  it("rolls a daily event that already started to tomorrow", () => {
    const now = northCoastLocalToUtc("2026-09-07", 10, 56);
    const event = {
      date: "2026-09-07",
      time: "8:00 AM–12:00 PM",
      recurrence: "daily" as const,
    };
    assert.equal(resolveRemindableDate(event, now), "2026-09-08");
    const timings = availableReminderTimings(event, now);
    assert.ok(timings.length > 0);
    assert.ok(timings.every((t) => t.eventDate === "2026-09-08"));
    assert.ok(timings.some((t) => t.offset === "hours_before_2"));
  });
});
