import {
  THEME_DARK_END_HOUR,
  THEME_DARK_START_HOUR,
  THEME_STORAGE_KEY,
} from "@/lib/theme";
import { APP_TIMEZONE } from "@/lib/event-dates";

export function ThemeScript() {
  // Keep in sync with themeFromTimeOfDay() — runs before paint to avoid FOUC.
  const script = `(function(){try{var k="${THEME_STORAGE_KEY}";var t=localStorage.getItem(k);if(t==="light")return;if(t==="dark"){document.documentElement.classList.add("dark");return;}var p=new Intl.DateTimeFormat("en-US",{timeZone:"${APP_TIMEZONE}",hour:"numeric",hourCycle:"h23"}).formatToParts(new Date());var h=Number((p.find(function(x){return x.type==="hour"})||{}).value||0);if(h>=${THEME_DARK_START_HOUR}||h<${THEME_DARK_END_HOUR})document.documentElement.classList.add("dark")}catch(e){}})()`;

  return (
    <script
      dangerouslySetInnerHTML={{ __html: script }}
    />
  );
}
