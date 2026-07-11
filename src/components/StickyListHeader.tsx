import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { AppHeader } from "@/components/AppHeader";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";

interface StickyListHeaderProps {
  locale: Locale;
  dict: Dictionary;
  backHref: string;
  backLabel: string;
}

export function StickyListHeader({
  locale,
  dict,
  backHref,
  backLabel,
}: StickyListHeaderProps) {
  return (
    <div className="sticky top-0 z-20 -mx-4 mb-4 px-4 pb-2 bg-neutral-50/95 backdrop-blur-sm dark:bg-neutral-950/95 border-b border-neutral-200/60 dark:border-neutral-800/60">
      <AppHeader locale={locale} dict={dict} />
      <Link
        href={backHref}
        className="inline-flex items-center gap-2 text-sm font-semibold text-neutral-500 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200 touch-manipulation"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden />
        {backLabel}
      </Link>
    </div>
  );
}
