"use client";

import { useEffect, useState } from "react";
import { X, CheckCircle, Copy, Share2 } from "lucide-react";
import type { Dictionary } from "@/i18n/dictionaries";
import type { Locale } from "@/i18n/config";
import type { Event, EventCategory, EventFormat, EventRecurrence } from "@/lib/types";
import { CATEGORY_IDS } from "@/lib/categories";
import { getSubmitValidationError, type SubmitAdmissionKind } from "@/lib/community-store";
import { isAcceptedImageFile, parseImageDataUrl } from "@/lib/image-data-url";
import { resetInputZoom } from "@/lib/reset-input-zoom";
import { eventDetailPath } from "@/lib/event-navigation";
import { getOnboardingCopy } from "@/lib/onboarding";

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
  const [admissionKind, setAdmissionKind] = useState<SubmitAdmissionKind>("");
  const [admissionPrice, setAdmissionPrice] = useState("");
  const [ticketUrl, setTicketUrl] = useState("");
  const [imageDataUrl, setImageDataUrl] = useState<string | undefined>();
  const [imageName, setImageName] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [submittedEvent, setSubmittedEvent] = useState<Event | null>(null);
  const [submittedPending, setSubmittedPending] = useState(false);
  const [copied, setCopied] = useState(false);
  const [step, setStep] = useState(0);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const onboardingCopy = getOnboardingCopy(locale).submit;

  useEffect(() => {
    if (!open) return;
    const frame = window.requestAnimationFrame(() => {
      if (defaults?.location) setLocation(defaults.location);
      if (defaults?.venue) setVenue(defaults.venue);
      if (defaults?.category) setCategory(defaults.category);
    });
    return () => window.cancelAnimationFrame(frame);
  }, [open, defaults?.location, defaults?.venue, defaults?.category]);

  function handleClose() {
    resetInputZoom();
    if (success) resetForm();
    onClose();
  }

  if (!open) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    resetInputZoom();
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
      admissionKind,
      admissionPrice: admissionKind === "paid" ? admissionPrice : undefined,
      ticketUrl: admissionKind === "tickets" ? ticketUrl : undefined,
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
        admission: dict.submit.validationAdmission,
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
      setSubmittedEvent(data.event);
      setSubmittedPending(Boolean(data.pending));
      onSubmitted(data.event, data.pending);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }

  function resetForm() {
    setSuccess(false);
    setSuccessMessage("");
    setSubmittedEvent(null);
    setSubmittedPending(false);
    setCopied(false);
    setStep(0);
    setTitle("");
    setDescription("");
    setDate("");
    setTime("");
    setLocation("");
    setVenue("");
    setCategory("music");
    setFormat("physical");
    setRecurrence("none");
    setRecurrenceDays([]);
    setAdmissionKind("");
    setAdmissionPrice("");
    setTicketUrl("");
    setImageDataUrl(undefined);
    setImageName("");
    setError(false);
    setErrorMessage("");
  }

  function goToNextStep() {
    setError(false);
    if (!title.trim()) {
      setErrorMessage(dict.submit.validationTitle);
      setError(true);
      return;
    }
    if (!date) {
      setErrorMessage(dict.submit.validationDate);
      setError(true);
      return;
    }
    if (!location.trim()) {
      setErrorMessage(dict.submit.validationLocation);
      setError(true);
      return;
    }
    setStep(1);
  }

  function goToExtras() {
    setError(false);
    if (description.trim().length < 10) {
      setErrorMessage(dict.submit.validationDescription);
      setError(true);
      return;
    }
    setStep(2);
  }

  const submittedPath = submittedEvent
    ? eventDetailPath(locale, submittedEvent.id)
    : null;

  async function copySubmittedLink() {
    if (!submittedPath) return;
    await navigator.clipboard.writeText(new URL(submittedPath, window.location.origin).toString());
    setCopied(true);
  }

  async function shareSubmittedEvent() {
    if (!submittedPath || !submittedEvent) return;
    const url = new URL(submittedPath, window.location.origin).toString();
    if (navigator.share) {
      await navigator.share({ title: submittedEvent.title, url });
      return;
    }
    await copySubmittedLink();
  }

  // text-base (16px) on mobile prevents iOS Safari focus-zoom; sm:text-sm matches desktop density.
  const inputClass =
    "box-border w-full rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 px-3.5 py-3 text-base leading-normal font-medium text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-200 dark:focus:border-orange-800 sm:text-sm";

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
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <button
        type="button"
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={handleClose}
        aria-label={dict.detail.close}
      />
      <div className="relative flex w-full max-w-lg sm:max-w-2xl max-h-[92dvh] flex-col overflow-hidden rounded-t-3xl bg-white shadow-2xl dark:bg-neutral-900 pb-[env(safe-area-inset-bottom)]">
        <div className="flex shrink-0 items-start justify-between border-b border-neutral-50 bg-white px-4 pt-5 pb-3 dark:border-neutral-800 dark:bg-neutral-900">
          <div>
            <h2 className="text-xl font-black text-neutral-900 dark:text-neutral-100">{dict.submit.title}</h2>
            <p className="mt-0.5 text-base text-neutral-500 dark:text-neutral-400">{dict.submit.subtitle}</p>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-neutral-100 dark:bg-neutral-800"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {success ? (
          <div className="flex min-h-0 flex-1 flex-col items-center justify-center overflow-y-auto px-6 py-12 text-center">
            <CheckCircle className="mb-4 h-14 w-14 text-emerald-500" />
            <h3 className="text-2xl font-black tracking-tight text-neutral-950 dark:text-neutral-50">
              {onboardingCopy.statusTitle}
            </h3>
            <p className="mt-2 max-w-sm text-sm font-medium leading-relaxed text-neutral-500 dark:text-neutral-400">
              {successMessage || dict.submit.success}
            </p>
            <p className="mt-2 max-w-sm text-sm font-bold text-neutral-700 dark:text-neutral-200">
              {submittedPending
                ? onboardingCopy.pendingBody
                : onboardingCopy.liveBody}
            </p>
            {!submittedPending && submittedPath ? (
              <div className="mt-6 grid w-full max-w-sm grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={shareSubmittedEvent}
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-orange-500 via-rose-500 to-pink-500 px-4 text-sm font-bold text-white"
                >
                  <Share2 className="h-4 w-4" aria-hidden />
                  {onboardingCopy.shareListing}
                </button>
                <button
                  type="button"
                  onClick={copySubmittedLink}
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-neutral-200 px-4 text-sm font-bold text-neutral-700 dark:border-neutral-700 dark:text-neutral-200"
                >
                  <Copy className="h-4 w-4" aria-hidden />
                  {copied ? onboardingCopy.copied : onboardingCopy.copyLink}
                </button>
              </div>
            ) : null}
            <button
              type="button"
              onClick={handleClose}
              className="mt-4 min-h-11 rounded-full px-5 text-sm font-bold text-neutral-600 dark:text-neutral-300"
            >
              {onboardingCopy.done}
            </button>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            onBlur={(e) => {
              if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
                resetInputZoom({ blur: false });
              }
            }}
            className="min-h-0 flex-1 space-y-4 overflow-y-auto overscroll-contain p-4 scrollbar-hide"
          >
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
                  onClick={() => {
                    setError(false);
                    setStep((current) => current - 1);
                  }}
                  className="min-h-12 flex-1 rounded-2xl border border-neutral-200 px-4 text-sm font-bold text-neutral-700 dark:border-neutral-700 dark:text-neutral-200"
                >
                  {onboardingCopy.back}
                </button>
              ) : null}
              {step < 2 ? (
                <button
                  type="button"
                  onClick={step === 0 ? goToNextStep : goToExtras}
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
          </form>
        )}
      </div>
    </div>
  );
}
