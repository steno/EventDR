import { THEME_STORAGE_KEY } from "@/lib/theme";

export function ThemeScript() {
  // Default dark unless the user explicitly chose light.
  const script = `(function(){try{var t=localStorage.getItem("${THEME_STORAGE_KEY}");if(t!=="light"){document.documentElement.classList.add("dark")}}catch(e){document.documentElement.classList.add("dark")}})()`;

  return (
    <script
      dangerouslySetInnerHTML={{ __html: script }}
    />
  );
}
