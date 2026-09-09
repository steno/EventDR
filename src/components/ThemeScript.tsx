import Script from "next/script";
import { THEME_STORAGE_KEY } from "@/lib/theme";

export function ThemeScript() {
  // Keep in sync with resolveTheme() — runs before paint to avoid FOUC.
  // Default dark; only skip (or remove) dark when the user saved light.
  const script = `(function(){try{var k="${THEME_STORAGE_KEY}";var t=localStorage.getItem(k);if(t==="light"){document.documentElement.classList.remove("dark");return;}document.documentElement.classList.add("dark")}catch(e){document.documentElement.classList.add("dark")}})()`;

  return (
    <Script id="theme-init" strategy="beforeInteractive">
      {script}
    </Script>
  );
}
