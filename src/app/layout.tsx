import { Syne, Inter } from "next/font/google";
import { BootSplashDismiss } from "@/components/BootSplashDismiss";
import { ThemeAutoSync } from "@/components/ThemeAutoSync";
import { ThemeScript } from "@/components/ThemeScript";
import { PageGlow } from "@/components/PageGlow";
import "./globals.css";

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  weight: ["700", "800"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

/** Failsafe so a hung client never leaves the splash stuck forever. */
const bootSplashFailsafe = `(function(){setTimeout(function(){var el=document.getElementById("app-boot-splash");if(!el||el.classList.contains("app-boot-splash--done"))return;el.classList.add("app-boot-splash--done");el.setAttribute("aria-hidden","true");el.setAttribute("inert","")},8000)})()`;

/** Critical styles so the splash paints before the CSS bundle arrives. */
const bootSplashCriticalCss = `#app-boot-splash{position:fixed;inset:0;z-index:9999;display:flex;align-items:center;justify-content:center;background:#fafafa;transition:opacity .28s ease,visibility .28s ease}html.dark #app-boot-splash{background:#0a0a0a}#app-boot-splash img{width:7rem;height:auto;object-fit:contain}#app-boot-splash.app-boot-splash--done{opacity:0;visibility:hidden;pointer-events:none}`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${syne.variable} ${inter.variable}`}
    >
      <head>
        <ThemeScript />
        <style dangerouslySetInnerHTML={{ __html: bootSplashCriticalCss }} />
        <link rel="preload" href="/pop-home-logo.png" as="image" />
        <script dangerouslySetInnerHTML={{ __html: bootSplashFailsafe }} />
      </head>
      <body className="relative min-h-dvh font-sans antialiased bg-neutral-50 text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100">
        {/* Inline splash: paints with first HTML, before React/JS chunks load */}
        <div id="app-boot-splash" className="app-boot-splash" aria-hidden="true">
          {/* eslint-disable-next-line @next/next/no-img-element -- must load before Next/Image hydrates */}
          <img
            src="/pop-home-logo.png"
            alt=""
            width={120}
            height={120}
            decoding="async"
            fetchPriority="high"
          />
        </div>
        <BootSplashDismiss />
        <ThemeAutoSync />
        <div
          className="pointer-events-none fixed inset-0 z-0 hidden overflow-hidden dark:block"
          aria-hidden
        >
          <PageGlow />
        </div>
        <div className="relative z-10">
          {children}
        </div>
      </body>
    </html>
  );
}
