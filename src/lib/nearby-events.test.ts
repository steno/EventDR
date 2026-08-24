import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  findNearbyForEventDetail,
  findNearbyOnStrip,
  findNearbyTonight,
} from "./nearby-events";
import type { Event } from "./types";

/** Saturday Aug 1, 2026 evening AST. */
const NOW = new Date("2026-08-01T22:00:00.000Z");

function event(
  partial: Partial<Event> & Pick<Event, "id" | "title" | "date">,
): Event {
  return {
    description: "",
    location: "Sosúa",
    category: "music",
    format: "physical",
    ...partial,
  };
}

describe("findNearbyTonight", () => {
  it("returns same-strip events within El Batey and marks park-once", () => {
    const source = event({
      id: "smileys-night",
      title: "Live at Smiley's",
      date: "2026-08-01",
      time: "8:00 PM",
      venue: "Smiley's Bar & Restaurant",
      venueSlug: "smileys-bar-sosua",
      lat: 19.7679864,
      lng: -70.5100086,
    });
    const cheers = event({
      id: "cheers-night",
      title: "Rock night at Cheers",
      date: "2026-08-01",
      time: "9:30 PM",
      venue: "Cheers Bar & Grill",
      venueSlug: "cheers-bar-sosua",
      lat: 19.7678473,
      lng: -70.5103493,
    });
    const cabarete = event({
      id: "lax-night",
      title: "Reggae at LAX",
      date: "2026-08-01",
      time: "10:00 PM",
      location: "Cabarete",
      venue: "LAX Cabarete",
      venueSlug: "lax-cabarete",
      lat: 19.7503643,
      lng: -70.406125,
    });

    const result = findNearbyTonight(source, [source, cheers, cabarete], {
      now: NOW,
    });

    assert.equal(result.hits.length, 1);
    assert.equal(result.hits[0]?.event.id, "cheers-night");
    assert.equal(result.hits[0]?.relation, "same-pocket");
    assert.equal(result.parkOnce, true);
    assert.equal(result.pocket?.slug, "el-batey");
    assert.equal(result.isToday, true);
  });

  it("includes walk-radius hits outside curated membership", () => {
    // Mid Sosúa–Cabarete corridor — outside El Batey / Cabarete Bay pockets.
    const source = event({
      id: "a",
      title: "Source",
      date: "2026-08-01",
      time: "7:00 PM",
      location: "Sosúa",
      lat: 19.76,
      lng: -70.48,
      venue: "Custom Pin A",
    });
    const nearby = event({
      id: "b",
      title: "Nearby pin",
      date: "2026-08-01",
      time: "8:00 PM",
      location: "Sosúa",
      lat: 19.761,
      lng: -70.481,
      venue: "Custom Pin B",
    });
    const far = event({
      id: "c",
      title: "Far pin",
      date: "2026-08-01",
      time: "8:00 PM",
      lat: 19.8,
      lng: -70.7,
      venue: "Far Away",
      location: "Puerto Plata",
    });

    const result = findNearbyTonight(source, [source, nearby, far], {
      now: NOW,
    });

    assert.equal(result.hits.map((h) => h.event.id).join(","), "b");
    assert.equal(result.hits[0]?.relation, "walk");
    assert.equal(result.parkOnce, false);
  });

  it("skips daily attractions next to nightlife, not next to daytime walks", () => {
    const nightlife = event({
      id: "show",
      title: "Concert",
      date: "2026-08-01",
      time: "8:00 PM",
      venueSlug: "smileys-bar-sosua",
      lat: 19.7679864,
      lng: -70.5100086,
    });
    const museum = event({
      id: "museum",
      title: "Jewish Museum",
      date: "2026-08-01",
      time: "9:00 AM – 5:00 PM",
      recurrence: "daily",
      venueSlug: "sosua-jewish-museum",
      lat: 19.7654983,
      lng: -70.5163301,
      category: "culture",
    });
    const tomorrow = event({
      id: "tomorrow-show",
      title: "Tomorrow at Cheers",
      date: "2026-08-02",
      time: "9:00 PM",
      venueSlug: "cheers-bar-sosua",
      lat: 19.7678473,
      lng: -70.5103493,
    });

    assert.equal(
      findNearbyTonight(nightlife, [nightlife, museum, tomorrow], {
        now: NOW,
      }).hits.length,
      0,
    );

    const umbrellas = event({
      id: "sombrillas",
      title: "Umbrella Street",
      date: "2026-08-01",
      time: "9:00 AM - 9:00 PM",
      recurrence: "daily",
      venueSlug: "calle-sombrillas",
      location: "Puerto Plata",
      lat: 19.7968,
      lng: -70.6935,
      category: "culture",
    });
    const pinkStreet = event({
      id: "paseo",
      title: "Pink Street",
      date: "2026-08-01",
      time: "9:00 AM - 9:00 PM",
      recurrence: "daily",
      venueSlug: "paseo-dona-blanca",
      location: "Puerto Plata",
      lat: 19.7969,
      lng: -70.6938,
      category: "culture",
    });
    const rum = event({
      id: "rum",
      title: "Rum Museum",
      date: "2026-08-01",
      time: "9:30 AM – 4:30 PM",
      recurrence: "daily",
      venueSlug: "rum-legacy-museum",
      location: "Puerto Plata",
      lat: 19.7972,
      lng: -70.694,
      category: "culture",
    });

    const daytimeNow = new Date("2026-08-01T14:00:00.000-04:00"); // mid-afternoon
    const daytime = findNearbyTonight(
      umbrellas,
      [umbrellas, pinkStreet, rum, museum],
      { now: daytimeNow },
    );
    assert.equal(daytime.hits.length >= 2, true);
    assert.equal(
      daytime.hits.some((h) => h.event.id === "paseo"),
      true,
    );
  });

  it("excludes hops beyond a comfortable walk even in the same pocket", () => {
    const greenOne = event({
      id: "paella",
      title: "One Playa Dorada",
      date: "2026-08-01",
      time: "12:00 PM – 10:00 PM",
      recurrence: "daily",
      venueSlug: "paella-pop-green-one",
      location: "Puerto Plata",
      lat: 19.7674958,
      lng: -70.6482428,
      category: "food-drinks",
    });
    const senorRock = event({
      id: "senor-rock",
      title: "Señor Rock",
      date: "2026-08-01",
      time: "7:00 PM – 11:00 PM",
      venueSlug: "senor-rock-playa-dorada",
      location: "Puerto Plata",
      lat: 19.7694757,
      lng: -70.6430326,
      category: "music",
    });
    const funCity = event({
      id: "fun-city",
      title: "Fun City Go-Karts",
      date: "2026-08-01",
      time: "10:00 AM – 6:00 PM",
      recurrence: "daily",
      venueSlug: "fun-city",
      location: "Puerto Plata",
      lat: 19.7450324,
      lng: -70.6353642,
      category: "adventure",
    });

    const result = findNearbyTonight(
      greenOne,
      [greenOne, senorRock, funCity],
      { now: NOW },
    );

    assert.equal(
      result.hits.some((h) => h.event.id === "fun-city"),
      false,
    );
    assert.equal(
      result.hits.some((h) => h.event.id === "senor-rock"),
      true,
    );
  });

  it("prefers same-venue over farther pocket mates", () => {
    const source = event({
      id: "early",
      title: "Early set",
      date: "2026-08-01",
      time: "6:00 PM",
      venueSlug: "lax-cabarete",
      lat: 19.7503643,
      lng: -70.406125,
    });
    const laterSameVenue = event({
      id: "late",
      title: "Late set",
      date: "2026-08-01",
      time: "10:00 PM",
      venueSlug: "lax-cabarete",
      lat: 19.7503643,
      lng: -70.406125,
    });
    const otherStrip = event({
      id: "chabola",
      title: "Open mic",
      date: "2026-08-01",
      time: "7:00 PM",
      venueSlug: "la-chabola-cabarete",
      lat: 19.7475887,
      lng: -70.4167516,
    });

    const result = findNearbyTonight(
      source,
      [source, laterSameVenue, otherStrip],
      { now: NOW },
    );

    assert.equal(result.hits[0]?.event.id, "late");
    assert.equal(result.hits[0]?.relation, "same-venue");
  });
});

describe("findNearbyOnStrip", () => {
  it("lists upcoming strip neighbors for a venue hub", () => {
    const hub = event({
      id: "__venue__el-batey-sosua",
      title: "El Batey",
      date: "2026-08-11",
      venueSlug: "el-batey-sosua",
      lat: 19.7676443,
      lng: -70.5085273,
    });
    const wed = event({
      id: "finish-line",
      title: "Finish Line live",
      date: "2026-08-12",
      time: "8:00 PM",
      venueSlug: "finish-line-sosua",
      lat: 19.7661412,
      lng: -70.5130522,
    });
    const sat = event({
      id: "smileys",
      title: "Smiley's Saturday",
      date: "2026-08-15",
      time: "8:00 PM",
      venueSlug: "smileys-bar-sosua",
      lat: 19.7679864,
      lng: -70.5100086,
    });
    const far = event({
      id: "lax",
      title: "LAX",
      date: "2026-08-14",
      time: "10:00 PM",
      location: "Cabarete",
      venueSlug: "lax-cabarete",
      lat: 19.7503643,
      lng: -70.406125,
    });

    const result = findNearbyOnStrip(hub, [hub, wed, sat, far], {
      now: new Date("2026-08-11T18:00:00.000-04:00"),
    });

    assert.equal(result.stripAhead, true);
    assert.equal(result.parkOnce, true);
    assert.equal(
      result.hits.map((h) => h.event.id).join(","),
      "finish-line,smileys",
    );
  });

  it("lists El Carey nights from the Costambar beach hub", () => {
    const hub = event({
      id: "__venue__playa-costambar",
      title: "Playa Costambar",
      date: "2026-08-24",
      venueSlug: "playa-costambar",
      location: "Costambar",
      lat: 19.81515,
      lng: -70.71555,
    });
    const karaoke = event({
      id: "el-carey-karaoke-mujeres-monday",
      title: "Empowered Women’s Sunset Karaoke",
      date: "2026-08-24",
      time: "6:00 PM",
      venueSlug: "el-carey-puerto-plata",
      location: "Costambar",
      lat: 19.8145247,
      lng: -70.7150884,
      category: "performances",
    });
    const nightlife = event({
      id: "el-carey-weekend-nightlife",
      title: "El Carey Weekend Nightlife",
      date: "2026-08-28",
      time: "8:00 PM – 2:00 AM",
      venueSlug: "el-carey-puerto-plata",
      location: "Costambar",
      lat: 19.8145247,
      lng: -70.7150884,
      category: "parties",
    });
    const far = event({
      id: "lax",
      title: "LAX",
      date: "2026-08-25",
      time: "10:00 PM",
      location: "Cabarete",
      venueSlug: "lax-cabarete",
      lat: 19.7503643,
      lng: -70.406125,
    });

    const result = findNearbyOnStrip(hub, [hub, karaoke, nightlife, far], {
      now: new Date("2026-08-24T11:00:00.000-04:00"),
      preferEvening: true,
    });

    assert.equal(result.stripAhead, true);
    assert.equal(result.pocket?.slug, "costambar-beach");
    assert.equal(result.hits.length, 1);
    assert.equal(result.hits[0]?.event.venueSlug, "el-carey-puerto-plata");
    assert.equal(
      result.hits.some((h) => h.event.venueSlug === "lax-cabarete"),
      false,
    );
  });

  it("does not treat inland Hotel Ocean Winds as Costambar Beach", () => {
    const hub = event({
      id: "__venue__playa-costambar",
      title: "Playa Costambar",
      date: "2026-08-24",
      venueSlug: "playa-costambar",
      location: "Costambar",
      lat: 19.81515,
      lng: -70.71555,
    });
    const oceanWinds = event({
      id: "ocean-winds-karaoke-nights",
      title: "Ocean Winds Saturday Karaoke",
      date: "2026-08-29",
      time: "8:00 PM",
      venueSlug: "hotel-ocean-winds",
      location: "Costambar",
      lat: 19.814951,
      lng: -70.711963,
      category: "performances",
    });

    const result = findNearbyOnStrip(hub, [hub, oceanWinds], {
      now: new Date("2026-08-24T11:00:00.000-04:00"),
      preferEvening: true,
    });

    assert.equal(
      result.hits.some((h) => h.event.venueSlug === "hotel-ocean-winds"),
      false,
    );
  });
});

describe("findNearbyForEventDetail", () => {
  it("falls back to strip look-ahead when the night is quiet", () => {
    const source = event({
      id: "cigar-night",
      title: "Cigar Town Sessions",
      date: "2026-08-14",
      time: "8:00 PM",
      location: "Puerto Plata",
      venueSlug: "cigar-town-pop",
      lat: 19.7915,
      lng: -70.6805,
    });
    const satShow = event({
      id: "malecon-sat",
      title: "Malecón concert",
      date: "2026-08-15",
      time: "7:00 PM",
      location: "Puerto Plata",
      venueSlug: "malecon-puerto-plata",
      lat: 19.7905058,
      lng: -70.6718446,
      category: "concert",
    });
    const museum = event({
      id: "ambar",
      title: "Amber Museum",
      date: "2026-08-15",
      time: "9:00 AM – 3:00 PM",
      location: "Puerto Plata",
      venueSlug: "museo-ambar",
      lat: 19.796,
      lng: -70.693,
      category: "culture",
    });

    const result = findNearbyForEventDetail(
      source,
      [source, satShow, museum],
      {
        now: new Date("2026-08-11T18:00:00.000-04:00"),
      },
    );

    assert.equal(result.stripAhead, true);
    assert.equal(result.hits[0]?.event.id, "malecon-sat");
  });

  it("surfaces Costambar strip nights for a fitness class that starts later", () => {
    const fitness = event({
      id: "costambar-beach-fitness",
      title: "Costambar Beach Fitness",
      date: "2026-08-31",
      time: "9:00 AM – 10:00 AM",
      location: "Costambar",
      venueSlug: "playa-costambar",
      lat: 19.81515,
      lng: -70.71555,
      category: "health-wellness",
      recurrence: "weekdays",
    });
    const karaoke = event({
      id: "el-carey-karaoke-mujeres-monday",
      title: "Empowered Women’s Sunset Karaoke",
      date: "2026-08-24",
      time: "6:00 PM",
      location: "Costambar",
      venueSlug: "el-carey-puerto-plata",
      lat: 19.8145247,
      lng: -70.7150884,
      category: "performances",
      recurrence: "weekly",
      recurrenceDay: 1,
    });

    const result = findNearbyForEventDetail(fitness, [fitness, karaoke], {
      now: new Date("2026-08-24T11:00:00.000-04:00"),
    });

    assert.equal(result.stripAhead, true);
    assert.equal(result.hits[0]?.event.id, "el-carey-karaoke-mujeres-monday");
  });
});
