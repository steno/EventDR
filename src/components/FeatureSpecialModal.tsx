"use client";

import { useEffect } from "react";
import { Sparkles, X } from "lucide-react";
import type { Dictionary } from "@/i18n/dictionaries";
import { featurePlacementWhatsApp } from "@/lib/brand-social";

interface FeatureSpecialModalProps {
  open: boolean;
  onClose: () => void;
  dict: Dictionary;
}

export function FeatureSpecialModal({
  open,
  onClose,
  dict,
}: FeatureSpecialModalProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, onClose]);

  if (!open) return null;

  const whatsappHref = featurePlacementWhatsApp(
    dict.events.featureSpecialWhatsAppMessage,
  );

  return (
    <div className="fixed inset-0 z-[80] flex items-end justify-center print:hidden sm:items-center sm:p-4">
      <button
        type="button"
        className="absolute inset-0 bg-black/45 backdrop-blur-sm"
        onClick={onClose}
        aria-label={dict.detail.close}
      />
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="feature-special-heading"
        className="relative w-full max-w-lg overflow-hidden rounded-t-3xl bg-white px-5 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-5 shadow-2xl dark:bg-neutral-900 sm:rounded-3xl sm:p-6"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.16em] text-orange-600 dark:text-orange-400">
              <Sparkles className="h-3.5 w-3.5" aria-hidden />
              {dict.events.featureSpecialEyebrow}
            </p>
            <h2
              id="feature-special-heading"
              className="mt-1.5 text-title font-extrabold tracking-tight text-neutral-950 dark:text-neutral-50"
            >
              {dict.events.featureSpecialModalTitle}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300"
            aria-label={dict.detail.close}
          >
            <X className="h-4 w-4" aria-hidden />
          </button>
        </div>

        <p className="mt-3 text-copy font-medium leading-relaxed text-neutral-600 dark:text-neutral-400">
          {dict.events.featureSpecialModalBody}
        </p>

        {whatsappHref ? (
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 flex min-h-12 w-full items-center justify-center rounded-2xl bg-orange-500 px-4 text-center text-sm font-bold text-white transition-colors hover:bg-orange-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500"
          >
            {dict.events.featureSpecialModalCta}
          </a>
        ) : null}
      </section>
    </div>
  );
}
