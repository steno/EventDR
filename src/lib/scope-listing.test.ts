import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  filterCatalogForScope,
  isListingSoftPath,
  parseScopeListingPath,
  scopeListingPath,
} from "./scope-listing";
import type { Event } from "./types";

function stubEvent(
  partial: Partial<Event> & Pick<Event, "id" | "category" | "location">,
): Event {
  return {
    title: partial.title ?? partial.id,
    description: "",
    date: "2099-01-01",
    time: "20:00",
    imageUrl: "",
    format: "physical",
    ...partial,
  };
}

describe("scope-listing", () => {
  it("detects listing soft paths", () => {
    assert.equal(isListingSoftPath("/en/category/music"), true);
    assert.equal(isListingSoftPath("/es/city/cabarete"), true);
    assert.equal(isListingSoftPath("/fr/events"), true);
    assert.equal(isListingSoftPath("/en/when/weekend"), true);
    assert.equal(isListingSoftPath("/en/event/abc"), false);
    assert.equal(isListingSoftPath("/en"), false);
  });

  it("parses and builds scope paths", () => {
    assert.deepEqual(parseScopeListingPath("/en/category/parties", "en"), {
      categoryId: "parties",
      regionScope: true,
    });
    assert.deepEqual(
      parseScopeListingPath("/en/city/sosua/category/music", "en"),
      {
        citySlug: "sosua",
        categoryId: "music",
      },
    );
    assert.equal(scopeListingPath("en", { categoryId: "music" }), "/en/category/music");
    assert.equal(
      scopeListingPath("en", { citySlug: "cabarete", categoryId: "parties" }),
      "/en/city/cabarete/category/parties",
    );
  });

  it("filters the catalog by city and category", () => {
    const catalog = [
      stubEvent({
        id: "1",
        category: "music",
        location: "Cabarete",
      }),
      stubEvent({
        id: "2",
        category: "parties",
        location: "Sosúa",
      }),
      stubEvent({
        id: "3",
        category: "music",
        location: "Sosúa",
        categories: ["concert"],
      }),
    ];

    const music = filterCatalogForScope(catalog, {
      categoryId: "music",
      regionScope: true,
    });
    assert.deepEqual(music.map((e) => e.id).sort(), ["1", "3"]);

    const sosuaMusic = filterCatalogForScope(catalog, {
      citySlug: "sosua",
      categoryId: "music",
    });
    assert.deepEqual(
      sosuaMusic.map((e) => e.id),
      ["3"],
    );
  });
});
