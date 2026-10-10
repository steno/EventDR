import assert from "node:assert/strict";
import { describe, it } from "node:test";
import type { Locale } from "@/i18n/config";
import {
  eventInCategory,
  getEventCategoryList,
  hasAdventureOutingSignal,
  MAX_SECONDARY_CATEGORIES,
  resolveSecondaryCategories,
  withResolvedCategories,
} from "./categorize";
import { getFallbackEventById, getFallbackEvents } from "./fallback-events";

const LOCALES: Locale[] = ["en", "es", "fr"];

const NIGHTLIFE = new Set(["parties", "music", "concert", "dance"]);

describe("catalog category invariants", () => {
  it("keeps every seed at primary + at most two secondaries after resolve", () => {
    const violations: string[] = [];
    for (const locale of LOCALES) {
      for (const event of getFallbackEvents(locale)) {
        const cats = getEventCategoryList(event);
        if (cats.length > 1 + MAX_SECONDARY_CATEGORIES) {
          violations.push(
            `${locale} ${event.id}: ${cats.join(",")} (${cats.length})`,
          );
        }
      }
    }
    assert.deepEqual(violations, []);
  });

  it("does not put nightlife under Adventure without an outing signal", () => {
    const violations: string[] = [];
    for (const locale of LOCALES) {
      for (const event of getFallbackEvents(locale)) {
        if (!NIGHTLIFE.has(event.category)) continue;
        if (!eventInCategory(event, "adventure")) continue;
        const text = `${event.title} ${event.description}`;
        if (!hasAdventureOutingSignal(text)) {
          violations.push(`${locale} ${event.id}: ${event.title}`);
        }
      }
    }
    assert.deepEqual(violations, []);
  });

  it("still lists trolley city-tour under Adventure across locales", () => {
    for (const locale of LOCALES) {
      const event = getFallbackEventById("trolley-party-saturday", locale);
      assert.ok(event, locale);
      assert.equal(
        eventInCategory(withResolvedCategories(event), "adventure"),
        true,
        locale,
      );
    }
  });
});

describe("nightlife Adventure sanitizer", () => {
  it("drops explicit Adventure on a club night that only says Aventura", () => {
    const secondaries = resolveSecondaryCategories({
      title: "Twenty Disco Club Edition — Aventura",
      description: "Aventura night at the disco with guest DJs",
      category: "parties",
      categories: ["music", "adventure", "dance"],
    });
    assert.equal(secondaries.includes("adventure"), false);
    assert.ok(secondaries.length <= MAX_SECONDARY_CATEGORIES);
  });

  it("keeps explicit Adventure when nightlife copy has a real outing signal", () => {
    const secondaries = resolveSecondaryCategories({
      title: "Trolley Party City Tour",
      description: "Open-air mural bus tour with music and bar-hop stops",
      category: "parties",
      categories: ["adventure", "food-drinks"],
    });
    assert.ok(secondaries.includes("adventure"));
  });
});
