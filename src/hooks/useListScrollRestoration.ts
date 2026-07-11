"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
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
  const restoredRef = useRef(false);

  useEffect(() => {
    onRestoreRef.current = onRestore;
  }, [onRestore]);

  useLayoutEffect(() => {
    if (!ready || restoredRef.current) return;

    const snapshot = consumeListScroll(path);
    if (!snapshot) return;

    restoredRef.current = true;
    onRestoreRef.current?.(snapshot);
    restoreScrollPosition(snapshot.scrollY);
  }, [path, ready]);
}
