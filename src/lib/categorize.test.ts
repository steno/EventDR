import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  eventInCategory,
  inferSecondaryCategories,
  resolveSecondaryCategories,
  withResolvedCategories,
} from "./categorize";
import { getFallbackEventById } from "./fallback-events";

describe("inferSecondaryCategories — business trade fairs", () => {
  it("tags EN business-fair copy under business", () => {
    const text =
      "Aventúrate RD, the North Coast's adventure tourism business fair with business rounds and buyers";
    assert.ok(inferSecondaryCategories(text, "festivals").includes("business"));
  });

  it("tags ES feria de negocios copy under business", () => {
    const text =
      "Feria de negocios de turismo de aventura con ruedas de negocios y expositores";
    assert.ok(inferSecondaryCategories(text, "festivals").includes("business"));
  });

  it("tags FR salon professionnel copy under business", () => {
    const text =
      "Salon professionnel du tourisme d'aventure avec rendez-vous d'affaires";
    assert.ok(inferSecondaryCategories(text, "festivals").includes("business"));
  });

  it("does not treat a lone weak business mention as a secondary", () => {
    const text = "Beach party sponsored by a local business near the malecón";
    assert.equal(
      inferSecondaryCategories(text, "parties").includes("business"),
      false,
    );
  });

  it("does not pull craft fairs into business from exhibit language alone", () => {
    const text =
      "Summer Artisan Fair — more than 120 local artisans exhibit handmade crafts";
    assert.equal(
      inferSecondaryCategories(text, "festivals").includes("business"),
      false,
    );
  });
});

describe("aventurate-rd-2026 categories", () => {
  it("lists under business after category resolution", () => {
    const event = getFallbackEventById("aventurate-rd-2026", "en");
    assert.ok(event);
    const resolved = withResolvedCategories(event);
    assert.equal(eventInCategory(resolved, "business"), true);
    assert.equal(eventInCategory(resolved, "festivals"), true);
  });

  it("keeps curated business even when primary stays festivals", () => {
    const event = getFallbackEventById("aventurate-rd-2026", "es");
    assert.ok(event);
    assert.equal(event.category, "festivals");
    assert.ok(resolveSecondaryCategories(event).includes("business"));
  });
});
