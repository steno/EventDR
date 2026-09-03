"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import {
  PULL_ACTIVATE_PX,
  PULL_ARM_PX,
  canStartPull,
  dampPullDistance,
  hasNestedScrollNotAtTop,
  isBootSplashBlocking,
  isMostlyVertical,
  isPullArmed,
  prefersPullToReload,
  reloadCurrentPage,
  shouldIgnorePullTarget,
  subscribePullToReloadMedia,
  type PullReloadStatus,
} from "@/lib/pull-to-reload";

const SNAP_MS = 280;
const SNAP_EASING = "cubic-bezier(0.32, 0.72, 0, 1)";
const APP_SHELL_ID = "app-shell";

type DragState = {
  pointerId: number;
  startX: number;
  startY: number;
  lastY: number;
  usingTouch: boolean;
  active: boolean;
};

function createIdleDrag(): DragState {
  return {
    pointerId: -1,
    startX: 0,
    startY: 0,
    lastY: 0,
    usingTouch: false,
    active: false,
  };
}

function suppressFollowingClick() {
  const onClick = (event: MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
  };
  window.addEventListener("click", onClick, { capture: true, once: true });
}

function shellEl(): HTMLElement | null {
  return document.getElementById(APP_SHELL_ID);
}

function setShellPull(pullPx: number, animate: boolean) {
  const shell = shellEl();
  if (!shell) return;
  shell.style.willChange = pullPx > 0 ? "transform" : "";
  shell.style.transition = animate
    ? `transform ${SNAP_MS}ms ${SNAP_EASING}`
    : "none";
  shell.style.transform = pullPx > 0 ? `translateY(${pullPx}px)` : "";
}

export function usePullToReload(enabled = true) {
  const indicatorRef = useRef<HTMLDivElement>(null);
  const spinnerRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<DragState>(createIdleDrag());
  const pullRef = useRef(0);
  const statusRef = useRef<PullReloadStatus>("idle");
  const [status, setStatus] = useState<PullReloadStatus>("idle");
  const enabledByMedia = useSyncExternalStore(
    subscribePullToReloadMedia,
    prefersPullToReload,
    () => false,
  );

  const active = enabled && enabledByMedia;

  const applyVisual = useCallback((pullPx: number, animate: boolean) => {
    pullRef.current = pullPx;
    setShellPull(pullPx, animate);

    const indicator = indicatorRef.current;
    if (indicator) {
      indicator.style.transition = animate
        ? `height ${SNAP_MS}ms ${SNAP_EASING}, opacity ${SNAP_MS}ms ${SNAP_EASING}`
        : "none";
      indicator.style.height = `${pullPx}px`;
      indicator.style.opacity = pullPx > 0 ? "1" : "0";
    }

    const spinner = spinnerRef.current;
    if (spinner) {
      const progress = Math.min(1, pullPx / PULL_ARM_PX);
      spinner.style.opacity = String(0.25 + progress * 0.75);
      spinner.style.transform = `scale(${0.7 + progress * 0.3})`;
    }
  }, []);

  const setPullStatus = useCallback((next: PullReloadStatus) => {
    if (statusRef.current === next) return;
    statusRef.current = next;
    setStatus(next);
  }, []);

  const resetDrag = useCallback(() => {
    dragRef.current = createIdleDrag();
  }, []);

  const snapBack = useCallback(() => {
    setPullStatus("idle");
    applyVisual(0, true);
    window.setTimeout(() => {
      if (statusRef.current !== "reloading") {
        applyVisual(0, false);
      }
    }, SNAP_MS);
    resetDrag();
  }, [applyVisual, resetDrag, setPullStatus]);

  const triggerReload = useCallback(() => {
    if (statusRef.current === "reloading") return;
    setPullStatus("reloading");
    applyVisual(Math.min(pullRef.current, PULL_ARM_PX + 8), true);
    try {
      navigator.vibrate?.(16);
    } catch {
      /* ignore */
    }
    reloadCurrentPage();
    resetDrag();
  }, [applyVisual, resetDrag, setPullStatus]);

  useEffect(() => {
    if (!active) return;

    const begin = (
      clientX: number,
      clientY: number,
      pointerId: number,
      usingTouch: boolean,
      target: EventTarget | null,
    ) => {
      if (statusRef.current === "reloading") return;
      if (isBootSplashBlocking()) return;
      if (!canStartPull(window.scrollY)) return;
      if (shouldIgnorePullTarget(target)) return;
      if (hasNestedScrollNotAtTop(target)) return;

      dragRef.current = {
        pointerId,
        startX: clientX,
        startY: clientY,
        lastY: clientY,
        usingTouch,
        active: false,
      };
    };

    const move = (
      clientX: number,
      clientY: number,
      pointerId: number,
      event: Event,
    ) => {
      const drag = dragRef.current;
      if (drag.pointerId !== pointerId) return;
      if (statusRef.current === "reloading") return;

      const dx = clientX - drag.startX;
      const dy = clientY - drag.startY;

      if (!drag.active) {
        if (dy < PULL_ACTIVATE_PX) {
          if (dy < -PULL_ACTIVATE_PX || Math.abs(dx) > PULL_ACTIVATE_PX * 1.5) {
            resetDrag();
          }
          return;
        }
        if (!isMostlyVertical(dx, dy)) {
          resetDrag();
          return;
        }
        if (!canStartPull(window.scrollY)) {
          resetDrag();
          return;
        }
        drag.active = true;
        document.documentElement.classList.add("pull-reloading");
      }

      if (event.cancelable) event.preventDefault();
      drag.lastY = clientY;

      const visual = dampPullDistance(dy);
      applyVisual(visual, false);

      const next: PullReloadStatus = isPullArmed(visual) ? "armed" : "pulling";
      if (next === "armed" && statusRef.current !== "armed") {
        try {
          navigator.vibrate?.(10);
        } catch {
          /* ignore */
        }
      }
      setPullStatus(next);
    };

    const finish = (clientY: number, pointerId: number) => {
      const drag = dragRef.current;
      if (drag.pointerId !== pointerId) return;
      document.documentElement.classList.remove("pull-reloading");

      if (!drag.active) {
        resetDrag();
        return;
      }

      suppressFollowingClick();
      const visual = dampPullDistance(clientY - drag.startY);
      if (isPullArmed(visual)) {
        triggerReload();
        return;
      }
      snapBack();
    };

    const onTouchStart = (event: TouchEvent) => {
      const touch = event.touches[0];
      if (!touch) return;
      begin(touch.clientX, touch.clientY, touch.identifier, true, event.target);
    };

    const onTouchMove = (event: TouchEvent) => {
      const drag = dragRef.current;
      if (!drag.usingTouch) return;
      const touch = [...event.touches].find((t) => t.identifier === drag.pointerId);
      if (!touch) return;
      move(touch.clientX, touch.clientY, drag.pointerId, event);
    };

    const onTouchEnd = (event: TouchEvent) => {
      const drag = dragRef.current;
      if (!drag.usingTouch) return;
      const touch = [...event.changedTouches].find(
        (t) => t.identifier === drag.pointerId,
      );
      finish(touch?.clientY ?? drag.lastY, drag.pointerId);
    };

    const onPointerDown = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;
      if (event.button !== 0) return;
      begin(event.clientX, event.clientY, event.pointerId, false, event.target);
    };

    const onPointerMove = (event: PointerEvent) => {
      if (dragRef.current.usingTouch) return;
      move(event.clientX, event.clientY, event.pointerId, event);
    };

    const onPointerUp = (event: PointerEvent) => {
      if (dragRef.current.usingTouch) return;
      finish(event.clientY, event.pointerId);
    };

    window.addEventListener("touchstart", onTouchStart, { passive: true, capture: true });
    window.addEventListener("touchmove", onTouchMove, { passive: false, capture: true });
    window.addEventListener("touchend", onTouchEnd, { passive: true, capture: true });
    window.addEventListener("touchcancel", onTouchEnd, { passive: true, capture: true });
    window.addEventListener("pointerdown", onPointerDown, { capture: true });
    window.addEventListener("pointermove", onPointerMove, {
      capture: true,
      passive: false,
    });
    window.addEventListener("pointerup", onPointerUp, { capture: true });
    window.addEventListener("pointercancel", onPointerUp, { capture: true });

    return () => {
      document.documentElement.classList.remove("pull-reloading");
      window.removeEventListener("touchstart", onTouchStart, true);
      window.removeEventListener("touchmove", onTouchMove, true);
      window.removeEventListener("touchend", onTouchEnd, true);
      window.removeEventListener("touchcancel", onTouchEnd, true);
      window.removeEventListener("pointerdown", onPointerDown, true);
      window.removeEventListener("pointermove", onPointerMove, true);
      window.removeEventListener("pointerup", onPointerUp, true);
      window.removeEventListener("pointercancel", onPointerUp, true);
      applyVisual(0, false);
    };
  }, [active, applyVisual, resetDrag, setPullStatus, snapBack, triggerReload]);

  return { indicatorRef, spinnerRef, status, active };
}
