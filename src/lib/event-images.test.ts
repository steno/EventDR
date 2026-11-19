import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  attachEventImage,
  getEventImageUrl,
  preferVenueImageForFoodDrinksCategory,
} from "./event-images";
import { getVenueImageUrl } from "./venue-images";

describe("attachEventImage", () => {
  it("aliases ingest-deep-caves-tour to the curated El Choco cave photo", () => {
    const curated = getEventImageUrl("el-choco-cave-tour-swimming-daily");
    assert.ok(curated?.startsWith("/events/el-choco-cave-tour-swimming-daily.jpg"));

    const attached = attachEventImage({
      id: "ingest-deep-caves-tour",
      venueSlug: "parque-nacional-el-choco",
      imageUrl:
        "https://a.veronikasadventure.com/tour/deep-caves-in-cabarete-with-guided-tour-and-swimming-t1048496-3.jpg",
    });

    assert.equal(attached.imageUrl, getEventImageUrl("ingest-deep-caves-tour"));
    assert.ok(
      attached.imageUrl?.startsWith("/events/el-choco-cave-tour-swimming-daily.jpg"),
    );
  });

  it("drops CSP-blocked remote heroes and falls back to the venue photo", () => {
    const attached = attachEventImage({
      id: "some-random-ingest",
      venueSlug: "parque-nacional-el-choco",
      imageUrl:
        "https://a.veronikasadventure.com/tour/deep-caves-in-cabarete-with-guided-tour-and-swimming-t1048496-3.jpg",
    });

    assert.ok(attached.imageUrl?.startsWith("/venues/parque-nacional-el-choco-cave.jpg"));
  });

  it("keeps local curated paths", () => {
    const attached = attachEventImage({
      id: "local-hero-event",
      imageUrl: "/events/el-choco-cave-tour-swimming-daily.jpg?v=abc",
    });
    assert.equal(
      attached.imageUrl,
      "/events/el-choco-cave-tour-swimming-daily.jpg?v=abc",
    );
  });

  it("picks locale-specific curated flyers when provided", () => {
    const id = "petit-francois-canadian-thanksgiving-2026-10-12";
    assert.ok(
      getEventImageUrl(id, "en")?.includes(
        "petit-francois-canadian-thanksgiving-2026-10-12-en.jpg",
      ),
    );
    assert.ok(
      getEventImageUrl(id, "es")?.includes(
        "petit-francois-canadian-thanksgiving-2026-10-12-es.jpg",
      ),
    );
    assert.ok(
      getEventImageUrl(id, "fr")?.includes(
        "petit-francois-canadian-thanksgiving-2026-10-12-fr.jpg",
      ),
    );
    assert.equal(
      attachEventImage({ id }, "es").imageUrl,
      getEventImageUrl(id, "es"),
    );
  });
});

describe("preferVenueImageForFoodDrinksCategory", () => {
  it("swaps a curated flyer for the venue place shot when one exists", () => {
    const venueImage = getVenueImageUrl("parada-tipica-el-choco");
    assert.ok(venueImage?.startsWith("/venues/"));

    const swapped = preferVenueImageForFoodDrinksCategory({
      id: "parada-el-choco-thanksgiving-big-d-2026-11-26",
      venueSlug: "parada-tipica-el-choco",
      imageUrl: "/events/parada-el-choco-thanksgiving-big-d-2026-11-26.jpg",
    });
    assert.equal(swapped.imageUrl, venueImage);
  });

  it("keeps the flyer when the venue has no place shot", () => {
    const flyer = "/events/some-flyer.jpg";
    const kept = preferVenueImageForFoodDrinksCategory({
      id: "orphan-food-night",
      venueSlug: "venue-with-no-mapped-photo-zzzz",
      imageUrl: flyer,
    });
    assert.equal(kept.imageUrl, flyer);
  });

  it("keeps the flyer when there is no venueSlug", () => {
    const flyer = "/events/some-flyer.jpg";
    const kept = preferVenueImageForFoodDrinksCategory({
      id: "no-venue-food-night",
      imageUrl: flyer,
    });
    assert.equal(kept.imageUrl, flyer);
  });
});
