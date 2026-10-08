import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { formatEventPlace } from "./event-location";

describe("formatEventPlace", () => {
  it("shows street + city when address is set (not the venue name)", () => {
    assert.equal(
      formatEventPlace({
        venue: "Mike's Finish Line Bar",
        address: "Calle Ayuntamiento 1",
        location: "Sosúa",
      }),
      "Calle Ayuntamiento 1, Sosúa",
    );
  });

  it("falls back to venue + city without an address or known venue street", () => {
    assert.equal(
      formatEventPlace({
        venue: "Unknown Pop-Up Patio",
        location: "Sosúa",
      }),
      "Unknown Pop-Up Patio, Sosúa",
    );
  });

  it("resolves street from venueSlug when event has no address", () => {
    assert.equal(
      formatEventPlace({
        venue: "Mike's Finish Line Bar",
        venueSlug: "finish-line-sosua",
        location: "Sosúa",
      }),
      "Calle Ayuntamiento 1, Sosúa",
    );
  });

  it("strips postal-code tails from address", () => {
    assert.equal(
      formatEventPlace({
        venue: "Mike's Finish Line Bar",
        address: "Calle Ayuntamiento 1, Sosúa 57000",
        location: "Sosúa",
      }),
      "Calle Ayuntamiento 1, Sosúa",
    );
  });
});
