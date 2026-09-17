import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  searchEvents,
  searchVenues,
  textMatchesSearchQuery,
  filterByPrice,
  listOtherMatchingFilterTimeRanges,
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

  it("does not match aura inside restaurant", () => {
    assert.equal(textMatchesSearchQuery("Restaurant Maria", "aura"), false);
    assert.equal(
      textMatchesSearchQuery("Aura Beach Club Cabarete", "aura"),
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
    {
      slug: "aura-beach-club-cabarete",
      name: "Aura Beach Club Cabarete",
      city: "Cabarete",
      description: "Beachfront club on Calle Principal",
    },
    {
      slug: "restaurant-maria-sov",
      name: "Restaurant Maria",
      city: "Sosúa",
      description: "Oceanfront gourmet restaurant",
    },
  ];

  it("finds Zen Fitness via cabarete fitness alias", () => {
    const hits = searchVenues(venues, "cabarete fitness");
    assert.equal(hits.length, 1);
    assert.equal(hits[0]?.slug, "zen-fitness-cabarete");
  });

  it("ranks Aura first for aura and skips restaurant false positives", () => {
    const hits = searchVenues(venues, "aura");
    assert.equal(hits.length, 1);
    assert.equal(hits[0]?.slug, "aura-beach-club-cabarete");
  });
});

describe("searchEvents", () => {
  const events = [
    {
      id: "zen-fitness-morning-flow",
      title: "Zen Fitness Morning Flow",
      description:
        "Drop-in training at Zen Fitness Camps on Kite Beach (Zen Cabarete). Book at cabaretefitnesscamp.com.",
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
    {
      id: "allison-sade-aura-2026-09-17",
      title: "Allison Sade Live at Aura",
      description: "Live music at Aura Beach Club",
      location: "Cabarete",
      venue: "Aura Beach Club Cabarete",
      venueSlug: "aura-beach-club-cabarete",
    },
    {
      id: "restaurant-maria-day-pass",
      title: "Restaurant Maria Day Pass",
      description: "Oceanfront gourmet restaurant day pass",
      location: "Sosúa",
      venue: "Restaurant Maria",
      venueSlug: "restaurant-maria-sov",
    },
  ];

  it("finds a Zen Fitness event for cabarete fitness", () => {
    const hits = searchEvents(events, "cabarete fitness");
    assert.equal(hits.length, 1);
    assert.equal(hits[0]?.id, "zen-fitness-morning-flow");
  });

  it("finds Allison Sade for aura without restaurant false positives", () => {
    const hits = searchEvents(events, "aura");
    assert.equal(hits.length, 1);
    assert.equal(hits[0]?.id, "allison-sade-aura-2026-09-17");
  });
});

describe("filterByPrice", () => {
  const priced = [
    {
      id: "free-plaza",
      title: "Plaza life",
      description: "Free public square",
      date: "2026-08-16",
      location: "Puerto Plata",
      category: "culture" as const,
      format: "physical" as const,
      isFree: true,
    },
    {
      id: "ticketed-show",
      title: "Headline concert",
      description: "Billed artist",
      date: "2026-08-16",
      location: "Cabarete",
      category: "concert" as const,
      format: "physical" as const,
      ticketUrl: "https://tix.do/event/example",
      isFree: false,
    },
    {
      id: "la-casita-papi-beach-dining",
      title: "La Casita de Papi Beachfront Dining",
      description: "Sunset dinners on Cabarete Central Beach.",
      date: "2026-08-16",
      location: "Cabarete",
      category: "food-drinks" as const,
      format: "physical" as const,
      recurrence: "daily" as const,
    },
  ];

  it("keeps free events on the Gratis chip", () => {
    const hits = filterByPrice(priced, "free");
    assert.deepEqual(hits.map((e) => e.id), [
      "free-plaza",
      "la-casita-papi-beach-dining",
    ]);
  });

  it("keeps ticketed events on the Paid chip", () => {
    const hits = filterByPrice(priced, "paid");
    assert.deepEqual(hits.map((e) => e.id), ["ticketed-show"]);
  });

  it("treats restaurant dining as free entry (no cover / no ticket)", () => {
    const hits = filterByPrice(priced, "free");
    assert.ok(hits.some((e) => e.id === "la-casita-papi-beach-dining"));
  });
});

describe("listOtherMatchingFilterTimeRanges", () => {
  it("returns other tabs that still have matches, in chip order", () => {
    const ranges = listOtherMatchingFilterTimeRanges(
      "tomorrow",
      (range) => range === "today" || range === "weekend",
    );
    assert.deepEqual(ranges, ["today", "weekend"]);
  });

  it("returns an empty list when nothing else matches", () => {
    const ranges = listOtherMatchingFilterTimeRanges("all", () => false);
    assert.deepEqual(ranges, []);
  });
});
