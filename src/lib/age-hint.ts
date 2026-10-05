import type { AgeHint } from "@/lib/types";

const AGE_HINTS = new Set<AgeHint>([
  "all-ages",
  "family",
  "18-plus",
  "21-plus",
]);

/** Accept only known age-hint enums; ignore unknown / empty values. */
export function normalizeAgeHint(value: unknown): AgeHint | undefined {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  if (!trimmed) return undefined;
  return AGE_HINTS.has(trimmed as AgeHint) ? (trimmed as AgeHint) : undefined;
}

export function isAgeHint(value: unknown): value is AgeHint {
  return normalizeAgeHint(value) != null;
}
