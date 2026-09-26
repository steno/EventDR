import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { hasMapCoords } from "./event-coords";
import { SEED_VENUES } from "./venues-seed";

describe("SEED_VENUES map pins", () => {
  it("requires a finite lat/lng on every seed venue (How to get there / Leaflet)", () => {
    const missing = SEED_VENUES.filter((venue) => !hasMapCoords(venue)).map(
      (venue) => venue.slug,
    );
    assert.deepEqual(
      missing,
      [],
      `Seed venues missing map coords (breaks VenueMapPanel): ${missing.join(", ")}`,
    );
  });
});

describe("hasMapCoords", () => {
  it("rejects undefined or non-finite pins", () => {
    assert.equal(hasMapCoords({ lat: 19.7, lng: -70.6 }), true);
    assert.equal(hasMapCoords({ lat: undefined, lng: -70.6 }), false);
    assert.equal(hasMapCoords({ lat: 19.7, lng: Number.NaN }), false);
    assert.equal(hasMapCoords(null), false);
  });
});
