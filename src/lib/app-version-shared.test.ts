import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  appVersionNeedsRefresh,
  shouldHardReloadForVersion,
} from "./app-version-shared";

describe("appVersionNeedsRefresh", () => {
  it("ignores a missing stamp", () => {
    assert.equal(appVersionNeedsRefresh(null, "abc"), false);
  });

  it("matches an equal stamp", () => {
    assert.equal(appVersionNeedsRefresh("abc", "abc"), false);
  });

  it("flags a different stamp", () => {
    assert.equal(appVersionNeedsRefresh("old", "new"), true);
  });
});

describe("shouldHardReloadForVersion", () => {
  const cached = {
    transferSize: 0,
    encodedBodySize: 40_000,
    alreadyReloaded: false,
  };

  it("reloads a cached document when the deploy stamp changed", () => {
    assert.equal(shouldHardReloadForVersion("old", "new", cached), true);
  });

  it("keeps a network-fresh document on one load", () => {
    assert.equal(
      shouldHardReloadForVersion("old", "new", {
        transferSize: 35_000,
        encodedBodySize: 40_000,
        alreadyReloaded: false,
      }),
      false,
    );
  });

  it("does not reload again after a cache-busting navigation", () => {
    assert.equal(
      shouldHardReloadForVersion("old", "new", {
        ...cached,
        alreadyReloaded: true,
      }),
      false,
    );
  });

  it("does not reload when timing is missing", () => {
    assert.equal(shouldHardReloadForVersion("old", "new", null), false);
  });
});
