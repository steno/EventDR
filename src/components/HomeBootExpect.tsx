"use client";

import { useEffect } from "react";
import { expectBootPart } from "@/lib/boot-splash";

/**
 * Registers home boot parts outside Home's Suspense boundary so the splash
 * waits for events + weather even while useSearchParams suspends.
 */
export function HomeBootExpect() {
  useEffect(() => {
    expectBootPart("events");
    expectBootPart("weather");
    expectBootPart("sw");
  }, []);

  return null;
}
