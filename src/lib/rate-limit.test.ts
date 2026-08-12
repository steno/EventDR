import assert from "node:assert/strict";
import { describe, it, beforeEach } from "node:test";
import { NextRequest } from "next/server";
import {
  checkRateLimit,
  clientIp,
  resetRateLimitBucketsForTests,
  type RateLimitConfig,
} from "./rate-limit";

const CONFIG: RateLimitConfig = {
  key: "test-bucket",
  limit: 3,
  windowMs: 60_000,
};

function req(ip: string, forwarded?: string): NextRequest {
  const headers: Record<string, string> = {};
  if (forwarded) headers["x-forwarded-for"] = forwarded;
  else headers["x-nf-client-connection-ip"] = ip;
  return new NextRequest("https://pop-event.com/api/submit", { headers });
}

describe("clientIp", () => {
  it("prefers Netlify connection IP", () => {
    const r = new NextRequest("https://pop-event.com/api/submit", {
      headers: {
        "x-nf-client-connection-ip": "1.2.3.4",
        "x-forwarded-for": "9.9.9.9",
      },
    });
    assert.equal(clientIp(r), "1.2.3.4");
  });

  it("uses first x-forwarded-for hop", () => {
    const r = new NextRequest("https://pop-event.com/api/submit", {
      headers: { "x-forwarded-for": "10.0.0.1, 10.0.0.2" },
    });
    assert.equal(clientIp(r), "10.0.0.1");
  });
});

describe("checkRateLimit", () => {
  beforeEach(() => {
    resetRateLimitBucketsForTests();
  });

  it("allows requests under the limit", () => {
    const r = req("1.1.1.1");
    const a = checkRateLimit(r, CONFIG, 1_000);
    const b = checkRateLimit(r, CONFIG, 2_000);
    assert.equal(a.ok, true);
    assert.equal(b.ok, true);
    if (a.ok) assert.equal(a.remaining, 2);
    if (b.ok) assert.equal(b.remaining, 1);
  });

  it("blocks once the limit is reached", () => {
    const r = req("2.2.2.2");
    assert.equal(checkRateLimit(r, CONFIG, 1_000).ok, true);
    assert.equal(checkRateLimit(r, CONFIG, 2_000).ok, true);
    assert.equal(checkRateLimit(r, CONFIG, 3_000).ok, true);
    const blocked = checkRateLimit(r, CONFIG, 4_000);
    assert.equal(blocked.ok, false);
    if (!blocked.ok) {
      assert.equal(blocked.remaining, 0);
      assert.ok(blocked.retryAfterSec >= 1);
    }
  });

  it("isolates buckets by IP", () => {
    assert.equal(checkRateLimit(req("a"), CONFIG, 1_000).ok, true);
    assert.equal(checkRateLimit(req("a"), CONFIG, 2_000).ok, true);
    assert.equal(checkRateLimit(req("a"), CONFIG, 3_000).ok, true);
    assert.equal(checkRateLimit(req("a"), CONFIG, 4_000).ok, false);
    assert.equal(checkRateLimit(req("b"), CONFIG, 4_000).ok, true);
  });

  it("resets after the window slides", () => {
    const r = req("3.3.3.3");
    assert.equal(checkRateLimit(r, CONFIG, 1_000).ok, true);
    assert.equal(checkRateLimit(r, CONFIG, 2_000).ok, true);
    assert.equal(checkRateLimit(r, CONFIG, 3_000).ok, true);
    assert.equal(checkRateLimit(r, CONFIG, 4_000).ok, false);
    // Oldest hit at 1000; window 60s → clear after 61000 from oldest
    assert.equal(checkRateLimit(r, CONFIG, 61_001).ok, true);
  });
});
