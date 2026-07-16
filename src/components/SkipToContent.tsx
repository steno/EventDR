import type { Dictionary } from "@/i18n/dictionaries";

interface SkipToContentProps {
  dict: Dictionary;
}

export function SkipToContent({ dict }: SkipToContentProps) {
  return (
    <a
      href="#main-content"
      className="
        sr-only focus:not-sr-only
        fixed top-4 left-4 z-[9999]
        rounded-lg bg-orange-500 px-4 py-3 text-sm font-bold text-white shadow-lg
        focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-orange-500
      "
    >
      {dict.a11y?.skipToContent || "Skip to main content"}
    </a>
  );
}
