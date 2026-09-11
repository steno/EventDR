import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { pinTodayOneOffs, sortEventsForDisplay } from "./event-sort";
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

  it("ranks a future one-off above a recurring museum that opens later today", () => {
    /** Saturday Aug 1, 2026 00:53 America/Santo_Domingo — before museum hours. */
    const earlyMorning = new Date("2026-08-01T04:53:00.000Z");
    const museum = event({
      id: "museum-daily",
      title: "La Confluencia Ethnographic Museum",
      date: "2026-08-01",
      time: "9:00 AM – 5:00 PM",
      recurrence: "daily",
    });
    const vigil = event({
      id: "vigil-one-off",
      title: "Huelga-Velada Pacífica",
      date: "2026-08-07",
      time: "6:30 PM",
    });

    const sorted = sortEventsForDisplay([museum, vigil], {
      now: earlyMorning,
      discoveryMode: true,
      oneTimeFirst: true,
      preferPrimaryCategory: "culture",
      recurringLast: true,
    });
    assert.equal(sorted.map((e) => e.id).join(","), "vigil-one-off,museum-daily");
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

  it("keeps preferPrimary ahead of schedule within the same discovery band", () => {
    const secondary = event({
      id: "adventure-bleed",
      title: "Boat Snorkel Tour",
      date: "2026-08-08",
      time: "9:00 AM",
      category: "adventure",
      categories: ["sports"],
    });
    const primary = event({
      id: "sports-game",
      title: "Atléticos Home Game",
      date: "2026-08-09",
      time: "5:00 PM",
      category: "sports",
    });

    const sorted = sortEventsForDisplay([secondary, primary], {
      now: NOW,
      discoveryMode: true,
      oneTimeFirst: true,
      preferPrimaryCategory: "sports",
      recurringLast: true,
    });
    assert.equal(sorted.map((e) => e.id).join(","), "sports-game,adventure-bleed");
  });
});

describe("sortEventsForDisplay temporarilyClosed", () => {
  it("ranks a closed daily attraction below a live peer during listed hours", () => {
    const closed = event({
      id: "teleferico-puerto-plata-daily",
      title: "Teleférico Puerto Plata — Cable Car",
      date: "2026-07-31",
      time: "8:30 AM - 5:00 PM",
      recurrence: "daily",
      temporarilyClosed: true,
    });
    const liveShow = event({
      id: "live-concert",
      title: "Live Concert Tonight",
      date: "2026-07-31",
      time: "8:00 PM – 11:00 PM",
    });

    const sorted = sortEventsForDisplay([closed, liveShow], { now: NOW });
    assert.equal(sorted.map((e) => e.id).join(","), "live-concert,teleferico-puerto-plata-daily");
  });
});

describe("sortEventsForDisplay weekly vs daily", () => {
  it("ranks a future weekly night above a closed-today daily in discoveryMode", () => {
    const museum = event({
      id: "museum-daily",
      title: "La Confluencia Ethnographic Museum",
      date: "2026-07-31",
      time: "9:00 AM – 5:00 PM",
      recurrence: "daily",
    });
    const fridayReggae = event({
      id: "lax-friday-reggae",
      title: "Friday Reggae Night",
      date: "2026-08-07",
      time: "10:00 PM",
      recurrence: "weekly",
      recurrenceDay: 5,
    });

    const sorted = sortEventsForDisplay([museum, fridayReggae], {
      now: NOW,
      discoveryMode: true,
      oneTimeFirst: true,
      recurringLast: true,
    });
    assert.equal(
      sorted.map((e) => e.id).join(","),
      "lax-friday-reggae,museum-daily",
    );
  });

  it("ranks today’s untimed Thursday-only night above a live daily", () => {
    /** Thursday afternoon — rum tour still open, La Peña has no clock time. */
    const afternoon = new Date("2026-07-31T20:00:00.000Z");
    const laPena = event({
      id: "cigar-town-la-pena-thursdays",
      title: "La Peña at Cigar Town",
      date: "2026-07-31",
      recurrence: "weekly",
      recurrenceDay: 4,
    });
    const rumTour = event({
      id: "brugal-daily",
      title: "Brugal Rum Tour",
      date: "2026-07-31",
      time: "8:00 AM - 5:00 PM",
      recurrence: "daily",
    });

    const sorted = sortEventsForDisplay([rumTour, laPena], {
      now: afternoon,
      discoveryMode: true,
      oneTimeFirst: true,
      pinTodayOneOffs: true,
      recurringLast: true,
    });
    assert.equal(
      sorted.map((e) => e.id).join(","),
      "cigar-town-la-pena-thursdays,brugal-daily",
    );
  });

  it("ranks weekly before daily within the same future day when oneTimeFirst", () => {
    const dailyTour = event({
      id: "snorkel-daily",
      title: "Daily Snorkel Tour",
      date: "2026-08-07",
      time: "7:00 PM",
      recurrence: "daily",
    });
    const weeklyNight = event({
      id: "thursday-jazz",
      title: "Thursday Jazz",
      date: "2026-08-07",
      time: "7:00 PM",
      recurrence: "weekly",
      recurrenceDay: 4,
    });

    const byKind = sortEventsForDisplay([dailyTour, weeklyNight], {
      now: NOW,
      oneTimeFirst: true,
      recurringLast: true,
    });
    assert.equal(byKind.map((e) => e.id).join(","), "thursday-jazz,snorkel-daily");

    // Earlier start still wins over kind.
    const morningDaily = event({
      ...dailyTour,
      time: "10:00 AM",
    });
    const byTime = sortEventsForDisplay([morningDaily, weeklyNight], {
      now: NOW,
      oneTimeFirst: true,
      recurringLast: true,
    });
    assert.equal(byTime.map((e) => e.id).join(","), "snorkel-daily,thursday-jazz");
  });

  it("pins tonight’s weekly night above a live evergreen daily", () => {
    const afternoon = new Date("2026-07-31T20:00:00.000Z");
    const weekly = event({
      id: "friday-reggae",
      title: "Friday Reggae",
      date: "2026-07-31",
      time: "10:00 PM",
      recurrence: "weekly",
      recurrenceDay: 5,
      trending: true,
    });
    const museum = event({
      id: "museum-daily",
      title: "Museum Hours",
      date: "2026-07-31",
      time: "9:00 AM – 5:00 PM",
      recurrence: "daily",
    });

    const sorted = sortEventsForDisplay([museum, weekly], {
      now: afternoon,
      oneTimeFirst: true,
      pinTodayOneOffs: true,
      recurringLast: true,
    });
    assert.equal(sorted.map((e) => e.id).join(","), "friday-reggae,museum-daily");
  });

  it("treats near-daily weekly (5+ days) like everyday, not scarce", () => {
    const happyHour = event({
      id: "happy-hour-near-daily",
      title: "Happy Hour",
      date: "2026-08-07",
      time: "5:00 PM",
      recurrence: "weekly",
      recurrenceDays: [0, 1, 2, 3, 4, 5, 6],
    });
    const oneOff = event({
      id: "vigil-one-off",
      title: "Huelga-Velada Pacífica",
      date: "2026-08-07",
      time: "6:30 PM",
    });

    const sorted = sortEventsForDisplay([happyHour, oneOff], {
      now: NOW,
      discoveryMode: true,
      oneTimeFirst: true,
      recurringLast: true,
    });
    assert.equal(
      sorted.map((e) => e.id).join(","),
      "vigil-one-off,happy-hour-near-daily",
    );
  });
});

describe("sortEventsForDisplay pinTodayOneOffs", () => {
  /** Friday Jul 31, 2026 16:00 America/Santo_Domingo — museum still live, show upcoming. */
  const afternoon = new Date("2026-07-31T20:00:00.000Z");

  it("pins tonight’s one-off above a live evergreen daily", () => {
    const tonight = event({
      id: "tonight-play",
      title: "Civic Play Tonight",
      date: "2026-07-31",
      time: "7:30 PM",
      trending: true,
    });
    const museum = event({
      id: "museum-daily",
      title: "Museum Hours",
      date: "2026-07-31",
      time: "9:00 AM – 5:00 PM",
      recurrence: "daily",
    });

    const withoutPin = sortEventsForDisplay([museum, tonight], {
      now: afternoon,
      oneTimeFirst: true,
      recurringLast: true,
    });
    assert.equal(withoutPin[0]?.id, "museum-daily");

    const withPin = sortEventsForDisplay([museum, tonight], {
      now: afternoon,
      oneTimeFirst: true,
      pinTodayOneOffs: true,
      recurringLast: true,
    });
    assert.equal(withPin.map((e) => e.id).join(","), "tonight-play,museum-daily");
  });

  it("does not pin a future one-off above today’s live daily", () => {
    const nextWeek = event({
      id: "next-week-show",
      title: "Next Week Concert",
      date: "2026-08-07",
      time: "8:00 PM",
      trending: true,
    });
    const museum = event({
      id: "museum-daily",
      title: "Museum Hours",
      date: "2026-07-31",
      time: "9:00 AM – 5:00 PM",
      recurrence: "daily",
    });

    const sorted = sortEventsForDisplay([nextWeek, museum], {
      now: afternoon,
      oneTimeFirst: true,
      pinTodayOneOffs: true,
      recurringLast: true,
    });
    assert.equal(sorted[0]?.id, "museum-daily");
    assert.equal(sorted[1]?.id, "next-week-show");
  });

  it("keeps relative order among same-kind pinned peers", () => {
    const late = event({
      id: "late",
      title: "Late",
      date: "2026-07-31",
      time: "12:00 PM – 8:00 PM",
    });
    const early = event({
      id: "early",
      title: "Early",
      date: "2026-07-31",
      time: "10:00 AM – 6:00 PM",
    });
    const mid = event({
      id: "mid",
      title: "Mid",
      date: "2026-07-31",
      time: "11:00 AM – 7:00 PM",
    });

    const pinned = pinTodayOneOffs([late, early, mid], afternoon);
    assert.deepEqual(
      pinned.map((entry) => entry.id),
      ["late", "early", "mid"],
    );
  });
});
