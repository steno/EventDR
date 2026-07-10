import { Suspense } from "react";
import { notFound } from "next/navigation";
import { isValidLocale, locales } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { SITE_URL } from "@/lib/site-url";
import { SITE_NAME, defaultOpenGraph, defaultTwitter } from "@/lib/seo";
import { Analytics } from "@/components/Analytics";
import { AppVersionBanner } from "@/components/AppVersionBanner";
import { DocumentLang } from "@/components/DocumentLang";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const validLocale = isValidLocale(locale) ? locale : "en";
  const dict = getDictionary(validLocale);
  
  const googleVerification = process.env.GOOGLE_SITE_VERIFICATION;

  return {
    metadataBase: new URL(SITE_URL),
    ...(googleVerification
      ? { verification: { google: googleVerification } }
      : {}),
    title: {
      default: SITE_NAME,
    },
    description: dict.meta.description,
    openGraph: defaultOpenGraph(validLocale),
    twitter: defaultTwitter(),
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true },
    },
    manifest: "/manifest.webmanifest",
    appleWebApp: {
      capable: true,
      statusBarStyle: "default",
      title: "POP Events",
    },
    icons: {
      icon: [
        { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
        { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
      ],
      apple: "/icons/icon-192.png",
    },
    other: {
      "mobile-web-app-capable": "yes",
    },
  };
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

  const dict = getDictionary(locale);

  return (
    <>
      <DocumentLang locale={locale} />
      <Suspense fallback={null}>
        <Analytics />
      </Suspense>
      <AppVersionBanner dict={dict} />
      {children}
    </>
  );
}
