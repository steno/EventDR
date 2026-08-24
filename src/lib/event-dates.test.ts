import assert from "node:assert/strict";
import { describe, it } from "node:test";
import type { Event } from "./types";
import {
  eventMatchesRecurrence,
  materializeEventDates,
} from "./event-dates";

function weekdayFitness(overrides: Partial<Event> = {}): Event {
  return {
    id: "costambar-beach-fitness",
    title: "Costambar Beach Fitness",
    description: "Free beach fitness on Costambar sand.",
    date: "2026-08-31",
    time: "9:00 AM – 10:00 AM",
    location: "Costambar",
    category: "health-wellness",
    format: "physical",
    recurrence: "weekdays",
    isFree: true,
    ...overrides,
  };
}

/** Monday 24 Aug 2026, noon Atlantic. */
const beforeStart = new Date("2026-08-24T16:00:00.000Z");
/** Monday 31 Aug 2026, noon Atlantic. */
const onStart = new Date("2026-08-31T16:00:00.000Z");

describe("materializeEventDates — series start", () => {
  it("holds weekday series at the start date until classes begin", () => {
    const [event] = materializeEventDates([weekdayFitness()], beforeStart);
    assert.equal(event?.date, "2026-08-31");
  });

  it("uses the start Monday once the series is underway", () => {
    const [event] = materializeEventDates([weekdayFitness()], onStart);
    assert.equal(event?.date, "2026-08-31");
  });

  it("still pins already-running weekday series to today", () => {
    const [event] = materializeEventDates(
      [weekdayFitness({ date: "2026-01-01" })],
      beforeStart,
    );
    assert.equal(event?.date, "2026-08-24");
  });
});

describe("eventMatchesRecurrence — series start", () => {
  it("does not treat a future weekday series as happening today", () => {
    assert.equal(
      eventMatchesRecurrence(weekdayFitness(), "today", beforeStart),
      false,
    );
  });

  it("matches today on the Monday the beach class restarts", () => {
    assert.equal(
      eventMatchesRecurrence(weekdayFitness(), "today", onStart),
      true,
    );
  });
});
