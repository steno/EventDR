import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { getEventOgImageUrl } from "./event-images";
import { buildEventMetadata, canonicalMediaUrl } from "./seo";
import type { Event } from "./types";

const dewry: Event = {
  id: "dewry-luciano-zona-acapella-2026-08-23",
  title: "Dewry Luciano — Domingo Típico",
  description: "Accordion típico at Zona Acapella Club.",
  date: "2026-08-23",
  location: "Puerto Plata",
  category: "concert",
  format: "physical",
  imageUrl:
    "/events/dewry-luciano-zona-acapella-2026-08-23.jpg?v=bcd189dcedce129fb2cc8d6056bb63b1b2456cc1",
};

describe("canonicalMediaUrl", () => {
  it("strips cache-busting query strings", () => {
    assert.equal(
      canonicalMediaUrl("/events/foo.jpg?v=abc#x"),
      "https://pop-event.com/events/foo.jpg",
    );
  });
});

describe("buildEventMetadata", () => {
  it("points Facebook at a landscape OG jpeg without a query string", () => {
    const meta = buildEventMetadata(
      "en",
      dewry,
      "https://pop-event.com/en/event/dewry-luciano-zona-acapella-2026-08-23",
    );
    const images = meta.openGraph?.images;
    assert.ok(Array.isArray(images));
    const image = images[0];
    assert.equal(typeof image, "object");
    assert.ok(image && typeof image === "object" && "url" in image);
    assert.equal(
      String(image.url),
      "https://pop-event.com/og/events/dewry-luciano-zona-acapella-2026-08-23.jpg",
    );
    assert.equal("width" in image ? image.width : undefined, 1200);
    assert.equal("height" in image ? image.height : undefined, 630);
    assert.doesNotMatch(String(image.url), /\?/);
    assert.deepEqual(meta.twitter?.images, [
      "https://pop-event.com/og/events/dewry-luciano-zona-acapella-2026-08-23.jpg",
    ]);
  });

  it("falls back to a query-stripped flyer when no curated OG mapping exists", () => {
    const meta = buildEventMetadata(
      "en",
      {
        ...dewry,
        id: "one-off-community-night",
        imageUrl: "/events/custom-upload.jpg?v=hash",
      },
      "https://pop-event.com/en/event/one-off-community-night",
    );
    const images = meta.openGraph?.images;
    assert.ok(Array.isArray(images));
    const image = images[0];
    assert.ok(image && typeof image === "object" && "url" in image);
    assert.equal(String(image.url), "https://pop-event.com/events/custom-upload.jpg");
  });
});

describe("getEventOgImageUrl", () => {
  it("maps curated event ids to build-time OG files", () => {
    assert.equal(
      getEventOgImageUrl("dewry-luciano-zona-acapella-2026-08-23"),
      "/og/events/dewry-luciano-zona-acapella-2026-08-23.jpg",
    );
  });
});
