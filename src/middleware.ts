import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { defaultLocale, isValidLocale, locales, type Locale } from "./i18n/config";

const LOCALE_COOKIE = "eventdr-locale";

function getPreferredLocale(request: NextRequest): Locale {
  const cookie = request.cookies.get(LOCALE_COOKIE)?.value;
  if (cookie && isValidLocale(cookie)) return cookie;

  const accept = request.headers.get("accept-language") ?? "";
  const lower = accept.toLowerCase();
  if (lower.includes("fr")) return "fr";
  if (lower.includes("es")) return "es";
  return defaultLocale;
}

export function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;

  // Collapse legacy `?from=` / `?fromTitle=` detail URLs so Google indexes only
  // the clean path (GSC: "Duplicate without user-selected canonical").
  if (searchParams.has("from") || searchParams.has("fromTitle")) {
    const clean = request.nextUrl.clone();
    clean.searchParams.delete("from");
    clean.searchParams.delete("fromTitle");
    return NextResponse.redirect(clean, 301);
  }

  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`,
  );

  if (pathnameHasLocale) return NextResponse.next();

  if (
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  const locale = getPreferredLocale(request);
  const url = request.nextUrl.clone();
  url.pathname = `/${locale}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
