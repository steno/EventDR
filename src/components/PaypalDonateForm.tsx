"use client";

import { useState } from "react";
import {
  DONATE_DEFAULT_AMOUNT,
  DONATE_PRESETS,
  donateUrlForAmount,
  formatDonateAmount,
} from "@/lib/donate";
import {
  fillSupportTemplate,
  impactForAmount,
  type SupportCopy,
} from "@/lib/support-copy";
import { markSupportDonated } from "@/lib/support-nudge";

interface PaypalDonateFormProps {
  copy: SupportCopy;
  available: boolean;
}

export function PaypalDonateForm({ copy, available }: PaypalDonateFormProps) {
  const [amount, setAmount] = useState(DONATE_DEFAULT_AMOUNT);

  const formatted = formatDonateAmount(amount);
  const cta = fillSupportTemplate(copy.form.cta, { amount: formatted });
  const impact = impactForAmount(amount, copy.impact);
  const href = donateUrlForAmount(amount);

  function donate() {
    if (!href) return;
    markSupportDonated();
    window.open(href, "_blank", "noopener,noreferrer");
  }

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

      <div
        className="relative mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4"
        role="radiogroup"
        aria-label={copy.form.amountsAria}
      >
        {DONATE_PRESETS.map((preset) => {
          const selected = amount === preset;
          return (
            <button
              key={preset}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => setAmount(preset)}
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

      <p className="relative mt-3 text-sm font-medium text-orange-200 dark:text-orange-700">
        {impact}
      </p>

      {!available || !href ? (
        <p className="relative mt-5 rounded-2xl bg-white/10 px-4 py-3 text-sm font-medium leading-relaxed text-neutral-200 dark:bg-neutral-900/5 dark:text-neutral-700">
          {copy.form.unavailable}
        </p>
      ) : (
        <>
          <button
            type="button"
            onClick={donate}
            className="relative mt-5 flex min-h-12 w-full items-center justify-center rounded-2xl bg-gradient-to-r from-orange-500 via-rose-500 to-fuchsia-500 px-5 text-base font-black text-white shadow-lg shadow-rose-500/25 transition-transform duration-200 hover:brightness-105 active:scale-[0.98]"
          >
            {cta}
          </button>
          <p className="relative mt-3 text-xs font-medium leading-relaxed text-neutral-400 dark:text-neutral-500">
            {copy.form.viaPaypal}
          </p>
        </>
      )}
    </section>
  );
}
