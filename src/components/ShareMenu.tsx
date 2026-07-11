"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { Link2, Mail, Share2 } from "lucide-react";
import {
  FacebookIcon,
  TelegramIcon,
  WhatsAppIcon,
  XIcon,
} from "@/components/ShareBrandIcons";
import type { Event } from "@/lib/types";
import type { Dictionary } from "@/i18n/dictionaries";
import type { Locale } from "@/i18n/config";
import {
  canUseNativeShare,
  getShareUrl,
  isExternalSharePlatform,
  openExternalShare,
  openFacebookApp,
  shareToFacebook,
  shareViaPlatform,
  type SharePlatform,
} from "@/lib/share";
import { clearListScroll } from "@/lib/list-scroll-restoration";

interface ShareMenuProps {
  event: Event;
  locale: Locale;
  dict: Dictionary;
  onClose: () => void;
  onFeedback: (message: string) => void;
  /** Clears saved home/list state so returning from share does not restore Search tab. */
  returnTo?: string | null;
}

const PLATFORMS: {
  id: SharePlatform;
  labelKey: keyof Dictionary["detail"];
  className: string;
  icon: ReactNode;
  iconOnly?: boolean;
}[] = [
  {
    id: "whatsapp",
    labelKey: "shareWhatsapp",
    className: "bg-[#25D366] text-white",
    icon: <WhatsAppIcon className="h-5 w-5" />,
    iconOnly: true,
  },
  {
    id: "facebook",
    labelKey: "shareFacebook",
    className: "bg-[#1877F2] text-white",
    icon: <FacebookIcon className="h-5 w-5" />,
    iconOnly: true,
  },
  {
    id: "x",
    labelKey: "shareX",
    className: "bg-neutral-900 text-white",
    icon: <XIcon className="h-4 w-4" />,
    iconOnly: true,
  },
  {
    id: "telegram",
    labelKey: "shareTelegram",
    className: "bg-[#26A5E4] text-white",
    icon: <TelegramIcon className="h-5 w-5" />,
    iconOnly: true,
  },
  {
    id: "email",
    labelKey: "shareEmail",
    className:
      "bg-white dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 ring-1 ring-neutral-200/70 dark:ring-neutral-700/70 shadow-sm hover:text-neutral-800 dark:hover:text-neutral-200",
    icon: <Mail className="h-4 w-4" />,
    iconOnly: false,
  },
  {
    id: "copy",
    labelKey: "shareCopyLink",
    className:
      "bg-white dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 ring-1 ring-neutral-200/70 dark:ring-neutral-700/70 shadow-sm hover:text-neutral-800 dark:hover:text-neutral-200",
    icon: <Link2 className="h-4 w-4" />,
    iconOnly: false,
  },
];

export function ShareMenu({
  event,
  locale,
  dict,
  onClose,
  onFeedback,
  returnTo,
}: ShareMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);
  const [nativeShareAvailable, setNativeShareAvailable] = useState(false);

  useEffect(() => {
    setNativeShareAvailable(canUseNativeShare());
  }, []);

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
    if (isExternalSharePlatform(platform)) {
      if (returnTo) clearListScroll(returnTo);
      if (platform === "facebook") {
        const result = await shareToFacebook(event, locale);
        onClose();
        if (result === "copied") {
          const msg = dict.detail.facebookCopied;
          onFeedback(msg);
          window.alert(msg);
          openFacebookApp();
        } else if (result === "failed") {
          const msg = dict.detail.facebookCopyFailed;
          onFeedback(msg);
          window.alert(msg);
          openFacebookApp();
        }
        return;
      }
      const href = getShareUrl(platform, event, locale);
      if (href) {
        openExternalShare(href);
        onClose();
      }
      return;
    }

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
      className="mb-3 rounded-3xl bg-white/85 dark:bg-neutral-800/85 p-3 shadow-sm ring-1 ring-neutral-200/70 dark:ring-neutral-700/70 backdrop-blur animate-in fade-in slide-in-from-bottom-2 duration-200"
    >
      <p className="mb-2 px-1 text-[11px] font-bold uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
        {dict.detail.shareVia}
      </p>
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        {nativeShareAvailable && (
          <button
            type="button"
            onClick={() => handlePlatform("native")}
            className="flex shrink-0 items-center gap-2 rounded-full bg-gradient-to-r from-orange-500 via-rose-500 to-fuchsia-500 px-3 py-2.5 text-[13px] font-bold text-white shadow-sm touch-manipulation transition-transform active:scale-[0.98]"
          >
            <Share2 className="h-4 w-4" />
            {dict.detail.shareMore}
          </button>
        )}
        {PLATFORMS.map((platform) => (
          <button
            key={platform.id}
            type="button"
            aria-label={dict.detail[platform.labelKey]}
            onClick={() => handlePlatform(platform.id)}
            className={`flex shrink-0 items-center touch-manipulation transition-all active:scale-[0.98] ${
              platform.iconOnly
                ? `justify-center rounded-full p-3 shadow-sm ${platform.className}`
                : `gap-2 rounded-full px-3 py-2.5 text-[13px] font-bold ${platform.className}`
            }`}
          >
            {platform.icon}
            {!platform.iconOnly && dict.detail[platform.labelKey]}
          </button>
        ))}
      </div>
    </div>
  );
}
