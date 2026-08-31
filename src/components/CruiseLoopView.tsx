"use client";

import { ChevronRight, MapPinned, Navigation } from "lucide-react";
import { CruiseLoopLeaflet } from "@/components/CruiseLoopLeaflet";
import { CruiseLoopShare } from "@/components/CruiseLoopShare";
import { IntentLink } from "@/components/IntentLink";
import type { Dictionary } from "@/i18n/dictionaries";
import type { CruiseStopLink, LoopMapStop } from "@/lib/cruise";
import { PAGE_SHELL_DETAIL_CLASS } from "@/lib/page-shell";
import { fillTemplate } from "@/lib/seo";
import type { LatLngTuple } from "@/lib/routing";

export function CruiseLoopView({
  dict,
  portName,
  title,
  body,
  minutes,
  backHref,
  shareUrl,
  googleMapsUrl,
  appleMapsUrl,
  osmEmbedUrl,
  mapStops,
  route,
  legs,
  stops,
}: {
  dict: Dictionary;
  portName: string;
  title: string;
  body: string;
  minutes: number;
  backHref: string;
  shareUrl: string;
  googleMapsUrl: string;
  appleMapsUrl: string;
  osmEmbedUrl: string;
  mapStops: LoopMapStop[];
  route: LatLngTuple[] | null;
  legs: string[];
  stops: CruiseStopLink[];
}) {
  const copy = dict.cruise;

  return (
    <main className="relative bg-background pb-10 dark:bg-transparent">
      <div className={PAGE_SHELL_DETAIL_CLASS}>
        <header className="pb-2 pt-4">
          <IntentLink
            href={backHref}
            className="text-sm font-semibold text-orange-600 transition-colors hover:text-orange-500"
          >
            ← {copy.backToCruiseDay}
          </IntentLink>
        </header>

        <p className="mt-3 text-xs font-bold uppercase tracking-[0.18em] text-orange-600 dark:text-orange-400">
          {copy.eyebrow} · {portName}
        </p>
        <div className="mt-2 flex items-start justify-between gap-3">
          <h1 className="font-sans text-display font-extrabold tracking-tight text-neutral-950 dark:text-neutral-50">
            {title}
          </h1>
          <span className="mt-1 shrink-0 rounded-full bg-orange-50 px-2.5 py-1 text-xs font-bold text-orange-700 dark:bg-orange-950/50 dark:text-orange-300">
            {fillTemplate(copy.itineraryMinutes, { minutes: String(minutes) })}
          </span>
        </div>
        <p className="mt-2 max-w-xl text-copy-lead text-neutral-600 dark:text-neutral-300">
          {body}
        </p>

        <section className="mt-5 overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-100 dark:border-neutral-800 dark:bg-neutral-900">
          <div className="relative h-[min(22rem,70dvh)] w-full sm:h-[28rem]">
            {osmEmbedUrl ? (
              <iframe
                title={title}
                src={osmEmbedUrl}
                className="h-full w-full border-0"
                loading="lazy"
              />
            ) : mapStops.length === 0 ? (
              <div className="flex h-full items-center justify-center px-4 text-center text-sm text-neutral-500">
                {copy.routeUnavailable}
              </div>
            ) : null}
            {mapStops.length > 0 ? (
              <div className="pointer-events-none absolute inset-0 [&_.leaflet-container]:pointer-events-auto">
                <CruiseLoopLeaflet stops={mapStops} route={route} />
              </div>
            ) : null}
          </div>
        </section>
        {!route && mapStops.length > 0 ? (
          <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">
            {copy.routeUnavailable}
          </p>
        ) : null}

        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          {googleMapsUrl ? (
            <a
              href={googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-orange-600 px-4 text-sm font-bold text-white shadow-sm touch-manipulation transition hover:bg-orange-500 active:scale-[0.98]"
            >
              <Navigation className="h-4 w-4" aria-hidden />
              {copy.openGoogleMaps}
            </a>
          ) : null}
          {appleMapsUrl ? (
            <a
              href={appleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-neutral-300 bg-white px-4 text-sm font-bold text-neutral-800 shadow-sm touch-manipulation transition hover:bg-neutral-50 active:scale-[0.98] dark:border-neutral-600 dark:bg-neutral-900 dark:text-neutral-100 dark:hover:bg-neutral-800"
            >
              <MapPinned className="h-4 w-4" aria-hidden />
              {copy.openAppleMaps}
            </a>
          ) : null}
        </div>
        <div className="mt-2">
          <CruiseLoopShare
            title={title}
            url={shareUrl}
            shareLabel={copy.shareLoop}
            copyLabel={copy.copyLink}
            copiedLabel={copy.linkCopied}
          />
        </div>

        {legs.length > 0 ? (
          <section className="mt-8">
            <h2 className="text-section font-extrabold text-neutral-950 dark:text-neutral-100">
              {copy.routeTitle}
            </h2>
            <ol className="mt-3 space-y-1">
              {legs.map((leg) => (
                <li
                  key={leg}
                  className="rounded-xl bg-neutral-50 px-3 py-2.5 text-sm font-semibold text-neutral-800 dark:bg-neutral-900 dark:text-neutral-100"
                >
                  {leg}
                </li>
              ))}
            </ol>
          </section>
        ) : null}

        {stops.length > 0 ? (
          <section className="mt-8 mb-4">
            <h2 className="text-section font-extrabold text-neutral-950 dark:text-neutral-100">
              {copy.stopsTitle}
            </h2>
            <ol className="mt-3 space-y-0.5">
              <li className="flex min-h-11 items-center gap-2 rounded-lg px-1 py-1.5 text-sm font-semibold text-neutral-600 dark:text-neutral-300">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-50 text-[11px] font-bold text-blue-700 dark:bg-blue-950/50 dark:text-blue-300">
                  S
                </span>
                {copy.fromTheShip}
              </li>
              {stops.map((stop, index) => (
                <li key={stop.slug}>
                  <IntentLink
                    href={stop.href}
                    className="flex min-h-11 items-center gap-2 rounded-lg px-1 py-1.5 text-sm font-semibold text-orange-700 touch-manipulation active:bg-orange-50 dark:text-orange-300 dark:active:bg-orange-950/40"
                  >
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-orange-50 text-[11px] font-bold text-orange-700 dark:bg-orange-950/50 dark:text-orange-300">
                      {index + 1}
                    </span>
                    <span className="min-w-0 flex-1 truncate underline decoration-orange-300 underline-offset-[3px] dark:decoration-orange-700">
                      {stop.name}
                    </span>
                    <ChevronRight
                      className="h-4 w-4 shrink-0 text-orange-500 dark:text-orange-400"
                      aria-hidden
                    />
                  </IntentLink>
                </li>
              ))}
              <li className="flex min-h-11 items-center gap-2 rounded-lg px-1 py-1.5 text-sm font-semibold text-neutral-600 dark:text-neutral-300">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-50 text-[11px] font-bold text-blue-700 dark:bg-blue-950/50 dark:text-blue-300">
                  S
                </span>
                {copy.backToTheShip}
              </li>
            </ol>
          </section>
        ) : null}
      </div>
    </main>
  );
}
