"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { ThemeToggle } from "@/components/ThemeToggle";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";

interface AppHeaderProps {
  locale: Locale;
  dict: Dictionary;
  /** Reset in-page home state (e.g. discover tab) when already on `/[locale]`. */
  onLogoClick?: () => void;
}

export function AppHeader({ locale, dict, onLogoClick }: AppHeaderProps) {
  const pathname = usePathname();
  const homeHref = `/${locale}`;
  const onHome = pathname === homeHref;

  return (
    <div className="flex items-center justify-between pt-3 pb-5">
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
          className="h-[68px] w-auto object-contain sm:h-20"
        />
      </Link>
      <div className="flex items-center gap-2">
        <ThemeToggle dict={dict} />
        <LanguageSwitcher locale={locale} dict={dict} />
      </div>
    </div>
  );
}
