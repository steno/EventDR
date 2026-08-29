import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  cityCountsForSelection,
  filterCatalogForScope,
  isDetailNavPath,
  isListingSoftPath,
  parseScopeListingPath,
  scopeListingPath,
  shouldSkipNavOverlay,
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
    assert.equal(isListingSoftPath("/en/cruise/taino-bay"), true);
    assert.equal(isListingSoftPath("/en/event/abc"), false);
    assert.equal(isListingSoftPath("/en"), false);
  });

  it("skips full overlay only for listing soft paths", () => {
    assert.equal(shouldSkipNavOverlay("/en/category/music"), true);
    assert.equal(shouldSkipNavOverlay("/en/event/plaza-independencia-daily"), false);
    assert.equal(shouldSkipNavOverlay("/es/venue/lax-cabarete"), false);
    assert.equal(shouldSkipNavOverlay("/en/for-partners"), false);
    assert.equal(isDetailNavPath("/en/event/plaza-independencia-daily"), true);
    assert.equal(isDetailNavPath("/es/venue/lax-cabarete"), true);
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

  it("counts cities against the selected category, not the full catalog", () => {
    const catalog = [
      stubEvent({ id: "1", category: "food-drinks", location: "Sosúa" }),
      stubEvent({ id: "2", category: "music", location: "Sosúa" }),
      stubEvent({ id: "3", category: "food-drinks", location: "Cabarete" }),
      stubEvent({ id: "4", category: "parties", location: "Puerto Plata" }),
    ];

    const allCounts = cityCountsForSelection(catalog, {});
    assert.equal(allCounts.all, 4);
    assert.equal(allCounts.sosua, 2);

    const foodCounts = cityCountsForSelection(catalog, {
      categoryId: "food-drinks",
    });
    assert.equal(foodCounts.all, 2);
    assert.equal(foodCounts.sosua, 1);
    assert.equal(foodCounts.cabarete, 1);
    assert.equal(foodCounts["puerto-plata"], 0);
  });

  it("counts clustered venue nights as one card per city", () => {
    const catalog = [
      stubEvent({
        id: "kite-daily",
        category: "sports",
        location: "Cabarete",
        venueSlug: "kite-beach",
        recurrence: "daily",
      }),
      stubEvent({
        id: "kite-culture",
        category: "sports",
        location: "Cabarete",
        venueSlug: "kite-beach",
        recurrence: "daily",
      }),
      stubEvent({
        id: "pickleball",
        category: "sports",
        location: "Cabarete",
        venueSlug: "sea-horse-ranch",
        recurrence: "weekly",
      }),
    ];

    const sportsCounts = cityCountsForSelection(catalog, {
      categoryId: "sports",
    });
    assert.equal(sportsCounts.cabarete, 2);
    assert.equal(sportsCounts.all, 2);
  });
});
