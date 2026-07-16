"use client";

import { useEffect } from "react";
import { expectBootPart } from "@/lib/boot-splash";

/**
 * Registers the home events boot part outside Home's Suspense boundary so the
 * splash can wait for the first event list even while useSearchParams suspends.
 * Weather / SW / version must not block first paint.
 */
export function HomeBootExpect() {
  useEffect(() => {
    expectBootPart("events");
  }, []);

  return null;
}
