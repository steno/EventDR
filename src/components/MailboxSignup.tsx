"use client";

import { useState, type FormEvent } from "react";
import type { Dictionary } from "@/i18n/dictionaries";
import type { Locale } from "@/i18n/config";

type Status = "idle" | "pending" | "success" | "error";

interface MailboxSignupProps {
  dict: Dictionary;
  locale: Locale;
}

export function MailboxSignup({ dict, locale }: MailboxSignupProps) {
  const copy = dict.footer.mailbox;
  const [status, setStatus] = useState<Status>("idle");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "pending") return;

    const form = event.currentTarget;
    const formData = new FormData(form);
    setStatus("pending");

    try {
      const res = await fetch("/api/mailbox/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: String(formData.get("email") ?? ""),
          locale: String(formData.get("locale") ?? locale),
          "bot-field": String(formData.get("bot-field") ?? ""),
        }),
      });
      if (!res.ok) throw new Error(`Subscribe failed (${res.status})`);
      setStatus("success");
      form.reset();
    } catch {
      setStatus("error");
    }
  }

  return (
    <div className="mx-auto mb-5 max-w-md px-4 text-left sm:text-center">
      <p className="text-sm font-bold text-neutral-800 dark:text-neutral-100">
        {copy.title}
      </p>
      <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
        {copy.subtitle}
      </p>

      {status === "success" ? (
        <p
          className="mt-3 rounded-xl bg-emerald-50 px-3 py-2.5 text-sm font-medium text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-200"
          role="status"
        >
          {copy.success}
        </p>
      ) : (
        <form
          name="events-mailbox"
          onSubmit={handleSubmit}
          className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-stretch"
        >
          <input type="hidden" name="locale" value={locale} />
          <p className="hidden" aria-hidden="true">
            <label>
              Don’t fill this out: <input name="bot-field" tabIndex={-1} autoComplete="off" />
            </label>
          </p>
          <label className="sr-only" htmlFor="mailbox-email">
            {copy.emailLabel}
          </label>
          <input
            id="mailbox-email"
            type="email"
            name="email"
            required
            autoComplete="email"
            placeholder={copy.placeholder}
            disabled={status === "pending"}
            className="min-w-0 flex-1 rounded-full border border-neutral-200 bg-white px-4 py-2.5 text-sm text-neutral-900 outline-none placeholder:text-neutral-400 focus:border-orange-400 focus:ring-2 focus:ring-orange-200/60 disabled:opacity-60 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100 dark:placeholder:text-neutral-500 dark:focus:border-orange-500 dark:focus:ring-orange-900/40"
          />
          <button
            type="submit"
            disabled={status === "pending"}
            className="shrink-0 rounded-full bg-neutral-900 px-4 py-2.5 text-sm font-bold text-white transition-transform active:scale-[0.98] disabled:opacity-60 dark:bg-neutral-100 dark:text-neutral-900"
          >
            {status === "pending" ? copy.sending : copy.button}
          </button>
        </form>
      )}

      {status === "error" && (
        <p className="mt-2 text-xs font-medium text-rose-600 dark:text-rose-400" role="alert">
          {copy.error}
        </p>
      )}
    </div>
  );
}
