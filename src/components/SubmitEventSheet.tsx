"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import type { Dictionary } from "@/i18n/dictionaries";
import type { Locale } from "@/i18n/config";
import type { Event, EventCategory, EventFormat, EventRecurrence } from "@/lib/types";
import { getSubmitValidationError, type SubmitAdmissionKind } from "@/lib/community-store";
import { resetInputZoom } from "@/lib/reset-input-zoom";
import { eventDetailPath } from "@/lib/event-navigation";
import { getOnboardingCopy } from "@/lib/onboarding";
import { SubmitEventSuccess } from "@/components/submit-event/SubmitEventSuccess";
import { SubmitEventFormSteps } from "@/components/submit-event/SubmitEventFormSteps";

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
            <h2 className="text-section font-extrabold text-neutral-900 dark:text-neutral-100">{dict.submit.title}</h2>
            <p className="mt-0.5 text-copy text-neutral-500 dark:text-neutral-400">{dict.submit.subtitle}</p>
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
          <SubmitEventSuccess
            onboardingCopy={onboardingCopy}
            successMessage={successMessage}
            dict={dict}
            submittedPending={submittedPending}
            submittedPath={submittedPath}
            copied={copied}
            onShare={shareSubmittedEvent}
            onCopy={copySubmittedLink}
            onDone={handleClose}
          />
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
            <SubmitEventFormSteps
              step={step}
              locale={locale}
              dict={dict}
              onboardingCopy={onboardingCopy}
              title={title}
              setTitle={setTitle}
              description={description}
              setDescription={setDescription}
              date={date}
              setDate={setDate}
              time={time}
              setTime={setTime}
              location={location}
              setLocation={setLocation}
              venue={venue}
              setVenue={setVenue}
              category={category}
              setCategory={setCategory}
              format={format}
              setFormat={setFormat}
              recurrence={recurrence}
              setRecurrence={setRecurrence}
              recurrenceDays={recurrenceDays}
              setRecurrenceDays={setRecurrenceDays}
              admissionKind={admissionKind}
              setAdmissionKind={setAdmissionKind}
              admissionPrice={admissionPrice}
              setAdmissionPrice={setAdmissionPrice}
              ticketUrl={ticketUrl}
              setTicketUrl={setTicketUrl}
              imageDataUrl={imageDataUrl}
              setImageDataUrl={setImageDataUrl}
              imageName={imageName}
              setImageName={setImageName}
              error={error}
              errorMessage={errorMessage}
              setError={setError}
              setErrorMessage={setErrorMessage}
              loading={loading}
              onBack={() => {
                setError(false);
                setStep((current) => current - 1);
              }}
              onNext={goToNextStep}
              onExtras={goToExtras}
            />
          </form>
        )}
      </div>
    </div>
  );
}
