"use client";

import { useEffect, useState } from "react";
import { Download, Share, X } from "lucide-react";
import type { Dictionary } from "@/i18n/dictionaries";
import { usePwaInstall } from "@/hooks/usePwaInstall";

interface InstallBannerProps {
  dict: Dictionary;
}

export function InstallBanner({ dict }: InstallBannerProps) {
  const { canShowInstall, canNativePrompt, isIOS, isStandalone, promptInstall } =
    usePwaInstall();
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("eventdr-install-dismissed")) {
      setDismissed(true);
    }
  }, []);

  if (dismissed || !canShowInstall || isStandalone) return null;

  function dismiss() {
    localStorage.setItem("eventdr-install-dismissed", "1");
    setDismissed(true);
  }

  if (isIOS) {
    return (
      <div className="mb-4 flex items-start gap-3 rounded-2xl bg-neutral-900 p-4 text-white shadow-lg sm:hidden">
        <div className="flex-1 min-w-0">
          <p className="font-bold text-[15px]">{dict.install.iosTitle}</p>
          <p className="mt-0.5 text-[13px] leading-relaxed text-neutral-300">
            {dict.install.iosSubtitle}
          </p>
          <div className="mt-3 flex items-center gap-2 text-[13px] font-semibold text-neutral-200">
            <Share className="h-4 w-4" />
            Share → Add to Home Screen
          </div>
        </div>
        <button type="button" onClick={dismiss} aria-label={dict.install.dismiss}>
          <X className="h-4 w-4 text-neutral-500" />
        </button>
      </div>
    );
  }

  if (!canNativePrompt) return null;

  return (
    <div className="mb-4 flex items-start gap-3 rounded-2xl bg-neutral-900 p-4 text-white shadow-lg sm:hidden">
      <div className="flex-1 min-w-0">
        <p className="font-bold text-sm">{dict.install.title}</p>
        <p className="mt-0.5 text-xs leading-relaxed text-neutral-300">
          {dict.install.subtitle}
        </p>
        <div className="mt-3 flex gap-2">
          <button
            type="button"
            onClick={() => promptInstall()}
            className="inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-xs font-bold text-neutral-900"
          >
            <Download className="h-3.5 w-3.5" />
            {dict.install.button}
          </button>
          <button
            type="button"
            onClick={dismiss}
            className="px-2 text-xs font-medium text-neutral-400"
          >
            {dict.install.dismiss}
          </button>
        </div>
      </div>
      <button type="button" onClick={dismiss} aria-label={dict.install.dismiss}>
        <X className="h-4 w-4 text-neutral-500" />
      </button>
    </div>
  );
}
