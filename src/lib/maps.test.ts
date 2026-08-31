import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { getLoopAppleMapsUrl, getLoopGoogleMapsUrl, osmEmbedUrl } from "./maps";

const LOOP = [
  { lat: 19.8054, lng: -70.6965 },
  { lat: 19.8041, lng: -70.6958 },
  { lat: 19.7965, lng: -70.6935 },
  { lat: 19.8054, lng: -70.6965 },
];

describe("getLoopGoogleMapsUrl", () => {
  it("builds a closed walking loop with intermediate waypoints", () => {
    const url = getLoopGoogleMapsUrl(LOOP, "walking");
    const parsed = new URL(url);
    assert.equal(parsed.origin + parsed.pathname, "https://www.google.com/maps/dir/");
    assert.equal(parsed.searchParams.get("api"), "1");
    assert.equal(parsed.searchParams.get("origin"), "19.8054,-70.6965");
    assert.equal(parsed.searchParams.get("destination"), "19.8054,-70.6965");
    assert.equal(parsed.searchParams.get("travelmode"), "walking");
    assert.equal(
      parsed.searchParams.get("waypoints"),
      "19.8041,-70.6958|19.7965,-70.6935",
    );
  });

  it("omits waypoints when there are only origin and destination", () => {
    const origin = LOOP[0];
    const destination = LOOP[3];
    assert.ok(origin && destination);
    const url = getLoopGoogleMapsUrl([origin, destination], "driving");
    const parsed = new URL(url);
    assert.equal(parsed.searchParams.get("travelmode"), "driving");
    assert.equal(parsed.searchParams.get("waypoints"), null);
  });

  it("returns empty for a single point", () => {
    const origin = LOOP[0];
    assert.ok(origin);
    assert.equal(getLoopGoogleMapsUrl([origin], "walking"), "");
  });
});

describe("getLoopAppleMapsUrl", () => {
  it("chains daddr stops and sets walking dirflg", () => {
    const url = getLoopAppleMapsUrl(LOOP, "walking");
    const parsed = new URL(url);
    assert.equal(parsed.origin, "https://maps.apple.com");
    assert.equal(parsed.searchParams.get("saddr"), "19.8054,-70.6965");
    assert.equal(parsed.searchParams.get("dirflg"), "w");
    assert.deepEqual(parsed.searchParams.getAll("daddr"), [
      "19.8041,-70.6958",
      "19.7965,-70.6935",
      "19.8054,-70.6965",
    ]);
  });

  it("uses driving dirflg for taxi loops", () => {
    const url = getLoopAppleMapsUrl(LOOP, "driving");
    assert.equal(new URL(url).searchParams.get("dirflg"), "d");
  });
});

describe("osmEmbedUrl", () => {
  it("builds an OSM embed around the loop bounds", () => {
    const url = osmEmbedUrl(LOOP);
    const parsed = new URL(url);
    assert.equal(
      parsed.origin + parsed.pathname,
      "https://www.openstreetmap.org/export/embed.html",
    );
    assert.equal(parsed.searchParams.get("layer"), "mapnik");
    assert.ok(parsed.searchParams.get("bbox"));
    assert.equal(parsed.searchParams.get("marker"), "19.8054,-70.6965");
  });
});
