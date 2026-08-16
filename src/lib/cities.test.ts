import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { countEventsByCity } from "./cities";
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
});
