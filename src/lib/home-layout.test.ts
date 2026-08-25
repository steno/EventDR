import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { getTodayHighlightEvents, seededShuffle } from "./home-layout";
import type { Event } from "./types";

/** Tuesday Aug 25, 2026 14:00 America/Santo_Domingo (UTC−4). */
const AFTERNOON = new Date("2026-08-25T18:00:00.000Z");

function event(
  partial: Partial<Event> & Pick<Event, "id" | "title" | "date" | "time">,
): Event {
  return {
    description: "",
    location: "Puerto Plata",
    category: "culture",
    format: "physical",
    ...partial,
  };
}

describe("seededShuffle", () => {
  it("is deterministic for the same seed", () => {
    const items = ["a", "b", "c", "d", "e"];
    assert.deepEqual(seededShuffle(items, 42), seededShuffle(items, 42));
    assert.notDeepEqual(seededShuffle(items, 1), seededShuffle(items, 2));
  });
});

describe("getTodayHighlightEvents peer shuffle", () => {
  const liveA = event({
    id: "live-a",
    title: "Live A",
    date: "2026-08-25",
    time: "10:00 AM – 6:00 PM",
    venue: "Venue A",
    venueSlug: "venue-a",
  });
  const liveB = event({
    id: "live-b",
    title: "Live B",
    date: "2026-08-25",
    time: "11:00 AM – 7:00 PM",
    venue: "Venue B",
    venueSlug: "venue-b",
  });
  const liveC = event({
    id: "live-c",
    title: "Live C",
    date: "2026-08-25",
    time: "12:00 PM – 8:00 PM",
    venue: "Venue C",
    venueSlug: "venue-c",
  });
  const upcoming = event({
    id: "upcoming-show",
    title: "Upcoming Show",
    date: "2026-08-25",
    time: "9:00 PM – 11:00 PM",
    venue: "Venue D",
    venueSlug: "venue-d",
  });

  it("keeps the same order for a given shuffle seed", () => {
    const catalog = [liveA, liveB, liveC, upcoming];
    const first = getTodayHighlightEvents(catalog, {
      now: AFTERNOON,
      shuffleSeed: "visit-a",
    }).map((e) => e.id);
    const second = getTodayHighlightEvents(catalog, {
      now: AFTERNOON,
      shuffleSeed: "visit-a",
    }).map((e) => e.id);
    assert.deepEqual(first, second);
  });

  it("can rotate live peers across different seeds", () => {
    const catalog = [liveA, liveB, liveC];
    const orders = new Set(
      ["seed-1", "seed-2", "seed-3", "seed-4", "seed-5"].map((seed) =>
        getTodayHighlightEvents(catalog, {
          now: AFTERNOON,
          shuffleSeed: seed,
        })
          .map((e) => e.id)
          .join(","),
      ),
    );
    assert.ok(orders.size > 1, "expected at least two distinct live orders");
  });

  it("never lets upcoming outrank live peers", () => {
    const ids = getTodayHighlightEvents([upcoming, liveA, liveB], {
      now: AFTERNOON,
      shuffleSeed: "tier-check",
    }).map((e) => e.id);
    const liveIndexes = [ids.indexOf("live-a"), ids.indexOf("live-b")];
    const upcomingIndex = ids.indexOf("upcoming-show");
    assert.ok(Math.max(...liveIndexes) < upcomingIndex);
  });

  it("keeps ending-soon out of the live shuffle pool", () => {
    /** 5:30 PM AST — within 60m of a 6:00 PM close. */
    const nearClose = new Date("2026-08-25T21:30:00.000Z");
    const ending = event({
      id: "ending-soon",
      title: "Ending Soon",
      date: "2026-08-25",
      time: "10:00 AM – 6:00 PM",
      venue: "Closing Venue",
      venueSlug: "closing-venue",
    });
    const stillLive = event({
      id: "still-live",
      title: "Still Live",
      date: "2026-08-25",
      time: "10:00 AM – 10:00 PM",
      venue: "Open Venue",
      venueSlug: "open-venue",
    });

    // General live ranks before endingSoon; ending must not jump into the
    // shuffled live run.
    const ids = getTodayHighlightEvents([ending, stillLive], {
      now: nearClose,
      shuffleSeed: "ending-check",
    }).map((e) => e.id);
    assert.deepEqual(ids, ["still-live", "ending-soon"]);
  });
});
