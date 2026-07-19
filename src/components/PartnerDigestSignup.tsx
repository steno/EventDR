"use client";

import { useState } from "react";
import { Mail } from "lucide-react";
import type { Locale } from "@/i18n/config";
import type { PartnersCopy } from "@/lib/partners-copy";

interface PartnerDigestSignupProps {
  locale: Locale;
  copy: PartnersCopy["digest"];
}

export function PartnerDigestSignup({
  locale,
  copy,
}: PartnerDigestSignupProps) {
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle",
  );

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setStatus("loading");
    try {
      const response = await fetch("/api/partner-digest/subscribe", {
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
    <section className="mb-8 rounded-3xl bg-neutral-950 p-5 text-white dark:bg-neutral-100 dark:text-neutral-950 print:hidden">
      <Mail className="h-6 w-6 text-orange-400" aria-hidden />
      <h2 className="mt-3 text-xl font-black tracking-tight">{copy.title}</h2>
      <p className="mt-1.5 max-w-xl text-sm font-medium leading-relaxed text-neutral-300 dark:text-neutral-600">
        {copy.body}
      </p>
      {status === "success" ? (
        <p className="mt-4 rounded-2xl bg-emerald-500/15 px-4 py-3 text-sm font-bold text-emerald-300 dark:text-emerald-700">
          {copy.success}
        </p>
      ) : (
        <form onSubmit={submit} className="mt-4 max-w-xl">
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
            <label className="sr-only" htmlFor="partner-digest-email">
              Email
            </label>
            <input
              id="partner-digest-email"
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder={copy.placeholder}
              className="min-h-12 min-w-0 flex-1 rounded-2xl border border-white/15 bg-white/10 px-4 text-base font-medium text-white placeholder:text-neutral-400 focus:border-orange-400 focus:outline-none dark:border-neutral-300 dark:bg-white dark:text-neutral-950 dark:placeholder:text-neutral-500"
            />
            <button
              type="submit"
              disabled={status === "loading"}
              className="min-h-12 rounded-2xl bg-gradient-to-r from-orange-500 to-rose-500 px-5 text-sm font-black text-white disabled:opacity-60"
            >
              {status === "loading" ? "…" : copy.button}
            </button>
          </div>
          <p className="mt-2 text-xs font-medium text-neutral-400 dark:text-neutral-500">
            {status === "error" ? copy.error : copy.privacy}
          </p>
        </form>
      )}
    </section>
  );
}
