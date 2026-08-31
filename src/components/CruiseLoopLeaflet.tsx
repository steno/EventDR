"use client";

import { useEffect, useState, type ComponentType } from "react";
import type { LoopMapStop } from "@/lib/cruise";
import type { LatLngTuple } from "@/lib/routing";

export function CruiseLoopLeaflet({
  stops,
  route,
}: {
  stops: LoopMapStop[];
  route: LatLngTuple[] | null;
}) {
  const [MapEl, setMapEl] = useState<ComponentType<{
    stops: LoopMapStop[];
    route?: LatLngTuple[] | null;
    interactive?: boolean;
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
  return <MapEl stops={stops} route={route} interactive />;
}
