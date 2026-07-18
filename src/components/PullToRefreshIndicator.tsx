"use client";

import { Loader2, ArrowDown } from "lucide-react";

interface PullToRefreshIndicatorProps {
  pullDistance: number;
  isRefreshing: boolean;
  canRelease: boolean;
  threshold?: number;
}

/**
 * iOS-style pull-to-refresh indicator.
 * Fixed above the viewport, becomes visible as page content moves down.
 */
export function PullToRefreshIndicator({
  pullDistance,
  isRefreshing,
  canRelease,
  threshold = 80,
}: PullToRefreshIndicatorProps) {
  // Only show when actively pulling or refreshing
  const isVisible = pullDistance > 0 || isRefreshing;
  
  if (!isVisible) return null;

  // Calculate opacity and scale based on pull distance
  const progress = Math.min(pullDistance / threshold, 1);
  const opacity = Math.min(progress * 2, 1);
  const scale = 0.7 + (progress * 0.3);

  return (
    <div
      className="fixed left-0 right-0 flex items-center justify-center pointer-events-none bg-neutral-50 dark:bg-neutral-950"
      style={{
        top: "-80px",
        height: "80px",
        opacity,
        zIndex: 40,
      }}
    >
      <div
        className="relative flex h-12 w-12 items-center justify-center rounded-full bg-white dark:bg-neutral-900 shadow-lg ring-1 ring-neutral-200/50 dark:ring-neutral-800"
        style={{
          transform: `scale(${scale})`,
          transition: isRefreshing ? "transform 0.2s ease-out" : "transform 0.05s ease-out",
        }}
      >
        {isRefreshing ? (
          <Loader2 
            className="h-6 w-6 animate-spin text-neutral-700 dark:text-neutral-300" 
            strokeWidth={2.5}
          />
        ) : canRelease ? (
          <div className="relative">
            <div className="absolute inset-0 animate-ping opacity-25">
              <ArrowDown className="h-6 w-6 text-neutral-700 dark:text-neutral-300" strokeWidth={2.5} />
            </div>
            <ArrowDown 
              className="relative h-6 w-6 text-neutral-700 dark:text-neutral-300" 
              strokeWidth={2.5}
            />
          </div>
        ) : (
          <ArrowDown 
            className="h-6 w-6 text-neutral-500 dark:text-neutral-400" 
            strokeWidth={2.5}
            style={{
              transform: `rotate(${progress * 180}deg)`,
              transition: "transform 0.1s ease-out",
            }}
          />
        )}
      </div>
    </div>
  );
}
