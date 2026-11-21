import type { Locale } from "@/i18n/config";
import {
  browseDayTearOffParts,
  formatBrowseDayHeader,
} from "@/lib/format-date";
import { BRAND_GRADIENT_TEXT_CLASS } from "@/lib/page-shell";

/**
 * Full-width date title bar — tear-off first, weekday chip on the right.
 * Shared by desktop All day trays and Finde / mobile All sticky day headers.
 */
const TITLE_BAR_TRAY_CLASS =
  "-mx-2 -mt-2 mb-1.5 flex items-center gap-1 rounded-t-2xl border-b border-stone-400/15 bg-[#e8e2d6]/80 px-1.5 py-1 dark:border-white/[0.06] dark:bg-neutral-950/50";

/** List / sticky Finde + mobile All — full content width, no tray margins. */
const TITLE_BAR_LIST_CLASS =
  "flex w-full max-w-full items-center gap-1 rounded-xl border border-stone-400/15 bg-[#e8e2d6]/80 px-1.5 py-1 dark:border-white/[0.06] dark:bg-neutral-950/50";

const WEEKDAY_CHIP_TRAY_CLASS =
  "flex h-9 min-w-0 flex-1 items-center justify-center rounded-lg bg-white/55 px-2 ring-1 ring-stone-400/20 dark:bg-white/10 dark:ring-white/10";
const WEEKDAY_CHIP_LIST_CLASS =
  "flex h-9 min-w-0 flex-1 items-center justify-start rounded-lg bg-white/55 px-2.5 ring-1 ring-stone-400/20 dark:bg-white/10 dark:ring-white/10";
const WEEKDAY_LABEL_CLASS = `truncate text-[0.8125rem] font-semibold uppercase leading-none tracking-[0.05em] ${BRAND_GRADIENT_TEXT_CLASS}`;

const TEAROFF_CLASS =
  "flex h-9 w-9 shrink-0 flex-col overflow-hidden rounded-lg border border-stone-400/35 bg-white/70 font-sans dark:border-white/15 dark:bg-white/10";
const TEAROFF_MONTH_CLASS =
  "bg-stone-500/80 px-0.5 py-px text-center text-[0.5625rem] font-semibold leading-none tracking-wide text-white dark:bg-white/20";
const TEAROFF_DAY_CLASS =
  "flex flex-1 items-center justify-center text-[1.05rem] font-semibold leading-none tabular-nums text-neutral-800 dark:text-neutral-100";

export type BrowseDayTitleBarProps = {
  date: string;
  locale: Locale;
  /**
   * `tray` — sits inside AllBrowseCalendar day trays (negative margins).
   * `list` — Finde / mobile All sticky headers (left-aligned, full width).
   */
  variant?: "tray" | "list";
  className?: string;
};

/**
 * All-calendar day chrome: gradient weekday chip + mini tear-off calendar.
 */
export function BrowseDayTitleBar({
  date,
  locale,
  variant = "tray",
  className,
}: BrowseDayTitleBarProps) {
  const tearOff = browseDayTearOffParts(date, locale);
  const dayLabel = formatBrowseDayHeader(date, locale);
  const barClass = variant === "list" ? TITLE_BAR_LIST_CLASS : TITLE_BAR_TRAY_CLASS;
  const chipClass =
    variant === "list" ? WEEKDAY_CHIP_LIST_CLASS : WEEKDAY_CHIP_TRAY_CLASS;

  return (
    <div className={className ? `${barClass} ${className}` : barClass}>
      <div className={TEAROFF_CLASS} aria-hidden>
        {tearOff ? (
          <>
            <span className={TEAROFF_MONTH_CLASS}>{tearOff.month}</span>
            <span className={TEAROFF_DAY_CLASS}>{tearOff.day}</span>
          </>
        ) : null}
      </div>
      <h2 className={chipClass} aria-label={dayLabel}>
        <span className={WEEKDAY_LABEL_CLASS} aria-hidden>
          {tearOff?.weekday ?? dayLabel}
        </span>
      </h2>
    </div>
  );
}
