"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Locale } from "@/i18n/config";
import type { SupportCopy } from "@/lib/support-copy";
import { markSupportDonated } from "@/lib/support-nudge";

interface DonateThanksProps {
  locale: Locale;
  copy: SupportCopy;
  sessionId?: string | null;
}

export function DonateThanks({ locale, copy, sessionId }: DonateThanksProps) {
  const [confirmed, setConfirmed] = useState(!sessionId);

  useEffect(() => {
    if (!sessionId) {
      markSupportDonated();
      return;
    }
    let cancelled = false;
    fetch(`/api/donate/session?session_id=${encodeURIComponent(sessionId)}`)
      .then((response) => response.json())
      .then((data: { confirmed?: boolean }) => {
        if (cancelled) return;
        const ok = Boolean(data.confirmed);
        setConfirmed(ok);
        if (ok) markSupportDonated();
      })
      .catch(() => {
        if (!cancelled) {
          setConfirmed(true);
          markSupportDonated();
        }
      });
    return () => {
      cancelled = true;
    };
  }, [sessionId]);

  return (
    <section className="mt-6 rounded-[1.75rem] bg-gradient-to-br from-orange-500 via-rose-500 to-fuchsia-500 p-6 text-white shadow-lg shadow-rose-500/20">
      <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-white/80">
        POP Events
      </p>
      <h2 className="mt-2 font-display text-2xl font-extrabold tracking-tight sm:text-3xl">
        {copy.thanks.title}
      </h2>
      <p className="mt-3 max-w-xl text-sm font-medium leading-relaxed text-white/90 sm:text-base">
        {copy.thanks.body}
      </p>
      {sessionId && !confirmed ? (
        <p className="mt-3 text-sm font-medium text-white/70" aria-live="polite">
          …
        </p>
      ) : null}
      <Link
        href={`/${locale}`}
        className="mt-5 inline-flex min-h-11 items-center rounded-full bg-white px-5 text-sm font-black text-neutral-950 transition-transform active:scale-[0.98]"
      >
        {copy.thanks.again}
      </Link>
    </section>
  );
}
