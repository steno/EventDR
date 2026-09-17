import assert from "node:assert/strict";
import { describe, it } from "node:test";
import type { Event } from "./types";
import {
  eventMatchesRecurrence,
  isPastOneOffEvent,
  materializeEventDates,
} from "./event-dates";
import { getTodaySpecialEvents } from "./home-layout";

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

function karaokeTonight(overrides: Partial<Event> = {}): Event {
  return {
    id: "ocean-world-terrace-singing-talent-2026-09-16",
    title: "Karaoke Talent Night at Ocean World Terrace",
    description: "Karaoke night at Ocean World Terrace.",
    date: "2026-09-16",
    location: "Puerto Plata",
    venue: "Terraza Ocean World",
    venueSlug: "ocean-world",
    category: "performances",
    format: "physical",
    ...overrides,
  };
}

/** Monday 24 Aug 2026, noon Atlantic. */
const beforeStart = new Date("2026-08-24T16:00:00.000Z");
/** Monday 31 Aug 2026, noon Atlantic. */
const onStart = new Date("2026-08-31T16:00:00.000Z");
/** Wed 16 Sep 2026, 21:08 Atlantic — after default all-day window. */
const afterKaraokeDefaultEnd = new Date("2026-09-17T01:08:00.000Z");
/** Wed 16 Sep 2026, 15:00 Atlantic — still daytime. */
const afternoonSameDay = new Date("2026-09-16T19:00:00.000Z");

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

describe("isPastOneOffEvent — same cutoff as home specials", () => {
  it("keeps a same-day one-off upcoming during the afternoon", () => {
    assert.equal(isPastOneOffEvent(karaokeTonight(), afternoonSameDay), false);
  });

  it("moves a same-day one-off to past after the live window ends", () => {
    assert.equal(
      isPastOneOffEvent(karaokeTonight(), afterKaraokeDefaultEnd),
      true,
    );
  });

  it("drops the same one-off from home specials at that cutoff", () => {
    const stillOn = getTodaySpecialEvents([karaokeTonight()], {
      now: afternoonSameDay,
    });
    const gone = getTodaySpecialEvents([karaokeTonight()], {
      now: afterKaraokeDefaultEnd,
    });
    assert.equal(stillOn.length, 1);
    assert.equal(gone.length, 0);
  });

  it("never treats recurring closed-today nights as past", () => {
    const park: Event = {
      id: "ocean-world-daily",
      title: "Ocean World Adventure Park",
      description: "Daily park hours",
      date: "2026-09-16",
      time: "9:00 AM - 6:00 PM",
      location: "Puerto Plata",
      category: "adventure",
      format: "physical",
      recurrence: "daily",
    };
    assert.equal(isPastOneOffEvent(park, afterKaraokeDefaultEnd), false);
  });
});
