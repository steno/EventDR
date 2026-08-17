import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { isEventFree } from "./event-tickets";

describe("isEventFree", () => {
  it("treats restaurant dining as free entry (pay for food, not admission)", () => {
    assert.equal(
      isEventFree({
        id: "la-casita-papi-beach-dining",
        title: "La Casita de Papi Beachfront Dining",
        description: "Sunset dinners on Cabarete Central Beach.",
        category: "food-drinks",
        recurrence: "daily",
      }),
      true,
    );
  });

  it("keeps open street food strips free when curated or explicit", () => {
    assert.equal(
      isEventFree({
        id: "malecon-kiosks-daily",
        title: "Malecón Evening Food Kiosks",
        description: "Street food along the waterfront.",
        category: "food-drinks",
        recurrence: "daily",
        isFree: true,
      }),
      true,
    );
  });

  it("treats no-cover copy as free without category heuristics", () => {
    assert.equal(
      isEventFree({
        id: "some-unknown-bar-night",
        title: "Beach Deck Night",
        description: "DJs on the sand — no cover most nights.",
        category: "music",
        recurrence: "daily",
      }),
      true,
    );
  });

  it("does not assume recurring music nights are free without a signal", () => {
    assert.equal(
      isEventFree({
        id: "unknown-cover-band-night",
        title: "Cover Band Night",
        description: "Live rock covers at a local pub.",
        category: "music",
        recurrence: "weekly",
      }),
      false,
    );
  });

  it("marks curated free open mics as free", () => {
    assert.equal(
      isEventFree({
        id: "batey-open-mic-weekly",
        title: "El Batey Open Mic",
        description: "Singers sign up at the door.",
        category: "performances",
        recurrence: "weekly",
      }),
      true,
    );
  });

  it("marks club and dance nights as not free when call-for-pricing", () => {
    assert.equal(
      isEventFree({
        id: "ojo-weekend-dj-parties",
        title: "Ojo Club Weekend DJ Parties",
        description: "Late-night dancing on the bay.",
        category: "parties",
        recurrence: "weekly",
      }),
      false,
    );
    assert.equal(
      isEventFree({
        id: "batey-salsa-weekly",
        title: "El Batey Salsa Social",
        description: "Beginner class then social dancing.",
        category: "dance",
        recurrence: "weekly",
      }),
      false,
    );
  });
});
