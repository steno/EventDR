import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  buildMapPins,
  eventsWithMapPins,
  filterMapEvents,
  nearestMapPin,
  slimEventsForMap,
  venueOnlyPinId,
  withVenueDeepLinkPin,
} from "./map-events";
import type { Event } from "./types";

function event(partial: Partial<Event> & Pick<Event, "id" | "title">): Event {
  return {
    description: "",
    date: "2026-10-07",
    location: "Sosúa",
    category: "music",
    format: "physical",
    ...partial,
  };
}

describe("map-events", () => {
  it("keeps only events with resolvable coordinates", () => {
    const withPin = event({
      id: "a",
      title: "Live",
      lat: 19.76,
      lng: -70.51,
    });
    const digital = event({
      id: "b",
      title: "Stream",
      format: "digital",
      lat: 19.76,
      lng: -70.51,
    });
    const noPin = event({
      id: "c",
      title: "Mystery",
      venueSlug: undefined,
      location: "Somewhere else",
    });

    const pinned = eventsWithMapPins([withPin, digital, noPin]);
    assert.equal(pinned.length, 1);
    assert.equal(pinned[0]?.id, "a");
  });

  it("strips list-search fields unused on the map", () => {
    const slim = slimEventsForMap([
      event({
        id: "a",
        title: "Live",
        lat: 19.76,
        lng: -70.51,
        searchText: "heavy index",
        lineup: ["DJ"],
        participants: ["A"],
        imageUrl: "/events/a.jpg",
      }),
    ]);
    assert.equal(slim[0]?.imageUrl, "/events/a.jpg");
    assert.equal(slim[0]?.searchText, undefined);
    assert.equal(slim[0]?.lineup, undefined);
    assert.equal(slim[0]?.participants, undefined);
  });

  it("stacks events at the same pin", () => {
    const a = event({
      id: "a",
      title: "Night A",
      lat: 19.767,
      lng: -70.51,
      category: "music",
    });
    const b = event({
      id: "b",
      title: "Night B",
      lat: 19.767,
      lng: -70.51,
      category: "parties",
    });
    const pins = buildMapPins([a, b]);
    assert.equal(pins.length, 1);
    assert.equal(pins[0]?.events.length, 2);
  });

  it("picks the geographically nearest pin", () => {
    const pins = buildMapPins([
      event({
        id: "a",
        title: "A",
        lat: 19.76,
        lng: -70.51,
      }),
      event({
        id: "b",
        title: "B",
        lat: 19.761,
        lng: -70.511,
      }),
      event({
        id: "c",
        title: "C",
        lat: 19.8,
        lng: -70.7,
      }),
    ]);
    const from = pins.find((p) => p.events[0]?.id === "a")!;
    const nearest = nearestMapPin(pins, from.id);
    assert.equal(nearest?.events[0]?.id, "b");
  });

  it("skips excluded pins when picking nearest", () => {
    const pins = buildMapPins([
      event({
        id: "a",
        title: "A",
        lat: 19.76,
        lng: -70.51,
      }),
      event({
        id: "b",
        title: "B",
        lat: 19.761,
        lng: -70.511,
      }),
      event({
        id: "c",
        title: "C",
        // ~620 m — inside the 1 km swing cap (old 5 km coords were ~1.2 km)
        lat: 19.763,
        lng: -70.515,
      }),
    ]);
    const from = pins.find((p) => p.events[0]?.id === "a")!;
    const b = pins.find((p) => p.events[0]?.id === "b")!;
    const nearest = nearestMapPin(pins, from.id, [b.id]);
    assert.equal(nearest?.events[0]?.id, "c");
  });

  it("ignores pins beyond the swing max distance", () => {
    const pins = buildMapPins([
      event({
        id: "a",
        title: "A",
        lat: 19.76,
        lng: -70.51,
      }),
      event({
        id: "near",
        title: "Near",
        lat: 19.761,
        lng: -70.511,
      }),
      event({
        id: "far",
        title: "Far",
        // ~20 km west — Puerto Plata-ish from Sosúa
        lat: 19.8,
        lng: -70.7,
      }),
    ]);
    const from = pins.find((p) => p.events[0]?.id === "a")!;
    const near = pins.find((p) => p.events[0]?.id === "near")!;
    assert.equal(nearestMapPin(pins, from.id)?.events[0]?.id, "near");
    assert.equal(nearestMapPin(pins, from.id, [near.id]), null);
  });

  it("uses the first event image as the pin thumbnail", () => {
    const a = event({
      id: "a",
      title: "Night A",
      lat: 19.767,
      lng: -70.51,
      imageUrl: "/events/night-a.jpg",
    });
    const b = event({
      id: "b",
      title: "Night B",
      lat: 19.767,
      lng: -70.51,
      imageUrl: "/events/night-b.jpg",
    });
    const pins = buildMapPins([a, b]);
    assert.equal(pins[0]?.thumbUrl, "/events/night-a.jpg");
  });

  it("filters by category after time", () => {
    const music = event({
      id: "m",
      title: "Band",
      lat: 19.76,
      lng: -70.51,
      category: "music",
      date: "2026-10-07",
    });
    const food = event({
      id: "f",
      title: "Dinner",
      lat: 19.75,
      lng: -70.41,
      category: "food-drinks",
      date: "2026-10-07",
    });
    const filtered = filterMapEvents([music, food], "today", "music");
    // Date-dependent; at least category filter applies when dates match.
    assert.ok(filtered.every((e) => e.category === "music" || e.categories?.includes("music")));
  });

  it("adds a venue-only pin when the deep-linked venue has no events", () => {
    const neighbor = event({
      id: "vino",
      title: "Band night",
      lat: 19.7768222,
      lng: -70.6597699,
      venueSlug: "vinoteca-wine-house",
    });
    const pins = buildMapPins([neighbor]);
    const withVenue = withVenueDeepLinkPin(pins, {
      slug: "kviar-costa-dorada",
      name: "Kviar Show Disco & Casino",
      city: "Puerto Plata",
      lat: 19.776438,
      lng: -70.659688,
    }, "/venues/kviar.jpg");
    assert.equal(withVenue.length, 2);
    const venuePin = withVenue.find((p) => p.venueOnly?.slug === "kviar-costa-dorada");
    assert.ok(venuePin);
    assert.equal(venuePin?.id, venueOnlyPinId("kviar-costa-dorada"));
    assert.equal(venuePin?.events.length, 0);
    assert.equal(venuePin?.thumbUrl, "/venues/kviar.jpg");
  });

  it("does not duplicate when the venue already has an event pin", () => {
    const listed = event({
      id: "k1",
      title: "Casino night",
      lat: 19.776438,
      lng: -70.659688,
      venueSlug: "kviar-costa-dorada",
    });
    const pins = buildMapPins([listed]);
    const withVenue = withVenueDeepLinkPin(pins, {
      slug: "kviar-costa-dorada",
      name: "Kviar Show Disco & Casino",
      city: "Puerto Plata",
      lat: 19.776438,
      lng: -70.659688,
    });
    assert.equal(withVenue.length, 1);
    assert.equal(withVenue[0]?.venueOnly, undefined);
  });
});
