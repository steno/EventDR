import Link from "next/link";
import { PAGE_SHELL_CLASS } from "@/lib/page-shell";
import type { Locale } from "@/i18n/config";
import type { LegalPageCopy } from "@/lib/legal-copy";

export function LegalPage({
  locale,
  copy,
}: {
  locale: Locale;
  copy: LegalPageCopy;
}) {
  return (
    <main className="relative bg-neutral-50 pb-16 dark:bg-transparent">
      <div className={`${PAGE_SHELL_CLASS} max-w-3xl`}>
        <header className="pb-2 pt-4">
          <Link
            href={`/${locale}`}
            className="text-sm font-semibold text-orange-600 transition-colors hover:text-orange-500"
          >
            ← POP Events
          </Link>
          <h1 className="mt-6 text-display font-extrabold tracking-tight text-neutral-900 dark:text-white">
            {copy.title}
          </h1>
          <p className="mt-2 text-sm text-neutral-500">{copy.updated}</p>
        </header>
        {copy.sections.map((section) => (
          <section key={section.heading} className="mt-8">
            <h2 className="text-lg font-bold text-neutral-900 dark:text-white">
              {section.heading}
            </h2>
            {section.body.map((p) => (
              <p
                key={p.slice(0, 48)}
                className="mt-3 text-copy text-neutral-700 dark:text-neutral-300"
              >
                {p}
              </p>
            ))}
          </section>
        ))}
      </div>
    </main>
  );
}
