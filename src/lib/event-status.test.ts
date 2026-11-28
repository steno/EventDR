import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  getEventLiveStatus,
  isEndingSoon,
  isLikelyLateNightUntimedListing,
  isListedTodaySpecial,
  isSportsViewingEvent,
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
  /** Fri 2 Oct 2026, 6:08 PM America/Santo_Domingo — just past daytime cutoff. */
  const afterSix = new Date("2026-10-02T22:08:00.000Z");
  /** Fri 2 Oct 2026, 5:50 PM America/Santo_Domingo — still before cutoff. */
  const beforeSix = new Date("2026-10-02T21:50:00.000Z");
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

  it("keeps untimed club nights listable after 6 PM", () => {
    assert.equal(
      getEventLiveStatus(
        { date: "2026-10-02", category: "parties" },
        afterSix,
      ),
      "unknown",
    );
    assert.equal(
      getEventLiveStatus(
        { date: "2026-10-02", category: "parties" },
        fridayNight,
      ),
      "unknown",
    );
  });

  it("ends untimed daytime listings after 6 PM", () => {
    assert.equal(
      getEventLiveStatus(
        { date: "2026-10-02", category: "business" },
        beforeSix,
      ),
      "unknown",
    );
    assert.equal(
      getEventLiveStatus(
        { date: "2026-10-02", category: "business" },
        afterSix,
      ),
      "ended",
    );
  });

  it("ends untimed sports / all-ages listings after 6 PM", () => {
    assert.equal(
      getEventLiveStatus(
        {
          date: "2026-10-02",
          category: "sports",
          ageHint: "all-ages",
        },
        afterSix,
      ),
      "ended",
    );
    assert.equal(
      isListedTodaySpecial(
        {
          date: "2026-10-02",
          category: "sports",
          ageHint: "all-ages",
        },
        afterSix,
      ),
      false,
    );
  });

  it("ends family untimed listings after 6 PM even with performances hub", () => {
    assert.equal(
      isLikelyLateNightUntimedListing({
        category: "culture",
        categories: ["performances"],
        ageHint: "family",
      }),
      false,
    );
    assert.equal(
      getEventLiveStatus(
        {
          date: "2026-09-18",
          endDate: "2026-12-12",
          category: "culture",
          categories: ["performances"],
          ageHint: "family",
        },
        fridayNight,
      ),
      "closedToday",
    );
  });
});

describe("sports viewing vs Today’s specials", () => {
  /** Fri 23 Oct 2026, 4:00 PM America/Santo_Domingo. */
  const fridayAfternoon = new Date("2026-10-23T20:00:00.000Z");

  it("flags sports + food-drinks as viewing", () => {
    assert.equal(
      isSportsViewingEvent({
        category: "sports",
        categories: ["food-drinks"],
      }),
      true,
    );
    assert.equal(
      isSportsViewingEvent({ category: "sports", categories: [] }),
      false,
    );
  });

  it("keeps bar watch nights off Today’s specials", () => {
    assert.equal(
      isListedTodaySpecial(
        {
          date: "2026-10-23",
          time: "8:00 PM",
          category: "sports",
          categories: ["food-drinks"],
        },
        fridayAfternoon,
      ),
      false,
    );
  });

  it("keeps cancelled one-offs off Today’s specials", () => {
    assert.equal(
      isListedTodaySpecial(
        {
          date: "2026-10-23",
          time: "5:30 PM",
          category: "culture",
          temporarilyClosed: true,
        },
        fridayAfternoon,
      ),
      false,
    );
  });

  it("keeps multi-day openers off Today’s specials once closed for the day", () => {
    const fest = {
      date: "2026-10-23",
      endDate: "2026-10-25",
      time: "10:00 AM - 6:00 PM",
      category: "culture" as const,
    };
    assert.equal(isListedTodaySpecial(fest, fridayAfternoon), true);
    assert.equal(
      isListedTodaySpecial(fest, new Date("2026-10-23T23:00:00.000Z")),
      false,
    );
  });

  it("still allows participatory sports one-offs on Today’s specials", () => {
    assert.equal(
      isListedTodaySpecial(
        {
          date: "2026-10-23",
          time: "8:00 PM",
          category: "sports",
        },
        fridayAfternoon,
      ),
      true,
    );
  });
});

describe("until / hasta close times", () => {
  const voyvoy = {
    date: "2026-11-28",
    time: "Until 3:00 AM",
    category: "parties" as const,
  };
  /** Sat 28 Nov 2026, 10:03 AM America/Santo_Domingo. */
  const midMorning = new Date("2026-11-28T14:03:00.000Z");
  /** Sat 28 Nov 2026, 11:00 PM America/Santo_Domingo. */
  const lateNight = new Date("2026-11-29T03:00:00.000Z");
  /** Sun 29 Nov 2026, 3:15 AM America/Santo_Domingo. */
  const afterClose = new Date("2026-11-29T07:15:00.000Z");

  it("parses Until 3:00 AM as overnight from evening doors, not a 3 AM start", () => {
    assert.deepEqual(parseEventTimeWindow("Until 3:00 AM"), {
      start: 20 * 60,
      end: 3 * 60,
    });
    assert.deepEqual(parseEventTimeWindow("Hasta las 3:00 AM"), {
      start: 20 * 60,
      end: 3 * 60,
    });
  });

  it("does not mark a same-day Until-3AM club night ended mid-morning", () => {
    assert.equal(getEventLiveStatus(voyvoy, midMorning), "upcoming");
    assert.equal(isListedTodaySpecial(voyvoy, midMorning), true);
    assert.equal(isEndingSoon(voyvoy, midMorning), false);
  });

  it("is live late Saturday and ends after the 3 AM close", () => {
    assert.equal(getEventLiveStatus(voyvoy, lateNight), "live");
    assert.equal(isListedTodaySpecial(voyvoy, lateNight), true);
    assert.equal(getEventLiveStatus(voyvoy, afterClose), "ended");
    assert.equal(isListedTodaySpecial(voyvoy, afterClose), false);
  });
});

describe("evening single-start → overnight through 3 AM", () => {
  const club = {
    date: "2026-11-28",
    time: "9:00 PM",
    category: "parties" as const,
  };
  /** Sat 28 Nov 2026, 10:30 PM America/Santo_Domingo. */
  const tenThirty = new Date("2026-11-29T02:30:00.000Z");
  /** Sun 29 Nov 2026, 1:00 AM America/Santo_Domingo. */
  const oneAm = new Date("2026-11-29T05:00:00.000Z");
  /** Sun 29 Nov 2026, 3:15 AM America/Santo_Domingo. */
  const afterThree = new Date("2026-11-29T07:15:00.000Z");
  /** Sat 28 Nov 2026 — afternoon dinner (single start keeps 2-hour default). */
  const dinner = {
    date: "2026-11-28",
    time: "5:00 PM",
    category: "food-drinks" as const,
  };
  /** Sat 28 Nov 2026, 7:30 PM America/Santo_Domingo — past 5–7 PM default. */
  const afterDinner = new Date("2026-11-28T23:30:00.000Z");

  it("parses a 9 PM doors-only start as overnight through 3 AM", () => {
    assert.deepEqual(parseEventTimeWindow("9:00 PM"), {
      start: 21 * 60,
      end: 3 * 60,
    });
  });

  it("keeps early-evening single starts on the 2-hour default", () => {
    assert.deepEqual(parseEventTimeWindow("5:00 PM"), {
      start: 17 * 60,
      end: 19 * 60,
    });
  });

  it("does not say ends soon at 10:30 PM for a 9 PM club night", () => {
    assert.equal(isEndingSoon(club, tenThirty), false);
    assert.equal(getEventLiveStatus(club, tenThirty), "live");
    assert.equal(isListedTodaySpecial(club, tenThirty), true);
  });

  it("keeps the club night on specials at 1 AM the next calendar day", () => {
    assert.equal(getEventLiveStatus(club, oneAm), "live");
    assert.equal(isListedTodaySpecial(club, oneAm), true);
  });

  it("drops the club night after the 3 AM assumed close", () => {
    assert.equal(getEventLiveStatus(club, afterThree), "ended");
    assert.equal(isListedTodaySpecial(club, afterThree), false);
  });

  it("still honors explicit end clocks (9 PM – 11 PM)", () => {
    const short = { ...club, time: "9:00 PM - 11:00 PM" };
    assert.equal(isEndingSoon(short, tenThirty), true);
    assert.equal(isListedTodaySpecial(short, tenThirty), false);
  });

  it("still ends a 5 PM dinner after its 2-hour default", () => {
    assert.equal(getEventLiveStatus(dinner, afterDinner), "ended");
    assert.equal(isListedTodaySpecial(dinner, afterDinner), false);
  });
});
