import type { EventLiveStatus } from "@/lib/event-status";
import { eventStatusBadgeClass } from "@/lib/event-status-label";

interface EventStatusBadgeProps {
  label: string;
  status: EventLiveStatus;
  className?: string;
}

export function EventStatusBadge({ label, status, className = "" }: EventStatusBadgeProps) {
  const colors = eventStatusBadgeClass(status);
  if (!colors) return null;

  return (
    <span
      className={`
        inline-flex shrink-0 items-center rounded-full px-2.5 py-1
        text-[13px] font-bold tracking-wide
        ${colors} ${className}
      `}
    >
      {label}
    </span>
  );
}
