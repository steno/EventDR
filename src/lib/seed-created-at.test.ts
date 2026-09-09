import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { getFallbackEvents } from "./fallback-events";
import { getHomeDiscoverLayout, getNewHighlightEvents } from "./home-layout";
import { SEED_CREATED_AT } from "./seed-created-at";

describe("seed createdAt for home New", () => {
  it("attaches SEED_CREATED_AT onto fallback listings", () => {
    const events = getFallbackEvents("en");
    const sampleId = "restaurant-week-puerto-plata-2026";
    const hit = events.find((e) => e.id === sampleId);
    assert.ok(hit, "expected restaurant week in fallback");
    assert.equal(hit!.createdAt, SEED_CREATED_AT[sampleId]);
  });

  it("surfaces recent seeds in getHomeDiscoverLayout.newEvents", () => {
    const events = getFallbackEvents("en");
    const layout = getHomeDiscoverLayout(events, {
      now: new Date("2026-09-09T18:00:00.000Z"),
    });
    assert.ok(layout.newEvents.length > 0, "expected Recently added highlights");
    assert.ok(
      layout.newEvents.every((e) => e.createdAt),
      "every Recently added card should have createdAt",
    );
    assert.ok(
      layout.newEvents.some((e) => e.id === "cuartel-bomberos-puerto-plata-daily"),
      "expected Cuartel Bomberos daily in Recently added when SEED_CREATED_AT is set",
    );
  });

  it("fills Coming up with future one-offs including Urban Fest", () => {
    const events = getFallbackEvents("en");
    const layout = getHomeDiscoverLayout(events, {
      now: new Date("2026-09-08T03:30:00.000Z"),
    });
    assert.ok(
      layout.comingUpEvents.length >= 6,
      `expected at least 6 Coming up cards, got ${layout.comingUpEvents.length}`,
    );
    assert.ok(
      layout.comingUpEvents.some((e) => e.id === "super-mega-urban-fest-2026-11-04"),
      "expected Super Mega Urban Fest in Coming up",
    );
    // Visible Coming up head is chronological; near-term dates lead, so a Nov
    // fest may sit past HOME_COMING_UP_LIMIT and still appear in Recently added.
    const comingUpHead = new Set(
      layout.comingUpEvents.slice(0, 6).map((e) => e.id),
    );
    for (let i = 1; i < layout.comingUpEvents.length; i++) {
      assert.ok(
        layout.comingUpEvents[i - 1]!.date <= layout.comingUpEvents[i]!.date,
        "Coming up should be chronological",
      );
    }
    assert.ok(
      !layout.newEvents
        .slice(0, 6)
        .some((e) => comingUpHead.has(e.id)),
      "visible Coming up head should not repeat in Recently added",
    );
  });

  it("getNewHighlightEvents respects maxAgeDays", () => {
    const events = getFallbackEvents("en");
    const fresh = getNewHighlightEvents(events, {
      now: new Date("2026-09-08T03:30:00.000Z"),
      maxAgeDays: 3,
    });
    assert.ok(fresh.every((e) => {
      const ms = Date.parse(e.createdAt!);
      return ms >= Date.parse("2026-09-05T03:30:00.000Z");
    }));
  });
});
