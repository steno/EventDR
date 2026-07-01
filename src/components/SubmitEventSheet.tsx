"use client";

import { useEffect, useState } from "react";
import { X, CheckCircle } from "lucide-react";
import type { Dictionary } from "@/i18n/dictionaries";
import type { Locale } from "@/i18n/config";
import type { Event, EventCategory, EventFormat } from "@/lib/types";
import { CATEGORY_IDS } from "@/lib/categories";
import { getSubmitValidationError } from "@/lib/community-store";

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
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!open || !defaults) return;
    if (defaults.location) setLocation(defaults.location);
    if (defaults.venue) setVenue(defaults.venue);
    if (defaults.category) setCategory(defaults.category);
  }, [open, defaults]);

  if (!open) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(false);
    setErrorMessage("");

    const payload = {
      title,
      description,
      date,
      time: time || undefined,
      location,
      venue: venue || undefined,
      category,
      format,
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
