import type { Locale } from "@/i18n/config";
import type { CitySlug } from "@/lib/cities";
import { SITE_URL } from "@/lib/site-url";

export type PartnersCopy = {
  meta: { title: string; description: string };
  title: string;
  subtitle: string;
  intro: string;
  qrSection: string;
  qrCards: {
    all: { label: string; hint: string };
    weekend: { label: string; hint: string };
    city: { label: string; hint: string };
  };
  howTo: { title: string; steps: string[] };
  benefits: { title: string; items: string[] };
  links: { title: string; weekend: string; home: string };
  digest: {
    title: string;
    body: string;
    placeholder: string;
    button: string;
    success: string;
    error: string;
    privacy: string;
  };
  support: {
    eyebrow: string;
    title: string;
    body: string;
    cta: string;
  };
  print: string;
};

const COPY: Record<Locale, PartnersCopy> = {
  en: {
    meta: {
      title: "For Hotels & Partners | POP Events North Coast DR",
      description:
        "Free live event calendar for your guests in Puerto Plata, Sosúa, and Cabarete. Print QR codes for your lobby, concierge, or excursion desk.",
    },
    title: "For hotels & partners",
    subtitle: "Give your guests a live North Coast event calendar",
    intro:
      "POP Events is free, works on any phone, and updates every week. Print a QR code for your lobby or share the link with tour groups — no app store required.",
    qrSection: "Print-ready QR codes",
    qrCards: {
      all: {
        label: "All events",
        hint: "Main lobby / reception — full calendar",
      },
      weekend: {
        label: "This weekend",
        hint: "Concierge desk / excursion counter",
      },
      city: {
        label: "Events in {city}",
        hint: "City-specific — leave at the front desk",
      },
    },
    howTo: {
      title: "How to use",
      steps: [
        "Choose and print the QR that fits your desk (all events, weekend, or city).",
        "Place it at reception, the pool bar, or your excursion desk.",
        "Scan it once on a staff phone to test the guest experience.",
        "Optional: add pop-event.com to your welcome email or WhatsApp group.",
      ],
    },
    benefits: {
      title: "Why partners use POP Events",
      items: [
        "Live concerts, festivals, nightlife, culture, and sports",
        "Puerto Plata, Sosúa, and Cabarete in English, Spanish, and French",
        "Directions, share, and add-to-calendar on every event",
        "Updated weekly — your team does not maintain a list",
      ],
    },
    links: {
      title: "Quick links",
      weekend: "This weekend",
      home: "All events",
    },
    digest: {
      title: "Get the weekend partner digest",
      body: "A concise weekly roundup for your concierge, front desk, or guest WhatsApp.",
      placeholder: "work@email.com",
      button: "Subscribe",
      success: "You’re on the partner list.",
      error: "Could not subscribe right now. Please try again.",
      privacy: "Partner updates only. No spam.",
    },
    support: {
      eyebrow: "Independent project",
      title: "Help keep the guest calendar free",
      body: "No paywall for your guests. Most supporters give about $12 — it covers hosting and weekly discovery so your QR kit stays useful.",
      cta: "Support POP Events",
    },
    print: "Print this page",
  },
  es: {
    meta: {
      title: "Para hoteles y socios | POP Eventos Costa Norte RD",
      description:
        "Calendario de eventos en vivo gratis para sus huéspedes en Puerto Plata, Sosúa y Cabarete. Imprima códigos QR para recepción o excursiones.",
    },
    title: "Para hoteles y socios",
    subtitle: "Calendario en vivo de eventos en la Costa Norte",
    intro:
      "POP Eventos es gratis, funciona en cualquier teléfono y se actualiza cada semana. Imprima un QR para su lobby o comparta el enlace con grupos — sin app store.",
    qrSection: "Códigos QR listos para imprimir",
    qrCards: {
      all: {
        label: "Todos los eventos",
        hint: "Lobby / recepción — calendario completo",
      },
      weekend: {
        label: "Este fin de semana",
        hint: "Concierge / mostrador de excursiones",
      },
      city: {
        label: "Eventos en {city}",
        hint: "Por ciudad — en recepción",
      },
    },
    howTo: {
      title: "Cómo usarlo",
      steps: [
        "Elija e imprima el QR adecuado (todos, fin de semana o ciudad).",
        "Colóquelo en recepción, bar de piscina o desk de excursiones.",
        "Escanéelo una vez con el teléfono del equipo para probar la experiencia.",
        "Opcional: incluya pop-event.com en el email o WhatsApp de bienvenida.",
      ],
    },
    benefits: {
      title: "Por qué los socios usan POP Eventos",
      items: [
        "Conciertos, festivales, vida nocturna, cultura y deportes en vivo",
        "Puerto Plata, Sosúa y Cabarete en español, inglés y francés",
        "Direcciones, compartir y agregar al calendario",
        "Actualizado cada semana — su equipo no mantiene listas",
      ],
    },
    links: {
      title: "Enlaces rápidos",
      weekend: "Este fin de semana",
      home: "Todos los eventos",
    },
    digest: {
      title: "Recibe el resumen del fin de semana",
      body: "Un resumen semanal breve para concierge, recepción o el WhatsApp de huéspedes.",
      placeholder: "trabajo@email.com",
      button: "Suscribirme",
      success: "Ya estás en la lista de socios.",
      error: "No se pudo completar ahora. Inténtalo de nuevo.",
      privacy: "Solo novedades para socios. Sin spam.",
    },
    support: {
      eyebrow: "Proyecto independiente",
      title: "Ayuda a mantener gratis el calendario",
      body: "Sin muro de pago para tus huéspedes. La mayoría aporta unos $12 — cubre hosting y descubrimiento semanal para que el kit QR siga siendo útil.",
      cta: "Apoyar POP Eventos",
    },
    print: "Imprimir esta página",
  },
  fr: {
    meta: {
      title: "Pour hôtels et partenaires | POP Events Côte Nord RD",
      description:
        "Calendrier d'événements en direct gratuit pour vos clients à Puerto Plata, Sosúa et Cabarete. QR codes à imprimer pour la réception.",
    },
    title: "Pour hôtels et partenaires",
    subtitle: "Calendrier live des événements sur la Côte Nord",
    intro:
      "POP Events est gratuit, fonctionne sur tout téléphone et se met à jour chaque semaine. Imprimez un QR pour le lobby ou partagez le lien avec les groupes — sans app store.",
    qrSection: "QR codes prêts à imprimer",
    qrCards: {
      all: {
        label: "Tous les événements",
        hint: "Lobby / réception — calendrier complet",
      },
      weekend: {
        label: "Ce week-end",
        hint: "Concierge / comptoir excursions",
      },
      city: {
        label: "Événements à {city}",
        hint: "Par ville — à la réception",
      },
    },
    howTo: {
      title: "Comment utiliser",
      steps: [
        "Choisissez et imprimez le QR adapté (tous, week-end ou ville).",
        "Placez-le à la réception, au bar piscine ou au desk excursions.",
        "Scannez-le sur le téléphone de l’équipe pour tester l’expérience client.",
        "Option : ajoutez pop-event.com à l'e-mail ou WhatsApp de bienvenue.",
      ],
    },
    benefits: {
      title: "Pourquoi les partenaires utilisent POP Events",
      items: [
        "Concerts, festivals, nightlife, culture et sport en direct",
        "Puerto Plata, Sosúa et Cabarete en français, anglais et espagnol",
        "Itinéraires, partage et ajout au calendrier",
        "Mis à jour chaque semaine — pas de liste à maintenir",
      ],
    },
    links: {
      title: "Liens rapides",
      weekend: "Ce week-end",
      home: "Tous les événements",
    },
    digest: {
      title: "Recevez le digest partenaire du week-end",
      body: "Un résumé hebdomadaire concis pour la conciergerie, la réception ou WhatsApp.",
      placeholder: "travail@email.com",
      button: "S’abonner",
      success: "Vous êtes sur la liste partenaires.",
      error: "Inscription impossible pour le moment. Réessayez.",
      privacy: "Actualités partenaires uniquement. Aucun spam.",
    },
    support: {
      eyebrow: "Projet indépendant",
      title: "Aidez à garder le calendrier gratuit",
      body: "Pas de paywall pour vos clients. La plupart des soutiens donnent environ 12 $ — cela couvre l’hébergement et la veille pour que le kit QR reste utile.",
      cta: "Soutenir POP Events",
    },
    print: "Imprimer cette page",
  },
};

export function getPartnersCopy(locale: Locale): PartnersCopy {
  return COPY[locale] ?? COPY.en;
}

export function partnerTrackUrl(
  locale: Locale,
  path: string,
  campaign: string,
): string {
  const locPath = path ? `/${locale}${path}` : `/${locale}`;
  const normalized = `${SITE_URL}${locPath}`;
  const sep = normalized.includes("?") ? "&" : "?";
  return `${normalized}${sep}utm_source=partner&utm_medium=qr&utm_campaign=${campaign}`;
}

export function partnerQrTargets(locale: Locale): {
  all: string;
  weekend: string;
  cities: { slug: CitySlug; name: string; url: string }[];
} {
  const cityNames: Record<Locale, Record<CitySlug, string>> = {
    en: { "puerto-plata": "Puerto Plata", sosua: "Sosúa", cabarete: "Cabarete" },
    es: { "puerto-plata": "Puerto Plata", sosua: "Sosúa", cabarete: "Cabarete" },
    fr: { "puerto-plata": "Puerto Plata", sosua: "Sosúa", cabarete: "Cabarete" },
  };

  const slugs: CitySlug[] = ["puerto-plata", "sosua", "cabarete"];

  return {
    all: partnerTrackUrl(locale, "", "lobby-all"),
    weekend: partnerTrackUrl(locale, "/when/weekend", "lobby-weekend"),
    cities: slugs.map((slug) => ({
      slug,
      name: cityNames[locale][slug],
      url: partnerTrackUrl(locale, `/city/${slug}`, `lobby-${slug}`),
    })),
  };
}

export function fillPartnersTemplate(
  template: string,
  vars: Record<string, string>,
): string {
  return template.replace(/\{(\w+)\}/g, (_, key: string) => vars[key] ?? "");
}
