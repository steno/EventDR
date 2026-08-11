import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  searchEvents,
  searchVenues,
  textMatchesSearchQuery,
} from "./filters";

describe("textMatchesSearchQuery", () => {
  it("matches multi-word queries when tokens appear in any order", () => {
    assert.equal(
      textMatchesSearchQuery(
        "Zen Fitness Camps on Kite Beach (Zen Cabarete)",
        "cabarete fitness",
      ),
      true,
    );
  });

  it("matches space-stripped brand names", () => {
    assert.equal(
      textMatchesSearchQuery(
        "book at cabaretefitnesscamp.com",
        "cabarete fitness",
      ),
      true,
    );
  });
});

describe("searchVenues", () => {
  const venues = [
    {
      slug: "zen-fitness-cabarete",
      name: "Zen Fitness Camps",
      city: "Cabarete",
      description:
        "Beachfront fitness and wellness camp at Zen Cabarete on Kite Beach",
    },
    {
      slug: "lax-cabarete",
      name: "LAX Cabarete",
      city: "Cabarete",
      description: "Beach club",
    },
  ];

  it("finds Zen Fitness via cabarete fitness alias", () => {
    const hits = searchVenues(venues, "cabarete fitness");
    assert.equal(hits.length, 1);
    assert.equal(hits[0]?.slug, "zen-fitness-cabarete");
  });
});

describe("searchEvents", () => {
  const events = [
    {
      id: "zen-fitness-weightloss-camp",
      title: "Zen Fitness Weightloss Camp",
      description:
        "Year-round weightloss immersion at Zen Fitness Camps on Kite Beach (Zen Cabarete). Book at cabaretefitnesscamp.com.",
      location: "Cabarete",
      venue: "Zen Fitness Camps",
      venueSlug: "zen-fitness-cabarete",
    },
    {
      id: "lax-sunset",
      title: "LAX Sunset",
      description: "Beach sunset sessions",
      location: "Cabarete",
      venue: "LAX Cabarete",
      venueSlug: "lax-cabarete",
    },
  ];

  it("finds the camp event for cabarete fitness", () => {
    const hits = searchEvents(events, "cabarete fitness");
    assert.equal(hits.length, 1);
    assert.equal(hits[0]?.id, "zen-fitness-weightloss-camp");
  });
});
