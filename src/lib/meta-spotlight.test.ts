import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  buildTodaySpotlightCaption,
  pickTodaySpotlights,
  spotlightCaptionIntro,
  spotlightRepeatKey,
  spotlightSeriesKeyFromId,
  toAbsoluteMetaImageUrl,
} from "./meta-spotlight";
import type { Event } from "./types";

const NOW = new Date("2026-08-20T13:00:00.000Z"); // 9:00 AST

function event(
  partial: Partial<Event> & Pick<Event, "id" | "title" | "date">,
): Event {
  return {
    description: "",
    location: "Sosúa",
    category: "music",
    format: "physical",
    ...partial,
  };
}

describe("pickTodaySpotlights", () => {
  it("prefers trending one-offs and varies city and category", () => {
    const picked = pickTodaySpotlights(
      [
        event({
          id: "museum",
          title: "Amber Museum",
          date: "2026-08-20",
          location: "Puerto Plata",
          category: "culture",
          recurrence: "daily",
        }),
        event({
          id: "party",
          title: "Viernes Locos",
          date: "2026-08-20",
          time: "11:00 PM",
          location: "Sosúa",
          category: "parties",
          trending: true,
        }),
        event({
          id: "kite",
          title: "Kite Beach",
          date: "2026-08-20",
          location: "Cabarete",
          category: "sports",
          recurrence: "daily",
        }),
        event({
          id: "concert",
          title: "Live at VOYVOY",
          date: "2026-08-20",
          time: "8:00 PM",
          location: "Cabarete",
          category: "music",
        }),
      ],
      3,
      NOW,
    );

    assert.deepEqual(
      picked.map((item) => item.id),
      ["party", "concert", "museum"],
    );
  });

  it("skips events that have already ended", () => {
    const picked = pickTodaySpotlights(
      [
        event({
          id: "morning",
          title: "Sunrise yoga",
          date: "2026-08-20",
          time: "6:00 AM – 7:00 AM",
          location: "Cabarete",
        }),
        event({
          id: "night",
          title: "Open mic",
          date: "2026-08-20",
          time: "8:00 PM",
          location: "Cabarete",
        }),
      ],
      3,
      NOW,
    );
    assert.deepEqual(
      picked.map((item) => item.id),
      ["night"],
    );
  });

  it("fills one-offs before daily recurrences even when a daily is trending", () => {
    const picked = pickTodaySpotlights(
      [
        event({
          id: "daily-hot",
          title: "Monkeyland",
          date: "2026-08-20",
          location: "Puerto Plata",
          category: "adventure",
          recurrence: "daily",
          trending: true,
        }),
        event({
          id: "once-a",
          title: "Beach soccer",
          date: "2026-08-20",
          time: "9:00 AM – 6:00 PM",
          location: "Sosúa",
          category: "sports",
        }),
        event({
          id: "once-b",
          title: "Gallery opening",
          date: "2026-08-20",
          time: "6:00 PM",
          location: "Cabarete",
          category: "culture",
        }),
        event({
          id: "weekly",
          title: "Reggae night",
          date: "2026-08-20",
          time: "9:00 PM",
          location: "Cabarete",
          category: "music",
          recurrence: "weekly",
        }),
      ],
      3,
      NOW,
    );
    assert.deepEqual(
      picked.map((item) => item.id),
      ["once-a", "once-b", "weekly"],
    );
  });

  it("skips recently posted events and related venue/series keys", () => {
    const picked = pickTodaySpotlights(
      [
        event({
          id: "pop-cinemas-week-2026-08-20",
          title: "POP Cinemas",
          date: "2026-08-20",
          venueSlug: "pop-cinemas",
          category: "culture",
        }),
        event({
          id: "once-a",
          title: "Beach soccer",
          date: "2026-08-20",
          time: "9:00 AM",
          location: "Sosúa",
          category: "sports",
        }),
        event({
          id: "once-b",
          title: "Gallery opening",
          date: "2026-08-20",
          time: "6:00 PM",
          location: "Cabarete",
          category: "culture",
        }),
        event({
          id: "once-c",
          title: "Jazz night",
          date: "2026-08-20",
          time: "8:00 PM",
          location: "Puerto Plata",
          category: "music",
        }),
      ],
      3,
      NOW,
      {
        excludeIds: ["pop-cinemas-week-2026-08-20"],
        excludeKeys: ["venue:pop-cinemas"],
      },
    );
    assert.deepEqual(
      picked.map((item) => item.id),
      ["once-a", "once-b", "once-c"],
    );
  });

  it("falls back to a recent event when there are not enough new ones", () => {
    const picked = pickTodaySpotlights(
      [
        event({
          id: "recent",
          title: "POP Cinemas",
          date: "2026-08-20",
          category: "culture",
        }),
        event({
          id: "fresh",
          title: "Open mic",
          date: "2026-08-20",
          time: "8:00 PM",
          location: "Cabarete",
          category: "music",
        }),
      ],
      3,
      NOW,
      { excludeIds: ["recent"] },
    );
    assert.deepEqual(
      picked.map((item) => item.id),
      ["fresh", "recent"],
    );
  });
});

describe("spotlightRepeatKey", () => {
  it("groups dated week listings and weekday recurrences", () => {
    assert.equal(
      spotlightSeriesKeyFromId("pop-cinemas-week-2026-08-20"),
      "pop-cinemas-week",
    );
    assert.equal(
      spotlightSeriesKeyFromId("gym-sov-zumba-tuesday"),
      "gym-sov-zumba",
    );
    assert.equal(
      spotlightRepeatKey({
        id: "pop-cinemas-week-2026-08-20",
        venueSlug: "pop-cinemas",
      }),
      "venue:pop-cinemas",
    );
  });
});

describe("buildTodaySpotlightCaption", () => {
  it("lists three events and the today URL", () => {
    const caption = buildTodaySpotlightCaption(
      [
        {
          id: "a",
          title: "Viernes Locos",
          time: "11:00 PM",
          place: "Ground Zero, Sosúa",
          url: "https://pop-event.com/en/event/a",
          imageUrl: "https://pop-event.com/events/a.jpg",
        },
        {
          id: "b",
          title: "Open mic",
          place: "VOYVOY, Cabarete",
          url: "https://pop-event.com/en/event/b",
          imageUrl: "https://pop-event.com/events/b.jpg",
        },
      ],
      "en",
      "https://pop-event.com/en/when/today",
      "2026-08-20",
    );
    assert.match(caption, /What's on Thursday/);
    assert.match(caption, /• Viernes Locos · 11pm · Ground Zero/);
    assert.match(caption, /• Open mic · VOYVOY/);
    assert.match(caption, /More at pop-event.com\/en\/when\/today/);
    assert.doesNotMatch(caption, /utm_/);
    assert.doesNotMatch(caption, /📍/);
    assert.match(caption, /#POPEvents/);
  });

  it("rotates the intro so consecutive days are not the same hook", () => {
    assert.notEqual(
      spotlightCaptionIntro("en", "2026-08-25"),
      spotlightCaptionIntro("en", "2026-08-26"),
    );
  });
});

describe("toAbsoluteMetaImageUrl", () => {
  it("prefixes site-relative event images", () => {
    assert.equal(
      toAbsoluteMetaImageUrl("/events/foo.jpg"),
      "https://pop-event.com/events/foo.jpg",
    );
  });

  it("strips cache-busting query strings", () => {
    assert.equal(
      toAbsoluteMetaImageUrl("/events/foo.jpg?v=abc"),
      "https://pop-event.com/events/foo.jpg",
    );
  });

  it("rejects off-site images", () => {
    assert.equal(
      toAbsoluteMetaImageUrl("https://cdn.example/photo.jpg"),
      undefined,
    );
  });
});
