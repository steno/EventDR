"use client";

import { ChevronRight } from "lucide-react";
import { EmptyPong } from "@/components/EmptyPong";

interface SearchEmptyStateProps {
  title: string;
  hint: string;
  gameLabels: {
    score: string;
    play: string;
    restart: string;
    tapToRestart: string;
  };
  /** Quiet secondary action — e.g. switch to a time tab that has events. */
  actionLabel?: string;
  onAction?: () => void;
}

export function SearchEmptyState({
  title,
  hint,
  gameLabels,
  actionLabel,
  onAction,
}: SearchEmptyStateProps) {
  const hasAction = Boolean(actionLabel && onAction);

  return (
    <div className="pb-8 pt-2 sm:pb-10 sm:pt-3">
      <p className="sr-only">{title}</p>

      <EmptyPong welcome={title} labels={gameLabels} />

      {hasAction ? (
        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={onAction}
            className="inline-flex items-center gap-1 rounded-full border border-neutral-200 bg-transparent px-4 py-2 text-[18px] font-semibold text-neutral-600 transition-colors hover:border-neutral-300 hover:text-neutral-900 touch-manipulation dark:border-neutral-700 dark:text-neutral-400 dark:hover:border-neutral-600 dark:hover:text-neutral-200"
          >
            {actionLabel}
            <ChevronRight className="h-[18px] w-[18px]" aria-hidden />
          </button>
        </div>
      ) : (
        <p className="mt-6 text-center text-[18px] text-neutral-500 dark:text-neutral-400">
          {hint}
        </p>
      )}
    </div>
  );
}
