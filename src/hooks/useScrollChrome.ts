"use client";

import { useSyncExternalStore } from "react";
import {
  getScrollChromeServerSnapshot,
  getScrollChromeVisible,
  subscribeScrollChrome,
} from "@/lib/scroll-chrome";

/** True when sticky header / bottom nav should be on-screen. */
export function useScrollChromeVisible(): boolean {
  return useSyncExternalStore(
    subscribeScrollChrome,
    getScrollChromeVisible,
    getScrollChromeServerSnapshot,
  );
}
