import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  collectHomeBootstrapEvents,
  collectHomeBootstrapVenues,
  getComingUpHighlightEvents,
  getHalloweenHighlightEvents,
  getHomeDiscoverLayout,
  getNewHighlightEvents,
  getTodayHighlightEvents,
  getTodaySpecialEvents,
  getWeekendHighlightEvents,
  HOME_NEW_LIMIT,
  HOME_TODAY_LIMIT,
  HOME_WEEKEND_LIMIT,
  isHalloweenListing,
  isHalloweenRailActive,
  seededShuffle,
} from "./home-layout";
import type { Event, Venue } from "./types";

/** Tuesday Aug 25, 2026 14:00 America/Santo_Domingo (UTC−4). */
const AFTERNOON = new Date("2026-08-25T18:00:00.000Z");

/** Friday Sep 11, 2026 15:00 AST (UTC−4). */
const FRIDAY = new Date("2026-09-11T19:00:00.000Z");

/** Sunday Oct 11, 2026 15:00 AST — Halloween rail window. */
const HALLOWEEN_SEASON = new Date("2026-10-11T19:00:00.000Z");

/** Friday Oct 30, 2026 15:00 AST — Halloween weekend inside the season. */
const HALLOWEEN_FRIDAY = new Date("2026-10-30T19:00:00.000Z");

/** Wednesday Oct 28, 2026 15:00 AST — upcoming Fri 30 / Sat 31 weekend. */
const HALLOWEEN_WEEK = new Date("2026-10-28T19:00:00.000Z");

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

  it("orders soonest first regardless of spotlight signals", () => {
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
    const ids = getComingUpHighlightEvents([urban, patronales], {
      now: new Date("2026-09-08T03:30:00.000Z"),
      horizonDays: 90,
    }).map((e) => e.id);
    assert.deepEqual(ids, [
      "small-patronales",
      "super-mega-urban-fest-2026-11-04",
    ]);
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

  it("ties on createdAt by id, not localized title", () => {
    const stamp = "2026-08-24T12:00:00.000Z";
    const hardRockEn = event({
      id: "hard-rock-descubre",
      title: "Hard Rock Host Day — Descubre Sosúa",
      date: "2026-08-28",
      time: "9:30 AM",
      createdAt: stamp,
      imageUrl: "/events/a.jpg",
      venueSlug: "hard-rock",
    });
    const trolleyEn = event({
      id: "trolley-descubre",
      title: "Descubre Sosúa en Grande — Trolley",
      date: "2026-08-28",
      time: "4:00 PM",
      createdAt: stamp,
      imageUrl: "/events/b.jpg",
      venueSlug: "trolley",
    });
    const hardRockEs = event({
      ...hardRockEn,
      title: "Anfitriones en Hard Rock — Descubre Sosúa",
    });
    const trolleyEs = event({
      ...trolleyEn,
      title: "Descubre Sosúa en Grande — Trolley",
    });

    const enIds = getNewHighlightEvents([trolleyEn, hardRockEn], {
      now: AFTERNOON,
    }).map((e) => e.id);
    const esIds = getNewHighlightEvents([trolleyEs, hardRockEs], {
      now: AFTERNOON,
    }).map((e) => e.id);

    assert.deepEqual(enIds, ["hard-rock-descubre", "trolley-descubre"]);
    assert.deepEqual(esIds, enIds);
  });
});

describe("getTodayHighlightEvents today-page preference", () => {
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

  it("keeps the today-page order regardless of shuffle seed", () => {
    const catalog = [liveC, upcoming, liveA, liveB];
    const orders = ["seed-1", "seed-2", "visit-a"].map((seed) =>
      getTodayHighlightEvents(catalog, {
        now: AFTERNOON,
        shuffleSeed: seed,
      })
        .map((e) => e.id)
        .join(","),
    );
    assert.deepEqual(orders, [
      "live-a,live-b,live-c,upcoming-show",
      "live-a,live-b,live-c,upcoming-show",
      "live-a,live-b,live-c,upcoming-show",
    ]);
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

    // General live ranks before endingSoon, same as the today page.
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

  it("drops Flip Flop amenity recurrings from Happening today", () => {
    const wings = event({
      id: "flip-flop-wing-wednesday",
      title: "Flip Flop Wing Wednesday",
      date: "2026-08-25",
      time: "8:00 AM – 10:00 PM",
      recurrence: "weekly",
      recurrenceDay: 3,
      venueSlug: "flip-flop-sports-bar-sosua",
      imageUrl: "/events/wings.jpg",
    });
    const tonight = event({
      id: "tonight-live",
      title: "Named Live Set",
      date: "2026-08-25",
      time: "8:00 PM",
      venueSlug: "aura",
      imageUrl: "/events/live.jpg",
    });

    const ids = getTodayHighlightEvents([wings, tonight], {
      now: AFTERNOON,
      shuffleSeed: "no-flip-flop",
    }).map((e) => e.id);

    assert.deepEqual(ids, ["tonight-live"]);
  });

  it("keeps newer one-offs above older peers and weeklies", () => {
    const older = event({
      id: "older-one-off",
      title: "Older One-off",
      date: "2026-08-20",
      endDate: "2026-08-25",
      time: "10:00 AM – 6:00 PM",
      trending: true,
      createdAt: "2026-08-01T12:00:00.000Z",
      venueSlug: "venue-old",
    });
    const newer = event({
      id: "newer-one-off",
      title: "Newer One-off",
      date: "2026-08-20",
      endDate: "2026-08-25",
      time: "11:00 AM – 7:00 PM",
      trending: true,
      createdAt: "2026-08-25T12:00:00.000Z",
      venueSlug: "venue-new",
    });
    const weekly = event({
      id: "weekly-night",
      title: "Weekly Night",
      date: "2026-08-25",
      time: "8:00 PM",
      recurrence: "weekly",
      recurrenceDay: 2,
      venueSlug: "venue-weekly",
    });

    const catalog = [weekly, older, newer];
    const ids = getTodayHighlightEvents(catalog, {
      now: AFTERNOON,
      shuffleSeed: "fresh-one-offs",
      excludeTodaySpecials: true,
    }).map((e) => e.id);

    assert.deepEqual(ids, ["newer-one-off", "older-one-off", "weekly-night"]);

    const orders = ["seed-a", "seed-b", "seed-c"].map((seed) =>
      getTodayHighlightEvents(catalog, {
        now: AFTERNOON,
        shuffleSeed: seed,
        excludeTodaySpecials: true,
      })
        .map((e) => e.id)
        .join(","),
    );
    assert.deepEqual(orders, [ids.join(","), ids.join(","), ids.join(",")]);
  });
});

describe("getWeekendHighlightEvents", () => {
  it("keeps Fri–Sun one-offs only — skips recurring weekend series", () => {
    const fridayShow = event({
      id: "friday-show",
      title: "Friday Show",
      date: "2026-09-11",
      time: "9:00 PM",
      venueSlug: "venue-a",
    });
    const saturdayMarket = event({
      id: "saturday-market",
      title: "Saturday Market",
      date: "2026-09-12",
      time: "9:00 AM",
      venueSlug: "venue-b",
    });
    const tuesdayOnly = event({
      id: "tuesday-karaoke",
      title: "Tuesday Karaoke",
      date: "2026-09-08",
      time: "8:00 PM",
      recurrence: "weekly",
      recurrenceDay: 2,
      venueSlug: "venue-c",
    });
    const weekendNights = event({
      id: "weekend-dj",
      title: "Weekend DJ",
      date: "2026-09-12",
      time: "10:00 PM",
      recurrence: "weekends",
      venueSlug: "venue-d",
    });
    const weeklyFriday = event({
      id: "lax-reggae-friday",
      title: "Reggae Friday",
      date: "2026-09-11",
      time: "6:00 PM",
      recurrence: "weekly",
      recurrenceDay: 5,
      venueSlug: "lax-cabarete",
    });

    const ids = getWeekendHighlightEvents(
      [tuesdayOnly, weekendNights, saturdayMarket, fridayShow, weeklyFriday],
      { now: FRIDAY, shuffleSeed: "weekend-basic" },
    ).map((e) => e.id);

    assert.ok(ids.includes("friday-show"));
    assert.ok(ids.includes("saturday-market"));
    assert.ok(!ids.includes("weekend-dj"));
    assert.ok(!ids.includes("lax-reggae-friday"));
    assert.ok(!ids.includes("tuesday-karaoke"));
  });

  it("honors excludeIds so today’s carousel is not repeated", () => {
    const fridayShow = event({
      id: "friday-show",
      title: "Friday Show",
      date: "2026-09-11",
      time: "9:00 PM",
      venueSlug: "venue-a",
    });
    const saturdayMarket = event({
      id: "saturday-market",
      title: "Saturday Market",
      date: "2026-09-12",
      time: "9:00 AM",
      venueSlug: "venue-b",
    });

    const ids = getWeekendHighlightEvents([fridayShow, saturdayMarket], {
      now: FRIDAY,
      excludeIds: ["friday-show"],
      shuffleSeed: "weekend-exclude",
    }).map((e) => e.id);

    assert.deepEqual(ids, ["saturday-market"]);
  });
});

describe("Halloween seasonal rail", () => {
  it("matches costume nights by id/title without Halloween-weekend boxing copy", () => {
    assert.equal(
      isHalloweenListing(
        event({
          id: "aura-halloween-party-2026-10-31",
          title: "Halloween — The Nightmare Lineup at Aura",
          date: "2026-10-31",
          time: "from 8:00 PM",
        }),
      ),
      true,
    );
    assert.equal(
      isHalloweenListing(
        event({
          id: "twenty-disco-paradise-in-hell-2026-10-31",
          title: "Twenty Disco — Paradise In Hell",
          date: "2026-10-31",
          time: "10:00 PM",
        }),
      ),
      true,
    );
    assert.equal(
      isHalloweenListing(
        event({
          id: "rumble-in-paradise-13",
          title: "Rumble in Paradise 13 — Boxing",
          date: "2026-10-31",
          time: "4:00 PM",
          description:
            "Halloween-weekend professional boxing on Sosúa Beach.",
        }),
      ),
      false,
    );
  });

  it("is active inside the Oct 11–Nov 1 window only", () => {
    assert.equal(isHalloweenRailActive(HALLOWEEN_SEASON), true);
    assert.equal(isHalloweenRailActive(HALLOWEEN_FRIDAY), true);
    assert.equal(isHalloweenRailActive(FRIDAY), false);
    assert.equal(
      isHalloweenRailActive(new Date("2026-11-02T16:00:00.000Z")),
      false,
    );
  });

  it("returns soonest Halloween listings while the rail is live", () => {
    const kids = event({
      id: "rancho-catalina-halloween-trick-or-treat-2026-10-23",
      title: "Rancho La Catalina Halloween Trick or Treat",
      date: "2026-10-23",
      time: "5:00 PM",
      venueSlug: "rancho-catalina-puerto-plata",
    });
    const party = event({
      id: "aura-halloween-party-2026-10-31",
      title: "Halloween — The Nightmare Lineup at Aura",
      date: "2026-10-31",
      time: "from 8:00 PM",
      venueSlug: "aura-beach-club",
    });
    const ids = getHalloweenHighlightEvents([party, kids], {
      now: HALLOWEEN_SEASON,
    }).map((e) => e.id);
    assert.deepEqual(ids, [
      "rancho-catalina-halloween-trick-or-treat-2026-10-23",
      "aura-halloween-party-2026-10-31",
    ]);
    assert.deepEqual(
      getHalloweenHighlightEvents([party, kids], { now: FRIDAY }),
      [],
    );
  });

  it("keeps Halloween out of Weekend while the seasonal rail is live", () => {
    // Midweek of Halloween week so Fri/Sat one-offs are “this weekend”, not Today.
    const halloweenFri = event({
      id: "disco-club-halloween-2026-10-30",
      title: "Latin Disco Club — Halloween Night Party",
      date: "2026-10-30",
      time: "10:00 PM",
      venueSlug: "disco-club-brugal",
    });
    const otherSat = event({
      id: "saturday-concert",
      title: "Saturday Concert",
      date: "2026-10-31",
      time: "8:00 PM",
      category: "concert",
      venueSlug: "anfiteatro-la-puntilla",
    });

    const layout = getHomeDiscoverLayout([halloweenFri, otherSat], {
      now: HALLOWEEN_WEEK,
      shuffleSeed: "layout-halloween",
    });

    assert.ok(
      layout.halloweenEvents.some((e) => e.id === halloweenFri.id),
      "Halloween party should lead the seasonal rail",
    );
    assert.ok(
      !layout.weekendEvents.some((e) => e.id === halloweenFri.id),
      "Halloween must not also sit in This weekend while the rail is live",
    );
    assert.ok(
      layout.weekendEvents.some((e) => e.id === otherSat.id),
      "non-Halloween weekend one-offs still fill This weekend",
    );
  });
});

describe("getHomeDiscoverLayout weekend rail", () => {
  it("places weekend after today and skips today’s visible ids", () => {
    const fridayNight = event({
      id: "lax-reggae-friday",
      title: "Reggae Friday",
      date: "2026-09-11",
      time: "6:00 PM – 10:00 PM",
      recurrence: "weekly",
      recurrenceDay: 5,
      venueSlug: "lax-cabarete",
      imageUrl: "/events/lax.jpg",
    });
    const saturdayConcert = event({
      id: "saturday-concert",
      title: "Saturday Concert",
      date: "2026-09-12",
      time: "8:00 PM",
      category: "concert",
      venueSlug: "anfiteatro-la-puntilla",
      imageUrl: "/events/concert.jpg",
    });
    const laterFest = event({
      id: "later-fest",
      title: "Later Fest",
      date: "2026-09-20",
      time: "4:00 PM",
      category: "festivals",
      venueSlug: "venue-fest",
    });

    const layout = getHomeDiscoverLayout(
      [laterFest, saturdayConcert, fridayNight],
      { now: FRIDAY, shuffleSeed: "layout-weekend" },
    );

    assert.ok(
      layout.todayEvents.some((e) => e.id === "lax-reggae-friday"),
      "Friday series belongs in Happening today",
    );
    assert.ok(
      !layout.weekendEvents
        .slice(0, HOME_WEEKEND_LIMIT)
        .some((e) => e.id === "lax-reggae-friday"),
      "today’s visible Friday night should not repeat in This weekend",
    );
    assert.ok(
      layout.weekendEvents.some((e) => e.id === "saturday-concert"),
      "Saturday should surface in This weekend",
    );
    assert.ok(
      !layout.comingUpEvents.some((e) => e.id === "saturday-concert"),
      "weekend head should not also lead Coming up",
    );
    assert.ok(
      layout.comingUpEvents.some((e) => e.id === "later-fest"),
      "further-out one-offs stay in Coming up",
    );
  });
});

describe("getHomeDiscoverLayout same-day seed", () => {
  it("puts tonight’s new one-off on Today’s specials and Recently added", () => {
    const tonight = event({
      id: "todos-somos-luperon-2026-09-08",
      title: "Todos Somos Luperón",
      date: "2026-09-08",
      time: "7:30 PM",
      category: "culture",
      categories: ["performances"],
      trending: true,
      createdAt: "2026-09-08T12:00:00.000Z",
      venueSlug: "plaza-independencia",
      imageUrl: "/events/todos-somos-luperon-2026-09-08.jpg",
    });
    const daily = event({
      id: "museum-daily",
      title: "Museum Hours",
      date: "2026-09-08",
      time: "9:00 AM – 5:00 PM",
      recurrence: "daily",
      venueSlug: "museo-ambar",
      imageUrl: "/events/museum.jpg",
    });
    const olderNew = event({
      id: "older-new",
      title: "Older New",
      date: "2026-09-12",
      time: "8:00 PM",
      createdAt: "2026-09-07T12:00:00.000Z",
      venueSlug: "cigar-town-pop",
      imageUrl: "/events/older.jpg",
    });

    const layout = getHomeDiscoverLayout([daily, olderNew, tonight], {
      now: new Date("2026-09-08T16:00:00.000Z"),
      shuffleSeed: "layout-same-day",
    });

    assert.equal(
      layout.specialEvents.slice(0, HOME_TODAY_LIMIT)[0]?.id,
      "todos-somos-luperon-2026-09-08",
    );
    assert.ok(
      !layout.todayEvents.some((e) => e.id === "todos-somos-luperon-2026-09-08"),
      "one-off should leave Happening today",
    );
    assert.equal(layout.todayEvents[0]?.id, "museum-daily");
    assert.equal(layout.heroExcludeIds.length, 0);
    assert.equal(
      layout.newEvents.slice(0, HOME_NEW_LIMIT)[0]?.id,
      "todos-somos-luperon-2026-09-08",
    );
  });

  it("shuffles every Today’s special by seed (display cap is HOME_SPECIALS_LIMIT)", () => {
    const older = event({
      id: "older-special",
      title: "Older Special",
      date: "2026-09-19",
      time: "7:00 PM",
      trending: true,
      createdAt: "2026-09-10T12:00:00.000Z",
      venueSlug: "venue-a",
    });
    const newerLater = event({
      id: "newer-later-special",
      title: "Newer Later Special",
      date: "2026-09-19",
      time: "8:00 PM",
      trending: true,
      createdAt: "2026-09-19T12:00:00.000Z",
      venueSlug: "venue-b",
    });
    const extras = Array.from({ length: 7 }, (_, i) =>
      event({
        id: `extra-special-${i}`,
        title: `Extra ${i}`,
        date: "2026-09-19",
        time: "6:00 PM",
        trending: true,
        createdAt: `2026-09-1${i}T12:00:00.000Z`,
        venueSlug: `venue-extra-${i}`,
      }),
    );
    const pool = [older, ...extras, newerLater];
    const now = new Date("2026-09-19T16:00:00.000Z");

    const layout = getHomeDiscoverLayout(pool, {
      now,
      shuffleSeed: "specials-fresh",
    });
    const again = getHomeDiscoverLayout(pool, {
      now,
      shuffleSeed: "specials-fresh",
    });
    const otherSeed = getHomeDiscoverLayout(pool, {
      now,
      shuffleSeed: "specials-rotate",
    });

    assert.ok(
      layout.specialEvents.length >= 9,
      "layout still returns the full specials pool for the half-hour shuffle",
    );
    assert.ok(layout.specialEvents.every((e) => e.date === "2026-09-19"));
    assert.deepEqual(
      layout.specialEvents.map((e) => e.id),
      again.specialEvents.map((e) => e.id),
      "same seed should keep the specials order stable",
    );
    assert.notDeepEqual(
      layout.specialEvents.map((e) => e.id),
      otherSeed.specialEvents.map((e) => e.id),
      "a different seed should reshuffle the full specials rail",
    );
  });

  it("can place a later-start special ahead of an earlier one", () => {
    const early = event({
      id: "early-special",
      title: "Early Special",
      date: "2026-09-19",
      time: "2:00 PM",
      venueSlug: "venue-early",
    });
    const late = event({
      id: "late-special",
      title: "Late Special",
      date: "2026-09-19",
      time: "9:00 PM",
      venueSlug: "venue-late",
    });
    const mid = event({
      id: "mid-special",
      title: "Mid Special",
      date: "2026-09-19",
      time: "6:00 PM",
      venueSlug: "venue-mid",
    });

    const ids = getTodaySpecialEvents([early, late, mid], {
      now: new Date("2026-09-19T16:00:00.000Z"),
      shuffleSeed: "full-rail-mix",
    }).map((e) => e.id);

    assert.equal(ids.length, 3);
    assert.ok(ids.includes("late-special"));
    // Full-rail shuffle — not locked to sooner-start-first.
    assert.notDeepEqual(ids, ["early-special", "mid-special", "late-special"]);
  });

  it("rotates Today’s specials on a half-hour bucket", () => {
    const pool = Array.from({ length: 8 }, (_, i) =>
      event({
        id: `half-special-${i}`,
        title: `Half ${i}`,
        date: "2026-09-19",
        time: "8:00 PM",
        venueSlug: `venue-half-${i}`,
      }),
    );
    // 16:10 / 16:25 / 16:45 AST (UTC−4)
    const early = getTodaySpecialEvents(pool, {
      now: new Date("2026-09-19T20:10:00.000Z"),
    });
    const sameHalf = getTodaySpecialEvents(pool, {
      now: new Date("2026-09-19T20:25:00.000Z"),
    });
    const nextHalf = getTodaySpecialEvents(pool, {
      now: new Date("2026-09-19T20:45:00.000Z"),
    });

    assert.deepEqual(
      early.map((e) => e.id),
      sameHalf.map((e) => e.id),
      "order should stay stable within a half-hour",
    );
    assert.notDeepEqual(
      early.map((e) => e.id),
      nextHalf.map((e) => e.id),
      "order should rotate after :30",
    );
  });

  it("keeps sports viewing off Today’s specials and on Happening today", () => {
    const watch = event({
      id: "bar-world-series",
      title: "Bar — World Series",
      date: "2026-09-19",
      time: "8:00 PM",
      category: "sports",
      categories: ["food-drinks"],
      venueSlug: "flip-flop-sports-bar-sosua",
    });
    const boxing = event({
      id: "beach-boxing",
      title: "Beach Boxing",
      date: "2026-09-19",
      time: "8:00 PM",
      category: "sports",
      venueSlug: "bar-39-sosua",
    });

    const layout = getHomeDiscoverLayout([watch, boxing], {
      now: new Date("2026-09-19T16:00:00.000Z"),
      shuffleSeed: "no-sports-viewing",
    });

    assert.deepEqual(
      layout.specialEvents.map((e) => e.id),
      ["beach-boxing"],
    );
    assert.ok(layout.todayEvents.some((e) => e.id === "bar-world-series"));
  });

  it("hides Today’s specials when only recurring nights run", () => {
    const daily = event({
      id: "museum-daily",
      title: "Museum Hours",
      date: "2026-09-08",
      time: "9:00 AM – 5:00 PM",
      recurrence: "daily",
      venueSlug: "museo-ambar",
    });
    const weekly = event({
      id: "karaoke-tue",
      title: "Karaoke",
      date: "2026-09-08",
      time: "8:00 PM",
      recurrence: "weekly",
      recurrenceDay: 2,
      venueSlug: "hard-rock-sosua",
    });

    const layout = getHomeDiscoverLayout([daily, weekly], {
      now: new Date("2026-09-08T16:00:00.000Z"),
      shuffleSeed: "no-specials",
    });

    assert.equal(layout.specialEvents.length, 0);
    assert.ok(layout.todayEvents.length >= 1);
  });

  it("moves a one-off out of Today’s specials once it is ending soon", () => {
    const show = event({
      id: "late-show",
      title: "Late Show",
      date: "2026-09-19",
      time: "2:00 PM - 6:00 PM",
    });
    const midShow = getHomeDiscoverLayout([show], {
      now: new Date("2026-09-19T19:00:00.000Z"),
    });
    assert.equal(midShow.specialEvents[0]?.id, "late-show");
    assert.equal(
      midShow.todayEvents.some((item) => item.id === "late-show"),
      false,
    );

    const endingSoon = getHomeDiscoverLayout([show], {
      now: new Date("2026-09-19T21:15:00.000Z"),
    });
    assert.equal(endingSoon.specialEvents.length, 0);
    assert.ok(endingSoon.todayEvents.some((item) => item.id === "late-show"));
  });
});

describe("getHomeDiscoverLayout hero background", () => {
  it("skips typography-heavy flyers for a day-stable scene photo", () => {
    const flyer = event({
      id: "cigar-town-noche-bohemia-2026-09-12",
      title: "Noche Bohemia",
      date: "2026-09-12",
      time: "8:00 PM",
      category: "music",
      imageUrl: "/events/cigar-town-noche-bohemia-2026-09-12.jpg",
    });
    const beach = event({
      id: "lax-sunset-daily",
      title: "Sunset Sessions",
      date: "2026-09-12",
      time: "6:00 PM",
      recurrence: "daily",
      imageUrl: "/events/lax-sunset-daily.jpg",
    });
    const street = event({
      id: "calle-sombrillas-daily",
      title: "Calle Sombrillas",
      date: "2026-09-12",
      time: "All day",
      recurrence: "daily",
      imageUrl: "/events/calle-sombrillas-umbrella-walk.jpg",
    });

    const now = new Date("2026-09-12T16:00:00.000Z");
    const layoutA = getHomeDiscoverLayout([flyer, beach, street], {
      now,
      shuffleSeed: "hero-bg",
    });
    const layoutB = getHomeDiscoverLayout([flyer, beach, street], {
      now,
      shuffleSeed: "hero-bg",
    });

    assert.ok(layoutA.heroEvent);
    assert.notEqual(
      layoutA.heroEvent?.id,
      "cigar-town-noche-bohemia-2026-09-12",
    );
    assert.equal(layoutA.heroEvent?.id, layoutB.heroEvent?.id);
  });

  it("never uses promo graphics with baked-in type as the hero", () => {
    const sancocho = event({
      id: "sancocho-sabados-pingui",
      title: "Sancocho Sábados",
      date: "2026-09-14",
      time: "12:00 PM",
      category: "food-drinks",
      imageUrl: "/events/sancocho-sabados-pingui.jpg",
    });
    const now = new Date("2026-09-14T16:00:00.000Z");
    const layout = getHomeDiscoverLayout([sancocho], {
      now,
      shuffleSeed: "hero-sancocho",
    });
    assert.equal(layout.heroEvent, null);
  });
});

describe("collectHomeBootstrapEvents", () => {
  it("keeps rail events and drops the rest of the catalog", () => {
    const today = "2026-08-25";
    const special = event({
      id: "special-1",
      title: "Special tonight",
      date: today,
      time: "20:00",
      createdAt: "2026-08-20T12:00:00.000Z",
    });
    const filler = Array.from({ length: 40 }, (_, i) =>
      event({
        id: `filler-${i}`,
        title: `Filler ${i}`,
        date: "2026-10-01",
        time: "19:00",
        createdAt: "2026-01-01T12:00:00.000Z",
      }),
    );
    const bootstrap = collectHomeBootstrapEvents([special, ...filler], {
      now: AFTERNOON,
    });
    assert.ok(bootstrap.some((e) => e.id === "special-1"));
    assert.ok(bootstrap.length < 40);
    assert.ok(bootstrap.length >= 1);
  });
});

describe("collectHomeBootstrapVenues", () => {
  it("returns featured audience venues only", () => {
    const venues: Venue[] = [
      {
        slug: "ground-zero-disco",
        name: "Ground Zero",
        city: "Sosúa",
        description: "Nightclub",
        lat: 19.8,
        lng: -70.5,
      },
      {
        slug: "not-in-any-pool",
        name: "Other",
        city: "Sosúa",
        description: "Skip me",
        lat: 19.8,
        lng: -70.5,
      },
    ];
    const bootstrap = collectHomeBootstrapVenues(venues);
    assert.ok(bootstrap.some((v) => v.slug === "ground-zero-disco"));
    assert.equal(
      bootstrap.some((v) => v.slug === "not-in-any-pool"),
      false,
    );
  });
});
