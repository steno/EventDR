"use client";

import { useEffect, useState, type ComponentType } from "react";
import { MapPin } from "lucide-react";
import type { LoopMapStop } from "@/lib/cruise";
import type { LatLngTuple } from "@/lib/routing";
import type { CruisePinCopy } from "@/components/CruiseLoopMap";

export function CruiseLoopLeaflet({
  stops,
  route,
  pinCopy,
  returnTo,
  returnTitle,
}: {
  stops: LoopMapStop[];
  route: LatLngTuple[] | null;
  pinCopy: CruisePinCopy;
  returnTo?: string | null;
  returnTitle?: string | null;
}) {
  const [MapEl, setMapEl] = useState<ComponentType<{
    stops: LoopMapStop[];
    route?: LatLngTuple[] | null;
    interactive?: boolean;
    pinCopy: CruisePinCopy;
    returnTo?: string | null;
    returnTitle?: string | null;
  }> | null>(null);

  useEffect(() => {
    let cancelled = false;
    void import("@/components/CruiseLoopMap").then((mod) => {
      if (!cancelled) setMapEl(() => mod.CruiseLoopMap);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  if (!MapEl) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-neutral-200 dark:bg-neutral-800">
        <MapPin className="h-8 w-8 animate-pulse text-neutral-400" aria-hidden />
      </div>
    );
  }

  return (
    <MapEl
      stops={stops}
      route={route}
      interactive
      pinCopy={pinCopy}
      returnTo={returnTo}
      returnTitle={returnTitle}
    />
  );
}
