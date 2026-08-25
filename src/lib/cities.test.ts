import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { countEventsByCity, venueMatchesCity } from "./cities";
import type { Event } from "./types";

function event(partial: Partial<Event> & Pick<Event, "id" | "location">): Event {
  return {
    title: partial.id,
    description: "",
    date: "2026-08-16",
    category: "culture",
    format: "physical",
    ...partial,
  };
}

describe("countEventsByCity", () => {
  it("counts the full catalog plus each North Coast city", () => {
    const counts = countEventsByCity([
      event({ id: "pp", location: "Puerto Plata" }),
      event({ id: "sosua", location: "Sosúa" }),
      event({ id: "cab", location: "Cabarete" }),
      event({ id: "cab-2", location: "Cabarete", venue: "LAX Cabarete" }),
    ]);
    assert.equal(counts.all, 4);
    assert.equal(counts["puerto-plata"], 1);
    assert.equal(counts.sosua, 1);
    assert.equal(counts.cabarete, 2);
  });

  it("does not force Cabarete listings into Sosúa", () => {
    const counts = countEventsByCity([
      event({ id: "lax", location: "Cabarete", address: "Sosúa municipality" }),
    ]);
    assert.equal(counts.cabarete, 1);
    assert.equal(counts.sosua, 0);
  });

  it("counts Imbert patronales under Puerto Plata", () => {
    const counts = countEventsByCity([
      event({
        id: "mercedes",
        location: "Imbert",
        venue: "Plaza Sánchez, Imbert",
      }),
    ]);
    assert.equal(counts["puerto-plata"], 1);
    assert.equal(counts.sosua, 0);
    assert.equal(counts.cabarete, 0);
  });

  it("counts Guananico San Miguel patronales under Puerto Plata", () => {
    const counts = countEventsByCity([
      event({
        id: "san-miguel",
        location: "Guananico",
        venue: "Rincón Caliente, Guananico",
      }),
    ]);
    assert.equal(counts["puerto-plata"], 1);
    assert.equal(counts.sosua, 0);
    assert.equal(counts.cabarete, 0);
  });

  it("counts Costa Dorada listings under Puerto Plata", () => {
    const counts = countEventsByCity([
      event({
        id: "iberostar",
        location: "Costa Dorada",
        address: "Carretera Luperón Km 4, Costa Dorada",
        venue: "Iberostar Waves Costa Dorada",
      }),
    ]);
    assert.equal(counts["puerto-plata"], 1);
    assert.equal(counts.sosua, 0);
    assert.equal(counts.cabarete, 0);
  });

  it("counts Río Soñador / Yásica Arriba under Sosúa", () => {
    const counts = countEventsByCity([
      event({
        id: "sonador",
        location: "Yásica Arriba",
        venue: "Finca Papirucho",
        address: "HFW7+4FJ, Yásica Arriba",
      }),
    ]);
    assert.equal(counts.sosua, 1);
    assert.equal(counts.cabarete, 0);
    assert.equal(counts["puerto-plata"], 0);
  });

  it("counts Tubagua / Juan de Nina under Puerto Plata and Madre Vieja under Sosúa", () => {
    const counts = countEventsByCity([
      event({
        id: "militares",
        location: "Tubagua",
        venue: "Charco de los Militares",
        address: "MCF3+P2, Tubagua",
      }),
      event({
        id: "rejoya",
        location: "Juan de Nina",
        venue: "La Rejoya",
      }),
      event({
        id: "martinico",
        location: "Madre Vieja",
        venue: "Río Martinico",
      }),
    ]);
    assert.equal(counts["puerto-plata"], 2);
    assert.equal(counts.sosua, 1);
    assert.equal(counts.cabarete, 0);
  });
});

describe("venueMatchesCity", () => {
  it("maps neighborhood labels into Puerto Plata", () => {
    assert.equal(
      venueMatchesCity({ city: "Playa Dorada", name: "Blue Jacktar" }, "puerto-plata"),
      true,
    );
    assert.equal(
      venueMatchesCity({ city: "Costambar", name: "Coconut Cove" }, "puerto-plata"),
      true,
    );
    assert.equal(
      venueMatchesCity({ city: "Playa Dorada", name: "Blue Jacktar" }, "sosua"),
      false,
    );
  });

  it("keeps Cabarete and Sosúa distinct", () => {
    assert.equal(
      venueMatchesCity({ city: "Cabarete", name: "LAX Cabarete" }, "cabarete"),
      true,
    );
    assert.equal(
      venueMatchesCity({ city: "Cabarete", name: "LAX Cabarete" }, "sosua"),
      false,
    );
    assert.equal(
      venueMatchesCity({ city: "Sosúa", name: "Bar 39" }, "sosua"),
      true,
    );
  });
});
