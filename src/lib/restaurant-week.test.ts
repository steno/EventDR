import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  isRestaurantWeekParticipantVenue,
  RESTAURANT_WEEK_2026_ID,
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
