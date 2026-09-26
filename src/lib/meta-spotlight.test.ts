import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  buildTodaySpotlightCaption,
  otherSpotlightChannel,
  pickTodaySpotlights,
  sameSpotlightEventSet,
  spotlightCaptionIntro,
  spotlightLimitForOptions,
  spotlightPickOptionsForSource,
  spotlightRepeatKey,
  spotlightSeriesKeyFromId,
  toAbsoluteMetaImageUrl,
  TODAY_SPOTLIGHT_LIMIT,
  TODAY_SPOTLIGHT_MAX,
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

  it("manual specials pool is only dated one-offs that start today", () => {
    const pool = [
      event({
        id: "patronales",
        title: "Imbert Fiestas Patronales",
        date: "2026-08-16",
        endDate: "2026-08-24",
        time: "10:00 AM – 11:00 PM",
        location: "Imbert",
        category: "festivals",
        trending: true,
      }),
      event({
        id: "ramen",
        title: "Ramen party",
        date: "2026-08-20",
        time: "6:00 PM",
        location: "Puerto Plata",
        category: "food-drinks",
      }),
      event({
        id: "concert",
        title: "Live at Aura",
        date: "2026-08-20",
        time: "8:00 PM",
        location: "Cabarete",
        category: "concert",
      }),
      event({
        id: "party",
        title: "Reggaeton night",
        date: "2026-08-20",
        time: "10:00 PM",
        location: "Puerto Plata",
        category: "parties",
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
    ];
    assert.deepEqual(
      pickTodaySpotlights(pool, 3, NOW, { onlyTodaySpecials: true }).map(
        (item) => item.id,
      ),
      ["ramen", "concert", "party"],
    );
  });

  it("scheduled pool prefers today’s specials before multi-day festivals", () => {
    const pool = [
      event({
        id: "patronales",
        title: "Imbert Fiestas Patronales",
        date: "2026-08-16",
        endDate: "2026-08-24",
        time: "10:00 AM – 11:00 PM",
        location: "Imbert",
        category: "festivals",
        trending: true,
      }),
      event({
        id: "ramen",
        title: "Ramen party",
        date: "2026-08-20",
        time: "6:00 PM",
        location: "Puerto Plata",
        category: "food-drinks",
      }),
      event({
        id: "concert",
        title: "Live at Aura",
        date: "2026-08-20",
        time: "8:00 PM",
        location: "Cabarete",
        category: "concert",
      }),
      event({
        id: "party",
        title: "Reggaeton night",
        date: "2026-08-20",
        time: "10:00 PM",
        location: "Puerto Plata",
        category: "parties",
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
    ];
    assert.deepEqual(
      pickTodaySpotlights(pool, 3, NOW, { preferTodaySpecials: true }).map(
        (item) => item.id,
      ),
      ["ramen", "concert", "party"],
    );
  });

  it("scheduled prefer takes every special when the limit allows", () => {
    const pool = [
      event({
        id: "a",
        title: "A",
        date: "2026-08-20",
        time: "1:00 PM",
        location: "Sosúa",
        category: "music",
      }),
      event({
        id: "b",
        title: "B",
        date: "2026-08-20",
        time: "2:00 PM",
        location: "Cabarete",
        category: "food-drinks",
      }),
      event({
        id: "c",
        title: "C",
        date: "2026-08-20",
        time: "3:00 PM",
        location: "Puerto Plata",
        category: "parties",
      }),
      event({
        id: "d",
        title: "D",
        date: "2026-08-20",
        time: "4:00 PM",
        location: "Imbert",
        category: "concert",
      }),
      event({
        id: "e",
        title: "E",
        date: "2026-08-20",
        time: "5:00 PM",
        location: "Luperon",
        category: "sports",
      }),
      event({
        id: "weekly",
        title: "Weekly",
        date: "2026-08-20",
        time: "9:00 PM",
        location: "Cabarete",
        category: "music",
        recurrence: "weekly",
      }),
    ];
    const limit = spotlightLimitForOptions(pool, { preferTodaySpecials: true }, NOW);
    assert.equal(limit, 5);
    const picked = pickTodaySpotlights(pool, limit, NOW, {
      preferTodaySpecials: true,
    }).map((item) => item.id);
    assert.deepEqual(picked.sort(), ["a", "b", "c", "d", "e"]);
    assert.equal(picked.includes("weekly"), false);
  });

  it("caps preferred specials at the Meta carousel max", () => {
    const pool = Array.from({ length: TODAY_SPOTLIGHT_MAX + 3 }, (_, i) =>
      event({
        id: `special-${i}`,
        title: `Special ${i}`,
        date: "2026-08-20",
        time: "8:00 PM",
        location: i % 2 ? "Cabarete" : "Sosúa",
        category: i % 2 ? "music" : "parties",
      }),
    );
    assert.equal(
      spotlightLimitForOptions(pool, { preferTodaySpecials: true }, NOW),
      TODAY_SPOTLIGHT_MAX,
    );
    assert.equal(
      spotlightLimitForOptions(pool, { onlyTodaySpecials: true }, NOW),
      TODAY_SPOTLIGHT_MAX,
    );
  });

  it("keeps a 3-slot floor when preferring specials but few exist", () => {
    const pool = [
      event({
        id: "one",
        title: "One special",
        date: "2026-08-20",
        time: "6:00 PM",
        location: "Sosúa",
        category: "food-drinks",
      }),
      event({
        id: "weekly-a",
        title: "Weekly A",
        date: "2026-08-20",
        time: "8:00 PM",
        location: "Cabarete",
        category: "music",
        recurrence: "weekly",
      }),
      event({
        id: "weekly-b",
        title: "Weekly B",
        date: "2026-08-20",
        time: "9:00 PM",
        location: "Puerto Plata",
        category: "parties",
        recurrence: "weekly",
      }),
    ];
    assert.equal(
      spotlightLimitForOptions(pool, { preferTodaySpecials: true }, NOW),
      TODAY_SPOTLIGHT_LIMIT,
    );
  });

  it("after specials posted, scheduled pool skips the specials set", () => {
    const pool = [
      event({
        id: "patronales",
        title: "Imbert Fiestas Patronales",
        date: "2026-08-16",
        endDate: "2026-08-24",
        time: "10:00 AM – 11:00 PM",
        location: "Imbert",
        category: "festivals",
        trending: true,
      }),
      event({
        id: "ramen",
        title: "Ramen party",
        date: "2026-08-20",
        time: "6:00 PM",
        location: "Puerto Plata",
        category: "food-drinks",
      }),
      event({
        id: "concert",
        title: "Live at Aura",
        date: "2026-08-20",
        time: "8:00 PM",
        location: "Cabarete",
        category: "concert",
      }),
      event({
        id: "party",
        title: "Reggaeton night",
        date: "2026-08-20",
        time: "10:00 PM",
        location: "Puerto Plata",
        category: "parties",
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
    ];
    const specials = pickTodaySpotlights(pool, 3, NOW, {
      onlyTodaySpecials: true,
    });
    const scheduled = pickTodaySpotlights(pool, 3, NOW, {
      excludeTodaySpecials: true,
    });
    const specialIds = new Set(specials.map((item) => item.id));
    assert.equal(specialIds.has("ramen"), true);
    assert.equal(
      scheduled.some((item) => specialIds.has(item.id)),
      false,
    );
    assert.equal(scheduled[0]?.id, "patronales");
  });

  it("pins a featured today event first as the cover", () => {
    const picked = pickTodaySpotlights(
      [
        event({
          id: "once-a",
          title: "Beach soccer",
          date: "2026-08-20",
          time: "9:00 AM",
          location: "Sosúa",
          category: "sports",
          trending: true,
        }),
        event({
          id: "cigar-town-acustico-humos-2026-08-28",
          title: "Cigar Town Sessions",
          date: "2026-08-20",
          location: "Puerto Plata",
          category: "performances",
        }),
        event({
          id: "once-b",
          title: "Gallery opening",
          date: "2026-08-20",
          time: "6:00 PM",
          location: "Cabarete",
          category: "culture",
        }),
      ],
      3,
      NOW,
      { featureEventId: "cigar-town-acustico-humos-2026-08-28" },
    );
    assert.deepEqual(
      picked.map((item) => item.id),
      [
        "cigar-town-acustico-humos-2026-08-28",
        "once-a",
        "once-b",
      ],
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

describe("spotlight channels", () => {
  it("maps scheduled vs specials pick flags", () => {
    assert.deepEqual(spotlightPickOptionsForSource("today"), {
      preferTodaySpecials: true,
    });
    assert.deepEqual(
      spotlightPickOptionsForSource("today", { specialsAlreadyPosted: true }),
      { excludeTodaySpecials: true },
    );
    assert.deepEqual(spotlightPickOptionsForSource("today-specials"), {
      onlyTodaySpecials: true,
    });
    assert.equal(otherSpotlightChannel("today"), "today-specials");
    assert.equal(otherSpotlightChannel("today-specials"), "today");
  });

  it("detects the same event set regardless of order", () => {
    assert.equal(
      sameSpotlightEventSet(["a", "b", "c"], ["c", "a", "b"]),
      true,
    );
    assert.equal(sameSpotlightEventSet(["a", "b"], ["a", "c"]), false);
    assert.equal(sameSpotlightEventSet([], []), false);
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
