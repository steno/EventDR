import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { applyCuratedEventPatch } from "./curated-events";
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
