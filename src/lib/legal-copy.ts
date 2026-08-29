import type { Locale } from "@/i18n/config";

export type LegalPageCopy = {
  metaTitle: string;
  metaDescription: string;
  title: string;
  updated: string;
  sections: { heading: string; body: string[] }[];
};

const CONTACT = "popeventdr@gmail.com";

export const PRIVACY_COPY: Record<Locale, LegalPageCopy> = {
  en: {
    metaTitle: "Privacy | POP Events",
    metaDescription:
      "How POP Events handles information on pop-event.com and related Meta apps.",
    title: "Privacy",
    updated: "Last updated 29 August 2026",
    sections: [
      {
        heading: "Who we are",
        body: [
          "POP Events is an independent North Coast Dominican Republic event calendar at https://pop-event.com. Contact: " +
            CONTACT +
            ".",
        ],
      },
      {
        heading: "What we collect",
        body: [
          "Browsing the calendar does not require an account. We may collect standard server and analytics data (pages viewed, approximate location from IP, device type) to keep the site working.",
          "If you submit an event, donate, or email us, we keep the details you send so we can respond or publish the listing.",
          "If you subscribe to the Friday weekend email, we store your address and language so we can send that list and honor unsubscribe requests.",
          "The POP Events Meta app is for the site operator to publish to our own Facebook Page and Instagram. It is not a consumer login for visitors.",
        ],
      },
      {
        heading: "What we do not do",
        body: [
          "We do not sell your information. We do not use visitor Facebook/Instagram logins to scrape private profiles.",
        ],
      },
      {
        heading: "Third parties",
        body: [
          "Hosting, maps, analytics, and payment (PayPal) process data under their own policies. Meta processes data if you interact with our Page or Instagram. Weekend emails are delivered by Resend when that service is configured.",
        ],
      },
      {
        heading: "Requests",
        body: [
          "Email " +
            CONTACT +
            " to ask what we hold or to request deletion. See also https://pop-event.com/en/data-deletion.",
        ],
      },
    ],
  },
  es: {
    metaTitle: "Privacidad | POP Eventos",
    metaDescription:
      "Cómo POP Eventos trata la información en pop-event.com y apps de Meta relacionadas.",
    title: "Privacidad",
    updated: "Actualizado 29 de agosto de 2026",
    sections: [
      {
        heading: "Quiénes somos",
        body: [
          "POP Eventos es un calendario independiente de la Costa Norte de RD en https://pop-event.com. Contacto: " +
            CONTACT +
            ".",
        ],
      },
      {
        heading: "Qué recopilamos",
        body: [
          "Ver el calendario no requiere cuenta. Podemos registrar datos técnicos habituales para que el sitio funcione.",
          "Si envías un evento, donas o escribes, guardamos lo que nos mandes para responder o publicar.",
          "Si te suscribes al email del viernes, guardamos tu correo e idioma para enviar esa lista y respetar la baja.",
          "La app de Meta de POP Events es para que el operador publique en nuestra Página e Instagram, no un login para visitantes.",
        ],
      },
      {
        heading: "Qué no hacemos",
        body: [
          "No vendemos tu información. No usamos logins de visitantes para extraer perfiles privados.",
        ],
      },
      {
        heading: "Terceros",
        body: [
          "Alojamiento, mapas, analítica y PayPal tratan datos con sus propias políticas. Meta trata datos si interactúas con nuestra Página o Instagram. El email del fin de semana lo entrega Resend cuando está configurado.",
        ],
      },
      {
        heading: "Solicitudes",
        body: [
          "Escribe a " +
            CONTACT +
            ". También: https://pop-event.com/es/data-deletion.",
        ],
      },
    ],
  },
  fr: {
    metaTitle: "Confidentialité | POP Events",
    metaDescription:
      "Comment POP Events traite les informations sur pop-event.com et les apps Meta liées.",
    title: "Confidentialité",
    updated: "Mis à jour le 29 août 2026",
    sections: [
      {
        heading: "Qui nous sommes",
        body: [
          "POP Events est un calendrier indépendant de la Côte Nord RD : https://pop-event.com. Contact : " +
            CONTACT +
            ".",
        ],
      },
      {
        heading: "Ce que nous collectons",
        body: [
          "Consulter le calendrier ne nécessite pas de compte. Nous pouvons enregistrer des données techniques habituelles.",
          "Si vous envoyez un événement, donnez ou écrivez, nous gardons ce que vous envoyez pour répondre ou publier.",
          "Si vous vous inscrivez à l’e-mail du vendredi, nous conservons votre adresse et la langue pour l’envoyer et honorer la désinscription.",
          "L’app Meta POP Events sert à l’opérateur pour publier sur notre Page et Instagram, pas à connecter les visiteurs.",
        ],
      },
      {
        heading: "Ce que nous ne faisons pas",
        body: [
          "Nous ne vendons pas vos informations. Nous n’utilisons pas de logins visiteurs pour extraire des profils privés.",
        ],
      },
      {
        heading: "Tiers",
        body: [
          "Hébergement, cartes, analytics et PayPal ont leurs propres politiques. Meta traite des données si vous interagissez avec notre Page ou Instagram. Les e-mails du week-end sont envoyés via Resend lorsque ce service est configuré.",
        ],
      },
      {
        heading: "Demandes",
        body: [
          "Écrivez à " +
            CONTACT +
            ". Voir aussi https://pop-event.com/fr/data-deletion.",
        ],
      },
    ],
  },
};

export const DATA_DELETION_COPY: Record<Locale, LegalPageCopy> = {
  en: {
    metaTitle: "Data deletion | POP Events",
    metaDescription:
      "How to request deletion of information held by POP Events, including Meta app data.",
    title: "Data deletion",
    updated: "Last updated 19 August 2026",
    sections: [
      {
        heading: "Website",
        body: [
          "Email " +
            CONTACT +
            " with the subject “Delete my data” and any email or listing you want removed. We will delete or anonymize what we hold, except records we must keep for legal or security reasons (for example a brief log of the request).",
        ],
      },
      {
        heading: "Meta app (POP Events)",
        body: [
          "This app is used by the site operator to publish to the POP Events Facebook Page and Instagram. Visitors do not sign into the calendar with Facebook.",
          "If you granted the app access while testing, remove it in Facebook → Settings → Apps and websites, and email " +
            CONTACT +
            " so we can drop any related tokens on our side.",
        ],
      },
    ],
  },
  es: {
    metaTitle: "Eliminación de datos | POP Eventos",
    metaDescription:
      "Cómo pedir que POP Eventos borre información, incluida la de la app de Meta.",
    title: "Eliminación de datos",
    updated: "Actualizado 19 de agosto de 2026",
    sections: [
      {
        heading: "Sitio",
        body: [
          "Escribe a " +
            CONTACT +
            " con el asunto “Borrar mis datos”. Eliminaremos o anonimizaremos lo que tengamos, salvo lo que la ley exija conservar.",
        ],
      },
      {
        heading: "App de Meta (POP Events)",
        body: [
          "La app la usa el operador para publicar en la Página e Instagram de POP Events. Los visitantes no inician sesión en el calendario con Facebook.",
          "Si diste acceso al probar, quítala en Facebook → Configuración → Aplicaciones y sitios, y escribe a " +
            CONTACT +
            ".",
        ],
      },
    ],
  },
  fr: {
    metaTitle: "Suppression des données | POP Events",
    metaDescription:
      "Comment demander la suppression des données détenues par POP Events, y compris l’app Meta.",
    title: "Suppression des données",
    updated: "Mis à jour le 19 août 2026",
    sections: [
      {
        heading: "Site",
        body: [
          "Écrivez à " +
            CONTACT +
            " avec l’objet « Supprimer mes données ». Nous supprimerons ou anonymiserons ce que nous détenons, sauf obligation légale.",
        ],
      },
      {
        heading: "App Meta (POP Events)",
        body: [
          "L’app sert à l’opérateur pour publier sur la Page et Instagram POP Events. Les visiteurs ne se connectent pas au calendrier avec Facebook.",
          "Si vous avez autorisé l’app en test, retirez-la dans Facebook → Paramètres → Applications et sites, et écrivez à " +
            CONTACT +
            ".",
        ],
      },
    ],
  },
};
