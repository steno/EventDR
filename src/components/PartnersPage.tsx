import type { PartnersCopy } from "@/lib/partners-copy";
import { PrintButton } from "@/components/PrintButton";
import { PartnerChecklist } from "@/components/PartnerChecklist";
import { PartnerDigestSignup } from "@/components/PartnerDigestSignup";
import { PAGE_SHELL_CLASS } from "@/lib/page-shell";
import type { Locale } from "@/i18n/config";

interface PartnerQrCardProps {
  label: string;
  hint: string;
  url: string;
  svg: string;
}

export function PartnerQrCard({ label, hint, url, svg }: PartnerQrCardProps) {
  return (
    <article className="flex flex-col items-center rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm dark:border-neutral-700 dark:bg-neutral-900 print:break-inside-avoid">
      <h3 className="text-center text-sm font-black text-neutral-900 dark:text-neutral-100">
        {label}
      </h3>
      <p className="mt-1 text-center text-xs font-medium text-neutral-500 dark:text-neutral-400">
        {hint}
      </p>
      <div
        className="mt-4 rounded-xl bg-white p-2 print:p-1"
        dangerouslySetInnerHTML={{ __html: svg }}
        aria-hidden
      />
      <p className="mt-3 max-w-[200px] break-all text-center font-mono text-[10px] text-neutral-400 dark:text-neutral-500 print:text-neutral-600">
        {url.replace(/^https?:\/\//, "")}
      </p>
    </article>
  );
}

interface PartnersPageProps {
  copy: PartnersCopy;
  locale: Locale;
  qrCards: {
    all: PartnerQrCardProps;
    weekend: PartnerQrCardProps;
    cities: PartnerQrCardProps[];
  };
}

export function PartnersPage({ copy, locale, qrCards }: PartnersPageProps) {
  return (
    <main className="relative bg-neutral-50 pb-8 dark:bg-transparent print:bg-white">
      <div className={`${PAGE_SHELL_CLASS} print:max-w-none print:rounded-none print:bg-transparent print:px-4 print:shadow-none print:ring-0`}>
        <header className="pb-6 pt-4 print:pt-2">
          <a
            href={`/${locale}`}
            className="text-sm font-semibold text-orange-600 hover:text-orange-500 print:hidden"
          >
            ← POP Events
          </a>
          <h1 className="mt-4 text-3xl font-black tracking-tight text-neutral-950 dark:text-neutral-50 print:text-black">
            {copy.title}
          </h1>
          <p className="mt-2 text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-rose-500 to-fuchsia-500 print:text-neutral-800 print:bg-none">
            {copy.subtitle}
          </p>
          <p className="mt-3 text-copy-lead text-neutral-600 dark:text-neutral-300 print:text-neutral-700">
            {copy.intro}
          </p>
          <PrintButton label={copy.print} />
        </header>

        <section className="mb-8">
          <h2 className="mb-4 text-lg font-black text-neutral-900 dark:text-neutral-100 print:text-black">
            {copy.qrSection}
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 print:grid-cols-2">
            <PartnerQrCard {...qrCards.all} />
            <PartnerQrCard {...qrCards.weekend} />
          </div>
          <div className="mt-4 grid gap-4 sm:grid-cols-3 print:grid-cols-3">
            {qrCards.cities.map((card) => (
              <PartnerQrCard key={card.url} {...card} />
            ))}
          </div>
        </section>

        <section className="mb-8 rounded-2xl border border-neutral-200 bg-white p-5 dark:border-neutral-700 dark:bg-neutral-900 print:border-neutral-300">
          <h2 className="text-lg font-black text-neutral-900 dark:text-neutral-100 print:text-black">
            {copy.benefits.title}
          </h2>
          <ul className="mt-3 space-y-2">
            {copy.benefits.items.map((item) => (
              <li
                key={item}
                className="flex gap-2 text-sm font-medium text-neutral-600 dark:text-neutral-300 print:text-neutral-800"
              >
                <span className="text-orange-500" aria-hidden>
                  ✓
                </span>
                {item}
              </li>
            ))}
          </ul>
        </section>

        <PartnerChecklist title={copy.howTo.title} steps={copy.howTo.steps} />

        <PartnerDigestSignup locale={locale} copy={copy.digest} />

        <aside className="mb-8 print:hidden">
          <p className="text-xs font-black uppercase tracking-[0.14em] text-orange-600 dark:text-orange-400">
            {copy.support.eyebrow}
          </p>
          <h2 className="mt-2 text-xl font-black tracking-tight text-neutral-950 dark:text-neutral-50">
            {copy.support.title}
          </h2>
          <p className="mt-1.5 max-w-xl text-sm font-medium leading-relaxed text-neutral-600 dark:text-neutral-300">
            {copy.support.body}
          </p>
          <a
            href={`/${locale}/support`}
            className="mt-4 inline-flex min-h-11 items-center rounded-full bg-gradient-to-r from-orange-500 via-rose-500 to-fuchsia-500 px-4 text-sm font-bold text-white transition-transform active:scale-[0.98]"
          >
            {copy.support.cta}
          </a>
        </aside>

        <section className="print:hidden">
          <h2 className="mb-3 text-sm font-black uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
            {copy.links.title}
          </h2>
          <div className="flex flex-wrap gap-2">
            <a
              href={qrCards.all.url}
              className="rounded-full bg-neutral-900 px-4 py-2 text-sm font-bold text-white dark:bg-neutral-100 dark:text-neutral-900"
            >
              {copy.links.home}
            </a>
            <a
              href={qrCards.weekend.url}
              className="rounded-full border border-neutral-200 px-4 py-2 text-sm font-bold text-neutral-800 dark:border-neutral-600 dark:text-neutral-100"
            >
              {copy.links.weekend}
            </a>
          </div>
        </section>
      </div>
    </main>
  );
}
