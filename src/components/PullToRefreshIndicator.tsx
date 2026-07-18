"use client";

import { Loader2, ArrowDown } from "lucide-react";

interface PullToRefreshIndicatorProps {
  pullDistance: number;
  isRefreshing: boolean;
  canRelease: boolean;
  threshold?: number;
}

/**
 * Visual indicator for pull-to-refresh gesture.
 * Shows spinner and animates based on pull distance.
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
  const opacity = Math.min(progress * 1.5, 1);
  const scale = 0.5 + (progress * 0.5);

  return (
    <div
      className="fixed left-0 right-0 top-0 z-50 flex items-center justify-center pointer-events-none"
      style={{
        height: `${Math.min(pullDistance, 80)}px`,
        opacity,
        transition: isRefreshing ? "all 0.3s ease-out" : "none",
      }}
    >
      <div
        className="relative flex items-center justify-center"
        style={{
          transform: `scale(${scale}) translateY(${isRefreshing ? 0 : -10}px)`,
          transition: isRefreshing ? "transform 0.3s ease-out" : "none",
        }}
      >
        {isRefreshing ? (
          <Loader2 
            className="h-7 w-7 animate-spin text-neutral-700 dark:text-neutral-300" 
            strokeWidth={2.5}
          />
        ) : canRelease ? (
          <div className="relative">
            <div className="absolute inset-0 animate-ping opacity-30">
              <ArrowDown className="h-7 w-7 text-neutral-700 dark:text-neutral-300" strokeWidth={2.5} />
            </div>
            <ArrowDown 
              className="relative h-7 w-7 text-neutral-700 dark:text-neutral-300" 
              strokeWidth={2.5}
            />
          </div>
        ) : (
          <ArrowDown 
            className="h-7 w-7 text-neutral-400 dark:text-neutral-600" 
            strokeWidth={2.5}
            style={{
              transform: `rotate(${progress * 180}deg)`,
              transition: "transform 0.1s ease-out",
            }}
          />
        )}
      </div>
      
      {/* Background blur effect */}
      <div 
        className="absolute inset-0 -z-10 backdrop-blur-sm bg-white/60 dark:bg-neutral-950/60"
        style={{
          opacity: progress * 0.8,
        }}
      />
    </div>
  );
}
