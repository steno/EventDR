import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { osrmRouteUrl } from "./routing";

const POINTS = [
  { lat: 19.8054, lng: -70.6965 },
  { lat: 19.8041, lng: -70.6958 },
  { lat: 19.7965, lng: -70.6935 },
];

describe("osrmRouteUrl", () => {
  it("uses the public driving router with lng,lat waypoints", () => {
    const url = osrmRouteUrl(POINTS, "driving");
    assert.match(url, /^https:\/\/router\.project-osrm\.org\/route\/v1\/driving\//);
    assert.match(
      url,
      /-70\.6965,19\.8054;-70\.6958,19\.8041;-70\.6935,19\.7965/,
    );
    assert.match(url, /geometries=geojson/);
  });

  it("uses the OSM foot router for walking loops", () => {
    const url = osrmRouteUrl(POINTS, "walking");
    assert.match(
      url,
      /^https:\/\/routing\.openstreetmap\.de\/routed-foot\/route\/v1\/driving\//,
    );
    assert.match(url, /-70\.6965,19\.8054;/);
  });
});
