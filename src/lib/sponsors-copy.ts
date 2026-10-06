import type { Locale } from "@/i18n/config";
import type { SponsorTier } from "@/lib/sponsors";

export type SponsorsCopy = {
  meta: { title: string; description: string };
  eyebrow: string;
  title: string;
  lead: string;
  listAria: string;
  tiers: Record<SponsorTier, string>;
  onInstagram: string;
  ctaTitle: string;
  ctaLead: string;
  ctaButton: string;
  empty: string;
};

const COPY: Record<Locale, SponsorsCopy> = {
  en: {
    meta: {
      title: "Sponsors | Thank you for supporting POP Events",
      description:
        "Thank you to the people who keep POP Events free for Puerto Plata, Sosúa, and Cabarete.",
    },
    eyebrow: "Community support",
    title: "Thank you, sponsors",
    lead: "POP Events stays free because people on the North Coast — and guests who love it — choose to chip in. We’re grateful for every gift.",
    listAria: "Sponsors",
    tiers: {
      founding: "Founding",
      patron: "Patron",
      supporter: "Supporter",
    },
    onInstagram: "Instagram",
    ctaTitle: "Want to be on this list?",
    ctaLead: "Any amount helps keep the calendar online for visitors and locals.",
    ctaButton: "Support POP",
    empty: "No public sponsors yet — you could be the first.",
  },
  es: {
    meta: {
      title: "Patrocinadores | Gracias por apoyar POP Eventos",
      description:
        "Gracias a quienes mantienen POP Eventos gratis para Puerto Plata, Sosúa y Cabarete.",
    },
    eyebrow: "Apoyo de la comunidad",
    title: "Gracias, patrocinadores",
    lead: "POP Eventos sigue gratis porque personas de la Costa Norte — y visitantes que la quieren — eligen aportar. Gracias por cada regalo.",
    listAria: "Patrocinadores",
    tiers: {
      founding: "Fundador",
      patron: "Patrono",
      supporter: "Apoyo",
    },
    onInstagram: "Instagram",
    ctaTitle: "¿Quieres estar en esta lista?",
    ctaLead: "Cualquier monto ayuda a mantener el calendario en línea.",
    ctaButton: "Apoyar POP",
    empty: "Aún no hay patrocinadores públicos — podrías ser el primero.",
  },
  fr: {
    meta: {
      title: "Sponsors | Merci de soutenir POP Events",
      description:
        "Merci aux personnes qui gardent POP Events gratuit pour Puerto Plata, Sosúa et Cabarete.",
    },
    eyebrow: "Soutien de la communauté",
    title: "Merci, sponsors",
    lead: "POP Events reste gratuit grâce aux gens de la Côte Nord — et aux visiteurs qui l’aiment — qui choisissent de contribuer. Merci pour chaque don.",
    listAria: "Sponsors",
    tiers: {
      founding: "Fondateur",
      patron: "Mécène",
      supporter: "Soutien",
    },
    onInstagram: "Instagram",
    ctaTitle: "Envie d’être sur cette liste ?",
    ctaLead: "Chaque montant aide à garder le calendrier en ligne.",
    ctaButton: "Soutenir POP",
    empty: "Pas encore de sponsors publics — vous pourriez être le premier.",
  },
};

export function getSponsorsCopy(locale: Locale): SponsorsCopy {
  return COPY[locale] ?? COPY.en;
}
