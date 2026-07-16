import Image from "next/image";
import { User } from "lucide-react";
import type { EventOpinion, PriceFeel } from "@/lib/types";
import type { Dictionary } from "@/i18n/dictionaries";
import type { Locale } from "@/i18n/config";
import {
  resolveEventOpinionBody,
  resolveEventOpinionPriceNote,
} from "@/lib/event-opinions";

interface EventOpinionBlockProps {
  opinion: EventOpinion;
  dict: Dictionary;
  locale: Locale;
  className?: string;
}

function priceFeelLabel(dict: Dictionary, feel: PriceFeel): string {
  return dict.detail.opinion.priceFeel[feel] ?? feel;
}

/** Fallback when seeds only have a text ratingCite. */
function parseRatingCite(
  cite: string | undefined,
): { rating: number; count?: number } | null {
  if (!cite) return null;
  const ratingMatch = cite.match(/(\d+(?:\.\d+)?)/);
  if (!ratingMatch) return null;
  const rating = Number(ratingMatch[1]);
  if (!Number.isFinite(rating) || rating < 1 || rating > 5) return null;
  const countMatch = cite.match(
    /(\d[\d,]*)\s*(?:reviews?|reseñas?|avis|·)/i,
  );
  // Prefer "4.4 · 1599" or "4.4 · 1599 reviews"
  const dotCount = cite.match(/·\s*(\d[\d,]*)/);
  const raw = dotCount?.[1] ?? countMatch?.[1];
  const count = raw ? Number(raw.replace(/,/g, "")) : undefined;
  return {
    rating,
    ...(count != null && Number.isFinite(count) ? { count } : {}),
  };
}

function resolveGoogleRating(
  opinion: EventOpinion,
): { rating: number; count?: number } | null {
  if (
    typeof opinion.googleRating === "number" &&
    Number.isFinite(opinion.googleRating)
  ) {
    return {
      rating: opinion.googleRating,
      ...(typeof opinion.googleReviewCount === "number"
        ? { count: opinion.googleReviewCount }
        : {}),
    };
  }
  return parseRatingCite(opinion.ratingCite);
}

/**
 * Same visual language as VenueAssessmentBlock — POP avatar, tip bubble, ★ chip.
 */
export function EventOpinionBlock({
  opinion,
  dict,
  locale,
  className = "mt-5 mb-1",
}: EventOpinionBlockProps) {
  const o = dict.detail.opinion;
  const body = resolveEventOpinionBody(opinion, locale);
  const priceNote = resolveEventOpinionPriceNote(opinion, locale);
  const rating = resolveGoogleRating(opinion);
  // ★ chip already shows the numbers — footer only names sources (keep "Google").
  const citeParts = [opinion.attribution?.trim()].filter(Boolean) as string[];
  const mentionsGoogle = citeParts.some((p) => /google/i.test(p));
  if (
    !mentionsGoogle &&
    (rating || /google/i.test(opinion.ratingCite ?? ""))
  ) {
    citeParts.push("Google");
  } else if (
    !rating &&
    opinion.ratingCite?.trim() &&
    !/google/i.test(opinion.ratingCite)
  ) {
    citeParts.push(opinion.ratingCite.trim());
  }
  const cite = citeParts.join(o.sourceJoin);

  return (
    <section className={className} aria-labelledby="event-opinion-heading">
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
              id="event-opinion-heading"
              className="text-sm font-bold text-neutral-900 dark:text-white"
            >
              {o.speaker}
            </h2>
            <span className="inline-flex items-center rounded-full bg-gradient-to-r from-orange-500 via-rose-500 to-fuchsia-500 px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.14em] text-white">
              {o.heading}
            </span>
            {rating ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/15 px-2 py-0.5 text-[10px] font-bold text-amber-800 ring-1 ring-amber-500/25 dark:bg-amber-400/15 dark:text-amber-200 dark:ring-amber-400/30">
                <span aria-hidden>★</span>
                <span>{rating.rating.toFixed(1)}</span>
                {rating.count != null ? (
                  <>
                    <span aria-hidden>·</span>
                    <User className="h-3 w-3" aria-hidden strokeWidth={2.5} />
                    <span>{rating.count}</span>
                  </>
                ) : null}
              </span>
            ) : null}
          </div>

          <div className="relative rounded-2xl rounded-tl-md bg-neutral-100 px-3.5 py-3 dark:bg-neutral-800/90">
            <span
              className="absolute -left-1.5 top-3 h-3 w-3 rotate-45 bg-neutral-100 dark:bg-neutral-800/90"
              aria-hidden
            />
            <div className="relative space-y-2.5">
              <p className="text-[15px] leading-relaxed text-neutral-800 dark:text-neutral-100">
                {body}
              </p>
              {opinion.priceFeel || priceNote ? (
                <ul className="space-y-1.5 border-t border-neutral-200/80 pt-2.5 dark:border-neutral-700/80">
                  {opinion.priceFeel ? (
                    <li className="flex gap-2 text-[13px] leading-snug text-neutral-700 dark:text-neutral-300">
                      <span
                        className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gradient-to-br from-orange-500 to-rose-500"
                        aria-hidden
                      />
                      <span>
                        <span className="font-semibold text-neutral-800 dark:text-neutral-200">
                          {o.priceLabel}
                        </span>
                        <span className="text-neutral-500 dark:text-neutral-400">
                          {o.priceSep}
                        </span>
                        {priceFeelLabel(dict, opinion.priceFeel)}
                      </span>
                    </li>
                  ) : null}
                  {priceNote ? (
                    <li className="flex gap-2 text-[13px] leading-snug text-neutral-600 dark:text-neutral-400">
                      <span
                        className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-neutral-400/80 dark:bg-neutral-500"
                        aria-hidden
                      />
                      <span>{priceNote}</span>
                    </li>
                  ) : null}
                </ul>
              ) : null}
            </div>
          </div>

          {cite ? (
            <p className="mt-2 text-xs leading-relaxed text-neutral-500 dark:text-neutral-400">
              {o.basedOn.replace("{sources}", cite)}
            </p>
          ) : null}
        </div>
      </div>
    </section>
  );
}
