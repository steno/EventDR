"use client";

import { usePathname } from "next/navigation";
import { SiteFooter } from "@/components/SiteFooter";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";

interface AppFooterProps {
  locale: Locale;
  dict: Dictionary;
}

/** Event lists, event detail, and venue pages — full footer is redundant under the mobile shell. */
function compactFooterOnMobile(pathname: string, locale: Locale): boolean {
  const base = `/${locale}`;
  if (pathname === base) return true;
  if (pathname === `${base}/events` || pathname === `${base}/browse`) return true;
  if (pathname === `${base}/venues`) return true;
  if (pathname.startsWith(`${base}/event/`)) return true;
  if (pathname.startsWith(`${base}/venue/`)) return true;
  if (pathname.startsWith(`${base}/city/`)) return true;
  if (pathname.startsWith(`${base}/category/`)) return true;
  if (pathname.startsWith(`${base}/when/`)) return true;
  return false;
}

export function AppFooter({ locale, dict }: AppFooterProps) {
  const pathname = usePathname();
  const padForBottomNav = pathname === `/${locale}`;
  const compactOnMobile = compactFooterOnMobile(pathname, locale);
  const hideForPrint =
    pathname === `/${locale}/for-partners` ||
    pathname === `/${locale}/support`;
  const onCruisePage = /\/cruise\//.test(pathname);

  return (
    <SiteFooter
      dict={dict}
      locale={locale}
      showCruiseLink={!onCruisePage}
      compactOnMobile={compactOnMobile}
      className={[
        padForBottomNav
          ? "pb-[calc(3.75rem+env(safe-area-inset-bottom))] lg:pb-8"
          : "pb-6",
        hideForPrint ? "print:hidden" : "",
      ]
        .filter(Boolean)
        .join(" ")}
    />
  );
}
