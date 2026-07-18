import type { Locale } from "@/i18n/config";
import { resolveLocalizedText, type LocalizedText } from "@/lib/localized-text";
import type { Venue } from "@/lib/types";

type VenueCopy = {
  name?: LocalizedText;
  description?: LocalizedText;
};

/** Localized venue copy — English defaults live in venues-seed.ts. */
export const VENUE_I18N: Record<string, VenueCopy> = {
  "lax-cabarete": {
    description: {
      es: "Bar frente al mar y epicentro de música en vivo en la bahía de Cabarete. Noches de reggae, conciertos y sesiones al atardecer.",
      fr: "Bar en bord de mer et haut lieu de la musique live sur la baie de Cabarete. Soirées reggae, concerts et sessions au coucher du soleil.",
    },
  },
  "malecon-puerto-plata": {
    description: {
      es: "Paseo marítimo con conciertos gratuitos, festivales gastronómicos y reuniones locales.",
      fr: "Promenade en bord de mer avec concerts gratuits, festivals gastronomiques et rassemblements locaux.",
    },
  },
  "kite-beach": {
    description: {
      es: "Playa mundialmente famosa de kite surf. Competiciones, deportes de playa y encuentros de fin de semana.",
      fr: "Plage de kite surf mondialement connue. Compétitions, sports de plage et rencontres le week-end.",
    },
  },
  "liquid-blue-cabarete": {
    description: {
      es: "Escuela de deportes acuáticos en Kite Beach desde 2014 — kite, wing, eFoil, surf y yoga al amanecer en la arena. Tienda en Calle Principal #87.",
      fr: "École de sports nautiques sur Kite Beach depuis 2014 — kite, wing, eFoil, surf et yoga au lever du soleil sur le sable. Boutique au Calle Principal #87.",
    },
  },
  "el-batey-sosua": {
    description: {
      es: "El centro peatonal de Sosúa — acceso a la playa, la calle de restaurantes y bares Pedro Clisante, tiendas y cafés de día, y sociales de salsa y open mic al caer la noche.",
      fr: "Le centre-ville piéton de Sosúa — accès à la plage, la rue de restaurants et bars Pedro Clisante, boutiques et cafés en journée, puis soirées salsa et open mic à la tombée de la nuit.",
    },
  },
  "hard-rock-sosua": {
    description: {
      es: "Escenario de dos pisos en el centro sobre la Calle Duarte — giras, bandas de rock locales y tributos en la mayor sala de música en vivo de la Costa Norte.",
      fr: "Scène sur deux étages en centre-ville sur la Calle Duarte — tournées, groupes de rock locaux et hommages sur la plus grande scène live de la Côte Nord.",
    },
  },
  "castaways-sosua": {
    description: {
      es: "Club expat en Casa Linda con bandas de rock clásico, alitas y ambiente de pub norteamericano.",
      fr: "Club expat à Casa Linda avec groupes de rock classique, ailes de poulet et ambiance pub nord-américaine.",
    },
  },
  "hotel-voramar-sosua": {
    description: {
      es: "Hotel boutique junto a la piscina con noches de BBQ los viernes y bandas de rock y pop en vivo — administrado por alemanes, a pasos de Playa Chiquita.",
      fr: "Hôtel boutique au bord de la piscine avec BBQ le vendredi et groupes rock et pop en live — tenu par des Allemands, à deux pas de Playa Chiquita.",
    },
  },
  "smileys-bar-sosua": {
    description: {
      es: "Bar al aire libre en el patio de la Calle Pedro Clisante — música en vivo, karaoke y público expat los fines de semana.",
      fr: "Bar en plein air dans la cour de la Calle Pedro Clisante — musique live, karaoké et clientèle expat le week-end.",
    },
  },
  "finish-line-sosua": {
    description: {
      es: "Pub expat en la franja de Sosúa — sets acústicos, bandas de covers y ambiente de sports bar entre semana y los fines de semana.",
      fr: "Pub expat sur le strip de Sosúa — sets acoustiques, groupes de reprises et ambiance sports bar en semaine et le week-end.",
    },
  },
  "playa-sosua": {
    description: {
      es: "Playa pública principal en la bahía de Sosúa — agua tranquila, snorkel en el arrecife, bares de playa y deportes pickup semanales en la arena.",
      fr: "Plage publique principale de la baie de Sosúa — eau calme, snorkeling sur le récif, bars de plage et sports pickup hebdomadaires sur le sable.",
    },
  },
  "bar-39-sosua": {
    description: {
      es: "Bar frente al mar en Playa Sosúa — vistas al océano, Presidentes frías y música en vivo los fines de semana por la noche.",
      fr: "Bar en bord de mer sur Playa Sosúa — vue sur l'océan, Presidentes bien fraîches et musique live le week-end en soirée.",
    },
  },
  "cheers-bar-sosua": {
    description: {
      es: "Pub deportivo de expats en la Calle Pedro Clisante — bandas de rock y blues, deportes en pantalla grande, comida de pub y música en vivo semanal.",
      fr: "Pub sportif expat sur la Calle Pedro Clisante — groupes rock et blues, sports sur grand écran, cuisine de pub et musique live chaque semaine.",
    },
  },
  "sosua-jewish-museum": {
    description: {
      es: "Museo y sinagoga en honor al asentamiento judío refugiado de 1940 — fotografías, artefactos y documentales sobre el patrimonio único de Sosúa junto a Casa Marina.",
      fr: "Musée et synagogue honorant la colonie de réfugiés juifs de 1940 — photos, artefacts et films documentaires sur le patrimoine unique de Sosúa, près de Casa Marina.",
    },
  },
  "sosua-diving-center": {
    description: {
      es: "Centro de buceo PADI en La Puntilla — inmersiones en arrecife, snorkel y excursiones en bote por más de 12 sitios de la bahía de Sosúa con guías locales experimentados.",
      fr: "Centre de plongée PADI à La Puntilla — plongées récif, snorkeling et sorties en bateau sur plus de 12 sites de la baie de Sosúa avec des guides locaux expérimentés.",
    },
  },
  "natura-cabana": {
    name: {
      es: "Natura Cabana",
      fr: "Natura Cabana",
    },
    description: {
      es: "Eco-resort boutique en Perla Marina — templo de yoga frente al mar y música en vivo los sábados en el restaurante (acústico, jazz y fusión caribeña).",
      fr: "Éco-resort boutique à Perla Marina — temple de yoga face à l'océan et musique live le samedi au restaurant (acoustique, jazz et fusion caribéenne).",
    },
  },
  "el-parq-cabarete": {
    description: {
      es: "Food park al aire libre cerca de Encuentro — puestos de comida callejera, mesas comunes, karaoke de Shaka Bar los jueves (7:30–9:30 PM), Noche Latina de Ninafrika Dance los viernes desde las 7 PM y bandas en vivo los sábados.",
      fr: "Food park en plein air près d'Encuentro — stands de street food, tables partagées, karaoké de Shaka Bar le jeudi (19 h 30–21 h 30), Noche Latina de Ninafrika Dance le vendredi dès 19 h et groupes live le samedi.",
    },
  },
  "parada-tipica-el-choco": {
    description: {
      es: "Restaurante en la carretera Sosúa–Cabarete — platos dominicanos e internacionales, pista de baile y música en vivo los martes, favorito de locales y residentes.",
      fr: "Restaurant sur la route Sosúa–Cabarete — cuisine dominicaine et internationale, piste de danse et musique live le mardi, prisé des locaux et résidents.",
    },
  },
  "blue-jacktar-playa-dorada": {
    description: {
      es: "Centro de convenciones del resort en Playa Dorada — conciertos de merengue y tributos con boletería local en Puerto Plata.",
      fr: "Centre de congrès du resort à Playa Dorada — concerts de merengue et hommages avec billetterie locale à Puerto Plata.",
    },
  },
  "d-classico-sosua": {
    description: {
      es: "Bar de merengue y bachata en el corazón de El Batey — ritmos locales, multitudes bailando y un clásico de la vida nocturna de Sosúa en Pedro Clisante.",
      fr: "Bar merengue et bachata au cœur d'El Batey — rythmes locaux, foule qui danse et adresse classique de la nuit sosuate sur Pedro Clisante.",
    },
  },
  "ground-zero-disco": {
    description: {
      es: "Discoteca de la Costa Norte en la carretera Puerto Plata–Sosúa frente al Aeropuerto Gregorio Luperón — reggaetón, dembow, típico y fiestas hasta tarde (cerrado lun–mié).",
      fr: "Discothèque de la Côte Nord sur la route Puerto Plata–Sosúa face à l'aéroport Gregorio Luperón — reggaeton, dembow, típico et soirées tardives (fermé lun–mer).",
    },
  },
  "la-chabola-cabarete": {
    description: {
      es: "Bar de pizza del barrio en el Callejón de la Loma — pizzas al horno de piedra, músicos locales y open mic los miércoles con público asequible de Cabarete.",
      fr: "Bar à pizza de quartier dans le Callejón de la Loma — pizzas au four à pierre, musiciens locaux et open mic le mercredi dans une ambiance abordable à Cabarete.",
    },
  },
  "voyvoy-cabarete": {
    description: {
      es: "Restaurante frente al mar y punto de vida nocturna en la bahía de Cabarete — jams de open mic, sesiones de DJ y fiestas de baile los fines de semana con vistas a la bahía.",
      fr: "Restaurant en bord de mer et spot de nuit sur la baie de Cabarete — jams open mic, sets DJ et soirées danse le week-end avec vue sur la baie.",
    },
  },
  "la-casita-de-papi": {
    description: {
      es: "Icónico restaurante de mariscos frente al mar en la playa central de Cabarete — paella, pescado a la parrilla y cenas al atardecer bajo palmeras desde los años 90.",
      fr: "Restaurant emblématique de fruits de mer en bord de mer sur la plage centrale de Cabarete — paella, poisson grillé et dîners au coucher du soleil sous les palmiers depuis les années 1990.",
    },
  },
  "anfiteatro-la-puntilla": {
    description: {
      es: "Anfiteatro frente al mar en La Puntilla — conciertos al aire libre, desfiles de carnaval y espectáculos culturales con vistas al Atlántico.",
      fr: "Amphithéâtre en bord de mer à La Puntilla — concerts en plein air, défilés de carnaval et spectacles culturels face à l'Atlantique.",
    },
  },
  "cowork-cabarete": {
    description: {
      es: "Espacio para trabajadores remotos con meetups de startups y charlas tech.",
      fr: "Espace pour nomades digitaux avec meetups startups et talks tech.",
    },
  },
  "ocean-world": {
    description: {
      es: "Parque de aventura marina en Cofresí — nado con delfines, encuentros con leones marinos y tiburones, snorkel y laguna con toboganes acuáticos.",
      fr: "Parc d'aventure marine à Cofresí — nage avec les dauphins, rencontres avec otaries et requins, snorkeling et lagon avec toboggans aquatiques.",
    },
  },
  "sea-horse-ranch": {
    description: {
      es: "Resort residencial y club de tenis en la Ruta 5 entre Cabarete y Sosúa, con mercados locales y reuniones comunitarias.",
      fr: "Resort résidentiel et club de tennis sur la Route 5 entre Cabarete et Sosúa, accueillant marchés locaux et rassemblements communautaires.",
    },
  },
  "senor-rock-playa-dorada": {
    description: {
      es: "Bar y grill en Playa Dorada Plaza con bandas en vivo cada noche — rock, covers de pop y clásicos caribeños con cena y tragos.",
      fr: "Bar & grill à Playa Dorada Plaza avec groupes live chaque soir — rock, reprises pop et classiques caribéens avec dîner et boissons.",
    },
  },
  "cremo-cigar-bar": {
    description: {
      es: "Salón de puros en el centro con salsa semanal, música bohemia en vivo y karaoke — cócteles, tapas y rones dominicanos.",
      fr: "Salon à cigares en centre-ville avec salsa hebdomadaire, musique bohème live et karaoké — cocktails, tapas et rhums dominicains.",
    },
  },
  "big-lees-beach-bar": {
    description: {
      es: "Bar frente al mar en Cosita Rica desde 2011 — rock clásico, noches de karaoke y vistas al Atlántico a pasos de la arena.",
      fr: "Bar en bord de mer à Cosita Rica depuis 2011 — rock classique, soirées karaoké et vue sur l'Atlantique à deux pas du sable.",
    },
  },
  "pingui-bar": {
    description: {
      es: "Bar de playa en Playa El Pueblito — piñas coladas, comida típica dominicana y ambiente frente al mar los fines de semana.",
      fr: "Bar de plage à Playa El Pueblito — piñas coladas, cuisine dominicaine et ambiance en bord de mer le week-end.",
    },
  },
  "el-carey-puerto-plata": {
    description: {
      es: "Lugar de día y noche en la playa de Costambar (Calle Reina Isabel) con deportes en vivo en pantalla gigante, tragos y vida nocturna local.",
      fr: "Spot jour et nuit sur la plage de Costambar (Calle Reina Isabel) avec sports en direct sur écran géant, boissons et vie nocturne locale.",
    },
  },
  "el-colibri-hotel": {
    description: {
      es: "Hotel boutique tropical en el centro de Sosúa — bar junto a la piscina, karaoke los jueves y vida nocturna local.",
      fr: "Hôtel boutique tropical au centre de Sosúa — bar au bord de la piscine, karaoké le jeudi et vie nocturne locale.",
    },
  },
  "fortaleza-san-felipe": {
    description: {
      es: "Fortaleza y museo español del siglo XVI con vistas al Atlántico — cañones, historia colonial y atardeceres desde La Puntilla.",
      fr: "Forteresse et musée espagnol du XVIe siècle surplombant l'Atlantique — canons, histoire coloniale et couchers de soleil depuis La Puntilla.",
    },
  },
  "museo-ambar": {
    description: {
      es: "Mansión victoriana en el centro histórico con fósiles de ámbar dominicano — lagartos, insectos y especímenes de la era jurásica.",
      fr: "Manoir victorien dans le centre historique présentant des fossiles d'ambre dominicain — lézards, insectes et spécimens de l'ère jurassique.",
    },
  },
  "charcos-damajagua": {
    description: {
      es: "Parque de aventura en cascadas en las colinas del Corredor Norte — caminatas guiadas, toboganes naturales y pozas turquesas a una hora de Puerto Plata.",
      fr: "Parc d'aventure aux cascades dans les collines du corridor nord — randonnées guidées, toboggans naturels et bassins turquoise à une heure de Puerto Plata.",
    },
  },
  "teleferico-puerto-plata": {
    description: {
      es: "Teleférico caribeño a la cima del Pico Isabel de Torres — estatua del Cristo, jardines botánicos y vistas panorámicas.",
      fr: "Téléphérique caribéen au sommet du Pico Isabel de Torres — statue du Christ, jardins botaniques et vues panoramiques.",
    },
  },
  "cayo-arena": {
    description: {
      es: "Isla banco de arena (Cayo Paraíso) en bote desde Punta Rucia — agua turquesa poco profunda, arena blanca y snorkel.",
      fr: "Île-banc de sable (Cayo Paraíso) en bateau depuis Punta Rucia — eau turquoise peu profonde, sable blanc et snorkeling.",
    },
  },
  "plaza-independencia": {
    name: {
      es: "Parque de la Independencia (Plaza Independencia)",
      fr: "Parc de l'Indépendance (Plaza Independencia)",
    },
    description: {
      es: "Parque central de Puerto Plata (Plaza Independencia) en el centro histórico — plaza sombreada, vistas a la catedral y punto de encuentro para festivales y eventos comunitarios.",
      fr: "Parc central de Puerto Plata (Plaza Independencia) dans le centre historique — place ombragée, vue sur la cathédrale et lieu de rassemblement pour festivals et événements communautaires.",
    },
  },
  "paseo-dona-blanca": {
    description: {
      es: "Calle peatonal de adoquines rosados en honor a la pionera del turismo Bianca Franceschini — detalles victorianos, spots para fotos y cafés entre la Calle Beller y John F. Kennedy.",
      fr: "Allée piétonne pavée de rose en l'honneur de la pionnière du tourisme Bianca Franceschini — touches victoriennes, spots photo et cafés entre la Calle Beller et John F. Kennedy.",
    },
  },
  "calle-sombrillas": {
    description: {
      es: "178 sombrillas multicolores sobre la Calle San Felipe en el centro histórico — paseo fotográfico gratuito entre tiendas artesanales, cafés y vendedores locales.",
      fr: "178 parapluies multicolores au-dessus de la Calle San Felipe dans le centre historique — balade photo gratuite entre boutiques artisanales, cafés et vendeurs locaux.",
    },
  },
  "fun-city": {
    description: {
      es: "El parque de go-karts más grande de República Dominicana en la Carretera 5 — Cyclone, Sprint 500, Grand Prix y autos chocadores, además de un parque infantil cerca de Playa Dorada.",
      fr: "Le plus grand parc de go-karts de République dominicaine sur la Highway 5 — Cyclone, Sprint 500, Grand Prix et autos tamponneuses, plus une aire de jeux près de Playa Dorada.",
    },
  },
  "monkeyland-puerto-plata": {
    description: {
      es: "Santuario en la jungla de las colinas de Imbert — alimenta monos ardilla, pasea por senderos botánicos y visita una casa de campo tradicional en tours en camión safari con recogida en hotel.",
      fr: "Sanctuaire dans la jungle des collines d'Imbert — nourrissez des singes écureuils, promenez-vous sur des sentiers botaniques et visitez une maison de campagne traditionnelle en tours safari avec prise en charge à l'hôtel.",
    },
  },
  "coconut-cove": {
    description: {
      es: "Parque de aventura junto al acantilado — tirolesa oceánica de 1.200 pies, rutas en ATV y buggy, playa privada y deportes acuáticos al oeste de Puerto Plata.",
      fr: "Parc d'aventure en bord de falaise — tyrolienne océanique de 365 m, pistes ATV et buggy, plage privée et sports nautiques à l'ouest de Puerto Plata.",
    },
  },
  "brugal-rum-center": {
    description: {
      es: "Destilería de ron en funcionamiento y centro de visitantes en la carretera de Maimón — tours guiados, bodegas de añejamiento y degustaciones de rones dominicanos premiados.",
      fr: "Distillerie de rhum en activité et centre d'accueil sur la route de Maimón — visites guidées, chais de vieillissement et dégustations de rhums dominicains primés.",
    },
  },
  "del-oro-chocolate-factory": {
    description: {
      es: "Fábrica de chocolate orgánico en funcionamiento en Barrio Las Yaguitas — tour guiado gratuito con degustaciones, video sobre el cacao y tienda de regalos en la Calle Principal.",
      fr: "Chocolaterie bio en activité à Barrio Las Yaguitas — visite guidée gratuite avec dégustations, court film sur le cacao et boutique cadeaux sur la Calle Principal.",
    },
  },
  "hacienda-cufa": {
    description: {
      es: "Finca de cacao orgánico en La Mariposa, Guananico — sendero sensorial de siete paradas, chocolate caliente tradicional, choco terapia, almuerzo dominicano y baño en el río.",
      fr: "Ferme de cacao bio à La Mariposa, Guananico — parcours sensoriel en sept étapes, chocolat chaud traditionnel, choco-thérapie, déjeuner dominicain et baignade dans la rivière.",
    },
  },
  "tabacalera-cremo": {
    description: {
      es: "Fábrica de puros en el centro, en la Calle San Felipe — recorre el piso de producción, conoce a los maestros torcedores cubanos, bebida de bienvenida y un puro Cremo de regalo en el tour gratuito.",
      fr: "Fabrique de cigares en centre-ville sur la Calle San Felipe — visitez l'atelier, rencontrez les maîtres rouleurs cubains, boisson de bienvenue et cigare Cremo offert sur la visite gratuite.",
    },
  },
  "vivonte-cigar-factory": {
    description: {
      es: "Fábrica de puros educativa a una cuadra del Parque Central — recorrido de semilla a cigarro, salas de fermentación y añejamiento, y demostración de enrollado en la Calle Separación.",
      fr: "Fabrique de cigares pédagogique à un pâté de maisons du Parque Central — parcours de la graine au cigare, salles de fermentation et de vieillissement, et démonstration de roulage sur la Calle Separación.",
    },
  },
  "freestyle-catamaran": {
    description: {
      es: "Cruceros en catamarán desde Playa Dorada hasta la bahía de Sosúa — dos paradas de snorkel, almuerzo, bebidas y música en vivo a bordo. Recogida en hotel incluida.",
      fr: "Croisières en catamaran au départ de Playa Dorada vers la baie de Sosúa — deux arrêts snorkeling, déjeuner, boissons et musique live à bord. Prise en charge à l'hôtel incluse.",
    },
  },
  "outback-adventures": {
    description: {
      es: "Camiones safari descubiertos por pueblos rurales, plantaciones de café, escuelas locales y una playa escondida — un clásico de Puerto Plata desde 2004. Recogida en hotel en la costa norte.",
      fr: "Camions safari à ciel ouvert à travers villages ruraux, plantations de café, écoles locales et une plage cachée — un classique de Puerto Plata depuis 2004. Prise en charge à l'hôtel sur la côte nord.",
    },
  },
  "hms-valeria": {
    description: {
      es: "Restaurante de mariscos con temática de barco en el Hotel Casa Valeria — noches de paella los sábados y especiales dominicanos los domingos a pasos de la playa de Sosúa.",
      fr: "Restaurant de fruits de mer sur le thème d'un navire au Casa Valeria Hotel — soirées paella le samedi et spécialités dominicaines le dimanche à deux pas de la plage de Sosúa.",
    },
  },
  "rum-legacy-museum": {
    description: {
      es: "Museo inmersivo del patrimonio del ron en el centro histórico — recorrido con audioguía desde la caña de azúcar hasta degustaciones guiadas en la Calle Beller.",
      fr: "Musée immersif du patrimoine rhumier dans le centre historique — visite audio-guidée de la canne à sucre aux dégustations guidées sur la Calle Beller.",
    },
  },
  "la-confluencia-museum": {
    description: {
      es: "Galería etnográfica sobre el patrimonio taíno, africano y colonial — exposiciones bilingües y recorridos con QR en el centro histórico.",
      fr: "Galerie ethnographique retraçant l'héritage taïno, africain et colonial — expositions bilingues et visites guidées par QR dans le centre historique.",
    },
  },
  "gregorio-luperon-museum": {
    description: {
      es: "Casa-museo victoriana en honor al héroe de la Restauración — salas de época, fotografías y mural en el patio de la Calle 12 de Julio.",
      fr: "Maison-musée victorienne dédiée au héros de la Restauration — pièces d'époque, photographies et fresque dans la cour de la Calle 12 de Julio.",
    },
  },
  "macorix-house-of-rum": {
    description: {
      es: "Tours y degustaciones en la bodega de ron — video histórico, barricas de añejamiento y muestras de ron Macorix en la Av. Francisco Alberto Caamaño.",
      fr: "Visites et dégustations à la cave à rhum — vidéo historique, fûts de vieillissement et échantillons de rhum Macorix sur l'Av. Francisco Alberto Caamaño.",
    },
  },
  "casa-de-la-cultura": {
    description: {
      es: "Centro cultural victoriano frente al Parque Central — exposiciones de arte rotativas, lecturas de poesía, teatro y danza folclórica.",
      fr: "Centre culturel victorien face au Parque Central — expositions d'art tournantes, lectures de poésie, théâtre et danse folklorique.",
    },
  },
  "handmade-the-brand": {
    description: {
      es: "Taller de alpargatas en el centro histórico — cose tu propio par con artesanos maestros en la Calle Duarte. Incluye tentempiés, cava y materiales; desde €99,90 en Eventbrite.",
      fr: "Atelier d'espadrilles dans le centre historique — cousez votre paire avec des artisans maîtres sur la Calle Duarte. Collations, cava et matériel inclus ; à partir de 99,90 € sur Eventbrite.",
    },
  },
  "parque-jose-briceno": {
    description: {
      es: "Estadio de béisbol renovado con 6.000 asientos en la Av. Hermanas Mirabal — local de los Atléticos de Puerto Plata en la Liga Nacional de Béisbol de Verano.",
      fr: "Stade de baseball rénové de 6 000 places sur l'Av. Hermanas Mirabal — domicile des Atléticos de Puerto Plata en Liga Nacional de Béisbol de Verano.",
    },
  },
  "club-deportivo-fantastico": {
    description: {
      es: "Club deportivo techado en Calle 1ra (barrio Haití) — cancha de baloncesto local, sede de Al Sena Athletics y de la ASA Survival Series.",
      fr: "Club sportif couvert sur Calle 1ra (quartier Haití) — terrain de basket local, domicile d'Al Sena Athletics et de l'ASA Survival Series.",
    },
  },
  "disco-club-brugal": {
    description: {
      es: "Discoteca y sala de conciertos en los Depósitos de Brugal, Calle Duarte — shows con entradas para artistas dominicanos en gira.",
      fr: "Discothèque et salle de concert aux Depósitos de Brugal, Calle Duarte — spectacles avec billets pour artistes dominicains en tournée.",
    },
  },
  "paella-pop-el-pueblito": {
    description: {
      es: "Paella española frente al mar de Laia y Nico en Playa El Pueblito — soft opening julio 2026 pero listado como cerrado temporalmente en Google Maps; horario oficial por confirmar. Paella POP sigue sirviendo diario en Green One Playa Dorada.",
      fr: "Paella espagnole en bord de mer par Laia et Nico à Playa El Pueblito — soft opening juillet 2026 mais indiqué temporairement fermé sur Google Maps ; horaires officiels à confirmer. Paella POP sert toujours tous les jours à Green One Playa Dorada.",
    },
  },
  "paella-pop-green-one": {
    description: {
      es: "Cocina original de Paella POP en One Club, Green One Playa Dorada — paella y platos españoles en el clubhouse del resort de golf.",
      fr: "Cuisine originale de Paella POP au One Club, Green One Playa Dorada — paella et plats espagnols dans le clubhouse du resort de golf.",
    },
  },
  "playa-dorada-golf": {
    description: {
      es: "Campo de campeonato de 18 hoyos de Robert Trent Jones Sr. en el complejo Playa Dorada — sede del Puerto Plata Golf Classic y eventos de turismo deportivo de Ashonorte.",
      fr: "Parcours de championnat 18 trous de Robert Trent Jones Sr. dans le complexe Playa Dorada — siège du Puerto Plata Golf Classic et des événements de tourisme sportif d'Ashonorte.",
    },
  },
  "playa-encuentro": {
    description: {
      es: "La playa de surf más importante de la costa norte entre Cabarete y Sosúa — olas de arrecife para todos los niveles y sede oficial de surf de los Juegos CAC 2026.",
      fr: "Plage de surf phare de la côte nord entre Cabarete et Sosúa — vagues de récif pour tous niveaux et siège officiel du surf des Jeux CAC 2026.",
    },
  },
  "playa-los-charamicos": {
    description: {
      es: "Playa local de Sosúa al oeste de El Batey — sede del Puerto Plata Beach Soccer y jornadas deportivas familiares frente al mar.",
      fr: "Plage locale de Sosúa à l'ouest d'El Batey — siège du Puerto Plata Beach Soccer et journées sportives familiales en bord de mer.",
    },
  },
};

export function localizeVenue(venue: Venue, locale: Locale): Venue {
  const copy = VENUE_I18N[venue.slug];
  if (!copy) return venue;

  return {
    ...venue,
    name: resolveLocalizedText(copy.name, venue.name, locale),
    description: resolveLocalizedText(copy.description, venue.description, locale),
  };
}

export function localizeVenues(venues: Venue[], locale: Locale): Venue[] {
  return venues.map((venue) => localizeVenue(venue, locale));
}
