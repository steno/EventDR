import type { Event, EventCategory } from "./types";
import type { Locale } from "@/i18n/config";
import { FALLBACK_EVENTS_FR } from "./fallback-events-fr";
import { getRecurringEvents } from "./recurring-events";
import { materializeEventDates } from "./event-dates";
import { filterRemovedSeedEvents } from "./removed-seeds";
import { eventInCategory, withResolvedCategories } from "./categorize";
import {
  ATLETICOS_HOME_GAMES_EN,
  ATLETICOS_HOME_GAMES_ES,
} from "./atleticos-summer-league-2026";
import {
  EL_CAREY_WC2026_EVENTS_EN,
  EL_CAREY_WC2026_EVENTS_ES,
  EL_CAREY_WC2026_EVENTS_FR,
} from "./world-cup-2026-events";

const FALLBACK_EVENTS_EN: Event[] = [
  // Music
  {
    id: "voyvoy-sunday-open-mic",
    title: "VOYVOY Sunday Open Mic & Jam",
    description:
      "Live music, open mic, and jam night at VOYVOY in Cabarete. Lester Grant kicks it off — bring an instrument or borrow one. Relaxed drinks and dinner spot.",
    date: "2026-07-05",
    time: "5:00 PM – 11:00 PM",
    location: "Cabarete",
    venue: "VOYVOY Cabarete",
    venueSlug: "voyvoy-cabarete",
    category: "performances",
    format: "physical",
    recurrence: "weekly",
    recurrenceDay: 0,
    imageEmoji: "🎤",
  },
  {
    id: "voyvoy-saturday-session",
    title: "VOYVOY Saturday Session",
    description:
      "Saturday night dance session at VOYVOY with guest DJs — reggaeton, dance club vibes, no cover. A Cabarete staple for locals and visitors.",
    date: "2026-07-11",
    time: "9:00 PM – 2:00 AM",
    location: "Cabarete",
    venue: "VOYVOY Cabarete",
    venueSlug: "voyvoy-cabarete",
    category: "parties",
    format: "physical",
    recurrence: "weekly",
    recurrenceDay: 6,
    imageEmoji: "🪩",
  },
  {
    id: "lil-naay-2026-07-17",
    title: "Lil Naay — Live at Disco Club",
    description:
      "Dominican urban star Lil Naay performs at Disco Club, Depósitos de Brugal on Calle Duarte. Friday night concert — tickets on todotickets.do with QR entry at the door.",
    date: "2026-07-17",
    time: "8:00 PM – 11:00 PM",
    location: "Puerto Plata",
    address: "Depósitos de Brugal, Calle Duarte",
    venue: "Disco Club",
    venueSlug: "disco-club-brugal",
    lat: 19.7966,
    lng: -70.6923,
    category: "concert",
    format: "physical",
    trending: true,
    sourceUrl: "https://todotickets.do/events/lil-naay",
    ticketUrl: "https://todotickets.do/events/lil-naay",
    lineup: ["Lil Naay"],
    imageEmoji: "🎤",
  },
  {
    id: "cabarete-jazz-festival-2026",
    title: "Cabarete Jazz Festival 2026",
    description:
      "Second edition of Cabarete Jazz Festival (Sat Jun 6) — Alfredo Rodríguez, Cimafunk, Los Amigos Invisibles, iLe, Gia Fu, and Dominican saxophonist Sandy Gabriel. Open-air Caribbean jazz produced by Cabarete Tango and Mishu Music; gates from 5 PM. Tickets at cabaretejazz.com.",
    date: "2026-06-06",
    time: "5:00 PM – 11:00 PM",
    location: "Cabarete",
    venue: "Cabarete Jazz Festival Grounds",
    lat: 19.770325,
    lng: -70.43824,
    category: "festivals",
    categories: ["concert", "music"],
    format: "physical",
    trending: true,
    sourceUrl: "https://www.cabaretejazz.com/",
    ticketUrl: "https://www.cabaretejazz.com/",
    lineup: [
      "Alfredo Rodríguez",
      "Cimafunk",
      "Los Amigos Invisibles",
      "iLe",
      "Gia Fu",
      "Sandy Gabriel",
    ],
    imageEmoji: "🎷",
  },
  {
    id: "jandy-ventura-legado-caballo-2026",
    title: "Jandy Ventura — El Legado del Caballo",
    description:
      "Jandy Ventura brings the Johnny Ventura merengue tribute “El Legado del Caballo” to the Blue JackTar convention center in Playa Dorada. Tickets sold locally at Supermercado José Luis, Tío Pan, Blue JackTar, and La Locanda — Front Stage RD$5,000 · VIP RD$4,000 · General RD$2,500. Produced by GRAAN Events Planners.",
    date: "2026-07-30",
    time: "8:00 PM",
    location: "Puerto Plata",
    venue: "Blue JackTar Playa Dorada",
    venueSlug: "blue-jacktar-playa-dorada",
    address: "Centro de Convenciones, Playa Dorada",
    lat: 19.7703,
    lng: -70.6494,
    category: "concert",
    categories: ["music"],
    format: "physical",
    trending: true,
    admissionPrice: "RD$2,500–5,000",
    phone: "+18098898853",
    sourceUrl:
      "https://puertoplatadigital.com/puerto-plata-de-noche/el-legado-del-caballo-llega-a-puerto-plata",
    lineup: ["Jandy Ventura"],
    imageEmoji: "🎶",
  },
  // Sports
  {
    id: "rumble-in-paradise-12",
    title: "Rumble in Paradise 12",
    description:
      "Professional boxing on Sosúa Beach at Bar 39, with special guest appearances and autograph signings.",
    date: "2026-07-04",
    time: "5:00 PM – 9:00 PM",
    location: "Sosúa",
    venue: "Bar 39, Sosúa Beach",
    venueSlug: "bar-39-sosua",
    category: "sports",
    format: "physical",
    trending: true,
    sourceUrl: "https://www.facebook.com/events/1614506996278636",
    imageEmoji: "🥊",
  },
  ...ATLETICOS_HOME_GAMES_EN,
  {
    id: "cabarete-classic-2026",
    title: "Cabarete Classic 2026",
    description:
      "Four days of windsurf, kitesurf, wingfoil, and foil racing on Cabarete Beach (Jul 16–19). The Caribbean's flagship water-sports regatta — international competitors, clinics, and evening music on the beach.",
    date: "2026-07-16",
    endDate: "2026-07-19",
    time: "12:00 AM",
    location: "Cabarete",
    venue: "Cabarete Beach",
    venueSlug: "kite-beach",
    address: "Residencial Mañanero, Cabarete",
    category: "sports",
    format: "physical",
    trending: true,
    sourceUrl: "https://www.facebook.com/events/4550504901861035/",
    imageEmoji: "🏄",
  },
  {
    id: "womens-reconnection-kite-camp-2026",
    title: "Women's Reconnection Kite Camp",
    description:
      "7-night women's kite camp on Cabarete beachfront — flow, reconnect, and kite sessions with IKO instructor Ariadna Rabasa. Early bird spots available.",
    date: "2026-08-01",
    endDate: "2026-08-08",
    time: "12:00 AM",
    location: "Cabarete",
    venue: "Cabarete Beach",
    venueSlug: "kite-beach",
    category: "sports",
    format: "physical",
    trending: true,
    sourceUrl: "https://www.facebook.com/events/1683911749456298/",
    imageEmoji: "🏄",
  },
  {
    id: "ingest-18th-annual-cabarete-butterfly-effect",
    title: "18th Annual Cabarete Butterfly Effect",
    description:
      "Five-day women's watersports festival across Cabarete (Jul 7–11): SUP clinics, yoga, beach cleanup, catamaran cruise, and the signature river paddle. See the official site for schedule and registration.",
    date: "2026-07-07",
    endDate: "2026-07-11",
    time: "9:00 AM – 9:00 PM",
    location: "Cabarete",
    venue: "Kite Beach & Cabarete town",
    address: "Carretera 5",
    venueSlug: "kite-beach",
    category: "festivals",
    format: "physical",
    trending: true,
    sourceUrl: "https://www.cabaretebutterflyeffect.com/",
    imageEmoji: "🏄",
  },
  // Food & Drinks
  {
    id: "sancocho-sabados-pingui",
    title: "Sancocho Saturdays at Pingüi",
    description:
      "Saturdays taste like tradition at Pingüi Bar — share a bowl of sancocho facing the sea at Playa El Pueblito. Gather friends and family for an afternoon of Dominican comfort food and ocean views (12–4 PM).",
    date: "2026-07-11",
    time: "12:00 PM – 4:00 PM",
    location: "Puerto Plata",
    venue: "Pingüi Bar Restaurant & Piña Colada House",
    venueSlug: "pingui-bar",
    address: "C. B, Puerto Plata 57000",
    lat: 19.773903,
    lng: -70.652704,
    category: "food-drinks",
    format: "physical",
    recurrence: "weekly",
    recurrenceDay: 6,
    sourceUrl:
      "https://www.facebook.com/events/1547520700301499/1547522116968024/",
    imageEmoji: "🍲",
  },
  // Festivals
  {
    id: "feria-artesanal-verano-2026",
    title: "Feria Artesanal Verano 2026",
    description:
      "The Summer Artisan Fair 2026 runs July 10–26 at Plaza Independencia (Puerto Plata's Central Park). More than 120 local artisans exhibit daily from 8:00 AM to 9:00 PM — handmade pieces, cultural displays, art, souvenirs, and cabezudos masks. A showcase of Dominican crafts for visitors and residents alike.",
    date: "2026-07-10",
    endDate: "2026-07-26",
    time: "8:00 AM – 9:00 PM",
    location: "Puerto Plata",
    venue: "Plaza Independencia (Parque Central)",
    venueSlug: "plaza-independencia",
    address: "Calle San Felipe, Puerto Plata",
    category: "festivals",
    categories: ["culture"],
    format: "physical",
    trending: true,
    isFree: true,
    sourceUrl: "https://www.facebook.com/share/18vHNaoe69/",
    imageEmoji: "🎨",
  },
  {
    id: "puerto-plata-carnaval-2026",
    title: "Puerto Plata Carnival 2026",
    description:
      "Puerto Plata Carnival 2026 on the Malecón — Sunday parades every February (Feb 1, 8, 15 & 22) culminating in the Gran Desfile Final on March 1 at Anfiteatro La Puntilla. Taimáscaro masks, comparsas, and Dominican folk culture on the North Coast.",
    date: "2026-02-01",
    endDate: "2026-03-01",
    time: "2:00 PM – 8:00 PM",
    location: "Puerto Plata",
    venue: "Malecón de Puerto Plata & Anfiteatro La Puntilla",
    venueSlug: "malecon-puerto-plata",
    category: "festivals",
    format: "physical",
    trending: true,
    sourceUrl:
      "https://sea-horse-ranch.com/carnival-celebrations-in-the-dominican-republic/",
    imageEmoji: "🎭",
  },
  // Dance
  // Health & Wellness
  {
    id: "malecon-morning-wellness-walk",
    title: "Malecón Morning Wellness Walk",
    description:
      "Early-morning walkers and joggers along Puerto Plata's Malecón — ocean breezes, stretching groups, and a daily wellness ritual on the waterfront promenade from La Puntilla to the city center.",
    date: "2026-01-01",
    time: "6:00 AM – 8:00 AM",
    location: "Puerto Plata",
    venue: "Malecón de Puerto Plata",
    venueSlug: "malecon-puerto-plata",
    category: "health-wellness",
    format: "physical",
    recurrence: "daily",
    imageEmoji: "🚶",
  },
  {
    id: "cabarete-pilates-reformer",
    title: "Pilates Reformer Group Class",
    description:
      "Group Pilates Reformer sessions in Cabarete with Rafaella Cirillo (Tue & Thu 9 AM). Studio address shared when you book — DM or WhatsApp +1 809 460 5777. Discount code RC-pilates for first class.",
    date: "2026-07-08",
    time: "9:00 AM – 10:00 AM",
    location: "Cabarete",
    venue: "Rafaella's Studio",
    category: "health-wellness",
    format: "physical",
    recurrence: "weekly",
    recurrenceDays: [2, 4],
    sourceUrl: "https://www.facebook.com/events/981611704653706/",
    imageEmoji: "🧘",
  },
  // Performances
  {
    id: "el-colibri-karaoke-battle-2026",
    title: "El Colibri Karaoke Battle — Thursdays",
    description:
      "Thursday karaoke nights at El Colibri Hotel, Sosúa (7 PM–midnight). Join the 8-week Karaoke Battle — $20,000 in prizes (Jul 2–Sep 3, 2026). Contestants must attend every Thursday to stay eligible. Register on WhatsApp: +1 917-523-7259.",
    date: "2026-07-02",
    endDate: "2026-09-03",
    time: "7:00 PM – 12:00 AM",
    location: "Sosúa",
    venue: "El Colibri Hotel",
    venueSlug: "el-colibri-hotel",
    address: "141 Pedro Clisante, Sosúa 57600",
    lat: 19.7545,
    lng: -70.519,
    category: "music",
    format: "physical",
    recurrence: "weekly",
    recurrenceDay: 4,
    trending: true,
    sourceUrl: "https://www.elcolibriresort.com/",
    imageEmoji: "🎤",
  },
  // Business
  // Parties
  {
    id: "inicio-del-campamento-pp-2026",
    title: "Inicio del Campamento",
    description:
      "Sports camp kickoff in historic San Felipe, Puerto Plata — hosted by Sin pelos en la lengua. Check the Facebook event for registration details.",
    date: "2026-07-10",
    time: "5:00 PM – 8:00 PM",
    location: "Puerto Plata",
    venue: "San Felipe de Puerto Plata",
    venueSlug: "fortaleza-san-felipe",
    category: "sports",
    format: "physical",
    sourceUrl: "https://www.facebook.com/events/1017381540870816/",
    imageEmoji: "⚽",
  },
];

const FALLBACK_EVENTS_ES: Event[] = [
  {
    id: "voyvoy-sunday-open-mic",
    title: "Open Mic y Jam Dominical en VOYVOY",
    description:
      "Música en vivo, open mic y jam en VOYVOY, Cabarete. Lester Grant abre la noche — trae tu instrumento o pide uno prestado. Ambiente relajado para tomar y cenar.",
    date: "2026-07-05",
    time: "5:00 PM – 11:00 PM",
    location: "Cabarete",
    venue: "VOYVOY Cabarete",
    venueSlug: "voyvoy-cabarete",
    category: "performances",
    format: "physical",
    recurrence: "weekly",
    recurrenceDay: 0,
    imageEmoji: "🎤",
  },
  {
    id: "voyvoy-saturday-session",
    title: "Saturday Session en VOYVOY",
    description:
      "Noche de baile los sábados en VOYVOY con DJs invitados — reggaeton, dance club, sin cover. Un clásico de Cabarete para locales y visitantes.",
    date: "2026-07-11",
    time: "9:00 PM – 2:00 AM",
    location: "Cabarete",
    venue: "VOYVOY Cabarete",
    venueSlug: "voyvoy-cabarete",
    category: "parties",
    format: "physical",
    recurrence: "weekly",
    recurrenceDay: 6,
    imageEmoji: "🪩",
  },
  {
    id: "lil-naay-2026-07-17",
    title: "Lil Naay en vivo en Disco Club",
    description:
      "El artista urbano dominicano Lil Naay se presenta en Disco Club, Depósitos de Brugal en la Calle Duarte. Concierto el viernes por la noche — entradas en todotickets.do con ingreso por código QR.",
    date: "2026-07-17",
    time: "8:00 PM – 11:00 PM",
    location: "Puerto Plata",
    address: "Depósitos de Brugal, Calle Duarte",
    venue: "Disco Club",
    venueSlug: "disco-club-brugal",
    lat: 19.7966,
    lng: -70.6923,
    category: "concert",
    format: "physical",
    trending: true,
    sourceUrl: "https://todotickets.do/events/lil-naay",
    ticketUrl: "https://todotickets.do/events/lil-naay",
    lineup: ["Lil Naay"],
    imageEmoji: "🎤",
  },
  {
    id: "cabarete-jazz-festival-2026",
    title: "Cabarete Jazz Festival 2026",
    description:
      "Segunda edición del Cabarete Jazz Festival (sáb. 6 jun.) — Alfredo Rodríguez, Cimafunk, Los Amigos Invisibles, iLe, Gia Fu y el saxofonista dominicano Sandy Gabriel. Jazz caribeño al aire libre producido por Cabarete Tango y Mishu Music; apertura a las 5 PM. Entradas en cabaretejazz.com.",
    date: "2026-06-06",
    time: "5:00 PM – 11:00 PM",
    location: "Cabarete",
    venue: "Cabarete Jazz Festival Grounds",
    lat: 19.770325,
    lng: -70.43824,
    category: "festivals",
    categories: ["concert", "music"],
    format: "physical",
    trending: true,
    sourceUrl: "https://www.cabaretejazz.com/",
    ticketUrl: "https://www.cabaretejazz.com/",
    lineup: [
      "Alfredo Rodríguez",
      "Cimafunk",
      "Los Amigos Invisibles",
      "iLe",
      "Gia Fu",
      "Sandy Gabriel",
    ],
    imageEmoji: "🎷",
  },
  {
    id: "jandy-ventura-legado-caballo-2026",
    title: "Jandy Ventura — El Legado del Caballo",
    description:
      "Jandy Ventura presenta el tributo de merengue a Johnny Ventura “El Legado del Caballo” en el centro de convenciones del Blue JackTar, Playa Dorada. Boletas en Supermercado José Luis, Tío Pan, Blue JackTar y La Locanda — Front Stage RD$5,000 · VIP RD$4,000 · General RD$2,500. Producción de GRAAN Events Planners.",
    date: "2026-07-30",
    time: "8:00 PM",
    location: "Puerto Plata",
    venue: "Blue JackTar Playa Dorada",
    venueSlug: "blue-jacktar-playa-dorada",
    address: "Centro de Convenciones, Playa Dorada",
    lat: 19.7703,
    lng: -70.6494,
    category: "concert",
    categories: ["music"],
    format: "physical",
    trending: true,
    admissionPrice: "RD$2,500–5,000",
    phone: "+18098898853",
    sourceUrl:
      "https://puertoplatadigital.com/puerto-plata-de-noche/el-legado-del-caballo-llega-a-puerto-plata",
    lineup: ["Jandy Ventura"],
    imageEmoji: "🎶",
  },
  {
    id: "rumble-in-paradise-12",
    title: "Rumble in Paradise 12",
    description:
      "Boxeo profesional en Playa Sosúa en Bar 39, con invitados especiales y firmas de autógrafos.",
    date: "2026-07-04",
    time: "5:00 PM – 9:00 PM",
    location: "Sosúa",
    venue: "Bar 39, Playa Sosúa",
    venueSlug: "bar-39-sosua",
    category: "sports",
    format: "physical",
    trending: true,
    sourceUrl: "https://www.facebook.com/events/1614506996278636",
    imageEmoji: "🥊",
  },
  ...ATLETICOS_HOME_GAMES_ES,
  {
    id: "cabarete-classic-2026",
    title: "Cabarete Classic 2026",
    description:
      "Cuatro días de windsurf, kitesurf, wingfoil y foil en Playa Cabarete (16–19 jul.). La gran regata de deportes de viento del Caribe — competidores internacionales, clínicas y música nocturna en la playa.",
    date: "2026-07-16",
    endDate: "2026-07-19",
    time: "12:00 AM",
    location: "Cabarete",
    venue: "Playa Cabarete",
    venueSlug: "kite-beach",
    address: "Residencial Mañanero, Cabarete",
    category: "sports",
    format: "physical",
    trending: true,
    sourceUrl: "https://www.facebook.com/events/4550504901861035/",
    imageEmoji: "🏄",
  },
  {
    id: "womens-reconnection-kite-camp-2026",
    title: "Women's Reconnection Kite Camp",
    description:
      "Campamento de kite de 7 noches para mujeres en la playa de Cabarete — flow, reconexión y sesiones de kite con la instructora IKO Ariadna Rabasa. Cupos early bird disponibles.",
    date: "2026-08-01",
    endDate: "2026-08-08",
    time: "12:00 AM",
    location: "Cabarete",
    venue: "Playa Cabarete",
    venueSlug: "kite-beach",
    category: "sports",
    format: "physical",
    trending: true,
    sourceUrl: "https://www.facebook.com/events/1683911749456298/",
    imageEmoji: "🏄",
  },
  {
    id: "ingest-18th-annual-cabarete-butterfly-effect",
    title: "18.º Cabarete Butterfly Effect",
    description:
      "Festival de cinco días de deportes acuáticos para mujeres en Cabarete (7–11 jul): clínicas de SUP, yoga, limpieza de playa, crucero en catamarán y la travesía en remo por el río. Consulta el sitio oficial para horarios e inscripción.",
    date: "2026-07-07",
    endDate: "2026-07-11",
    time: "9:00 AM – 9:00 PM",
    location: "Cabarete",
    venue: "Kite Beach y Cabarete",
    address: "Carretera 5",
    venueSlug: "kite-beach",
    category: "festivals",
    format: "physical",
    trending: true,
    sourceUrl: "https://www.cabaretebutterflyeffect.com/",
    imageEmoji: "🏄",
  },
  {
    id: "cabarete-pilates-reformer",
    title: "Clase Grupal de Pilates Reformer",
    description:
      "Sesiones grupales de Pilates Reformer en Cabarete con Rafaella Cirillo (mar y jue 9 AM). La dirección del estudio se confirma al reservar — DM o WhatsApp +1 809 460 5777. Código RC-pilates para la primera clase.",
    date: "2026-07-08",
    time: "9:00 AM – 10:00 AM",
    location: "Cabarete",
    venue: "Rafaella's Studio",
    category: "health-wellness",
    format: "physical",
    recurrence: "weekly",
    recurrenceDays: [2, 4],
    sourceUrl: "https://www.facebook.com/events/981611704653706/",
    imageEmoji: "🧘",
  },
  {
    id: "feria-artesanal-verano-2026",
    title: "Feria Artesanal Verano 2026",
    description:
      "La Feria Artesanal de Verano 2026 se lleva a cabo del 10 al 26 de julio en la Plaza Independencia (el Parque Central de Puerto Plata). El evento reúne a más de 120 artesanos locales y se encuentra abierto todos los días en un horario de 8:00 a.m. a 9:00 p.m. Allí podrás disfrutar de piezas hechas a mano, exhibiciones culturales, arte, souvenirs y caretas de cabezudos. Esta iniciativa tiene como objetivo impulsar el talento de los artistas locales y acercar la artesanía dominicana a visitantes y residentes.",
    date: "2026-07-10",
    endDate: "2026-07-26",
    time: "8:00 AM – 9:00 PM",
    location: "Puerto Plata",
    venue: "Plaza Independencia (Parque Central)",
    venueSlug: "plaza-independencia",
    address: "Calle San Felipe, Puerto Plata",
    category: "festivals",
    categories: ["culture"],
    format: "physical",
    trending: true,
    isFree: true,
    sourceUrl: "https://www.facebook.com/share/18vHNaoe69/",
    imageEmoji: "🎨",
  },
  {
    id: "puerto-plata-carnaval-2026",
    title: "Carnaval Puerto Plata 2026",
    description:
      "Carnaval Puerto Plata 2026 en el Malecón — desfiles dominicales cada febrero (1, 8, 15 y 22 feb.) culminando con el Gran Desfile Final el 1 de marzo en el Anfiteatro La Puntilla. Caretas taimáscaro, comparsas y cultura folclórica dominicana.",
    date: "2026-02-01",
    endDate: "2026-03-01",
    time: "2:00 PM – 8:00 PM",
    location: "Puerto Plata",
    venue: "Malecón de Puerto Plata y Anfiteatro La Puntilla",
    venueSlug: "malecon-puerto-plata",
    category: "festivals",
    format: "physical",
    trending: true,
    sourceUrl:
      "https://sea-horse-ranch.com/carnival-celebrations-in-the-dominican-republic/",
    imageEmoji: "🎭",
  },
  {
    id: "malecon-morning-wellness-walk",
    title: "Caminata matutina de wellness en el Malecón",
    description:
      "Caminantes y corredores temprano en el Malecón de Puerto Plata — brisa marina, grupos de estiramiento y ritual diario de bienestar en el paseo marítimo.",
    date: "2026-01-01",
    time: "6:00 AM – 8:00 AM",
    location: "Puerto Plata",
    venue: "Malecón de Puerto Plata",
    venueSlug: "malecon-puerto-plata",
    category: "health-wellness",
    format: "physical",
    recurrence: "daily",
    imageEmoji: "🚶",
  },
  {
    id: "sancocho-sabados-pingui",
    title: "Sancocho Sábados en Pingüi",
    description:
      "¡Los sábados tienen sabor a tradición! Disfruta de nuestro sancocho frente al mar en Playa El Pueblito en Pingüi Bar. Reúne a tus amigos y familiares para compartir una tarde de comida dominicana con vista al océano (12–4 PM).",
    date: "2026-07-11",
    time: "12:00 PM – 4:00 PM",
    location: "Puerto Plata",
    venue: "Pingüi Bar Restaurant & Piña Colada House",
    venueSlug: "pingui-bar",
    address: "C. B, Puerto Plata 57000",
    lat: 19.773903,
    lng: -70.652704,
    category: "food-drinks",
    format: "physical",
    recurrence: "weekly",
    recurrenceDay: 6,
    sourceUrl:
      "https://www.facebook.com/events/1547520700301499/1547522116968024/",
    imageEmoji: "🍲",
  },
  {
    id: "el-colibri-karaoke-battle-2026",
    title: "Karaoke Battle El Colibri — Jueves",
    description:
      "Karaoke los jueves en El Colibri Hotel, Sosúa (7 PM–medianoche). Únete al Karaoke Battle de 8 semanas — $20,000 en premios (2 jul–3 sep 2026). Los concursantes deben asistir todos los jueves para seguir elegibles. Inscripción por WhatsApp: +1 917-523-7259.",
    date: "2026-07-02",
    endDate: "2026-09-03",
    time: "7:00 PM – 12:00 AM",
    location: "Sosúa",
    venue: "El Colibri Hotel",
    venueSlug: "el-colibri-hotel",
    address: "141 Pedro Clisante, Sosúa 57600",
    lat: 19.7545,
    lng: -70.519,
    category: "music",
    format: "physical",
    recurrence: "weekly",
    recurrenceDay: 4,
    trending: true,
    sourceUrl: "https://www.elcolibriresort.com/",
    imageEmoji: "🎤",
  },
  {
    id: "inicio-del-campamento-pp-2026",
    title: "Inicio del Campamento",
    description:
      "Inicio de campamento deportivo en el histórico San Felipe, Puerto Plata — organizado por Sin pelos en la lengua. Consulta el evento en Facebook para inscripción.",
    date: "2026-07-10",
    time: "5:00 PM – 8:00 PM",
    location: "Puerto Plata",
    venue: "San Felipe de Puerto Plata",
    venueSlug: "fortaleza-san-felipe",
    category: "sports",
    format: "physical",
    sourceUrl: "https://www.facebook.com/events/1017381540870816/",
    imageEmoji: "⚽",
  },
];

function getWorldCupEvents(locale: Locale): Event[] {
  if (locale === "es") return EL_CAREY_WC2026_EVENTS_ES;
  if (locale === "fr") return EL_CAREY_WC2026_EVENTS_FR;
  return EL_CAREY_WC2026_EVENTS_EN;
}

export function getFallbackEvents(locale: Locale = "en"): Event[] {
  const base =
    locale === "es"
      ? FALLBACK_EVENTS_ES
      : locale === "fr"
        ? FALLBACK_EVENTS_FR
        : FALLBACK_EVENTS_EN;
  const merged = [
    ...getRecurringEvents(locale),
    ...base,
    ...getWorldCupEvents(locale),
  ];
  return materializeEventDates(filterRemovedSeedEvents(merged)).map(
    withResolvedCategories,
  );
}

/** Lookup before date materialization — keeps expired one-offs resolvable for share links. */
export function getFallbackEventById(
  id: string,
  locale: Locale = "en",
): Event | undefined {
  const base =
    locale === "es"
      ? FALLBACK_EVENTS_ES
      : locale === "fr"
        ? FALLBACK_EVENTS_FR
        : FALLBACK_EVENTS_EN;
  const merged = filterRemovedSeedEvents([
    ...getRecurringEvents(locale),
    ...base,
    ...getWorldCupEvents(locale),
  ]);
  return merged.find((e) => e.id === id);
}

export function getFallbackForCategory(
  category: EventCategory,
  locale: Locale = "en",
): Event[] {
  return getFallbackEvents(locale).filter((e) => eventInCategory(e, category));
}
