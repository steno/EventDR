"use client";

import { useState } from "react";
import { ArrowDown, MoreVertical, Share, SquarePlus, X } from "lucide-react";
import type { Dictionary } from "@/i18n/dictionaries";
import { usePwaInstall } from "@/hooks/usePwaInstall";

interface FooterInstallLinkProps {
  dict: Dictionary;
}

interface Step {
  n: number;
  icon?: React.ReactNode;
  text: string;
}

export function FooterInstallLink({ dict }: FooterInstallLinkProps) {
  const { canShowInstall, canNativePrompt, isIOS, isStandalone, promptInstall } =
    usePwaInstall();
  const [showGuide, setShowGuide] = useState(false);

  if (!canShowInstall || isStandalone) return null;

  async function handleClick() {
    if (canNativePrompt) {
      await promptInstall();
      return;
    }
    setShowGuide(true);
  }

  const title = isIOS ? dict.install.iosTitle : dict.install.androidTitle;
  const subtitle = isIOS ? dict.install.iosSubtitle : "";
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
    <>
      <button
        type="button"
        onClick={handleClick}
        className="hover:text-neutral-800 dark:hover:text-neutral-200 transition-colors"
      >
        {dict.install.menuLabel}
      </button>

      {showGuide && (
        <div
          className="fixed inset-0 z-[60] flex items-end justify-center bg-black/60 backdrop-blur-sm sm:items-center"
          onClick={() => setShowGuide(false)}
          role="presentation"
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label={title}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-sm rounded-t-3xl bg-neutral-900 p-5 pb-8 text-left text-white shadow-2xl sm:rounded-3xl sm:pb-6"
          >
            <button
              type="button"
              onClick={() => setShowGuide(false)}
              aria-label={dict.install.dismiss}
              className="absolute right-4 top-4 rounded-full p-1 text-neutral-400 hover:bg-white/10 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>

            <p className="pr-8 text-lg font-bold">{title}</p>
            {subtitle && (
              <p className="mt-1 text-[13px] text-neutral-400">{subtitle}</p>
            )}

            <ol className="mt-4 space-y-3">
              {steps.map((step) => (
                <li key={step.n} className="flex items-center gap-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/10 text-[13px] font-bold">
                    {step.n}
                  </span>
                  {step.icon && (
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/5">
                      {step.icon}
                    </span>
                  )}
                  <span className="text-[14px] leading-snug text-neutral-100">
                    {step.text}
                  </span>
                </li>
              ))}
            </ol>

            <button
              type="button"
              onClick={() => setShowGuide(false)}
              className="mt-6 w-full rounded-full bg-white py-3 text-[15px] font-bold text-neutral-900 active:scale-[0.98] transition-transform"
            >
              {dict.install.done}
            </button>

            {isIOS && (
              <div className="pointer-events-none absolute -bottom-14 left-1/2 -translate-x-1/2 animate-bounce sm:hidden">
                <ArrowDown className="h-8 w-8 text-white drop-shadow-lg" />
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
