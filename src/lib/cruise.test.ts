import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  CRUISE_PORTS,
  CRUISE_PORT_SLUGS,
  cruisePath,
  cruiseTravelFromPort,
  formatAllAboardParam,
  formatClockMinutes,
  getCruiseVisitMinutes,
  itinerariesForPort,
  leaveByMinutes,
  parseAllAboardMinutes,
  rankCruiseEvents,
  visibleCruiseEvents,
} from "./cruise";
import { getVenueHeroImageUrl } from "./venue-images";
import type { Event } from "./types";

/** Saturday 29 Aug 2026, 11:00 AST. */
const MORNING = new Date("2026-08-29T15:00:00.000Z");
/** Saturday 29 Aug 2026, 15:00 AST — late for a 16:30 all-aboard. */
const LATE = new Date("2026-08-29T19:00:00.000Z");

function event(
  partial: Partial<Event> & Pick<Event, "id" | "title" | "venueSlug">,
): Event {
  return {
    description: "",
    date: "2026-08-29",
    location: "Puerto Plata",
    category: "culture",
    format: "physical",
    time: "9:00 AM – 6:00 PM",
    ...partial,
  };
}

describe("parseAllAboardMinutes", () => {
  it("reads 24h, compact, and AM/PM clocks", () => {
    assert.equal(parseAllAboardMinutes("16:30"), 16 * 60 + 30);
    assert.equal(parseAllAboardMinutes("17.00"), 17 * 60);
    assert.equal(parseAllAboardMinutes("1630"), 16 * 60 + 30);
    assert.equal(parseAllAboardMinutes("4:30 PM"), 16 * 60 + 30);
    assert.equal(parseAllAboardMinutes(""), 16 * 60 + 30);
  });
});

describe("cruise port heroes", () => {
  it("maps each terminal to a curated place photo", () => {
    for (const slug of CRUISE_PORT_SLUGS) {
      const src = getVenueHeroImageUrl(CRUISE_PORTS[slug].heroVenueSlug);
      assert.ok(src, `${slug} needs a heroVenueSlug with a venue photo`);
    }
  });
});

describe("leaveByMinutes", () => {
  it("pads Taino Bay 75 min and Amber Cove 90 min", () => {
    assert.equal(
      leaveByMinutes(CRUISE_PORTS["taino-bay"], 16 * 60 + 30),
      15 * 60 + 15,
    );
    assert.equal(
      leaveByMinutes(CRUISE_PORTS["amber-cove"], 16 * 60 + 30),
      15 * 60,
    );
  });
});

describe("formatClockMinutes", () => {
  it("uses 12h for English and 24h for Spanish", () => {
    assert.equal(formatClockMinutes(16 * 60 + 30, "en"), "4:30 PM");
    assert.equal(formatClockMinutes(16 * 60 + 30, "es"), "16:30");
    assert.equal(formatAllAboardParam(16 * 60 + 30), "16:30");
  });
});

describe("cruisePath", () => {
  it("omits the default all-aboard query", () => {
    assert.equal(cruisePath("en", "taino-bay"), "/en/cruise/taino-bay");
    assert.equal(
      cruisePath("es", "amber-cove", 17 * 60),
      "/es/cruise/amber-cove?allAboard=17:00",
    );
  });
});

describe("cruiseTravelFromPort", () => {
  it("treats Fortaleza as a walk from Taino Bay", () => {
    const travel = cruiseTravelFromPort(CRUISE_PORTS["taino-bay"], {
      lat: 19.8041466,
      lng: -70.6958831,
    });
    assert.equal(travel.kind, "walk");
    assert.ok(travel.walkMinutes <= 8);
  });

  it("treats Centro as a taxi from Amber Cove, not a walk", () => {
    const travel = cruiseTravelFromPort(CRUISE_PORTS["amber-cove"], {
      lat: 19.8041466,
      lng: -70.6958831,
    });
    assert.equal(travel.kind, "taxi");
    assert.ok(travel.driveMinutes >= 18);
    assert.ok(travel.driveMinutes <= 32);
  });
});

describe("rankCruiseEvents", () => {
  const fortaleza = event({
    id: "fortaleza",
    title: "Fortaleza San Felipe",
    venueSlug: "fortaleza-san-felipe",
    lat: 19.8041466,
    lng: -70.6958831,
  });
  const museum = event({
    id: "ambar",
    title: "Amber Museum",
    venueSlug: "museo-ambar",
    lat: 19.7963741,
    lng: -70.6921771,
  });
  const lobster = event({
    id: "lobster",
    title: "Crazy Lobster",
    venueSlug: "crazy-lobster-maimon",
    category: "food-drinks",
    lat: 19.8341,
    lng: -70.7707,
  });
  const damajagua = event({
    id: "dama",
    title: "27 Charcos",
    venueSlug: "charcos-damajagua",
    category: "adventure",
    location: "Imbert, Puerto Plata",
    lat: 19.72,
    lng: -70.84,
  });
  const salsa = event({
    id: "salsa",
    title: "Salsa night",
    venueSlug: "zona-acapella-club",
    category: "dance",
    time: "9:00 PM – 2:00 AM",
    lat: 19.791341,
    lng: -70.682,
  });
  const cabarete = event({
    id: "lax",
    title: "Reggae at LAX",
    venueSlug: "lax-cabarete",
    location: "Cabarete",
    category: "music",
    lat: 19.7503643,
    lng: -70.406125,
  });

  it("keeps walkable Centro stops from Taino Bay and hides ship excursions", () => {
    const ranked = rankCruiseEvents(
      [fortaleza, museum, damajagua, salsa, cabarete],
      "taino-bay",
      16 * 60 + 30,
      MORNING,
    );
    const visible = visibleCruiseEvents(ranked);
    const ids = visible.map((item) => item.event.id);
    assert.ok(ids.includes("fortaleza"));
    assert.ok(ids.includes("ambar"));
    assert.equal(visible.find((item) => item.event.id === "fortaleza")?.fit, "walk");
    assert.equal(
      ranked.find((item) => item.event.id === "dama")?.fit,
      "ship-excursion",
    );
    assert.ok(!ids.includes("salsa"));
    assert.ok(!ids.includes("lax"));
  });

  it("keeps Maimón lunch from Amber Cove and treats Centro as a taxi", () => {
    const ranked = rankCruiseEvents(
      [fortaleza, lobster],
      "amber-cove",
      16 * 60 + 30,
      MORNING,
    );
    const visible = visibleCruiseEvents(ranked);
    assert.equal(visible.find((item) => item.event.id === "lobster")?.fit, "short-taxi");
    const centro = visible.find((item) => item.event.id === "fortaleza");
    assert.ok(centro);
    assert.ok(centro.fit === "short-taxi" || centro.fit === "tight");
  });

  it("hides a 45-minute museum when leave-by is minutes away", () => {
    const ranked = rankCruiseEvents(
      [fortaleza, museum],
      "taino-bay",
      16 * 60 + 30,
      LATE,
    );
    const visible = visibleCruiseEvents(ranked);
    assert.ok(!visible.some((item) => item.event.id === "ambar"));
    const fortalezaRank = ranked.find((item) => item.event.id === "fortaleza");
    assert.ok(fortalezaRank?.fit === "too-long" || fortalezaRank?.fit === "tight");
  });
});

describe("getCruiseVisitMinutes", () => {
  it("uses editorial stays for all-day attractions", () => {
    assert.equal(
      getCruiseVisitMinutes({
        venueSlug: "museo-ambar",
        category: "culture",
        time: "9:00 AM – 6:00 PM",
      }),
      45,
    );
    assert.equal(
      getCruiseVisitMinutes({
        venueSlug: "ocean-world",
        category: "adventure",
        time: "9:00 AM – 5:00 PM",
      }),
      150,
    );
  });
});

describe("itinerariesForPort", () => {
  it("offers two Taino Bay loops in the morning", () => {
    const loops = itinerariesForPort("taino-bay", 16 * 60 + 30, MORNING);
    assert.deepEqual(
      loops.map((loop) => loop.id),
      ["taino-walk", "taino-culture"],
    );
  });

  it("hides Amber Centro when the remaining window is too short", () => {
    const midday = new Date("2026-08-29T16:00:00.000Z"); // 12:00 AST
    const loops = itinerariesForPort("amber-cove", 16 * 60 + 30, midday);
    assert.ok(!loops.some((loop) => loop.id === "amber-centro"));
    assert.ok(loops.some((loop) => loop.id === "amber-local"));
  });
});
