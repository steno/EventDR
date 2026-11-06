import { createHmac, timingSafeEqual } from "node:crypto";
import type { NextRequest } from "next/server";

/**
 * Ops auth for cron / admin / moderation routes.
 * Secrets must be sent as `Authorization: Bearer <secret>` (or the matching
 * `x-cron-secret` / `x-moderator-secret` header), or — for the moderate UI —
 * a signed httpOnly session cookie. Query-string secrets are rejected — they
 * leak via logs, Referer, and browser history.
 */

export const MODERATOR_SESSION_COOKIE = "pop_mod_session";
/** 90 days — unlock once on a device, then /en/moderate just works. */
export const MODERATOR_SESSION_MAX_AGE_SEC = 60 * 60 * 24 * 90;

function safeEqualString(provided: string, expected: string): boolean {
  const a = Buffer.from(provided, "utf8");
  const b = Buffer.from(expected, "utf8");
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

function bearerToken(request: NextRequest): string | null {
  const header = request.headers.get("authorization");
  if (!header) return null;
  const match = /^Bearer\s+(.+)$/i.exec(header.trim());
  return match?.[1]?.trim() || null;
}

function providedSecret(
  request: NextRequest,
  headerName: "x-cron-secret" | "x-moderator-secret",
): string | null {
  return bearerToken(request) ?? request.headers.get(headerName)?.trim() ?? null;
}

export function checkCronSecret(request: NextRequest): boolean {
  const expected = process.env.CRON_SECRET?.trim();
  if (!expected) return false;
  const provided = providedSecret(request, "x-cron-secret");
  if (!provided) return false;
  return safeEqualString(provided, expected);
}

export type ModeratorAuthResult =
  | { ok: true }
  | { ok: false; reason: "not_configured" | "unauthorized" };

function moderatorSecret(): string | null {
  const expected = process.env.MODERATOR_SECRET?.trim();
  return expected || null;
}

function signSessionPayload(payload: string, secret: string): string {
  return createHmac("sha256", secret).update(payload).digest("base64url");
}

/** Create a signed session token bound to MODERATOR_SECRET. */
export function createModeratorSessionToken(
  maxAgeSec: number = MODERATOR_SESSION_MAX_AGE_SEC,
): string | null {
  const secret = moderatorSecret();
  if (!secret) return null;
  const exp = Date.now() + maxAgeSec * 1000;
  const payload = `v1.${exp}`;
  return `${payload}.${signSessionPayload(payload, secret)}`;
}

export function verifyModeratorSessionToken(token: string | undefined | null): boolean {
  const secret = moderatorSecret();
  if (!secret || !token) return false;
  const parts = token.split(".");
  if (parts.length !== 3 || parts[0] !== "v1") return false;
  const exp = Number(parts[1]);
  if (!Number.isFinite(exp) || exp < Date.now()) return false;
  const payload = `${parts[0]}.${parts[1]}`;
  const expected = signSessionPayload(payload, secret);
  return safeEqualString(parts[2], expected);
}

export function moderatorSessionCookieOptions(secure: boolean) {
  return {
    httpOnly: true,
    secure,
    sameSite: "lax" as const,
    path: "/",
    maxAge: MODERATOR_SESSION_MAX_AGE_SEC,
  };
}

function hasValidModeratorSession(request: NextRequest): boolean {
  const token = request.cookies.get(MODERATOR_SESSION_COOKIE)?.value;
  return verifyModeratorSessionToken(token);
}

export function checkModeratorAuth(request: NextRequest): ModeratorAuthResult {
  const expected = moderatorSecret();
  if (!expected) return { ok: false, reason: "not_configured" };

  if (hasValidModeratorSession(request)) {
    return { ok: true };
  }

  const provided = providedSecret(request, "x-moderator-secret");
  if (!provided || !safeEqualString(provided, expected)) {
    return { ok: false, reason: "unauthorized" };
  }
  return { ok: true };
}

export function checkModeratorSecret(request: NextRequest): boolean {
  return checkModeratorAuth(request).ok;
}

/** True when the raw secret matches env (login form / curl Bearer). */
export function matchesModeratorSecret(provided: string | undefined | null): boolean {
  const expected = moderatorSecret();
  if (!expected || !provided) return false;
  return safeEqualString(provided.trim(), expected);
}
