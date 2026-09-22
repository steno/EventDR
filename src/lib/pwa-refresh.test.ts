import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import {
  PWA_CACHE_NAME,
  PWA_RELOAD_PARAM,
  PWA_VERSION,
  cacheBustingReloadHref,
  pwaScriptUrl,
} from "./pwa-refresh";

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), "../..");

describe("PWA cache version", () => {
  it("matches CACHE_NAME in public/sw.js", () => {
    const sw = readFileSync(join(repoRoot, "public/sw.js"), "utf8");
    assert.match(sw, new RegExp(`const CACHE_NAME = "${PWA_CACHE_NAME}"`));
  });

  it("registers the worker with a versioned script URL", () => {
    assert.equal(pwaScriptUrl(), `/sw.js?v=${PWA_VERSION}`);
  });

  it("does not let the worker intercept /api or /sw.js", () => {
    const sw = readFileSync(join(repoRoot, "public/sw.js"), "utf8");
    assert.match(sw, /pathname\.startsWith\("\/api\/"\)/);
    assert.match(sw, /pathname === "\/sw\.js"/);
    assert.match(sw, /cache: "no-store"/);
  });
});

describe("cacheBustingReloadHref", () => {
  it("adds a reload param without dropping existing query values", () => {
    const href = cacheBustingReloadHref(
      "https://pop-event.com/en?city=sosua",
      1700000000000,
    );
    assert.equal(href, `/en?city=sosua&${PWA_RELOAD_PARAM}=1700000000000`);
  });

  it("replaces a previous bust instead of stacking", () => {
    const href = cacheBustingReloadHref(
      `https://pop-event.com/en?${PWA_RELOAD_PARAM}=1`,
      99,
    );
    assert.equal(href, `/en?${PWA_RELOAD_PARAM}=99`);
  });
});
