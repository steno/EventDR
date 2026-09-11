import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { applyCuratedEventPatch, SANTA_FE_NEW_RATES_FROM } from "./curated-events";
import { resolveLiveStatusDisplay } from "./event-status-label";
import { getDictionary } from "@/i18n/dictionaries";
import type { Event } from "./types";

const dict = getDictionary("en");

function event(partial: Partial<Event> & Pick<Event, "id" | "title">): Event {
  return {
    description: "",
    date: "2026-01-01",
    time: "9:00 AM – 6:00 PM",
    location: "Puerto Plata",
    category: "adventure",
    format: "physical",
    recurrence: "daily",
    ...partial,
  };
}

describe("applyCuratedEventPatch editorial closures", () => {
  const iberostar = event({
    id: "iberostar-costa-dorada-day-pass",
    title: "Iberostar Waves Costa Dorada Day Pass",
    venueSlug: "iberostar-waves-costa-dorada",
  });

  it("shows temporarily closed instead of happening now during Iberostar refurb", () => {
    const midday = new Date("2026-09-01T16:30:00.000Z");
    const patched = applyCuratedEventPatch(iberostar, midday);
    assert.equal(patched.temporarilyClosed, true);
    const display = resolveLiveStatusDisplay(patched, dict, midday, {
      listTimeRange: "today",
    });
    assert.equal(display?.status, "temporarilyClosed");
    assert.equal(display?.label, dict.events.temporarilyClosed);
    assert.notEqual(display?.label, dict.events.happeningNow);
  });

  it("returns to live hours after the hotel reopens", () => {
    const after = new Date("2026-10-27T16:30:00.000Z");
    const patched = applyCuratedEventPatch(iberostar, after);
    assert.equal(patched.temporarilyClosed, undefined);
  });
});

describe("Santa Fe Oct 2026 day-pass rates", () => {
  const santaFe = event({
    id: "santa-fe-sov-day-pass",
    title: "Santa Fe Day Pass",
    description: "Stale Firebase copy still calling the pass consumable.",
    venueSlug: "santa-fe-sov",
  });

  it("keeps current consumable hours and announces the 12 Oct switch", () => {
    const before = applyCuratedEventPatch(
      santaFe,
      new Date("2026-09-11T16:00:00.000Z"),
    );
    assert.match(before.description, /Through 11 Oct 2026/);
    assert.match(before.description, /the day pass is consumable/);
    assert.match(before.description, /From 12 Oct 2026/);
    assert.match(before.description, /non-consumable rates/);
    assert.match(before.description, /RD\$1,000/);
    assert.equal(before.localized?.description?.es?.includes("no consumibles"), true);
    assert.equal(SANTA_FE_NEW_RATES_FROM, "2026-10-12");
  });

  it("switches to daily 10–7 non-consumable copy on 12 Oct", () => {
    const after = applyCuratedEventPatch(
      santaFe,
      new Date("2026-10-12T16:00:00.000Z"),
    );
    assert.match(after.description, /Open daily 10:00 AM–7:00 PM/);
    assert.match(after.description, /Non-consumable day pass/);
    assert.equal(after.description.includes("Through 11 Oct"), false);
    assert.equal(after.description.includes("still consumable"), false);
    assert.equal(after.time, "10:00 AM – 7:00 PM");
    assert.equal(
      after.localized?.description?.es?.includes("Day pass no consumible"),
      true,
    );
  });
});
