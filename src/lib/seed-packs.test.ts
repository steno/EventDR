import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { getRecurringEvents } from "./recurring-events";
import { getFallbackEvents, getFallbackEventById } from "./fallback-events";

describe("seed packs", () => {
  it("loads matching recurring ids across locales", () => {
    const en = getRecurringEvents("en");
    const es = getRecurringEvents("es");
    const fr = getRecurringEvents("fr");
    assert.ok(en.length > 50, `expected many recurring seeds, got ${en.length}`);
    assert.deepEqual(
      en.map((e) => e.id).sort(),
      es.map((e) => e.id).sort(),
    );
    assert.deepEqual(
      en.map((e) => e.id).sort(),
      fr.map((e) => e.id).sort(),
    );
  });

  it("merges recurring + fallback + seasonal into getFallbackEvents", () => {
    const events = getFallbackEvents("en");
    assert.ok(events.length > 100, `expected merged catalog, got ${events.length}`);
    assert.ok(events.every((e) => e.id && e.title), "every event needs id+title");
  });

  it("resolves known seed ids before date materialization", () => {
    const sample = getRecurringEvents("en")[0];
    assert.ok(sample);
    assert.equal(getFallbackEventById(sample.id, "en")?.id, sample.id);
  });
});
