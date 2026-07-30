"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import Script from "next/script";

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

declare global {
  interface Window {
    gtag?: (
      command: string,
      targetId: string,
      config?: Record<string, unknown>
    ) => void;
  }
}

function sendPageView(path: string) {
  if (!GA_MEASUREMENT_ID || typeof window.gtag === "undefined") return false;

  // GA4 attributes path from page_location. page_path alone (UA-era) is ignored,
  // which collapsed every client-side navigation onto the first landing URL.
  window.gtag("event", "page_view", {
    page_title: document.title,
    page_location: `${window.location.origin}${path}`,
    page_path: path,
  });
  return true;
}

export function Analytics() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const query = searchParams?.toString() ?? "";

  useEffect(() => {
    if (!GA_MEASUREMENT_ID) return;

    const path = pathname + (query ? `?${query}` : "");

    // Title often updates a tick after the route; wait briefly so page_title is right.
    // Also wait for lazyOnload gtag to appear before the first hit.
    let cancelled = false;
    let tries = 0;
    const timer = window.setInterval(() => {
      if (cancelled) return;
      tries += 1;
      if (sendPageView(path) || tries >= 50) {
        window.clearInterval(timer);
      }
    }, 100);

    return () => {
      cancelled = true;
      window.clearInterval(timer);
    };
  }, [pathname, query]);

  if (!GA_MEASUREMENT_ID) {
    return null;
  }

  return (
    <>
      <Script
        strategy="lazyOnload"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
      />
      <Script
        id="google-analytics"
        strategy="lazyOnload"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}', {
              send_page_view: false,
            });
          `,
        }}
      />
    </>
  );
}
