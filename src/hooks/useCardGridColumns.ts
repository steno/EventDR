"use client";

import {
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
  type RefCallback,
} from "react";
import {
  CARD_GRID_MOBILE_COLUMNS,
  countCardGridColumns,
} from "@/lib/card-grid";

/**
 * Live column count for CARD_GRID_CLASS. Defaults to the mobile 2-col grid
 * until the element is measured (SSR + first layout).
 */
export function useCardGridColumns(
  enabled: boolean,
): [RefCallback<HTMLDivElement>, number] {
  const [columns, setColumns] = useState(CARD_GRID_MOBILE_COLUMNS);
  const nodeRef = useRef<HTMLDivElement | null>(null);
  const observerRef = useRef<ResizeObserver | null>(null);

  const measure = useCallback((el: HTMLDivElement) => {
    setColumns(countCardGridColumns(el.clientWidth, window.innerWidth));
  }, []);

  const ref = useCallback<RefCallback<HTMLDivElement>>(
    (node) => {
      observerRef.current?.disconnect();
      observerRef.current = null;
      nodeRef.current = node;
      if (!enabled || !node) return;
      measure(node);
      const observer = new ResizeObserver(() => {
        if (nodeRef.current) measure(nodeRef.current);
      });
      observer.observe(node);
      observerRef.current = observer;
    },
    [enabled, measure],
  );

  useLayoutEffect(() => {
    if (!enabled) return;
    const onResize = () => {
      if (nodeRef.current) measure(nodeRef.current);
    };
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      observerRef.current?.disconnect();
    };
  }, [enabled, measure]);

  return [ref, columns];
}
