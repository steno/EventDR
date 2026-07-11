"use client";

import { useEffect, useRef } from "react";
import {
  consumeListScroll,
  restoreScrollPosition,
  type ListScrollSnapshot,
} from "@/lib/list-scroll-restoration";

export function useListScrollRestoration(
  path: string,
  ready: boolean,
  onRestore?: (snapshot: ListScrollSnapshot) => void,
): void {
  const onRestoreRef = useRef(onRestore);

  useEffect(() => {
    onRestoreRef.current = onRestore;
  }, [onRestore]);

  useEffect(() => {
    if (!ready) return;

    const snapshot = consumeListScroll(path);
    if (!snapshot) return;

    onRestoreRef.current?.(snapshot);
    restoreScrollPosition(snapshot.scrollY);
  }, [path, ready]);
}
