"use client";

import { useState } from "react";
import { IntentLink } from "@/components/IntentLink";
import { getCategoryMeta } from "@/lib/categories";
import { getEventCategoryList } from "@/lib/categorize";
import { eventCitySlug } from "@/lib/cities";
import { categoryPath } from "@/lib/event-navigation";
import type { Dictionary } from "@/i18n/dictionaries";
import type { Locale } from "@/i18n/config";
import type { Event } from "@/lib/types";

interface EventCategoryLinksProps {
  event: Pick<Event, "category" | "categories" | "location" | "venue" | "address">;
  locale: Locale;
  dict: Dictionary;
  className?: string;
  /** Set false when rendered inside another link (event cards). */
  linkable?: boolean;
  /** Store back-nav to this event when a category pill is tapped. */
  returnTo?: string | null;
  returnTitle?: string | null;
}

function categoryChipClass(
  index: number,
  linkable: boolean,
  pending: boolean,
  dimmed: boolean,
): string {
  const base =
    index === 0
      ? "inline-flex items-center gap-1 rounded-full bg-neutral-100 dark:bg-neutral-800 px-2.5 py-1 text-xs font-bold text-neutral-800 dark:text-neutral-200"
      : "inline-flex items-center gap-1 rounded-full bg-neutral-50 dark:bg-neutral-900 px-2.5 py-1 text-xs font-semibold text-neutral-600 dark:text-neutral-400 ring-1 ring-neutral-200/80 dark:ring-neutral-700/80";

  if (!linkable) return base;

  if (pending) {
    return `${base} scale-[0.98] ring-2 ring-orange-500/80 shadow-[0_8px_18px_-10px_rgba(251,146,60,0.45)] dark:ring-orange-400/70 transition-[transform,box-shadow,opacity,ring-color] touch-manipulation`;
  }
  if (dimmed) {
    return `${base} opacity-45 transition-opacity touch-manipulation`;
  }

  return index === 0
    ? `${base} hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-[colors,transform] active:scale-[0.98] touch-manipulation`
    : `${base} hover:text-orange-600 hover:ring-orange-200/80 dark:hover:ring-orange-900/50 transition-[colors,transform] active:scale-[0.98] touch-manipulation`;
}

export function EventCategoryLinks({
  event,
  locale,
  dict,
  className = "",
  linkable = true,
  returnTo,
  returnTitle,
}: EventCategoryLinksProps) {
  const [pendingId, setPendingId] = useState<string | null>(null);
  const ids = getEventCategoryList(event);
  if (ids.length === 0) return null;
  const citySlug = eventCitySlug(event);

  return (
    <div className={`flex flex-wrap gap-1.5 ${className}`}>
      {ids.map((id, index) => {
        const meta = getCategoryMeta(id, dict.categories);
        if (!meta) return null;

        const pending = pendingId === id;
        const dimmed = pendingId != null && pendingId !== id;
        const chipClass = categoryChipClass(index, linkable, pending, dimmed);
        const content = (
          <>
            <span aria-hidden>{meta.emoji}</span>
            {meta.label}
          </>
        );

        if (!linkable) {
          return (
            <span key={id} className={chipClass}>
              {content}
            </span>
          );
        }

        return (
          <IntentLink
            key={id}
            href={categoryPath(locale, id, citySlug)}
            className={chipClass}
            aria-busy={pending || undefined}
            returnTo={returnTo}
            returnTitle={returnTitle}
            onClick={() => setPendingId(id)}
          >
            {content}
          </IntentLink>
        );
      })}
    </div>
  );
}
