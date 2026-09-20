import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { sortEventsForWeekendDigest } from "./partner-digest";
import type { Event } from "./types";

/** Friday afternoon AST — weekend fixtures are still “future”. */
const FRIDAY = new Date("2026-07-31T18:00:00.000Z");

function event(partial: Partial<Event> & Pick<Event, "id" | "title" | "date">): Event {
  return {
    description: "",
    location: "Puerto Plata",
    category: "culture",
    format: "physical",
    ...partial,
  };
}

describe("sortEventsForWeekendDigest", () => {
  it("ranks one-off concerts before evergreen daily hours", () => {
    const museum = event({
      id: "museum-daily",
      title: "Museum Hours",
      date: "2026-08-01",
      time: "9:00 AM – 5:00 PM",
      recurrence: "daily",
      trending: true,
    });
    const concert = event({
      id: "saturday-concert",
      title: "Saturday Concert",
      date: "2026-08-01",
      time: "8:00 PM",
    });

    const sorted = sortEventsForWeekendDigest([museum, concert], FRIDAY);
    assert.equal(sorted.map((e) => e.id).join(","), "saturday-concert,museum-daily");
  });

  it("ranks a Sunday one-off before a Saturday daily even when the daily is earlier", () => {
    const saturdayDaily = event({
      id: "beach-daily",
      title: "Beach Club Daily",
      date: "2026-08-01",
      time: "10:00 AM – 6:00 PM",
      recurrence: "daily",
    });
    const sundayShow = event({
      id: "sunday-show",
      title: "Sunday Show",
      date: "2026-08-02",
      time: "7:00 PM",
    });

    const sorted = sortEventsForWeekendDigest([saturdayDaily, sundayShow], FRIDAY);
    assert.equal(sorted.map((e) => e.id).join(","), "sunday-show,beach-daily");
  });
});
