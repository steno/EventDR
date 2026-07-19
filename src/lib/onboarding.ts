import type { Locale } from "@/i18n/config";

export type OnboardingFlag =
  | "city-primed"
  | "event-actions-coached"
  | "first-save-celebrated"
  | "calendar-prompt-seen"
  | "push-prompt-seen";

const STORAGE_KEY = "pop-onboarding-v1";

function readFlags(): Set<OnboardingFlag> {
  if (typeof window === "undefined") return new Set();
  try {
    const value = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
    return new Set(Array.isArray(value) ? value : []);
  } catch {
    return new Set();
  }
}

export function hasSeenOnboarding(flag: OnboardingFlag): boolean {
  return readFlags().has(flag);
}

export function markOnboardingSeen(flag: OnboardingFlag): void {
  try {
    const flags = readFlags();
    flags.add(flag);
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...flags]));
  } catch {
    /* Storage can be unavailable in private browsing. */
  }
}

type OnboardingCopy = {
  city: {
    eyebrow: string;
    title: string;
    body: string;
    all: string;
    dismiss: string;
  };
  actions: {
    title: string;
    body: string;
    share: string;
    save: string;
    dismiss: string;
  };
  saved: {
    title: string;
    body: string;
    calendar: string;
    keepBrowsing: string;
    exampleTitle: string;
    exampleBody: string;
    pushEnable: string;
    pushNotNow: string;
    pushError: string;
  };
  submit: {
    essentialsHint: string;
    detailsHint: string;
    extrasHint: string;
    back: string;
    next: string;
    statusTitle: string;
    pendingBody: string;
    liveBody: string;
    shareListing: string;
    copyLink: string;
    copied: string;
    done: string;
  };
  partner: {
    weekendEyebrow: string;
    weekendTitle: string;
    weekendBody: string;
    weekendCta: string;
  };
};

const COPY: Record<Locale, OnboardingCopy> = {
  en: {
    city: {
      eyebrow: "Make it local",
      title: "Where are you exploring?",
      body: "Choose an area for more relevant events. You can change it anytime.",
      all: "All North Coast",
      dismiss: "Not now",
    },
    actions: {
      title: "Make a plan",
      body: "Save this event for later or send it to friends.",
      share: "Share",
      save: "Save",
      dismiss: "Got it",
    },
    saved: {
      title: "Saved for later",
      body: "Want this event on your calendar too?",
      calendar: "Add to calendar",
      keepBrowsing: "Keep browsing",
      exampleTitle: "Start with a popular event",
      exampleBody: "Open an event and tap the heart. It will stay here on this device.",
      pushEnable: "Turn on alerts",
      pushNotNow: "Not now",
      pushError: "Alerts are not available right now.",
    },
    submit: {
      essentialsHint: "Tell your guests about your event.",
      detailsHint: "Add a place, description, and photo if you have one.",
      extrasHint: "Tickets and repeats are optional — skip if you want.",
      back: "Back",
      next: "Continue",
      statusTitle: "Your event is submitted",
      pendingBody: "It is waiting for a quick review before going live.",
      liveBody: "It is live now and ready to share.",
      shareListing: "Share listing",
      copyLink: "Copy link",
      copied: "Link copied",
      done: "Done",
    },
    partner: {
      weekendEyebrow: "For hotels & partners",
      weekendTitle: "Give guests this weekend’s live event guide",
      weekendBody: "Print a free QR for reception, the lobby, or your excursion desk.",
      weekendCta: "Get the partner QR kit",
    },
  },
  es: {
    city: {
      eyebrow: "Hazlo local",
      title: "¿Qué zona estás explorando?",
      body: "Elige una zona para ver eventos más relevantes. Puedes cambiarla cuando quieras.",
      all: "Toda la Costa Norte",
      dismiss: "Ahora no",
    },
    actions: {
      title: "Arma el plan",
      body: "Guarda este evento para después o envíalo a tus amigos.",
      share: "Compartir",
      save: "Guardar",
      dismiss: "Entendido",
    },
    saved: {
      title: "Guardado para después",
      body: "¿También quieres añadirlo a tu calendario?",
      calendar: "Añadir al calendario",
      keepBrowsing: "Seguir explorando",
      exampleTitle: "Empieza con un evento popular",
      exampleBody: "Abre un evento y toca el corazón. Quedará aquí en este dispositivo.",
      pushEnable: "Activar alertas",
      pushNotNow: "Ahora no",
      pushError: "Las alertas no están disponibles ahora.",
    },
    submit: {
      essentialsHint: "Cuéntales a tus invitados sobre tu evento.",
      detailsHint: "Añade lugar, descripción y una foto si tienes.",
      extrasHint: "Entradas y repetición son opcionales — puedes saltarlas.",
      back: "Atrás",
      next: "Continuar",
      statusTitle: "Tu evento fue enviado",
      pendingBody: "Está esperando una revisión rápida antes de publicarse.",
      liveBody: "Ya está publicado y listo para compartir.",
      shareListing: "Compartir evento",
      copyLink: "Copiar enlace",
      copied: "Enlace copiado",
      done: "Listo",
    },
    partner: {
      weekendEyebrow: "Para hoteles y socios",
      weekendTitle: "Ofrece a tus huéspedes la guía de eventos del fin de semana",
      weekendBody: "Imprime un QR gratis para recepción, lobby o excursiones.",
      weekendCta: "Obtener el kit QR",
    },
  },
  fr: {
    city: {
      eyebrow: "Passez en mode local",
      title: "Quelle zone explorez-vous ?",
      body: "Choisissez une zone pour voir les événements les plus pertinents. Modifiable à tout moment.",
      all: "Toute la Côte Nord",
      dismiss: "Pas maintenant",
    },
    actions: {
      title: "Organisez la sortie",
      body: "Enregistrez cet événement ou envoyez-le à vos amis.",
      share: "Partager",
      save: "Enregistrer",
      dismiss: "Compris",
    },
    saved: {
      title: "Enregistré pour plus tard",
      body: "Voulez-vous aussi l’ajouter à votre calendrier ?",
      calendar: "Ajouter au calendrier",
      keepBrowsing: "Continuer",
      exampleTitle: "Commencez par un événement populaire",
      exampleBody: "Ouvrez un événement et touchez le cœur. Il restera ici sur cet appareil.",
      pushEnable: "Activer les alertes",
      pushNotNow: "Pas maintenant",
      pushError: "Les alertes ne sont pas disponibles pour le moment.",
    },
    submit: {
      essentialsHint: "Parlez de votre événement à vos invités.",
      detailsHint: "Ajoutez un lieu, une description et une photo si vous en avez.",
      extrasHint: "Billets et répétition sont facultatifs — passez si vous voulez.",
      back: "Retour",
      next: "Continuer",
      statusTitle: "Votre événement est envoyé",
      pendingBody: "Il attend une vérification rapide avant sa publication.",
      liveBody: "Il est en ligne et prêt à être partagé.",
      shareListing: "Partager l’événement",
      copyLink: "Copier le lien",
      copied: "Lien copié",
      done: "Terminé",
    },
    partner: {
      weekendEyebrow: "Pour hôtels et partenaires",
      weekendTitle: "Offrez à vos clients le guide live du week-end",
      weekendBody: "Imprimez un QR gratuit pour la réception, le lobby ou le desk excursions.",
      weekendCta: "Obtenir le kit QR",
    },
  },
};

export function getOnboardingCopy(locale: Locale): OnboardingCopy {
  return COPY[locale] ?? COPY.en;
}
