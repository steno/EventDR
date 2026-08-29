"use client";

import { useEffect } from "react";
import { Ban, CalendarClock, ChevronRight, CircleAlert, ExternalLink, X } from "lucide-react";
import { IntentLink } from "@/components/IntentLink";
import type { Dictionary } from "@/i18n/dictionaries";
import type { HomeAlert } from "@/lib/alerts";
import { rememberReturnPath } from "@/lib/event-navigation";
import type { Locale } from "@/i18n/config";

interface HomeAlertsProps {
  open: boolean;
  onClose: () => void;
  alerts: HomeAlert[];
  dict: Dictionary;
  locale: Locale;
  returnTo?: string;
}

const KIND_ICON = {
  closure: Ban,
  coming: CalendarClock,
  watch: CircleAlert,
} as const;

function kindClass(kind: HomeAlert["kind"]): string {
  if (kind === "closure") {
    return "bg-rose-50 text-rose-800 dark:bg-rose-500/25 dark:text-rose-200 dark:ring-1 dark:ring-rose-400/35";
  }
  if (kind === "coming") {
    return "bg-sky-50 text-sky-800 dark:bg-sky-500/25 dark:text-sky-200 dark:ring-1 dark:ring-sky-400/35";
  }
  return "bg-amber-50 text-amber-800 dark:bg-amber-500/25 dark:text-amber-200 dark:ring-1 dark:ring-amber-400/35";
}

export function HomeAlerts({
  open,
  onClose,
  alerts,
  dict,
  locale,
  returnTo,
}: HomeAlertsProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, onClose]);

  if (!open || alerts.length === 0) return null;

  return (
    <div className="fixed inset-0 z-[80] flex items-end justify-center print:hidden sm:items-center sm:p-4">
      <button
        type="button"
        className="absolute inset-0 bg-black/45 backdrop-blur-sm"
        onClick={onClose}
        aria-label={dict.detail.close}
      />
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="home-alerts-heading"
        className="relative max-h-[min(88dvh,40rem)] w-full max-w-lg overflow-y-auto rounded-t-3xl bg-white px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-5 shadow-2xl dark:bg-neutral-900 sm:rounded-3xl sm:p-6"
      >
        <div className="flex items-start justify-between gap-4">
          <h2
            id="home-alerts-heading"
            className="text-title font-extrabold tracking-tight text-neutral-950 dark:text-neutral-50"
          >
            {dict.alerts.title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300"
            aria-label={dict.detail.close}
          >
            <X className="h-4 w-4" aria-hidden />
          </button>
        </div>
        <ul className="mt-4 divide-y divide-neutral-100 overflow-hidden rounded-2xl border border-neutral-200/90 dark:divide-neutral-800 dark:border-neutral-800">
          {alerts.map((alert) => {
            const Icon = KIND_ICON[alert.kind];
            const kindLabel = dict.alerts[alert.kind];
            const className =
              "flex items-start gap-3 px-3.5 py-3.5 touch-manipulation transition-colors hover:bg-neutral-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500 dark:hover:bg-neutral-800/80";
            const body = (
              <>
                <span className="min-w-0 flex-1">
                  <span
                    className={`mb-1.5 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold tracking-wide ${kindClass(alert.kind)}`}
                  >
                    <Icon className="h-3.5 w-3.5" aria-hidden />
                    {kindLabel}
                  </span>
                  <span className="block font-semibold leading-snug text-neutral-950 dark:text-neutral-50">
                    {alert.title}
                  </span>
                  <span className="mt-0.5 block text-sm leading-snug text-neutral-500 dark:text-neutral-400">
                    {alert.summary}
                  </span>
                </span>
                {alert.external ? (
                  <ExternalLink
                    className="mt-1 h-4 w-4 shrink-0 text-neutral-400"
                    aria-hidden
                  />
                ) : (
                  <ChevronRight
                    className="mt-1 h-4 w-4 shrink-0 text-neutral-400"
                    aria-hidden
                  />
                )}
              </>
            );

            return (
              <li key={alert.id}>
                {alert.external ? (
                  <a
                    href={alert.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={className}
                  >
                    {body}
                  </a>
                ) : (
                  <IntentLink
                    href={alert.href}
                    className={className}
                    onClick={() => rememberReturnPath(returnTo ?? `/${locale}`)}
                  >
                    {body}
                  </IntentLink>
                )}
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}
