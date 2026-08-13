import { timingSafeEqual } from "node:crypto";
import type { NextRequest } from "next/server";

/**
 * Ops auth for cron / admin / moderation routes.
 * Secrets must be sent as `Authorization: Bearer <secret>` (or the matching
 * `x-cron-secret` / `x-moderator-secret` header). Query-string secrets are
 * rejected — they leak via logs, Referer, and browser history.
 */

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

export function checkModeratorAuth(request: NextRequest): ModeratorAuthResult {
  const expected = process.env.MODERATOR_SECRET?.trim();
  if (!expected) return { ok: false, reason: "not_configured" };
  const provided = providedSecret(request, "x-moderator-secret");
  if (!provided || !safeEqualString(provided, expected)) {
    return { ok: false, reason: "unauthorized" };
  }
  return { ok: true };
}

export function checkModeratorSecret(request: NextRequest): boolean {
  return checkModeratorAuth(request).ok;
}
