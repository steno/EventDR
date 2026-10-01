import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { slimEventForList } from "./list-payload";
import { searchEvents } from "./filters";

describe("slimEventForList", () => {
  it("keeps searchable baseball terms after stripping description", () => {
    const slim = slimEventForList({
      id: "atleticos-pp-vs-mineros-2026-10-03",
      title: "José Briceño Serie Final Game 4 — Atléticos vs Mineros",
      description:
        "Liga Nacional de Béisbol de Verano Serie Final Game 4 at Parque José Briceño",
      date: "2026-10-03",
      location: "Puerto Plata",
      venue: "Parque José Briceño",
      venueSlug: "parque-jose-briceno",
      category: "sports",
      format: "physical",
      imageEmoji: "⚾",
    });

    assert.equal(slim.description, "");
    assert.ok(slim.searchText);
    assert.match(slim.searchText!, /baseball|beisbol/);

    const hits = searchEvents([slim], "baseball");
    assert.equal(hits.length, 1);
    assert.equal(hits[0]?.id, "atleticos-pp-vs-mineros-2026-10-03");
  });
});
