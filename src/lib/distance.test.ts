import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { bearingDegrees, haversineMeters } from "./distance";

describe("bearingDegrees", () => {
  it("aims east when the target is due east", () => {
    assert.equal(
      Math.round(
        bearingDegrees({ lat: 19.75, lng: -70.41 }, { lat: 19.75, lng: -70.4 }),
      ),
      90,
    );
  });

  it("aims north when the target is due north", () => {
    assert.equal(
      Math.round(
        bearingDegrees({ lat: 19.74, lng: -70.4 }, { lat: 19.75, lng: -70.4 }),
      ),
      0,
    );
  });
});

describe("haversineMeters", () => {
  it("measures ~1 km for 0.01° longitude near 20°N", () => {
    const meters = haversineMeters(
      { lat: 19.75, lng: -70.41 },
      { lat: 19.75, lng: -70.4 },
    );
    assert.ok(meters > 1000 && meters < 1100);
  });
});
