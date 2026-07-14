"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { ThemeToggle } from "@/components/ThemeToggle";
import { WeatherWidget } from "@/components/WeatherWidget";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";

interface AppHeaderProps {
  locale: Locale;
  dict: Dictionary;
  /** Reset in-page home state (e.g. discover tab) when already on `/[locale]`. */
  onLogoClick?: () => void;
  /** Extra actions for wide screens (Saved, Add, etc.). Hidden below `lg`. */
  desktopActions?: ReactNode;
}

export function AppHeader({
  locale,
  dict,
  onLogoClick,
  desktopActions,
}: AppHeaderProps) {
  const pathname = usePathname();
  const homeHref = `/${locale}`;
  const onHome = pathname === homeHref;

  return (
    <div className="flex items-center justify-between gap-3 pt-3 pb-4 lg:border-b lg:border-neutral-200/70 lg:pb-5 dark:lg:border-neutral-800/80">
      <Link
        href={homeHref}
        aria-label="POP Events home"
        className="focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500"
        onClick={(e) => {
          if (onHome) {
            e.preventDefault();
            onLogoClick?.();
            window.scrollTo({ top: 0, behavior: "smooth" });
          }
        }}
      >
        <Image
          src="/poplogo-safe.png?v=1"
          alt="POP Events logo"
          width={184}
          height={166}
          priority
          unoptimized
          className="h-14 w-auto object-contain sm:h-20"
        />
      </Link>
      <div className="flex items-center gap-1.5 sm:gap-2">
        {desktopActions ? (
          <div className="mr-1 hidden items-center gap-1.5 lg:flex">
            {desktopActions}
          </div>
        ) : null}
        <WeatherWidget locale={locale} dict={dict} />
        <ThemeToggle dict={dict} />
        <LanguageSwitcher locale={locale} dict={dict} />
      </div>
    </div>
  );
}
