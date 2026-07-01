"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";

interface LanguageSwitcherProps {
  locale: Locale;
  dict: Dictionary;
}

export function LanguageSwitcher({ locale, dict }: LanguageSwitcherProps) {
  const pathname = usePathname();
  const router = useRouter();

  function switchLocale(target: Locale) {
    if (target === locale) return;
    const newPath = pathname.replace(`/${locale}`, `/${target}`);
    document.cookie = `eventdr-locale=${target};path=/;max-age=31536000`;
    router.push(newPath);
  }

  return (
    <div
      className="flex items-center gap-1 rounded-full bg-neutral-100 p-1"
      role="group"
      aria-label={dict.lang.switchTo}
    >
      {(["en", "es"] as const).map((lang) => (
        <button
          key={lang}
          type="button"
          onClick={() => switchLocale(lang)}
          className={`
            px-3 py-1 rounded-full text-xs font-bold tracking-wide transition-all
            ${
              locale === lang
                ? "bg-neutral-900 text-white shadow-sm"
                : "text-neutral-500 hover:text-neutral-800"
            }
          `}
          aria-current={locale === lang ? "true" : undefined}
        >
          {dict.lang[lang]}
        </button>
      ))}
    </div>
  );
}
