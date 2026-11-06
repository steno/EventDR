import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  eventsInAllBrowseOrder,
  eventsInCalendarOrder,
  eventsInWeekendOrder,
  weekendHeadingDate,
} from "./list-day-groups";

describe("eventsInCalendarOrder", () => {
  it("groups a weekend list Friday then Saturday then Sunday", () => {
    const ordered = eventsInCalendarOrder([
      { id: "sun", date: "2026-10-04" },
      { id: "fri-b", date: "2026-10-02" },
      { id: "sat", date: "2026-10-03" },
      { id: "fri-a", date: "2026-10-02" },
    ]);
    assert.deepEqual(
      ordered.map((item) => item.id),
      ["fri-b", "fri-a", "sat", "sun"],
    );
  });
});

describe("eventsInWeekendOrder", () => {
  // Wednesday → look-ahead weekend Fri 2 Oct – Sun 4 Oct 2026.
  const wednesday = new Date("2026-09-30T16:00:00-04:00");

  it("keeps an already-running event from renaming the weekend", () => {
    const ordered = eventsInWeekendOrder(
      [
        { id: "old", date: "2026-09-18" },
        { id: "sat", date: "2026-10-03" },
        { id: "fri", date: "2026-10-02" },
      ],
      wednesday,
    );
    assert.deepEqual(
      ordered.map((item) => item.id),
      ["fri", "old", "sat"],
    );
    assert.equal(
      weekendHeadingDate({ date: "2026-09-18" }, wednesday),
      "2026-10-02",
    );
  });
});

describe("eventsInAllBrowseOrder", () => {
  it("puts dated nights in calendar order before weekly and daily", () => {
    const ordered = eventsInAllBrowseOrder([
      { id: "daily", date: "2026-11-05", recurrence: "daily" },
      { id: "sat", date: "2026-11-07" },
      { id: "weekly", date: "2026-11-06", recurrence: "weekly" },
      { id: "fri-b", date: "2026-11-06" },
      { id: "fri-a", date: "2026-11-06" },
    ]);
    assert.deepEqual(
      ordered.map((item) => item.id),
      ["fri-b", "fri-a", "sat", "daily", "weekly"],
    );
  });

  it("keeps relative order inside a day and inside the recurring block", () => {
    const ordered = eventsInAllBrowseOrder([
      { id: "week-live", date: "2026-11-05", recurrence: "weekends" },
      { id: "week-later", date: "2026-11-05", recurrence: "weekly" },
      { id: "today-b", date: "2026-11-05" },
      { id: "today-a", date: "2026-11-05" },
    ]);
    assert.deepEqual(
      ordered.map((item) => item.id),
      ["today-b", "today-a", "week-live", "week-later"],
    );
  });
});
