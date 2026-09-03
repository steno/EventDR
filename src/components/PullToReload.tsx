"use client";

import type { Dictionary } from "@/i18n/dictionaries";
import { usePullToReload } from "@/hooks/usePullToReload";

interface PullToReloadProps {
  dict: Dictionary;
}

export function PullToReload({ dict }: PullToReloadProps) {
  const { indicatorRef, spinnerRef, status, active } = usePullToReload();

  if (!active) return null;

  const label =
    status === "reloading"
      ? dict.a11y.reloading
      : status === "armed"
        ? dict.a11y.releaseToReload
        : dict.a11y.pullToReload;

  return (
    <div
      ref={indicatorRef}
      className={`pull-reload pull-reload--${status}`}
      role="status"
      aria-live="polite"
      aria-busy={status === "reloading"}
      aria-hidden={status === "idle" ? true : undefined}
    >
      <span className="sr-only">{status === "idle" ? "" : label}</span>
      <div ref={spinnerRef} className="pull-reload__spinner" aria-hidden>
        {Array.from({ length: 12 }, (_, i) => (
          <i
            key={i}
            style={{
              transform: `rotate(${i * 30}deg)`,
              animationDelay: `${(-1.1 + i * 0.1).toFixed(1)}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
}
