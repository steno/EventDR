import type { Dictionary } from "@/i18n/dictionaries";

interface HeroProps {
  dict: Dictionary;
  onAddEvent: () => void;
}

export function Hero({ dict, onAddEvent }: HeroProps) {
  return (
    <header className="pb-4">
      <div className="sm:flex sm:items-start sm:justify-between sm:gap-6">
        <h1 className="text-display sm:text-display-lg font-extrabold tracking-tight text-neutral-950 dark:text-neutral-50">
          {dict.hero.events}
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-rose-500 to-fuchsia-500">
            {dict.hero.regionSuffix
              ? `${dict.hero.nearYou} ${dict.hero.regionSuffix}`
              : dict.hero.nearYou}
          </span>
        </h1>

        <button
          type="button"
          onClick={onAddEvent}
          className="
            hidden sm:inline-flex shrink-0 items-center justify-center rounded-full
            bg-gradient-to-r from-orange-500 via-rose-500 to-fuchsia-500
            px-6 py-3.5 text-sm font-bold text-white shadow-[0_14px_30px_-14px_rgba(244,63,94,0.8)]
            transition-transform active:scale-95 sm:mt-1 touch-manipulation
          "
        >
          {dict.hero.cta}
        </button>
      </div>

      <p className="mt-4 text-copy-lead sm:max-w-none sm:whitespace-nowrap">
        {dict.hero.regionTagline}
      </p>
    </header>
  );
}
