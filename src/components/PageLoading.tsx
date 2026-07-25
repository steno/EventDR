/** Full-viewport page transition loading UI (iOS-style activity indicator). */
export function PageLoading() {
  return (
    <div
      className="page-loading"
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <span className="sr-only">Loading</span>
      <div className="page-loading-spinner" aria-hidden>
        {Array.from({ length: 12 }, (_, i) => (
          <div
            key={i}
            className="page-loading-spinner__bar"
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
