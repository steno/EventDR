"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Venue } from "@/lib/types";
import type { Dictionary } from "@/i18n/dictionaries";
import type { Locale } from "@/i18n/config";

interface VenueStripProps {
  locale: Locale;
  dict: Dictionary;
}

export function VenueStrip({ locale, dict }: VenueStripProps) {
  const [venues, setVenues] = useState<Venue[]>([]);

  useEffect(() => {
    fetch("/api/venues")
      .then((r) => r.json())
      .then((d: { venues?: Venue[] }) => setVenues(d.venues ?? []))
      .catch(() => {});
  }, []);

  if (venues.length === 0) return null;

  return (
    <section className="mb-6">
      <h2 className="text-xs font-bold uppercase tracking-widest text-neutral-400 mb-3">
        {dict.venues.title}
      </h2>
      <div className="flex gap-3 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-hide">
        {venues.map((v) => (
          <Link
            key={v.slug}
            href={`/${locale}/venue/${v.slug}`}
            className="
              flex-shrink-0 flex items-center gap-2 rounded-2xl
              bg-white border border-neutral-100 px-4 py-3
              shadow-sm hover:shadow-md transition-shadow
            "
          >
            <span className="text-xl" aria-hidden>
              {v.emoji ?? "📍"}
            </span>
            <div className="min-w-0">
              <p className="text-sm font-bold text-neutral-900 truncate">{v.name}</p>
              <p className="text-xs text-neutral-400">{v.city}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
