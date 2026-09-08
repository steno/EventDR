import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  getComingUpHighlightEvents,
  getNewHighlightEvents,
  getTodayHighlightEvents,
  seededShuffle,
} from "./home-layout";
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

describe("getComingUpHighlightEvents", () => {
  it("keeps future one-offs and skips recurring / today", () => {
    const todayShow = event({
      id: "today-show",
      title: "Tonight",
      date: "2026-08-25",
      time: "9:00 PM",
    });
    const recurring = event({
      id: "daily-dining",
      title: "Daily Dining",
      date: "2026-08-26",
      time: "6:00 PM",
      recurrence: "daily",
    });
    const soon = event({
      id: "soon-concert",
      title: "Soon Concert",
      date: "2026-08-28",
      time: "8:00 PM",
      category: "concert",
      trending: true,
      venueSlug: "venue-a",
    });
    const later = event({
      id: "later-fest",
      title: "Later Fest",
      date: "2026-09-10",
      time: "4:00 PM",
      category: "festivals",
      venueSlug: "venue-b",
    });
    const beyond = event({
      id: "far-away",
      title: "Far Away",
      date: "2026-12-01",
      time: "8:00 PM",
      venueSlug: "venue-c",
    });

    const ids = getComingUpHighlightEvents(
      [beyond, later, recurring, todayShow, soon],
      { now: AFTERNOON, horizonDays: 42 },
    ).map((e) => e.id);

    assert.deepEqual(ids, ["soon-concert", "later-fest"]);
  });

  it("prefers a trending concert further out over a nearer low-signal one-off", () => {
    const patronales = event({
      id: "small-patronales",
      title: "Local Patronales",
      date: "2026-09-16",
      time: "All day",
      category: "culture",
    });
    const urban = event({
      id: "super-mega-urban-fest-2026-11-04",
      title: "Super Mega Urban Fest",
      date: "2026-11-04",
      time: "From 3:00 PM",
      category: "concert",
      categories: ["music", "festivals"],
      trending: true,
      ticketUrl: "https://www.ticket.com.do/",
      imageUrl: "/events/urban.jpg",
      venueSlug: "anfiteatro-la-puntilla",
    });
    const ids = getComingUpHighlightEvents([patronales, urban], {
      now: new Date("2026-09-08T03:30:00.000Z"),
      horizonDays: 90,
      limit: 1,
    }).map((e) => e.id);
    assert.equal(ids[0], "super-mega-urban-fest-2026-11-04");
  });

  it("excludes ids already shown elsewhere", () => {
    const a = event({
      id: "a",
      title: "A",
      date: "2026-08-28",
      time: "8:00 PM",
    });
    const b = event({
      id: "b",
      title: "B",
      date: "2026-08-29",
      time: "9:00 PM",
    });

    const ids = getComingUpHighlightEvents([a, b], {
      now: AFTERNOON,
      excludeIds: ["a"],
    }).map((e) => e.id);

    assert.deepEqual(ids, ["b"]);
  });
});

describe("getNewHighlightEvents", () => {
  it("orders by createdAt newest first and skips missing timestamps", () => {
    const older = event({
      id: "older",
      title: "Older Add",
      date: "2026-08-28",
      time: "8:00 PM",
      createdAt: "2026-08-20T12:00:00.000Z",
      venueSlug: "venue-a",
    });
    const newer = event({
      id: "newer",
      title: "Newer Add",
      date: "2026-08-29",
      time: "9:00 PM",
      createdAt: "2026-08-24T12:00:00.000Z",
      venueSlug: "venue-b",
    });
    const seedOnly = event({
      id: "seed",
      title: "Seed Fallback",
      date: "2026-08-30",
      time: "7:00 PM",
      venueSlug: "venue-c",
    });

    const ids = getNewHighlightEvents([seedOnly, older, newer], {
      now: AFTERNOON,
    }).map((e) => e.id);

    assert.deepEqual(ids, ["newer", "older"]);
  });

  it("drops listings older than maxAgeDays", () => {
    const stale = event({
      id: "stale",
      title: "Stale",
      date: "2026-09-01",
      time: "8:00 PM",
      createdAt: "2026-07-01T12:00:00.000Z",
    });
    const fresh = event({
      id: "fresh",
      title: "Fresh",
      date: "2026-09-01",
      time: "9:00 PM",
      createdAt: "2026-08-20T12:00:00.000Z",
    });

    const ids = getNewHighlightEvents([stale, fresh], {
      now: AFTERNOON,
      maxAgeDays: 14,
    }).map((e) => e.id);

    assert.deepEqual(ids, ["fresh"]);
  });

  it("excludes ids already shown elsewhere", () => {
    const a = event({
      id: "a",
      title: "A",
      date: "2026-08-28",
      time: "8:00 PM",
      createdAt: "2026-08-24T12:00:00.000Z",
    });
    const b = event({
      id: "b",
      title: "B",
      date: "2026-08-28",
      time: "9:00 PM",
      createdAt: "2026-08-23T12:00:00.000Z",
    });

    const ids = getNewHighlightEvents([a, b], {
      now: AFTERNOON,
      excludeIds: ["a"],
    }).map((e) => e.id);

    assert.deepEqual(ids, ["b"]);
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

  it("does not treat a temporarily closed daily as live", () => {
    const closed = event({
      id: "teleferico",
      title: "Teleférico Puerto Plata",
      date: "2026-08-25",
      time: "8:30 AM - 5:00 PM",
      recurrence: "daily",
      temporarilyClosed: true,
      venue: "Teleférico Puerto Plata",
      venueSlug: "teleferico-puerto-plata",
    });
    const ids = getTodayHighlightEvents([closed, liveA], {
      now: AFTERNOON,
      shuffleSeed: "closed-check",
    }).map((e) => e.id);
    assert.equal(ids[0], "live-a");
  });

  it("pins tonight’s trending one-off ahead of live evergreen dailies", () => {
    const tonight = event({
      id: "tonight-play",
      title: "Civic Play Tonight",
      date: "2026-08-25",
      time: "7:30 PM",
      category: "culture",
      categories: ["performances"],
      trending: true,
      venueSlug: "plaza-independencia",
      imageUrl: "/events/play.jpg",
    });
    const dailyMuseum = event({
      id: "museum-daily",
      title: "Museum Hours",
      date: "2026-08-25",
      time: "9:00 AM – 5:00 PM",
      recurrence: "daily",
      venueSlug: "museo-ambar",
      imageUrl: "/events/museum.jpg",
    });
    const dailyTour = event({
      id: "tour-daily",
      title: "Adventure Tour",
      date: "2026-08-25",
      time: "8:00 AM – 4:00 PM",
      recurrence: "daily",
      category: "adventure",
      venueSlug: "damajagua",
      imageUrl: "/events/tour.jpg",
    });

    const ids = getTodayHighlightEvents([dailyTour, dailyMuseum, tonight], {
      now: AFTERNOON,
      shuffleSeed: "one-off-pin",
    }).map((e) => e.id);

    assert.equal(ids[0], "tonight-play");
  });
});
