"use client";

import { useEffect, useState, useTransition } from "react";
import type { Locale } from "@/i18n/config";
import {
  DONATE_DEFAULT_AMOUNT,
  DONATE_MAX_AMOUNT,
  DONATE_MIN_AMOUNT,
  formatDonateAmount,
} from "@/lib/donate";
import {
  DONATE_PRESETS,
  fillSupportTemplate,
  impactForAmount,
  type SupportCopy,
} from "@/lib/support-copy";

type Frequency = "once" | "monthly";

interface DonateFormProps {
  locale: Locale;
  copy: SupportCopy;
  available: boolean;
  canceled?: boolean;
}

export function DonateForm({
  locale,
  copy,
  available,
  canceled = false,
}: DonateFormProps) {
  const [frequency, setFrequency] = useState<Frequency>("once");
  const [amount, setAmount] = useState(DONATE_DEFAULT_AMOUNT);
  const [custom, setCustom] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    if (!custom.trim()) return;
    const parsed = Number(custom);
    if (Number.isFinite(parsed) && parsed > 0) {
      setAmount(
        Math.min(DONATE_MAX_AMOUNT, Math.max(DONATE_MIN_AMOUNT, Math.round(parsed))),
      );
    }
  }, [custom]);

  function selectPreset(value: number) {
    setCustom("");
    setAmount(value);
    setError(null);
  }

  function submit() {
    if (!available) return;
    setError(null);
    startTransition(async () => {
      try {
        const response = await fetch("/api/donate/checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ amount, frequency, locale }),
        });
        const data = (await response.json()) as { url?: string; error?: string };
        if (!response.ok || !data.url) {
          setError(copy.form.error);
          return;
        }
        window.location.assign(data.url);
      } catch {
        setError(copy.form.error);
      }
    });
  }

  const formatted = formatDonateAmount(amount);
  const ctaTemplate = frequency === "monthly" ? copy.form.ctaMonthly : copy.form.ctaOnce;
  const cta = fillSupportTemplate(ctaTemplate, { amount: formatted });
  const impact = impactForAmount(amount, copy.impact);

  return (
    <section
      id="donate"
      className="relative overflow-hidden rounded-[1.75rem] bg-neutral-950 px-5 py-6 text-white shadow-[0_28px_80px_-40px_rgba(0,0,0,0.65)] dark:bg-neutral-100 dark:text-neutral-950"
    >
      <div
        className="pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full bg-gradient-to-br from-orange-500/40 via-rose-500/30 to-fuchsia-500/20 blur-3xl dark:from-orange-400/35 dark:via-rose-400/25 dark:to-fuchsia-400/20"
        aria-hidden
      />

      <h2 className="relative text-xl font-black tracking-tight">{copy.form.title}</h2>

      {canceled ? (
        <p className="relative mt-3 rounded-2xl bg-white/10 px-3 py-2 text-sm font-medium text-neutral-200 dark:bg-neutral-900/5 dark:text-neutral-700">
          {copy.form.cancelNote}
        </p>
      ) : null}

      <div
        className="relative mt-4 inline-flex rounded-full bg-white/10 p-1 dark:bg-neutral-900/10"
        role="group"
        aria-label={copy.form.title}
      >
        {(["once", "monthly"] as const).map((value) => {
          const active = frequency === value;
          return (
            <button
              key={value}
              type="button"
              onClick={() => setFrequency(value)}
              className={[
                "min-h-10 rounded-full px-4 text-sm font-bold transition-all duration-200",
                active
                  ? "bg-gradient-to-r from-orange-500 via-rose-500 to-fuchsia-500 text-white shadow-sm"
                  : "text-neutral-300 hover:text-white dark:text-neutral-600 dark:hover:text-neutral-950",
              ].join(" ")}
            >
              {value === "once" ? copy.form.once : copy.form.monthly}
            </button>
          );
        })}
      </div>

      <div
        className="relative mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4"
        role="radiogroup"
        aria-label={copy.form.amountsAria}
      >
        {DONATE_PRESETS.map((preset) => {
          const selected = !custom && amount === preset;
          return (
            <button
              key={preset}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => selectPreset(preset)}
              className={[
                "min-h-14 rounded-2xl border px-3 text-left transition-all duration-200 active:scale-[0.98]",
                selected
                  ? "border-transparent bg-gradient-to-br from-orange-500 via-rose-500 to-fuchsia-500 text-white shadow-lg shadow-rose-500/20"
                  : "border-white/15 bg-white/5 text-white hover:border-white/30 dark:border-neutral-300 dark:bg-white dark:text-neutral-950 dark:hover:border-neutral-400",
              ].join(" ")}
            >
              <span className="block text-lg font-black tracking-tight">
                {formatDonateAmount(preset)}
              </span>
            </button>
          );
        })}
      </div>

      <label className="relative mt-4 block">
        <span className="text-xs font-bold uppercase tracking-wide text-neutral-400 dark:text-neutral-500">
          {copy.form.customLabel}
        </span>
        <input
          type="number"
          inputMode="numeric"
          min={DONATE_MIN_AMOUNT}
          max={DONATE_MAX_AMOUNT}
          value={custom}
          onChange={(event) => {
            setCustom(event.target.value);
            setError(null);
          }}
          placeholder={copy.form.customPlaceholder}
          className="mt-1.5 min-h-12 w-full rounded-2xl border border-white/15 bg-white/10 px-4 text-base font-semibold text-white placeholder:text-neutral-500 focus:border-orange-400 focus:outline-none dark:border-neutral-300 dark:bg-white dark:text-neutral-950 dark:placeholder:text-neutral-400"
        />
      </label>

      <p className="relative mt-3 text-sm font-medium text-orange-200 dark:text-orange-700">
        {impact}
      </p>

      {!available ? (
        <p className="relative mt-5 rounded-2xl bg-white/10 px-4 py-3 text-sm font-medium leading-relaxed text-neutral-200 dark:bg-neutral-900/5 dark:text-neutral-700">
          {copy.form.unavailable}
        </p>
      ) : (
        <>
          <button
            type="button"
            onClick={submit}
            disabled={pending}
            className="relative mt-5 flex min-h-12 w-full items-center justify-center rounded-2xl bg-gradient-to-r from-orange-500 via-rose-500 to-fuchsia-500 px-5 text-base font-black text-white shadow-lg shadow-rose-500/25 transition-transform duration-200 hover:brightness-105 active:scale-[0.98] disabled:opacity-60"
          >
            {pending ? copy.form.loading : cta}
          </button>
          <p className="relative mt-3 text-xs font-medium leading-relaxed text-neutral-400 dark:text-neutral-500">
            {copy.form.currencyNote} {copy.form.secure}
          </p>
        </>
      )}

      {error ? (
        <p className="relative mt-3 text-sm font-bold text-rose-300 dark:text-rose-700" role="alert">
          {error}
        </p>
      ) : null}
    </section>
  );
}
