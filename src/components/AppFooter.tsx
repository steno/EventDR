"use client";

import { usePathname } from "next/navigation";
import { SiteFooter } from "@/components/SiteFooter";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";

interface AppFooterProps {
  locale: Locale;
  dict: Dictionary;
}

export function AppFooter({ locale, dict }: AppFooterProps) {
  const pathname = usePathname();
  const padForBottomNav = pathname === `/${locale}`;

  return (
    <SiteFooter
      dict={dict}
      locale={locale}
      className={padForBottomNav ? "mb-16" : undefined}
    />
  );
}
