import type { Locale } from "@/i18n/config";

export type SupportCopy = {
  meta: { title: string; description: string };
  eyebrow: string;
  title: string;
  lead: string;
  storyTitle: string;
  story: string[];
  fundsTitle: string;
  funds: { label: string; detail: string }[];
  form: {
    title: string;
    once: string;
    monthly: string;
    amountsAria: string;
    customLabel: string;
    customPlaceholder: string;
    currencyNote: string;
    ctaOnce: string;
    ctaMonthly: string;
    loading: string;
    secure: string;
    unavailable: string;
    error: string;
    cancelNote: string;
  };
  thanks: {
    title: string;
    body: string;
    again: string;
  };
  impact: {
    coffee: string;
    week: string;
    month: string;
    runway: string;
  };
};

/** $12 is the suggested “typical gift” — mirror Archive’s highlighted average. */
export const DONATE_PRESETS = [10, 12, 25, 50] as const;

const COPY: Record<Locale, SupportCopy> = {
  en: {
    meta: {
      title: "Support POP Events | Keep the North Coast calendar free",
      description:
        "POP Events is free for visitors and locals in Puerto Plata, Sosúa, and Cabarete. No paywall, no selling your data. Chip in to keep the calendar online.",
    },
    eyebrow: "Independent · free to use · built on the North Coast",
    title: "Please help keep this calendar free",
    lead: "POP Events doesn’t charge for access, doesn’t sell your information, and isn’t an app-store product. It’s a one-person project so travelers and locals can see what’s on tonight. Most gifts are about $12 — please pitch in if you can.",
    storyTitle: "Why your gift matters",
    story: [
      "Concerts, markets, and nightlife still live in scattered Instagram posts, WhatsApp forwards, and Facebook groups. Guests keep asking hotels the same question: what’s happening this weekend?",
      "POP Events puts Puerto Plata, Sosúa, and Cabarete into one live calendar — English, Spanish, and French — so a night out is one tap away.",
      "Hosting, maps, and weekly discovery cost real money. We stay free because people like you choose to support it.",
    ],
    fundsTitle: "Where support goes",
    funds: [
      {
        label: "Hosting & maps",
        detail: "Servers, images, and map tiles that stay fast on hotel Wi‑Fi.",
      },
      {
        label: "Weekly discovery",
        detail: "Time and tools to find new concerts, markets, and nightlife across the coast.",
      },
      {
        label: "Staying free for everyone",
        detail: "No paywall and no ticket markup on the calendar itself — browsing stays open.",
      },
    ],
    form: {
      title: "Choose an amount (USD)",
      once: "One time",
      monthly: "Monthly",
      amountsAria: "Donation amount",
      customLabel: "Custom amount",
      customPlaceholder: "Other",
      currencyNote: "Secure checkout via Stripe. Cards and wallets welcome.",
      ctaOnce: "Donate {amount}",
      ctaMonthly: "Give {amount} / month",
      loading: "Opening checkout…",
      secure: "You’ll finish on Stripe’s secure page. Cancel monthly support anytime.",
      unavailable:
        "Donations aren’t connected yet. Email hello@pop-event.com if you’d like to help another way.",
      error: "Checkout didn’t open. Please try again in a moment.",
      cancelNote: "No charge — you left checkout. Pick an amount whenever you’re ready.",
    },
    thanks: {
      title: "Thank you — you keep this free",
      body: "Your gift keeps the North Coast calendar open for the next guest scanning a lobby QR, and for locals planning Friday night.",
      again: "Back to events",
    },
    impact: {
      coffee: "About the price of a café con leche — and it helps",
      week: "A typical gift — covers about a week of hosting",
      month: "Helps fund a month of discovery tools",
      runway: "Gives the project real breathing room",
    },
  },
  es: {
    meta: {
      title: "Apoya POP Eventos | Mantén gratis el calendario de la Costa Norte",
      description:
        "POP Eventos es gratis para visitantes y locales en Puerto Plata, Sosúa y Cabarete. Sin muro de pago ni venta de datos. Aporta para mantenerlo en línea.",
    },
    eyebrow: "Independiente · gratis · hecho en la Costa Norte",
    title: "Ayuda a mantener este calendario gratis",
    lead: "POP Eventos no cobra por el acceso, no vende tu información y no es una app de tienda. Es un proyecto de una sola persona para que locales y viajeros sepan qué hay esta noche. La mayoría aporta unos $12 — si puedes, echa una mano.",
    storyTitle: "Por qué importa tu aporte",
    story: [
      "Conciertos, mercados y vida nocturna siguen dispersos en Instagram, WhatsApp y Facebook. Los huéspedes preguntan lo mismo en el hotel: ¿qué hay este fin de semana?",
      "POP Eventos junta Puerto Plata, Sosúa y Cabarete en un calendario en vivo — español, inglés y francés — para que una noche esté a un toque.",
      "Hosting, mapas y descubrimiento semanal cuestan dinero de verdad. Seguimos gratis porque personas como tú eligen apoyar.",
    ],
    fundsTitle: "A dónde va el apoyo",
    funds: [
      {
        label: "Hosting y mapas",
        detail: "Servidores, imágenes y mapas rápidos incluso con el Wi‑Fi del hotel.",
      },
      {
        label: "Descubrimiento semanal",
        detail: "Tiempo y herramientas para encontrar conciertos, mercados y vida nocturna.",
      },
      {
        label: "Gratis para todos",
        detail: "Sin muro de pago ni markup de entradas en el calendario — la consulta sigue abierta.",
      },
    ],
    form: {
      title: "Elige un monto (USD)",
      once: "Una vez",
      monthly: "Mensual",
      amountsAria: "Monto de donación",
      customLabel: "Monto personalizado",
      customPlaceholder: "Otro",
      currencyNote: "Pago seguro con Stripe. Tarjetas y wallets bienvenidos.",
      ctaOnce: "Donar {amount}",
      ctaMonthly: "Dar {amount} / mes",
      loading: "Abriendo el pago…",
      secure: "Terminas en la página segura de Stripe. Cancela el apoyo mensual cuando quieras.",
      unavailable:
        "Las donaciones aún no están conectadas. Escribe a hello@pop-event.com si quieres ayudar de otra forma.",
      error: "No se pudo abrir el pago. Inténtalo de nuevo en un momento.",
      cancelNote: "Sin cargo — saliste del pago. Elige un monto cuando quieras.",
    },
    thanks: {
      title: "Gracias — tú lo mantienes gratis",
      body: "Tu aporte mantiene abierto el calendario de la Costa Norte para el próximo huésped que escanea un QR en el lobby, y para locales planeando el viernes.",
      again: "Volver a eventos",
    },
    impact: {
      coffee: "Como un café con leche — y ayuda",
      week: "Un aporte típico — cubre cerca de una semana de hosting",
      month: "Ayuda a financiar un mes de herramientas",
      runway: "Le da aire real al proyecto",
    },
  },
  fr: {
    meta: {
      title: "Soutenir POP Events | Garder le calendrier de la Côte Nord gratuit",
      description:
        "POP Events est gratuit pour visiteurs et locaux à Puerto Plata, Sosúa et Cabarete. Pas de paywall, pas de revente de données. Contribuez pour le garder en ligne.",
    },
    eyebrow: "Indépendant · gratuit · fait sur la Côte Nord",
    title: "Aidez à garder ce calendrier gratuit",
    lead: "POP Events ne facture pas l’accès, ne vend pas vos informations, et n’est pas une app de store. C’est un projet d’une seule personne pour que locaux et voyageurs voient ce qui se passe ce soir. La plupart des dons tournent autour de 12 $ — participez si vous le pouvez.",
    storyTitle: "Pourquoi votre don compte",
    story: [
      "Concerts, marchés et nightlife vivent encore dans Instagram, WhatsApp et Facebook. Les clients posent toujours la même question à l’hôtel : qu’est-ce qu’il y a ce week-end ?",
      "POP Events rassemble Puerto Plata, Sosúa et Cabarete dans un calendrier live — français, anglais et espagnol — pour qu’une soirée soit à un tap.",
      "Hébergement, cartes et veille hebdomadaire coûtent de l’argent. On reste gratuit parce que des gens comme vous choisissent de soutenir.",
    ],
    fundsTitle: "Où va le soutien",
    funds: [
      {
        label: "Hébergement & cartes",
        detail: "Serveurs, images et cartes rapides même sur le Wi‑Fi de l’hôtel.",
      },
      {
        label: "Veille hebdomadaire",
        detail: "Temps et outils pour trouver concerts, marchés et nightlife sur la côte.",
      },
      {
        label: "Gratuit pour tous",
        detail: "Pas de paywall ni de marge sur les billets dans le calendrier — la consultation reste ouverte.",
      },
    ],
    form: {
      title: "Choisissez un montant (USD)",
      once: "Une fois",
      monthly: "Mensuel",
      amountsAria: "Montant du don",
      customLabel: "Montant personnalisé",
      customPlaceholder: "Autre",
      currencyNote: "Paiement sécurisé via Stripe. Cartes et wallets bienvenus.",
      ctaOnce: "Donner {amount}",
      ctaMonthly: "Donner {amount} / mois",
      loading: "Ouverture du paiement…",
      secure: "Vous terminez sur la page sécurisée de Stripe. Résiliez le soutien mensuel quand vous voulez.",
      unavailable:
        "Les dons ne sont pas encore connectés. Écrivez à hello@pop-event.com pour aider autrement.",
      error: "Le paiement ne s’est pas ouvert. Réessayez dans un instant.",
      cancelNote: "Aucun débit — vous avez quitté le paiement. Choisissez un montant quand vous voulez.",
    },
    thanks: {
      title: "Merci — vous gardez ça gratuit",
      body: "Votre don garde le calendrier de la Côte Nord ouvert pour le prochain client qui scanne un QR au lobby, et pour les locaux qui prévoient vendredi soir.",
      again: "Retour aux événements",
    },
    impact: {
      coffee: "Environ le prix d’un café con leche — et ça aide",
      week: "Un don typique — couvre environ une semaine d’hébergement",
      month: "Aide à financer un mois d’outils de veille",
      runway: "Donne de l’air au projet",
    },
  },
};

export function getSupportCopy(locale: Locale): SupportCopy {
  return COPY[locale] ?? COPY.en;
}

export function fillSupportTemplate(
  template: string,
  vars: Record<string, string>,
): string {
  return template.replace(/\{(\w+)\}/g, (_, key: string) => vars[key] ?? "");
}

export function impactForAmount(
  amount: number,
  impact: SupportCopy["impact"],
): string {
  if (amount >= 50) return impact.runway;
  if (amount >= 25) return impact.month;
  if (amount >= 12) return impact.week;
  return impact.coffee;
}
