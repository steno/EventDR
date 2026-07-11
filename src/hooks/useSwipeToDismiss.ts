"use client";

import {
  useCallback,
  useRef,
  useState,
  useSyncExternalStore,
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
} from "react";

const DISMISS_DISTANCE_PX = 96;
const DISMISS_VELOCITY = 0.45;
const EXIT_DURATION_MS = 280;

const SWIPE_DISMISS_QUERY = "(max-width: 640px), (pointer: coarse)";

function prefersSwipeDismiss(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia(SWIPE_DISMISS_QUERY).matches;
}

function subscribeSwipeDismiss(onStoreChange: () => void): () => void {
  const media = window.matchMedia(SWIPE_DISMISS_QUERY);
  media.addEventListener("change", onStoreChange);
  return () => media.removeEventListener("change", onStoreChange);
}

function isInteractiveTarget(target: EventTarget | null): boolean {
  return Boolean(
    (target as HTMLElement | null)?.closest("button, a, input, textarea, select, label"),
  );
}

export function useSwipeToDismiss(onDismiss: () => void, enabled = true) {
  const sheetRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef({
    startY: 0,
    startTime: 0,
    pointerId: -1,
  });
  const [offsetY, setOffsetY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const swipeEnabled = useSyncExternalStore(
    subscribeSwipeDismiss,
    prefersSwipeDismiss,
    () => false,
  );

  const active = enabled && swipeEnabled;

  const dismiss = useCallback(() => {
    if (isExiting) return;
    setIsExiting(true);
    setIsAnimating(true);
    setIsDragging(false);
    const height = sheetRef.current?.offsetHeight ?? window.innerHeight;
    setOffsetY(height + 48);
    window.setTimeout(onDismiss, EXIT_DURATION_MS);
  }, [isExiting, onDismiss]);

  const onDragZonePointerDown = useCallback(
    (e: ReactPointerEvent<HTMLElement>) => {
      if (!active || isExiting || isInteractiveTarget(e.target)) return;
      if (e.button !== 0) return;

      e.currentTarget.setPointerCapture(e.pointerId);
      dragRef.current = {
        startY: e.clientY,
        startTime: Date.now(),
        pointerId: e.pointerId,
      };
      setIsDragging(true);
      setIsAnimating(false);
    },
    [active, isExiting],
  );

  const onDragZonePointerMove = useCallback((e: ReactPointerEvent<HTMLElement>) => {
    if (dragRef.current.pointerId !== e.pointerId) return;
    const delta = Math.max(0, e.clientY - dragRef.current.startY);
    setOffsetY(delta);
  }, []);

  const finishDrag = useCallback(
    (clientY: number, pointerId: number) => {
      if (dragRef.current.pointerId !== pointerId) return;

      dragRef.current.pointerId = -1;
      setIsDragging(false);

      const delta = Math.max(0, clientY - dragRef.current.startY);
      const elapsed = Math.max(Date.now() - dragRef.current.startTime, 1);
      const velocity = delta / elapsed;

      if (delta > DISMISS_DISTANCE_PX || velocity > DISMISS_VELOCITY) {
        dismiss();
        return;
      }

      setIsAnimating(true);
      setOffsetY(0);
    },
    [dismiss],
  );

  const onDragZonePointerUp = useCallback(
    (e: ReactPointerEvent<HTMLElement>) => {
      finishDrag(e.clientY, e.pointerId);
    },
    [finishDrag],
  );

  const onDragZonePointerCancel = useCallback(
    (e: ReactPointerEvent<HTMLElement>) => {
      finishDrag(e.clientY, e.pointerId);
    },
    [finishDrag],
  );

  const dragZoneProps = {
    onPointerDown: onDragZonePointerDown,
    onPointerMove: onDragZonePointerMove,
    onPointerUp: onDragZonePointerUp,
    onPointerCancel: onDragZonePointerCancel,
  };

  const sheetStyle: CSSProperties = {
    transform: offsetY > 0 || isExiting ? `translateY(${offsetY}px)` : undefined,
    transition:
      isDragging || !isAnimating
        ? undefined
        : `transform ${EXIT_DURATION_MS}ms cubic-bezier(0.32, 0.72, 0, 1)`,
  };

  const backdropOpacity = Math.max(0.08, 1 - Math.min(offsetY / 320, 0.85));

  return {
    sheetRef,
    sheetStyle,
    dragZoneProps,
    dismiss,
    backdropOpacity,
    isDragging,
    swipeEnabled: active,
  };
}
