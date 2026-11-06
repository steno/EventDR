import { NextRequest, NextResponse } from "next/server";
import {
  MODERATOR_SESSION_COOKIE,
  checkModeratorAuth,
  createModeratorSessionToken,
  matchesModeratorSecret,
  moderatorSessionCookieOptions,
} from "@/lib/ops-auth";

export const dynamic = "force-dynamic";

function cookieSecure(request: NextRequest): boolean {
  return request.nextUrl.protocol === "https:";
}

function unauthorizedResponse(reason: "not_configured" | "unauthorized") {
  if (reason === "not_configured") {
    return NextResponse.json(
      { error: "Moderator not configured", code: "not_configured" },
      { status: 401 },
    );
  }
  return NextResponse.json(
    { error: "Unauthorized", code: "unauthorized" },
    { status: 401 },
  );
}

/** Check whether the browser already has a valid moderator session cookie. */
export async function GET(request: NextRequest) {
  const auth = checkModeratorAuth(request);
  if (!auth.ok) return unauthorizedResponse(auth.reason);
  return NextResponse.json({ ok: true });
}

/** Unlock once: validate MODERATOR_SECRET and set httpOnly session cookie. */
export async function POST(request: NextRequest) {
  const expectedConfigured = Boolean(process.env.MODERATOR_SECRET?.trim());
  if (!expectedConfigured) {
    return unauthorizedResponse("not_configured");
  }

  let body: { secret?: string } = {};
  try {
    body = (await request.json()) as { secret?: string };
  } catch {
    return unauthorizedResponse("unauthorized");
  }

  if (!matchesModeratorSecret(body.secret)) {
    return unauthorizedResponse("unauthorized");
  }

  const token = createModeratorSessionToken();
  if (!token) return unauthorizedResponse("not_configured");

  const res = NextResponse.json({ ok: true });
  res.cookies.set(
    MODERATOR_SESSION_COOKIE,
    token,
    moderatorSessionCookieOptions(cookieSecure(request)),
  );
  return res;
}

/** Sign out — clear the session cookie. */
export async function DELETE(request: NextRequest) {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(MODERATOR_SESSION_COOKIE, "", {
    ...moderatorSessionCookieOptions(cookieSecure(request)),
    maxAge: 0,
  });
  return res;
}
