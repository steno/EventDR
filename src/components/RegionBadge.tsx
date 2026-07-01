import { MapPin } from "lucide-react";
import type { Dictionary } from "@/i18n/dictionaries";

interface RegionBadgeProps {
  dict: Dictionary;
}

export function RegionBadge({ dict }: RegionBadgeProps) {
  return (
    <div className="inline-flex min-w-0 max-w-[calc(100%-7rem)] items-center gap-1.5 rounded-full bg-neutral-900 px-3 py-1">
      <MapPin className="h-3 w-3 text-white flex-shrink-0" />
      <span className="truncate text-[11px] font-bold uppercase tracking-wider text-white">
        {dict.region.name}, {dict.region.country}
      </span>
    </div>
  );
}
