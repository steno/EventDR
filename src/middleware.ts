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

  // Collapse legacy / UI-only query URLs so Google indexes the clean path
  // (GSC: "Alternative page with proper canonical" / duplicate ?from=).
  const stripKeys: string[] = [];
  if (searchParams.has("from")) stripKeys.push("from");
  if (searchParams.has("fromTitle")) stripKeys.push("fromTitle");
  // Venue directions UI — was `?directions=1`; now sessionStorage.
  if (searchParams.has("directions")) stripKeys.push("directions");
  // Map pin deep-link — was `/map?venue=`; now sessionStorage.
  if (
    searchParams.has("venue") &&
    locales.some((locale) => pathname === `/${locale}/map`)
  ) {
    stripKeys.push("venue");
  }
  if (stripKeys.length > 0) {
    const clean = request.nextUrl.clone();
    for (const key of stripKeys) clean.searchParams.delete(key);
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
