import assert from "node:assert/strict";
import { afterEach, describe, it } from "node:test";
import { trackEvent } from "./analytics";

const previousWindow = globalThis.window;

afterEach(() => {
  globalThis.window = previousWindow;
});

describe("trackEvent", () => {
  it("sends trimmed params and drops empty ones", () => {
    const calls: unknown[][] = [];
    globalThis.window = {
      gtag: (...args: unknown[]) => {
        calls.push(args);
      },
    } as unknown as Window & typeof globalThis;

    trackEvent("save_event", {
      event_id: "abc",
      empty: "",
      missing: undefined,
      note: `  ${"x".repeat(120)}`,
    });

    assert.equal(calls.length, 1);
    assert.deepEqual(calls[0]?.[0], "event");
    assert.deepEqual(calls[0]?.[1], "save_event");
    const params = calls[0]?.[2] as Record<string, string>;
    assert.equal(params.event_id, "abc");
    assert.equal("empty" in params, false);
    assert.equal("missing" in params, false);
    assert.equal(params.note.length, 100);
    assert.equal(params.note.startsWith("x"), true);
  });

  it("drops an identical event fired again immediately", () => {
    const calls: unknown[][] = [];
    globalThis.window = {
      gtag: (...args: unknown[]) => {
        calls.push(args);
      },
    } as unknown as Window & typeof globalThis;

    trackEvent("view_event", { event_id: "same" });
    trackEvent("view_event", { event_id: "same" });
    trackEvent("view_event", { event_id: "other" });

    assert.equal(calls.length, 2);
    assert.equal((calls[1]?.[2] as { event_id: string }).event_id, "other");
  });

  it("does nothing when gtag is not loaded", () => {
    globalThis.window = {} as Window & typeof globalThis;
    assert.doesNotThrow(() => trackEvent("search", { search_term: "jazz" }));
  });
});
