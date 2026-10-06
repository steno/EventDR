import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  pickSearchVenueHits,
  searchEvents,
  searchVenues,
  textMatchesSearchQuery,
  buildEventSearchText,
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

  it("folds accents so beisbol matches Béisbol", () => {
    assert.equal(
      textMatchesSearchQuery("Liga Nacional de Béisbol de Verano", "beisbol"),
      true,
    );
  });

  it("matches baseball as a synonym of béisbol", () => {
    assert.equal(
      textMatchesSearchQuery(
        "Liga Nacional de Béisbol de Verano Serie Final Game 4",
        "baseball",
      ),
      true,
    );
  });

  it("matches terrace as a synonym of terraza", () => {
    assert.equal(
      textMatchesSearchQuery("Terraza Ocean World & Casino", "terrace"),
      true,
    );
    assert.equal(
      textMatchesSearchQuery("Ocean World Terrace Old School", "terraza"),
      true,
    );
  });

  it("bridges English queries to Spanish/French title words via the lexicon", () => {
    assert.equal(
      textMatchesSearchQuery("Bazar de Otoño — Sosúa Emprende", "autumn bazar"),
      true,
    );
    assert.equal(
      textMatchesSearchQuery("Bazar de Otoño — Sosúa Emprende", "autumn bazaar"),
      true,
    );
    assert.equal(
      textMatchesSearchQuery("Festival de Primavera Cabarete", "spring festival"),
      true,
    );
    assert.equal(
      textMatchesSearchQuery("Concierto de Verano en la Playa", "summer concert"),
      true,
    );
    assert.equal(
      textMatchesSearchQuery("Mercado de Navidad Puerto Plata", "christmas market"),
      true,
    );
    assert.equal(
      textMatchesSearchQuery("Fête d'hiver à Sosúa", "winter party"),
      true,
    );
  });

  it("ignores function words in multi-token queries", () => {
    assert.equal(
      textMatchesSearchQuery("Autumn Bazaar Sosúa", "bazar de otoño"),
      true,
    );
  });
});

describe("pickSearchVenueHits", () => {
  const venues = [
    {
      slug: "grecialandia",
      name: "Grecialandia",
      city: "Puerto Plata",
      description: "Panoramic terraces and pools",
    },
    {
      slug: "ocean-world",
      name: "Ocean World Adventure Park",
      city: "Puerto Plata",
      description: "Dolphins and marina terrace",
    },
  ];

  it("caps venue rows when few events match", () => {
    const hits = pickSearchVenueHits(venues, "terrace", 1);
    assert.ok(hits.some((v) => v.slug === "grecialandia"));
  });

  it("drops description-only venues when many events match", () => {
    const hits = pickSearchVenueHits(venues, "terrace", 5);
    assert.equal(
      hits.some((v) => v.slug === "grecialandia"),
      false,
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

  it("finds Spanish titles from English season + event-type queries", () => {
    const market = [
      ...events,
      {
        id: "sosua-emprende-bazar-otono-2026-10-17",
        title: "Bazar de Otoño — Sosúa Emprende",
        description: "Family day with crafts at Parque Las Flores.",
        location: "Sosúa",
        venue: "Parque Las Flores Sosúa",
        venueSlug: "parque-las-flores-sosua",
        category: "festivals" as const,
      },
      {
        id: "primavera-cabarete",
        title: "Festival de Primavera Cabarete",
        description: "Spring arts weekend on the strip",
        location: "Cabarete",
        category: "festivals" as const,
      },
    ];
    assert.equal(
      searchEvents(market, "autumn bazaar")[0]?.id,
      "sosua-emprende-bazar-otono-2026-10-17",
    );
    assert.equal(
      searchEvents(market, "spring festival")[0]?.id,
      "primavera-cabarete",
    );
  });

  it("searches across localized titles when the active locale title differs", () => {
    const rows = [
      {
        id: "winter-fair",
        title: "Winter Fair",
        description: "",
        location: "Sosúa",
        category: "festivals" as const,
        localized: {
          title: {
            en: "Winter Fair",
            es: "Feria de Invierno",
            fr: "Foire d'hiver",
          },
        },
      },
    ];
    assert.equal(searchEvents(rows, "feria invierno")[0]?.id, "winter-fair");
    assert.equal(searchEvents(rows, "foire")[0]?.id, "winter-fair");
  });

  it("finds Spanish béisbol copy when searching baseball", () => {
    const sports = [
      ...events,
      {
        id: "atleticos-pp-vs-mineros-2026-10-03",
        title: "Atléticos de Puerto Plata vs Mineros de Bonao",
        description:
          "Liga Nacional de Béisbol de Verano Serie Final Game 4 at Parque José Briceño",
        location: "Puerto Plata",
        venue: "Parque José Briceño",
        venueSlug: "parque-jose-briceno",
        category: "sports",
      },
      {
        id: "kite-jam",
        title: "Kite Beach Jam",
        description: "Afternoon freestyle session on Kite Beach",
        location: "Cabarete",
        venue: "Kite Beach",
        category: "sports",
      },
    ];
    const hits = searchEvents(sports, "baseball");
    assert.equal(hits.length, 1);
    assert.equal(hits[0]?.id, "atleticos-pp-vs-mineros-2026-10-03");
  });

  it("finds slimmed list events via searchText and baseball emoji", () => {
    const slimmed = [
      {
        id: "atleticos-pp-vs-mineros-2026-10-03",
        title: "José Briceño Serie Final Game 4 — Atléticos vs Mineros",
        description: "",
        searchText: buildEventSearchText({
          title: "José Briceño Serie Final Game 4 — Atléticos vs Mineros",
          description:
            "Liga Nacional de Béisbol de Verano Serie Final Game 4 at Parque José Briceño",
          imageEmoji: "⚾",
        }),
        location: "Puerto Plata",
        venue: "Parque José Briceño",
        venueSlug: "parque-jose-briceno",
        category: "sports",
        imageEmoji: "⚾",
      },
      {
        id: "kite-jam",
        title: "Kite Beach Jam",
        description: "",
        location: "Cabarete",
        category: "sports",
        imageEmoji: "🏄",
      },
    ];
    const hits = searchEvents(slimmed, "baseball");
    assert.equal(hits.length, 1);
    assert.equal(hits[0]?.id, "atleticos-pp-vs-mineros-2026-10-03");
  });

  it("finds sports events for deportes via category aliases", () => {
    const sports = [
      {
        id: "atleticos-pp-vs-mineros-2026-10-03",
        title: "Atléticos de Puerto Plata vs Mineros de Bonao",
        description: "Serie Final Game 4 at Parque José Briceño",
        location: "Puerto Plata",
        category: "sports",
      },
      {
        id: "salsa-night",
        title: "Salsa Night",
        description: "Social dancing on the strip",
        location: "Cabarete",
        category: "dance",
      },
    ];
    const hits = searchEvents(sports, "deportes");
    assert.equal(hits.length, 1);
    assert.equal(hits[0]?.id, "atleticos-pp-vs-mineros-2026-10-03");
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
