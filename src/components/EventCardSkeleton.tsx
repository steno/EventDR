import type { EventListView } from "@/lib/event-list-view";

export function EventCardSkeleton({
  view = "list",
}: {
  view?: EventListView;
}) {
  if (view === "cards") {
    return (
      <div
        className="
          overflow-hidden rounded-2xl bg-white dark:bg-neutral-900
          border border-neutral-200 dark:border-neutral-800
          shadow-[0_2px_12px_-4px_rgba(0,0,0,0.08)] dark:shadow-[0_2px_12px_-4px_rgba(0,0,0,0.3)]
          animate-pulse
        "
        aria-hidden="true"
      >
        <div className="aspect-[4/3] w-full bg-neutral-200 dark:bg-neutral-800" />
        <div className="space-y-2 p-3">
          <div className="h-5 w-3/4 rounded bg-neutral-200 dark:bg-neutral-800" />
          <div className="h-4 w-1/2 rounded bg-neutral-200 dark:bg-neutral-800" />
        </div>
      </div>
    );
  }

  return (
    <div
      className="
        relative w-full rounded-2xl bg-white dark:bg-neutral-900 px-3.5 py-2.5
        border border-neutral-200 dark:border-neutral-800
        shadow-[0_2px_12px_-4px_rgba(0,0,0,0.08)] dark:shadow-[0_2px_12px_-4px_rgba(0,0,0,0.3)]
        animate-pulse
      "
      aria-hidden="true"
    >
      <div className="flex gap-3">
        <div className="h-14 w-14 flex-shrink-0 rounded-xl bg-neutral-200 dark:bg-neutral-800" />

        <div className="min-w-0 flex-1">
          <div className="mb-1 h-4 w-3/4 rounded bg-neutral-200 dark:bg-neutral-800" />
          <div className="mb-1 h-3.5 w-1/2 rounded bg-neutral-200 dark:bg-neutral-800" />
          <div className="h-3.5 w-2/3 rounded bg-neutral-200 dark:bg-neutral-800" />
        </div>
      </div>
    </div>
  );
}
