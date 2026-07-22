import Image from "next/image";
import Link from "next/link";
import { PaypalDonateForm } from "@/components/PaypalDonateForm";
import { PAGE_SHELL_CLASS } from "@/lib/page-shell";
import type { Locale } from "@/i18n/config";
import type { SupportCopy } from "@/lib/support-copy";

interface SupportPageProps {
  locale: Locale;
  copy: SupportCopy;
  available: boolean;
}

export function SupportPage({ locale, copy, available }: SupportPageProps) {
  return (
    <main className="relative bg-neutral-50 pb-10 dark:bg-transparent">
      <div className={PAGE_SHELL_CLASS}>
        <header className="pb-2 pt-4">
          <Link
            href={`/${locale}`}
            className="text-sm font-semibold text-orange-600 transition-colors hover:text-orange-500"
          >
            ← POP Events
          </Link>
        </header>

        <section className="relative mt-3 overflow-hidden rounded-[1.75rem]">
          <div className="relative min-h-[16rem] sm:min-h-[18rem]">
            <Image
              src="/cities/north-coast.jpg"
              alt=""
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 64rem"
              className="object-cover object-center"
            />
            <div
              className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/55 to-neutral-950/20"
              aria-hidden
            />
            <div className="absolute inset-x-0 bottom-0 p-5 sm:p-7">
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-orange-200/90">
                {copy.eyebrow}
              </p>
              <h1 className="mt-2 max-w-xl font-display text-3xl font-extrabold leading-[1.05] tracking-tight text-white sm:text-4xl">
                {copy.title}
              </h1>
              <p className="mt-3 max-w-lg text-sm font-medium leading-relaxed text-neutral-200 sm:text-base">
                {copy.lead}
              </p>
              <a
                href="#donate"
                className="mt-5 inline-flex min-h-11 items-center rounded-full bg-gradient-to-r from-orange-500 via-rose-500 to-fuchsia-500 px-5 text-sm font-black text-white shadow-lg shadow-rose-500/30 transition-transform active:scale-[0.98]"
              >
                {copy.form.title}
              </a>
            </div>
          </div>
        </section>

        <div className="mt-6">
          <PaypalDonateForm copy={copy} available={available} />
        </div>

        <section className="mt-10">
          <h2 className="font-display text-xl font-extrabold tracking-tight text-neutral-950 dark:text-neutral-50">
            {copy.storyTitle}
          </h2>
          <div className="mt-4 space-y-4">
            {copy.story.map((paragraph) => (
              <p
                key={paragraph.slice(0, 32)}
                className="text-copy-lead text-neutral-600 dark:text-neutral-300"
              >
                {paragraph}
              </p>
            ))}
          </div>
        </section>

        <section className="mt-10 mb-2">
          <h2 className="font-display text-xl font-extrabold tracking-tight text-neutral-950 dark:text-neutral-50">
            {copy.fundsTitle}
          </h2>
          <ul className="mt-5 space-y-5">
            {copy.funds.map((item) => (
              <li
                key={item.label}
                className="border-t border-neutral-200/80 pt-5 dark:border-neutral-800"
              >
                <p className="text-sm font-black text-neutral-900 dark:text-neutral-100">
                  {item.label}
                </p>
                <p className="mt-1 text-sm font-medium leading-relaxed text-neutral-600 dark:text-neutral-300">
                  {item.detail}
                </p>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </main>
  );
}
