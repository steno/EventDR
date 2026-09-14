"use client";

import { ChevronRight } from "lucide-react";
import type { Dictionary } from "@/i18n/dictionaries";
import type { FilterTimeRange } from "@/lib/filters";
import { fillTemplate } from "@/lib/seo";

export type EmptyDaySuggestion = {
  range: FilterTimeRange;
  label: string;
  onSelect: () => void;
};

export type NothingHereContext = {
  category?: string | null;
  area?: string | null;
};

/** Friendly empty-state headline from category, area, and time tab. */
export function nothingHereTitle(
  dict: Dictionary,
  range: FilterTimeRange,
  context: NothingHereContext = {},
): string {
  const category = context.category?.trim() || "";
  const area = context.area?.trim() || "";
  const when =
    range === "all" ? "" : dict.search.emptyWhen[range];
  const vars = { category, area, when };

  if (category && area && when) {
    return fillTemplate(dict.search.noCategoryInAreaWhen, vars);
  }
  if (category && area) {
    return fillTemplate(dict.search.noCategoryInArea, vars);
  }
  if (category && when) {
    return fillTemplate(dict.search.noCategoryWhen, vars);
  }
  if (category) {
    return fillTemplate(dict.search.noCategory, vars);
  }
  if (area && when) {
    return fillTemplate(dict.search.nothingInAreaWhen, vars);
  }
  if (area) {
    return fillTemplate(dict.search.nothingInArea, vars);
  }
  if (when) {
    return fillTemplate(dict.search.nothingHereWhen, vars);
  }
  return dict.search.nothingHere;
}

interface SearchEmptyStateProps {
  title: string;
  hint?: string;
  /** Section label above day suggestion cards. */
  suggestionsHeading?: string;
  suggestions?: EmptyDaySuggestion[];
  /** Quiet secondary action — e.g. clear a price filter. */
  actionLabel?: string;
  onAction?: () => void;
}

export function SearchEmptyState({
  title,
  hint,
  suggestionsHeading,
  suggestions = [],
  actionLabel,
  onAction,
}: SearchEmptyStateProps) {
  const hasSuggestions = suggestions.length > 0;
  const hasAction = Boolean(actionLabel && onAction);

  return (
    <div className="pb-8 pt-5 sm:pb-10 sm:pt-6">
      <h3 className="mx-auto max-w-md text-center text-title font-extrabold tracking-tight text-neutral-800 dark:text-neutral-100 sm:max-w-lg sm:text-display">
        {title}
      </h3>

      {hasSuggestions ? (
        <div className="mx-auto mt-6 max-w-md sm:mt-7">
          {suggestionsHeading ? (
            <p className="mb-3 text-center text-base font-medium text-neutral-500 dark:text-neutral-400">
              {suggestionsHeading}
            </p>
          ) : null}
          <ul className="grid gap-2.5 sm:grid-cols-2">
            {suggestions.map((suggestion) => (
              <li key={suggestion.range}>
                <button
                  type="button"
                  onClick={suggestion.onSelect}
                  className="
                    flex w-full items-center gap-3 rounded-2xl border border-neutral-200/90
                    bg-neutral-50 px-4 py-3.5 text-left transition-[color,background-color,border-color,transform]
                    touch-manipulation hover:border-orange-300 hover:bg-orange-50
                    focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2
                    focus-visible:outline-orange-500 active:scale-[0.99]
                    dark:border-neutral-700 dark:bg-neutral-900/80
                    dark:hover:border-orange-700 dark:hover:bg-orange-950/40
                  "
                >
                  <span className="min-w-0 flex-1 text-lg font-bold tracking-tight text-neutral-900 dark:text-neutral-50">
                    {suggestion.label}
                  </span>
                  <ChevronRight
                    className="h-5 w-5 shrink-0 text-orange-500/80 dark:text-orange-400/80"
                    aria-hidden
                  />
                </button>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {!hasSuggestions && hasAction ? (
        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={onAction}
            className="inline-flex items-center gap-1 rounded-full border border-neutral-200 bg-transparent px-4 py-2 text-lg font-semibold text-neutral-600 transition-colors hover:border-neutral-300 hover:text-neutral-900 touch-manipulation dark:border-neutral-700 dark:text-neutral-400 dark:hover:border-neutral-600 dark:hover:text-neutral-200"
          >
            {actionLabel}
            <ChevronRight className="h-[18px] w-[18px]" aria-hidden />
          </button>
        </div>
      ) : null}

      {!hasSuggestions && !hasAction && hint ? (
        <p className="mx-auto mt-3 max-w-sm text-center text-base text-neutral-500 dark:text-neutral-400">
          {hint}
        </p>
      ) : null}

      {hasSuggestions && hasAction ? (
        <div className="mt-5 text-center">
          <button
            type="button"
            onClick={onAction}
            className="inline-flex items-center gap-1 text-base font-semibold text-neutral-500 transition-colors hover:text-neutral-800 touch-manipulation dark:text-neutral-400 dark:hover:text-neutral-200"
          >
            {actionLabel}
            <ChevronRight className="h-4 w-4" aria-hidden />
          </button>
        </div>
      ) : null}
    </div>
  );
}
