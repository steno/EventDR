import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  isSecretLocationEvent,
  resolveEventCoords,
} from "./event-coords";

describe("event-coords secret locations", () => {
  it("detects secret / ubicación secreta venue labels", () => {
    assert.equal(
      isSecretLocationEvent({
        venue: "Secret location (Puerto Plata)",
        address: "Ubicación secreta — DM organizer",
      }),
      true,
    );
    assert.equal(
      isSecretLocationEvent({
        venue: "Hard Rock Cafe Puerto Plata",
        venueSlug: "hard-rock-sosua",
      }),
      false,
    );
  });

  it("does not resolve a map pin for secret-location nights even with lat/lng", () => {
    const coords = resolveEventCoords({
      format: "physical",
      location: "Puerto Plata",
      venue: "Secret location (Puerto Plata)",
      address: "Ubicación secreta — join WhatsApp",
      lat: 19.7935,
      lng: -70.688,
    });
    assert.equal(coords, null);
  });
});
