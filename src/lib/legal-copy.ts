import type { Locale } from "@/i18n/config";

export type LegalPageCopy = {
  metaTitle: string;
  metaDescription: string;
  title: string;
  updated: string;
  intro?: string[];
  sections: {
    heading: string;
    body: string[];
    items?: string[];
    after?: string[];
  }[];
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

export const DATA_DISCLAIMER_COPY: Record<Locale, LegalPageCopy> = {
  en: {
    metaTitle: "Data disclaimer | POP Events",
    metaDescription:
      "POP Events listings are informational. Times, prices, and availability may be wrong or out of date — verify with the original source.",
    title: "Data disclaimer",
    updated: "Last updated 5 September 2026",
    intro: [
      "POP Events (https://pop-event.com) is an independent North Coast Dominican Republic event calendar. It provides aggregated event and venue information collected from publicly accessible third-party sources.",
      "The information displayed on this website is intended solely for informational, planning, research, and discovery purposes.",
      "Times, prices, venues, availability, descriptions, images, maps, ratings, and listing status may contain errors, delays, duplicates, outdated information, or incomplete records.",
    ],
    sections: [
      {
        heading: "1. Third-party sources",
        body: ["Event and venue information may originate from:"],
        items: [
          "Venue and organizer websites",
          "Public Facebook pages, groups, and event listings",
          "Public Instagram accounts, posts, Reels, and Stories used for discovery",
          "Ticket and registration platforms",
          "Tourism boards, municipal pages, press, and other publicly accessible sources",
          "Submissions sent to POP Events",
        ],
        after: [
          "We do not control how third-party websites, pages, or accounts publish, update, modify, remove, or structure their information.",
        ],
      },
      {
        heading: "2. No brokerage or representation",
        body: [
          "POP Events is not a ticket broker, event organizer, venue operator, travel agency, tour operator, realtor, or financial advisor.",
          "We do not sell tickets as merchant of record, host events, or take part in bookings, negotiations, contracts, or payments between you and organizers or venues — except optional donations that support the calendar itself.",
        ],
      },
      {
        heading: "3. Availability and status",
        body: ["Events and venues displayed on the platform may already be:"],
        items: [
          "Cancelled, postponed, or moved",
          "Sold out or reservation-only",
          "Closed, weather-affected, or operating on different hours",
          "Removed or changed by the source without notice",
          "Duplicated across multiple pages or promoters",
        ],
        after: [
          "Displaying a listing does not guarantee that the event is still on, that tickets remain available, or that the venue is open.",
        ],
      },
      {
        heading: "4. Pricing disclaimer",
        body: [
          "Cover charges, ticket prices, food and drink specials, tour rates, and similar figures may be outdated, estimated, incorrectly converted, incomplete, or inaccurate.",
          "Users must independently verify all pricing and purchase terms directly with the original listing source, ticket seller, or venue.",
        ],
      },
      {
        heading: "5. Analytics, ratings, and recommendations",
        body: [
          "Rankings, “our picks,” venue ratings, opinion summaries, maps, cruise-day timing, and similar metrics are generated from aggregated public datasets, editorial notes, and automated processing.",
          "These outputs may contain inconsistencies, estimation errors, missing data, or incomplete coverage of the North Coast market.",
        ],
      },
      {
        heading: "6. User responsibility",
        body: ["Users are solely responsible for independently verifying:"],
        items: [
          "Date, start time, and whether the event is still happening",
          "Venue location, access, and opening hours",
          "Ticket or reservation legitimacy and terms",
          "Pricing, age limits, dress codes, and house rules",
          "Travel, weather, road, and port conditions",
        ],
      },
      {
        heading: "7. Limitation of liability",
        body: [
          "To the fullest extent permitted by law, POP Events and its operator shall not be liable for any financial loss, missed events, travel disruption, investment or booking decisions, business interruption, legal disputes, or damages resulting from reliance on displayed information.",
          "Use of the site is at your own risk. Information is provided as-is, without warranties of accuracy, completeness, or fitness for a particular purpose.",
        ],
      },
      {
        heading: "8. Changes to data",
        body: [
          "Listings, photos, ratings, and related content may change, disappear, or update automatically without prior notice.",
          "We reserve the right to modify, restrict, or remove platform data at any time.",
        ],
      },
    ],
  },
  es: {
    metaTitle: "Aviso de datos | POP Eventos",
    metaDescription:
      "Los listados de POP Eventos son informativos. Horarios, precios y disponibilidad pueden estar mal o desactualizados — verifica con la fuente original.",
    title: "Aviso de datos",
    updated: "Actualizado 5 de septiembre de 2026",
    intro: [
      "POP Eventos (https://pop-event.com) es un calendario independiente de la Costa Norte de República Dominicana. Ofrece información agregada de eventos y lugares recopilada de fuentes públicas de terceros.",
      "La información de este sitio es solo para fines informativos, de planificación, investigación y descubrimiento.",
      "Horarios, precios, lugares, disponibilidad, descripciones, imágenes, mapas, valoraciones y el estado de los listados pueden contener errores, retrasos, duplicados, datos desactualizados o registros incompletos.",
    ],
    sections: [
      {
        heading: "1. Fuentes de terceros",
        body: ["La información de eventos y lugares puede provenir de:"],
        items: [
          "Sitios web de lugares y organizadores",
          "Páginas, grupos y eventos públicos de Facebook",
          "Cuentas, publicaciones, Reels e Historias públicos de Instagram usados para descubrir eventos",
          "Plataformas de entradas y registro",
          "Turismo, páginas municipales, prensa y otras fuentes públicas",
          "Envíos hechos a POP Eventos",
        ],
        after: [
          "No controlamos cómo los sitios, páginas o cuentas de terceros publican, actualizan, modifican, eliminan o estructuran su información.",
        ],
      },
      {
        heading: "2. Sin intermediación ni representación",
        body: [
          "POP Eventos no es una taquilla, organizador de eventos, operador de un local, agencia de viajes, operador turístico, inmobiliaria ni asesor financiero.",
          "No vendemos entradas como comerciante de registro, no organizamos los eventos ni participamos en reservas, negociaciones, contratos o pagos entre tú y organizadores o locales — salvo donaciones opcionales que sostienen el calendario.",
        ],
      },
      {
        heading: "3. Disponibilidad y estado",
        body: ["Los eventos y lugares mostrados pueden ya estar:"],
        items: [
          "Cancelados, aplazados o cambiados de lugar",
          "Agotados o solo con reserva",
          "Cerrados, afectados por el clima o con otro horario",
          "Eliminados o cambiados por la fuente sin aviso",
          "Duplicados en varias páginas o promotores",
        ],
        after: [
          "Mostrar un listado no garantiza que el evento siga en pie, que queden entradas o que el local esté abierto.",
        ],
      },
      {
        heading: "4. Precios",
        body: [
          "Covers, precios de entradas, especiales de comida y bebida, tarifas de tours y cifras similares pueden estar desactualizados, estimados, mal convertidos, incompletos o inexactos.",
          "Debes verificar precios y condiciones de compra directamente con la fuente original, el vendedor de entradas o el local.",
        ],
      },
      {
        heading: "5. Analítica, valoraciones y recomendaciones",
        body: [
          "Rankings, “nuestras sugerencias”, valoraciones de locales, resúmenes de opiniones, mapas, horarios de día de crucero y métricas similares se generan a partir de datos públicos agregados, notas editoriales y procesamiento automático.",
          "Pueden contener inconsistencias, errores de estimación, datos faltantes o cobertura incompleta del mercado de la Costa Norte.",
        ],
      },
      {
        heading: "6. Responsabilidad del usuario",
        body: ["Eres el único responsable de verificar de forma independiente:"],
        items: [
          "Fecha, hora de inicio y si el evento sigue programado",
          "Ubicación, acceso y horario del lugar",
          "Legitimidad y condiciones de entradas o reservas",
          "Precios, edad mínima, vestimenta y normas del local",
          "Viaje, clima, carreteras y condiciones del puerto",
        ],
      },
      {
        heading: "7. Limitación de responsabilidad",
        body: [
          "En la medida máxima permitida por la ley, POP Eventos y su operador no serán responsables de pérdidas económicas, eventos perdidos, interrupciones de viaje, decisiones de reserva o inversión, interrupción de negocio, disputas legales ni daños derivados de confiar en la información mostrada.",
          "El uso del sitio es bajo tu propio riesgo. La información se ofrece tal cual, sin garantías de exactitud, integridad ni idoneidad para un fin concreto.",
        ],
      },
      {
        heading: "8. Cambios en los datos",
        body: [
          "Listados, fotos, valoraciones y contenido relacionado pueden cambiar, desaparecer o actualizarse automáticamente sin aviso previo.",
          "Nos reservamos el derecho de modificar, restringir o eliminar datos de la plataforma en cualquier momento.",
        ],
      },
    ],
  },
  fr: {
    metaTitle: "Avertissement sur les données | POP Events",
    metaDescription:
      "Les listings POP Events sont informatifs. Horaires, prix et disponibilités peuvent être faux ou périmés — vérifiez auprès de la source d’origine.",
    title: "Avertissement sur les données",
    updated: "Mis à jour le 5 septembre 2026",
    intro: [
      "POP Events (https://pop-event.com) est un calendrier indépendant de la Côte Nord de la République dominicaine. Il agrège des informations sur les événements et les lieux à partir de sources publiques tierces.",
      "Les informations affichées sur ce site sont destinées uniquement à l’information, à la planification, à la recherche et à la découverte.",
      "Horaires, prix, lieux, disponibilités, descriptions, images, cartes, notes et statut des listings peuvent contenir des erreurs, des retards, des doublons, des données périmées ou des fiches incomplètes.",
    ],
    sections: [
      {
        heading: "1. Sources tierces",
        body: [
          "Les informations sur les événements et les lieux peuvent provenir de :",
        ],
        items: [
          "Sites des lieux et des organisateurs",
          "Pages, groupes et événements Facebook publics",
          "Comptes, publications, Reels et Stories Instagram publics utilisés pour la découverte",
          "Plateformes de billets et d’inscription",
          "Offices de tourisme, pages municipales, presse et autres sources publiques",
          "Soumissions envoyées à POP Events",
        ],
        after: [
          "Nous ne contrôlons pas la façon dont les sites, pages ou comptes tiers publient, mettent à jour, modifient, retirent ou structurent leurs informations.",
        ],
      },
      {
        heading: "2. Ni courtage ni représentation",
        body: [
          "POP Events n’est ni billetterie, ni organisateur d’événements, ni exploitant de lieu, ni agence de voyage, ni voyagiste, ni agence immobilière, ni conseiller financier.",
          "Nous ne vendons pas de billets en tant que marchand enregistré, n’organisons pas les événements et ne participons pas aux réservations, négociations, contrats ou paiements entre vous et les organisateurs ou lieux — sauf dons facultatifs qui soutiennent le calendrier.",
        ],
      },
      {
        heading: "3. Disponibilité et statut",
        body: ["Les événements et lieux affichés peuvent déjà être :"],
        items: [
          "Annulés, reportés ou déplacés",
          "Complets ou sur réservation uniquement",
          "Fermés, affectés par la météo ou à des horaires différents",
          "Retirés ou modifiés par la source sans préavis",
          "Dupliqués sur plusieurs pages ou promoteurs",
        ],
        after: [
          "Afficher un listing ne garantit pas que l’événement a lieu, que des billets restent disponibles, ni que le lieu est ouvert.",
        ],
      },
      {
        heading: "4. Prix",
        body: [
          "Entrées, prix des billets, offres food & drink, tarifs d’excursions et chiffres similaires peuvent être périmés, estimés, mal convertis, incomplets ou inexacts.",
          "Vous devez vérifier les prix et conditions d’achat directement auprès de la source d’origine, du vendeur de billets ou du lieu.",
        ],
      },
      {
        heading: "5. Analytique, notes et recommandations",
        body: [
          "Classements, « nos choix », notes de lieux, synthèses d’avis, cartes, horaires de journée croisière et métriques similaires sont générés à partir de données publiques agrégées, de notes éditoriales et de traitements automatiques.",
          "Ces résultats peuvent contenir des incohérences, des erreurs d’estimation, des données manquantes ou une couverture incomplète du marché de la Côte Nord.",
        ],
      },
      {
        heading: "6. Responsabilité de l’utilisateur",
        body: [
          "Vous êtes seul responsable de vérifier de manière indépendante :",
        ],
        items: [
          "La date, l’heure de début et si l’événement a toujours lieu",
          "L’emplacement, l’accès et les horaires du lieu",
          "La légitimité et les conditions des billets ou réservations",
          "Les prix, limites d’âge, codes vestimentaires et règles du lieu",
          "Le trajet, la météo, les routes et les conditions du port",
        ],
      },
      {
        heading: "7. Limitation de responsabilité",
        body: [
          "Dans toute la mesure permise par la loi, POP Events et son opérateur ne pourront être tenus responsables de toute perte financière, événement manqué, perturbation de voyage, décision de réservation ou d’investissement, interruption d’activité, litige ou dommage résultant de la confiance accordée aux informations affichées.",
          "L’utilisation du site se fait à vos propres risques. Les informations sont fournies en l’état, sans garantie d’exactitude, d’exhaustivité ni d’adéquation à un usage particulier.",
        ],
      },
      {
        heading: "8. Modifications des données",
        body: [
          "Listings, photos, notes et contenus associés peuvent changer, disparaître ou se mettre à jour automatiquement sans préavis.",
          "Nous nous réservons le droit de modifier, restreindre ou retirer les données de la plateforme à tout moment.",
        ],
      },
    ],
  },
};

export const DATA_SOURCES_COPY: Record<Locale, LegalPageCopy> = {
  en: {
    metaTitle: "Data sources | POP Events",
    metaDescription:
      "Where POP Events listings come from, who owns the content, and how to request a correction or removal.",
    title: "Data sources and listing information",
    updated: "Last updated 5 September 2026",
    intro: [
      "POP Events aggregates publicly accessible event and venue information from multiple third-party sources across the North Coast of the Dominican Republic (Puerto Plata, Sosúa, Cabarete, and nearby).",
    ],
    sections: [
      {
        heading: "1. Source of listings",
        body: [
          "Events, venues, times, prices, and related details displayed on this platform may originate from:",
        ],
        items: [
          "Venue and organizer websites",
          "Public Facebook pages, groups, and event listings",
          "Public Instagram accounts, posts, Reels, and Stories used for discovery",
          "Ticket and registration pages (including Eventbrite, tix.do, TodoTickets, and similar)",
          "Tourism boards, municipal pages, and local press",
          "Google Maps / Places and other publicly accessible references",
          "Direct submissions to POP Events",
        ],
        after: [
          "Listings are collected, indexed, organized, and displayed for informational and planning purposes. Instagram and Facebook are used to discover events; we do not claim those networks as the source of listing photographs.",
        ],
      },
      {
        heading: "2. No ownership of listings",
        body: [
          "We do not claim ownership of third-party listing content, images, descriptions, trademarks, branding, logos, or organizer or venue materials.",
          "All intellectual property remains the property of its respective owners. Display on POP Events is for discovery and reference only and does not transfer any rights.",
          "Photographs on the site may come from official event or venue pages, ticket-page previews, Google Maps / Places, press, Wikimedia, or POP-shot photos of the place. Existing social-network images already on the site are being replaced over time.",
        ],
      },
      {
        heading: "3. Accuracy of information",
        body: [
          "Listing information changes frequently and may become outdated or inaccurate.",
          "Data displayed on the platform may contain:",
        ],
        items: [
          "Incorrect times or prices",
          "Outdated availability or cancelled events still shown",
          "Duplicate listings",
          "Removed or expired events",
          "Incomplete descriptions",
          "Incorrect venues, addresses, or map pins",
        ],
        after: [
          "Users should independently verify all information before making plans, purchases, travel, or other decisions.",
        ],
      },
      {
        heading: "4. Availability of events",
        body: [
          "Displaying a listing on this platform does not guarantee that an event is currently happening or that a venue is open.",
          "Listings may be cancelled, postponed, sold out, reserved, moved, or modified without notice.",
        ],
      },
      {
        heading: "5. Analytics and historical data",
        body: [
          "The platform may display past events, recurring schedules, venue ratings, opinion summaries, market-style roundups, and other analytical information.",
          "Historical or aggregated data may not reflect current conditions, current prices, or whether a night is still on.",
        ],
      },
      {
        heading: "6. Data updates",
        body: [
          "Listings and related data may be updated automatically, on a weekly ingest, or manually depending on source availability.",
          "We do not guarantee update frequency, completeness, or uninterrupted synchronization with third-party sources.",
        ],
      },
      {
        heading: "7. Listing removal and rights requests",
        body: [
          "Event organizers, venues, rights holders, or authorized representatives may request review, correction, or removal of a listing, photo, or related content.",
          "Email " +
            CONTACT +
            " with the listing URL, what you want changed or removed, and how you are authorized to make the request. See also https://pop-event.com/en/data-deletion.",
          "We will review good-faith requests. We may keep a brief record of the request for legal or security reasons.",
        ],
      },
      {
        heading: "8. Informational purpose only",
        body: [
          "The platform is intended for browsing, research, comparison, planning, and informational purposes only.",
          "Nothing displayed on the platform constitutes ticket brokerage, event production, travel services, legal advice, financial advice, or investment recommendations.",
          "For accuracy limits and liability, see https://pop-event.com/en/data-disclaimer.",
        ],
      },
    ],
  },
  es: {
    metaTitle: "Fuentes de datos | POP Eventos",
    metaDescription:
      "De dónde salen los listados de POP Eventos, quién es dueño del contenido y cómo pedir una corrección o baja.",
    title: "Fuentes de datos e información de listados",
    updated: "Actualizado 5 de septiembre de 2026",
    intro: [
      "POP Eventos agrega información pública de eventos y lugares de múltiples fuentes de terceros en la Costa Norte de República Dominicana (Puerto Plata, Sosúa, Cabarete y alrededores).",
    ],
    sections: [
      {
        heading: "1. Origen de los listados",
        body: [
          "Eventos, lugares, horarios, precios y detalles relacionados pueden provenir de:",
        ],
        items: [
          "Sitios web de lugares y organizadores",
          "Páginas, grupos y eventos públicos de Facebook",
          "Cuentas, publicaciones, Reels e Historias públicos de Instagram usados para descubrir eventos",
          "Páginas de entradas y registro (incluidos Eventbrite, tix.do, TodoTickets y similares)",
          "Turismo, páginas municipales y prensa local",
          "Google Maps / Places y otras referencias públicas",
          "Envíos directos a POP Eventos",
        ],
        after: [
          "Los listados se recopilan, indexan, organizan y muestran con fines informativos y de planificación. Instagram y Facebook se usan para descubrir eventos; no los presentamos como fuente de las fotos del listado.",
        ],
      },
      {
        heading: "2. Sin titularidad de los listados",
        body: [
          "No reclamamos la titularidad del contenido, imágenes, descripciones, marcas, identidad visual, logos ni materiales de organizadores o locales de terceros.",
          "Toda propiedad intelectual sigue siendo de sus respectivos dueños. Mostrar algo en POP Eventos es solo para descubrimiento y referencia y no transfiere derechos.",
          "Las fotografías pueden venir de páginas oficiales del evento o local, previsualizaciones de entradas, Google Maps / Places, prensa, Wikimedia o fotos propias de POP del lugar. Las imágenes de redes sociales que aún estén en el sitio se van sustituyendo con el tiempo.",
        ],
      },
      {
        heading: "3. Exactitud de la información",
        body: [
          "La información de los listados cambia con frecuencia y puede quedar desactualizada o inexacta.",
          "Los datos mostrados pueden contener:",
        ],
        items: [
          "Horarios o precios incorrectos",
          "Disponibilidad desactualizada o eventos cancelados que aún aparecen",
          "Listados duplicados",
          "Eventos eliminados o vencidos",
          "Descripciones incompletas",
          "Lugares, direcciones o pines de mapa incorrectos",
        ],
        after: [
          "Debes verificar toda la información antes de hacer planes, compras, viajes u otras decisiones.",
        ],
      },
      {
        heading: "4. Disponibilidad de los eventos",
        body: [
          "Mostrar un listado en esta plataforma no garantiza que un evento esté ocurriendo ni que un local esté abierto.",
          "Los listados pueden cancelarse, aplazarse, agotarse, reservarse, mudarse o modificarse sin aviso.",
        ],
      },
      {
        heading: "5. Analítica y datos históricos",
        body: [
          "La plataforma puede mostrar eventos pasados, horarios recurrentes, valoraciones de locales, resúmenes de opiniones, recopilaciones y otra información analítica.",
          "Los datos históricos o agregados pueden no reflejar las condiciones actuales, los precios actuales ni si una noche sigue en pie.",
        ],
      },
      {
        heading: "6. Actualización de datos",
        body: [
          "Los listados y datos relacionados pueden actualizarse de forma automática, en una ingesta semanal o de forma manual, según la disponibilidad de la fuente.",
          "No garantizamos frecuencia de actualización, integridad ni sincronización ininterrumpida con fuentes de terceros.",
        ],
      },
      {
        heading: "7. Bajas y solicitudes de derechos",
        body: [
          "Organizadores, locales, titulares de derechos o representantes autorizados pueden pedir revisión, corrección o eliminación de un listado, foto o contenido relacionado.",
          "Escribe a " +
            CONTACT +
            " con la URL del listado, qué quieres cambiar o quitar y cómo estás autorizado a pedirlo. También: https://pop-event.com/es/data-deletion.",
          "Revisaremos las solicitudes de buena fe. Podemos conservar un registro breve de la solicitud por motivos legales o de seguridad.",
        ],
      },
      {
        heading: "8. Solo con fines informativos",
        body: [
          "La plataforma es para consultar, comparar, planificar e informarse.",
          "Nada de lo mostrado constituye taquilla, producción de eventos, servicios de viaje, asesoría legal, financiera ni recomendaciones de inversión.",
          "Para límites de exactitud y responsabilidad, ver https://pop-event.com/es/data-disclaimer.",
        ],
      },
    ],
  },
  fr: {
    metaTitle: "Sources des données | POP Events",
    metaDescription:
      "D’où viennent les listings POP Events, à qui appartient le contenu, et comment demander une correction ou un retrait.",
    title: "Sources des données et informations des listings",
    updated: "Mis à jour le 5 septembre 2026",
    intro: [
      "POP Events agrège des informations publiques sur les événements et les lieux à partir de sources tierces sur la Côte Nord de la République dominicaine (Puerto Plata, Sosúa, Cabarete et environs).",
    ],
    sections: [
      {
        heading: "1. Origine des listings",
        body: [
          "Événements, lieux, horaires, prix et détails associés affichés sur cette plateforme peuvent provenir de :",
        ],
        items: [
          "Sites des lieux et des organisateurs",
          "Pages, groupes et événements Facebook publics",
          "Comptes, publications, Reels et Stories Instagram publics utilisés pour la découverte",
          "Pages de billets et d’inscription (dont Eventbrite, tix.do, TodoTickets et similaires)",
          "Offices de tourisme, pages municipales et presse locale",
          "Google Maps / Places et autres références publiques",
          "Soumissions directes à POP Events",
        ],
        after: [
          "Les listings sont collectés, indexés, organisés et affichés à des fins d’information et de planification. Instagram et Facebook servent à découvrir les événements ; nous ne les présentons pas comme source des photos de listing.",
        ],
      },
      {
        heading: "2. Aucune propriété des listings",
        body: [
          "Nous ne revendiquons pas la propriété du contenu, des images, descriptions, marques, identité visuelle, logos ou supports d’organisateurs ou de lieux tiers.",
          "Toute propriété intellectuelle reste celle de ses titulaires. L’affichage sur POP Events sert uniquement à la découverte et à la référence et ne transfère aucun droit.",
          "Les photographies peuvent provenir de pages officielles d’événement ou de lieu, d’aperçus de billets, de Google Maps / Places, de la presse, de Wikimedia ou de photos POP du lieu. Les images de réseaux sociaux encore présentes sont remplacées progressivement.",
        ],
      },
      {
        heading: "3. Exactitude des informations",
        body: [
          "Les informations des listings changent souvent et peuvent devenir périmées ou inexactes.",
          "Les données affichées peuvent contenir :",
        ],
        items: [
          "Horaires ou prix incorrects",
          "Disponibilité périmée ou événements annulés encore affichés",
          "Listings en double",
          "Événements retirés ou expirés",
          "Descriptions incomplètes",
          "Lieux, adresses ou épingles carte incorrects",
        ],
        after: [
          "Vous devez vérifier toutes les informations avant de faire des projets, achats, déplacements ou autres décisions.",
        ],
      },
      {
        heading: "4. Disponibilité des événements",
        body: [
          "Afficher un listing sur cette plateforme ne garantit pas qu’un événement a lieu ni qu’un lieu est ouvert.",
          "Les listings peuvent être annulés, reportés, complets, réservés, déplacés ou modifiés sans préavis.",
        ],
      },
      {
        heading: "5. Analytique et données historiques",
        body: [
          "La plateforme peut afficher des événements passés, des horaires récurrents, des notes de lieux, des synthèses d’avis, des compilations et d’autres informations analytiques.",
          "Les données historiques ou agrégées peuvent ne pas refléter les conditions actuelles, les prix actuels, ni si une soirée a toujours lieu.",
        ],
      },
      {
        heading: "6. Mises à jour des données",
        body: [
          "Les listings et données associées peuvent être mis à jour automatiquement, lors d’une ingestion hebdomadaire, ou manuellement selon la disponibilité de la source.",
          "Nous ne garantissons ni la fréquence de mise à jour, ni l’exhaustivité, ni une synchronisation ininterrompue avec les sources tierces.",
        ],
      },
      {
        heading: "7. Retrait et demandes de droits",
        body: [
          "Organisateurs, lieux, titulaires de droits ou représentants autorisés peuvent demander l’examen, la correction ou le retrait d’un listing, d’une photo ou d’un contenu associé.",
          "Écrivez à " +
            CONTACT +
            " avec l’URL du listing, ce que vous voulez modifier ou retirer, et en quelle qualité vous faites la demande. Voir aussi https://pop-event.com/fr/data-deletion.",
          "Nous examinerons les demandes de bonne foi. Nous pouvons conserver un bref enregistrement de la demande pour des motifs légaux ou de sécurité.",
        ],
      },
      {
        heading: "8. Usage informatif uniquement",
        body: [
          "La plateforme est destinée à la consultation, la recherche, la comparaison, la planification et l’information.",
          "Rien de ce qui y est affiché ne constitue une billetterie, une production d’événements, un service de voyage, un conseil juridique ou financier, ni une recommandation d’investissement.",
          "Pour les limites d’exactitude et de responsabilité, voir https://pop-event.com/fr/data-disclaimer.",
        ],
      },
    ],
  },
};
