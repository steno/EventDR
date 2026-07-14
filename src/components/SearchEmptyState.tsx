"use client";

import { useSyncExternalStore } from "react";
import { EmptyPong } from "@/components/EmptyPong";

interface SearchEmptyStateProps {
  title: string;
  hint: string;
  playHint: string;
}

function subscribeReducedMotion(onChange: () => void) {
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}

function getReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function getServerReducedMotion() {
  return true;
}

export function SearchEmptyState({
  title,
  hint,
  playHint,
}: SearchEmptyStateProps) {
  const reducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotion,
    getServerReducedMotion,
  );

  return (
    <div className="py-6 sm:py-8">
      <div className="text-center">
        <p className="bg-gradient-to-r from-orange-500 via-rose-500 to-fuchsia-500 bg-clip-text text-4xl font-black tracking-tight text-transparent sm:text-5xl">
          0
        </p>
        <p className="mt-2 text-base font-bold text-neutral-800 dark:text-neutral-100 sm:text-lg">
          {title}
        </p>
        <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
          {hint}
        </p>
      </div>

      {/* Keep this subtree mounted — conditional insert/remove fights React. */}
      <div className={`mt-5 ${reducedMotion ? "hidden" : ""}`}>
        <EmptyPong />
        <p className="mt-2 text-center text-[11px] font-medium uppercase tracking-[0.14em] text-neutral-400 dark:text-neutral-500">
          {playHint}
        </p>
      </div>
    </div>
  );
}
