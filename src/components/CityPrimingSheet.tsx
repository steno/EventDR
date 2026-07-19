"use client";

import { MapPin, X } from "lucide-react";
import type { Locale } from "@/i18n/config";
import { CITIES, getCityName, type CitySlug } from "@/lib/cities";
import { getOnboardingCopy } from "@/lib/onboarding";

interface CityPrimingSheetProps {
  locale: Locale;
  open: boolean;
  onChoose: (city: CitySlug | null) => void;
  onDismiss: () => void;
}

export function CityPrimingSheet({
  locale,
  open,
  onChoose,
  onDismiss,
}: CityPrimingSheetProps) {
  if (!open) return null;
  const copy = getOnboardingCopy(locale).city;

  return (
    <div className="fixed inset-0 z-[80] flex items-end justify-center sm:items-center sm:p-4">
      <button
        type="button"
        className="absolute inset-0 bg-black/45 backdrop-blur-sm"
        onClick={onDismiss}
        aria-label={copy.dismiss}
      />
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="city-priming-title"
        className="relative w-full max-w-lg rounded-t-3xl bg-white px-5 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-5 shadow-2xl dark:bg-neutral-900 sm:rounded-3xl sm:p-6"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.16em] text-orange-600 dark:text-orange-400">
              {copy.eyebrow}
            </p>
            <h2
              id="city-priming-title"
              className="mt-1 text-2xl font-black tracking-tight text-neutral-950 dark:text-neutral-50"
            >
              {copy.title}
            </h2>
            <p className="mt-2 text-base font-medium leading-relaxed text-neutral-500 dark:text-neutral-400">
              {copy.body}
            </p>
          </div>
          <button
            type="button"
            onClick={onDismiss}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300"
            aria-label={copy.dismiss}
          >
            <X className="h-4 w-4" aria-hidden />
          </button>
        </div>

        <div className="mt-5 space-y-2.5">
          <button
            type="button"
            onClick={() => onChoose(null)}
            className="flex min-h-14 w-full items-center gap-3 rounded-2xl border border-orange-200 bg-orange-50 px-4 text-left font-bold text-orange-800 transition-transform active:scale-[0.98] dark:border-orange-900/70 dark:bg-orange-950/40 dark:text-orange-200"
          >
            <MapPin className="h-5 w-5 shrink-0" aria-hidden />
            {copy.all}
          </button>
          <div className="grid grid-cols-3 gap-2">
            {CITIES.map((city) => (
              <button
                key={city.slug}
                type="button"
                onClick={() => onChoose(city.slug)}
                className="min-h-14 rounded-2xl border border-neutral-200 bg-white px-1.5 text-center text-sm font-bold text-neutral-800 transition-[border-color,transform] hover:border-orange-300 active:scale-[0.98] dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
              >
                {getCityName(city, locale)}
              </button>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
