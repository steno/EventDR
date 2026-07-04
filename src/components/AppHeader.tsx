"use client";

import Image from "next/image";
import Link from "next/link";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";

interface AppHeaderProps {
  locale: Locale;
  dict: Dictionary;
}

export function AppHeader({ locale, dict }: AppHeaderProps) {
  return (
    <div className="flex items-center justify-between pt-3 pb-5">
      <Link href={`/${locale}`} aria-label="POP Events home">
        <Image
          src="/poplogo-safe.png?v=1"
          alt="POP Events logo"
          width={184}
          height={166}
          priority
          unoptimized
          className="h-[68px] w-auto rounded-2xl object-contain sm:h-20"
        />
      </Link>
      <LanguageSwitcher locale={locale} dict={dict} />
    </div>
  );
}
