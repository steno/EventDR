import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  searchEvents,
  searchVenues,
  textMatchesSearchQuery,
  filterByPrice,
  filterByTimeAndPrice,
} from "./filters";
import { localDateISO } from "./event-dates";

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
    assert.deepEqual(hits.map((e) => e.id), ["free-plaza"]);
  });

  it("keeps ticketed events on the Paid chip", () => {
    const hits = filterByPrice(priced, "paid");
    assert.deepEqual(hits.map((e) => e.id), [
      "ticketed-show",
      "la-casita-papi-beach-dining",
    ]);
  });

  it("does not treat restaurant dining as free just because it is recurring food-drinks", () => {
    const hits = filterByPrice(priced, "free");
    assert.ok(!hits.some((e) => e.id === "la-casita-papi-beach-dining"));
  });
});

describe("filterByTimeAndPrice", () => {
  it("ANDs the time tab with Free/Paid", () => {
    const today = localDateISO(new Date());
    const events = [
      {
        id: "free-today",
        title: "Free plaza",
        description: "Free public square",
        date: today,
        location: "Puerto Plata",
        category: "culture" as const,
        format: "physical" as const,
        isFree: true,
      },
      {
        id: "paid-today",
        title: "Ticketed tonight",
        description: "Billed artist",
        date: today,
        location: "Cabarete",
        category: "concert" as const,
        format: "physical" as const,
        ticketUrl: "https://tix.do/event/example",
        isFree: false,
      },
      {
        id: "free-later",
        title: "Free next month",
        description: "Free public square",
        date: "2026-09-16",
        location: "Puerto Plata",
        category: "culture" as const,
        format: "physical" as const,
        isFree: true,
      },
    ];
    assert.deepEqual(
      filterByTimeAndPrice(events, "today", "free").map((e) => e.id),
      ["free-today"],
    );
    assert.deepEqual(
      filterByTimeAndPrice(events, "today", "paid").map((e) => e.id),
      ["paid-today"],
    );
    assert.deepEqual(
      filterByTimeAndPrice(events, "all", "free").map((e) => e.id),
      ["free-today", "free-later"],
    );
  });
});
