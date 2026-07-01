"use client";

import { useEffect, useState } from "react";
import { Download, X } from "lucide-react";
import type { Dictionary } from "@/i18n/dictionaries";

interface InstallBannerProps {
  dict: Dictionary;
}

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export function InstallBanner({ dict }: InstallBannerProps) {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);
  const [dismissed, setDismissed] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("eventdr-install-dismissed")) {
      setDismissed(true);
    }
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsStandalone(true);
    }

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferred(e as BeforeInstallPromptEvent);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  if (dismissed || isStandalone || !deferred) return null;

  async function install() {
    if (!deferred) return;
    await deferred.prompt();
    setDeferred(null);
  }

  function dismiss() {
    localStorage.setItem("eventdr-install-dismissed", "1");
    setDismissed(true);
  }

  return (
    <div className="mx-4 mb-4 rounded-2xl bg-neutral-900 text-white p-4 flex gap-3 items-start shadow-lg">
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
