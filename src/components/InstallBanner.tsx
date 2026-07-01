"use client";

import { useEffect, useState } from "react";
import { Download, X } from "lucide-react";
import type { Dictionary } from "@/i18n/dictionaries";
import { usePwaInstall } from "@/hooks/usePwaInstall";

interface InstallBannerProps {
  dict: Dictionary;
}

export function InstallBanner({ dict }: InstallBannerProps) {
  const { canShowInstall, canNativePrompt, isIOS, promptInstall } = usePwaInstall();
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("eventdr-install-dismissed")) {
      setDismissed(true);
    }
  }, []);

  // Mobile Chrome/Android only (iOS uses IosInstallHint)
  if (dismissed || !canShowInstall || !canNativePrompt || isIOS) return null;

  async function install() {
    await promptInstall();
  }

  function dismiss() {
    localStorage.setItem("eventdr-install-dismissed", "1");
    setDismissed(true);
  }

  return (
    <div className="mb-4 rounded-2xl bg-neutral-900 text-white p-4 flex gap-3 items-start shadow-lg sm:hidden">
      <div className="flex-1 min-w-0">
        <p className="font-bold text-sm">{dict.install.title}</p>
        <p className="text-xs text-neutral-300 mt-0.5 leading-relaxed">
          {dict.install.subtitle}
        </p>
        <div className="flex gap-2 mt-3">
          <button
            type="button"
            onClick={install}
            className="inline-flex items-center gap-1.5 rounded-full bg-white text-neutral-900 px-4 py-2 text-xs font-bold"
          >
            <Download className="h-3.5 w-3.5" />
            {dict.install.button}
          </button>
          <button
            type="button"
            onClick={dismiss}
            className="text-xs text-neutral-400 font-medium px-2"
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
