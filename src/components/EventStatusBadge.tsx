import type { EventLiveStatus } from "@/lib/event-status";
import {
  eventStatusBadgeClass,
  type EventStatusBadgeSurface,
} from "@/lib/event-status-label";

interface EventStatusBadgeProps {
  label: string;
  status: EventLiveStatus;
  /** Opaque fills for badges on photo overlays (Happening today cards). */
  surface?: EventStatusBadgeSurface;
  className?: string;
}

export function EventStatusBadge({
  label,
  status,
  surface = "default",
  className = "",
}: EventStatusBadgeProps) {
  const colors = eventStatusBadgeClass(status, surface);
  if (!colors) return null;

  const size =
    surface === "onMedia"
      ? "px-2 py-1 text-[11px] sm:px-2.5 sm:py-1.5 sm:text-xs"
      : "px-2.5 py-1.5 text-xs";

  return (
    <span
      className={`
        inline-flex shrink-0 items-center rounded-full
        font-bold leading-none tracking-wide
        ${size} ${colors} ${className}
      `}
    >
      {label}
    </span>
  );
}
