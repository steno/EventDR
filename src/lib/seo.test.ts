import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { getEventOgImageUrl } from "./event-images";
import { getDictionary } from "@/i18n/dictionaries";
import {
  buildBrandJsonLd,
  buildEventBreadcrumbItems,
  buildBreadcrumbJsonLd,
  buildEventMetadata,
  canonicalMediaUrl,
} from "./seo";
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

describe("buildBrandJsonLd", () => {
  it("publishes a slogan and overview in one graph", () => {
    const dict = getDictionary("en");
    const graph = buildBrandJsonLd("en", dict);
    assert.equal(graph["@context"], "https://schema.org");
    assert.equal("@type" in graph, false);
    const nodes = graph["@graph"];
    const org = nodes.find((node) => node["@type"] === "Organization");
    const site = nodes.find((node) => node["@type"] === "WebSite");
    assert.ok(org);
    assert.ok(site);
    assert.equal(org.slogan, dict.hero.regionTagline);
    assert.equal(org.description, dict.meta.description);
    assert.equal(site.description, dict.meta.description);
    assert.equal(org.logo.url, "https://pop-event.com/pop-home-logo.png");
    assert.equal(org.logo.width, 192);
  });
});

describe("buildEventBreadcrumbItems", () => {
  it("inserts city and category hubs when the event is in a home zone", () => {
    const dict = getDictionary("en");
    assert.deepEqual(buildEventBreadcrumbItems(dewry, "en", dict), [
      { name: dict.seo.siteName, path: "/en" },
      { name: "Puerto Plata", path: "/en/city/puerto-plata" },
      { name: dict.categories.concert, path: "/en/city/puerto-plata/category/concert" },
      {
        name: dewry.title,
        path: "/en/event/dewry-luciano-zona-acapella-2026-08-23",
      },
    ]);
  });

  it("skips the city crumb when the listing is outside home zones", () => {
    const dict = getDictionary("en");
    const items = buildEventBreadcrumbItems(
      { ...dewry, location: "Santo Domingo" },
      "en",
      dict,
    );
    assert.deepEqual(
      items.map((item) => item.path),
      [
        "/en",
        "/en/category/concert",
        "/en/event/dewry-luciano-zona-acapella-2026-08-23",
      ],
    );
  });

  it("coerces unknown primary categories onto a labeled hub for Google breadcrumbs", () => {
    const dict = getDictionary("en");
    const items = buildEventBreadcrumbItems(
      {
        ...dewry,
        id: "hard-rock-casa-mickey-2026-09-26",
        title: "La Casa de Mickey Mouse — Family Fun Fest",
        location: "Sosúa",
        category: "family" as Event["category"],
        categories: ["festivals", "performances"],
      },
      "en",
      dict,
    );
    assert.deepEqual(items[2], {
      name: dict.categories.festivals,
      path: "/en/city/sosua/category/festivals",
    });
    const jsonLd = buildBreadcrumbJsonLd(items);
    for (const el of jsonLd.itemListElement as Array<Record<string, unknown>>) {
      assert.equal(typeof el.name, "string");
      assert.ok(String(el.name).length > 0);
    }
  });
});

describe("buildBreadcrumbJsonLd", () => {
  it("omits ListItems with blank names so GSC does not flag itemListElement", () => {
    const jsonLd = buildBreadcrumbJsonLd([
      { name: "POP Events", path: "/en" },
      { name: "   ", path: "/en/category/family" },
      { name: "Show", path: "/en/event/x" },
    ]);
    assert.deepEqual(jsonLd.itemListElement, [
      {
        "@type": "ListItem",
        position: 1,
        name: "POP Events",
        item: "https://pop-event.com/en",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Show",
        item: "https://pop-event.com/en/event/x",
      },
    ]);
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
