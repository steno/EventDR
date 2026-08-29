"use client";

import { Ban, CalendarClock, ChevronRight, CircleAlert, ExternalLink } from "lucide-react";
import { IntentLink } from "@/components/IntentLink";
import type { Dictionary } from "@/i18n/dictionaries";
import type { HomeAlert } from "@/lib/alerts";
import { rememberReturnPath } from "@/lib/event-navigation";
import type { Locale } from "@/i18n/config";

interface HomeAlertsProps {
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

export function HomeAlerts({ alerts, dict, locale, returnTo }: HomeAlertsProps) {
  if (alerts.length === 0) return null;

  return (
    <section className="mb-6 sm:mb-8 print:hidden" aria-labelledby="home-alerts-heading">
      <h2
        id="home-alerts-heading"
        className="text-title font-extrabold tracking-tight text-neutral-900 dark:text-neutral-100"
      >
        {dict.alerts.title}
      </h2>
      <ul className="mt-3 divide-y divide-neutral-100 overflow-hidden rounded-2xl border border-neutral-200/90 bg-white dark:divide-neutral-800 dark:border-neutral-800 dark:bg-neutral-950">
        {alerts.map((alert) => {
          const Icon = KIND_ICON[alert.kind];
          const kindLabel = dict.alerts[alert.kind];
          const className =
            "flex items-start gap-3 px-3.5 py-3.5 touch-manipulation transition-colors hover:bg-neutral-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500 dark:hover:bg-neutral-900";
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
  );
}
