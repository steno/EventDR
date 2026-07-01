"use client";

import { useState } from "react";
import { Download } from "lucide-react";
import type { Dictionary } from "@/i18n/dictionaries";
import { usePwaInstall } from "@/hooks/usePwaInstall";

interface InstallHeaderButtonProps {
  dict: Dictionary;
}

export function InstallHeaderButton({ dict }: InstallHeaderButtonProps) {
  const { canShowInstall, canNativePrompt, isIOS, promptInstall } = usePwaInstall();
  const [hintOpen, setHintOpen] = useState(false);

  if (!canShowInstall || isIOS) return null;

  async function handleClick() {
    if (canNativePrompt) {
      await promptInstall();
      setHintOpen(false);
      return;
    }
    setHintOpen((v) => !v);
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={handleClick}
        className="
          inline-flex items-center gap-1.5 rounded-full
          bg-neutral-900 text-white px-3 py-1.5
          text-[11px] font-bold tracking-wide
          hover:bg-neutral-800 transition-colors
        "
        aria-expanded={hintOpen}
      >
        <Download className="h-3.5 w-3.5" />
        {dict.install.header}
      </button>
      {hintOpen && !canNativePrompt && (
        <p className="absolute left-0 top-full mt-2 z-20 w-56 rounded-xl bg-white border border-neutral-200 shadow-lg p-3 text-xs text-neutral-600 leading-relaxed">
          {dict.install.desktopHint}
        </p>
      )}
    </div>
  );
}
