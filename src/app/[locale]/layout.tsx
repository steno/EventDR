import { notFound } from "next/navigation";
import { Syne, DM_Sans } from "next/font/google";
import { isValidLocale, locales } from "@/i18n/config";
import "../globals.css";

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  weight: ["700", "800"],
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();

  return (
    <html
      lang={locale}
      className={`${syne.variable} ${dmSans.variable} h-full`}
    >
      <body className="min-h-full flex flex-col font-sans antialiased bg-neutral-50 text-neutral-900">
        {children}
      </body>
    </html>
  );
}
