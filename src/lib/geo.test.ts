import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { filterByVenueSlug } from "./geo";
import { getFallbackEvents } from "./fallback-events";
import { matchVenueSlug } from "./venues-seed";
import type { Event } from "./types";

function stubEvent(
  partial: Partial<Event> & Pick<Event, "id" | "title">,
): Event {
  return {
    description: "",
    date: "2099-01-01",
    time: "20:00",
    location: partial.location ?? "Cabarete",
    category: "music",
    imageUrl: "",
    format: "physical",
    ...partial,
  };
}

describe("matchVenueSlug", () => {
  it("does not treat a city or another park as El Parq Foodpark", () => {
    assert.equal(matchVenueSlug("Cabarete"), undefined);
    assert.equal(matchVenueSlug("Puerto Plata"), undefined);
    assert.equal(
      matchVenueSlug("Letrero de Puerto Plata"),
      "letrero-puerto-plata",
    );
    assert.notEqual(matchVenueSlug("Parque Independencia"), "el-parq-cabarete");
    assert.equal(matchVenueSlug("El Parq Foodpark"), "el-parq-cabarete");
    assert.equal(matchVenueSlug("Taino Bay"), "taino-bay");
    assert.equal(matchVenueSlug("Port Taino Bay Puerto Plata"), "taino-bay");
    assert.equal(matchVenueSlug("Amber Cove"), "amber-cove");
    assert.equal(matchVenueSlug("Puerto Amber Cove"), "amber-cove");
  });
});

describe("filterByVenueSlug", () => {
  it("keeps only events for that venue, even if the catalog is the full region", () => {
    const catalog = [
      stubEvent({
        id: "el-parq-live-bands-saturday",
        title: "El Parq Saturday Live Bands",
        venue: "El Parq Foodpark",
        venueSlug: "el-parq-cabarete",
        location: "Cabarete",
      }),
      stubEvent({
        id: "letrero-puerto-plata-daily",
        title: "Letrero de Puerto Plata — Photo Letters",
        venue: "Letrero de Puerto Plata",
        venueSlug: "letrero-puerto-plata",
        location: "Puerto Plata",
      }),
      stubEvent({
        id: "lax-reggae-friday",
        title: "LAX Reggae Friday",
        venue: "LAX Cabarete",
        venueSlug: "lax-cabarete",
        location: "Cabarete",
      }),
    ];

    const elParq = filterByVenueSlug(catalog, "el-parq-cabarete");
    assert.deepEqual(
      elParq.map((event) => event.id),
      ["el-parq-live-bands-saturday"],
    );
  });

  it("does not attach El Parq to the live North Coast fallback catalog", () => {
    const catalog = getFallbackEvents("en");
    const elParq = filterByVenueSlug(catalog, "el-parq-cabarete");
    assert.ok(elParq.length > 0 && elParq.length < 10);
    assert.ok(
      elParq.every(
        (event) =>
          event.venueSlug === "el-parq-cabarete" ||
          (event.participants ?? []).some(
            (name) => matchVenueSlug(name) === "el-parq-cabarete",
          ),
      ),
    );
    assert.equal(
      elParq.some((event) => event.id.includes("letrero")),
      false,
    );
  });

  it("surfaces Restaurant Week on participant venue schedules", () => {
    const catalog = getFallbackEvents("en");
    const forAguaji = filterByVenueSlug(catalog, "aguaji-sosua");
    assert.ok(
      forAguaji.some((event) => event.id === "restaurant-week-puerto-plata-2026"),
    );
    const forBliss = filterByVenueSlug(catalog, "bliss-cabarete");
    assert.ok(
      forBliss.some((event) => event.id === "restaurant-week-puerto-plata-2026"),
    );
    // Unrelated venue should not pick it up via participants.
    assert.equal(
      filterByVenueSlug(catalog, "el-parq-cabarete").some(
        (e) => e.id === "restaurant-week-puerto-plata-2026",
      ),
      false,
    );
  });
});
