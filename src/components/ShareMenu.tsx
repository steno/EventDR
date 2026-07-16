"use client";

import { useSyncExternalStore, type ReactNode } from "react";
import { Link2, Mail, Share2 } from "lucide-react";
import { ActionSheet, ActionSheetTile } from "@/components/ActionSheet";
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

interface ShareMenuProps {
  event: Event;
  locale: Locale;
  dict: Dictionary;
  onClose: () => void;
  onFeedback: (message: string) => void;
}

const SOCIAL: {
  id: SharePlatform;
  labelKey: keyof Dictionary["detail"];
  well: string;
  icon: ReactNode;
}[] = [
  {
    id: "whatsapp",
    labelKey: "shareWhatsapp",
    well: "bg-[#25D366] text-white",
    icon: <WhatsAppIcon className="h-5 w-5" />,
  },
  {
    id: "facebook",
    labelKey: "shareFacebook",
    well: "bg-[#1877F2] text-white",
    icon: <FacebookIcon className="h-5 w-5" />,
  },
  {
    id: "x",
    labelKey: "shareX",
    well: "bg-neutral-950 text-white dark:bg-white dark:text-neutral-950",
    icon: <XIcon className="h-4 w-4" />,
  },
  {
    id: "telegram",
    labelKey: "shareTelegram",
    well: "bg-[#26A5E4] text-white",
    icon: <TelegramIcon className="h-5 w-5" />,
  },
];

const UTILITY: {
  id: SharePlatform;
  labelKey: keyof Dictionary["detail"];
  icon: ReactNode;
}[] = [
  {
    id: "email",
    labelKey: "shareEmail",
    icon: <Mail className="h-5 w-5" strokeWidth={2} />,
  },
  {
    id: "copy",
    labelKey: "shareCopyLink",
    icon: <Link2 className="h-5 w-5" strokeWidth={2} />,
  },
];

const utilityWell =
  "bg-white text-neutral-700 ring-1 ring-neutral-200/90 dark:bg-neutral-900 dark:text-neutral-200 dark:ring-neutral-700";

export function ShareMenu({
  event,
  locale,
  dict,
  onClose,
  onFeedback,
}: ShareMenuProps) {
  const nativeShareAvailable = useSyncExternalStore(
    () => () => {},
    () => canUseNativeShare(),
    () => false,
  );

  async function handlePlatform(platform: SharePlatform) {
    if (isExternalSharePlatform(platform)) {
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
    <ActionSheet title={dict.detail.shareVia}>
      <div className="grid grid-cols-4 gap-1 sm:grid-cols-4">
        {nativeShareAvailable && (
          <ActionSheetTile
            label={dict.detail.shareMore}
            onClick={() => handlePlatform("native")}
            wellClassName="bg-gradient-to-br from-orange-500 to-rose-600 text-white"
            icon={<Share2 className="h-5 w-5" strokeWidth={2.25} />}
          />
        )}
        {SOCIAL.map((platform) => (
          <ActionSheetTile
            key={platform.id}
            label={dict.detail[platform.labelKey]}
            onClick={() => handlePlatform(platform.id)}
            wellClassName={platform.well}
            icon={platform.icon}
          />
        ))}
        {UTILITY.map((platform) => (
          <ActionSheetTile
            key={platform.id}
            label={dict.detail[platform.labelKey]}
            onClick={() => handlePlatform(platform.id)}
            wellClassName={utilityWell}
            icon={platform.icon}
          />
        ))}
      </div>
    </ActionSheet>
  );
}
