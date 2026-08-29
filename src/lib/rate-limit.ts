import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

/**
 * Lightweight in-memory sliding-window rate limit for public write endpoints.
 * Per serverless isolate (not global) — still stops naive floods and script spam.
 */

export type RateLimitConfig = {
  /** Bucket namespace, e.g. "submit" */
  key: string;
  /** Max requests allowed in the window */
  limit: number;
  /** Window length in milliseconds */
  windowMs: number;
};

export type RateLimitOk = {
  ok: true;
  remaining: number;
  limit: number;
};

export type RateLimitBlocked = {
  ok: false;
  remaining: 0;
  limit: number;
  retryAfterSec: number;
};

export type RateLimitResult = RateLimitOk | RateLimitBlocked;

type Bucket = {
  hits: number[];
};

const buckets = new Map<string, Bucket>();
const MAX_BUCKETS = 8_000;

/** Presets for public write routes. */
export const RATE_LIMITS = {
  submit: { key: "submit", limit: 5, windowMs: 15 * 60 * 1000 },
  pushSubscribe: { key: "push-subscribe", limit: 30, windowMs: 60 * 60 * 1000 },
  partnerDigest: { key: "partner-digest", limit: 8, windowMs: 60 * 60 * 1000 },
  newsletter: { key: "newsletter", limit: 8, windowMs: 60 * 60 * 1000 },
} as const satisfies Record<string, RateLimitConfig>;

export function clientIp(request: NextRequest): string {
  const nf = request.headers.get("x-nf-client-connection-ip")?.trim();
  if (nf) return nf;

  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first;
  }

  const realIp = request.headers.get("x-real-ip")?.trim();
  if (realIp) return realIp;

  return "unknown";
}

function prune(hits: number[], windowStart: number): number[] {
  let i = 0;
  while (i < hits.length && hits[i]! < windowStart) i += 1;
  return i === 0 ? hits : hits.slice(i);
}

function evictIfNeeded() {
  if (buckets.size <= MAX_BUCKETS) return;
  const excess = buckets.size - MAX_BUCKETS;
  const keys = buckets.keys();
  for (let i = 0; i < excess; i += 1) {
    const next = keys.next();
    if (next.done) break;
    buckets.delete(next.value);
  }
}

/**
 * Record a hit and return whether the request is allowed.
 * Call once per request at the start of the handler.
 */
export function checkRateLimit(
  request: NextRequest,
  config: RateLimitConfig,
  now = Date.now(),
): RateLimitResult {
  const ip = clientIp(request);
  const bucketKey = `${config.key}:${ip}`;
  const windowStart = now - config.windowMs;

  let bucket = buckets.get(bucketKey);
  if (!bucket) {
    bucket = { hits: [] };
    buckets.set(bucketKey, bucket);
    evictIfNeeded();
  }

  bucket.hits = prune(bucket.hits, windowStart);

  if (bucket.hits.length >= config.limit) {
    const oldest = bucket.hits[0] ?? now;
    const retryAfterSec = Math.max(
      1,
      Math.ceil((oldest + config.windowMs - now) / 1000),
    );
    return {
      ok: false,
      remaining: 0,
      limit: config.limit,
      retryAfterSec,
    };
  }

  bucket.hits.push(now);
  return {
    ok: true,
    remaining: Math.max(0, config.limit - bucket.hits.length),
    limit: config.limit,
  };
}

export function rateLimitResponse(result: RateLimitBlocked): NextResponse {
  return NextResponse.json(
    { error: "Too many requests. Try again later." },
    {
      status: 429,
      headers: {
        "Retry-After": String(result.retryAfterSec),
        "X-RateLimit-Limit": String(result.limit),
        "X-RateLimit-Remaining": "0",
      },
    },
  );
}

/** Test helper — clears all buckets. */
export function resetRateLimitBucketsForTests() {
  buckets.clear();
}
