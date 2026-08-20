import { SiteConfig } from '../types';

export const DEFAULT_SITE_CONFIG: SiteConfig = {
  pageTitle: "Vazquez Multitransport - Mudanzas y Transporte Local y Foráneo",
  logoUrl: "", // Blank uses SVG logo component by default or image if uploaded
  logoSubtext: "Soluciones Integrales de Logística",
  faviconUrl: "",
  primaryColor: "#0E5197",
  secondaryColor: "#1D7946",

  topPhones: [
    "55-6347-7853",
    "55-5526-2815",
    "55-5526-3387",
    "800-713-8526"
  ],
  whatsappNumber: "525563477853",
  whatsappMessage: "Hola, me interesa cotizar un servicio de mudanza/transporte con Vazquez Multitransport.",
  facebookPage: "VAZQUEZZMULTITRANSPORT",
  coverageAreas: ["CDMX", "Edomex", "Toluca", "Pachuca", "Querétaro", "Toda la República Mexicana"],

  heroSlides: [
    {
      id: "slide-1",
      imageUrl: "https://images.unsplash.com/photo-1600518464441-9154a4dea21b?auto=format&fit=crop&w=1600&q=80",
      title: "Soluciones Integrales de Logística y Mudanzas",
      subtitle: "Servicio profesional local y foráneo disponible los 365 días del año. Cuidamos cada detalle de tus pertenencias.",
      buttonText: "Cotizar por WhatsApp"
    },
    {
      id: "slide-2",
      imageUrl: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1600&q=80",
      title: "Mudanzas Ejecutivas, Residenciales y Corporativas",
      subtitle: "Personal altamente capacitado, empaque especializado y flotilla equipada con tráiler caja seca de 53 pies.",
      buttonText: "Enviar Mensaje Directo"
    },
    {
      id: "slide-3",
      imageUrl: "https://images.unsplash.com/photo-1519003722824-194d4455a60c?auto=format&fit=crop&w=1600&q=80",
      title: "Transporte Especializado a Toda la República",
      subtitle: "Fletes, traslado de obras de arte, stands para expos y cambio de oficinas con máxima seguridad.",
      buttonText: "Contactar Ahora"
    }
  ],

  welcomeMessageTitle: "¡Bienvenido a Transportes y Mudanzas Vazquez Multitransport!",
  welcomeMessageSubtitle: "Tu aliado de confianza para fletes, mudanzas y logística en México",
  welcomeMessageBody: "Nos especializamos en brindar un servicio de excelencia en mudanzas residenciales, corporativas y fletes de carga general. Con cobertura continua en Toluca, Pachuca, Querétaro, CDMX, Edomex y toda la República Mexicana, ponemos a su disposición unidades de moderna capacidad, maniobras especializadas y personal calificado los 365 días del año.",

  aboutTitle: "Sobre Nuestra Empresa",
  aboutSubtitle: "Compromiso, Puntualidad y Cuidado Profesional en Cada Traslado",
  aboutDescription: "En Transportes y Mudanzas Vazquez Multitransport entendemos el valor de sus pertenencias y equipo. Ofrecemos soluciones integrales de logística respaldadas por años de experiencia en el sector. Contamos con infraestructura completa que incluye desde fletes ligeros hasta tráileres con caja seca de 53 pies, brindando una atención personalizada adaptada a las necesidades específicas de cada cliente.",
  aboutImageUrl: "https://images.unsplash.com/photo-1600518464441-9154a4dea21b?auto=format&fit=crop&w=800&q=80",
  aboutImageBadge: "Garantía de Satisfacción",
  aboutImageTitle: "Personal Altamente Capacitado",
  aboutImageSubtitle: "Protección, embalaje y manejo delicado de sus pertenencias.",
  aboutFeature1Title: "Trailer Caja Seca 53 Pies",
  aboutFeature1Desc: "Capacidad para grandes volúmenes y mudanzas completas.",
  aboutFeature2Title: "Servicio los 365 Días",
  aboutFeature2Desc: "Atención continua sin interrupción en todo el país.",
  aboutWelcomeTitle: "Bienvenidos",
  aboutWelcomeText: "En Vazquez Multitransport, entendemos que cada objeto tiene un valor especial. Ofrecemos soluciones integrales de logística y transporte local con los más altos estándares de cuidado.",
  aboutQuoteBoxTitle: "Cotiza tu mudanza",
  aboutQuoteBoxSubtitle: "Respondemos al instante vía WhatsApp para tu comodidad.",
  aboutQuoteBoxButtonText: "CONTACTAR AHORA",

  aboutValues: [
    {
      id: "val-1",
      iconName: "ShieldCheck",
      title: "Seguridad y Cuidado Garantizado",
      description: "Utilizamos material de empaque de alta calidad, maniobras con equipo especializado y monitoreo de sus bienes en todo momento."
    },
    {
      id: "val-2",
      iconName: "Truck",
      title: "Infraestructura y Flotilla Versátil",
      description: "Disponemos de unidades desde camionetas ligeras hasta tráileres caja seca de 53 pies adaptados para mudanza de gran volumen."
    },
    {
      id: "val-3",
      iconName: "Clock",
      title: "Disponibilidad 365 Días del Año",
      description: "Servicio continuo las 24 horas, los 365 días del año con rutas locales y foráneas con máxima puntualidad de entrega."
    }
  ],

  servicesTitle: "Nuestros Servicios Especializados",
  servicesSubtitle: "Soluciones a la medida para particulares, ejecutivos y empresas",
  servicesList: [
    {
      id: "serv-1",
      iconName: "Home",
      title: "Mudanzas Ejecutivas y Residenciales",
      description: "Traslado completo de hogares y residencias ejecutivas. Incluye maniobras con volado de muebles y acomodo preciso.",
      badge: "Más Solicitado"
    },
    {
      id: "serv-2",
      iconName: "Truck",
      title: "Fletes y Carga General",
      description: "Transporte exprés de mercancías y carga ligera a nivel local y foráneo con entregas en tiempo récord.",
      badge: "Local y Foráneo"
    },
    {
      id: "serv-3",
      iconName: "PackageCheck",
      title: "Empaques Profesionales",
      description: "Suministro de cajas, empaque con plástico burbuja, cartón corrugado y protección especial para bienes frágiles.",
      badge: "Protección Total"
    },
    {
      id: "serv-4",
      iconName: "Palette",
      title: "Traslado de Obras de Arte",
      description: "Embalaje técnico y transporte delicado de piezas de arte, esculturas y colecciones con estrictas normas de seguridad.",
      badge: "Especializado"
    },
    {
      id: "serv-5",
      iconName: "Building2",
      title: "Cambio de Oficinas y Corporativos",
      description: "Reubicación eficiente de mobiliario de oficina, equipo de cómputo y archivos en horarios flexibles.",
      badge: "Corporativo"
    },
    {
      id: "serv-6",
      iconName: "Layers",
      title: "Stands y Material para Expos",
      description: "Logística puntual para la transportación de estands, mamparas y estructuras para ferias comerciales y exposiciones.",
      badge: "Eventos"
    },
    {
      id: "serv-7",
      iconName: "Volume2",
      title: "Equipo de Audio e Iluminación",
      description: "Unidades acondicionadas para el traslado seguro de equipo técnico de sonido, luces y producciones de eventos.",
      badge: "Especializado"
    },
    {
      id: "serv-8",
      iconName: "Container",
      title: "Tráiler Caja Seca 53 Pies",
      description: "Capacidad masiva de almacenamiento y transporte de alto volumen para mudanzas foráneas y proyectos industriales.",
      badge: "Gran Volumen"
    }
  ],

  galleryTitle: "Nuestra Flota y Operaciones",
  gallerySubtitle: "Conozca nuestras unidades y el trabajo de nuestro equipo en acción",
  galleryImages: [
    {
      id: "gal-1",
      url: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80",
      title: "Camiones con Caja Seca Espaciosa"
    },
    {
      id: "gal-2",
      url: "https://images.unsplash.com/photo-1600518464441-9154a4dea21b?auto=format&fit=crop&w=800&q=80",
      title: "Servicio de Empaque y Cuidado Extremo"
    },
    {
      id: "gal-3",
      url: "https://images.unsplash.com/photo-1519003722824-194d4455a60c?auto=format&fit=crop&w=800&q=80",
      title: "Rutas Foráneas a Toda la República"
    },
    {
      id: "gal-4",
      url: "https://images.unsplash.com/photo-1565891741441-64926e441838?auto=format&fit=crop&w=800&q=80",
      title: "Mudanzas Ejecutivas y Corporativas"
    },
    {
      id: "gal-5",
      url: "https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=800&q=80",
      title: "Transporte de Gran Volumen (53 Pies)"
    }
  ],

  contactTitle: "Contáctenos Directamente",
  contactSubtitle: "Atención inmediata por WhatsApp y líneas telefónicas directas",
  contactMessage: "Estamos listos para atenderle. Contáctenos hoy mismo a través de WhatsApp o por llamada telefónica para recibir una cotización rápida y sin compromiso para su mudanza o flete.",

  supabaseUrl: "https://snjcjrjyoouzhixymbnq.supabase.co",
  supabaseAnonKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNuamNqcmp5b291emhpeHltYm5xIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY0NTA4ODUsImV4cCI6MjEwMjAyNjg4NX0.7oyCWh91A6fEDmKfgijnhABrkuiWulLJmKUXz5W1WQI",
  supabaseBucketName: "vazquez-media",
  useSupabaseStorage: true
};
