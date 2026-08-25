// Title y meta description por página y por idioma, para páginas que antes
// heredaban el título/descripción genérico de Layout.astro (no únicos, y
// siempre en español sin importar el idioma de la URL).
export const pageMeta = {
  home: {
    es: {
      title: 'Peru Beyond — Agencia de Tours en Cusco | Machu Picchu, Valle Sagrado y todo Perú',
      description: 'Agencia de viajes en Cusco con guías locales certificados. Tours a Machu Picchu, Valle Sagrado, Camino Inca y paquetes por todo Perú. Reserva segura y atención personalizada en español, inglés y portugués.',
    },
    en: {
      title: 'Peru Beyond — Cusco Tour Agency | Machu Picchu, Sacred Valley and All of Peru',
      description: 'Cusco-based travel agency with certified local guides. Tours to Machu Picchu, Sacred Valley, Inca Trail and packages across Peru. Secure booking and personalized service in Spanish, English and Portuguese.',
    },
    pt: {
      title: 'Peru Beyond — Agência de Turismo em Cusco | Machu Picchu, Vale Sagrado e todo o Peru',
      description: 'Agência de viagens em Cusco com guias locais certificados. Passeios a Machu Picchu, Vale Sagrado, Trilha Inca e pacotes por todo o Peru. Reserva segura e atendimento personalizado em espanhol, inglês e português.',
    },
  },
  equipo: {
    es: {
      title: 'Nuestro Equipo | Peru Beyond',
      description: 'Conoce al equipo de guías y asesores de Peru Beyond en Cusco: profesionales certificados apasionados por mostrarte lo mejor de Perú.',
    },
    en: {
      title: 'Our Team | Peru Beyond',
      description: 'Meet the Peru Beyond team of certified local guides and travel advisors in Cusco, passionate about showing you the best of Peru.',
    },
    pt: {
      title: 'Nossa Equipe | Peru Beyond',
      description: 'Conheça a equipe de guias e consultores da Peru Beyond em Cusco: profissionais certificados apaixonados por mostrar o melhor do Peru.',
    },
  },
  faq: {
    es: {
      title: 'Preguntas Frecuentes | Peru Beyond',
      description: 'Resolvemos tus dudas sobre reservas, pagos, itinerarios y qué llevar en tus tours por Cusco, Machu Picchu y el resto de Perú.',
    },
    en: {
      title: 'Frequently Asked Questions | Peru Beyond',
      description: 'Answers about bookings, payments, itineraries and what to pack for your tours to Cusco, Machu Picchu and the rest of Peru.',
    },
    pt: {
      title: 'Perguntas Frequentes | Peru Beyond',
      description: 'Respondemos suas dúvidas sobre reservas, pagamentos, itinerários e o que levar em seus passeios por Cusco, Machu Picchu e todo o Peru.',
    },
  },
  sobreNosotros: {
    es: {
      title: 'Sobre Nosotros | Peru Beyond',
      description: 'Somos una agencia de tours en Cusco con guías locales certificados. Conoce nuestra historia, valores y compromiso con el turismo responsable en Perú.',
    },
    en: {
      title: 'About Us | Peru Beyond',
      description: "We're a tour agency in Cusco with certified local guides. Learn about our story, values and commitment to responsible tourism in Peru.",
    },
    pt: {
      title: 'Sobre Nós | Peru Beyond',
      description: 'Somos uma agência de turismo em Cusco com guias locais certificados. Conheça nossa história, valores e compromisso com o turismo responsável no Peru.',
    },
  },
  terminos: {
    es: {
      title: 'Términos y Condiciones | Peru Beyond',
      description: 'Políticas de reserva, pagos, cancelación y condiciones de servicio de los tours de Peru Beyond en Cusco y el resto de Perú.',
    },
    en: {
      title: 'Terms and Conditions | Peru Beyond',
      description: 'Booking, payment and cancellation policies, and service terms for Peru Beyond tours in Cusco and the rest of Peru.',
    },
    pt: {
      title: 'Termos e Condições | Peru Beyond',
      description: 'Políticas de reserva, pagamento, cancelamento e condições de serviço dos passeios da Peru Beyond em Cusco e no restante do Peru.',
    },
  },
  blog: {
    es: {
      title: 'Blog de Viajes | Peru Beyond',
      description: 'Historias, guías y consejos sobre Cusco, Machu Picchu y los destinos más impresionantes de Perú, escritos por nuestro equipo local.',
    },
    en: {
      title: 'Travel Blog | Peru Beyond',
      description: "Stories, guides and tips about Cusco, Machu Picchu and Peru's most breathtaking destinations, written by our local team.",
    },
    pt: {
      title: 'Blog de Viagens | Peru Beyond',
      description: 'Histórias, guias e dicas sobre Cusco, Machu Picchu e os destinos mais impressionantes do Peru, escritos pela nossa equipe local.',
    },
  },
  contacto: {
    es: {
      title: 'Contacto | Peru Beyond',
      description: 'Contáctanos para reservar tu tour ideal en Perú. Teléfono, WhatsApp, email y oficina en Cusco.',
    },
    en: {
      title: 'Contact Us | Peru Beyond',
      description: 'Get in touch to book your ideal tour in Peru. Phone, WhatsApp, email and our office in Cusco.',
    },
    pt: {
      title: 'Contato | Peru Beyond',
      description: 'Fale conosco para reservar o passeio ideal no Peru. Telefone, WhatsApp, e-mail e nosso escritório em Cusco.',
    },
  },
  actividades: {
    es: {
      title: 'Actividades Culturales y Gastronómicas | PeruBeyond',
      description: 'Vive la auténtica cultura peruana con talleres de gastronomía, clases de Pisco Sour y arte andino. Experiencias únicas con PeruBeyond en Cusco.',
    },
    en: {
      title: 'Cultural & Culinary Activities | PeruBeyond',
      description: 'Live authentic Peruvian culture with gastronomy workshops, Pisco Sour classes and Andean art. Unique experiences with PeruBeyond in Cusco.',
    },
    pt: {
      title: 'Atividades Culturais e Gastronômicas | PeruBeyond',
      description: 'Vivencie a autêntica cultura peruana com oficinas de gastronomia, aulas de Pisco Sour e arte andina. Experiências únicas com a PeruBeyond em Cusco.',
    },
  },
  actividadGastronomia: {
    es: {
      title: 'Clásicos de la Gastronomía Peruana | PeruBeyond',
      description: 'Vive un taller gastronómico auténtico en Cusco: aprende a preparar Causita Limeña, Lomo Saltado y Crepe de Quinua de la mano de un chef experto. Reserva con PeruBeyond.',
    },
    en: {
      title: 'Classic Peruvian Cuisine Workshop | PeruBeyond',
      description: 'Experience an authentic cooking workshop in Cusco: learn to make Causita Limeña, Lomo Saltado and Quinoa Crepe with an expert chef. Book with PeruBeyond.',
    },
    pt: {
      title: 'Clássicos da Gastronomia Peruana | PeruBeyond',
      description: 'Viva uma oficina gastronômica autêntica em Cusco: aprenda a preparar Causita Limeña, Lomo Saltado e Crepe de Quinoa com um chef experiente. Reserve com a PeruBeyond.',
    },
  },
  actividadPisco: {
    es: {
      title: 'Making Sour + Pisco Tasting | PeruBeyond',
      description: 'Aprende a preparar el auténtico Pisco Sour y degusta variedades de pisco peruano de la mano de un bartender experto en Cusco. Reserva con PeruBeyond.',
    },
    en: {
      title: 'Pisco Sour Making & Tasting Class | PeruBeyond',
      description: 'Learn to make an authentic Pisco Sour and taste different Peruvian pisco varieties with an expert bartender in Cusco. Book with PeruBeyond.',
    },
    pt: {
      title: 'Making Sour + Degustação de Pisco | PeruBeyond',
      description: 'Aprenda a preparar um autêntico Pisco Sour e deguste variedades de pisco peruano com um bartender experiente em Cusco. Reserve com a PeruBeyond.',
    },
  },
  actividadToritos: {
    es: {
      title: 'Pintado de Toritos de Pucará | PeruBeyond',
      description: 'Descubre el arte andino peruano pintando tu propio Torito de Pucará. Un taller cultural único en Cusco donde te llevas tu creación como recuerdo. Reserva con PeruBeyond.',
    },
    en: {
      title: 'Torito de Pucará Painting Workshop | PeruBeyond',
      description: 'Discover Peruvian Andean art by painting your own Torito de Pucará. A unique cultural workshop in Cusco where you take your creation home. Book with PeruBeyond.',
    },
    pt: {
      title: 'Oficina de Pintura do Torito de Pucará | PeruBeyond',
      description: 'Descubra a arte andina peruana pintando seu próprio Torito de Pucará. Uma oficina cultural única em Cusco onde você leva sua criação para casa. Reserve com a PeruBeyond.',
    },
  },
  toursIndex: {
    es: {
      title: 'Tours Perú – Peru Beyond',
      description: 'Descubre todos nuestros tours y paquetes por Perú: Cusco, Machu Picchu, Lima, Paracas y más. Experiencias únicas con guías expertos.',
    },
    en: {
      title: 'Peru Tours – Peru Beyond',
      description: 'Discover all our tours and packages across Peru: Cusco, Machu Picchu, Lima, Paracas and more. Unique experiences with expert guides.',
    },
    pt: {
      title: 'Passeios pelo Peru – Peru Beyond',
      description: 'Descubra todos os nossos passeios e pacotes pelo Peru: Cusco, Machu Picchu, Lima, Paracas e muito mais. Experiências únicas com guias especializados.',
    },
  },
  toursCusco: {
    es: {
      title: 'Tours en Cusco – Peru Beyond',
      description: 'Descubre los mejores tours en Cusco: city tour, Montaña de 7 Colores, Valle Sagrado, Laguna Humantay, Machu Picchu y más. Guías expertos, salidas diarias.',
    },
    en: {
      title: 'Cusco Tours – Peru Beyond',
      description: 'Discover the best tours in Cusco: city tour, Rainbow Mountain, Sacred Valley, Humantay Lake, Machu Picchu and more. Expert guides, daily departures.',
    },
    pt: {
      title: 'Passeios em Cusco – Peru Beyond',
      description: 'Descubra os melhores passeios em Cusco: city tour, Montanha de 7 Cores, Vale Sagrado, Lagoa Humantay, Machu Picchu e muito mais. Guias especializados, saídas diárias.',
    },
  },
  toursMachuPicchu: {
    es: {
      title: 'Tours Machu Picchu – Peru Beyond',
      description: 'Paquetes a Machu Picchu desde Cusco: 3, 4, 5, 6 y 7 días. Incluye tren, bus, guía y alojamiento. La maravilla del mundo te espera.',
    },
    en: {
      title: 'Machu Picchu Tours – Peru Beyond',
      description: 'Machu Picchu packages from Cusco: 3, 4, 5, 6 and 7 days. Includes train, bus, guide and lodging. The wonder of the world awaits you.',
    },
    pt: {
      title: 'Passeios a Machu Picchu – Peru Beyond',
      description: 'Pacotes a Machu Picchu saindo de Cusco: 3, 4, 5, 6 e 7 dias. Inclui trem, ônibus, guia e hospedagem. A maravilha do mundo espera por você.',
    },
  },
  galeria: {
    es: {
      title: 'Galería | Perú Beyond',
      description: 'Explora la galería visual de Perú Beyond: paisajes, ruinas y cultura del Cusco y el Perú.',
    },
    en: {
      title: 'Gallery | Peru Beyond',
      description: 'Explore the Peru Beyond photo gallery: landscapes, ruins and culture from Cusco and the rest of Peru.',
    },
    pt: {
      title: 'Galeria | Peru Beyond',
      description: 'Explore a galeria de fotos da Peru Beyond: paisagens, ruínas e cultura de Cusco e do Peru.',
    },
  },
} as const;
