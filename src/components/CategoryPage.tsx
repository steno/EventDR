"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { Event, EventCategory } from "@/lib/types";
import type { Dictionary } from "@/i18n/dictionaries";
import type { Locale } from "@/i18n/config";
import { getCategoryMeta } from "@/lib/categories";
import { EventDetailSheet } from "@/components/EventDetailSheet";
import { FilteredEventList } from "@/components/FilteredEventList";
import { SubmitEventSheet } from "@/components/SubmitEventSheet";
import { AppHeader } from "@/components/AppHeader";
import { useSavedEvents } from "@/hooks/useSavedEvents";

interface CategoryPageProps {
  categoryId: EventCategory;
  locale: Locale;
  dict: Dictionary;
}

export function CategoryPage({ categoryId, locale, dict }: CategoryPageProps) {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Event | null>(null);
  const [submitOpen, setSubmitOpen] = useState(false);
  const { toggleSave, isSaved } = useSavedEvents();

  const category = getCategoryMeta(categoryId, dict.categories);

  useEffect(() => {
    fetch(`/api/events?locale=${locale}&category=${categoryId}`)
      .then((r) => r.json())
      .then((d: { events?: Event[] }) => setEvents(d.events ?? []))
      .catch(() => setEvents([]))
      .finally(() => setLoading(false));
  }, [locale, categoryId]);

  return (
    <>
      <main className="flex-1 bg-neutral-50 min-h-screen pb-12">
        <div className="mx-auto max-w-lg sm:max-w-2xl px-4">
          <AppHeader locale={locale} dict={dict} />
          <Link
            href={`/${locale}`}
            className="inline-flex items-center gap-2 text-sm font-semibold text-neutral-500 hover:text-neutral-800 mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            {dict.browse.back}
          </Link>

          <div className="flex items-start gap-4 mb-6">
            <div
              className={`
                flex h-16 w-16 items-center justify-center rounded-2xl text-3xl shadow-sm
                bg-gradient-to-br ${category?.gradient ?? "from-neutral-200 to-neutral-300"}
              `}
            >
              {category?.emoji ?? "📅"}
            </div>
            <div>
              <h1 className="text-2xl font-black text-neutral-900 tracking-tight">
                {category?.label ?? categoryId}
              </h1>
              <p className="text-sm text-neutral-500 font-medium">
                {dict.region.northCoast}
              </p>
            </div>
          </div>

          <p className="text-neutral-600 leading-relaxed mb-6">
            {dict.events.hiddenGems}
          </p>

          <FilteredEventList
            events={events}
            loading={loading}
            dict={dict}
            locale={locale}
            onSelectEvent={setSelected}
            emptyMessage={dict.browse.noEvents}
            sectionTitle={dict.browse.eventsIn}
            onAddEvent={() => setSubmitOpen(true)}
            addEventLabel={dict.submit.addCategoryEvent.replace(
              "{category}",
              category?.label ?? categoryId,
            )}
          />
        </div>
      </main>

      <SubmitEventSheet
        open={submitOpen}
        onClose={() => setSubmitOpen(false)}
        dict={dict}
        locale={locale}
        defaults={{ category: categoryId }}
        onSubmitted={() => {
          setSubmitOpen(false);
          fetch(`/api/events?locale=${locale}&category=${categoryId}`)
            .then((r) => r.json())
            .then((d: { events?: Event[] }) => setEvents(d.events ?? []))
            .catch(() => {});
        }}
      />

      <EventDetailSheet
        event={selected}
        onClose={() => setSelected(null)}
        dict={dict}
        locale={locale}
        isSaved={selected ? isSaved(selected.id) : false}
        onToggleSave={toggleSave}
      />
    </>
  );
}
