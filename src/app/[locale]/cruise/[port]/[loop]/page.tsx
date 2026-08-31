import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { CruiseLoopView } from "@/components/CruiseLoopView";
import { JsonLd } from "@/components/JsonLd";
import { isValidLocale, locales } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import {
  CRUISE_ITINERARIES,
  CRUISE_PORTS,
  cruiseLoopPath,
  cruisePath,
  isCruiseItineraryId,
  isCruisePortSlug,
  itineraryById,
  loopTravelProfile,
  loopWaypoints,
  parseAllAboardMinutes,
  resolveItineraryStops,
  type CruisePortSlug,
} from "@/lib/cruise";
import { getLoopAppleMapsUrl, getLoopGoogleMapsUrl, osmEmbedUrl } from "@/lib/maps";
import { getPublicEvents } from "@/lib/public-events";
import { fetchOsrmRoute, type RouteLeg } from "@/lib/routing";
import {
  absoluteUrl,
  buildBreadcrumbJsonLd,
  buildCruiseLoopMetadata,
  fillTemplate,
  localePath,
} from "@/lib/seo";
import { getVenues } from "@/lib/venues";

export const revalidate = 120;

export function generateStaticParams() {
  return locales.flatMap((locale) =>
    CRUISE_ITINERARIES.map((loop) => ({
      locale,
      port: loop.port,
      loop: loop.id,
    })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; port: string; loop: string }>;
}): Promise<Metadata> {
  const { locale, port, loop } = await params;
  if (
    !isValidLocale(locale) ||
    !isCruisePortSlug(port) ||
    !isCruiseItineraryId(loop)
  ) {
    return {};
  }
  const itinerary = itineraryById(loop);
  if (!itinerary || itinerary.port !== port) return {};
  const dict = getDictionary(locale);
  return buildCruiseLoopMetadata(locale, dict, port, loop);
}

function firstSearchValue(value: string | string[] | undefined): string | null {
  if (typeof value === "string") return value;
  if (Array.isArray(value)) return value[0] ?? null;
  return null;
}

function loopLegLabels(
  waypoints: { kind: "port" | "stop"; name: string }[],
  legs: RouteLeg[],
  profile: "walking" | "driving",
  copy: {
    walkToStop: string;
    taxiToStop: string;
    walkBackToShip: string;
    taxiBackToShip: string;
  },
): string[] {
  const count = Math.min(legs.length, waypoints.length - 1);
  const labels: string[] = [];
  for (let i = 0; i < count; i++) {
    const dest = waypoints[i + 1];
    const leg = legs[i];
    if (!dest || !leg) continue;
    const minutes = Math.max(1, Math.round(leg.durationS / 60));
    const walking = profile === "walking";
    if (dest.kind === "port") {
      labels.push(
        fillTemplate(walking ? copy.walkBackToShip : copy.taxiBackToShip, {
          minutes: String(minutes),
        }),
      );
    } else {
      labels.push(
        fillTemplate(walking ? copy.walkToStop : copy.taxiToStop, {
          minutes: String(minutes),
          stop: dest.name,
        }),
      );
    }
  }
  return labels;
}

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string; port: string; loop: string }>;
  searchParams: Promise<{ allAboard?: string | string[] }>;
}) {
  const { locale, port: portParam, loop: loopParam } = await params;
  if (
    !isValidLocale(locale) ||
    !isCruisePortSlug(portParam) ||
    !isCruiseItineraryId(loopParam)
  ) {
    notFound();
  }
  const port = portParam as CruisePortSlug;
  const itinerary = itineraryById(loopParam);
  if (!itinerary || itinerary.port !== port) notFound();

  const sp = await searchParams;
  const allAboardMinutes = parseAllAboardMinutes(firstSearchValue(sp.allAboard));

  const dict = getDictionary(locale);
  const portName =
    port === "taino-bay" ? dict.cruise.tainoBay : dict.cruise.amberCove;
  const loopCopy = dict.cruise.loops[itinerary.id];
  const minutes = itinerary.typicalMinutes + itinerary.taxiMinutes;
  const profile = loopTravelProfile(itinerary);

  const [venues, events] = await Promise.all([
    getVenues(locale),
    getPublicEvents({ locale }),
  ]);

  const stops = resolveItineraryStops(itinerary, locale, events, venues);
  const waypoints = loopWaypoints(
    CRUISE_PORTS[port],
    itinerary,
    venues,
    portName,
  );

  const route = waypoints ? await fetchOsrmRoute(waypoints, profile) : null;
  const googleMapsUrl = waypoints
    ? getLoopGoogleMapsUrl(waypoints, profile)
    : "";
  const appleMapsUrl = waypoints
    ? getLoopAppleMapsUrl(waypoints, profile)
    : "";
  const embedUrl = waypoints ? osmEmbedUrl(waypoints) : "";

  const mapStops = (waypoints ?? []).map((point) => ({
    lat: point.lat,
    lng: point.lng,
    kind: point.kind,
    label: point.name,
    number: undefined as number | undefined,
  }));

  let stopNumber = 0;
  for (const stop of mapStops) {
    if (stop.kind !== "stop") continue;
    stopNumber += 1;
    stop.number = stopNumber;
  }

  const legs = waypoints && route?.legs.length
    ? loopLegLabels(waypoints, route.legs, profile, dict.cruise)
    : [];

  const backHref = cruisePath(locale, port, allAboardMinutes);
  const shareUrl = absoluteUrl(cruiseLoopPath(locale, port, itinerary.id));

  return (
    <>
      <JsonLd
        data={[
          buildBreadcrumbJsonLd([
            { name: dict.seo.siteName, path: localePath(locale) },
            {
              name: dict.cruise.eyebrow,
              path: localePath(locale, `/cruise/${port}`),
            },
            {
              name: loopCopy.title,
              path: localePath(locale, `/cruise/${port}/${itinerary.id}`),
            },
          ]),
        ]}
      />
      <CruiseLoopView
        dict={dict}
        portName={portName}
        title={loopCopy.title}
        body={loopCopy.body}
        minutes={minutes}
        backHref={backHref}
        shareUrl={shareUrl}
        googleMapsUrl={googleMapsUrl}
        appleMapsUrl={appleMapsUrl}
        osmEmbedUrl={embedUrl}
        mapStops={mapStops}
        route={route?.coords ?? null}
        legs={legs}
        stops={stops}
      />
    </>
  );
}
