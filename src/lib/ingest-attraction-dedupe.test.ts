import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  filterSeededAttractionClones,
  matchesSeededAttraction,
} from "./ingest-attraction-dedupe";
import type { Event } from "./types";

function event(partial: Partial<Event> & Pick<Event, "id" | "title">): Event {
  return {
    description: "",
    date: "2026-09-27",
    location: "Cabarete",
    category: "adventure",
    format: "physical",
    ...partial,
  };
}

describe("matchesSeededAttraction", () => {
  it("flags OTA Deep Caves / El Choco clones of the curated daily seed", () => {
    assert.equal(
      matchesSeededAttraction(
        event({
          id: "ingest-deep-caves-tour",
          title: "Deep Caves in Cabarete with Guided Tour and Swimming",
          venue: "Chocó National Park",
        }),
      ),
      true,
    );
    assert.equal(
      matchesSeededAttraction(
        event({
          id: "other",
          title: "Cuevas del Choco sunset walk",
        }),
      ),
      true,
    );
  });

  it("keeps unrelated Cabarete nightlife", () => {
    assert.equal(
      matchesSeededAttraction(
        event({
          id: "nightlife",
          title: "Sunset Beach Party Cabarete",
          category: "nightlife",
        }),
      ),
      false,
    );
  });
});

describe("filterSeededAttractionClones", () => {
  it("drops El Choco OTA clones and keeps novel listings", () => {
    const kept = filterSeededAttractionClones([
      event({
        id: "ingest-deep-caves-tour",
        title: "Deep Caves in Cabarete with Guided Tour and Swimming",
      }),
      event({
        id: "new-show",
        title: "Live Jazz at Onno's",
        category: "music",
      }),
    ]);
    assert.deepEqual(
      kept.map((e) => e.id),
      ["new-show"],
    );
  });
});
