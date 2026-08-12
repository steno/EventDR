"use client";

import type { Dictionary } from "@/i18n/dictionaries";
import type { Locale } from "@/i18n/config";
import type { EventCategory, EventFormat, EventRecurrence } from "@/lib/types";
import { CATEGORY_IDS } from "@/lib/categories";
import type { SubmitAdmissionKind } from "@/lib/community-store";
import { isAcceptedImageFile, parseImageDataUrl } from "@/lib/image-data-url";
import type { getOnboardingCopy } from "@/lib/onboarding";

type SubmitOnboardingCopy = ReturnType<typeof getOnboardingCopy>["submit"];

// text-base (16px) on mobile prevents iOS Safari focus-zoom; sm:text-sm matches desktop density.
const inputClass =
  "box-border w-full rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 px-3.5 py-3 text-base leading-normal font-medium text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-200 dark:focus:border-orange-800 sm:text-sm";

export interface SubmitEventFormStepsProps {
  step: number;
  locale: Locale;
  dict: Dictionary;
  onboardingCopy: SubmitOnboardingCopy;
  title: string;
  setTitle: (value: string) => void;
  description: string;
  setDescription: (value: string) => void;
  date: string;
  setDate: (value: string) => void;
  time: string;
  setTime: (value: string) => void;
  location: string;
  setLocation: (value: string) => void;
  venue: string;
  setVenue: (value: string) => void;
  category: EventCategory;
  setCategory: (value: EventCategory) => void;
  format: EventFormat;
  setFormat: (value: EventFormat) => void;
  recurrence: "none" | EventRecurrence;
  setRecurrence: (value: "none" | EventRecurrence) => void;
  recurrenceDays: number[];
  setRecurrenceDays: (value: number[] | ((days: number[]) => number[])) => void;
  admissionKind: SubmitAdmissionKind;
  setAdmissionKind: (value: SubmitAdmissionKind) => void;
  admissionPrice: string;
  setAdmissionPrice: (value: string) => void;
  ticketUrl: string;
  setTicketUrl: (value: string) => void;
  imageDataUrl: string | undefined;
  setImageDataUrl: (value: string | undefined) => void;
  imageName: string;
  setImageName: (value: string) => void;
  error: boolean;
  errorMessage: string;
  setError: (value: boolean) => void;
  setErrorMessage: (value: string) => void;
  loading: boolean;
  onBack: () => void;
  onNext: () => void;
  onExtras: () => void;
}

export function SubmitEventFormSteps({
  step,
  locale,
  dict,
  onboardingCopy,
  title,
  setTitle,
  description,
  setDescription,
  date,
  setDate,
  time,
  setTime,
  location,
  setLocation,
  venue,
  setVenue,
  category,
  setCategory,
  format,
  setFormat,
  recurrence,
  setRecurrence,
  recurrenceDays,
  setRecurrenceDays,
  admissionKind,
  setAdmissionKind,
  admissionPrice,
  setAdmissionPrice,
  ticketUrl,
  setTicketUrl,
  imageDataUrl,
  setImageDataUrl,
  imageName,
  setImageName,
  error,
  errorMessage,
  setError,
  setErrorMessage,
  loading,
  onBack,
  onNext,
  onExtras,
}: SubmitEventFormStepsProps) {
  const dayFormatter = new Intl.DateTimeFormat(
    locale === "en" ? "en-US" : locale === "es" ? "es-DO" : "fr-FR",
    { weekday: "short" },
  );
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
    if (!isAcceptedImageFile(file)) {
      setImageDataUrl(undefined);
      setImageName("");
      setErrorMessage(dict.submit.validationImage);
      setError(true);
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result !== "string" || !parseImageDataUrl(reader.result)) {
        setImageDataUrl(undefined);
        setImageName("");
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
    <>
      <div>
        <div
          className="grid grid-cols-3 gap-1.5"
          role="progressbar"
          aria-valuemin={1}
          aria-valuemax={3}
          aria-valuenow={step + 1}
          aria-label={`${step + 1} / 3`}
        >
          {[0, 1, 2].map((index) => (
            <div
              key={index}
              className={`h-1.5 rounded-full ${
                index <= step
                  ? "bg-gradient-to-r from-orange-500 to-rose-500"
                  : "bg-neutral-200 dark:bg-neutral-700"
              }`}
            />
          ))}
        </div>
        <p className="mt-3 text-sm text-neutral-500 dark:text-neutral-400">
          {step === 0
            ? onboardingCopy.essentialsHint
            : step === 1
              ? onboardingCopy.detailsHint
              : onboardingCopy.extrasHint}
        </p>
      </div>

      {step === 0 ? (
        <>
          <label className="block">
            <span className="text-xs font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wide">
              {dict.submit.eventTitle}
            </span>
            <input
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={`${inputClass} mt-1.5`}
            />
          </label>
        </>
      ) : null}

      {step === 1 ? (
        <label className="block">
          <span className="text-xs font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wide">
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
      ) : null}

      {step === 0 ? (
        <>
          <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)] items-end gap-2.5">
            <label className="block min-w-0 overflow-hidden">
              <span className="text-xs font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wide">
                {dict.submit.date}
              </span>
              <input
                required
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className={`${inputClass} mt-1.5 h-12 min-w-0 max-w-full appearance-none px-3 [&::-webkit-date-and-time-value]:min-h-[1.25rem] [&::-webkit-date-and-time-value]:text-left`}
              />
            </label>
            <label className="block min-w-0 overflow-hidden">
              <span className="text-xs font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wide">
                {dict.submit.time} ({dict.submit.optional})
              </span>
              <input
                value={time}
                onChange={(e) => setTime(e.target.value)}
                placeholder="7:00 PM"
                inputMode="text"
                enterKeyHint="done"
                autoComplete="off"
                className={`${inputClass} mt-1.5 h-12 min-w-0 max-w-full px-3`}
              />
            </label>
          </div>

          <label className="block">
            <span className="text-xs font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wide">
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
        </>
      ) : null}

      {step === 1 ? (
        <label className="block">
          <span className="text-xs font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wide">
            {dict.submit.venue} ({dict.submit.optional})
          </span>
          <input
            value={venue}
            onChange={(e) => setVenue(e.target.value)}
            className={`${inputClass} mt-1.5`}
          />
        </label>
      ) : null}

      {step === 0 ? (
        <div className="grid grid-cols-2 gap-3">
          <label className="block">
            <span className="text-xs font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wide">
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
            <span className="text-xs font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wide">
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
      ) : null}

      {step === 2 ? (
        <div className="rounded-2xl border border-neutral-100 dark:border-neutral-800 bg-neutral-50/70 dark:bg-neutral-800/50 p-3">
          <label className="block">
            <span className="text-xs font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wide">
              {dict.submit.recurrence}
            </span>
            <select
              value={recurrence}
              onChange={(e) => {
                const value = e.target.value as "none" | EventRecurrence;
                setRecurrence(value);
                if (value !== "weekly") setRecurrenceDays([]);
              }}
              className={`${inputClass} mt-1.5 bg-white dark:bg-neutral-900`}
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
                                : "bg-white dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 ring-1 ring-neutral-200 dark:ring-neutral-700"
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
      ) : null}

      {step === 2 ? (
        <div className="rounded-2xl border border-neutral-100 dark:border-neutral-800 bg-neutral-50/70 dark:bg-neutral-800/50 p-3">
          <label className="block">
            <span className="text-xs font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wide">
              {dict.submit.admission} ({dict.submit.optional})
            </span>
            <select
              value={admissionKind}
              onChange={(e) => {
                const value = e.target.value as SubmitAdmissionKind;
                setAdmissionKind(value);
                if (value !== "paid") setAdmissionPrice("");
                if (value !== "tickets") setTicketUrl("");
              }}
              className={`${inputClass} mt-1.5 bg-white dark:bg-neutral-900`}
            >
              <option value="">{dict.submit.admissionUnspecified}</option>
              <option value="free">{dict.submit.admissionFree}</option>
              <option value="paid">{dict.submit.admissionPaid}</option>
              <option value="tickets">{dict.submit.admissionTickets}</option>
            </select>
          </label>

          {admissionKind === "paid" && (
            <label className="mt-3 block">
              <span className="text-xs font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wide">
                {dict.submit.admissionPrice}
              </span>
              <input
                required
                value={admissionPrice}
                onChange={(e) => setAdmissionPrice(e.target.value)}
                placeholder={dict.submit.admissionPriceHint}
                className={`${inputClass} mt-1.5 bg-white dark:bg-neutral-900`}
              />
            </label>
          )}

          {admissionKind === "tickets" && (
            <label className="mt-3 block">
              <span className="text-xs font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wide">
                {dict.submit.admissionTicketUrl}
              </span>
              <input
                required
                type="url"
                value={ticketUrl}
                onChange={(e) => setTicketUrl(e.target.value)}
                placeholder="https://tix.do/event/..."
                className={`${inputClass} mt-1.5 bg-white dark:bg-neutral-900`}
              />
            </label>
          )}
        </div>
      ) : null}

      {step === 1 ? (
        <label className="block">
          <span className="text-xs font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wide">
            {dict.submit.image} ({dict.submit.optional})
          </span>
          <input
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/webp,image/x-png,.jpg,.jpeg,.png,.webp"
            onChange={(e) => handleImageChange(e.target.files?.[0])}
            className="mt-1.5 block w-full text-sm font-medium text-neutral-600 dark:text-neutral-400 file:mr-3 file:rounded-full file:border-0 file:bg-orange-50 dark:file:bg-orange-950/50 file:px-3 file:py-2 file:text-sm file:font-bold file:text-orange-600"
          />
          <p className="mt-1 text-xs text-neutral-400 dark:text-neutral-500">
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
      ) : null}

      {error && (
        <p className="text-sm text-red-500 font-medium">
          {errorMessage || dict.submit.error}
        </p>
      )}

      <div className="flex gap-2.5">
        {step > 0 ? (
          <button
            type="button"
            onClick={onBack}
            className="min-h-12 flex-1 rounded-2xl border border-neutral-200 px-4 text-sm font-bold text-neutral-700 dark:border-neutral-700 dark:text-neutral-200"
          >
            {onboardingCopy.back}
          </button>
        ) : null}
        {step < 2 ? (
          <button
            type="button"
            onClick={step === 0 ? onNext : onExtras}
            className="min-h-12 flex-[2] rounded-2xl bg-gradient-to-r from-orange-500 via-rose-500 to-pink-500 px-4 text-sm font-bold text-white"
          >
            {onboardingCopy.next}
          </button>
        ) : (
          <button
            type="submit"
            disabled={loading}
            className="min-h-12 flex-[2] rounded-2xl bg-gradient-to-r from-orange-500 via-rose-500 to-pink-500 px-4 text-sm font-bold text-white disabled:opacity-60"
          >
            {loading ? "…" : dict.submit.button}
          </button>
        )}
      </div>
    </>
  );
}
