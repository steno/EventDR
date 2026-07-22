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
    amountsAria: string;
    cta: string;
    viaPaypal: string;
    unavailable: string;
  };
  impact: {
    coffee: string;
    week: string;
    month: string;
    runway: string;
  };
};

const COPY: Record<Locale, SupportCopy> = {
  en: {
    meta: {
      title: "Support POP Events | Keep the North Coast calendar free",
      description:
        "POP Events is free for visitors and locals in Puerto Plata, Sosúa, and Cabarete. Chip in via PayPal to keep the calendar online.",
    },
    eyebrow: "Independent · free to use · built on the North Coast",
    title: "Please help keep this calendar free",
    lead: "POP Events doesn’t charge for access and doesn’t sell your information. It’s a one-person project so travelers and locals can see what’s on tonight. Most gifts are about $12 — please pitch in if you can.",
    storyTitle: "Why your gift matters",
    story: [
      "Concerts, markets, and nightlife still live in scattered Instagram posts and WhatsApp forwards. Guests keep asking: what’s happening this weekend?",
      "POP Events puts Puerto Plata, Sosúa, and Cabarete into one live calendar — English, Spanish, and French.",
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
        detail: "Time and tools to find new concerts, markets, and nightlife.",
      },
      {
        label: "Staying free for everyone",
        detail: "No paywall on the calendar — browsing stays open.",
      },
    ],
    form: {
      title: "Choose an amount (USD)",
      amountsAria: "Donation amount",
      cta: "Donate {amount} with PayPal",
      viaPaypal: "Opens PayPal in a new tab. Thank you for supporting POP.",
      unavailable: "Donations aren’t set up yet. Email hello@pop-event.com to help another way.",
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
        "POP Eventos es gratis para visitantes y locales. Aporta por PayPal para mantener el calendario en línea.",
    },
    eyebrow: "Independiente · gratis · hecho en la Costa Norte",
    title: "Ayuda a mantener este calendario gratis",
    lead: "POP Eventos no cobra por el acceso ni vende tu información. Es un proyecto de una sola persona. La mayoría aporta unos $12 — si puedes, echa una mano.",
    storyTitle: "Por qué importa tu aporte",
    story: [
      "Conciertos y vida nocturna siguen dispersos en Instagram y WhatsApp. Los huéspedes preguntan: ¿qué hay este fin de semana?",
      "POP Eventos junta Puerto Plata, Sosúa y Cabarete en un calendario en vivo — español, inglés y francés.",
      "Hosting y descubrimiento semanal cuestan dinero. Seguimos gratis porque personas como tú eligen apoyar.",
    ],
    fundsTitle: "A dónde va el apoyo",
    funds: [
      {
        label: "Hosting y mapas",
        detail: "Servidores e imágenes rápidos incluso con el Wi‑Fi del hotel.",
      },
      {
        label: "Descubrimiento semanal",
        detail: "Tiempo y herramientas para encontrar conciertos y planes.",
      },
      {
        label: "Gratis para todos",
        detail: "Sin muro de pago — la consulta sigue abierta.",
      },
    ],
    form: {
      title: "Elige un monto (USD)",
      amountsAria: "Monto de donación",
      cta: "Donar {amount} con PayPal",
      viaPaypal: "Abre PayPal en una nueva pestaña. Gracias por apoyar POP.",
      unavailable: "Las donaciones aún no están listas. Escribe a hello@pop-event.com.",
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
        "POP Events est gratuit pour visiteurs et locaux. Contribuez via PayPal pour garder le calendrier en ligne.",
    },
    eyebrow: "Indépendant · gratuit · fait sur la Côte Nord",
    title: "Aidez à garder ce calendrier gratuit",
    lead: "POP Events ne facture pas l’accès et ne vend pas vos informations. C’est un projet d’une seule personne. La plupart des dons tournent autour de 12 $ — participez si vous le pouvez.",
    storyTitle: "Pourquoi votre don compte",
    story: [
      "Concerts et nightlife vivent encore sur Instagram et WhatsApp. Les clients demandent : qu’est-ce qu’il y a ce week-end ?",
      "POP Events rassemble Puerto Plata, Sosúa et Cabarete dans un calendrier live — français, anglais et espagnol.",
      "Hébergement et veille coûtent de l’argent. On reste gratuit grâce à des gens comme vous.",
    ],
    fundsTitle: "Où va le soutien",
    funds: [
      {
        label: "Hébergement & cartes",
        detail: "Serveurs et images rapides même sur le Wi‑Fi de l’hôtel.",
      },
      {
        label: "Veille hebdomadaire",
        detail: "Temps et outils pour trouver concerts et sorties.",
      },
      {
        label: "Gratuit pour tous",
        detail: "Pas de paywall — la consultation reste ouverte.",
      },
    ],
    form: {
      title: "Choisissez un montant (USD)",
      amountsAria: "Montant du don",
      cta: "Donner {amount} avec PayPal",
      viaPaypal: "Ouvre PayPal dans un nouvel onglet. Merci de soutenir POP.",
      unavailable: "Les dons ne sont pas encore configurés. Écrivez à hello@pop-event.com.",
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
