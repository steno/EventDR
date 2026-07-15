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
      className={
        padForBottomNav
          ? "pb-[calc(6.75rem+env(safe-area-inset-bottom))] lg:pb-8"
          : "pb-6"
      }
    />
  );
}
