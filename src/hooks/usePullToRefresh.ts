import { useCallback, useEffect, useRef, useState } from "react";

interface UsePullToRefreshOptions {
  /** Callback triggered when pull-to-refresh completes */
  onRefresh: () => void | Promise<void>;
  /** Minimum distance (px) to trigger refresh. Default: 80 */
  threshold?: number;
  /** Maximum pull distance (px) for visual effect. Default: 140 */
  maxPullDistance?: number;
  /** Enable pull-to-refresh. Default: true */
  enabled?: boolean;
  /** Only enable when scrolled to top. Default: true */
  requireScrollTop?: boolean;
  /** Target element ID to apply transform to. Default: "main-content" */
  targetElementId?: string;
}

interface PullToRefreshState {
  /** Current pull distance in pixels */
  pullDistance: number;
  /** Whether refresh is in progress */
  isRefreshing: boolean;
  /** Whether pull threshold has been met */
  canRelease: boolean;
}

/**
 * Hook for implementing iOS-style pull-to-refresh functionality in PWAs.
 * The page content moves down as you pull, then bounces back on release.
 */
export function usePullToRefresh({
  onRefresh,
  threshold = 80,
  maxPullDistance = 140,
  enabled = true,
  requireScrollTop = true,
  targetElementId = "main-content",
}: UsePullToRefreshOptions): PullToRefreshState {
  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const startY = useRef<number | null>(null);
  const currentPullDistance = useRef(0);
  const isPulling = useRef(false);
  const canPull = useRef(false);

  const reset = useCallback(() => {
    const target = document.getElementById(targetElementId);
    if (target) {
      target.style.transition = "transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)";
      target.style.transform = "translateY(0)";
      setTimeout(() => {
        if (target) {
          target.style.transition = "";
        }
      }, 300);
    }
    
    setPullDistance(0);
    currentPullDistance.current = 0;
    startY.current = null;
    isPulling.current = false;
    canPull.current = false;
  }, [targetElementId]);

  const handleTouchStart = useCallback(
    (e: TouchEvent) => {
      if (!enabled || isRefreshing) return;

      // Only start pull if at the top of the page
      if (requireScrollTop && window.scrollY > 5) {
        return;
      }

      // Check if touch started on a scrollable element other than body/main
      const target = e.target as HTMLElement;
      const scrollableParent = findScrollableParent(target);
      
      // If inside a scrollable container (not body/html), don't pull
      if (scrollableParent && scrollableParent.scrollTop > 0) {
        return;
      }

      canPull.current = true;
      startY.current = e.touches[0].clientY;
    },
    [enabled, isRefreshing, requireScrollTop]
  );

  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      if (!enabled || !canPull.current || startY.current === null || isRefreshing) {
        return;
      }

      const currentY = e.touches[0].clientY;
      const diff = currentY - startY.current;

      // Only pull down (positive diff) and only if at top
      if (diff > 0 && window.scrollY <= 0) {
        // Prevent default to avoid unwanted scrolling
        if (diff > 10) {
          e.preventDefault();
        }

        isPulling.current = true;
        
        // Apply rubber band effect (diminishing returns as you pull further)
        const distance = Math.min(
          maxPullDistance,
          diff * 0.5 // Rubber band: 50% of actual pull distance
        );
        
        currentPullDistance.current = distance;
        setPullDistance(distance);

        // Apply transform to page content
        const target = document.getElementById(targetElementId);
        if (target) {
          target.style.transition = "";
          target.style.transform = `translateY(${distance}px)`;
        }
      } else {
        if (isPulling.current) {
          reset();
        }
      }
    },
    [enabled, isRefreshing, maxPullDistance, reset, targetElementId]
  );

  const handleTouchEnd = useCallback(async () => {
    if (!enabled || !isPulling.current) {
      reset();
      return;
    }

    const distance = currentPullDistance.current;

    // Check if pull was far enough to trigger refresh
    if (distance >= threshold) {
      setIsRefreshing(true);

      // Animate to threshold position
      const target = document.getElementById(targetElementId);
      if (target) {
        target.style.transition = "transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)";
        target.style.transform = `translateY(${threshold}px)`;
      }

      try {
        await onRefresh();
      } catch (error) {
        console.error("Pull-to-refresh failed:", error);
      } finally {
        // Bounce back to top after refresh completes
        setTimeout(() => {
          setIsRefreshing(false);
          reset();
        }, 500);
      }
    } else {
      // Not pulled far enough, bounce back
      reset();
    }
  }, [enabled, threshold, onRefresh, reset, targetElementId]);

  useEffect(() => {
    if (!enabled) return;

    const options: AddEventListenerOptions = { passive: false };

    document.addEventListener("touchstart", handleTouchStart, { passive: true });
    document.addEventListener("touchmove", handleTouchMove, options);
    document.addEventListener("touchend", handleTouchEnd, { passive: true });
    document.addEventListener("touchcancel", reset, { passive: true });

    return () => {
      document.removeEventListener("touchstart", handleTouchStart);
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchend", handleTouchEnd);
      document.removeEventListener("touchcancel", reset);
    };
  }, [enabled, handleTouchStart, handleTouchMove, handleTouchEnd, reset]);

  // Reset on unmount
  useEffect(() => {
    return () => {
      const target = document.getElementById(targetElementId);
      if (target) {
        target.style.transition = "";
        target.style.transform = "";
      }
    };
  }, [targetElementId]);

  return {
    pullDistance,
    isRefreshing,
    canRelease: pullDistance >= threshold,
  };
}

/**
 * Find the nearest scrollable parent element (excludes html/body)
 */
function findScrollableParent(element: HTMLElement | null): HTMLElement | null {
  if (!element || element === document.body || element === document.documentElement) {
    return null;
  }

  const { overflow, overflowY } = window.getComputedStyle(element);
  const isScrollable = /(auto|scroll)/.test(overflow + overflowY);

  if (isScrollable && element.scrollHeight > element.clientHeight) {
    return element;
  }

  return findScrollableParent(element.parentElement);
}
