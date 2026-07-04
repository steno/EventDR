"use client";

import { usePathname, useRouter } from "next/navigation";
import { locales, type Locale } from "@/i18n/config";
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
      className="flex items-center gap-0.5 rounded-full bg-white/85 p-1 shadow-sm ring-1 ring-neutral-200/70 backdrop-blur"
      role="group"
      aria-label={dict.lang.switchTo}
    >
      {locales.map((lang) => (
        <button
          key={lang}
          type="button"
          onClick={() => switchLocale(lang)}
          className={`
            px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wide transition-all
            ${
              locale === lang
                ? "bg-gradient-to-r from-orange-500 via-rose-500 to-fuchsia-500 text-white shadow-sm"
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
