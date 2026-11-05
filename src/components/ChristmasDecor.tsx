/**
 * Light decorative Santas + falling snow for Christmas category listings /
 * home rail. Pure CSS (transform-only). pointer-events none — never blocks
 * list chrome.
 */
const SANTA_COUNT = 3;
const SNOWFLAKE_COUNT = 18;

export function ChristmasDecor({ className }: { className?: string } = {}) {
  return (
    <div
      className={["christmas-decor", className].filter(Boolean).join(" ")}
      aria-hidden
    >
      <div className="christmas-snow">
        {Array.from({ length: SNOWFLAKE_COUNT }, (_, i) => (
          <span
            key={i}
            className={`christmas-snowflake christmas-snowflake--${i % 6}`}
          />
        ))}
      </div>
      {Array.from({ length: SANTA_COUNT }, (_, i) => (
        <div key={i} className={`christmas-santa christmas-santa--${i}`}>
          <span className="christmas-santa__hat" />
          <span className="christmas-santa__face" />
          <span className="christmas-santa__beard" />
          <span className="christmas-santa__body" />
        </div>
      ))}
    </div>
  );
}
