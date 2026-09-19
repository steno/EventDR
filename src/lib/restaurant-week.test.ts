import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  getRestaurantWeekLogoParticipants,
  isRestaurantWeekParticipantVenue,
  isRestaurantWeekPromoActive,
  RESTAURANT_WEEK_2026_ID,
  RESTAURANT_WEEK_LOGO_PARTICIPANTS,
} from "./restaurant-week";

describe("isRestaurantWeekParticipantVenue", () => {
  it("matches seeded participants while the week is current", () => {
    const during = new Date("2026-09-22T12:00:00-04:00");
    assert.equal(
      isRestaurantWeekParticipantVenue("aguaji-sosua", "en", during),
      true,
    );
    assert.equal(
      isRestaurantWeekParticipantVenue("bliss-cabarete", "en", during),
      true,
    );
    assert.equal(
      isRestaurantWeekParticipantVenue("el-parq-cabarete", "en", during),
      false,
    );
  });

  it("hides after Restaurant Week ends", () => {
    const after = new Date("2026-09-28T12:00:00-04:00");
    assert.equal(
      isRestaurantWeekParticipantVenue("aguaji-sosua", "en", after),
      false,
    );
  });

  it("exports the seed event id", () => {
    assert.equal(RESTAURANT_WEEK_2026_ID, "restaurant-week-puerto-plata-2026");
  });
});

describe("Restaurant Week home logo promo", () => {
  it("is active before and during the week, off after", () => {
    assert.equal(
      isRestaurantWeekPromoActive("en", new Date("2026-09-19T12:00:00-04:00")),
      true,
    );
    assert.equal(
      isRestaurantWeekPromoActive("en", new Date("2026-09-24T12:00:00-04:00")),
      true,
    );
    assert.equal(
      isRestaurantWeekPromoActive("en", new Date("2026-09-28T12:00:00-04:00")),
      false,
    );
  });

  it("lists 20 logo tiles with venue links where known", () => {
    assert.equal(RESTAURANT_WEEK_LOGO_PARTICIPANTS.length, 20);
    const withVenue = RESTAURANT_WEEK_LOGO_PARTICIPANTS.filter((p) => p.venueSlug);
    assert.ok(withVenue.length >= 18);
    assert.ok(
      RESTAURANT_WEEK_LOGO_PARTICIPANTS.every((p) =>
        p.logoSrc.startsWith("/events/restaurant-week-2026/logos/"),
      ),
    );
  });

  it("filters logo tiles by area", () => {
    const cabarete = getRestaurantWeekLogoParticipants("cabarete");
    assert.ok(cabarete.length >= 3);
    assert.ok(cabarete.every((p) => p.area === "cabarete"));
    assert.equal(
      getRestaurantWeekLogoParticipants(null).length,
      RESTAURANT_WEEK_LOGO_PARTICIPANTS.length,
    );
  });
});
