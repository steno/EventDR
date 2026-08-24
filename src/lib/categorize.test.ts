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

  it("does not put adventure-tourism trade fairs under Adventure", () => {
    const text =
      "Aventúrate RD, the North Coast's adventure tourism business fair with business rounds";
    assert.equal(
      inferSecondaryCategories(text, "festivals").includes("adventure"),
      false,
    );
    assert.ok(inferSecondaryCategories(text, "festivals").includes("business"));
  });
});

describe("aventurate-rd-2026 categories", () => {
  it("lists under business after category resolution", () => {
    const event = getFallbackEventById("aventurate-rd-2026", "en");
    assert.ok(event);
    const resolved = withResolvedCategories(event);
    assert.equal(eventInCategory(resolved, "business"), true);
    assert.equal(eventInCategory(resolved, "festivals"), true);
    assert.equal(eventInCategory(resolved, "adventure"), false);
  });

  it("keeps curated business even when primary stays festivals", () => {
    const event = getFallbackEventById("aventurate-rd-2026", "es");
    assert.ok(event);
    assert.equal(event.category, "festivals");
    assert.ok(resolveSecondaryCategories(event).includes("business"));
    assert.equal(resolveSecondaryCategories(event).includes("adventure"), false);
  });
});

describe("landmark names do not unlock Adventure as a secondary", () => {
  it("keeps Don Limón under food-drinks despite “near Ocean World”", () => {
    const event = getFallbackEventById("don-limon-beach-dining", "en");
    assert.ok(event);
    assert.equal(event.category, "food-drinks");
    const resolved = withResolvedCategories(event);
    assert.equal(eventInCategory(resolved, "food-drinks"), true);
    assert.equal(eventInCategory(resolved, "adventure"), false);
  });

  it("does not tag ES / FR Don Limón copy as adventure from Ocean World", () => {
    for (const locale of ["es", "fr"] as const) {
      const event = getFallbackEventById("don-limon-beach-dining", locale);
      assert.ok(event);
      assert.equal(
        resolveSecondaryCategories(event).includes("adventure"),
        false,
        locale,
      );
    }
  });

  it("does not pull the Cofresí sunset walk into Adventure from the marina landmark", () => {
    const event = getFallbackEventById("cofresi-beach-sunset-walk", "en");
    assert.ok(event);
    assert.equal(
      resolveSecondaryCategories(event).includes("adventure"),
      false,
    );
  });

  it("still infers Adventure as a secondary from outing keywords", () => {
    const text =
      "Sunset catamaran with reef snorkeling and a beach barbecue";
    assert.ok(
      inferSecondaryCategories(text, "food-drinks").includes("adventure"),
    );
  });
});

describe("imbert-mercedes-patronales-2026 categories", () => {
  it("stays under festivals and culture, not concert", () => {
    for (const locale of ["en", "es", "fr"] as const) {
      const event = getFallbackEventById(
        "imbert-mercedes-patronales-2026",
        locale,
      );
      assert.ok(event, locale);
      const resolved = withResolvedCategories(event);
      assert.equal(eventInCategory(resolved, "festivals"), true);
      assert.equal(eventInCategory(resolved, "culture"), true);
      assert.equal(eventInCategory(resolved, "concert"), false);
      assert.equal(eventInCategory(resolved, "adventure"), false);
    }
  });
});

describe("guananico-san-miguel-patronales-2026 categories", () => {
  it("stays under festivals, culture, and music, not concert", () => {
    for (const locale of ["en", "es", "fr"] as const) {
      const event = getFallbackEventById(
        "guananico-san-miguel-patronales-2026",
        locale,
      );
      assert.ok(event, locale);
      const resolved = withResolvedCategories(event);
      assert.equal(eventInCategory(resolved, "festivals"), true, locale);
      assert.equal(eventInCategory(resolved, "culture"), true, locale);
      assert.equal(eventInCategory(resolved, "music"), true, locale);
      assert.equal(eventInCategory(resolved, "concert"), false, locale);
      assert.equal(eventInCategory(resolved, "adventure"), false, locale);
    }
  });
});

describe("inferSecondaryCategories — vocational / INFOTEP courses", () => {
  it("tags INFOTEP vocational cooking copy under business", () => {
    const text =
      "INFOTEP vocational cooking course at Love Does Centro Para Mujeres";
    assert.ok(inferSecondaryCategories(text, "food-drinks").includes("business"));
  });

  it("tags ES curso INFOTEP copy under business", () => {
    const text = "Curso INFOTEP de Bocadillos — formación profesional de cocina";
    assert.ok(inferSecondaryCategories(text, "food-drinks").includes("business"));
  });

  it("does not treat a French 5K course as business", () => {
    const text =
      "Course 5K immersive sur le Malecón de Puerto Plata avec casques synchronisés";
    assert.equal(
      inferSecondaryCategories(text, "sports").includes("business"),
      false,
    );
  });

  it("does not pull salsa classes into business from class language", () => {
    const text = "Beginner salsa class then social dancing at El Batey";
    assert.equal(
      inferSecondaryCategories(text, "dance").includes("business"),
      false,
    );
  });
});

describe("love-does-bocadillos-course-2026 categories", () => {
  it("lists under food-drinks and business across locales", () => {
    for (const locale of ["en", "es", "fr"] as const) {
      const event = getFallbackEventById(
        "love-does-bocadillos-course-2026",
        locale,
      );
      assert.ok(event, locale);
      const resolved = withResolvedCategories(event);
      assert.equal(eventInCategory(resolved, "food-drinks"), true, locale);
      assert.equal(eventInCategory(resolved, "business"), true, locale);
    }
  });
});

describe("costambar-beach-fitness categories", () => {
  it("lists under health-wellness and sports across locales", () => {
    for (const locale of ["en", "es", "fr"] as const) {
      const event = getFallbackEventById("costambar-beach-fitness", locale);
      assert.ok(event, locale);
      const resolved = withResolvedCategories(event);
      assert.equal(eventInCategory(resolved, "health-wellness"), true, locale);
      assert.equal(eventInCategory(resolved, "sports"), true, locale);
    }
  });
});
