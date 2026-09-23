import Script from "next/script";
import { THEME_STORAGE_KEY } from "@/lib/theme";

export function ThemeScript() {
  // Keep in sync with resolveTheme() — runs before paint to avoid FOUC.
  // Default light; only add dark when the user saved dark.
  const script = `(function(){try{var k="${THEME_STORAGE_KEY}";var t=localStorage.getItem(k);if(t==="dark"){document.documentElement.classList.add("dark");return;}document.documentElement.classList.remove("dark")}catch(e){document.documentElement.classList.remove("dark")}})()`;

  return (
    <Script id="theme-init" strategy="beforeInteractive">
      {script}
    </Script>
  );
}
