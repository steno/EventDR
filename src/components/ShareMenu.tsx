"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { Link2, Mail, Share2 } from "lucide-react";
import type { Event } from "@/lib/types";
import type { Dictionary } from "@/i18n/dictionaries";
import type { Locale } from "@/i18n/config";
import {
  canUseNativeShare,
  shareViaPlatform,
  type SharePlatform,
} from "@/lib/share";

interface ShareMenuProps {
  event: Event;
  locale: Locale;
  dict: Dictionary;
  onClose: () => void;
  onFeedback: (message: string) => void;
}

const PLATFORMS: {
  id: SharePlatform;
  labelKey: keyof Dictionary["detail"];
  className: string;
  icon?: ReactNode;
}[] = [
  {
    id: "whatsapp",
    labelKey: "shareWhatsapp",
    className: "bg-[#25D366] text-white",
  },
  {
    id: "facebook",
    labelKey: "shareFacebook",
    className: "bg-[#1877F2] text-white",
  },
  {
    id: "x",
    labelKey: "shareX",
    className: "bg-neutral-900 text-white",
  },
  {
    id: "telegram",
    labelKey: "shareTelegram",
    className: "bg-[#26A5E4] text-white",
  },
  {
    id: "email",
    labelKey: "shareEmail",
    className: "bg-neutral-100 text-neutral-900",
    icon: <Mail className="h-4 w-4" />,
  },
  {
    id: "copy",
    labelKey: "shareCopyLink",
    className: "bg-neutral-100 text-neutral-900",
    icon: <Link2 className="h-4 w-4" />,
  },
];

export function ShareMenu({
  event,
  locale,
  dict,
  onClose,
  onFeedback,
}: ShareMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handlePointerDown(e: PointerEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    }
    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [onClose]);

  async function handlePlatform(platform: SharePlatform) {
    const result = await shareViaPlatform(platform, event, locale);
    if (result === "shared") {
      onFeedback(dict.detail.shared);
      onClose();
    } else if (result === "copied") {
      onFeedback(dict.detail.linkCopied);
      onClose();
    } else if (result === "opened") {
      onClose();
    }
  }

  return (
    <div
      ref={menuRef}
      className="mb-3 rounded-2xl border border-neutral-100 bg-neutral-50 p-3 animate-in fade-in slide-in-from-bottom-2 duration-200"
    >
      <p className="mb-2 px-1 text-[11px] font-bold uppercase tracking-wide text-neutral-500">
        {dict.detail.shareVia}
      </p>
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        {canUseNativeShare() && (
          <button
            type="button"
            onClick={() => handlePlatform("native")}
            className="flex shrink-0 items-center gap-2 rounded-xl bg-white px-3 py-2.5 text-[13px] font-bold text-neutral-900 shadow-sm touch-manipulation active:scale-[0.98] transition-transform"
          >
            <Share2 className="h-4 w-4" />
            {dict.detail.shareMore}
          </button>
        )}
        {PLATFORMS.map((platform) => (
          <button
            key={platform.id}
            type="button"
            onClick={() => handlePlatform(platform.id)}
            className={`flex shrink-0 items-center gap-2 rounded-xl px-3 py-2.5 text-[13px] font-bold touch-manipulation active:scale-[0.98] transition-transform ${platform.className}`}
          >
            {platform.icon}
            {dict.detail[platform.labelKey]}
          </button>
        ))}
      </div>
    </div>
  );
}
