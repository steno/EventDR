import { THEME_MOBILE_QUERY, THEME_STORAGE_KEY } from "@/lib/theme";

export function ThemeScript() {
  // Keep in sync with themeFromViewport() — runs before paint to avoid FOUC.
  const script = `(function(){try{var k="${THEME_STORAGE_KEY}";var t=localStorage.getItem(k);if(t==="light")return;if(t==="dark"){document.documentElement.classList.add("dark");return;}if(window.matchMedia("${THEME_MOBILE_QUERY}").matches)document.documentElement.classList.add("dark")}catch(e){}})()`;

  return (
    <script
      dangerouslySetInnerHTML={{ __html: script }}
    />
  );
}
