/**
 * Light decorative hanging spiders for Halloween category listings / home rail.
 * Pure CSS (transform-only). pointer-events none — never blocks list chrome.
 */
const SPIDER_COUNT = 3;
const LEGS_PER_SIDE = 4;

export function HalloweenSpiders({ className }: { className?: string } = {}) {
  return (
    <div
      className={["halloween-spiders", className].filter(Boolean).join(" ")}
      aria-hidden
    >
      {Array.from({ length: SPIDER_COUNT }, (_, i) => (
        <div key={i} className={`halloween-spider halloween-spider--${i}`}>
          <span className="halloween-spider__eye halloween-spider__eye--l" />
          <span className="halloween-spider__eye halloween-spider__eye--r" />
          {Array.from({ length: LEGS_PER_SIDE }, (_, j) => (
            <span
              key={`l${j}`}
              className={`halloween-spider__leg halloween-spider__leg--l halloween-spider__leg--l${j}`}
            />
          ))}
          {Array.from({ length: LEGS_PER_SIDE }, (_, j) => (
            <span
              key={`r${j}`}
              className={`halloween-spider__leg halloween-spider__leg--r halloween-spider__leg--r${j}`}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
