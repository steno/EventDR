"use client";

import { useEffect, useState, type ComponentType } from "react";
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

  if (!MapEl) return null;
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
