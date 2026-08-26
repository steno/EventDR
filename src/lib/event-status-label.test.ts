import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { getDictionary } from "@/i18n/dictionaries";
import { resolveLiveStatusDisplay } from "./event-status-label";

const dict = getDictionary("en");

/** Wed Aug 26, 2026 00:24 America/Santo_Domingo. */
const AFTER_MIDNIGHT = new Date("2026-08-26T04:24:00.000Z");
/** Wed Aug 26, 2026 16:30 — 90 minutes before a 6 PM start. */
const NINETY_MIN_OUT = new Date("2026-08-26T20:30:00.000Z");
/** Wed Aug 26, 2026 15:30 — 150 minutes before a 6 PM start. */
const TWO_AND_A_HALF_HOURS_OUT = new Date("2026-08-26T19:30:00.000Z");

const eveningShow = {
  date: "2026-08-26",
  time: "6:00 PM–9:00 PM",
  recurrence: "weekly" as const,
};

describe("resolveLiveStatusDisplay starts soon", () => {
  it("does not say starts soon just after midnight on event day", () => {
    const display = resolveLiveStatusDisplay(eveningShow, dict, AFTER_MIDNIGHT);
    assert.notEqual(display?.label, dict.events.startsSoon);
  });

  it("omits the chip on the Today list until doors are actually soon", () => {
    const display = resolveLiveStatusDisplay(eveningShow, dict, AFTER_MIDNIGHT, {
      listTimeRange: "today",
    });
    assert.equal(display, null);
  });

  it("says starts soon within two hours of the parsed start", () => {
    const display = resolveLiveStatusDisplay(eveningShow, dict, NINETY_MIN_OUT);
    assert.equal(display?.status, "upcoming");
    assert.equal(display?.label, dict.events.startsSoon);
  });

  it("does not say starts soon more than two hours before doors", () => {
    const display = resolveLiveStatusDisplay(
      eveningShow,
      dict,
      TWO_AND_A_HALF_HOURS_OUT,
    );
    assert.notEqual(display?.label, dict.events.startsSoon);
  });
});
