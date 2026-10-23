"use client";

import { useState } from "react";
import {
  ArrowDown,
  Download,
  MoreVertical,
  Share,
  ShieldCheck,
  SquarePlus,
  X,
} from "lucide-react";
import type { Dictionary } from "@/i18n/dictionaries";
import { usePwaInstall } from "@/hooks/usePwaInstall";

interface PwaInstallModalProps {
  dict: Dictionary;
  open: boolean;
  onClose: () => void;
}

interface Step {
  n: number;
  icon?: React.ReactNode;
  text: string;
}

/**
 * Branded install sheet: native `beforeinstallprompt` CTA when available,
 * otherwise iOS/Android home-screen steps (Quinta-style intermediate card).
 */
export function PwaInstallModal({ dict, open, onClose }: PwaInstallModalProps) {
  const { canNativePrompt, isIOS, promptInstall } = usePwaInstall();
  const [installing, setInstalling] = useState(false);

  if (!open) return null;

  async function handleNativeInstall() {
    setInstalling(true);
    try {
      await promptInstall();
    } finally {
      setInstalling(false);
      onClose();
    }
  }

  const guideTitle = isIOS ? dict.install.iosTitle : dict.install.androidTitle;
  const steps: Step[] = isIOS
    ? [
        {
          n: 1,
          icon: <Share className="h-5 w-5 text-sky-400" />,
          text: dict.install.iosStep1,
        },
        {
          n: 2,
          icon: <SquarePlus className="h-5 w-5 text-neutral-200" />,
          text: dict.install.iosStep2,
        },
        { n: 3, text: dict.install.iosStep3 },
      ]
    : [
        {
          n: 1,
          icon: <MoreVertical className="h-5 w-5 text-neutral-200" />,
          text: dict.install.androidStep1,
        },
        {
          n: 2,
          icon: <SquarePlus className="h-5 w-5 text-neutral-200" />,
          text: dict.install.androidStep2,
        },
      ];

  return (
    <div
      className="fixed inset-0 z-[60] flex items-end justify-center bg-black/60 backdrop-blur-sm sm:items-center"
      onClick={onClose}
      role="presentation"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={dict.install.modalTitle}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-sm rounded-t-3xl border border-white/10 bg-neutral-900 p-5 pb-8 text-left text-white shadow-2xl sm:rounded-3xl sm:pb-6"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label={dict.install.dismiss}
          className="absolute right-4 top-4 rounded-full p-1 text-neutral-400 hover:bg-white/10 hover:text-white"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-start gap-3 pr-8">
          {/* eslint-disable-next-line @next/next/no-img-element -- small static PWA icon */}
          <img
            src="/icons/icon-192.png"
            alt=""
            width={56}
            height={56}
            className="h-14 w-14 shrink-0 rounded-2xl bg-white object-cover shadow-md"
          />
          <div className="min-w-0 pt-0.5">
            <p className="text-lg font-bold leading-tight">
              {dict.install.modalTitle}
            </p>
            <p className="mt-0.5 text-xs text-neutral-400">
              {dict.install.brandLine}
            </p>
          </div>
        </div>

        {canNativePrompt ? (
          <>
            <p className="mt-4 text-sm leading-relaxed text-neutral-300">
              {dict.install.promptBody}
            </p>
            <button
              type="button"
              onClick={handleNativeInstall}
              disabled={installing}
              className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-white px-4 py-3.5 text-sm font-extrabold uppercase tracking-wide text-neutral-900 active:scale-[0.98] transition-transform disabled:opacity-70"
            >
              <Download className="h-4 w-4" />
              {dict.install.downloadButton}
            </button>
          </>
        ) : (
          <>
            {isIOS && (
              <p className="mt-4 text-xs text-neutral-400">
                {dict.install.iosSubtitle}
              </p>
            )}
            <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-neutral-500">
              {dict.install.manualTitle}
            </p>
            <ol className="mt-2 space-y-3">
              {steps.map((step) => (
                <li key={step.n} className="flex items-center gap-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/10 text-xs font-bold">
                    {step.n}
                  </span>
                  {step.icon && (
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/5">
                      {step.icon}
                    </span>
                  )}
                  <span className="text-sm leading-snug text-neutral-100">
                    {step.text}
                  </span>
                </li>
              ))}
            </ol>
            <p className="sr-only">{guideTitle}</p>
            <button
              type="button"
              onClick={onClose}
              className="mt-6 w-full rounded-full bg-white py-3 text-sm font-bold text-neutral-900 active:scale-[0.98] transition-transform"
            >
              {dict.install.done}
            </button>
            {isIOS && (
              <div className="pointer-events-none absolute -bottom-14 left-1/2 -translate-x-1/2 animate-bounce sm:hidden">
                <ArrowDown className="h-8 w-8 text-white drop-shadow-lg" />
              </div>
            )}
          </>
        )}

        <div className="mt-5 flex items-center justify-between gap-3 border-t border-white/10 pt-4">
          <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-emerald-400">
            <ShieldCheck className="h-3.5 w-3.5" />
            {dict.install.secureBadge}
          </span>
          {canNativePrompt && (
            <button
              type="button"
              onClick={onClose}
              className="text-xs font-medium text-neutral-400 hover:text-white"
            >
              {dict.install.done}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
