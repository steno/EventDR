"use client";

import { Share } from "lucide-react";
import type { Dictionary } from "@/i18n/dictionaries";
import { usePwaInstall } from "@/hooks/usePwaInstall";

interface IosInstallHintProps {
  dict: Dictionary;
}

export function IosInstallHint({ dict }: IosInstallHintProps) {
  const { canShowInstall, isIOS } = usePwaInstall();

  if (!canShowInstall || !isIOS) return null;

  return (
    <div className="mb-4 mt-3 flex items-center gap-2.5 rounded-xl
        border border-orange-200 bg-orange-50 px-3.5 py-2.5
      "
      role="note"
    >
      <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-white text-orange-500 shadow-sm">
        <Share className="h-4 w-4" />
      </div>
      <p className="text-xs font-medium text-orange-950 leading-snug">
        {dict.install.iosHint}
      </p>
    </div>
  );
}
