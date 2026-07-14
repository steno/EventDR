import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { AppHeader } from "@/components/AppHeader";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";

const backControlClassName =
  "inline-flex items-center gap-2 text-sm font-semibold text-neutral-500 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200 touch-manipulation";

type StickyListHeaderProps = {
  locale: Locale;
  dict: Dictionary;
  backLabel: string;
  /** Drop bottom margin when the next block should sit flush (e.g. city photo hero). */
  flushBottom?: boolean;
} & (
  | { backHref: string; onBack?: never }
  | { backHref?: never; onBack: () => void }
);

export function StickyListHeader({
  locale,
  dict,
  backHref,
  backLabel,
  onBack,
  flushBottom = false,
}: StickyListHeaderProps) {
  return (
    <div
      className={`sticky top-0 z-20 -mx-4 px-4 pb-2 bg-neutral-50/95 backdrop-blur-sm dark:bg-neutral-950/95 border-b border-neutral-200/60 dark:border-neutral-800/60 ${
        flushBottom ? "mb-0" : "mb-4"
      }`}
    >
      <AppHeader locale={locale} dict={dict} />
      {onBack ? (
        <button type="button" onClick={onBack} className={backControlClassName}>
          <ArrowLeft className="h-4 w-4" aria-hidden />
          {backLabel}
        </button>
      ) : (
        <Link href={backHref} className={backControlClassName}>
          <ArrowLeft className="h-4 w-4" aria-hidden />
          {backLabel}
        </Link>
      )}
    </div>
  );
}
