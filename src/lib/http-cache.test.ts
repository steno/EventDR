import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  EVENTS_API_CACHE_CONTROL,
  EVENTS_API_NETLIFY_VARY,
  LISTING_HTML_CACHE_CONTROL,
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

describe("browser vs CDN listing cache", () => {
  it("tells browsers not to keep home HTML or event JSON", () => {
    assert.match(LISTING_HTML_CACHE_CONTROL, /max-age=0/);
    assert.match(LISTING_HTML_CACHE_CONTROL, /s-maxage=60/);
    assert.match(EVENTS_API_CACHE_CONTROL, /max-age=0/);
    assert.match(EVENTS_API_CACHE_CONTROL, /s-maxage=60/);
  });
});
