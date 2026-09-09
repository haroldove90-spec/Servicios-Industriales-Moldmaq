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

export interface CoverageLocationItem {
  id: string;
  name: string;
  mapUrl?: string;
}

export interface SiteConfig {
  pageTitle: string;
  logoUrl: string;
  brandName?: string;
  brandNameColor?: string;
  brandSuffix?: string;
  brandSuffixColor?: string;
  brandSuffixBgColor?: string;
  brandSubtitle?: string;
  brandSubtitleColor?: string;
  logoSubtext: string;
  logoSubtextColor?: string;
  showLogoText?: boolean;
  primaryColor: string;
  secondaryColor: string;
  
  // Header Customization
  headerBgColor?: string;
  headerTextColor?: string;
  headerCtaText?: string;
  headerCtaBgColor?: string;
  headerCtaTextColor?: string;

  // Mobile Menu Customization
  mobileMenuBgColor?: string;
  mobileMenuTextColor?: string;
  mobileMenuActiveBgColor?: string;
  mobileMenuActiveTextColor?: string;
  mobileMenuBorderColor?: string;

  // Top Bar Customization
  showTopBar?: boolean;
  topBarBgColor?: string;
  topBarTextColor?: string;
  topBarIconColor?: string;
  topBarNoticeText?: string;
  topBarCoverageText?: string;
  topBarButtonText?: string;
  topBarButtonBgColor?: string;
  topBarButtonTextColor?: string;

  // Contact & Top Bar
  faviconUrl?: string;
  topPhones: string[];
  contactEmails?: string[];
  whatsappNumber: string;
  whatsappMessage: string;
  facebookPage: string;
  coverageAreas: string[];

  // Hero Slider (3 slides)
  heroSlides: HeroSlide[];
  heroButtonBgColor?: string;
  heroButtonTextColor?: string;
  heroSecButtonText?: string;
  heroSecButtonBgColor?: string;
  heroSecButtonTextColor?: string;
  heroTitleColor?: string;
  heroSubtitleColor?: string;

  // Welcome section below slider
  welcomeMessageTitle: string;
  welcomeMessageSubtitle: string;
  welcomeMessageBody: string;
  welcomeBgColor?: string;
  welcomeCardBgColor?: string;
  welcomeCardBorderColor?: string;
  welcomeTagline?: string;
  welcomeTaglineColor?: string;
  welcomeStripBgColor?: string;
  welcomeStripTextColor?: string;
  welcomeStripNotice?: string;
  welcomeStripUrgent?: string;
  welcomeStripEmail?: string;
  welcomeBadgeText?: string;
  welcomeBadgeBgColor?: string;
  welcomeBadgeTextColor?: string;
  welcomeTitleColor?: string;
  welcomeSubtitleColor?: string;
  welcomeBodyColor?: string;
  welcomeCoverageTitle?: string;
  welcomeAreaBgColor?: string;
  welcomeAreaTextColor?: string;
  welcomeAreaBorderColor?: string;

  // Nosotros / About Us
  aboutTitle: string;
  aboutSubtitle: string;
  aboutHeadline?: string;
  aboutDescription: string;
  aboutBgColor?: string;
  aboutBadgeText?: string;
  aboutBadgeBgColor?: string;
  aboutBadgeTextColor?: string;
  aboutTitleColor?: string;
  aboutSubtitleColor?: string;
  aboutHeadlineColor?: string;
  aboutDescriptionColor?: string;
  aboutCardBgColor?: string;
  aboutCardBorderColor?: string;
  aboutFeatureTitleColor?: string;
  aboutFeatureDescColor?: string;
  aboutIconColor?: string;
  aboutImageUrl: string;
  aboutImageBadge: string;
  aboutImageBadgeBgColor?: string;
  aboutImageBadgeTextColor?: string;
  aboutImageTitle: string;
  aboutImageTitleColor?: string;
  aboutImageSubtitle: string;
  aboutImageSubtitleColor?: string;
  aboutFeature1Title: string;
  aboutFeature1Desc: string;
  aboutFeature2Title: string;
  aboutFeature2Desc: string;
  aboutWelcomeTitle: string;
  aboutWelcomeText: string;
  aboutWelcomeCardBgColor?: string;
  aboutWelcomeTitleColor?: string;
  aboutWelcomeTextColor?: string;
  aboutWelcomeLinkText?: string;
  aboutWelcomeLinkColor?: string;
  aboutPillarsTitle?: string;
  aboutPillarsCardBgColor?: string;
  aboutValuesTitle?: string;
  aboutValuesTitleColor?: string;
  aboutValuesSubtitle?: string;
  aboutValuesSubtitleColor?: string;
  aboutQuoteBoxTitle: string;
  aboutQuoteBoxTitleColor?: string;
  aboutQuoteBoxSubtitle: string;
  aboutQuoteBoxSubtitleColor?: string;
  aboutQuoteBoxButtonText: string;
  aboutQuoteBoxButtonBgColor?: string;
  aboutQuoteBoxButtonTextColor?: string;
  aboutQuoteBoxBgColor?: string;
  aboutQuoteBoxBorderColor?: string;
  aboutQuoteBoxIconBgColor?: string;
  aboutQuoteBoxIconColor?: string;
  aboutValues: ValueAddedItem[];

  // Services
  servicesTitle: string;
  servicesSubtitle: string;
  servicesList: ServiceItem[];
  servicesBgColor?: string;
  servicesBadgeText?: string;
  servicesBadgeBgColor?: string;
  servicesBadgeTextColor?: string;
  servicesTitleColor?: string;
  servicesSubtitleColor?: string;
  serviceCardBgColor?: string;
  serviceCardBorderColor?: string;
  serviceCardBadgeBgColor?: string;
  serviceCardBadgeTextColor?: string;
  serviceCardIconBgColor?: string;
  serviceCardIconColor?: string;
  serviceCardTitleColor?: string;
  serviceCardDescColor?: string;
  serviceCardCtaText?: string;
  serviceCardCtaColor?: string;

  // Gallery
  galleryTitle: string;
  gallerySubtitle: string;
  galleryImages: GalleryImage[];
  galleryBgColor?: string;
  galleryTitleColor?: string;
  gallerySubtitleColor?: string;

  // Contact Section & Google Maps
  contactTitle: string;
  contactSubtitle: string;
  contactMessage: string;
  contactBgColor?: string;
  contactBadgeText?: string;
  contactBadgeBgColor?: string;
  contactBadgeTextColor?: string;
  contactTitleColor?: string;
  contactSubtitleColor?: string;
  contactMessageColor?: string;
  
  // WhatsApp Card
  contactWaCardTitle?: string;
  contactWaCardSubtitle?: string;
  contactWaButtonText?: string;
  contactWaCardBgColor?: string;
  contactWaCardBorderColor?: string;
  contactWaCardIconBgColor?: string;
  contactWaCardIconColor?: string;
  contactWaCardTitleColor?: string;
  contactWaCardSubtitleColor?: string;
  contactWaButtonBgColor?: string;
  contactWaButtonTextColor?: string;

  // Phones Card
  contactPhonesTitle?: string;
  contactPhonesSubtitle?: string;
  contactPhonesCardBgColor?: string;
  contactPhonesCardBorderColor?: string;
  contactPhonesTitleColor?: string;
  contactPhonePillBgColor?: string;
  contactPhonePillTextColor?: string;

  // Emails Card
  contactEmailsTitle?: string;
  contactEmailsSubtitle?: string;
  contactEmailsCardBgColor?: string;
  contactEmailsCardBorderColor?: string;
  contactEmailsTitleColor?: string;
  contactEmailPillBgColor?: string;
  contactEmailPillTextColor?: string;

  // Facebook Card
  contactFacebookTitle?: string;
  contactFacebookSubtitle?: string;
  contactFbCardBgColor?: string;
  contactFbCardBorderColor?: string;
  contactFacebookTitleColor?: string;
  contactFacebookSubtitleColor?: string;

  // Coverage Card
  contactCoverageTitle?: string;
  contactCoverageTitleColor?: string;
  contactCoverageSubtitle?: string;
  contactCoveragePillBgColor?: string;
  contactCoveragePillTextColor?: string;
  contactCoveragePillBorderColor?: string;

  // Quote Form
  contactFormTitle?: string;
  contactFormSubtitle?: string;
  contactFormButtonText?: string;
  contactFormCardBgColor?: string;
  contactFormCardBorderColor?: string;
  contactFormBadgeText?: string;
  contactFormBadgeBgColor?: string;
  contactFormBadgeTextColor?: string;
  contactFormTitleColor?: string;
  contactFormSubtitleColor?: string;
  contactFormLabelColor?: string;
  contactFormButtonBgColor?: string;
  contactFormButtonTextColor?: string;

  // Google Maps
  showContactMap?: boolean;
  contactMapUrl?: string;
  contactMapTitle?: string;
  contactMapSubtitle?: string;
  contactMapAddress?: string;
  contactMapCardBgColor?: string;
  contactMapCardBorderColor?: string;
  contactMapHeaderBgColor?: string;
  contactMapBadgeText?: string;
  contactMapBadgeBgColor?: string;
  contactMapBadgeTextColor?: string;
  contactMapTitleColor?: string;
  contactMapSubtitleColor?: string;
  contactMapAddressColor?: string;
  contactMapButtonText?: string;
  contactMapButtonBgColor?: string;
  contactMapButtonTextColor?: string;
  coverageLocations?: CoverageLocationItem[];

  // Footer Customization
  footerBgColor?: string;
  footerTextColor?: string;
  footerHeadingsColor?: string;
  footerAccentColor?: string;
  footerNavTitle?: string;
  footerPlantTitle?: string;
  footerDescriptionText?: string;
  footerWaButtonText?: string;
  footerWaButtonBgColor?: string;
  footerWaButtonTextColor?: string;
  footerCopyrightText?: string;

  // Floating WhatsApp Button Customization
  floatingWaBgColor?: string;
  floatingWaTextColor?: string;
  floatingWaTooltipText?: string;
  
  // Site Status
  isSuspended?: boolean;

  // Supabase connection config
  supabaseUrl: string;
  supabaseAnonKey: string;
  supabaseBucketName: string;
  useSupabaseStorage: boolean;
}
