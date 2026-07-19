"use client";

import { useEffect, useState } from "react";
import { Check } from "lucide-react";

const STORAGE_KEY = "pop-partner-checklist-v1";

interface PartnerChecklistProps {
  title: string;
  steps: string[];
}

export function PartnerChecklist({ title, steps }: PartnerChecklistProps) {
  const [completed, setCompleted] = useState<Set<number>>(new Set());

  useEffect(() => {
    let storedSteps: number[] = [];
    try {
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
      if (Array.isArray(stored)) storedSteps = stored;
    } catch {
      /* Storage can be unavailable in private browsing. */
    }
    const frame = window.requestAnimationFrame(() =>
      setCompleted(new Set(storedSteps)),
    );
    return () => window.cancelAnimationFrame(frame);
  }, []);

  function toggle(index: number) {
    setCompleted((current) => {
      const next = new Set(current);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify([...next]));
      } catch {
        /* Ignore storage failures; the checklist still works for this visit. */
      }
      return next;
    });
  }

  return (
    <section className="mb-8">
      <div className="mb-3 flex items-center justify-between gap-3">
        <h2 className="text-lg font-black text-neutral-900 dark:text-neutral-100 print:text-black">
          {title}
        </h2>
        <span className="rounded-full bg-neutral-100 px-2.5 py-1 text-xs font-bold text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400 print:hidden">
          {completed.size}/{steps.length}
        </span>
      </div>
      <ol className="space-y-2.5">
        {steps.map((step, index) => {
          const checked = completed.has(index);
          return (
            <li key={step}>
              <button
                type="button"
                onClick={() => toggle(index)}
                className={`flex w-full items-start gap-3 rounded-2xl border p-3 text-left transition-colors print:border-0 print:p-0 ${
                  checked
                    ? "border-emerald-200 bg-emerald-50 dark:border-emerald-900/60 dark:bg-emerald-950/30"
                    : "border-neutral-200 bg-white hover:border-orange-300 dark:border-neutral-700 dark:bg-neutral-900"
                }`}
                aria-pressed={checked}
              >
                <span
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-black ${
                    checked
                      ? "bg-emerald-600 text-white"
                      : "bg-gradient-to-br from-orange-500 to-rose-500 text-white print:bg-neutral-800"
                  }`}
                >
                  {checked ? (
                    <Check className="h-4 w-4" aria-hidden />
                  ) : (
                    index + 1
                  )}
                </span>
                <span
                  className={`pt-1 text-sm font-medium print:text-neutral-800 ${
                    checked
                      ? "text-emerald-900 dark:text-emerald-100"
                      : "text-neutral-600 dark:text-neutral-300"
                  }`}
                >
                  {step}
                </span>
              </button>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
