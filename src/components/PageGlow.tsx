export function PageGlow() {
  return (
    <>
      <div
        className="page-glow page-glow-orange pointer-events-none absolute -top-20 -left-24 h-56 w-56 rounded-full bg-orange-500/10 blur-3xl"
        aria-hidden
      />
      <div
        className="page-glow page-glow-fuchsia pointer-events-none absolute top-20 -right-24 h-64 w-64 rounded-full bg-fuchsia-500/10 blur-3xl"
        aria-hidden
      />
    </>
  );
}
