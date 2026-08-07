"use client";

import { useEffect, useState } from "react";
import { ExternalLink, X } from "lucide-react";
import type { Dictionary } from "@/i18n/dictionaries";
import {
  CROSS_PROMO_URL,
  dismissCrossPromo,
  isCrossPromoDismissed,
} from "@/lib/cross-promo";
import type { EventListView } from "@/lib/event-list-view";

type CrossPromoVariant = "strip" | "list";

interface CrossPromoBannerProps {
  dict: Dictionary;
  variant?: CrossPromoVariant;
  /** For list variant: match surrounding card/list density. */
  view?: EventListView;
  className?: string;
}

function DomenusMark({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      className={className}
      aria-hidden
      fill="none"
    >
      {/* Stylized QR + plate mark */}
      <rect x="4" y="4" width="16" height="16" rx="2" stroke="currentColor" strokeWidth="2.5" />
      <rect x="8" y="8" width="8" height="8" rx="1" fill="currentColor" />
      <rect x="28" y="4" width="16" height="16" rx="2" stroke="currentColor" strokeWidth="2.5" />
      <rect x="32" y="8" width="8" height="8" rx="1" fill="currentColor" />
      <rect x="4" y="28" width="16" height="16" rx="2" stroke="currentColor" strokeWidth="2.5" />
      <rect x="8" y="32" width="8" height="8" rx="1" fill="currentColor" />
      <rect x="28" y="28" width="7" height="7" rx="1" fill="currentColor" />
      <rect x="37" y="28" width="7" height="7" rx="1" fill="currentColor" />
      <rect x="28" y="37" width="7" height="7" rx="1" fill="currentColor" />
      <path
        d="M37 40.5h7M40.5 37v7"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function SponsorBadge({
  label,
  className = "",
}: {
  label: string;
  className?: string;
}) {
  return (
    <span
      className={`
        absolute z-[2] inline-flex items-center rounded-full
        bg-black/55 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide
        text-white backdrop-blur-sm pointer-events-none
        ${className}
      `}
    >
      {label}
    </span>
  );
}

function DismissButton({
  label,
  onClick,
  className = "",
}: {
  label: string;
  onClick: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={`
        absolute z-[3] flex h-8 w-8 items-center justify-center rounded-full
        bg-black/35 text-white backdrop-blur-sm transition-colors
        hover:bg-black/55
        ${className}
      `}
    >
      <X className="h-3.5 w-3.5" strokeWidth={2.5} />
    </button>
  );
}

export function CrossPromoBanner({
  dict,
  variant = "strip",
  view = "cards",
  className = "",
}: CrossPromoBannerProps) {
  const [dismissed, setDismissed] = useState(true);

  useEffect(() => {
    setDismissed(isCrossPromoDismissed());
  }, []);

  if (dismissed) return null;

  function dismiss() {
    dismissCrossPromo();
    setDismissed(true);
  }

  const copy = dict.crossPromo;

  if (variant === "list" && view === "cards") {
    return (
      <aside
        className={`
          group relative flex h-full min-w-0 flex-col overflow-hidden rounded-2xl
          bg-white dark:bg-neutral-900
          border border-teal-200/80 dark:border-teal-900/70
          shadow-[0_2px_12px_-4px_rgba(0,0,0,0.08)] dark:shadow-[0_2px_12px_-4px_rgba(0,0,0,0.3)]
          hover:border-teal-400 hover:shadow-[0_8px_24px_-8px_rgba(13,148,136,0.28)]
          dark:hover:border-teal-700 dark:hover:shadow-[0_8px_24px_-8px_rgba(13,148,136,0.35)]
          active:scale-[0.99] transition-[border-color,box-shadow,transform] duration-300
          ${className}
        `}
        aria-label={copy.ariaLabel}
      >
        <a
          href={CROSS_PROMO_URL}
          target="_blank"
          rel="noopener noreferrer sponsored"
          className="absolute inset-0 z-0 rounded-2xl touch-manipulation focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-500"
          aria-label={copy.cta}
        />
        <DismissButton
          label={copy.dismiss}
          onClick={dismiss}
          className="right-2 top-2"
        />
        <div
          className="
            relative aspect-[4/3] w-full overflow-hidden pointer-events-none
            bg-gradient-to-br from-teal-950 via-teal-800 to-emerald-700
          "
        >
          <SponsorBadge label={copy.sponsor} className="left-2 top-2" />
          <div
            className="absolute inset-0 opacity-[0.12]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px)",
              backgroundSize: "14px 14px",
            }}
            aria-hidden
          />
          <div className="absolute -right-4 -top-4 h-28 w-28 rounded-full bg-lime-300/20 blur-2xl" aria-hidden />
          <div className="absolute -bottom-6 -left-4 h-24 w-24 rounded-full bg-teal-300/25 blur-2xl" aria-hidden />
          <div className="relative flex h-full flex-col items-center justify-center gap-2 px-4 text-center">
            <DomenusMark className="h-11 w-11 text-lime-200" />
            <p
              className="font-[family-name:var(--font-display)] text-2xl font-extrabold tracking-tight text-white"
              style={{ fontFamily: "var(--font-display), system-ui, sans-serif" }}
            >
              {copy.brand}
            </p>
            <span className="rounded-full bg-white/15 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider text-lime-100 ring-1 ring-white/20 backdrop-blur-sm">
              {copy.price}
            </span>
          </div>
        </div>
        <div className="relative z-[1] flex flex-1 flex-col gap-1 p-3 pointer-events-none">
          <h3 className="line-clamp-2 font-sans text-[0.9375rem] font-semibold leading-snug tracking-tight text-neutral-900 dark:text-neutral-100 sm:text-base">
            {copy.title}
          </h3>
          <p className="line-clamp-2 text-[13px] font-medium leading-snug text-neutral-500 dark:text-neutral-400">
            {copy.body}
          </p>
          <span className="mt-auto inline-flex items-center gap-1 pt-1.5 text-[13px] font-bold text-teal-700 dark:text-teal-400">
            {copy.cta}
            <ExternalLink className="h-3.5 w-3.5 opacity-70" aria-hidden />
          </span>
        </div>
      </aside>
    );
  }

  if (variant === "list" && view === "list") {
    return (
      <aside
        className={`
          group relative w-full overflow-hidden rounded-2xl
          bg-white dark:bg-neutral-900 px-4 py-[1.125rem]
          border border-teal-200/80 dark:border-teal-900/70
          shadow-[0_2px_12px_-4px_rgba(0,0,0,0.08)] dark:shadow-[0_2px_12px_-4px_rgba(0,0,0,0.3)]
          hover:border-teal-400 hover:shadow-[0_8px_24px_-8px_rgba(13,148,136,0.28)]
          dark:hover:border-teal-700
          active:scale-[0.99] transition-all duration-200
          ${className}
        `}
        aria-label={copy.ariaLabel}
      >
        <a
          href={CROSS_PROMO_URL}
          target="_blank"
          rel="noopener noreferrer sponsored"
          className="absolute inset-0 z-0 rounded-2xl touch-manipulation focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-500"
          aria-label={copy.cta}
        />
        <DismissButton
          label={copy.dismiss}
          onClick={dismiss}
          className="right-2.5 top-2.5 bg-neutral-900/40 hover:bg-neutral-900/60"
        />
        <SponsorBadge
          label={copy.sponsor}
          className="left-2.5 top-2.5 bg-neutral-900/55"
        />
        <div className="relative z-[1] flex gap-3.5 text-left pointer-events-none pr-8 pt-5">
          <div
            className="
              relative flex h-[4.25rem] w-[4.25rem] flex-shrink-0 items-center justify-center
              overflow-hidden rounded-xl
              bg-gradient-to-br from-teal-950 via-teal-800 to-emerald-700
              text-lime-200 shadow-sm
            "
            aria-hidden
          >
            <DomenusMark className="h-8 w-8" />
          </div>
          <div className="min-w-0 flex-1 pt-0.5">
            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-teal-700 dark:text-teal-400">
              {copy.brand} · {copy.price}
            </p>
            <h3 className="mt-0.5 text-[1.25rem] font-bold leading-[1.3] text-neutral-900 dark:text-neutral-100 line-clamp-2">
              {copy.title}
            </h3>
            <p className="mt-1 text-[13px] font-medium leading-snug text-neutral-500 dark:text-neutral-400 line-clamp-1">
              {copy.body}
            </p>
          </div>
        </div>
      </aside>
    );
  }

  /* Home strip — branded, dense horizontal (same visual language as the card) */
  return (
    <aside
      className={`
        group relative overflow-hidden rounded-2xl
        border border-teal-200/80 dark:border-teal-900/70
        bg-gradient-to-r from-teal-950 via-teal-800 to-emerald-700
        shadow-[0_2px_12px_-4px_rgba(0,0,0,0.12)]
        hover:shadow-[0_8px_24px_-8px_rgba(13,148,136,0.35)]
        transition-shadow duration-300
        ${className}
      `}
      aria-label={copy.ariaLabel}
    >
      <a
        href={CROSS_PROMO_URL}
        target="_blank"
        rel="noopener noreferrer sponsored"
        className="absolute inset-0 z-0 rounded-2xl touch-manipulation focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime-300"
        aria-label={copy.cta}
      />
      <DismissButton
        label={copy.dismiss}
        onClick={dismiss}
        className="right-2 top-2"
      />
      <SponsorBadge label={copy.sponsor} className="left-2 top-2" />
      <div
        className="absolute inset-0 opacity-[0.1] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.6) 1px, transparent 1px)",
          backgroundSize: "16px 16px",
        }}
        aria-hidden
      />
      <div className="absolute -right-8 -top-10 h-32 w-32 rounded-full bg-lime-300/20 blur-2xl pointer-events-none" aria-hidden />
      <div className="absolute -bottom-10 left-1/3 h-28 w-28 rounded-full bg-teal-300/20 blur-2xl pointer-events-none" aria-hidden />
      <div className="relative z-[1] flex items-center gap-3 px-3.5 pb-3 pt-8 pr-11 sm:gap-4 sm:px-5 sm:pb-3.5 sm:pt-8 pointer-events-none">
        <div
          className="
            flex h-14 w-14 flex-shrink-0 flex-col items-center justify-center gap-0.5 rounded-xl
            bg-white/10 text-lime-200 ring-1 ring-white/20
          "
          aria-hidden
        >
          <DomenusMark className="h-7 w-7" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
            <span
              className="text-[15px] font-extrabold tracking-tight text-white sm:text-base"
              style={{ fontFamily: "var(--font-display), system-ui, sans-serif" }}
            >
              {copy.brand}
            </span>
            <span className="rounded-full bg-lime-300/20 px-2 py-px text-[10px] font-bold uppercase tracking-wider text-lime-100 ring-1 ring-lime-200/30">
              {copy.price}
            </span>
          </div>
          <p className="mt-0.5 text-[13px] font-bold leading-snug text-teal-50 sm:text-[14px]">
            {copy.title}
          </p>
          <p className="mt-0.5 text-[12px] font-medium leading-snug text-teal-200/90 line-clamp-1">
            {copy.body}
          </p>
        </div>
        <span className="inline-flex flex-shrink-0 items-center gap-1 rounded-full bg-lime-300 px-3 py-2 text-[11px] font-bold text-teal-950 sm:px-3.5 sm:text-[12px]">
          {copy.cta}
          <ExternalLink className="h-3.5 w-3.5" aria-hidden />
        </span>
      </div>
    </aside>
  );
}
