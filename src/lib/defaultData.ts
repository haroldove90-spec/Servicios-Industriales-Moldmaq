import { SiteConfig } from '../types';

export const DEFAULT_SITE_CONFIG: SiteConfig = {
  pageTitle: "Servicios Industriales Moldmaq S.A. | Maquinados CNC, Moldes y Mantenimiento Industrial",
  logoUrl: "https://glqyclphjelrdminvetb.supabase.co/storage/v1/object/public/logo/moldmaqlogo.png",
  logoSubtext: "Maquinados CNC • Moldes • Mantenimiento Industrial",
  faviconUrl: "",
  primaryColor: "#0F3B68",
  secondaryColor: "#D97706",

  topPhones: [
    "+52 55 5872 4410",
    "+52 55 5872 9934",
    "+52 55 7201 8840",
    "800 665 3627"
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

  aboutTitle: "Sobre Nuestra Empresa",
  aboutSubtitle: "Precisión, Calidad Certificada y Compromiso en Cada Proyecto Industrial",
  aboutDescription: "En Servicios Industriales Moldmaq S.A. entendemos la importancia crítica de la precisión y los tiempos de entrega en el entorno productivo actual. Diseñamos, fabricamos y reparamos moldes de inyección, troqueles, refacciones industriales y piezas únicas bajo especificaciones milimétricas.\n\nContamos con un equipo interdisciplinario de ingenieros mecánicos, matriceros expertos y operadores CNC altamente calificados, respaldados por maquinaria de última generación y estrictos protocolos de control de calidad para garantizar la total satisfacción de cada cliente.",
  aboutImageUrl: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80",
  aboutImageBadge: "Calidad de Exportación",
  aboutImageTitle: "Ingeniería y Precisión Milimétrica",
  aboutImageSubtitle: "Fabricación con tolerancias de alta exigencia y materiales certificados.",
  aboutFeature1Title: "Centros de Maquinado CNC Multiejes",
  aboutFeature1Desc: "Capacidad para piezas complejas y producciones en serie.",
  aboutFeature2Title: "Soporte y Mantenimiento 24/7",
  aboutFeature2Desc: "Atención inmediata a paros de línea y urgencias industriales.",
  aboutWelcomeTitle: "Bienvenidos a Moldmaq S.A.",
  aboutWelcomeText: "En Servicios Industriales Moldmaq S.A. transformamos acero y metales en componentes de máxima exactitud. Ofrecemos soluciones integrales en maquinados, moldes y mantenimiento con los más rigurosos estándares.",
  aboutQuoteBoxTitle: "Cotiza tu proyecto industrial",
  aboutQuoteBoxSubtitle: "Envíanos tus planos o requerimientos por WhatsApp y te responderemos de inmediato.",
  aboutQuoteBoxButtonText: "COTIZAR PROYECTO",

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

  isSuspended: false,

  supabaseUrl: "https://glqyclphjelrdminvetb.supabase.co",
  supabaseAnonKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdscXljbHBoamVscmRtaW52ZXRiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODcyNTgwODQsImV4cCI6MjEwMjgzNDA4NH0.hRS-aJVB0TaejtfD-NaGUAjJodNiGJ9rufS2VGazfmw",
  supabaseBucketName: "moldmaq-media",
  useSupabaseStorage: true
};

