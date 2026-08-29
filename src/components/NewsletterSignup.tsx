"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail } from "lucide-react";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";

interface NewsletterSignupProps {
  locale: Locale;
  dict: Dictionary;
}

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
      className="mb-8 rounded-3xl border border-neutral-200/90 bg-neutral-50 p-5 sm:p-6 dark:border-neutral-800 dark:bg-neutral-950 print:hidden"
      aria-labelledby="newsletter-heading"
    >
      <div className="flex items-start gap-3">
        <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-orange-500/10 text-orange-600 dark:text-orange-400">
          <Mail className="h-5 w-5" aria-hidden />
        </span>
        <div className="min-w-0 flex-1">
          <h2
            id="newsletter-heading"
            className="text-title font-extrabold tracking-tight text-neutral-950 dark:text-neutral-50"
          >
            {copy.title}
          </h2>
          <p className="mt-1 max-w-xl text-copy text-neutral-600 dark:text-neutral-400">
            {copy.body}
          </p>
          {status === "success" ? (
            <p
              className="mt-4 rounded-2xl bg-emerald-500/15 px-4 py-3 text-sm font-bold text-emerald-800 dark:text-emerald-300"
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
                  className="min-h-12 min-w-0 flex-1 rounded-2xl border border-neutral-200 bg-white px-4 text-base font-medium text-neutral-950 placeholder:text-neutral-400 focus:border-orange-400 focus:outline-none dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-50 dark:placeholder:text-neutral-500"
                />
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="min-h-12 rounded-2xl bg-orange-500 px-5 text-sm font-bold text-white disabled:opacity-60 hover:bg-orange-600"
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
                      className="underline decoration-neutral-300 underline-offset-2 hover:text-neutral-800 dark:hover:text-neutral-200"
                    >
                      {copy.privacyLink}
                    </Link>
                  </>
                )}
              </p>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
