"use client";

import { useState } from "react";
import { Hero } from "@/components/Hero";
import { CategoryGrid } from "@/components/CategoryGrid";
import { EventList } from "@/components/EventList";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import type { EventCategory } from "@/lib/types";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";

interface HomeProps {
  locale: Locale;
  dict: Dictionary;
}

export function Home({ locale, dict }: HomeProps) {
  const [category, setCategory] = useState<EventCategory | null>(null);

  return (
    <main className="flex-1 bg-neutral-50">
      <div className="mx-auto max-w-lg sm:max-w-2xl px-4 pb-12">
        <div className="flex justify-end pt-3">
          <LanguageSwitcher locale={locale} dict={dict} />
        </div>

        <Hero dict={dict} />

        <div className="mb-8">
          <CategoryGrid
            selected={category}
            onSelect={setCategory}
            dict={dict}
          />
        </div>

        <EventList category={category} locale={locale} dict={dict} />
      </div>

      <footer className="border-t border-neutral-100 bg-white py-6 text-center">
        <p className="text-xs text-neutral-400 font-medium">
          {dict.footer.tagline}
        </p>
        <a
          href="https://github.com/steno/EventDR"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-neutral-300 hover:text-neutral-500 transition-colors mt-1 inline-block"
        >
          github.com/steno/EventDR
        </a>
      </footer>
    </main>
  );
}
