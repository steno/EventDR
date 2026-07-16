export function EventCardSkeleton() {
  return (
    <div
      className="
        relative w-full rounded-2xl bg-white dark:bg-neutral-900 px-4 py-[1.125rem]
        border border-neutral-200 dark:border-neutral-800
        shadow-[0_2px_12px_-4px_rgba(0,0,0,0.08)] dark:shadow-[0_2px_12px_-4px_rgba(0,0,0,0.3)]
        animate-pulse
      "
      aria-hidden="true"
    >
      <div className="flex gap-3.5">
        <div className="flex-shrink-0 h-[4.25rem] w-[4.25rem] rounded-xl bg-neutral-200 dark:bg-neutral-800" />
        
        <div className="flex-1 min-w-0 pt-0.5">
          <div className="mb-2 h-5 w-3/4 rounded bg-neutral-200 dark:bg-neutral-800" />
          <div className="mb-1 h-4 w-1/2 rounded bg-neutral-200 dark:bg-neutral-800" />
          <div className="h-4 w-2/3 rounded bg-neutral-200 dark:bg-neutral-800" />
        </div>
      </div>
    </div>
  );
}
