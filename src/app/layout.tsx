import { Outfit } from "next/font/google";
import Script from "next/script";
import { BootSplashDismiss } from "@/components/BootSplashDismiss";
import { ThemeAutoSync } from "@/components/ThemeAutoSync";
import { ThemeScript } from "@/components/ThemeScript";
import { PageGlow } from "@/components/PageGlow";
import "./globals.css";

/** Geometric grotesque close to GetYourGuide’s GT Eesti — one family for UI + display. */
const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

/** Critical styles so the splash paints before the CSS bundle arrives. */
const bootSplashCriticalCss = `
html.boot-pending #app-boot-splash{pointer-events:auto}
#app-boot-splash{position:fixed;inset:0;z-index:9999;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:1.25rem;background:#fafafa;transition:opacity .2s ease,visibility .2s ease}
html.dark #app-boot-splash{background:#0a0a0a}
#app-boot-splash img{width:7rem;height:auto;object-fit:contain}
#app-boot-splash .boot-spinner{position:relative;width:1.75rem;height:1.75rem;color:#a3a3a3;opacity:0;animation:boot-spinner-show .01s linear .7s forwards}
html.dark #app-boot-splash .boot-spinner{color:#f5f5f5}
#app-boot-splash .boot-spinner i{position:absolute;left:50%;top:0;width:.15rem;height:.45rem;margin-left:-.075rem;border-radius:999px;background:currentColor;transform-origin:50% .875rem;animation:boot-spinner-fade 1.2s linear infinite}
@keyframes boot-spinner-show{to{opacity:1}}
@keyframes boot-spinner-fade{0%,39%,100%{opacity:.15}40%{opacity:1}}
html.boot-splash-done #app-boot-splash{opacity:0;visibility:hidden;pointer-events:none}
@media (prefers-reduced-motion:reduce){
#app-boot-splash{transition:none}
#app-boot-splash .boot-spinner{opacity:1;animation:none}
#app-boot-splash .boot-spinner i{animation:none;opacity:.45}
#app-boot-splash .boot-spinner i:nth-child(1),#app-boot-splash .boot-spinner i:nth-child(2),#app-boot-splash .boot-spinner i:nth-child(12){opacity:1}
}`.replace(/\n/g, "");

/**
 * Failsafe so a hung client never leaves the splash stuck.
 * Only toggles classes on <html> (suppressHydrationWarning) — never mutate
 * #app-boot-splash, or slow networks (3G) race hydration and throw mismatches.
 * Cap is short: SSR content is already painted under the overlay.
 */
const bootSplashFailsafe = `(function(){setTimeout(function(){var root=document.documentElement;if(root.classList.contains("boot-splash-done")){root.classList.remove("boot-pending");return}root.classList.add("boot-splash-done");root.classList.remove("boot-pending")},1400)})()`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`boot-pending ${outfit.variable}`}
    >
      <head>
        <ThemeScript />
        <style dangerouslySetInnerHTML={{ __html: bootSplashCriticalCss }} />
        <link rel="preload" href="/pop-home-logo.png" as="image" />
        {/* Ingested / uploaded event media — warm DNS+TLS before first remote thumb. */}
        <link rel="dns-prefetch" href="https://firebasestorage.googleapis.com" />
        <link
          rel="preconnect"
          href="https://firebasestorage.googleapis.com"
          crossOrigin=""
        />
        <Script id="boot-splash-failsafe" strategy="beforeInteractive">
          {bootSplashFailsafe}
        </Script>
      </head>
      <body className="relative min-h-dvh font-sans antialiased bg-neutral-50 text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100">
        {/* Inline splash: brand first, then spinner — overlay only (shell paints underneath) */}
        <div
          id="app-boot-splash"
          className="app-boot-splash"
          role="status"
          aria-live="polite"
          aria-busy="true"
          suppressHydrationWarning
        >
          {/* eslint-disable-next-line @next/next/no-img-element -- must load before Next/Image hydrates */}
          <img
            src="/pop-home-logo.png"
            alt=""
            width={120}
            height={120}
            decoding="sync"
            fetchPriority="high"
          />
          <span className="sr-only">Loading</span>
          {/* Pure CSS spinner — no JS required (critical on Slow 3G before React) */}
          <div className="boot-spinner" aria-hidden>
            {Array.from({ length: 12 }, (_, i) => (
              <i
                key={i}
                style={{
                  transform: `rotate(${i * 30}deg)`,
                  animationDelay: `${(-1.1 + i * 0.1).toFixed(1)}s`,
                }}
              />
            ))}
          </div>
        </div>
        <BootSplashDismiss />
        <ThemeAutoSync />
        <div
          className="pointer-events-none fixed inset-0 z-0 hidden overflow-hidden dark:block"
          aria-hidden
        >
          <PageGlow />
        </div>
        <div id="app-shell" className="relative z-10">
          {children}
        </div>
      </body>
    </html>
  );
}
