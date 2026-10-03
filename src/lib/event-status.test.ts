import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  getEventLiveStatus,
  isLikelyLateNightUntimedListing,
  parseEventTimeWindow,
} from "./event-status";

describe("parseEventTimeWindow day-labeled sessions", () => {
  const time = "Sat 5:30 PM · Sun 1:00 PM";

  it("does not treat Sat/Sun starts as an overnight range", () => {
    const window = parseEventTimeWindow(time);
    assert.ok(window);
    assert.ok(window.end > window.start, "must not invert into overnight");
    // Without a date, use the earlier clock + default duration (not Sat→Sun).
    assert.equal(window.start, 13 * 60);
    assert.equal(window.end, 13 * 60 + 120);
  });

  it("uses Sunday's start when now is Sunday", () => {
    /** Sun Sep 27, 2026 10:45 PM America/Santo_Domingo. */
    const sundayNight = new Date("2026-09-28T02:45:00.000Z");
    const window = parseEventTimeWindow(time, sundayNight);
    assert.deepEqual(window, {
      start: 13 * 60,
      end: 13 * 60 + 120,
    });
  });

  it("parses Spanish day labels", () => {
    /** Sun Sep 27, 2026 2:00 PM America/Santo_Domingo. */
    const sundayAfternoon = new Date("2026-09-27T18:00:00.000Z");
    const window = parseEventTimeWindow(
      "Sáb 5:30 PM · Dom 1:00 PM",
      sundayAfternoon,
    );
    assert.deepEqual(window, { start: 13 * 60, end: 15 * 60 });
  });
});

describe("getEventLiveStatus day-labeled family shows", () => {
  const mickey = {
    date: "2026-09-26",
    endDate: "2026-09-27",
    time: "Sat 5:30 PM · Sun 1:00 PM",
  };

  it("is ended Sunday night after the afternoon kids session", () => {
    /** Sun Sep 27, 2026 10:45 PM America/Santo_Domingo. */
    const sundayNight = new Date("2026-09-28T02:45:00.000Z");
    assert.equal(getEventLiveStatus(mickey, sundayNight), "ended");
  });

  it("is live during Sunday's 1 PM window", () => {
    /** Sun Sep 27, 2026 1:30 PM America/Santo_Domingo. */
    const duringShow = new Date("2026-09-27T17:30:00.000Z");
    assert.equal(getEventLiveStatus(mickey, duringShow), "live");
  });

  it("is closed for today Saturday after the evening session", () => {
    /** Sat Sep 26, 2026 9:00 PM America/Santo_Domingo. */
    const satNight = new Date("2026-09-27T01:00:00.000Z");
    assert.equal(getEventLiveStatus(mickey, satNight), "closedToday");
  });
});

describe("untimed listing cutoffs", () => {
  /** Fri 2 Oct 2026, 9:32 PM America/Santo_Domingo. */
  const fridayNight = new Date("2026-10-03T01:32:00.000Z");

  it("classifies parties/music as late-night untimed", () => {
    assert.equal(
      isLikelyLateNightUntimedListing({ category: "parties" }),
      true,
    );
    assert.equal(
      isLikelyLateNightUntimedListing({
        category: "food-drinks",
        categories: ["music"],
      }),
      true,
    );
    assert.equal(
      isLikelyLateNightUntimedListing({ category: "business" }),
      false,
    );
  });

  it("keeps untimed club nights listable after 9 PM", () => {
    assert.equal(
      getEventLiveStatus(
        { date: "2026-10-02", category: "parties" },
        fridayNight,
      ),
      "unknown",
    );
  });

  it("ends untimed daytime listings after 9 PM", () => {
    assert.equal(
      getEventLiveStatus(
        { date: "2026-10-02", category: "business" },
        fridayNight,
      ),
      "ended",
    );
  });
});
