"use client";

import { useEffect, useState } from "react";
import { Share, X } from "lucide-react";
import type { Dictionary } from "@/i18n/dictionaries";
import { detectInAppBrowser, usePwaInstall } from "@/hooks/usePwaInstall";

interface IosInstallHintProps {
  dict: Dictionary;
}

function InstallGuideSheet({
  dict,
  inAppBrowser,
  onClose,
}: {
  dict: Dictionary;
  inAppBrowser: boolean;
  onClose: () => void;
}) {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const steps = [
    dict.install.iosGuideStep1,
    dict.install.iosGuideStep2,
    dict.install.iosGuideStep3,
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 p-4"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-xl"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-labelledby="install-guide-title"
      >
        <div className="flex items-start justify-between gap-3 mb-4">
          <h2 id="install-guide-title" className="text-lg font-black text-neutral-900">
            {dict.install.iosGuideTitle}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1 text-neutral-400 hover:text-neutral-700"
            aria-label={dict.detail.close}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {inAppBrowser && (
          <p className="mb-4 rounded-xl bg-amber-50 border border-amber-200 px-3 py-2.5 text-xs font-medium text-amber-950 leading-snug">
            {dict.install.iosOpenSafari}
          </p>
        )}

        <ol className="space-y-3">
          {steps.map((step, i) => (
            <li key={step} className="flex gap-3 text-sm text-neutral-700 leading-snug">
              <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-orange-100 text-xs font-bold text-orange-700">
                {i + 1}
              </span>
              <span>{step}</span>
            </li>
          ))}
        </ol>

        <button
          type="button"
          onClick={onClose}
          className="mt-5 w-full rounded-xl bg-neutral-900 py-3 text-sm font-bold text-white"
        >
          {dict.detail.close}
        </button>
      </div>
    </div>
  );
}

export function IosInstallHint({ dict }: IosInstallHintProps) {
  const { canShowInstall, isIOS } = usePwaInstall();
  const [guideOpen, setGuideOpen] = useState(false);
  const [inAppBrowser, setInAppBrowser] = useState(false);

  if (!canShowInstall || !isIOS) return null;

  async function handleTap() {
    const inApp = detectInAppBrowser();
    setInAppBrowser(inApp);

    if (inApp) {
      setGuideOpen(true);
      return;
    }

    if (typeof navigator.share === "function") {
      try {
        await navigator.share({
          title: dict.install.title,
          text: dict.install.subtitle,
          url: window.location.href,
        });
        return;
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") return;
      }
    }

    setGuideOpen(true);
  }

  return (
    <>
      <button
        type="button"
        onClick={handleTap}
        className="
          mb-4 mt-3 flex w-full items-center gap-2.5 rounded-xl
          border border-orange-200 bg-orange-50 px-3.5 py-2.5 text-left
          active:bg-orange-100 transition-colors
        "
      >
        <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-white text-orange-500 shadow-sm">
          <Share className="h-4 w-4" />
        </div>
        <p className="text-xs font-medium text-orange-950 leading-snug">
          {dict.install.iosHint}
        </p>
      </button>

      {guideOpen && (
        <InstallGuideSheet
          dict={dict}
          inAppBrowser={inAppBrowser}
          onClose={() => setGuideOpen(false)}
        />
      )}
    </>
  );
}
