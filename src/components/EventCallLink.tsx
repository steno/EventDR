import { Phone } from "lucide-react";
import { formatPhoneDisplay, formatPhoneTel } from "@/lib/event-phone";

type EventCallLinkVariant = "compact" | "row";

interface EventCallLinkProps {
  phone: string;
  label: string;
  variant?: EventCallLinkVariant;
  /** Stop card/parent navigation when nested in a link. */
  stopPropagation?: boolean;
  className?: string;
}

export function EventCallLink({
  phone,
  label,
  variant = "compact",
  stopPropagation = false,
  className = "",
}: EventCallLinkProps) {
  const display = formatPhoneDisplay(phone);
  const tel = formatPhoneTel(phone);

  if (variant === "row") {
    return (
      <a
        href={`tel:${tel}`}
        onClick={stopPropagation ? (e) => e.stopPropagation() : undefined}
        className={`
          font-semibold tabular-nums
          text-emerald-700 dark:text-emerald-400
          hover:text-neutral-700 dark:hover:text-neutral-300
          active:text-neutral-800 dark:active:text-neutral-200
          touch-manipulation transition-colors
          ${className}
        `}
      >
        {label}: {display}
      </a>
    );
  }

  return (
    <a
      href={`tel:${tel}`}
      onClick={stopPropagation ? (e) => e.stopPropagation() : undefined}
      className={`
        inline-flex items-center gap-2 rounded-full
        bg-emerald-50 dark:bg-emerald-950/40
        px-3.5 py-2 text-copy-meta font-semibold tabular-nums
        text-emerald-700 dark:text-emerald-400
        ring-1 ring-emerald-200/70 dark:ring-emerald-800/70
        hover:bg-emerald-100 dark:hover:bg-emerald-950/60
        touch-manipulation transition-colors active:scale-[0.98]
        ${className}
      `}
    >
      <Phone className="h-3.5 w-3.5 flex-shrink-0" aria-hidden />
      <span>
        {label}: {display}
      </span>
    </a>
  );
}
