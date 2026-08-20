import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  buildTodaySpotlightCaption,
  pickTodaySpotlights,
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
    );
    assert.match(caption, /Today on the North Coast/);
    assert.match(caption, /① Viernes Locos · 11:00 PM/);
    assert.match(caption, /② Open mic/);
    assert.match(caption, /https:\/\/pop-event.com\/en\/when\/today/);
    assert.match(caption, /#POPEvents/);
  });
});

describe("toAbsoluteMetaImageUrl", () => {
  it("prefixes site-relative event images", () => {
    assert.equal(
      toAbsoluteMetaImageUrl("/events/foo.jpg"),
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
