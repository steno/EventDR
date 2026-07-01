import type { Dictionary } from "@/i18n/dictionaries";

interface SiteFooterProps {
  dict: Dictionary;
  className?: string;
}

export function SiteFooter({ dict, className = "" }: SiteFooterProps) {
  return (
    <footer
      className={`border-t border-neutral-100 bg-white py-6 text-center ${className}`}
    >
      <p className="text-xs text-neutral-400 font-medium">{dict.footer.tagline}</p>
      <p className="text-xs text-neutral-300 mt-1">
        {dict.footer.builtWith}{" "}
        <a
          href="https://www.asemota.de"
          target="_blank"
          rel="noopener noreferrer"
          className="text-neutral-400 hover:text-neutral-600 transition-colors font-medium"
        >
          asemota
        </a>
      </p>
    </footer>
  );
}
