"use client";

import { useEffect } from "react";
import { expectBootPart } from "@/lib/boot-splash";

/**
 * Registers the home events boot part outside Home's Suspense boundary so the
 * splash can wait for the first event list even while useSearchParams suspends.
 * Weather / SW stay off the critical path; version only blocks when a prior
 * deploy stamp exists (see AppVersionSync).
 */
export function HomeBootExpect() {
  useEffect(() => {
    expectBootPart("events");
  }, []);

  return null;
}
