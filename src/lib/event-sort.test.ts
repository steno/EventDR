import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { sortEventsForDisplay } from "./event-sort";
import type { Event } from "./types";

/** Friday Jul 31, 2026 22:00 America/Santo_Domingo (UTC−4). */
const NOW = new Date("2026-08-01T02:00:00.000Z");

function event(partial: Partial<Event> & Pick<Event, "id" | "title" | "date">): Event {
  return {
    description: "",
    location: "Puerto Plata",
    category: "culture",
    format: "physical",
    ...partial,
  };
}

describe("sortEventsForDisplay discoveryMode", () => {
  it("ranks a future one-off above a closed-today recurring museum", () => {
    const museum = event({
      id: "museum-daily",
      title: "La Confluencia Ethnographic Museum",
      date: "2026-07-31",
      time: "9:00 AM – 5:00 PM",
      recurrence: "daily",
    });
    const vigil = event({
      id: "vigil-one-off",
      title: "Huelga-Velada Pacífica",
      date: "2026-08-07",
      time: "6:30 PM",
    });

    const withoutDiscovery = sortEventsForDisplay([museum, vigil], {
      now: NOW,
      oneTimeFirst: true,
      recurringLast: true,
    });
    assert.equal(withoutDiscovery[0]?.id, "museum-daily");

    const withDiscovery = sortEventsForDisplay([museum, vigil], {
      now: NOW,
      discoveryMode: true,
      oneTimeFirst: true,
      recurringLast: true,
    });
    assert.equal(withDiscovery.map((e) => e.id).join(","), "vigil-one-off,museum-daily");
  });

  it("keeps live urgency above a future one-off", () => {
    const liveShow = event({
      id: "live-concert",
      title: "Live Concert Tonight",
      date: "2026-07-31",
      time: "8:00 PM – 11:00 PM",
    });
    const vigil = event({
      id: "vigil-one-off",
      title: "Huelga-Velada Pacífica",
      date: "2026-08-07",
      time: "6:30 PM",
    });

    const sorted = sortEventsForDisplay([vigil, liveShow], {
      now: NOW,
      discoveryMode: true,
      oneTimeFirst: true,
    });
    assert.equal(sorted.map((e) => e.id).join(","), "live-concert,vigil-one-off");
  });
});
