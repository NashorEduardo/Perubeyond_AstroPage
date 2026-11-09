import fs from 'node:fs';
import path from 'node:path';

const BLOG_CONTENT_SPECS = {
  'es-seguro-viajar-a-peru-consejos-para-visitantes': {
    album: [
      '/images/Blog/es-seguro-viajar-a-peru-consejos-para-visitantes/01-malecon-miraflores-lima-seguridad.webp',
      '/images/Blog/es-seguro-viajar-a-peru-consejos-para-visitantes/02-barranco-puente-suspiros-turismo.webp',
      '/images/Blog/es-seguro-viajar-a-peru-consejos-para-visitantes/03-plaza-armas-cusco-patrullaje-turistico.webp',
      '/images/Blog/es-seguro-viajar-a-peru-consejos-para-visitantes/04-valle-sagrado-pueblo-tranquilo-ollantaytambo.webp',
      '/images/Blog/es-seguro-viajar-a-peru-consejos-para-visitantes/05-asistencia-turistica-peru-viajeros.webp',
      '/images/Blog/es-seguro-viajar-a-peru-consejos-para-visitantes/06-transporte-seguro-aeropuerto-lima.webp',
      '/images/Blog/es-seguro-viajar-a-peru-consejos-para-visitantes/07-mercado-san-pedro-cusco-seguridad.webp'
    ],
    grids: {
      es: [
        {
          headingHook: '## 3.',
          img1: '/images/Blog/es-seguro-viajar-a-peru-consejos-para-visitantes/01-malecon-miraflores-lima-seguridad.webp',
          alt1: 'Malecón de Miraflores seguro en Lima',
          cap1: 'Malecón de Miraflores: ciclovías y parques con resguardo municipal permanente.',
          img2: '/images/Blog/es-seguro-viajar-a-peru-consejos-para-visitantes/02-barranco-puente-suspiros-turismo.webp',
          alt2: 'Distrito turístico de Barranco en Lima',
          cap2: 'Barranco bohemio: iluminación nocturna, restaurantes y ambiente peatonal seguro.'
        },
        {
          headingHook: '## 4.',
          img1: '/images/Blog/es-seguro-viajar-a-peru-consejos-para-visitantes/03-plaza-armas-cusco-patrullaje-turistico.webp',
          alt1: 'Plaza de Armas de Cusco resguardada por Policía de Turismo',
          cap1: 'Centro Histórico del Cusco: patrullaje continuo de POLTUR de día y noche.',
          img2: '/images/Blog/es-seguro-viajar-a-peru-consejos-para-visitantes/04-valle-sagrado-pueblo-tranquilo-ollantaytambo.webp',
          alt2: 'Ollantaytambo en el Valle Sagrado de los Incas',
          cap2: 'Ollantaytambo: comunidad andina tranquila y punto de partida seguro hacia el tren.'
        },
        {
          headingHook: '## 5.',
          img1: '/images/Blog/es-seguro-viajar-a-peru-consejos-para-visitantes/05-asistencia-turistica-peru-viajeros.webp',
          alt1: 'Módulo de orientación y asistencia turística en Perú',
          cap1: 'Red de Asistencia IPERÚ: soporte oficial 24/7 en aeropuertos y plazas principales.',
          img2: '/images/Blog/es-seguro-viajar-a-peru-consejos-para-visitantes/06-transporte-seguro-aeropuerto-lima.webp',
          alt2: 'Transporte oficial y transfers privados en Lima',
          cap2: 'Taxis oficiales autorizados y traslados privados coordinados para traslados sin riesgos.'
        }
      ],
      en: [
        {
          headingHook: '## 3.',
          img1: '/images/Blog/es-seguro-viajar-a-peru-consejos-para-visitantes/01-malecon-miraflores-lima-seguridad.webp',
          alt1: 'Safe Miraflores boardwalk in Lima',
          cap1: 'Miraflores boardwalk: coastal parks and 24/7 municipal patrols.',
          img2: '/images/Blog/es-seguro-viajar-a-peru-consejos-para-visitantes/02-barranco-puente-suspiros-turismo.webp',
          alt2: 'Bohemian tourist district of Barranco Lima',
          cap2: 'Bohemian Barranco: vibrant nightlife, scenic walkways and safe pedestrian streets.'
        },
        {
          headingHook: '## 4.',
          img1: '/images/Blog/es-seguro-viajar-a-peru-consejos-para-visitantes/03-plaza-armas-cusco-patrullaje-turistico.webp',
          alt1: 'Cusco Plaza de Armas patrolled by tourist police',
          cap1: 'Historic Cusco: continuous tourist police protection around the clock.',
          img2: '/images/Blog/es-seguro-viajar-a-peru-consejos-para-visitantes/04-valle-sagrado-pueblo-tranquilo-ollantaytambo.webp',
          alt2: 'Ollantaytambo village in the Sacred Valley',
          cap2: 'Ollantaytambo: peaceful Andean town and secure gateway to the Machu Picchu train.'
        },
        {
          headingHook: '## 5.',
          img1: '/images/Blog/es-seguro-viajar-a-peru-consejos-para-visitantes/05-asistencia-turistica-peru-viajeros.webp',
          alt1: 'Official tourism assistance desk in Peru',
          cap1: 'IPERÚ Assistance Network: 24/7 bilingual traveler support across the country.',
          img2: '/images/Blog/es-seguro-viajar-a-peru-consejos-para-visitantes/06-transporte-seguro-aeropuerto-lima.webp',
          alt2: 'Official airport taxi transfer in Lima',
          cap2: 'Authorized airport transfers and private tourist vehicles for seamless arrivals.'
        }
      ],
      pt: [
        {
          headingHook: '## 3.',
          img1: '/images/Blog/es-seguro-viajar-a-peru-consejos-para-visitantes/01-malecon-miraflores-lima-seguridad.webp',
          alt1: 'Calçadão seguro de Miraflores em Lima',
          cap1: 'Orla de Miraflores: ciclovias e parques costeiros com patrulhamento 24 horas.',
          img2: '/images/Blog/es-seguro-viajar-a-peru-consejos-para-visitantes/02-barranco-puente-suspiros-turismo.webp',
          alt2: 'Bairro boêmio e turístico de Barranco em Lima',
          cap2: 'Barranco boêmio: gastronomia premiada e ambiente seguro para caminhar à noite.'
        },
        {
          headingHook: '## 4.',
          img1: '/images/Blog/es-seguro-viajar-a-peru-consejos-para-visitantes/03-plaza-armas-cusco-patrullaje-turistico.webp',
          alt1: 'Plaza de Armas de Cusco com segurança turística',
          cap1: 'Centro Histórico de Cusco: presença ativa da Polícia de Turismo dia e noite.',
          img2: '/images/Blog/es-seguro-viajar-a-peru-consejos-para-visitantes/04-valle-sagrado-pueblo-tranquilo-ollantaytambo.webp',
          alt2: 'Vila pacífica de Ollantaytambo no Vale Sagrado',
          cap2: 'Ollantaytambo: atmosfera acolhedora e embarque seguro no trem para Machu Picchu.'
        },
        {
          headingHook: '## 5.',
          img1: '/images/Blog/es-seguro-viajar-a-peru-consejos-para-visitantes/05-asistencia-turistica-peru-viajeros.webp',
          alt1: 'Posto oficial de atendimento ao viajante no Peru',
          cap1: 'Rede de Assistência IPERÚ: suporte oficial gratuito 24/7 para turistas.',
          img2: '/images/Blog/es-seguro-viajar-a-peru-consejos-para-visitantes/06-transporte-seguro-aeropuerto-lima.webp',
          alt2: 'Táxi oficial e traslados privados no aeroporto de Lima',
          cap2: 'Traslados oficiais autorizados e motoristas credenciados para viagens sem preocupações.'
        }
      ]
    },
    featured: {
      es: {
        headingHook: '## 6.',
        img: '/images/Blog/es-seguro-viajar-a-peru-consejos-para-visitantes/07-mercado-san-pedro-cusco-seguridad.webp',
        alt: 'Mercado Central de San Pedro en Cusco',
        cap: 'Mercado Central de San Pedro: un festín de colores y aromas andinos para recorrer con tranquilidad y respeto cultural.'
      },
      en: {
        headingHook: '## 6.',
        img: '/images/Blog/es-seguro-viajar-a-peru-consejos-para-visitantes/07-mercado-san-pedro-cusco-seguridad.webp',
        alt: 'San Pedro Central Market in Cusco',
        cap: 'San Pedro Central Market: a vibrant Andean market experience to explore peacefully with a local certified guide.'
      },
      pt: {
        headingHook: '## 6.',
        img: '/images/Blog/es-seguro-viajar-a-peru-consejos-para-visitantes/07-mercado-san-pedro-cusco-seguridad.webp',
        alt: 'Mercado Central de San Pedro em Cusco',
        cap: 'Mercado de San Pedro: cores, frutas exóticas e artesanatos andinos para vivenciar a cultura local com tranquilidade.'
      }
    }
  },

  'como-organizar-un-viaje-a-peru-por-primera-vez': {
    album: [
      '/images/Blog/como-organizar-un-viaje-a-peru-por-primera-vez/01-lima-centro-historico-plaza-mayor.webp',
      '/images/Blog/como-organizar-un-viaje-a-peru-por-primera-vez/02-islas-ballestas-paracas-fauna.webp',
      '/images/Blog/como-organizar-un-viaje-a-peru-por-primera-vez/03-oasis-huacachina-dunas-desierto.webp',
      '/images/Blog/como-organizar-un-viaje-a-peru-por-primera-vez/04-arequipa-plaza-armas-volcan-misti.webp',
      '/images/Blog/como-organizar-un-viaje-a-peru-por-primera-vez/05-cusco-calle-piedra-12-angulos.webp',
      '/images/Blog/como-organizar-un-viaje-a-peru-por-primera-vez/06-valle-sagrado-terrazas-pisac.webp',
      '/images/Blog/como-organizar-un-viaje-a-peru-por-primera-vez/07-lago-titicaca-islas-flotantes-uros.webp'
    ],
    grids: {
      es: [
        {
          headingHook: '## 3.',
          img1: '/images/Blog/como-organizar-un-viaje-a-peru-por-primera-vez/01-lima-centro-historico-plaza-mayor.webp',
          alt1: 'Plaza Mayor y Centro Histórico de Lima',
          cap1: 'Lima Colonial: capital gastronómica y cuna del patrimonio virreinal.',
          img2: '/images/Blog/como-organizar-un-viaje-a-peru-por-primera-vez/02-islas-ballestas-paracas-fauna.webp',
          alt2: 'Islas Ballestas y Reserva Nacional de Paracas',
          cap2: 'Islas Ballestas en Paracas: pingüinos de Humboldt y leones marinos en su hábitat.'
        },
        {
          headingHook: '## 4.',
          img1: '/images/Blog/como-organizar-un-viaje-a-peru-por-primera-vez/03-oasis-huacachina-dunas-desierto.webp',
          alt1: 'Oasis de la Huacachina en Ica',
          cap1: 'Oasis de Huacachina: laguna natural protegida por dunas doradas del desierto.',
          img2: '/images/Blog/como-organizar-un-viaje-a-peru-por-primera-vez/04-arequipa-plaza-armas-volcan-misti.webp',
          alt2: 'Plaza de Armas de Arequipa y volcán Misti',
          cap2: 'Arequipa Ciudad Blanca: arquitectura en sillar volcánico custodiada por el Misti.'
        },
        {
          headingHook: '## 5.',
          img1: '/images/Blog/como-organizar-un-viaje-a-peru-por-primera-vez/05-cusco-calle-piedra-12-angulos.webp',
          alt1: 'Calle Hatun Rumiyoc y la Piedra de los 12 Ángulos',
          cap1: 'Cusco Imperial: ensamble perfecto entre mampostería inca y casonas coloniales.',
          img2: '/images/Blog/como-organizar-un-viaje-a-peru-por-primera-vez/06-valle-sagrado-terrazas-pisac.webp',
          alt2: 'Andenes de Pisac en el Valle Sagrado',
          cap2: 'Valle Sagrado de los Incas: andenes agrícolas ceremoniales suspendidos sobre el cañón.'
        }
      ],
      en: [
        {
          headingHook: '## 3.',
          img1: '/images/Blog/como-organizar-un-viaje-a-peru-por-primera-vez/01-lima-centro-historico-plaza-mayor.webp',
          alt1: 'Historic Plaza Mayor of Lima',
          cap1: 'Colonial Lima: culinary capital and historical jewel of South America.',
          img2: '/images/Blog/como-organizar-un-viaje-a-peru-por-primera-vez/02-islas-ballestas-paracas-fauna.webp',
          alt2: 'Ballestas Islands marine wildlife Paracas',
          cap2: 'Ballestas Islands: sea lions and Humboldt penguins off the desert coast.'
        },
        {
          headingHook: '## 4.',
          img1: '/images/Blog/como-organizar-un-viaje-a-peru-por-primera-vez/03-oasis-huacachina-dunas-desierto.webp',
          alt1: 'Huacachina desert oasis in Ica',
          cap1: 'Huacachina Oasis: a palm-fringed natural lagoon surrounded by giant dunes.',
          img2: '/images/Blog/como-organizar-un-viaje-a-peru-por-primera-vez/04-arequipa-plaza-armas-volcan-misti.webp',
          alt2: 'Arequipa main square and Misti volcano',
          cap2: 'Arequipa the White City: volcanic sillar architecture under Mount Misti.'
        },
        {
          headingHook: '## 5.',
          img1: '/images/Blog/como-organizar-un-viaje-a-peru-por-primera-vez/05-cusco-calle-piedra-12-angulos.webp',
          alt1: 'Hatun Rumiyoc twelve-angled stone Cusco',
          cap1: 'Imperial Cusco: precision Inca stonework meeting Spanish colonial elegance.',
          img2: '/images/Blog/como-organizar-un-viaje-a-peru-por-primera-vez/06-valle-sagrado-terrazas-pisac.webp',
          alt2: 'Pisac agricultural terraces Sacred Valley',
          cap2: 'Sacred Valley of the Incas: breathtaking mountain terraces overlooking the Urubamba.'
        }
      ],
      pt: [
        {
          headingHook: '## 3.',
          img1: '/images/Blog/como-organizar-un-viaje-a-peru-por-primera-vez/01-lima-centro-historico-plaza-mayor.webp',
          alt1: 'Centro Histórico de Lima e Plaza Mayor',
          cap1: 'Lima Colonial: capital gastronômica e rica herança arquitetônica virreinal.',
          img2: '/images/Blog/como-organizar-un-viaje-a-peru-por-primera-vez/02-islas-ballestas-paracas-fauna.webp',
          alt2: 'Ilhas Ballestas em Paracas',
          cap2: 'Ilhas Ballestas em Paracas: leões-marinhos e pinguins em santuário marinho.'
        },
        {
          headingHook: '## 4.',
          img1: '/images/Blog/como-organizar-un-viaje-a-peru-por-primera-vez/03-oasis-huacachina-dunas-desierto.webp',
          alt1: 'Oásis de Huacachina em Ica',
          cap1: 'Oásis de Huacachina: lagoa natural no coração das dunas do deserto costeiro.',
          img2: '/images/Blog/como-organizar-un-viaje-a-peru-por-primera-vez/04-arequipa-plaza-armas-volcan-misti.webp',
          alt2: 'Praça de Armas de Arequipa e vulcão Misti',
          cap2: 'Arequipa Cidade Branca: construções em pedra sillar branca com o vulcão Misti ao fundo.'
        },
        {
          headingHook: '## 5.',
          img1: '/images/Blog/como-organizar-un-viaje-a-peru-por-primera-vez/05-cusco-calle-piedra-12-angulos.webp',
          alt1: 'Pedra dos Doze Ângulos em Cusco',
          cap1: 'Cusco Imperial: engenharia inca precisa nas ruelas históricas da antiga capital.',
          img2: '/images/Blog/como-organizar-un-viaje-a-peru-por-primera-vez/06-valle-sagrado-terrazas-pisac.webp',
          alt2: 'Terraços agrícolas de Pisac no Vale Sagrado',
          cap2: 'Vale Sagrado dos Incas: terraços agrícolas ceremoniais esculpidos nas encostas.'
        }
      ]
    },
    featured: {
      es: {
        headingHook: '## 6.',
        img: '/images/Blog/como-organizar-un-viaje-a-peru-por-primera-vez/07-lago-titicaca-islas-flotantes-uros.webp',
        alt: 'Islas flotantes de los Uros en el Lago Titicaca',
        cap: 'Islas Flotantes de los Uros en Puno: una comunidad milenaria viviendo en balsas de totora sobre el lago navegable más alto del mundo.'
      },
      en: {
        headingHook: '## 6.',
        img: '/images/Blog/como-organizar-un-viaje-a-peru-por-primera-vez/07-lago-titicaca-islas-flotantes-uros.webp',
        alt: 'Uros floating islands Lake Titicaca',
        cap: 'Floating Uros Islands on Lake Titicaca: an ancient civilization living upon woven totora reed islands on the highest navigable lake.'
      },
      pt: {
        headingHook: '## 6.',
        img: '/images/Blog/como-organizar-un-viaje-a-peru-por-primera-vez/07-lago-titicaca-islas-flotantes-uros.webp',
        alt: 'Ilhas flutuantes dos Uros no Lago Titicaca',
        cap: 'Ilhas Flutuantes dos Uros no Lago Titicaca: comunidade ancestral que vive sobre ilhas de junco totora no lago navegável mais alto do mundo.'
      }
    }
  },

  'los-15-lugares-turisticos-de-peru-que-debes-conocer': {
    album: [
      '/images/Blog/los-15-lugares-turisticos-de-peru-que-debes-conocer/01-montana-7-colores-vinicunca.webp',
      '/images/Blog/los-15-lugares-turisticos-de-peru-que-debes-conocer/02-laguna-humantay-nevado-salkantay.webp',
      '/images/Blog/los-15-lugares-turisticos-de-peru-que-debes-conocer/03-valle-sagrado-moray-circulos-agricolas.webp',
      '/images/Blog/los-15-lugares-turisticos-de-peru-que-debes-conocer/04-oasis-huacachina-sunset.webp',
      '/images/Blog/los-15-lugares-turisticos-de-peru-que-debes-conocer/05-canon-colca-vuelo-condor.webp',
      '/images/Blog/los-15-lugares-turisticos-de-peru-que-debes-conocer/06-lago-titicaca-taquile-uros.webp',
      '/images/Blog/los-15-lugares-turisticos-de-peru-que-debes-conocer/07-selva-amazonica-puerto-maldonado.webp'
    ],
    grids: {
      es: [
        {
          headingHook: '## 3.',
          img1: '/images/Blog/los-15-lugares-turisticos-de-peru-que-debes-conocer/01-montana-7-colores-vinicunca.webp',
          alt1: 'Montaña de 7 Colores Vinicunca',
          cap1: 'Montaña Vinicunca: franjas minerales a más de 5,000 metros de altitud.',
          img2: '/images/Blog/los-15-lugares-turisticos-de-peru-que-debes-conocer/02-laguna-humantay-nevado-salkantay.webp',
          alt2: 'Laguna Humantay turquesa y glaciar Salkantay',
          cap2: 'Laguna Humantay: espejo de agua turquesa custodiado por el glaciar sagrado.'
        },
        {
          headingHook: '## 4.',
          img1: '/images/Blog/los-15-lugares-turisticos-de-peru-que-debes-conocer/03-valle-sagrado-moray-circulos-agricolas.webp',
          alt1: 'Andenes concéntricos de Moray',
          cap1: 'Moray: anfiteatros circulares donde los incas recreaban microclimas agrícolas.',
          img2: '/images/Blog/los-15-lugares-turisticos-de-peru-que-debes-conocer/04-oasis-huacachina-sunset.webp',
          alt2: 'Atardecer en Huacachina Ica',
          cap2: 'Huacachina al atardecer: el único oasis natural del desierto sudamericano.'
        },
        {
          headingHook: '## 5.',
          img1: '/images/Blog/los-15-lugares-turisticos-de-peru-que-debes-conocer/05-canon-colca-vuelo-condor.webp',
          alt1: 'Vuelo del cóndor en el Cañón del Colca',
          cap1: 'Cañón del Colca: uno de los cañones más profundos del planeta y hogar del cóndor.',
          img2: '/images/Blog/los-15-lugares-turisticos-de-peru-que-debes-conocer/06-lago-titicaca-taquile-uros.webp',
          alt2: 'Isla de Taquile en el Lago Titicaca',
          cap2: 'Lago Titicaca e Isla Taquile: arte textil reconocido como patrimonio de la UNESCO.'
        }
      ],
      en: [
        {
          headingHook: '## 3.',
          img1: '/images/Blog/los-15-lugares-turisticos-de-peru-que-debes-conocer/01-montana-7-colores-vinicunca.webp',
          alt1: 'Vinicunca Rainbow Mountain Peru',
          cap1: 'Rainbow Mountain: geological mineral stripes towering at 5,036 meters.',
          img2: '/images/Blog/los-15-lugares-turisticos-de-peru-que-debes-conocer/02-laguna-humantay-nevado-salkantay.webp',
          alt2: 'Turquoise Humantay Lake beneath Salkantay glacier',
          cap2: 'Humantay Lake: ethereal turquoise glacial waters beneath snow-capped peaks.'
        },
        {
          headingHook: '## 4.',
          img1: '/images/Blog/los-15-lugares-turisticos-de-peru-que-debes-conocer/03-valle-sagrado-moray-circulos-agricolas.webp',
          alt1: 'Concentric Inca terraces Moray',
          cap1: 'Moray: circular terraced amphitheaters used as an Inca agronomic laboratory.',
          img2: '/images/Blog/los-15-lugares-turisticos-de-peru-que-debes-conocer/04-oasis-huacachina-sunset.webp',
          alt2: 'Sunset over Huacachina oasis',
          cap2: 'Huacachina Sunset: South America’s only true natural desert oasis.'
        },
        {
          headingHook: '## 5.',
          img1: '/images/Blog/los-15-lugares-turisticos-de-peru-que-debes-conocer/05-canon-colca-vuelo-condor.webp',
          alt1: 'Andean condor flying in Colca Canyon',
          cap1: 'Colca Canyon: breathtaking depths and the majestic flight of the Andean condor.',
          img2: '/images/Blog/los-15-lugares-turisticos-de-peru-que-debes-conocer/06-lago-titicaca-taquile-uros.webp',
          alt2: 'Taquile Island Lake Titicaca',
          cap2: 'Lake Titicaca & Taquile Island: UNESCO-recognized ancestral textile traditions.'
        }
      ],
      pt: [
        {
          headingHook: '## 3.',
          img1: '/images/Blog/los-15-lugares-turisticos-de-peru-que-debes-conocer/01-montana-7-colores-vinicunca.webp',
          alt1: 'Montanha de 7 Cores Vinicunca',
          cap1: 'Montanha Vinicunca: faixas minerais coloridas a mais de 5.000 metros de altitude.',
          img2: '/images/Blog/los-15-lugares-turisticos-de-peru-que-debes-conocer/02-laguna-humantay-nevado-salkantay.webp',
          alt2: 'Lagoa Humantay turquesa sob a geleira Salkantay',
          cap2: 'Lagoa Humantay: águas cor turquesa límpidas aos pés da geleira sagrada.'
        },
        {
          headingHook: '## 4.',
          img1: '/images/Blog/los-15-lugares-turisticos-de-peru-que-debes-conocer/03-valle-sagrado-moray-circulos-agricolas.webp',
          alt1: 'Terraços circulares de Moray',
          cap1: 'Moray: anfiteatros agrícolas circulares que criavam múltiplos microclimas.',
          img2: '/images/Blog/los-15-lugares-turisticos-de-peru-que-debes-conocer/04-oasis-huacachina-sunset.webp',
          alt2: 'Pôr do sol no oásis de Huacachina',
          cap2: 'Huacachina ao entardecer: o único oásis natural no deserto da América do Sul.'
        },
        {
          headingHook: '## 5.',
          img1: '/images/Blog/los-15-lugares-turisticos-de-peru-que-debes-conocer/05-canon-colca-vuelo-condor.webp',
          alt1: 'Voo do condor no Cânion do Colca',
          cap1: 'Cânion do Colca: o dobro da profundidade do Grand Canyon e terra do condor andino.',
          img2: '/images/Blog/los-15-lugares-turisticos-de-peru-que-debes-conocer/06-lago-titicaca-taquile-uros.webp',
          alt2: 'Ilha Taquile no Lago Titicaca',
          cap2: 'Lago Titicaca e Ilha Taquile: arte têxtil ancestral tombada pela UNESCO.'
        }
      ]
    },
    featured: {
      es: {
        headingHook: '## 6.',
        img: '/images/Blog/los-15-lugares-turisticos-de-peru-que-debes-conocer/07-selva-amazonica-puerto-maldonado.webp',
        alt: 'Reserva Nacional Tambopata en la Amazonía',
        cap: 'Amazonía Peruana (Tambopata): navegación por ríos selváticos y contacto directo con la mayor biodiversidad del planeta.'
      },
      en: {
        headingHook: '## 6.',
        img: '/images/Blog/los-15-lugares-turisticos-de-peru-que-debes-conocer/07-selva-amazonica-puerto-maldonado.webp',
        alt: 'Tambopata National Reserve Peruvian Amazon',
        cap: 'Peruvian Amazon (Tambopata): riverboat safaris through primary rainforest boasting unmatched biodiversity.'
      },
      pt: {
        headingHook: '## 6.',
        img: '/images/Blog/los-15-lugares-turisticos-de-peru-que-debes-conocer/07-selva-amazonica-puerto-maldonado.webp',
        alt: 'Reserva Nacional Tambopata na Amazônia peruana',
        cap: 'Amazônia Peruana (Tambopata): navegação fluvial em floresta primária com fauna e flora extraordinárias.'
      }
    }
  },

  'tren-a-machu-picchu-tipos-de-servicio-y-diferencias': {
    album: [
      '/images/Blog/tren-a-machu-picchu-tipos-de-servicio-y-diferencias/01-perurail-expedition-vagones.webp',
      '/images/Blog/tren-a-machu-picchu-tipos-de-servicio-y-diferencias/02-perurail-vistadome-ventanas-panoramicas.webp',
      '/images/Blog/tren-a-machu-picchu-tipos-de-servicio-y-diferencias/03-perurail-observatory-balcon-aire-libre.webp',
      '/images/Blog/tren-a-machu-picchu-tipos-de-servicio-y-diferencias/04-inca-rail-360-vagones-modernos.webp',
      '/images/Blog/tren-a-machu-picchu-tipos-de-servicio-y-diferencias/05-estacion-ollantaytambo-embarque.webp',
      '/images/Blog/tren-a-machu-picchu-tipos-de-servicio-y-diferencias/06-paisaje-canon-urubamba-rio-vilcanota.webp',
      '/images/Blog/tren-a-machu-picchu-tipos-de-servicio-y-diferencias/07-belmond-hiram-bingham-vagones-lujo.webp'
    ],
    grids: {
      es: [
        {
          headingHook: '## 3.',
          img1: '/images/Blog/tren-a-machu-picchu-tipos-de-servicio-y-diferencias/01-perurail-expedition-vagones.webp',
          alt1: 'PeruRail Expedition interior del vagón',
          cap1: 'PeruRail Expedition: asientos cómodos y excelente relación calidad-precio.',
          img2: '/images/Blog/tren-a-machu-picchu-tipos-de-servicio-y-diferencias/02-perurail-vistadome-ventanas-panoramicas.webp',
          alt2: 'PeruRail Vistadome ventanas curvas panorámicas',
          cap2: 'PeruRail Vistadome: ventanales curvados envolventes y show folclórico a bordo.'
        },
        {
          headingHook: '## 4.',
          img1: '/images/Blog/tren-a-machu-picchu-tipos-de-servicio-y-diferencias/03-perurail-observatory-balcon-aire-libre.webp',
          alt1: 'Vistadome Observatory coche balcón exterior',
          cap1: 'Vistadome Observatory: balcón panorámico al aire libre con música andina en vivo.',
          img2: '/images/Blog/tren-a-machu-picchu-tipos-de-servicio-y-diferencias/04-inca-rail-360-vagones-modernos.webp',
          alt2: 'Inca Rail The 360 vagones modernos',
          cap2: 'Inca Rail The 360°: diseño vanguardista, app interactiva y snack andino orgánico.'
        },
        {
          headingHook: '## 5.',
          img1: '/images/Blog/tren-a-machu-picchu-tipos-de-servicio-y-diferencias/05-estacion-ollantaytambo-embarque.webp',
          alt1: 'Estación de tren de Ollantaytambo',
          cap1: 'Estación de Ollantaytambo: principal centro de embarque hacia Aguas Calientes.',
          img2: '/images/Blog/tren-a-machu-picchu-tipos-de-servicio-y-diferencias/06-paisaje-canon-urubamba-rio-vilcanota.webp',
          alt2: 'Cañón del río Urubamba desde la vía del tren',
          cap2: 'Vistas panorámicas: el río Vilcanota acompañando la ruta hacia la selva alta.'
        }
      ],
      en: [
        {
          headingHook: '## 3.',
          img1: '/images/Blog/tren-a-machu-picchu-tipos-de-servicio-y-diferencias/01-perurail-expedition-vagones.webp',
          alt1: 'PeruRail Expedition wagon interior',
          cap1: 'PeruRail Expedition: comfortable seating and great value for travel.',
          img2: '/images/Blog/tren-a-machu-picchu-tipos-de-servicio-y-diferencias/02-perurail-vistadome-ventanas-panoramicas.webp',
          alt2: 'PeruRail Vistadome panoramic glass ceiling',
          cap2: 'PeruRail Vistadome: wraparound glass ceiling and live folklore performance.'
        },
        {
          headingHook: '## 4.',
          img1: '/images/Blog/tren-a-machu-picchu-tipos-de-servicio-y-diferencias/03-perurail-observatory-balcon-aire-libre.webp',
          alt1: 'Vistadome Observatory outdoor balcony car',
          cap1: 'Vistadome Observatory: open-air viewing balcony accompanied by live Andean music.',
          img2: '/images/Blog/tren-a-machu-picchu-tipos-de-servicio-y-diferencias/04-inca-rail-360-vagones-modernos.webp',
          alt2: 'Inca Rail The 360 modern cars',
          cap2: 'Inca Rail The 360°: sleek modern interior, interactive guide app and organic snacks.'
        },
        {
          headingHook: '## 5.',
          img1: '/images/Blog/tren-a-machu-picchu-tipos-de-servicio-y-diferencias/05-estacion-ollantaytambo-embarque.webp',
          alt1: 'Ollantaytambo railway station platform',
          cap1: 'Ollantaytambo Station: the main railway hub connecting Cusco with Machu Picchu.',
          img2: '/images/Blog/tren-a-machu-picchu-tipos-de-servicio-y-diferencias/06-paisaje-canon-urubamba-rio-vilcanota.webp',
          alt2: 'Urubamba River canyon views from the train',
          cap2: 'Dramatic canyon landscapes: following the roaring Urubamba River into cloud forest.'
        }
      ],
      pt: [
        {
          headingHook: '## 3.',
          img1: '/images/Blog/tren-a-machu-picchu-tipos-de-servicio-y-diferencias/01-perurail-expedition-vagones.webp',
          alt1: 'Interior do vagão PeruRail Expedition',
          cap1: 'PeruRail Expedition: conforto prático e excelente custo-benefício.',
          img2: '/images/Blog/tren-a-machu-picchu-tipos-de-servicio-y-diferencias/02-perurail-vistadome-ventanas-panoramicas.webp',
          alt2: 'Janelas curvas panorâmicas do PeruRail Vistadome',
          cap2: 'PeruRail Vistadome: janelas curvas no teto e dança típica tradicional a bordo.'
        },
        {
          headingHook: '## 4.',
          img1: '/images/Blog/tren-a-machu-picchu-tipos-de-servicio-y-diferencias/03-perurail-observatory-balcon-aire-libre.webp',
          alt1: 'Vistadome Observatory com varanda ao ar livre',
          cap1: 'Vistadome Observatory: varanda externa aberta com bar e música andina ao vivo.',
          img2: '/images/Blog/tren-a-machu-picchu-tipos-de-servicio-y-diferencias/04-inca-rail-360-vagones-modernos.webp',
          alt2: 'Vagões modernos do Inca Rail The 360',
          cap2: 'Inca Rail The 360°: design contemporâneo, audioguia interativo e janelas amplas.'
        },
        {
          headingHook: '## 5.',
          img1: '/images/Blog/tren-a-machu-picchu-tipos-de-servicio-y-diferencias/05-estacion-ollantaytambo-embarque.webp',
          alt1: 'Estação de trem de Ollantaytambo',
          cap1: 'Estação de Ollantaytambo: principal ponto de embarque para Aguas Calientes.',
          img2: '/images/Blog/tren-a-machu-picchu-tipos-de-servicio-y-diferencias/06-paisaje-canon-urubamba-rio-vilcanota.webp',
          alt2: 'Cânion do rio Urubamba visto do trem',
          cap2: 'Paisagens deslumbrantes do cânion do rio Vilcanota descendo rumo à selva alta.'
        }
      ]
    },
    featured: {
      es: {
        headingHook: '## 6.',
        img: '/images/Blog/tren-a-machu-picchu-tipos-de-servicio-y-diferencias/07-belmond-hiram-bingham-vagones-lujo.webp',
        alt: 'Tren de ultralujo Belmond Hiram Bingham',
        cap: 'Belmond Hiram Bingham: la cumbre del lujo ferroviario mundial con coche restaurante estilo años 20, cena gourmet y barra libre de autor.'
      },
      en: {
        headingHook: '## 6.',
        img: '/images/Blog/tren-a-machu-picchu-tipos-de-servicio-y-diferencias/07-belmond-hiram-bingham-vagones-lujo.webp',
        alt: 'Belmond Hiram Bingham luxury train Pullman car',
        cap: 'Belmond Hiram Bingham: the epitome of luxury rail travel featuring 1920s Pullman carriages, gourmet dining and open bar.'
      },
      pt: {
        headingHook: '## 6.',
        img: '/images/Blog/tren-a-machu-picchu-tipos-de-servicio-y-diferencias/07-belmond-hiram-bingham-vagones-lujo.webp',
        alt: 'Trem de luxo Belmond Hiram Bingham',
        cap: 'Belmond Hiram Bingham: o máximo em sofisticação ferroviária com vagões estilo anos 1920, gastronomia gourmet e serviço impecável.'
      }
    }
  },

  'valle-sagrado-de-los-incas-lugares-que-debes-visitar': {
    album: [
      '/images/Blog/valle-sagrado-de-los-incas-lugares-que-debes-visitar/01-pisac-terrazas-incas-valle.webp',
      '/images/Blog/valle-sagrado-de-los-incas-lugares-que-debes-visitar/02-mercado-artesanal-pisac-textiles.webp',
      '/images/Blog/valle-sagrado-de-los-incas-lugares-que-debes-visitar/03-fortaleza-ollantaytambo-andenes.webp',
      '/images/Blog/valle-sagrado-de-los-incas-lugares-que-debes-visitar/04-salineras-de-maras-pozas-sal.webp',
      '/images/Blog/valle-sagrado-de-los-incas-lugares-que-debes-visitar/05-moray-anfiteatro-agricola.webp',
      '/images/Blog/valle-sagrado-de-los-incas-lugares-que-debes-visitar/06-chinchero-tejedoras-tradicionales-alpaca.webp',
      '/images/Blog/valle-sagrado-de-los-incas-lugares-que-debes-visitar/07-valle-sagrado-urubamba-rio-paisaje.webp'
    ],
    grids: {
      es: [
        {
          headingHook: '## 2.',
          img1: '/images/Blog/valle-sagrado-de-los-incas-lugares-que-debes-visitar/01-pisac-terrazas-incas-valle.webp',
          alt1: 'Andenes colgantes de Pisac',
          cap1: 'Pisac Arqueológico: andenerías monumentales suspendidas sobre la cordillera.',
          img2: '/images/Blog/valle-sagrado-de-los-incas-lugares-que-debes-visitar/02-mercado-artesanal-pisac-textiles.webp',
          alt2: 'Mercado de artesanías de Pisac',
          cap2: 'Mercado de Pisac: textiles finos de alpaca, cerámica y joyería en plata.'
        },
        {
          headingHook: '## 3.',
          img1: '/images/Blog/valle-sagrado-de-los-incas-lugares-que-debes-visitar/03-fortaleza-ollantaytambo-andenes.webp',
          alt1: 'Fortaleza y Templo del Sol de Ollantaytambo',
          cap1: 'Ollantaytambo: la única ciudad inca viviente custodiada por su colosal fortaleza.',
          img2: '/images/Blog/valle-sagrado-de-los-incas-lugares-que-debes-visitar/04-salineras-de-maras-pozas-sal.webp',
          alt2: 'Pozas de evaporación en Salineras de Maras',
          cap2: 'Salineras de Maras: más de 3,000 pozas de sal rosada milenaria alimentadas por agua subterránea.'
        },
        {
          headingHook: '## 4.',
          img1: '/images/Blog/valle-sagrado-de-los-incas-lugares-que-debes-visitar/05-moray-anfiteatro-agricola.webp',
          alt1: 'Anfiteatros concéntricos de Moray',
          cap1: 'Moray: terrazas circulares concéntricas diseñadas como laboratorio botánico inca.',
          img2: '/images/Blog/valle-sagrado-de-los-incas-lugares-que-debes-visitar/06-chinchero-tejedoras-tradicionales-alpaca.webp',
          alt2: 'Tejedoras tradicionales de Chinchero',
          cap2: 'Chinchero: maestras que conservan técnicas de teñido natural transmitidas por siglos.'
        }
      ],
      en: [
        {
          headingHook: '## 2.',
          img1: '/images/Blog/valle-sagrado-de-los-incas-lugares-que-debes-visitar/01-pisac-terrazas-incas-valle.webp',
          alt1: 'Pisac cliffside Inca terraces',
          cap1: 'Archaeological Pisac: dramatic stone terraces clinging to sheer mountain cliffs.',
          img2: '/images/Blog/valle-sagrado-de-los-incas-lugares-que-debes-visitar/02-mercado-artesanal-pisac-textiles.webp',
          alt2: 'Pisac traditional artisan market',
          cap2: 'Pisac Artisan Market: authentic handwoven alpaca textiles, pottery, and silver.'
        },
        {
          headingHook: '## 3.',
          img1: '/images/Blog/valle-sagrado-de-los-incas-lugares-que-debes-visitar/03-fortaleza-ollantaytambo-andenes.webp',
          alt1: 'Ollantaytambo fortress and Sun Temple',
          cap1: 'Ollantaytambo: the last living Inca town beneath colossal ceremonial terraces.',
          img2: '/images/Blog/valle-sagrado-de-los-incas-lugares-que-debes-visitar/04-salineras-de-maras-pozas-sal.webp',
          alt2: 'Maras salt pans canyon',
          cap2: 'Salineras de Maras: over 3,000 ancient terraced salt evaporation pans.'
        },
        {
          headingHook: '## 4.',
          img1: '/images/Blog/valle-sagrado-de-los-incas-lugares-que-debes-visitar/05-moray-anfiteatro-agricola.webp',
          alt1: 'Circular Inca amphitheater of Moray',
          cap1: 'Moray: concentric circular terraces used as an advanced Inca agricultural lab.',
          img2: '/images/Blog/valle-sagrado-de-los-incas-lugares-que-debes-visitar/06-chinchero-tejedoras-tradicionales-alpaca.webp',
          alt2: 'Chinchero traditional indigenous weavers',
          cap2: 'Chinchero: indigenous master weavers practicing natural mineral and plant dyeing.'
        }
      ],
      pt: [
        {
          headingHook: '## 2.',
          img1: '/images/Blog/valle-sagrado-de-los-incas-lugares-que-debes-visitar/01-pisac-terrazas-incas-valle.webp',
          alt1: 'Terraços monumentais de Pisac',
          cap1: 'Pisac Arqueológico: terraços imponentes suspensos sobre os cânions do vale.',
          img2: '/images/Blog/valle-sagrado-de-los-incas-lugares-que-debes-visitar/02-mercado-artesanal-pisac-textiles.webp',
          alt2: 'Mercado de artesanato de Pisac',
          cap2: 'Mercado de Pisac: tecidos finos de alpaca, pratas e cerâmicas tradicionais.'
        },
        {
          headingHook: '## 3.',
          img1: '/images/Blog/valle-sagrado-de-los-incas-lugares-que-debes-visitar/03-fortaleza-ollantaytambo-andenes.webp',
          alt1: 'Fortaleza e Templo do Sol de Ollantaytambo',
          cap1: 'Ollantaytambo: a única cidade inca habitada continuamente desde a antiguidade.',
          img2: '/images/Blog/valle-sagrado-de-los-incas-lugares-que-debes-visitar/04-salineras-de-maras-pozas-sal.webp',
          alt2: 'Salinas de Maras no Vale Sagrado',
          cap2: 'Salinas de Maras: mais de 3.000 piscinas de sal rosa milenar no desfiladeiro.'
        },
        {
          headingHook: '## 4.',
          img1: '/images/Blog/valle-sagrado-de-los-incas-lugares-que-debes-visitar/05-moray-anfiteatro-agricola.webp',
          alt1: 'Anfiteatros concêntricos de Moray',
          cap1: 'Moray: círculos concêntricos usados como laboratório agrícola de aclimatação.',
          img2: '/images/Blog/valle-sagrado-de-los-incas-lugares-que-debes-visitar/06-chinchero-tejedoras-tradicionales-alpaca.webp',
          alt2: 'Mulheres tecelãs tradicionais de Chinchero',
          cap2: 'Chinchero: mestras tecelãs demonstrando técnicas seculares de fiação e tintura natural.'
        }
      ]
    },
    featured: {
      es: {
        headingHook: '## 5.',
        img: '/images/Blog/valle-sagrado-de-los-incas-lugares-que-debes-visitar/07-valle-sagrado-urubamba-rio-paisaje.webp',
        alt: 'Panorámica del Valle Sagrado y río Urubamba',
        cap: 'Valle Sagrado de los Incas: campos agrícolas fértiles bordeados por el río Vilcanota y las cumbres nevadas de la cordillera de Vilcabamba.'
      },
      en: {
        headingHook: '## 5.',
        img: '/images/Blog/valle-sagrado-de-los-incas-lugares-que-debes-visitar/07-valle-sagrado-urubamba-rio-paisaje.webp',
        alt: 'Panoramic Sacred Valley view and Urubamba river',
        cap: 'The Sacred Valley of the Incas: fertile agricultural plains along the Vilcanota River framed by glacier-crowned Andean summits.'
      },
      pt: {
        headingHook: '## 5.',
        img: '/images/Blog/valle-sagrado-de-los-incas-lugares-que-debes-visitar/07-valle-sagrado-urubamba-rio-paisaje.webp',
        alt: 'Paisagem do Vale Sagrado e rio Urubamba',
        cap: 'Vale Sagrado dos Incas: vales férteis banhados pelo rio Vilcanota e abraçados pelas montanhas nevadas dos Andes.'
      }
    }
  },

  'viajar-a-peru-con-adultos-mayores-rutas-y-consejos': {
    album: [
      '/images/Blog/viajar-a-peru-con-adultos-mayores-rutas-y-consejos/01-adultos-mayores-valle-sagrado-descanso.webp',
      '/images/Blog/viajar-a-peru-con-adultos-mayores-rutas-y-consejos/02-tren-confortable-machu-picchu-asientos.webp',
      '/images/Blog/viajar-a-peru-con-adultos-mayores-rutas-y-consejos/03-cusco-centro-historico-paseo-tranquilo.webp',
      '/images/Blog/viajar-a-peru-con-adultos-mayores-rutas-y-consejos/04-machu-picchu-circuitos-accesibles-andenes.webp',
      '/images/Blog/viajar-a-peru-con-adultos-mayores-rutas-y-consejos/05-chinchero-demostracion-textil-asientos.webp',
      '/images/Blog/viajar-a-peru-con-adultos-mayores-rutas-y-consejos/06-bus-consettur-aguas-calientes.webp',
      '/images/Blog/viajar-a-peru-con-adultos-mayores-rutas-y-consejos/07-gastronomia-peruana-restaurante-cusco.webp'
    ],
    grids: {
      es: [
        {
          headingHook: '## 2.',
          img1: '/images/Blog/viajar-a-peru-con-adultos-mayores-rutas-y-consejos/01-adultos-mayores-valle-sagrado-descanso.webp',
          alt1: 'Jardines de descanso en Urubamba Valle Sagrado',
          cap1: 'Valle Sagrado (2,870 m): clima templado y oxígeno ideal para aclimatarse con calma.',
          img2: '/images/Blog/viajar-a-peru-con-adultos-mayores-rutas-y-consejos/02-tren-confortable-machu-picchu-asientos.webp',
          alt2: 'Asientos cómodos en tren panorámico a Machu Picchu',
          cap2: 'Trenes panorámicos confortables: asientos acolchados, espacio amplio y asistencia a bordo.'
        },
        {
          headingHook: '## 3.',
          img1: '/images/Blog/viajar-a-peru-con-adultos-mayores-rutas-y-consejos/03-cusco-centro-historico-paseo-tranquilo.webp',
          alt1: 'Paseo tranquilo por el centro histórico de Cusco',
          cap1: 'Cusco a paso pausado: recorridos planos sin escaleras por plazas coloniales.',
          img2: '/images/Blog/viajar-a-peru-con-adultos-mayores-rutas-y-consejos/04-machu-picchu-circuitos-accesibles-andenes.webp',
          alt2: 'Circuitos accesibles y terrazas planas en Machu Picchu',
          cap2: 'Machu Picchu accesible: miradores con barandas y descansos para apreciar las vistas sin fatiga.'
        },
        {
          headingHook: '## 4.',
          img1: '/images/Blog/viajar-a-peru-con-adultos-mayores-rutas-y-consejos/05-chinchero-demostracion-textil-asientos.webp',
          alt1: 'Demostración textil sentados en Chinchero con mate caliente',
          cap1: 'Experiencias culturales cómodas: demostración textil sentados con infusiones medicinales.',
          img2: '/images/Blog/viajar-a-peru-con-adultos-mayores-rutas-y-consejos/06-bus-consettur-aguas-calientes.webp',
          alt2: 'Buses turísticos Consettur a Machu Picchu',
          cap2: 'Buses Consettur: traslado directo desde Aguas Calientes hasta la entrada del santuario.'
        }
      ],
      en: [
        {
          headingHook: '## 2.',
          img1: '/images/Blog/viajar-a-peru-con-adultos-mayores-rutas-y-consejos/01-adultos-mayores-valle-sagrado-descanso.webp',
          alt1: 'Relaxing gardens in Urubamba Sacred Valley',
          cap1: 'Sacred Valley (2,870 m): mild weather and oxygen-rich air for gentle acclimatization.',
          img2: '/images/Blog/viajar-a-peru-con-adultos-mayores-rutas-y-consejos/02-tren-confortable-machu-picchu-asientos.webp',
          alt2: 'Comfortable train seats to Machu Picchu',
          cap2: 'Comfortable panoramic trains: plush leather seats and attentive on-board service.'
        },
        {
          headingHook: '## 3.',
          img1: '/images/Blog/viajar-a-peru-con-adultos-mayores-rutas-y-consejos/03-cusco-centro-historico-paseo-tranquilo.webp',
          alt1: 'Gentle walk in historic Cusco',
          cap1: 'Leisurely Cusco: flat routes and scenic plazas without steep climbing.',
          img2: '/images/Blog/viajar-a-peru-con-adultos-mayores-rutas-y-consejos/04-machu-picchu-circuitos-accesibles-andenes.webp',
          alt2: 'Accessible viewpoints in Machu Picchu',
          cap2: 'Accessible Machu Picchu: panoramic terraces with handrails and easy rest stops.'
        },
        {
          headingHook: '## 4.',
          img1: '/images/Blog/viajar-a-peru-con-adultos-mayores-rutas-y-consejos/05-chinchero-demostracion-textil-asientos.webp',
          alt1: 'Seated textile demonstration in Chinchero',
          cap1: 'Comfortable cultural moments: seated weaving demonstrations with herbal teas.',
          img2: '/images/Blog/viajar-a-peru-con-adultos-mayores-rutas-y-consejos/06-bus-consettur-aguas-calientes.webp',
          alt2: 'Consettur tourist bus ascending to Machu Picchu',
          cap2: 'Consettur buses: safe and direct transit right to the sanctuary gates.'
        }
      ],
      pt: [
        {
          headingHook: '## 2.',
          img1: '/images/Blog/viajar-a-peru-con-adultos-mayores-rutas-y-consejos/01-adultos-mayores-valle-sagrado-descanso.webp',
          alt1: 'Jardins relaxantes em Urubamba no Vale Sagrado',
          cap1: 'Vale Sagrado (2.870 m): clima ameno e oxigenação ideal para aclimatação serena.',
          img2: '/images/Blog/viajar-a-peru-con-adultos-mayores-rutas-y-consejos/02-tren-confortable-machu-picchu-asientos.webp',
          alt2: 'Assentos confortáveis no trem para Machu Picchu',
          cap2: 'Trens panorâmicos confortáveis: assentos espaçosos e atendimento atencioso a bordo.'
        },
        {
          headingHook: '## 3.',
          img1: '/images/Blog/viajar-a-peru-con-adultos-mayores-rutas-y-consejos/03-cusco-centro-historico-paseo-tranquilo.webp',
          alt1: 'Caminhada suave no centro histórico de Cusco',
          cap1: 'Cusco em ritmo tranquilo: trajetos planos pelas praças históricas sem escadarias.',
          img2: '/images/Blog/viajar-a-peru-con-adultos-mayores-rutas-y-consejos/04-machu-picchu-circuitos-accesibles-andenes.webp',
          alt2: 'Mirantes acessíveis e planos em Machu Picchu',
          cap2: 'Machu Picchu acessível: terraços planos e pontos de descanso para contemplar as ruínas sem esforço.'
        },
        {
          headingHook: '## 4.',
          img1: '/images/Blog/viajar-a-peru-con-adultos-mayores-rutas-y-consejos/05-chinchero-demostracion-textil-asientos.webp',
          alt1: 'Demonstração têxtil sentados em Chinchero',
          cap1: 'Imersão cultural confortável: oficina têxtil sentados com chá de muña e coca.',
          img2: '/images/Blog/viajar-a-peru-con-adultos-mayores-rutas-y-consejos/06-bus-consettur-aguas-calientes.webp',
          alt2: 'Ônibus turístico Consettur em Machu Picchu',
          cap2: 'Ônibus Consettur: transporte direto e seguro até a entrada da cidadela.'
        }
      ]
    },
    featured: {
      es: {
        headingHook: '## 5.',
        img: '/images/Blog/viajar-a-peru-con-adultos-mayores-rutas-y-consejos/07-gastronomia-peruana-restaurante-cusco.webp',
        alt: 'Gastronomía peruana saludable en patio colonial de Cusco',
        cap: 'Alimentación saludable y reconfortante: sopas andinas nutritivas y platos ligeros en restaurantes históricos con patios coloniales.'
      },
      en: {
        headingHook: '## 5.',
        img: '/images/Blog/viajar-a-peru-con-adultos-mayores-rutas-y-consejos/07-gastronomia-peruana-restaurante-cusco.webp',
        alt: 'Healthy Peruvian dining in historic Cusco courtyard',
        cap: 'Healthy, nourishing Andean cuisine: light, fresh local dishes enjoyed in serene colonial courtyards.'
      },
      pt: {
        headingHook: '## 5.',
        img: '/images/Blog/viajar-a-peru-con-adultos-mayores-rutas-y-consejos/07-gastronomia-peruana-restaurante-cusco.webp',
        alt: 'Gastronomia peruana saudável em restaurante colonial em Cusco',
        cap: 'Alimentação saudável e nutritiva: sopas andinas e pratos balanceados servidos em pátios coloniais históricos.'
      }
    }
  },

  'como-llegar-a-machu-picchu-desde-cusco-paso-a-paso': {
    album: [
      '/images/Blog/como-llegar-a-machu-picchu-desde-cusco-paso-a-paso/01-transporte-cusco-valle-sagrado-ruta.webp',
      '/images/Blog/como-llegar-a-machu-picchu-desde-cusco-paso-a-paso/02-estacion-ollantaytambo-tren.webp',
      '/images/Blog/como-llegar-a-machu-picchu-desde-cusco-paso-a-paso/03-recorrido-tren-rio-urubamba.webp',
      '/images/Blog/como-llegar-a-machu-picchu-desde-cusco-paso-a-paso/04-aguas-calientes-pueblo-machu-picchu.webp',
      '/images/Blog/como-llegar-a-machu-picchu-desde-cusco-paso-a-paso/05-buses-consettur-subida-carretera.webp',
      '/images/Blog/como-llegar-a-machu-picchu-desde-cusco-paso-a-paso/06-puerta-ingreso-machu-picchu-control.webp',
      '/images/Blog/como-llegar-a-machu-picchu-desde-cusco-paso-a-paso/07-ruta-alternativa-hidroelectrica-caminata.webp'
    ],
    grids: {
      es: [
        {
          headingHook: '## 2.',
          img1: '/images/Blog/como-llegar-a-machu-picchu-desde-cusco-paso-a-paso/01-transporte-cusco-valle-sagrado-ruta.webp',
          alt1: 'Ruta en vehículo turístico de Cusco a Ollantaytambo',
          cap1: 'Paso 1: Traslado panorámico por carretera desde Cusco a la estación de Ollantaytambo (1h 45m).',
          img2: '/images/Blog/como-llegar-a-machu-picchu-desde-cusco-paso-a-paso/02-estacion-ollantaytambo-tren.webp',
          alt2: 'Embarque en estación de Ollantaytambo',
          cap2: 'Paso 2: Andén de embarque en Ollantaytambo para abordar el tren hacia Aguas Calientes.'
        },
        {
          headingHook: '## 3.',
          img1: '/images/Blog/como-llegar-a-machu-picchu-desde-cusco-paso-a-paso/03-recorrido-tren-rio-urubamba.webp',
          alt1: 'Vía férrea bordeando el cañón del río Urubamba',
          cap1: 'Trayecto en tren: 1h 40m de vistas deslumbrantes bordeando el río Vilcanota.',
          img2: '/images/Blog/como-llegar-a-machu-picchu-desde-cusco-paso-a-paso/04-aguas-calientes-pueblo-machu-picchu.webp',
          alt2: 'Llegada a Aguas Calientes Machu Picchu Pueblo',
          cap2: 'Aguas Calientes: pueblo peatonal rodeado de montañas exuberantes de selva alta.'
        },
        {
          headingHook: '## 4.',
          img1: '/images/Blog/como-llegar-a-machu-picchu-desde-cusco-paso-a-paso/05-buses-consettur-subida-carretera.webp',
          alt1: 'Subida en bus Consettur por carretera Hiram Bingham',
          cap1: 'Paso 3: Ascenso en bus Consettur de 25 minutos zigzagueando por la montaña.',
          img2: '/images/Blog/como-llegar-a-machu-picchu-desde-cusco-paso-a-paso/06-puerta-ingreso-machu-picchu-control.webp',
          alt2: 'Puerta de control e ingreso a Machu Picchu',
          cap2: 'Control oficial: acceso al santuario con boleto oficial y pasaporte original.'
        }
      ],
      en: [
        {
          headingHook: '## 2.',
          img1: '/images/Blog/como-llegar-a-machu-picchu-desde-cusco-paso-a-paso/01-transporte-cusco-valle-sagrado-ruta.webp',
          alt1: 'Scenic road transfer from Cusco to Ollantaytambo',
          cap1: 'Step 1: Scenic private transfer from Cusco to Ollantaytambo Station (1h 45m).',
          img2: '/images/Blog/como-llegar-a-machu-picchu-desde-cusco-paso-a-paso/02-estacion-ollantaytambo-tren.webp',
          alt2: 'Boarding platform at Ollantaytambo station',
          cap2: 'Step 2: Boarding your scenic train to Aguas Calientes at Ollantaytambo.'
        },
        {
          headingHook: '## 3.',
          img1: '/images/Blog/como-llegar-a-machu-picchu-desde-cusco-paso-a-paso/03-recorrido-tren-rio-urubamba.webp',
          alt1: 'Railway winding along the Urubamba River canyon',
          cap1: 'Scenic train journey: 1h 40m alongside the dramatic Urubamba River gorge.',
          img2: '/images/Blog/como-llegar-a-machu-picchu-desde-cusco-paso-a-paso/04-aguas-calientes-pueblo-machu-picchu.webp',
          alt2: 'Aguas Calientes Machu Picchu town',
          cap2: 'Aguas Calientes: the pedestrian base village nestled under emerald peaks.'
        },
        {
          headingHook: '## 4.',
          img1: '/images/Blog/como-llegar-a-machu-picchu-desde-cusco-paso-a-paso/05-buses-consettur-subida-carretera.webp',
          alt1: 'Consettur bus switchback road to citadel',
          cap1: 'Step 3: 25-minute Consettur bus ride ascending the Hiram Bingham switchbacks.',
          img2: '/images/Blog/como-llegar-a-machu-picchu-desde-cusco-paso-a-paso/06-puerta-ingreso-machu-picchu-control.webp',
          alt2: 'Machu Picchu entrance gate and checkpoint',
          cap2: 'Sanctuary Entry: presenting your official ticket and original passport.'
        }
      ],
      pt: [
        {
          headingHook: '## 2.',
          img1: '/images/Blog/como-llegar-a-machu-picchu-desde-cusco-paso-a-paso/01-transporte-cusco-valle-sagrado-ruta.webp',
          alt1: 'Traslado cênico de Cusco para Ollantaytambo',
          cap1: 'Passo 1: Traslado cênico por terra de Cusco até a estação de Ollantaytambo (1h 45m).',
          img2: '/images/Blog/como-llegar-a-machu-picchu-desde-cusco-paso-a-paso/02-estacion-ollantaytambo-tren.webp',
          alt2: 'Plataforma de embarque em Ollantaytambo',
          cap2: 'Passo 2: Embarque no trem panorâmico rumo a Aguas Calientes.'
        },
        {
          headingHook: '## 3.',
          img1: '/images/Blog/como-llegar-a-machu-picchu-desde-cusco-paso-a-paso/03-recorrido-tren-rio-urubamba.webp',
          alt1: 'Linha férrea contornando o rio Urubamba',
          cap1: 'Viagem de trem: 1h 40m de paisagens fascinantes descendo o rio Vilcanota.',
          img2: '/images/Blog/como-llegar-a-machu-picchu-desde-cusco-paso-a-paso/04-aguas-calientes-pueblo-machu-picchu.webp',
          alt2: 'Chegada a Aguas Calientes Machu Picchu Pueblo',
          cap2: 'Aguas Calientes: vila aos pés das montanhas imponentes da selva alta.'
        },
        {
          headingHook: '## 4.',
          img1: '/images/Blog/como-llegar-a-machu-picchu-desde-cusco-paso-a-paso/05-buses-consettur-subida-carretera.webp',
          alt1: 'Subida de ônibus Consettur na estrada Hiram Bingham',
          cap1: 'Passo 3: Subida de 25 minutos em ônibus turístico pelas curvas da montanha.',
          img2: '/images/Blog/como-llegar-a-machu-picchu-desde-cusco-paso-a-paso/06-puerta-ingreso-machu-picchu-control.webp',
          alt2: 'Portão de entrada e controle oficial de Machu Picchu',
          cap2: 'Controle de acesso oficial com bilhete impresso e passaporte original.'
        }
      ]
    },
    featured: {
      es: {
        headingHook: '## 5.',
        img: '/images/Blog/como-llegar-a-machu-picchu-desde-cusco-paso-a-paso/07-ruta-alternativa-hidroelectrica-caminata.webp',
        alt: 'Ruta alternativa mochilera caminando por Hidroeléctrica',
        cap: 'Ruta Alternativa por Hidroeléctrica: caminata de 10 km (2.5 a 3 horas) siguiendo las vías del tren rodeadas de abundante vegetación selvática.'
      },
      en: {
        headingHook: '## 5.',
        img: '/images/Blog/como-llegar-a-machu-picchu-desde-cusco-paso-a-paso/07-ruta-alternativa-hidroelectrica-caminata.webp',
        alt: 'Backpacker trek along Hidroelectrica railway tracks',
        cap: 'Alternative Hidroeléctrica route: a flat 10 km (2.5 to 3 hour) scenic hike along the railway line through lush subtropical jungle.'
      },
      pt: {
        headingHook: '## 5.',
        img: '/images/Blog/como-llegar-a-machu-picchu-desde-cusco-paso-a-paso/07-ruta-alternativa-hidroelectrica-caminata.webp',
        alt: 'Rota alternativa mochileira caminhando por Hidroeléctrica',
        cap: 'Rota Alternativa por Hidroeléctrica: caminhada de 10 km (2,5 a 3 horas) ao lado dos trilhos do trem em plena selva subtropical.'
      }
    }
  },

  'que-llevar-a-machu-picchu-lista-para-preparar-tu-viaje': {
    album: [
      '/images/Blog/que-llevar-a-machu-picchu-lista-para-preparar-tu-viaje/01-mochila-trekking-equipaje-mano.webp',
      '/images/Blog/que-llevar-a-machu-picchu-lista-para-preparar-tu-viaje/02-calzado-trekking-botas-senderismo.webp',
      '/images/Blog/que-llevar-a-machu-picchu-lista-para-preparar-tu-viaje/03-ropa-impermeable-chamarra-lluvia.webp',
      '/images/Blog/que-llevar-a-machu-picchu-lista-para-preparar-tu-viaje/04-proteccion-solar-sombrero-lentes.webp',
      '/images/Blog/que-llevar-a-machu-picchu-lista-para-preparar-tu-viaje/05-repelente-bloqueador-botella-agua.webp',
      '/images/Blog/que-llevar-a-machu-picchu-lista-para-preparar-tu-viaje/06-bastones-trekking-puntas-goma.webp',
      '/images/Blog/que-llevar-a-machu-picchu-lista-para-preparar-tu-viaje/07-pasaporte-boletos-oficiales-documentos.webp'
    ],
    grids: {
      es: [
        {
          headingHook: '## 2.',
          img1: '/images/Blog/que-llevar-a-machu-picchu-lista-para-preparar-tu-viaje/01-mochila-trekking-equipaje-mano.webp',
          alt1: 'Mochila de trekking de 20-30 litros permitida',
          cap1: 'Mochila de día (máx. 20-30L): tamaño reglamentario para el tren y la ciudadela.',
          img2: '/images/Blog/que-llevar-a-machu-picchu-lista-para-preparar-tu-viaje/02-calzado-trekking-botas-senderismo.webp',
          alt2: 'Botas de senderismo impermeables para Machu Picchu',
          cap2: 'Calzado de trekking con buen agarre para escalinatas incas de piedra.'
        },
        {
          headingHook: '## 3.',
          img1: '/images/Blog/que-llevar-a-machu-picchu-lista-para-preparar-tu-viaje/03-ropa-impermeable-chamarra-lluvia.webp',
          alt1: 'Chaqueta impermeable cortavientos',
          cap1: 'Chaqueta cortavientos e impermeable: esencial para el clima cambiante de la ceja de selva.',
          img2: '/images/Blog/que-llevar-a-machu-picchu-lista-para-preparar-tu-viaje/04-proteccion-solar-sombrero-lentes.webp',
          alt2: 'Sombrero de ala ancha y gafas de sol con protección UV',
          cap2: 'Protección solar completa: sombrero de ala ancha y gafas UV contra la radiación andina.'
        },
        {
          headingHook: '## 4.',
          img1: '/images/Blog/que-llevar-a-machu-picchu-lista-para-preparar-tu-viaje/05-repelente-bloqueador-botella-agua.webp',
          alt1: 'Botella de agua reutilizable repelente y bloqueador',
          cap1: 'Hidratación y cuidado: cantimplora reutilizable y repelente ecológico contra mosquitos.',
          img2: '/images/Blog/que-llevar-a-machu-picchu-lista-para-preparar-tu-viaje/06-bastones-trekking-puntas-goma.webp',
          alt2: 'Bastones de trekking con regatones de goma',
          cap2: 'Bastones con puntas de goma: obligatorios para proteger los senderos líticos incas.'
        }
      ],
      en: [
        {
          headingHook: '## 2.',
          img1: '/images/Blog/que-llevar-a-machu-picchu-lista-para-preparar-tu-viaje/01-mochila-trekking-equipaje-mano.webp',
          alt1: '20-30L daypack allowed in Machu Picchu',
          cap1: 'Daypack (max 20-30L): regulation size permitted on the train and inside the sanctuary.',
          img2: '/images/Blog/que-llevar-a-machu-picchu-lista-para-preparar-tu-viaje/02-calzado-trekking-botas-senderismo.webp',
          alt2: 'Sturdy waterproof hiking boots',
          cap2: 'Sturdy trail footwear with ankle support and grip for ancient stone staircases.'
        },
        {
          headingHook: '## 3.',
          img1: '/images/Blog/que-llevar-a-machu-picchu-lista-para-preparar-tu-viaje/03-ropa-impermeable-chamarra-lluvia.webp',
          alt1: 'Waterproof rain jacket windbreaker',
          cap1: 'Waterproof jacket & windbreaker: essential for shifting cloud forest weather.',
          img2: '/images/Blog/que-llevar-a-machu-picchu-lista-para-preparar-tu-viaje/04-proteccion-solar-sombrero-lentes.webp',
          alt2: 'Sun hat and UV protection sunglasses',
          cap2: 'Sun protection: wide-brim hat and polarized UV sunglasses for high altitude rays.'
        },
        {
          headingHook: '## 4.',
          img1: '/images/Blog/que-llevar-a-machu-picchu-lista-para-preparar-tu-viaje/05-repelente-bloqueador-botella-agua.webp',
          alt1: 'Reusable water bottle and insect repellent',
          cap1: 'Hydration & defense: reusable metal canteen and eco insect repellent.',
          img2: '/images/Blog/que-llevar-a-machu-picchu-lista-para-preparar-tu-viaje/06-bastones-trekking-puntas-goma.webp',
          alt2: 'Trekking poles with rubber tips',
          cap2: 'Rubber-tipped trekking poles: mandatory to prevent damage to historic stone paths.'
        }
      ],
      pt: [
        {
          headingHook: '## 2.',
          img1: '/images/Blog/que-llevar-a-machu-picchu-lista-para-preparar-tu-viaje/01-mochila-trekking-equipaje-mano.webp',
          alt1: 'Mochila de trekking de 20-30 litros permitida',
          cap1: 'Mochila de ataque (máx. 20-30L): tamanho regulamentar para o trem e a cidadela.',
          img2: '/images/Blog/que-llevar-a-machu-picchu-lista-para-preparar-tu-viaje/02-calzado-trekking-botas-senderismo.webp',
          alt2: 'Botas de caminhada impermeáveis',
          cap2: 'Botas de trilha antiderrapantes para escadarias de pedra antigas.'
        },
        {
          headingHook: '## 3.',
          img1: '/images/Blog/que-llevar-a-machu-picchu-lista-para-preparar-tu-viaje/03-ropa-impermeable-chamarra-lluvia.webp',
          alt1: 'Jaqueta impermeável corta-vento',
          cap1: 'Jaqueta impermeável e corta-vento: indispensável para o clima da selva nublada.',
          img2: '/images/Blog/que-llevar-a-machu-picchu-lista-para-preparar-tu-viaje/04-proteccion-solar-sombrero-lentes.webp',
          alt2: 'Chapéu de abas largas e óculos escuros com proteção UV',
          cap2: 'Proteção solar completa: chapéu de abas e óculos UV contra a radiação andina.'
        },
        {
          headingHook: '## 4.',
          img1: '/images/Blog/que-llevar-a-machu-picchu-lista-para-preparar-tu-viaje/05-repelente-bloqueador-botella-agua.webp',
          alt1: 'Garrafa de água reutilizável e repelente de insetos',
          cap1: 'Hidratação e cuidados: garrafa reutilizável e repelente para mosquitos locais.',
          img2: '/images/Blog/que-llevar-a-machu-picchu-lista-para-preparar-tu-viaje/06-bastones-trekking-puntas-goma.webp',
          alt2: 'Bastões de caminhada com ponteiras de borracha',
          cap2: 'Bastões com pontas de borracha: obrigatórios para não desgastar as pedras incas.'
        }
      ]
    },
    featured: {
      es: {
        headingHook: '## 5.',
        img: '/images/Blog/que-llevar-a-machu-picchu-lista-para-preparar-tu-viaje/07-pasaporte-boletos-oficiales-documentos.webp',
        alt: 'Pasaporte vigente y boletos oficiales de Machu Picchu',
        cap: 'Documentación imprescindible: pasaporte original físico vigente y boleto de ingreso oficial impreso, obligatorios para superar el control de acceso.'
      },
      en: {
        headingHook: '## 5.',
        img: '/images/Blog/que-llevar-a-machu-picchu-lista-para-preparar-tu-viaje/07-pasaporte-boletos-oficiales-documentos.webp',
        alt: 'Original passport and official Machu Picchu entrance ticket',
        cap: 'Essential Documents: valid physical original passport and printed official entrance voucher required at the sanctuary turnstiles.'
      },
      pt: {
        headingHook: '## 5.',
        img: '/images/Blog/que-llevar-a-machu-picchu-lista-para-preparar-tu-viaje/07-pasaporte-boletos-oficiales-documentos.webp',
        alt: 'Passaporte original e ingressos oficiais para Machu Picchu',
        cap: 'Documentos indispensáveis: passaporte físico original válido e ingresso oficial impresso exigidos na entrada do parque.'
      }
    }
  },

  'entradas-a-machu-picchu-2027-como-comprarlas': {
    album: [
      '/images/Blog/entradas-a-machu-picchu-2027-como-comprarlas/01-circuito-1-panoramica-casa-guardian.webp',
      '/images/Blog/entradas-a-machu-picchu-2027-como-comprarlas/02-circuito-2-clasico-templo-sol.webp',
      '/images/Blog/entradas-a-machu-picchu-2027-como-comprarlas/03-circuito-3-realeza-roca-sagrada.webp',
      '/images/Blog/entradas-a-machu-picchu-2027-como-comprarlas/04-huayna-picchu-sendero-escaleras-muerte.webp',
      '/images/Blog/entradas-a-machu-picchu-2027-como-comprarlas/05-montana-machu-picchu-vista-alta.webp',
      '/images/Blog/entradas-a-machu-picchu-2027-como-comprarlas/06-control-acceso-puerta-boletos.webp',
      '/images/Blog/entradas-a-machu-picchu-2027-como-comprarlas/07-guia-oficial-turismo-machu-picchu.webp'
    ],
    grids: {
      es: [
        {
          headingHook: '## 3.',
          img1: '/images/Blog/entradas-a-machu-picchu-2027-como-comprarlas/01-circuito-1-panoramica-casa-guardian.webp',
          alt1: 'Circuito 1 Panorámico Casa del Guardián',
          cap1: 'Circuito 1 (Panorámico): la icónica foto postal desde las terrazas superiores.',
          img2: '/images/Blog/entradas-a-machu-picchu-2027-como-comprarlas/02-circuito-2-clasico-templo-sol.webp',
          alt2: 'Circuito 2 Clásico Templo del Sol y sector urbano',
          cap2: 'Circuito 2 (Clásico): el recorrido más completo por templos, plazas y viviendas incas.'
        },
        {
          headingHook: '## 4.',
          img1: '/images/Blog/entradas-a-machu-picchu-2027-como-comprarlas/03-circuito-3-realeza-roca-sagrada.webp',
          alt1: 'Circuito 3 Realeza y Roca Sagrada',
          cap1: 'Circuito 3 (Realeza): sector inferior, Espejos de Agua y Roca Sagrada.',
          img2: '/images/Blog/entradas-a-machu-picchu-2027-como-comprarlas/04-huayna-picchu-sendero-escaleras-muerte.webp',
          alt2: 'Ascenso a Huayna Picchu escalinatas incas',
          cap2: 'Huayna Picchu: ascenso vertical desafiante para los amantes de la aventura y vistas épicas.'
        },
        {
          headingHook: '## 5.',
          img1: '/images/Blog/entradas-a-machu-picchu-2027-como-comprarlas/05-montana-machu-picchu-vista-alta.webp',
          alt1: 'Cima de la Montaña Machu Picchu a 3,061 m',
          cap1: 'Montaña Machu Picchu: cumbre más alta (3,061 m) con vista de 360° sobre el cañón.',
          img2: '/images/Blog/entradas-a-machu-picchu-2027-como-comprarlas/06-control-acceso-puerta-boletos.webp',
          alt2: 'Molinetes de acceso electrónico puerta principal',
          cap2: 'Control de acceso: escaneo de código QR y validación estricta de turno de ingreso.'
        }
      ],
      en: [
        {
          headingHook: '## 3.',
          img1: '/images/Blog/entradas-a-machu-picchu-2027-como-comprarlas/01-circuito-1-panoramica-casa-guardian.webp',
          alt1: 'Circuit 1 Panoramic view from Guardhouse',
          cap1: 'Circuit 1 (Panoramic): the postcard photo from the upper agricultural terrace.',
          img2: '/images/Blog/entradas-a-machu-picchu-2027-como-comprarlas/02-circuito-2-clasico-templo-sol.webp',
          alt2: 'Circuit 2 Classic Temple of the Sun',
          cap2: 'Circuit 2 (Classic): the most comprehensive circuit exploring temples and urban sectors.'
        },
        {
          headingHook: '## 4.',
          img1: '/images/Blog/entradas-a-machu-picchu-2027-como-comprarlas/03-circuito-3-realeza-roca-sagrada.webp',
          alt1: 'Circuit 3 Royalty and Sacred Rock',
          cap1: 'Circuit 3 (Royalty): lower palaces, water mirrors, and the Sacred Rock.',
          img2: '/images/Blog/entradas-a-machu-picchu-2027-como-comprarlas/04-huayna-picchu-sendero-escaleras-muerte.webp',
          alt2: 'Huayna Picchu mountain trail stairs',
          cap2: 'Huayna Picchu: thrilling vertical ascent for adventure seekers with breathtaking views.'
        },
        {
          headingHook: '## 5.',
          img1: '/images/Blog/entradas-a-machu-picchu-2027-como-comprarlas/05-montana-machu-picchu-vista-alta.webp',
          alt1: 'Montaña Machu Picchu high peak summit',
          cap1: 'Montaña Machu Picchu: highest summit (3,061 m) with complete 360-degree panoramas.',
          img2: '/images/Blog/entradas-a-machu-picchu-2027-como-comprarlas/06-control-acceso-puerta-boletos.webp',
          alt2: 'Entrance gate turnstiles Machu Picchu',
          cap2: 'Access Control: electronic QR code verification matching your assigned time slot.'
        }
      ],
      pt: [
        {
          headingHook: '## 3.',
          img1: '/images/Blog/entradas-a-machu-picchu-2027-como-comprarlas/01-circuito-1-panoramica-casa-guardian.webp',
          alt1: 'Circuito 1 Panorâmico Casa do Guardião',
          cap1: 'Circuito 1 (Panorâmico): a foto clássica de cartão-postal dos terraços superiores.',
          img2: '/images/Blog/entradas-a-machu-picchu-2027-como-comprarlas/02-circuito-2-clasico-templo-sol.webp',
          alt2: 'Circuito 2 Clássico Templo do Sol',
          cap2: 'Circuito 2 (Clássico): o roteiro mais completo pelos templos e praças incas.',
          img3: '/images/Blog/entradas-a-machu-picchu-2027-como-comprarlas/03-circuito-3-realeza-roca-sagrada.webp'
        },
        {
          headingHook: '## 4.',
          img1: '/images/Blog/entradas-a-machu-picchu-2027-como-comprarlas/03-circuito-3-realeza-roca-sagrada.webp',
          alt1: 'Circuito 3 Realeza e Rocha Sagrada',
          cap1: 'Circuito 3 (Realeza): setor inferior dos palácios reais e Rocha Sagrada.',
          img2: '/images/Blog/entradas-a-machu-picchu-2027-como-comprarlas/04-huayna-picchu-sendero-escaleras-muerte.webp',
          alt2: 'Subida a Huayna Picchu escadarias incas',
          cap2: 'Huayna Picchu: subida vertical emocionante para quem busca aventura e vistas aéreas.'
        },
        {
          headingHook: '## 5.',
          img1: '/images/Blog/entradas-a-machu-picchu-2027-como-comprarlas/05-montana-machu-picchu-vista-alta.webp',
          alt1: 'Cume da Montanha Machu Picchu',
          cap1: 'Montanha Machu Picchu: cume mais alto (3.061 m) com vista panorâmica de 360 graus.',
          img2: '/images/Blog/entradas-a-machu-picchu-2027-como-comprarlas/06-control-acceso-puerta-boletos.webp',
          alt2: 'Catracas de controle eletrônico de acesso',
          cap2: 'Controle de entrada: leitura de código QR e validação do horário agendado.'
        }
      ]
    },
    featured: {
      es: {
        headingHook: '## 6.',
        img: '/images/Blog/entradas-a-machu-picchu-2027-como-comprarlas/07-guia-oficial-turismo-machu-picchu.webp',
        alt: 'Guía oficial de turismo colegiado en Machu Picchu',
        cap: 'Acompañamiento profesional: ingresar con un guía oficial de turismo certificado enriquece la visita descubriendo los secretos astronómicos y arquitectónicos incas.'
      },
      en: {
        headingHook: '## 6.',
        img: '/images/Blog/entradas-a-machu-picchu-2027-como-comprarlas/07-guia-oficial-turismo-machu-picchu.webp',
        alt: 'Licensed official tour guide at Machu Picchu',
        cap: 'Certified Guided Experience: exploring with a licensed guide brings to life the astronomical alignments and sacred engineering of the sanctuary.'
      },
      pt: {
        headingHook: '## 6.',
        img: '/images/Blog/entradas-a-machu-picchu-2027-como-comprarlas/07-guia-oficial-turismo-machu-picchu.webp',
        alt: 'Guia oficial credenciado em Machu Picchu',
        cap: 'Acompanhamento profissional: visitar com guia credenciado enriquece a experiência revelando a sabedoria e os mistérios da engenharia inca.'
      }
    }
  },

  'machu-picchu-en-familia-consejos-para-viajar-con-ninos': {
    album: [
      '/images/Blog/machu-picchu-en-familia-consejos-para-viajar-con-ninos/01-ninos-alpacas-machu-picchu.webp',
      '/images/Blog/machu-picchu-en-familia-consejos-para-viajar-con-ninos/02-mochila-portabebes-trekking-familia.webp',
      '/images/Blog/machu-picchu-en-familia-consejos-para-viajar-con-ninos/03-viaje-tren-familia-ventanas.webp',
      '/images/Blog/machu-picchu-en-familia-consejos-para-viajar-con-ninos/04-taller-chocolate-chocomuseo-cusco.webp',
      '/images/Blog/machu-picchu-en-familia-consejos-para-viajar-con-ninos/05-visita-chinchero-familia-alpacas.webp',
      '/images/Blog/machu-picchu-en-familia-consejos-para-viajar-con-ninos/06-senderos-faciles-machu-picchu-ninos.webp',
      '/images/Blog/machu-picchu-en-familia-consejos-para-viajar-con-ninos/07-hotel-familiar-valle-sagrado-jardines.webp'
    ],
    grids: {
      es: [
        {
          headingHook: '## 2.',
          img1: '/images/Blog/machu-picchu-en-familia-consejos-para-viajar-con-ninos/01-ninos-alpacas-machu-picchu.webp',
          alt1: 'Niños con alpacas y llamas en Machu Picchu',
          cap1: 'Encuentros mágicos: llamas y alpacas conviviendo libremente en los andenes verdes.',
          img2: '/images/Blog/machu-picchu-en-familia-consejos-para-viajar-con-ninos/02-mochila-portabebes-trekking-familia.webp',
          alt2: 'Mochila portabebés ergonómica de trekking',
          cap2: 'Mochila portabebés: obligatoria para menores de 3 años ante la prohibición de carritos de bebé.'
        },
        {
          headingHook: '## 3.',
          img1: '/images/Blog/machu-picchu-en-familia-consejos-para-viajar-con-ninos/03-viaje-tren-familia-ventanas.webp',
          alt1: 'Viaje en tren con niños hacia Machu Picchu',
          cap1: 'Viaje en tren divertido: ventanas panorámicas para que los niños descubran ríos y cascadas.',
          img2: '/images/Blog/machu-picchu-en-familia-consejos-para-viajar-con-ninos/04-taller-chocolate-chocomuseo-cusco.webp',
          alt2: 'Taller de chocolate en ChocoMuseo para niños',
          cap2: 'Taller en el ChocoMuseo: una tarde interactiva elaborando chocolate artesanal peruano.'
        },
        {
          headingHook: '## 4.',
          img1: '/images/Blog/machu-picchu-en-familia-consejos-para-viajar-con-ninos/05-visita-chinchero-familia-alpacas.webp',
          alt1: 'Alimentando alpacas en granja del Valle Sagrado',
          cap1: 'Granjas del Valle Sagrado: alimentar crías de alpaca es una experiencia inolvidable para los pequeños.',
          img2: '/images/Blog/machu-picchu-en-familia-consejos-para-viajar-con-ninos/06-senderos-faciles-machu-picchu-ninos.webp',
          alt2: 'Senderos llanos y seguros para caminar con niños',
          cap2: 'Circuitos recomendados: senderos llanos en el sector inferior para caminar con seguridad.'
        }
      ],
      en: [
        {
          headingHook: '## 2.',
          img1: '/images/Blog/machu-picchu-en-familia-consejos-para-viajar-con-ninos/01-ninos-alpacas-machu-picchu.webp',
          alt1: 'Children meeting friendly alpacas at Machu Picchu',
          cap1: 'Magical wildlife moments: friendly llamas grazing peacefully along stone terraces.',
          img2: '/images/Blog/machu-picchu-en-familia-consejos-para-viajar-con-ninos/02-mochila-portabebes-trekking-familia.webp',
          alt2: 'Ergonomic hiking baby carrier backpack',
          cap2: 'Baby carrier backpacks: essential for toddlers as strollers are prohibited inside the citadel.'
        },
        {
          headingHook: '## 3.',
          img1: '/images/Blog/machu-picchu-en-familia-consejos-para-viajar-con-ninos/03-viaje-tren-familia-ventanas.webp',
          alt1: 'Family train journey with kids to Machu Picchu',
          cap1: 'Scenic train excitement: panoramic windows keep kids engaged pointing out rivers and waterfalls.',
          img2: '/images/Blog/machu-picchu-en-familia-consejos-para-viajar-con-ninos/04-taller-chocolate-chocomuseo-cusco.webp',
          alt2: 'Hands-on chocolate making workshop for families',
          cap2: 'ChocoMuseo Workshop: hands-on artisan chocolate crafting that kids of all ages adore.'
        },
        {
          headingHook: '## 4.',
          img1: '/images/Blog/machu-picchu-en-familia-consejos-para-viajar-con-ninos/05-visita-chinchero-familia-alpacas.webp',
          alt1: 'Feeding baby alpacas in Sacred Valley farm',
          cap1: 'Sacred Valley alpaca farms: petting and bottle-feeding baby alpacas create lifelong memories.',
          img2: '/images/Blog/machu-picchu-en-familia-consejos-para-viajar-con-ninos/06-senderos-faciles-machu-picchu-ninos.webp',
          alt2: 'Safe gentle stone paths in Machu Picchu',
          cap2: 'Kid-friendly paths: flat and secure routes in the lower sector ideal for relaxed walking.'
        }
      ],
      pt: [
        {
          headingHook: '## 2.',
          img1: '/images/Blog/machu-picchu-en-familia-consejos-para-viajar-con-ninos/01-ninos-alpacas-machu-picchu.webp',
          alt1: 'Crianças com alpacas e lhamas em Machu Picchu',
          cap1: 'Momentos mágicos: lhamas e alpacas pastando livremente nos terraços verdes.',
          img2: '/images/Blog/machu-picchu-en-familia-consejos-para-viajar-con-ninos/02-mochila-portabebes-trekking-familia.webp',
          alt2: 'Mochila canguru ergonômica de trekking',
          cap2: 'Mochila canguru ergonômica: item indispensável já que carrinhos de bebê são proibidos na cidadela.'
        },
        {
          headingHook: '## 3.',
          img1: '/images/Blog/machu-picchu-en-familia-consejos-para-viajar-con-ninos/03-viaje-tren-familia-ventanas.webp',
          alt1: 'Passeio de trem com crianças para Machu Picchu',
          cap1: 'Viagem de trem divertida: janelas panorâmicas para as crianças apreciarem rios e montanhas.',
          img2: '/images/Blog/machu-picchu-en-familia-consejos-para-viajar-con-ninos/04-taller-chocolate-chocomuseo-cusco.webp',
          alt2: 'Oficina de chocolate no ChocoMuseo para famílias',
          cap2: 'Oficina no ChocoMuseo: uma tarde interativa fazendo chocolate artesanal peruano.'
        },
        {
          headingHook: '## 4.',
          img1: '/images/Blog/machu-picchu-en-familia-consejos-para-viajar-con-ninos/05-visita-chinchero-familia-alpacas.webp',
          alt1: 'Alimentando alpacas em fazenda do Vale Sagrado',
          cap1: 'Fazendas do Vale Sagrado: alimentar filhotes de alpaca é alegria garantida para os pequenos.',
          img2: '/images/Blog/machu-picchu-en-familia-consejos-para-viajar-con-ninos/06-senderos-faciles-machu-picchu-ninos.webp',
          alt2: 'Trilhas planas e seguras para caminhar com crianças',
          cap2: 'Circuitos recomendados: trilhas planas no setor inferior ideais para caminhar com segurança.'
        }
      ]
    },
    featured: {
      es: {
        headingHook: '## 5.',
        img: '/images/Blog/machu-picchu-en-familia-consejos-para-viajar-con-ninos/07-hotel-familiar-valle-sagrado-jardines.webp',
        alt: 'Hotel con amplios jardines en el Valle Sagrado para familias',
        cap: 'Alojamientos con espacios verdes: elegir hoteles con amplios jardines y piscina en el Valle Sagrado permite a los niños jugar y descansar entre excursiones.'
      },
      en: {
        headingHook: '## 5.',
        img: '/images/Blog/machu-picchu-en-familia-consejos-para-viajar-con-ninos/07-hotel-familiar-valle-sagrado-jardines.webp',
        alt: 'Family-friendly hotel with lush gardens in Sacred Valley',
        cap: 'Family-friendly retreats: choosing resorts with spacious gardens and pools in the Sacred Valley gives children space to play and recharge between adventures.'
      },
      pt: {
        headingHook: '## 5.',
        img: '/images/Blog/machu-picchu-en-familia-consejos-para-viajar-con-ninos/07-hotel-familiar-valle-sagrado-jardines.webp',
        alt: 'Hotel com amplos jardins no Vale Sagrado para famílias',
        cap: 'Hospedagens acolhedoras para famílias: hotéis com amplas áreas verdes no Vale Sagrado permitem que as crianças brinquem e descansem entre os passeios.'
      }
    }
  },

  'mejor-epoca-para-viajar-a-peru-guia-completa': {
    album: [
      '/images/Blog/mejor-epoca-para-viajar-a-peru-guia-completa/01-machu-picchu-cielo-despejado-invierno.webp',
      '/images/Blog/mejor-epoca-para-viajar-a-peru-guia-completa/02-valle-sagrado-temporada-verde-lluvias.webp',
      '/images/Blog/mejor-epoca-para-viajar-a-peru-guia-completa/03-costa-lima-miraflores-verano.webp',
      '/images/Blog/mejor-epoca-para-viajar-a-peru-guia-completa/04-montana-7-colores-dia-soleado.webp',
      '/images/Blog/mejor-epoca-para-viajar-a-peru-guia-completa/05-cusco-inti-raymi-fiesta-sol.webp',
      '/images/Blog/mejor-epoca-para-viajar-a-peru-guia-completa/06-neblina-mistica-machu-picchu-nubes.webp',
      '/images/Blog/mejor-epoca-para-viajar-a-peru-guia-completa/07-selva-amazonia-rio-temporada-seca.webp'
    ],
    grids: {
      es: [
        {
          headingHook: '## 2.',
          img1: '/images/Blog/mejor-epoca-para-viajar-a-peru-guia-completa/01-machu-picchu-cielo-despejado-invierno.webp',
          alt1: 'Machu Picchu cielo despejado en temporada seca',
          cap1: 'Temporada Seca (Mayo a Octubre): cielos azules, sol radiante y visibilidad perfecta.',
          img2: '/images/Blog/mejor-epoca-para-viajar-a-peru-guia-completa/02-valle-sagrado-temporada-verde-lluvias.webp',
          alt2: 'Valle Sagrado verde esmeralda en época de lluvias',
          cap2: 'Temporada Verde (Diciembre a Marzo): andenes esmeralda, menos afluencia y cascadas activas.'
        },
        {
          headingHook: '## 3.',
          img1: '/images/Blog/mejor-epoca-para-viajar-a-peru-guia-completa/03-costa-lima-miraflores-verano.webp',
          alt1: 'Verano en la costa y playas de Lima',
          cap1: 'Costa y Lima (Diciembre a Abril): verano cálido, playas soleadas y puestas de sol en el Pacífico.',
          img2: '/images/Blog/mejor-epoca-para-viajar-a-peru-guia-completa/04-montana-7-colores-dia-soleado.webp',
          alt2: 'Montaña de 7 Colores en día despejado',
          cap2: 'Andes y Rutas de Trekking: mayor claridad para fotografiar Vinicunca y Humantay en invierno andino.'
        },
        {
          headingHook: '## 4.',
          img1: '/images/Blog/mejor-epoca-para-viajar-a-peru-guia-completa/05-cusco-inti-raymi-fiesta-sol.webp',
          alt1: 'Fiesta del Sol Inti Raymi en Cusco',
          cap1: 'Junio en Cusco: el mes jubilar y la majestuosa escenificación del Inti Raymi en Sacsayhuamán.',
          img2: '/images/Blog/mejor-epoca-para-viajar-a-peru-guia-completa/06-neblina-mistica-machu-picchu-nubes.webp',
          alt2: 'Neblina mística amaneciendo en Machu Picchu',
          cap2: 'Temporadas intermedias (Abril/Noviembre): velos de neblina que otorgan una atmósfera mística inigualable.'
        }
      ],
      en: [
        {
          headingHook: '## 2.',
          img1: '/images/Blog/mejor-epoca-para-viajar-a-peru-guia-completa/01-machu-picchu-cielo-despejado-invierno.webp',
          alt1: 'Machu Picchu blue skies in dry season',
          cap1: 'Dry Season (May to October): deep blue skies, radiant sunshine, and crystal-clear mountain vistas.',
          img2: '/images/Blog/mejor-epoca-para-viajar-a-peru-guia-completa/02-valle-sagrado-temporada-verde-lluvias.webp',
          alt2: 'Emerald green Sacred Valley during rainy season',
          cap2: 'Green Season (December to March): lush emerald valleys, fewer crowds, and vibrant waterfalls.'
        },
        {
          headingHook: '## 3.',
          img1: '/images/Blog/mejor-epoca-para-viajar-a-peru-guia-completa/03-costa-lima-miraflores-verano.webp',
          alt1: 'Sunny summer in coastal Lima Miraflores',
          cap1: 'Coastal Lima (December to April): warm summer weather, Pacific beaches, and sunset surfs.',
          img2: '/images/Blog/mejor-epoca-para-viajar-a-peru-guia-completa/04-montana-7-colores-dia-soleado.webp',
          alt2: 'Rainbow Mountain Vinicunca on a clear sunny day',
          cap2: 'High Altitude Treks: optimal color vibrancy at Vinicunca and Humantay during the dry months.'
        },
        {
          headingHook: '## 4.',
          img1: '/images/Blog/mejor-epoca-para-viajar-a-peru-guia-completa/05-cusco-inti-raymi-fiesta-sol.webp',
          alt1: 'Inti Raymi Festival of the Sun in Cusco',
          cap1: 'June in Cusco: the imperial Jubilee month and the grand Inti Raymi solstice celebration at Sacsayhuamán.',
          img2: '/images/Blog/mejor-epoca-para-viajar-a-peru-guia-completa/06-neblina-mistica-machu-picchu-nubes.webp',
          alt2: 'Mystical morning mist over Machu Picchu',
          cap2: 'Shoulder Months (April / November): enchanting morning mists parting over ancient stone citadel.'
        }
      ],
      pt: [
        {
          headingHook: '## 2.',
          img1: '/images/Blog/mejor-epoca-para-viajar-a-peru-guia-completa/01-machu-picchu-cielo-despejado-invierno.webp',
          alt1: 'Machu Picchu com céu claro na época seca',
          cap1: 'Estação Seca (Maio a Outubro): céu azul anil, sol radiante e visibilidade perfeita das montanhas.',
          img2: '/images/Blog/mejor-epoca-para-viajar-a-peru-guia-completa/02-valle-sagrado-temporada-verde-lluvias.webp',
          alt2: 'Vale Sagrado verde esmeralda na época de chuvas',
          cap2: 'Estação Verde (Dezembro a Março): vales esmeralda floridos, menos multidões e cachoeiras ativas.'
        },
        {
          headingHook: '## 3.',
          img1: '/images/Blog/mejor-epoca-para-viajar-a-peru-guia-completa/03-costa-lima-miraflores-verano.webp',
          alt1: 'Verão na costa e praias de Lima',
          cap1: 'Costa e Lima (Dezembro a Abril): verão ensolarado, praias do Pacífico e gastronomia à beira-mar.',
          img2: '/images/Blog/mejor-epoca-para-viajar-a-peru-guia-completa/04-montana-7-colores-dia-soleado.webp',
          alt2: 'Montanha de 7 Cores em dia ensolarado',
          cap2: 'Trilhas nos Andes: máxima nitidez de cores em Vinicunca e Humantay nos meses secos de inverno.'
        },
        {
          headingHook: '## 4.',
          img1: '/images/Blog/mejor-epoca-para-viajar-a-peru-guia-completa/05-cusco-inti-raymi-fiesta-sol.webp',
          alt1: 'Festa do Sol Inti Raymi em Cusco',
          cap1: 'Junho em Cusco: mês festivo imperial e a grandiosa celebração do Inti Raymi em Sacsayhuamán.',
          img2: '/images/Blog/mejor-epoca-para-viajar-a-peru-guia-completa/06-neblina-mistica-machu-picchu-nubes.webp',
          alt2: 'Neblina mística ao amanhecer em Machu Picchu',
          cap2: 'Meses de transição (Abril e Novembro): véus de névoa mágica que criam um cenário cinematográfico único.'
        }
      ]
    },
    featured: {
      es: {
        headingHook: '## 5.',
        img: '/images/Blog/mejor-epoca-para-viajar-a-peru-guia-completa/07-selva-amazonia-rio-temporada-seca.webp',
        alt: 'Navegación por el río Tambopata en época seca',
        cap: 'Amazonía Peruana: de mayo a octubre bajan los caudales fluviales facilitando el avistamiento de jaguares, caimanes y nutrias gigantes en las orillas.'
      },
      en: {
        headingHook: '## 5.',
        img: '/images/Blog/mejor-epoca-para-viajar-a-peru-guia-completa/07-selva-amazonia-rio-temporada-seca.webp',
        alt: 'Tambopata river cruising during dry season',
        cap: 'Peruvian Amazon: May to October offers lower river levels, maximizing sightings of jaguars, caimans, and giant river otters on sandy banks.'
      },
      pt: {
        headingHook: '## 5.',
        img: '/images/Blog/mejor-epoca-para-viajar-a-peru-guia-completa/07-selva-amazonia-rio-temporada-seca.webp',
        alt: 'Navegação no rio Tambopata na época seca',
        cap: 'Amazônia Peruana: de maio a outubro o nível dos rios baixa, ideal para avistar onças-pintadas, jacarés e ariranhas gigantes nas margens.'
      }
    }
  }
};

function updateMarkdownPost(filePath, slug, lang) {
  if (!fs.existsSync(filePath)) {
    console.warn(`File not found: ${filePath}`);
    return false;
  }

  const spec = BLOG_CONTENT_SPECS[slug];
  if (!spec) {
    console.warn(`No spec for slug: ${slug}`);
    return false;
  }

  const raw = fs.readFileSync(filePath, 'utf-8');
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) {
    console.warn(`Could not parse frontmatter in ${filePath}`);
    return false;
  }

  let frontmatter = match[1];
  let body = match[2];

  // 1. Update heroImage
  frontmatter = frontmatter.replace(/heroImage:\s*["'][^"']*["']/g, `heroImage: "/images/Blog/${slug}/hero.webp"`);

  // 2. Add or update imgAlbum
  const albumYaml = `imgAlbum:\n` + spec.album.map(img => `  - "${img}"`).join('\n');
  if (frontmatter.includes('imgAlbum:')) {
    frontmatter = frontmatter.replace(/imgAlbum:\s*(\n\s*-\s*["'][^"']*["'])+/g, albumYaml);
  } else {
    frontmatter = frontmatter.trimEnd() + '\n' + albumYaml + '\n';
  }

  // 3. Clean old standalone images that might conflict with our curated layout
  body = body.replace(/!\[.*?\]\(\/images\/.*?\)/g, '');
  // Also clean any previous .blog-img-grid blocks to avoid duplication if re-run
  body = body.replace(/<div class="blog-img-grid">[\s\S]*?<\/div>/g, '');
  body = body.replace(/<figure class="my-8 rounded-2xl overflow-hidden[\s\S]*?<\/figure>/g, '');

  // 4. Inject grids into body at their target heading hooks
  const grids = spec.grids[lang] || spec.grids.es;
  for (const grid of grids) {
    const gridHtml = `\n<div class="blog-img-grid">\n  <figure>\n    <img src="${grid.img1}" alt="${grid.alt1}" loading="lazy" />\n    <figcaption>${grid.cap1}</figcaption>\n  </figure>\n  <figure>\n    <img src="${grid.img2}" alt="${grid.alt2}" loading="lazy" />\n    <figcaption>${grid.cap2}</figcaption>\n  </figure>\n</div>\n`;

    const idx = body.indexOf(grid.headingHook);
    if (idx !== -1) {
      // Find end of that heading line
      const lineEnd = body.indexOf('\n', idx);
      if (lineEnd !== -1) {
        body = body.slice(0, lineEnd + 1) + gridHtml + body.slice(lineEnd + 1);
      }
    }
  }

  // 5. Inject featured photo if specified
  const feat = spec.featured?.[lang] || spec.featured?.es;
  if (feat) {
    const featHtml = `\n<figure class="my-8 rounded-2xl overflow-hidden shadow-lg border border-slate-200/80 not-prose">\n  <img src="${feat.img}" alt="${feat.alt}" class="w-full h-80 sm:h-96 object-cover cursor-zoom-in" loading="lazy" />\n  <figcaption class="p-3 bg-slate-50 text-center text-xs text-slate-500 italic border-t border-slate-100">${feat.cap}</figcaption>\n</figure>\n`;

    const fIdx = body.indexOf(feat.headingHook);
    if (fIdx !== -1) {
      const fLineEnd = body.indexOf('\n', fIdx);
      if (fLineEnd !== -1) {
        body = body.slice(0, fLineEnd + 1) + featHtml + body.slice(fLineEnd + 1);
      }
    }
  }

  // Clean extra blank lines
  body = body.replace(/\n{4,}/g, '\n\n');

  const newContent = `---\n${frontmatter.trim()}\n---\n\n${body.trim()}\n`;
  fs.writeFileSync(filePath, newContent, 'utf-8');
  return true;
}

function run() {
  const langs = ['es', 'en', 'pt'];
  const slugs = Object.keys(BLOG_CONTENT_SPECS);
  let updatedCount = 0;

  for (const slug of slugs) {
    for (const lang of langs) {
      const filePath = path.resolve(process.cwd(), `src/content/blog/${lang}/${slug}.md`);
      const ok = updateMarkdownPost(filePath, slug, lang);
      if (ok) {
        console.log(`✓ Updated [${lang}]: ${slug}`);
        updatedCount++;
      }
    }
  }

  console.log(`\n🎉 Successfully updated ${updatedCount} blog markdown files across 3 languages!`);
}

run();
