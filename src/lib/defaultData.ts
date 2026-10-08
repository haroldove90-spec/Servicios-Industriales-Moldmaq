import { SiteConfig, QuoteServiceOption } from '../types';

export const DEFAULT_QUOTE_SERVICES: QuoteServiceOption[] = [
  { id: 'srv-1', name: 'Diseño y Fabricación de Molde de Inyección', active: true },
  { id: 'srv-2', name: 'Reparación o Modificación de Moldes y Troqueles', active: true },
  { id: 'srv-3', name: 'Maquinados CNC de Precisión (Fresado / Torno)', active: true },
  { id: 'srv-4', name: 'Mantenimiento Industrial Preventivo / Correctivo', active: true },
  { id: 'srv-5', name: 'Pailería y Soldadura Especializada (TIG/MIG)', active: true },
  { id: 'srv-6', name: 'Fabricación de Refacciones Industriales sobre Muestra', active: true },
  { id: 'srv-7', name: 'Electroerosión por Hilo y Penetración (EDM)', active: true },
  { id: 'srv-8', name: 'Automatización y Control de Procesos', active: true },
  { id: 'srv-9', name: 'Montaje y Reubicación de Maquinaria Pesada', active: true },
];

export const DEFAULT_SITE_CONFIG: SiteConfig = {
  pageTitle: "Servicios Industriales Moldmaq S.A. | Maquinados CNC, Moldes y Mantenimiento Industrial",
  logoUrl: "https://glqyclphjelrdminvetb.supabase.co/storage/v1/object/public/logo/moldmaqlogo.png",
  brandName: "MOLDMAQ",
  brandNameColor: "#0F3B68",
  brandSuffix: "S.A.",
  brandSuffixColor: "#D97706",
  brandSuffixBgColor: "rgba(217, 119, 6, 0.1)",
  brandSubtitle: "Servicios Industriales",
  brandSubtitleColor: "#475569",
  logoSubtext: "Maquinados CNC • Moldes • Mantenimiento Industrial",
  logoSubtextColor: "#94a3b8",
  showLogoText: true,
  faviconUrl: "",
  primaryColor: "#0F3B68",
  secondaryColor: "#D97706",

  // Header Defaults
  headerBgColor: "#ffffff",
  headerTextColor: "#1e293b",
  headerCtaText: "Cotizar Proyecto",
  headerCtaBgColor: "#D97706",
  headerCtaTextColor: "#ffffff",

  // Mobile Menu Defaults
  mobileMenuBgColor: "#0f172a",
  mobileMenuTextColor: "#e2e8f0",
  mobileMenuActiveBgColor: "#D97706",
  mobileMenuActiveTextColor: "#ffffff",
  mobileMenuBorderColor: "#1e293b",

  // Hero Slider Customization Defaults
  heroButtonBgColor: "#D97706",
  heroButtonTextColor: "#ffffff",
  heroSecButtonText: "Ver Soluciones",
  heroSecButtonBgColor: "rgba(255, 255, 255, 0.1)",
  heroSecButtonTextColor: "#ffffff",
  heroTitleColor: "#ffffff",
  heroSubtitleColor: "#e2e8f0",
  heroTopSubtitlePart1: "MAQUINADOS CNC & MOLDES",
  heroTopSubtitleColor1: "#FBBF24",
  heroTopSubtitlePart2: "MANTENIMIENTO INDUSTRIAL",
  heroTopSubtitleColor2: "#ffffff",
  heroTopSubtitleSeparator: "•",

  // Top Bar Defaults
  showTopBar: true,
  topBarBgColor: "#020617",
  topBarTextColor: "#cbd5e1",
  topBarIconColor: "#fbbf24",
  topBarNoticeText: "Atención a Plantas Industriales y Maquinados Urgentes",
  topBarCoverageText: "Zona Metropolitana, CDMX, Edo. Mex, Querétaro y Bajío",
  topBarButtonText: "Cotizar Maquinado",
  topBarButtonBgColor: "#D97706",
  topBarButtonTextColor: "#ffffff",

  topPhones: [
    "+52 55 5872 4410",
    "+52 55 5872 9934",
    "+52 55 7201 8840",
    "800 665 3627"
  ],
  contactEmails: [
    "ventas@moldmaq.com.mx",
    "contacto@moldmaq.com.mx"
  ],
  whatsappNumber: "525558724410",
  whatsappMessage: "Hola, me interesa cotizar un servicio de maquinado, moldes o mantenimiento con Servicios Industriales Moldmaq S.A.",
  facebookPage: "moldmaqindustriales",
  coverageAreas: ["CDMX", "Estado de México", "Querétaro", "Toluca", "Bajío", "Toda la República"],

  heroSlides: [
    {
      id: "slide-1",
      imageUrl: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1600&q=80",
      title: "Soluciones Integrales en Maquinados CNC y Moldes de Alta Precisión",
      subtitle: "Ingeniería de vanguardia, fabricación especializada y mantenimiento industrial para plantas de manufactura en todo México.",
      buttonText: "Cotizar por WhatsApp"
    },
    {
      id: "slide-2",
      imageUrl: "https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=1600&q=80",
      title: "Diseño, Fabricación y Reparación de Moldes y Troqueles",
      subtitle: "Tolerancias micrométricas, electroerosión por hilo, centros de maquinado CNC de última generación y aceros certificados.",
      buttonText: "Solicitar Asesoría Técnica"
    },
    {
      id: "slide-3",
      imageUrl: "https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=1600&q=80",
      title: "Mantenimiento Industrial Preventivo, Correctivo y Montajes",
      subtitle: "Optimizamos el rendimiento de sus líneas de producción con técnicos certificados, pailería y soldadura especializada.",
      buttonText: "Contactar a un Ingeniero"
    }
  ],

  welcomeMessageTitle: "¡Bienvenido a Servicios Industriales Moldmaq S.A.!",
  welcomeMessageSubtitle: "Su socio estratégico en maquinados industriales, moldes de inyección y mantenimiento",
  welcomeMessageBody: "En Servicios Industriales Moldmaq S.A. somos especialistas en transformar requerimientos industriales complejos en soluciones tangibles de máxima precisión. Con amplia trayectoria atendiendo a los sectores automotriz, metalmecánico, alimenticio, farmacéutico y de transformación, ofrecemos infraestructura tecnológica de punta, maquinados CNC multiejes, pailería industrial, diseño CAD/CAM y mantenimiento integral para mantener su planta operando al máximo rendimiento.",
  welcomeBgColor: "#f1f5f9",
  welcomeCardBgColor: "#ffffff",
  welcomeCardBorderColor: "#e2e8f0",
  welcomeTagline: "SERVICIOS INDUSTRIALES MOLDMAQ S.A. • CAPACIDAD DE MANUFACTURA",
  welcomeTaglineColor: "#D97706",
  welcomeStripBgColor: "#0F3B68",
  welcomeStripTextColor: "#ffffff",
  welcomeStripNotice: "Maquinados CNC, Moldes y Mantenimiento a Nivel Nacional",
  welcomeStripUrgent: "Atención a Urgencias Industriales",
  welcomeStripEmail: "contacto@moldmaq.com",
  welcomeBadgeText: "SERVICIOS INDUSTRIALES MOLDMAQ S.A.",
  welcomeBadgeBgColor: "rgba(15, 59, 104, 0.08)",
  welcomeBadgeTextColor: "#0F3B68",
  welcomeTitleColor: "#0F3B68",
  welcomeSubtitleColor: "#D97706",
  welcomeBodyColor: "#475569",
  welcomeCoverageTitle: "Zonas de Atención Industrial y Cobertura:",
  welcomeAreaBgColor: "#f8fafc",
  welcomeAreaTextColor: "#334155",
  welcomeAreaBorderColor: "#cbd5e1",

  aboutTitle: "Sobre Nuestra Empresa",
  aboutSubtitle: "Precisión, Calidad Certificada y Compromiso en Cada Proyecto Industrial",
  aboutHeadline: "Líderes en Maquinados CNC, Fabricación de Moldes y Soluciones Industriales",
  aboutDescription: "En Servicios Industriales Moldmaq S.A. entendemos la importancia crítica de la precisión y los tiempos de entrega en el entorno productivo actual. Diseñamos, fabricamos y reparamos moldes de inyección, troqueles, refacciones industriales y piezas únicas bajo especificaciones milimétricas.\n\nContamos con un equipo interdisciplinario de ingenieros mecánicos, matriceros expertos y operadores CNC altamente calificados, respaldados por maquinaria de última generación y estrictos protocolos de control de calidad para garantizar la total satisfacción de cada cliente.",
  aboutBgColor: "#ffffff",
  aboutBadgeText: "Nuestra Empresa",
  aboutBadgeBgColor: "rgba(217, 119, 6, 0.1)",
  aboutBadgeTextColor: "#D97706",
  aboutTitleColor: "#111827",
  aboutSubtitleColor: "#D97706",
  aboutHeadlineColor: "#0F3B68",
  aboutDescriptionColor: "#4b5563",
  aboutCardBgColor: "#f8fafc",
  aboutCardBorderColor: "#e2e8f0",
  aboutFeatureTitleColor: "#111827",
  aboutFeatureDescColor: "#4b5563",
  aboutIconColor: "#0F3B68",
  aboutImageUrl: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80",
  aboutImageBadge: "Calidad de Exportación",
  aboutImageBadgeBgColor: "#D97706",
  aboutImageBadgeTextColor: "#ffffff",
  aboutImageTitle: "Ingeniería y Precisión Milimétrica",
  aboutImageTitleColor: "#ffffff",
  aboutImageSubtitle: "Fabricación con tolerancias de alta exigencia y materiales certificados.",
  aboutImageSubtitleColor: "rgba(255, 255, 255, 0.9)",
  aboutFeature1Title: "Centros de Maquinado CNC Multiejes",
  aboutFeature1Desc: "Capacidad para piezas complejas y producciones en serie.",
  aboutFeature2Title: "Soporte y Mantenimiento 24/7",
  aboutFeature2Desc: "Atención inmediata a paros de línea y urgencias industriales.",
  aboutWelcomeTitle: "Bienvenidos a Moldmaq S.A.",
  aboutWelcomeText: "En Servicios Industriales Moldmaq S.A. transformamos acero y metales en componentes de máxima exactitud. Ofrecemos soluciones integrales en maquinados, moldes y mantenimiento con los más rigurosos estándares.",
  aboutWelcomeCardBgColor: "#f8fafc",
  aboutWelcomeTitleColor: "#0F3B68",
  aboutWelcomeTextColor: "#4b5563",
  aboutWelcomeLinkText: "Conoce nuestras capacidades",
  aboutWelcomeLinkColor: "#D97706",
  aboutPillarsTitle: "Nuestros Pilares Técnicos",
  aboutPillarsCardBgColor: "#ffffff",
  aboutValuesTitle: "Valores Agregados de Nuestro Servicio Industrial",
  aboutValuesTitleColor: "#0F3B68",
  aboutValuesSubtitle: "Precisión, confiabilidad y cumplimiento estricto de tolerancias",
  aboutValuesSubtitleColor: "#4b5563",
  aboutQuoteBoxTitle: "Cotiza tu proyecto industrial",
  aboutQuoteBoxTitleColor: "#111827",
  aboutQuoteBoxSubtitle: "Envíanos tus planos o requerimientos por WhatsApp y te responderemos de inmediato.",
  aboutQuoteBoxSubtitleColor: "#4b5563",
  aboutQuoteBoxButtonText: "COTIZAR PROYECTO",
  aboutQuoteBoxButtonBgColor: "#D97706",
  aboutQuoteBoxButtonTextColor: "#ffffff",
  aboutQuoteBoxBgColor: "#f8fafc",
  aboutQuoteBoxBorderColor: "#e2e8f0",
  aboutQuoteBoxIconBgColor: "#D97706",
  aboutQuoteBoxIconColor: "#ffffff",

  aboutValues: [
    {
      id: "val-1",
      iconName: "ShieldCheck",
      title: "Control de Calidad Riguroso",
      description: "Inspección dimensional con instrumentos calibrados y trazabilidad completa de materiales y procesos."
    },
    {
      id: "val-2",
      iconName: "Truck",
      title: "Infraestructura Tecnológica Avanzada",
      description: "Tornos CNC, centros de maquinado vertical, rectificadoras de superficies y equipos de electroerosión EDM."
    },
    {
      id: "val-3",
      iconName: "Clock",
      title: "Puntualidad en Tiempos de Entrega",
      description: "Compromiso estricto con los cronogramas de entrega para evitar paros no programados en su planta productiva."
    }
  ],

  servicesTitle: "Nuestras Soluciones Industriales",
  servicesSubtitle: "Capacidad técnica integral para los sectores más exigentes de la manufactura",
  servicesBgColor: "#f8fafc",
  servicesBadgeText: "Servicios Industriales y Manufactura",
  servicesBadgeBgColor: "rgba(217, 119, 6, 0.1)",
  servicesBadgeTextColor: "#D97706",
  servicesTitleColor: "#111827",
  servicesSubtitleColor: "#D97706",
  serviceCardBgColor: "#ffffff",
  serviceCardBorderColor: "#e2e8f0",
  serviceCardBadgeBgColor: "#fef3c7",
  serviceCardBadgeTextColor: "#D97706",
  serviceCardIconBgColor: "#f8fafc",
  serviceCardIconColor: "#0F3B68",
  serviceCardTitleColor: "#111827",
  serviceCardDescColor: "#4b5563",
  serviceCardCtaText: "Cotizar Solución",
  serviceCardCtaColor: "#D97706",

  servicesList: [
    {
      id: "serv-1",
      iconName: "Home",
      title: "Diseño y Fabricación de Moldes",
      description: "Moldes para inyección de plástico, soplado, termoformado y fundición a presión en aluminio y zamak.",
      badge: "Alta Especialidad"
    },
    {
      id: "serv-2",
      iconName: "Truck",
      title: "Maquinados de Precisión CNC",
      description: "Fresado y torneado CNC en aceros inoxidables, templados, aluminios especiales, bronce y plásticos de ingeniería.",
      badge: "Tolerancia Micrométrica"
    },
    {
      id: "serv-3",
      iconName: "PackageCheck",
      title: "Mantenimiento Industrial Integral",
      description: "Servicios preventivos, predictivos y correctivos para maquinaria pesada, sistemas mecánicos y líneas de ensamble.",
      badge: "Planta y Taller"
    },
    {
      id: "serv-4",
      iconName: "Palette",
      title: "Pailería y Soldadura Especializada",
      description: "Soldadura calificada TIG, MIG, Microalambre y Arco para tanques, tolvas, tuberías y estructuras de alta resistencia.",
      badge: "Certificada"
    },
    {
      id: "serv-5",
      iconName: "Building2",
      title: "Fabricación de Refacciones sobre Muestra",
      description: "Ingeniería inversa y manufactura exacta de engranes, flechas, rodillos, bujes y piezas descontinuadas.",
      badge: "Ingeniería Inversa"
    },
    {
      id: "serv-6",
      iconName: "Layers",
      title: "Electroerosión por Hilo y Penetración (EDM)",
      description: "Corte de figuras complejas y cavidades de alta dureza con acabados superficiales de máxima definición.",
      badge: "EDM Precisión"
    },
    {
      id: "serv-7",
      iconName: "Volume2",
      title: "Automatización y Control de Procesos",
      description: "Integración de sistemas neumáticos, hidráulicos, PLC, sensores y modernización de equipos industriales.",
      badge: "Industria 4.0"
    },
    {
      id: "serv-8",
      iconName: "Container",
      title: "Montaje y Reubicación de Maquinaria",
      description: "Maniobras, nivelación, anclaje y puesta en marcha de líneas de producción completas con equipo de izaje.",
      badge: "Servicio en Sitio"
    }
  ],

  galleryTitle: "Nuestras Instalaciones y Maquinaria",
  gallerySubtitle: "Conozca nuestros centros de maquinado, talleres de matricería y proyectos en ejecución",
  galleryBgColor: "#ffffff",
  galleryTitleColor: "#111827",
  gallerySubtitleColor: "#4b5563",
  galleryImages: [
    {
      id: "gal-1",
      url: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80",
      title: "Centros de Maquinado CNC de Alta Velocidad"
    },
    {
      id: "gal-2",
      url: "https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=800&q=80",
      title: "Ajuste y Fabricación de Moldes de Inyección"
    },
    {
      id: "gal-3",
      url: "https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=800&q=80",
      title: "Soldadura Especializada y Pailería Pesada"
    },
    {
      id: "gal-4",
      url: "https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&w=800&q=80",
      title: "Inspección Dimensional y Control de Calidad"
    },
    {
      id: "gal-5",
      url: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80",
      title: "Torneado CNC y Producción de Flechas y Bujes"
    }
  ],

  contactTitle: "Contáctenos para Cotizar su Proyecto",
  contactSubtitle: "Atención técnica inmediata por WhatsApp, teléfono o visita a planta",
  contactMessage: "Estamos listos para evaluar sus requerimientos técnicos. Envíenos sus planos en formato PDF, DWG, STEP o solicite una visita de nuestros ingenieros a su planta para una asesoría sin compromiso.",
  contactBgColor: "#ffffff",
  contactBadgeText: "Contacto & Cotizaciones Técnicas",
  contactBadgeBgColor: "rgba(217, 119, 6, 0.1)",
  contactBadgeTextColor: "#D97706",
  contactTitleColor: "#111827",
  contactSubtitleColor: "#D97706",
  contactMessageColor: "#374151",
  
  contactWaCardTitle: "WhatsApp Técnico Directo",
  contactWaCardSubtitle: "Respuesta inmediata de ingenieros de proyecto",
  contactWaButtonText: "Enviar WhatsApp",
  contactWaCardBgColor: "#fffbeb",
  contactWaCardBorderColor: "#D97706",
  contactWaCardIconBgColor: "#D97706",
  contactWaCardIconColor: "#ffffff",
  contactWaCardTitleColor: "#111827",
  contactWaCardSubtitleColor: "#92400e",
  contactWaButtonBgColor: "#D97706",
  contactWaButtonTextColor: "#ffffff",

  contactPhonesTitle: "Líneas de Atención a Planta",
  contactPhonesSubtitle: "Haga clic en cualquier número para iniciar una llamada directa",
  contactPhonesCardBgColor: "#ffffff",
  contactPhonesCardBorderColor: "#e2e8f0",
  contactPhonesTitleColor: "#111827",
  contactPhonePillBgColor: "#f8fafc",
  contactPhonePillTextColor: "#111827",

  contactEmailsTitle: "Correos Electrónicos de Atención",
  contactEmailsSubtitle: "Haga clic en cualquier correo para redactar y enviar un mensaje directo a nuestro equipo",
  contactEmailsCardBgColor: "#ffffff",
  contactEmailsCardBorderColor: "#e2e8f0",
  contactEmailsTitleColor: "#111827",
  contactEmailPillBgColor: "#f8fafc",
  contactEmailPillTextColor: "#111827",

  contactFacebookTitle: "Página Oficial de Facebook",
  contactFacebookSubtitle: "Siga nuestros proyectos y casos de éxito",
  contactFbCardBgColor: "#f8fafc",
  contactFbCardBorderColor: "#e2e8f0",
  contactFacebookTitleColor: "#111827",
  contactFacebookSubtitleColor: "#4b5563",

  contactCoverageTitle: "Cobertura y Atención en Sitio:",
  contactCoverageTitleColor: "#111827",
  contactCoverageSubtitle: "Haga clic en cualquier zona para ver el mapa y detalles de cobertura:",
  contactCoveragePillBgColor: "#ffffff",
  contactCoveragePillTextColor: "#1f2937",
  contactCoveragePillBorderColor: "#e5e7eb",

  contactFormTitle: "Solicitar Cotización de Maquinados o Moldes",
  contactFormSubtitle: "Llene el formulario con los datos de su proyecto para canalizarlo con el ingeniero especialista.",
  contactFormButtonText: "Enviar Cotización Técnica por WhatsApp",
  contactFormCardBgColor: "#ffffff",
  contactFormCardBorderColor: "#e2e8f0",
  contactFormBadgeText: "Cotización en Línea",
  contactFormBadgeBgColor: "#eff6ff",
  contactFormBadgeTextColor: "#0F3B68",
  contactFormTitleColor: "#111827",
  contactFormSubtitleColor: "#4b5563",
  contactFormLabelColor: "#374151",
  contactFormButtonBgColor: "#D97706",
  contactFormButtonTextColor: "#ffffff",
  quoteServiceOptions: DEFAULT_QUOTE_SERVICES,

  showContactMap: true,
  contactMapUrl: "https://maps.app.goo.gl/LQcL7r4fDj9WjZZp8",
  contactMapTitle: "Ubicación de Planta y Talleres Industriales",
  contactMapSubtitle: "Visítenos en nuestras instalaciones o solicite una visita técnica presencial",
  contactMapAddress: "Servicios Industriales Moldmaq S.A. de C.V. - Estado de México, CDMX y Bajío",
  contactMapCardBgColor: "#ffffff",
  contactMapCardBorderColor: "#e2e8f0",
  contactMapHeaderBgColor: "#f8fafc",
  contactMapBadgeText: "Ubicación Estratégica",
  contactMapBadgeBgColor: "#eff6ff",
  contactMapBadgeTextColor: "#0F3B68",
  contactMapTitleColor: "#111827",
  contactMapSubtitleColor: "#4b5563",
  contactMapAddressColor: "#6b7280",
  contactMapButtonText: "Abrir en Google Maps / Cómo llegar",
  contactMapButtonBgColor: "#0F3B68",
  contactMapButtonTextColor: "#ffffff",
  coverageLocations: [
    { id: "cov-1", name: "CDMX", mapUrl: "https://www.google.com/maps/search/CDMX+Mexico" },
    { id: "cov-2", name: "Estado de México", mapUrl: "https://www.google.com/maps/search/Estado+de+Mexico" },
    { id: "cov-3", name: "Querétaro", mapUrl: "https://www.google.com/maps/search/Queretaro+Mexico" },
    { id: "cov-4", name: "Toluca", mapUrl: "https://www.google.com/maps/search/Toluca+Mexico" },
    { id: "cov-5", name: "Bajío", mapUrl: "https://www.google.com/maps/search/Bajio+Mexico" },
    { id: "cov-6", name: "Toda la República", mapUrl: "https://www.google.com/maps/search/Republica+Mexicana" }
  ],

  // Footer Customization
  footerBgColor: "#0f172a",
  footerTextColor: "#94a3b8",
  footerHeadingsColor: "#ffffff",
  footerAccentColor: "#D97706",
  footerNavTitle: "Navegación",
  footerPlantTitle: "Atención a Plantas",
  footerDescriptionText: "Servicios Industriales Moldmaq S.A. Especialistas en maquinados CNC de precisión, diseño y fabricación de moldes de inyección, pailería y mantenimiento industrial integral con cobertura nacional.",
  footerWaButtonText: "WhatsApp Técnico Directo",
  footerWaButtonBgColor: "#D97706",
  footerWaButtonTextColor: "#ffffff",
  footerCopyrightText: "Servicios Industriales Moldmaq S.A. Todos los derechos reservados.",

  // Floating WhatsApp Button Customization
  floatingWaBgColor: "#25D366",
  floatingWaTextColor: "#ffffff",
  floatingWaTooltipText: "¿Cotizaciones o dudas? ¡Escríbenos!",

  isSuspended: false,

  supabaseUrl: "https://glqyclphjelrdminvetb.supabase.co",
  supabaseAnonKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdscXljbHBoamVscmRtaW52ZXRiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODcyNTgwODQsImV4cCI6MjEwMjgzNDA4NH0.hRS-aJVB0TaejtfD-NaGUAjJodNiGJ9rufS2VGazfmw",
  supabaseBucketName: "moldmaq-media",
  useSupabaseStorage: true
};

