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

/** Soft elevated panel — warmer wash than surrounding cards so it reads as a callout. */
const NEWSLETTER_PANEL_CLASS =
  "relative mb-8 overflow-hidden rounded-3xl border border-orange-300/70 bg-gradient-to-br from-orange-50 via-[#fff7f0] to-rose-50/80 p-5 shadow-[0_16px_40px_-20px_rgba(244,63,94,0.28)] ring-1 ring-orange-200/40 sm:p-6 dark:border-orange-500/35 dark:from-orange-950/45 dark:via-[#1c1410] dark:to-rose-950/30 dark:shadow-[0_20px_48px_-22px_rgba(0,0,0,0.75)] dark:ring-orange-400/15 print:hidden";

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
        className="pointer-events-none absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-orange-500 via-rose-500 to-fuchsia-500"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-8 -top-10 h-36 w-36 rounded-full bg-gradient-to-br from-orange-400/40 via-rose-300/25 to-transparent blur-3xl dark:from-orange-400/30 dark:via-rose-400/15"
      />
      <div className="relative mx-auto flex max-w-xl flex-col items-center text-center">
        <span className="mb-2.5 flex h-9 w-9 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 via-rose-500 to-fuchsia-500 text-white shadow-sm shadow-rose-500/25">
          <Mail className="h-4 w-4" aria-hidden />
        </span>
        <h2
          id="newsletter-heading"
          className={`text-title font-extrabold tracking-tight ${BRAND_GRADIENT_TEXT_CLASS}`}
        >
          {copy.title}
        </h2>
        <p className="mt-1.5 text-copy text-neutral-700 dark:text-neutral-300">
          {copy.body}
        </p>
        {status === "success" ? (
          <p
            className="mt-4 w-full rounded-2xl bg-emerald-500/15 px-4 py-3 text-sm font-bold text-emerald-800 ring-1 ring-emerald-400/25 dark:text-emerald-300"
            role="status"
          >
            {copy.success}
          </p>
        ) : (
          <form onSubmit={submit} action="#" method="post" className="mt-4 w-full">
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
                className="min-h-12 min-w-0 flex-1 rounded-2xl border-0 bg-white px-4 text-base font-medium text-neutral-950 outline-none ring-1 ring-orange-300/70 placeholder:text-neutral-400 focus:ring-2 focus:ring-orange-400 dark:bg-white/[0.1] dark:text-neutral-50 dark:ring-orange-400/25 dark:placeholder:text-neutral-500 dark:focus:ring-orange-400/70"
              />
              <button
                type="submit"
                disabled={status === "loading"}
                className="min-h-12 rounded-2xl bg-gradient-to-r from-orange-500 via-rose-500 to-fuchsia-500 px-5 text-sm font-bold text-white shadow-md shadow-rose-500/35 transition-[transform,filter] hover:brightness-105 active:scale-[0.98] disabled:opacity-60"
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
