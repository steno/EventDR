import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { getDictionary } from "@/i18n/dictionaries";
import type { Event } from "@/lib/types";
import {
  clusterRecurringVenueEvents,
  eventsAfterVenueClustering,
  findVenueRecurringSiblings,
} from "./venue-recurring-siblings";
import { getRecurringEvents } from "./recurring-events";

const dict = getDictionary("en");

function event(partial: Partial<Event> & Pick<Event, "id" | "title">): Event {
  return {
    description: "",
    date: "2026-08-25",
    location: "Cabarete",
    category: "music",
    format: "physical",
    ...partial,
  };
}

describe("clusterRecurringVenueEvents", () => {
  it("keeps the first night and attaches sibling labels", () => {
    const sunday = event({
      id: "voyvoy-sunday-open-mic",
      title: "VOYVOY Sunday Open Mic",
      venueSlug: "voyvoy-cabarete",
      recurrence: "weekly",
      recurrenceDay: 0,
      date: "2026-08-30",
    });
    const monday = event({
      id: "voyvoy-monday-live-music",
      title: "VOYVOY Monday Live Music",
      venueSlug: "voyvoy-cabarete",
      recurrence: "weekly",
      recurrenceDay: 1,
      date: "2026-08-31",
    });
    const other = event({
      id: "lax-reggae-friday",
      title: "LAX Reggae Friday",
      venueSlug: "lax-cabarete",
      recurrence: "weekly",
      recurrenceDay: 5,
    });

    const clustered = clusterRecurringVenueEvents(
      [sunday, monday, other],
      "en",
      dict,
    );

    assert.equal(clustered.length, 2);
    assert.equal(clustered[0]?.id, "voyvoy-sunday-open-mic");
    assert.deepEqual(
      clustered[0]?.venueSiblings?.map((s) => s.id),
      ["voyvoy-monday-live-music"],
    );
    assert.equal(clustered[0]?.venueSiblings?.[0]?.label, "Every Mon");
    assert.equal(clustered[1]?.id, "lax-reggae-friday");
  });

  it("counts clustered rows, not every sibling night", () => {
    const sunday = event({
      id: "voyvoy-sunday-open-mic",
      title: "VOYVOY Sunday Open Mic",
      venueSlug: "voyvoy-cabarete",
      recurrence: "weekly",
      recurrenceDay: 0,
    });
    const monday = event({
      id: "voyvoy-monday-live-music",
      title: "VOYVOY Monday Live Music",
      venueSlug: "voyvoy-cabarete",
      recurrence: "weekly",
      recurrenceDay: 1,
    });
    const oneOff = event({
      id: "festival",
      title: "Festival",
      venueSlug: "kite-beach",
    });

    const visible = eventsAfterVenueClustering([sunday, monday, oneOff]);
    assert.deepEqual(
      visible.map((item) => item.id),
      ["voyvoy-sunday-open-mic", "festival"],
    );
  });

  it("does not cluster one-offs or single recurring nights", () => {
    const oneOff = event({
      id: "festival",
      title: "Festival",
      venueSlug: "voyvoy-cabarete",
      date: "2026-09-01",
    });
    const weekly = event({
      id: "voyvoy-monday-live-music",
      title: "VOYVOY Monday Live Music",
      venueSlug: "voyvoy-cabarete",
      recurrence: "weekly",
      recurrenceDay: 1,
    });

    const clustered = clusterRecurringVenueEvents(
      [oneOff, weekly],
      "en",
      dict,
    );
    assert.equal(clustered.length, 2);
    assert.equal(clustered[0]?.venueSiblings, undefined);
    assert.equal(clustered[1]?.venueSiblings, undefined);
  });
});

describe("findVenueRecurringSiblings", () => {
  it("returns other recurring nights at the same venue", () => {
    const weekday = event({
      id: "anfiteatro-la-puntilla-weekday-culture",
      title: "Weekday Culture",
      venueSlug: "anfiteatro-la-puntilla",
      recurrence: "weekdays",
    });
    const weekends = event({
      id: "anfiteatro-la-puntilla-concerts",
      title: "Concerts",
      venueSlug: "anfiteatro-la-puntilla",
      recurrence: "weekends",
    });
    const elsewhere = event({
      id: "other",
      title: "Other",
      venueSlug: "lax-cabarete",
      recurrence: "daily",
    });

    const siblings = findVenueRecurringSiblings(
      weekday,
      [weekday, weekends, elsewhere],
      "en",
      dict,
    );
    assert.equal(siblings.length, 1);
    assert.equal(siblings[0]?.id, "anfiteatro-la-puntilla-concerts");
    assert.equal(siblings[0]?.label, "Weekends");
  });

  it("lists Flip Flop weekly specials as other nights", () => {
    const pool = getRecurringEvents("en").filter(
      (event) => event.venueSlug === "flip-flop-sports-bar-sosua",
    );
    const daily = pool.find((event) => event.id === "flip-flop-live-sports-daily");
    assert.ok(daily);
    const siblings = findVenueRecurringSiblings(daily, pool, "en", dict);
    assert.deepEqual(
      siblings.map((s) => s.id).sort(),
      [
        "flip-flop-monday-happy-hour",
        "flip-flop-taco-tuesday",
        "flip-flop-wing-wednesday",
      ],
    );
  });
});
