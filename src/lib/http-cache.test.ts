import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  EVENTS_API_CACHE_CONTROL,
  EVENTS_API_NETLIFY_VARY,
  NO_STORE_CACHE_CONTROL,
  eventsApiHeaders,
} from "./http-cache";

describe("eventsApiHeaders", () => {
  it("varies Netlify cache on venue and other listing query params", () => {
    const headers = eventsApiHeaders();
    assert.equal(headers["Cache-Control"], EVENTS_API_CACHE_CONTROL);
    assert.match(EVENTS_API_NETLIFY_VARY, /\bvenue\b/);
    assert.match(EVENTS_API_NETLIFY_VARY, /\blocale\b/);
    assert.match(EVENTS_API_NETLIFY_VARY, /\bcategory\b/);
    assert.equal(headers["Netlify-Vary"], EVENTS_API_NETLIFY_VARY);
  });

  it("keeps Netlify-Vary on no-store responses so a scoped miss cannot reuse another catalog", () => {
    const headers = eventsApiHeaders({ refresh: true, empty: true });
    assert.equal(headers["Cache-Control"], NO_STORE_CACHE_CONTROL);
    assert.match(headers["Netlify-Vary"] ?? "", /\bvenue\b/);
  });
});
