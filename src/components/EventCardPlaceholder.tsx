/** Quiet ghost cards that pad short lists so sticky scroll-to-top can reach the filter bar. */
export const LIST_SCROLL_PAD_TARGET = 3;

interface EventCardPlaceholderProps {
  label: string;
  onClick?: () => void;
}

export function EventCardPlaceholder({
  label,
  onClick,
}: EventCardPlaceholderProps) {
  const className = `
    relative flex w-full items-center gap-3.5 rounded-2xl px-4 py-[1.125rem]
    border border-dashed border-neutral-300/90 dark:border-neutral-700/90
    bg-neutral-100/50 dark:bg-neutral-900/40
    ${onClick ? "cursor-pointer transition-colors touch-manipulation hover:border-orange-400/70 hover:bg-orange-50/40 dark:hover:border-orange-500/50 dark:hover:bg-orange-950/20" : ""}
  `;

  const body = (
    <>
      <div
        className="flex h-[4.25rem] w-[4.25rem] flex-shrink-0 items-center justify-center rounded-xl bg-neutral-200/70 text-2xl text-neutral-400 dark:bg-neutral-800/70 dark:text-neutral-500"
        aria-hidden
      >
        +
      </div>
      <p className="min-w-0 flex-1 text-left text-[15px] font-semibold text-neutral-500 dark:text-neutral-400">
        {label}
      </p>
    </>
  );

  if (onClick) {
    return (
      <button type="button" onClick={onClick} className={className}>
        {body}
      </button>
    );
  }

  return (
    <div className={className} aria-hidden="true">
      {body}
    </div>
  );
}

/** Renders enough ghost cards to reach LIST_SCROLL_PAD_TARGET when the list is short. */
export function EventListScrollPads({
  count,
  label,
  onAddEvent,
}: {
  count: number;
  label: string;
  onAddEvent?: () => void;
}) {
  const pads = Math.max(0, LIST_SCROLL_PAD_TARGET - count);
  if (pads === 0) return null;
  return (
    <>
      {Array.from({ length: pads }, (_, i) => (
        <EventCardPlaceholder
          key={`list-pad-${i}`}
          label={label}
          onClick={onAddEvent}
        />
      ))}
    </>
  );
}
