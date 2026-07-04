"use client";

import { useEffect, useState } from "react";
import { X, CheckCircle } from "lucide-react";
import type { Dictionary } from "@/i18n/dictionaries";
import type { Locale } from "@/i18n/config";
import type { Event, EventCategory, EventFormat, EventRecurrence } from "@/lib/types";
import { CATEGORY_IDS } from "@/lib/categories";
import { getSubmitValidationError } from "@/lib/community-store";
import { MAX_IMAGE_BYTES } from "@/lib/image-data-url";

interface SubmitEventSheetProps {
  open: boolean;
  onClose: () => void;
  dict: Dictionary;
  locale: Locale;
  onSubmitted: (event: Event, pending?: boolean) => void;
  defaults?: {
    location?: string;
    venue?: string;
    category?: EventCategory;
  };
}

export function SubmitEventSheet({
  open,
  onClose,
  dict,
  locale,
  onSubmitted,
  defaults,
}: SubmitEventSheetProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [location, setLocation] = useState("");
  const [venue, setVenue] = useState("");
  const [category, setCategory] = useState<EventCategory>("music");
  const [format, setFormat] = useState<EventFormat>("physical");
  const [recurrence, setRecurrence] = useState<"none" | EventRecurrence>("none");
  const [recurrenceDays, setRecurrenceDays] = useState<number[]>([]);
  const [imageDataUrl, setImageDataUrl] = useState<string | undefined>();
  const [imageName, setImageName] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!open) return;
    if (defaults?.location) setLocation(defaults.location);
    if (defaults?.venue) setVenue(defaults.venue);
    if (defaults?.category) setCategory(defaults.category);
  }, [open, defaults?.location, defaults?.venue, defaults?.category]);

  if (!open) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(false);
    setErrorMessage("");

    const selectedRecurrenceDays =
      recurrence === "weekly"
        ? recurrenceDays.length > 0
          ? recurrenceDays
          : date
            ? [new Date(`${date}T00:00:00`).getDay()]
            : []
        : undefined;

    const payload = {
      title,
      description,
      date,
      time: time || undefined,
      location,
      venue: venue || undefined,
      category,
      format,
      recurrence: recurrence === "none" ? undefined : recurrence,
      recurrenceDays: selectedRecurrenceDays,
      imageDataUrl,
    };

    const validationError = getSubmitValidationError(payload);
    if (validationError) {
      const messages: Record<string, string> = {
        title: dict.submit.validationTitle,
        description: dict.submit.validationDescription,
        date: dict.submit.validationDate,
        location: dict.submit.validationLocation,
        category: dict.submit.error,
        format: dict.submit.error,
        recurrence: dict.submit.error,
        image: dict.submit.validationImage,
        invalid: dict.submit.error,
      };
      setErrorMessage(messages[validationError] ?? dict.submit.error);
      setError(true);
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`/api/submit?locale=${locale}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = (await res.json()) as {
        success?: boolean;
        event?: Event;
        pending?: boolean;
        message?: string;
        error?: string;
      };
      if (!res.ok || !data.success || !data.event) {
        setErrorMessage(data.error ?? dict.submit.error);
        setError(true);
        return;
      }

      setSuccessMessage(data.message ?? dict.submit.success);
      setSuccess(true);
      onSubmitted(data.event, data.pending);
      setTimeout(() => {
        setSuccess(false);
        setSuccessMessage("");
        setTitle("");
        setDescription("");
        setDate("");
        setTime("");
        setLocation("");
        setVenue("");
        setRecurrence("none");
        setRecurrenceDays([]);
        setImageDataUrl(undefined);
        setImageName("");
        onClose();
      }, 1800);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }

  const inputClass =
    "w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3.5 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-200";

  const dayFormatter = new Intl.DateTimeFormat(locale === "en" ? "en-US" : locale === "es" ? "es-DO" : "fr-FR", {
    weekday: "short",
  });
  const weekdays = Array.from({ length: 7 }, (_, day) => ({
    day,
    label: dayFormatter.format(new Date(2026, 0, 4 + day)),
  }));

  function toggleRecurrenceDay(day: number) {
    setRecurrenceDays((days) =>
      days.includes(day) ? days.filter((d) => d !== day) : [...days, day].sort(),
    );
  }

  function handleImageChange(file: File | undefined) {
    setError(false);
    setErrorMessage("");
    if (!file) {
      setImageDataUrl(undefined);
      setImageName("");
      return;
    }
    if (
      file.size > MAX_IMAGE_BYTES ||
      !["image/jpeg", "image/png", "image/webp"].includes(file.type)
    ) {
      setImageDataUrl(undefined);
      setImageName("");
      setErrorMessage(dict.submit.validationImage);
      setError(true);
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result !== "string") {
        setErrorMessage(dict.submit.validationImage);
        setError(true);
        return;
      }
      setImageDataUrl(reader.result);
      setImageName(file.name);
    };
    reader.onerror = () => {
      setErrorMessage(dict.submit.validationImage);
      setError(true);
    };
    reader.readAsDataURL(file);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <button
        type="button"
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
        aria-label={dict.detail.close}
      />
      <div className="relative w-full max-w-lg sm:max-w-2xl bg-white rounded-t-3xl shadow-2xl max-h-[92vh] overflow-y-auto pb-[env(safe-area-inset-bottom)]">
        <div className="sticky top-0 bg-white px-4 pt-5 pb-3 flex justify-between items-start border-b border-neutral-50">
          <div>
            <h2 className="text-xl font-black text-neutral-900">{dict.submit.title}</h2>
            <p className="text-sm text-neutral-500 mt-0.5">{dict.submit.subtitle}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-neutral-100"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {success ? (
          <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
            <CheckCircle className="h-12 w-12 text-green-500 mb-3" />
            <p className="font-bold text-neutral-900">
              {successMessage || dict.submit.success}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-4 space-y-4">
            <label className="block">
              <span className="text-xs font-bold text-neutral-500 uppercase tracking-wide">
                {dict.submit.eventTitle}
              </span>
              <input
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className={`${inputClass} mt-1.5`}
              />
            </label>

            <label className="block">
              <span className="text-xs font-bold text-neutral-500 uppercase tracking-wide">
                {dict.submit.description}
              </span>
              <textarea
                required
                rows={3}
                minLength={10}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className={`${inputClass} mt-1.5 resize-none`}
              />
            </label>

            <div className="grid grid-cols-2 gap-3">
              <label className="block">
                <span className="text-xs font-bold text-neutral-500 uppercase tracking-wide">
                  {dict.submit.date}
                </span>
                <input
                  required
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className={`${inputClass} mt-1.5`}
                />
              </label>
              <label className="block">
                <span className="text-xs font-bold text-neutral-500 uppercase tracking-wide">
                  {dict.submit.time} ({dict.submit.optional})
                </span>
                <input
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  placeholder="7:00 PM"
                  className={`${inputClass} mt-1.5`}
                />
              </label>
            </div>

            <label className="block">
              <span className="text-xs font-bold text-neutral-500 uppercase tracking-wide">
                {dict.submit.location}
              </span>
              <input
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Sosúa, Cabarete…"
                className={`${inputClass} mt-1.5`}
              />
            </label>

            <label className="block">
              <span className="text-xs font-bold text-neutral-500 uppercase tracking-wide">
                {dict.submit.venue} ({dict.submit.optional})
              </span>
              <input
                value={venue}
                onChange={(e) => setVenue(e.target.value)}
                className={`${inputClass} mt-1.5`}
              />
            </label>

            <div className="grid grid-cols-2 gap-3">
              <label className="block">
                <span className="text-xs font-bold text-neutral-500 uppercase tracking-wide">
                  {dict.submit.category}
                </span>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as EventCategory)}
                  className={`${inputClass} mt-1.5`}
                >
                  {CATEGORY_IDS.map((id) => (
                    <option key={id} value={id}>
                      {dict.categories[id]}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block">
                <span className="text-xs font-bold text-neutral-500 uppercase tracking-wide">
                  {dict.submit.format}
                </span>
                <select
                  value={format}
                  onChange={(e) => setFormat(e.target.value as EventFormat)}
                  className={`${inputClass} mt-1.5`}
                >
                  <option value="physical">{dict.events.format.physical}</option>
                  <option value="digital">{dict.events.format.digital}</option>
                  <option value="hybrid">{dict.events.format.hybrid}</option>
                </select>
              </label>
            </div>

            <div className="rounded-2xl border border-neutral-100 bg-neutral-50/70 p-3">
              <label className="block">
                <span className="text-xs font-bold text-neutral-500 uppercase tracking-wide">
                  {dict.submit.recurrence}
                </span>
                <select
                  value={recurrence}
                  onChange={(e) => {
                    const value = e.target.value as "none" | EventRecurrence;
                    setRecurrence(value);
                    if (value !== "weekly") setRecurrenceDays([]);
                  }}
                  className={`${inputClass} mt-1.5 bg-white`}
                >
                  <option value="none">{dict.submit.recurrenceNone}</option>
                  <option value="daily">{dict.events.recurrence.daily}</option>
                  <option value="weekdays">{dict.events.recurrence.weekdays}</option>
                  <option value="weekends">{dict.events.recurrence.weekends}</option>
                  <option value="weekly">{dict.submit.recurrenceWeekly}</option>
                </select>
              </label>

              {recurrence === "weekly" && (
                <div className="mt-3">
                  <p className="text-xs font-bold text-neutral-500 uppercase tracking-wide">
                    {dict.submit.recurrenceDays}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {weekdays.map(({ day, label }) => {
                      const active = recurrenceDays.includes(day);
                      return (
                        <button
                          key={day}
                          type="button"
                          onClick={() => toggleRecurrenceDay(day)}
                          className={`
                            rounded-full px-3 py-1.5 text-xs font-bold transition-colors
                            ${
                              active
                                ? "bg-orange-500 text-white"
                                : "bg-white text-neutral-500 ring-1 ring-neutral-200"
                            }
                          `}
                        >
                          {label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            <label className="block">
              <span className="text-xs font-bold text-neutral-500 uppercase tracking-wide">
                {dict.submit.image} ({dict.submit.optional})
              </span>
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={(e) => handleImageChange(e.target.files?.[0])}
                className="mt-1.5 block w-full text-sm font-medium text-neutral-600 file:mr-3 file:rounded-full file:border-0 file:bg-orange-50 file:px-3 file:py-2 file:text-sm file:font-bold file:text-orange-600"
              />
              <p className="mt-1 text-xs text-neutral-400">
                {imageName || dict.submit.imageHint}
              </p>
              {imageDataUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={imageDataUrl}
                  alt=""
                  className="mt-3 h-28 w-full rounded-2xl object-cover"
                />
              )}
            </label>

            {error && (
              <p className="text-sm text-red-500 font-medium">
                {errorMessage || dict.submit.error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-2xl bg-gradient-to-r from-orange-500 via-rose-500 to-pink-500 text-white py-4 text-sm font-bold shadow-lg disabled:opacity-60"
            >
              {loading ? "…" : dict.submit.button}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
