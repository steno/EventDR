"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { ThemeToggle } from "@/components/ThemeToggle";
import { WeatherWidget } from "@/components/WeatherWidget";
import { clearHomeArea } from "@/lib/cities";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";

interface AppHeaderProps {
  locale: Locale;
  dict: Dictionary;
  /** Reset in-page home state (search, area URL) when already on `/[locale]`. */
  onLogoClick?: () => void;
  /** Extra actions for wide screens (Saved, Add, etc.). Hidden below `lg`. */
  desktopActions?: ReactNode;
  /** Desktop search between logo and actions (`lg+`). Hidden on smaller screens. */
  search?: ReactNode;
}

export function AppHeader({
  locale,
  dict,
  onLogoClick,
  desktopActions,
  search,
}: AppHeaderProps) {
  const pathname = usePathname();
  const homeHref = `/${locale}`;
  const onHome = pathname === homeHref;

  return (
    <div className="flex items-center gap-3 pt-3 pb-4 lg:pb-5">
      <Link
        href={homeHref}
        aria-label={dict.seo.siteName}
        className="shrink-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500"
        onClick={(e) => {
          // Logo always means a fresh home — drop remembered city/area.
          clearHomeArea();
          if (onHome) {
            e.preventDefault();
            onLogoClick?.();
            window.scrollTo({ top: 0, behavior: "smooth" });
          }
        }}
      >
        <Image
          src="/pop-home-logo.png"
          alt={dict.seo.siteName}
          width={184}
          height={184}
          priority
          unoptimized
          className="h-14 w-auto object-contain sm:h-20"
        />
      </Link>
      {search ? (
        <div className="hidden min-w-0 flex-1 px-2 lg:block">
          <div className="w-full max-w-md">{search}</div>
        </div>
      ) : null}
      <div className="ml-auto flex shrink-0 items-center gap-1.5 sm:gap-2">
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
