import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  browseDayHeadingDate,
  defaultOpenWeekendDay,
  eventsInAllBrowseOrder,
  eventsInCalendarOrder,
  eventsInWeekendOrder,
  splitAllBrowseSections,
  splitWeekendDayGroups,
  weekendHeadingDate,
} from "./list-day-groups";

describe("browseDayHeadingDate", () => {
  // Saturday 7 Nov 2026 morning AST
  const saturday = new Date("2026-11-07T10:00:00-04:00");

  it("moves an ongoing multi-day festival onto today", () => {
    assert.equal(
      browseDayHeadingDate(
        {
          date: "2026-11-06",
          endDate: "2026-11-09",
          time: "See event schedule",
        },
        saturday,
      ),
      "2026-11-07",
    );
  });

  it("keeps a same-day night on its start date", () => {
    assert.equal(
      browseDayHeadingDate({ date: "2026-11-07", time: "10:00 PM" }, saturday),
      "2026-11-07",
    );
  });

  it("keeps overnight spillover on the session start day", () => {
    assert.equal(
      browseDayHeadingDate(
        {
          date: "2026-11-06",
          endDate: "2026-11-07",
          time: "10:00 PM - 4:00 AM",
        },
        saturday,
      ),
      "2026-11-06",
    );
  });

  it("keeps a finished multi-day under its start date", () => {
    assert.equal(
      browseDayHeadingDate(
        {
          date: "2026-11-01",
          endDate: "2026-11-03",
          time: "See event schedule",
        },
        saturday,
      ),
      "2026-11-01",
    );
  });
});

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

  it("buckets an ongoing multi-day under today with that day's one-offs", () => {
    const saturday = new Date("2026-11-07T10:00:00-04:00");
    const ordered = eventsInCalendarOrder(
      [
        {
          id: "masters",
          date: "2026-11-06",
          endDate: "2026-11-09",
          time: "See event schedule",
        },
        { id: "sat-a", date: "2026-11-07" },
        { id: "fri-only", date: "2026-11-06" },
      ],
      saturday,
    );
    assert.deepEqual(
      ordered.map((item) => item.id),
      ["fri-only", "masters", "sat-a"],
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

  it("moves a Fri–Mon festival onto Saturday once Saturday arrives", () => {
    const saturday = new Date("2026-11-07T10:00:00-04:00");
    const ordered = eventsInWeekendOrder(
      [
        {
          id: "masters",
          date: "2026-11-06",
          endDate: "2026-11-09",
          time: "See event schedule",
        },
        { id: "sat", date: "2026-11-07" },
        { id: "fri-party", date: "2026-11-06" },
      ],
      saturday,
    );
    assert.deepEqual(
      ordered.map((item) => item.id),
      ["fri-party", "masters", "sat"],
    );
    assert.equal(
      weekendHeadingDate(
        {
          date: "2026-11-06",
          endDate: "2026-11-09",
          time: "See event schedule",
        },
        saturday,
      ),
      "2026-11-07",
    );
  });
});

describe("splitWeekendDayGroups", () => {
  const wednesday = new Date("2026-09-30T16:00:00-04:00");

  it("splits Fri then Sat with continuing on Friday", () => {
    const groups = splitWeekendDayGroups(
      [
        { id: "old", date: "2026-09-18" },
        { id: "sat", date: "2026-10-03" },
        { id: "fri", date: "2026-10-02" },
      ],
      wednesday,
    );
    assert.deepEqual(
      groups.map((group) => ({
        date: group.date,
        ids: group.events.map((event) => event.id),
      })),
      [
        { date: "2026-10-02", ids: ["fri", "old"] },
        { date: "2026-10-03", ids: ["sat"] },
      ],
    );
  });
});

describe("defaultOpenWeekendDay", () => {
  it("opens Friday when Mon–Thu look ahead", () => {
    const wednesday = new Date("2026-09-30T16:00:00-04:00");
    assert.equal(defaultOpenWeekendDay(wednesday), "2026-10-02");
  });

  it("opens today on Saturday", () => {
    const saturday = new Date("2026-11-07T10:00:00-04:00");
    assert.equal(defaultOpenWeekendDay(saturday), "2026-11-07");
  });

  it("opens today on Sunday", () => {
    const sunday = new Date("2026-11-08T10:00:00-04:00");
    assert.equal(defaultOpenWeekendDay(sunday), "2026-11-08");
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

describe("splitAllBrowseSections", () => {
  it("buckets dated nights by browse day and keeps the recurring tail", () => {
    const ordered = eventsInAllBrowseOrder([
      { id: "daily", date: "2026-11-05", recurrence: "daily" },
      { id: "sat", date: "2026-11-07" },
      { id: "weekly", date: "2026-11-06", recurrence: "weekly" },
      { id: "fri-b", date: "2026-11-06" },
      { id: "fri-a", date: "2026-11-06" },
    ]);
    const { days, recurring } = splitAllBrowseSections(ordered);
    assert.deepEqual(
      days.map((day) => ({
        date: day.date,
        ids: day.events.map((event) => event.id),
      })),
      [
        { date: "2026-11-06", ids: ["fri-b", "fri-a"] },
        { date: "2026-11-07", ids: ["sat"] },
      ],
    );
    assert.deepEqual(
      recurring.map((event) => event.id),
      ["daily", "weekly"],
    );
  });
});
