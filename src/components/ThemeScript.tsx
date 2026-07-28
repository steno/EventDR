import Script from "next/script";
import { THEME_STORAGE_KEY, THEME_SYSTEM_QUERY } from "@/lib/theme";

export function ThemeScript() {
  // Keep in sync with themeFromSystem() — runs before paint to avoid FOUC.
  const script = `(function(){try{var k="${THEME_STORAGE_KEY}";var t=localStorage.getItem(k);if(t==="light")return;if(t==="dark"){document.documentElement.classList.add("dark");return;}if(window.matchMedia("${THEME_SYSTEM_QUERY}").matches)document.documentElement.classList.add("dark")}catch(e){}})()`;

  return (
    <Script id="theme-init" strategy="beforeInteractive">
      {script}
    </Script>
  );
}
