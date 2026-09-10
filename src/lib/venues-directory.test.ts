import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  buildVenueDirectory,
  countUpcomingByVenueSlug,
  venueDirectoryLetters,
  venueSortLetter,
} from "./venues-directory";
import type { Event, Venue } from "./types";

function venue(
  partial: Partial<Venue> & Pick<Venue, "slug" | "name" | "city">,
): Venue {
  return {
    description: partial.description ?? `${partial.name} on the North Coast.`,
    lat: 19.79,
    lng: -70.69,
    ...partial,
  };
}

function event(
  partial: Partial<Event> & Pick<Event, "id" | "title">,
): Event {
  return {
    description: "Test event",
    category: "music",
    date: "2099-06-01",
    time: "21:00",
    location: partial.location ?? "Cabarete",
    venue: partial.venue ?? "LAX Cabarete",
    format: "physical",
    ...partial,
  };
}

describe("venueSortLetter", () => {
  it("folds accents and sends non-letters to #", () => {
    assert.equal(venueSortLetter("LAX"), "L");
    assert.equal(venueSortLetter("École"), "E");
    assert.equal(venueSortLetter("ñoño"), "N");
    assert.equal(venueSortLetter("42 Beach"), "#");
  });
});

describe("countUpcomingByVenueSlug", () => {
  it("counts by stored venueSlug and resolves missing slugs", () => {
    const counts = countUpcomingByVenueSlug([
      event({ id: "1", title: "A", venueSlug: "lax-cabarete" }),
      event({ id: "2", title: "B", venueSlug: "lax-cabarete" }),
      event({
        id: "3",
        title: "C",
        venue: "LAX Cabarete",
        location: "Cabarete",
      }),
    ]);

    assert.equal(counts.get("lax-cabarete"), 3);
  });
});

describe("buildVenueDirectory", () => {
  it("groups A–Z, sorts names alphabetically, and keeps # for odd starters", () => {
    const venues = [
      venue({
        slug: "quiet-spot",
        name: "Quiet Spot",
        city: "Cabarete",
      }),
      venue({
        slug: "lax-cabarete",
        name: "LAX",
        city: "Cabarete",
        imageUrl: "/venues/lax.jpg",
      }),
      venue({
        slug: "d-classico-sosua",
        name: "D Classico",
        city: "Sosúa",
      }),
      venue({
        slug: "number-spot",
        name: "9 Waves",
        city: "Cabarete",
      }),
    ];

    const groups = buildVenueDirectory(venues, [
      event({ id: "1", title: "Reggae", venueSlug: "lax-cabarete" }),
    ]);

    assert.deepEqual(
      groups.map((group) => group.id),
      ["D", "L", "Q", "hash"],
    );

    const l = groups.find((group) => group.id === "L");
    assert.equal(l?.entries[0]?.venue.slug, "lax-cabarete");
    assert.equal(l?.entries[0]?.upcomingCount, 1);

    assert.deepEqual(venueDirectoryLetters(groups).slice(-1), ["#"]);
    assert.equal(venueDirectoryLetters(groups).length, 27);
  });
});
