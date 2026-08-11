import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  decidePlacesVenueLink,
  venueNamesAreCompatible,
} from "./ingest-venue";

describe("venueNamesAreCompatible", () => {
  it("accepts near-duplicates and containment", () => {
    assert.equal(
      venueNamesAreCompatible("Smiley's Bar", "Smiley's Bar & Restaurant"),
      true,
    );
    assert.equal(
      venueNamesAreCompatible("Liquid Blue", "Liquid Blue Cabarete"),
      true,
    );
    assert.equal(
      venueNamesAreCompatible("Castaways Sosua", "Castaways"),
      true,
    );
  });

  it("rejects unrelated Places snaps", () => {
    assert.equal(
      venueNamesAreCompatible("Rafaella's Studio", "Cabarete fitness"),
      false,
    );
    assert.equal(
      venueNamesAreCompatible("Rafaella's Studio", "Zen Fitness Camps"),
      false,
    );
    assert.equal(
      venueNamesAreCompatible("Voy Voy Cabarete", "Ocean World"),
      false,
    );
  });
});

describe("decidePlacesVenueLink", () => {
  it("skips weak matches that would create stub venues", () => {
    const decision = decidePlacesVenueLink(
      "Rafaella's Studio",
      "Cabarete fitness",
    );
    assert.deepEqual(decision, { action: "skip", reason: "seed-mismatch" });
  });

  it("rematches compatible Places names onto curated seeds", () => {
    const decision = decidePlacesVenueLink(
      "Zen Fitness",
      "Cabarete fitness",
    );
    assert.deepEqual(decision, {
      action: "use-seed",
      slug: "zen-fitness-cabarete",
    });
  });

  it("allows a stub when Places name matches the event venue", () => {
    const decision = decidePlacesVenueLink(
      "New Wave Surf School",
      "New Wave Surf School Cabarete",
    );
    assert.deepEqual(decision, {
      action: "create-stub",
      name: "New Wave Surf School Cabarete",
    });
  });

  it("skips when Places returns an unrelated non-seed name", () => {
    const decision = decidePlacesVenueLink(
      "Private Rooftop",
      "Blue Horizon Kite School",
    );
    assert.deepEqual(decision, { action: "skip", reason: "weak-match" });
  });

  it("skips when Places snaps to a different curated seed", () => {
    const decision = decidePlacesVenueLink(
      "Private Rooftop",
      "Ocean World",
    );
    assert.deepEqual(decision, { action: "skip", reason: "seed-mismatch" });
  });
});
