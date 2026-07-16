import Image from "next/image";
import type { VenueAssessment } from "@/lib/types";
import type { Dictionary } from "@/i18n/dictionaries";

interface VenueAssessmentBlockProps {
  assessment: VenueAssessment;
  dict: Dictionary;
  /** Small badge next to the speaker (e.g. event detail: "Venue tip"). */
  heading?: string;
  className?: string;
}

function verdictLabel(dict: Dictionary, key: string): string {
  return dict.venues.assessment.verdicts[key] ?? key;
}

function themeLabel(dict: Dictionary, key: string): string {
  return dict.venues.assessment.themes[key] ?? key;
}

function joinList(items: string[], join: string, and: string): string {
  if (items.length === 0) return "";
  if (items.length === 1) return items[0]!;
  if (items.length === 2) return `${items[0]}${and}${items[1]}`;
  return `${items.slice(0, -1).join(join)}${and}${items[items.length - 1]}`;
}

function formatSources(assessment: VenueAssessment, dict: Dictionary): string {
  const parts: string[] = [];
  // Editorial first (POP judgment), then Google when present
  if (assessment.sources.some((s) => s.kind === "editorial")) {
    parts.push(dict.venues.assessment.editorialSource);
  }
  for (const source of assessment.sources) {
    if (source.kind === "google_places" && source.rating != null) {
      parts.push(
        dict.venues.assessment.googleSource
          .replace("{rating}", source.rating.toFixed(1))
          .replace("{count}", String(countOrDash(source.reviewCount))),
      );
    }
  }
  return parts.join(dict.venues.assessment.sourceJoin);
}

function countOrDash(count: number | undefined): string {
  return count != null ? String(count) : "—";
}

export function VenueAssessmentBlock({
  assessment,
  dict,
  heading,
  className = "mb-6",
}: VenueAssessmentBlockProps) {
  const a = dict.venues.assessment;
  const themes = assessment.themes
    .slice(0, 3)
    .map((t) => themeLabel(dict, t.key));
  const themeLine =
    themes.length > 0
      ? a.themeLead.replace(
          "{themes}",
          joinList(themes, a.themeJoin, a.themeAnd),
        )
      : null;
  const sources = formatSources(assessment, dict);
  const badge = heading ?? a.heading;
  const google = assessment.sources.find((s) => s.kind === "google_places");
  const blended = Boolean(google?.rating != null);

  return (
    <section
      className={className}
      aria-labelledby="venue-assessment-heading"
    >
      <div className="flex gap-3">
        <div className="relative mt-0.5 h-10 w-10 shrink-0 overflow-hidden rounded-full bg-gradient-to-br from-orange-500 via-rose-500 to-fuchsia-500 p-[2px] shadow-sm shadow-rose-500/25">
          <div className="flex h-full w-full items-center justify-center overflow-hidden rounded-full bg-white dark:bg-neutral-950">
            <Image
              src="/pop-home-logo.png"
              alt=""
              width={36}
              height={36}
              unoptimized
              className="h-7 w-7 object-contain"
            />
          </div>
        </div>

        <div className="min-w-0 flex-1">
          <div className="mb-1.5 flex flex-wrap items-center gap-2">
            <h2
              id="venue-assessment-heading"
              className="text-sm font-bold text-neutral-900 dark:text-white"
            >
              {a.speaker}
            </h2>
            <span className="inline-flex items-center rounded-full bg-gradient-to-r from-orange-500 via-rose-500 to-fuchsia-500 px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.14em] text-white">
              {badge}
            </span>
            {blended && google?.rating != null ? (
              <span className="inline-flex items-center rounded-full bg-amber-500/15 px-2 py-0.5 text-[10px] font-bold text-amber-800 ring-1 ring-amber-500/25 dark:bg-amber-400/15 dark:text-amber-200 dark:ring-amber-400/30">
                ★ {google.rating.toFixed(1)}
                {google.reviewCount != null
                  ? ` · ${google.reviewCount}`
                  : ""}
              </span>
            ) : null}
          </div>

          <div className="relative rounded-2xl rounded-tl-md bg-neutral-100 px-3.5 py-3 dark:bg-neutral-800/90">
            <span
              className="absolute -left-1.5 top-3 h-3 w-3 rotate-45 bg-neutral-100 dark:bg-neutral-800/90"
              aria-hidden
            />
            <p className="relative text-[15px] leading-relaxed text-neutral-800 dark:text-neutral-100">
              {verdictLabel(dict, assessment.verdictKey)}
              {themeLine ? (
                <>
                  {" "}
                  <span className="text-neutral-600 dark:text-neutral-300">
                    {themeLine}
                  </span>
                </>
              ) : null}
            </p>
          </div>

          {sources ? (
            <p className="mt-2 text-xs leading-relaxed text-neutral-500 dark:text-neutral-400">
              {a.basedOn.replace("{sources}", sources)}
            </p>
          ) : null}
        </div>
      </div>
    </section>
  );
}
