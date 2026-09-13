"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail } from "lucide-react";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { BRAND_GRADIENT_TEXT_CLASS } from "@/lib/page-shell";

interface NewsletterSignupProps {
  locale: Locale;
  dict: Dictionary;
}

/** Soft elevated panel — same warm wash as cruise day cards. */
const NEWSLETTER_PANEL_CLASS =
  "relative mb-8 overflow-hidden rounded-3xl border border-orange-200/45 bg-gradient-to-br from-white via-[#fffaf6] to-orange-50/50 p-5 shadow-[0_12px_32px_-18px_rgba(244,63,94,0.16)] sm:p-6 dark:border-white/10 dark:from-[#1c1917] dark:via-[#171412] dark:to-[#201610] dark:shadow-[0_20px_48px_-24px_rgba(0,0,0,0.7),0_0_40px_-20px_rgba(249,115,22,0.28),inset_0_1px_0_0_rgba(255,255,255,0.07)] print:hidden";

export function NewsletterSignup({ locale, dict }: NewsletterSignupProps) {
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle",
  );
  const copy = dict.newsletter;

  async function submit(event?: React.FormEvent) {
    event?.preventDefault();
    setStatus("loading");
    try {
      const response = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, company, locale }),
      });
      if (!response.ok) throw new Error("subscribe-failed");
      setStatus("success");
      setEmail("");
    } catch {
      setStatus("error");
    }
  }

  return (
    <section
      className={NEWSLETTER_PANEL_CLASS}
      aria-labelledby="newsletter-heading"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -right-10 -top-12 h-40 w-40 rounded-full bg-gradient-to-br from-orange-300/35 via-rose-300/20 to-transparent blur-3xl dark:from-orange-400/35 dark:via-rose-400/18"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-orange-400/50 to-transparent dark:via-orange-300/40"
      />
      <div className="relative">
        <div className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-400/20 via-rose-400/15 to-fuchsia-400/10 text-orange-600 ring-1 ring-orange-300/30 dark:from-orange-400/25 dark:via-rose-400/20 dark:to-fuchsia-400/15 dark:text-orange-300 dark:ring-orange-300/25">
            <Mail className="h-4 w-4" aria-hidden />
          </span>
          <h2
            id="newsletter-heading"
            className={`min-w-0 text-title font-extrabold tracking-tight ${BRAND_GRADIENT_TEXT_CLASS}`}
          >
            {copy.title}
          </h2>
        </div>
        <p className="mt-1.5 max-w-xl text-copy text-neutral-600 dark:text-neutral-300">
          {copy.body}
        </p>
        {status === "success" ? (
          <p
            className="mt-4 rounded-2xl bg-emerald-500/15 px-4 py-3 text-sm font-bold text-emerald-800 ring-1 ring-emerald-400/25 dark:text-emerald-300"
            role="status"
          >
            {copy.success}
          </p>
        ) : (
          <form onSubmit={submit} action="#" method="post" className="mt-4 max-w-xl">
            <input
              type="text"
              value={company}
              onChange={(event) => setCompany(event.target.value)}
              tabIndex={-1}
              autoComplete="off"
              className="hidden"
              aria-hidden
            />
            <div className="flex flex-col gap-2 sm:flex-row">
              <label className="sr-only" htmlFor="weekend-newsletter-email">
                Email
              </label>
              <input
                id="weekend-newsletter-email"
                type="email"
                required
                autoComplete="email"
                inputMode="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder={copy.placeholder}
                className="min-h-12 min-w-0 flex-1 rounded-2xl border-0 bg-white/95 px-4 text-base font-medium text-neutral-950 outline-none ring-1 ring-orange-200/60 placeholder:text-neutral-400 focus:ring-2 focus:ring-orange-400 dark:bg-white/[0.08] dark:text-neutral-50 dark:ring-white/12 dark:placeholder:text-neutral-500 dark:focus:ring-orange-400/70"
              />
              <button
                type="submit"
                disabled={status === "loading"}
                className="min-h-12 rounded-2xl bg-gradient-to-r from-orange-500 via-rose-500 to-fuchsia-500 px-5 text-sm font-bold text-white shadow-sm shadow-rose-500/30 transition-[transform,filter] active:scale-[0.98] disabled:opacity-60"
              >
                {status === "loading" ? "…" : copy.button}
              </button>
            </div>
            <p className="mt-2 text-xs font-medium text-neutral-500 dark:text-neutral-400">
              {status === "error" ? (
                copy.error
              ) : (
                <>
                  {copy.privacy}{" "}
                  <Link
                    href={`/${locale}/privacy`}
                    className="underline decoration-orange-300/70 underline-offset-2 hover:text-orange-700 dark:decoration-orange-700 dark:hover:text-orange-200"
                  >
                    {copy.privacyLink}
                  </Link>
                </>
              )}
            </p>
          </form>
        )}
      </div>
    </section>
  );
}
