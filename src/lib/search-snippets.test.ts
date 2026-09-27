import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  SEARCH_DESCRIPTION_MAX,
  SEARCH_TITLE_MAX,
  buildListingSearchCopy,
  buildUntunedVenueSearchCopy,
  buildWhenSearchCopy,
  eventSearchDescription,
  eventSearchTitle,
} from "./search-snippets";
import { buildVenueGlance } from "./venue-glance";
import {
  eventsInCalendarOrder,
  eventsInWeekendOrder,
  weekendHeadingDate,
} from "./list-day-groups";
import { getVenueSeo } from "./venue-seo";
import type { Event } from "./types";
import type { Locale } from "@/i18n/config";

function event(partial: Partial<Event> & Pick<Event, "id" | "title" | "date">): Event {
  return {
    description: "",
    location: "Puerto Plata",
    category: "culture",
    format: "physical",
    ...partial,
  };
}

describe("buildWhenSearchCopy", () => {
  const events = [
    event({ id: "a", title: "Fun City Action Park — Go-Karts", date: "2026-09-27" }),
    event({ id: "b", title: "Río Martinico (Madre Vieja)", date: "2026-09-27" }),
    event({ id: "c", title: "Sunday market", date: "2026-09-27" }),
  ];

  it("puts a count in the today title and names real plans in the description", () => {
    const copy = buildWhenSearchCopy("en", "today", events);
    assert.ok(copy);
    assert.match(copy.title, /^3 things to do today in Puerto Plata/);
    assert.ok(copy.title.length <= SEARCH_TITLE_MAX);
    assert.match(copy.description, /Fun City Action Park/);
    assert.match(copy.description, /Río Martinico/);
    assert.ok(copy.description.length <= SEARCH_DESCRIPTION_MAX);
    assert.match(copy.h1, /3 things to do today/);
    assert.match(copy.intro, /Fun City/);
  });

  it("uses Spanish query language for the weekend list", () => {
    const copy = buildWhenSearchCopy("es", "weekend", [
      event({ id: "fri", title: "Noche de salsa", date: "2026-10-02" }),
      event({ id: "sat", title: "Mercado del sábado", date: "2026-10-03" }),
    ]);
    assert.ok(copy);
    assert.match(copy.title, /2 planes de fin de semana en Puerto Plata/);
    assert.match(copy.h1, /2 planes para el fin de semana/);
    assert.doesNotMatch(copy.description, /…/);
    assert.ok(copy.title.length <= SEARCH_TITLE_MAX);
    assert.ok(copy.description.length <= SEARCH_DESCRIPTION_MAX);
  });

  it("keeps the static fallback when nothing is listed", () => {
    assert.equal(buildWhenSearchCopy("en", "today", []), null);
  });
});

describe("event search snippets", () => {
  it("puts the city on a recurring river day and leads with free hours", () => {
    const river = event({
      id: "rio-martinico-sosua",
      title: "Río Martinico (Madre Vieja)",
      description:
        "El día de río menos conocido de Sosúa en Madre Vieja — los locales también lo llaman Río Azul.",
      date: "2026-01-01",
      time: "9:00 AM – 6:00 PM",
      location: "Sosúa",
      venue: "Río Martinico",
      recurrence: "daily",
      isFree: true,
      category: "adventure",
    });
    const title = eventSearchTitle(river, "es");
    const description = eventSearchDescription(river, "es");
    assert.match(title, /Sosúa/);
    assert.doesNotMatch(title, /ene|Jan|2026/);
    assert.ok(title.length <= SEARCH_TITLE_MAX);
    assert.match(description, /^Todos los días/);
    assert.match(description, /Gratis/);
    assert.match(description, /9:00 AM/);
    assert.ok(description.length <= SEARCH_DESCRIPTION_MAX);
  });

  it("dates a past game and says it already happened", () => {
    const game = event({
      id: "atleticos-pp-vs-reales-2026-08-09",
      title: "Atléticos de Puerto Plata vs Reales de Santiago",
      description: "Béisbol de verano en el Parque José Briceño. Entradas desde RD$200.",
      date: "2026-08-09",
      time: "4:00 PM",
      location: "Puerto Plata",
      venue: "Parque José Briceño",
      category: "sports",
    });
    const title = eventSearchTitle(game, "es");
    const description = eventSearchDescription(game, "es");
    assert.match(title, /Atléticos/);
    assert.ok(title.length <= SEARCH_TITLE_MAX, title);
    assert.match(description, /^Ya pasó/);
    assert.match(description, /Parque José Briceño/);
    assert.match(description, /4:00 PM/);
    assert.ok(description.length <= SEARCH_DESCRIPTION_MAX);
  });
});

describe("high-impression venue snippets", () => {
  const slugs = [
    "fun-city",
    "aura-beach-club-cabarete",
    "pop-cinemas-playa-dorada",
    "coconut-cove",
    "museo-ambar",
    "ocean-world",
    "don-limon-cofresi",
    "los-tres-cocos-cofresi",
  ] as const;
  const locales: Locale[] = ["en", "es", "fr"];

  for (const slug of slugs) {
    for (const locale of locales) {
      it(`${slug} ${locale} title and description fit a search result`, () => {
        const seo = getVenueSeo(slug, locale);
        assert.ok(seo, slug);
        assert.ok(seo.title.length <= SEARCH_TITLE_MAX, seo.title);
        assert.ok(
          seo.description.length <= SEARCH_DESCRIPTION_MAX,
          seo.description,
        );
      });
    }
  }

  it("answers the Fun City and cinema queries in Spanish", () => {
    const fun = getVenueSeo("fun-city", "es");
    const cinema = getVenueSeo("pop-cinemas-playa-dorada", "es");
    const aura = getVenueSeo("aura-beach-club-cabarete", "es");
    assert.match(fun?.title ?? "", /RD\$200/);
    assert.match(fun?.description ?? "", /10 AM/);
    assert.match(cinema?.title ?? "", /Cartelera/);
    assert.match(cinema?.description ?? "", /RD\$300/);
    assert.match(aura?.description ?? "", /11:30/);
  });
});

describe("buildVenueGlance", () => {
  it("leads a go-kart park with hours and the door price", () => {
    const glance = buildVenueGlance(
      [
        event({
          id: "fun-city-daily",
          title: "Fun City Action Park — Go-Karts",
          date: "2026-01-01",
          time: "10:00 AM - 6:00 PM",
          recurrence: "daily",
          category: "adventure",
        }),
      ],
      "es",
    );
    assert.ok(glance);
    assert.equal(glance.stale, false);
    assert.match(glance.headline, /Todos los días/);
    assert.match(glance.headline, /10:00 AM/);
    assert.match(glance.headline, /desde RD\$200/);
  });

  it("keeps a past cinema week visible and marked as last posted", () => {
    const glance = buildVenueGlance(
      [
        event({
          id: "pop-cinemas-week-2026-09-17",
          title: "POP Cinemas — Week of Sep 17–23",
          date: "2026-09-17",
          endDate: "2026-09-23",
          time: "5:45 PM – 9:30 PM",
          admissionPrice: "RD$300",
          lineup: ["Rebelión en la Granja · 5:45 PM", "Código: Venganza · 9:30 PM"],
          category: "culture",
        }),
      ],
      "es",
    );
    assert.ok(glance);
    assert.equal(glance.stale, true);
    assert.match(glance.headline, /RD\$300/);
    assert.ok(glance.lines.some((line) => line.includes("Rebelión")));
  });
});

describe("eventsInCalendarOrder", () => {
  it("groups a weekend list Friday then Saturday then Sunday", () => {
    const ordered = eventsInCalendarOrder([
      { id: "sun", date: "2026-10-04" },
      { id: "fri-b", date: "2026-10-02" },
      { id: "sat", date: "2026-10-03" },
      { id: "fri-a", date: "2026-10-02" },
    ]);
    assert.deepEqual(
      ordered.map((item) => item.id),
      ["fri-b", "fri-a", "sat", "sun"],
    );
  });
});

describe("eventsInWeekendOrder", () => {
  const sunday = new Date("2026-09-27T16:00:00-04:00");

  it("keeps an already-running event from renaming the weekend", () => {
    const ordered = eventsInWeekendOrder(
      [
        { id: "old", date: "2026-09-18" },
        { id: "sat", date: "2026-10-03" },
        { id: "fri", date: "2026-10-02" },
      ],
      sunday,
    );
    assert.deepEqual(
      ordered.map((item) => item.id),
      ["fri", "old", "sat"],
    );
    assert.equal(weekendHeadingDate({ date: "2026-09-18" }, sunday), "2026-10-02");
  });
});

describe("listing and untuned venue snippets", () => {
  it("counts plans on a city or category page and names them", () => {
    const copy = buildListingSearchCopy(
      "en",
      [
        event({ id: "a", title: "Playa Alicia Closing", date: "2026-09-27" }),
        event({ id: "b", title: "Eat Street Market", date: "2026-09-27" }),
      ],
      { kind: "city", place: "Cabarete", scope: "city" },
    );
    assert.ok(copy);
    assert.match(copy.title, /^2 things to do in Cabarete \| POP Events$/);
    assert.match(copy.description, /Playa Alicia Closing/);
    assert.match(copy.description, /2 plans in Cabarete\.$/);
    assert.ok(copy.title.length <= SEARCH_TITLE_MAX, copy.title);
    assert.ok(copy.description.length <= SEARCH_DESCRIPTION_MAX);
  });

  it("uses the category query people type", () => {
    const copy = buildListingSearchCopy(
      "es",
      [event({ id: "a", title: "Latin Flow", date: "2026-09-30" })],
      {
        kind: "category",
        place: "Puerto Plata",
        scope: "region",
        topic: "fiestas",
      },
    );
    assert.match(copy?.title ?? "", /^1 fiestas en Puerto Plata/);
  });

  it("leads an untuned venue with the place, then hours and price", () => {
    const copy = buildUntunedVenueSearchCopy(
      "es",
      {
        name: "La Casita de Papi",
        city: "Cabarete",
        description: "Beachfront dining on the bay.",
      },
      [
        event({
          id: "casita",
          title: "La Casita de Papi Beachfront Dining",
          date: "2026-01-01",
          time: "12:00 PM - 10:00 PM",
          recurrence: "daily",
          category: "food-drinks",
          admissionPrice: "from RD$500",
        }),
      ],
    );
    assert.match(copy.title, /La Casita de Papi, Cabarete/);
    assert.doesNotMatch(copy.title, /^Eventos en/);
    assert.match(copy.description, /desde RD\$500/);
    assert.match(copy.description, /Beachfront dining on the bay\./);
    assert.doesNotMatch(copy.description, /…/);
    assert.ok(copy.title.length <= SEARCH_TITLE_MAX, copy.title);
    assert.ok(copy.description.length <= SEARCH_DESCRIPTION_MAX, copy.description);
  });

  it("skips a repeated city when the venue name already includes it", () => {
    const copy = buildUntunedVenueSearchCopy("en", {
      name: "Sosúa Ocean Village",
      city: "Sosúa",
      description: "Beach village.",
    });
    assert.match(copy.title, /^Sosúa Ocean Village \| POP Events$/);
  });
});
