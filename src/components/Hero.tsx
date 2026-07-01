import { MapPin } from "lucide-react";
import type { Dictionary } from "@/i18n/dictionaries";

interface HeroProps {
  dict: Dictionary;
}

export function Hero({ dict }: HeroProps) {
  return (
    <header className="pt-2 pb-6">
      <div className="inline-flex items-center gap-1.5 rounded-full bg-neutral-900 px-3 py-1 mb-4">
        <MapPin className="h-3 w-3 text-white" />
        <span className="text-[11px] font-bold uppercase tracking-wider text-white">
          {dict.region.name}, {dict.region.country}
        </span>
      </div>

      <h1 className="text-[2.5rem] sm:text-5xl font-black text-neutral-900 leading-[1.05] tracking-tight">
        {dict.hero.events}
        <br />
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-rose-500 to-pink-500">
          {dict.hero.nearYou}
        </span>
      </h1>

      <p className="mt-3 text-base text-neutral-500 font-medium max-w-sm leading-relaxed">
        {dict.hero.subtitle}{" "}
        <span className="text-neutral-800 font-semibold">
          {dict.hero.subtitleHighlight}
        </span>
        . {dict.hero.subtitleEnd}
      </p>
    </header>
  );
}
