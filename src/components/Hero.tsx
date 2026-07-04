import type { Dictionary } from "@/i18n/dictionaries";

interface HeroProps {
  dict: Dictionary;
  onAddEvent: () => void;
}

export function Hero({ dict, onAddEvent }: HeroProps) {
  return (
    <header className="pb-4">
      <div className="sm:flex sm:items-start sm:justify-between sm:gap-6">
        <h1 className="text-[2.35rem] sm:text-5xl font-black text-neutral-950 leading-[1.02] tracking-tight">
          {dict.hero.events}
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-rose-500 to-fuchsia-500">
            {dict.hero.nearYou}
          </span>
        </h1>

        <button
          type="button"
          onClick={onAddEvent}
          className="
            mt-5 inline-flex shrink-0 items-center justify-center rounded-full
            bg-gradient-to-r from-orange-500 via-rose-500 to-fuchsia-500
            px-5 py-3 text-sm font-black text-white shadow-[0_14px_30px_-14px_rgba(244,63,94,0.8)]
            transition-transform active:scale-95 sm:mt-1
          "
        >
          {dict.hero.cta}
        </button>
      </div>

      <p className="mt-3 text-[15px] text-neutral-500 font-medium leading-relaxed sm:max-w-none sm:whitespace-nowrap">
        {dict.hero.subtitle}{" "}
        <span className="text-neutral-800 font-semibold">
          {dict.hero.subtitleHighlight}
        </span>
        . {dict.hero.subtitleEnd}
      </p>
    </header>
  );
}
