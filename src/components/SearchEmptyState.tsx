"use client";

import { ChevronRight } from "lucide-react";
import { EmptyPong } from "@/components/EmptyPong";

interface SearchEmptyStateProps {
  title: string;
  hint: string;
  /** Prominent action — e.g. switch to a time tab that has events. */
  actionLabel?: string;
  onAction?: () => void;
}

export function SearchEmptyState({
  title,
  hint,
  actionLabel,
  onAction,
}: SearchEmptyStateProps) {
  const hasAction = Boolean(actionLabel && onAction);

  return (
    <div className="py-8 sm:py-10">
      <div className="mx-auto max-w-sm text-center">
        <p className="text-lg font-bold tracking-tight text-neutral-800 dark:text-neutral-100 sm:text-xl">
          {title}
        </p>
        {hasAction ? (
          <button
            type="button"
            onClick={onAction}
            className="mt-5 inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-orange-500 via-rose-500 to-fuchsia-500 px-6 py-3 text-[15px] font-bold text-white shadow-sm transition-[filter] hover:brightness-110 touch-manipulation"
          >
            {actionLabel}
            <ChevronRight className="h-4 w-4" aria-hidden />
          </button>
        ) : (
          <p className="mt-2 text-[15px] text-neutral-500 dark:text-neutral-400">
            {hint}
          </p>
        )}
      </div>

      <div className="mt-8">
        <EmptyPong />
      </div>
    </div>
  );
}
