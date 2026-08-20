export interface HeroSlide {
  id: string;
  imageUrl: string;
  title: string;
  subtitle: string;
  buttonText: string;
}

export interface ValueAddedItem {
  id: string;
  iconName: string;
  title: string;
  description: string;
}

export interface ServiceItem {
  id: string;
  iconName: string;
  title: string;
  description: string;
  badge?: string;
}

export interface GalleryImage {
  id: string;
  url: string;
  title: string;
}

export interface SiteConfig {
  pageTitle: string;
  logoUrl: string;
  logoSubtext: string;
  primaryColor: string;
  secondaryColor: string;
  
  // Contact & Top Bar
  faviconUrl?: string;
  topPhones: string[];
  whatsappNumber: string;
  whatsappMessage: string;
  facebookPage: string;
  coverageAreas: string[];

  // Hero Slider (3 slides)
  heroSlides: HeroSlide[];

  // Welcome section below slider
  welcomeMessageTitle: string;
  welcomeMessageSubtitle: string;
  welcomeMessageBody: string;

  // Nosotros / About Us
  aboutTitle: string;
  aboutSubtitle: string;
  aboutDescription: string;
  aboutImageUrl: string;
  aboutImageBadge: string;
  aboutImageTitle: string;
  aboutImageSubtitle: string;
  aboutFeature1Title: string;
  aboutFeature1Desc: string;
  aboutFeature2Title: string;
  aboutFeature2Desc: string;
  aboutWelcomeTitle: string;
  aboutWelcomeText: string;
  aboutQuoteBoxTitle: string;
  aboutQuoteBoxSubtitle: string;
  aboutQuoteBoxButtonText: string;
  aboutValues: ValueAddedItem[];

  // Services
  servicesTitle: string;
  servicesSubtitle: string;
  servicesList: ServiceItem[];

  // Gallery
  galleryTitle: string;
  gallerySubtitle: string;
  galleryImages: GalleryImage[];

  // Contact Section
  contactTitle: string;
  contactSubtitle: string;
  contactMessage: string;
  
  // Site Status
  isSuspended?: boolean;

  // Supabase connection config
  supabaseUrl: string;
  supabaseAnonKey: string;
  supabaseBucketName: string;
  useSupabaseStorage: boolean;
}
