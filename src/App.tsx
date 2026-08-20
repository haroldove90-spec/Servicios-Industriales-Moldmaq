import React, { useState, useEffect } from 'react';
import { SiteConfig } from './types';
import { loadSiteConfig, loadSiteConfigFromSupabase, applyThemeColors } from './lib/supabaseClient';
import { TopBar } from './components/TopBar';
import { Header } from './components/Header';
import { HeroSlider } from './components/HeroSlider';
import { WelcomeBanner } from './components/WelcomeBanner';
import { AboutSection } from './components/AboutSection';
import { ServicesSection } from './components/ServicesSection';
import { GallerySlider } from './components/GallerySlider';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { AdminPanel } from './components/AdminPanel';
import { AdminLogin } from './components/AdminLogin';
import { SuspendedHome } from './components/SuspendedHome';
import { WhatsAppIcon } from './components/WhatsAppIcon';
import { AlertTriangle, ArrowLeft, ShieldAlert } from 'lucide-react';

export default function App() {
  const [config, setConfig] = useState<SiteConfig>(loadSiteConfig());
  const [currentView, setCurrentView] = useState<'suspended' | 'landing' | 'admin'>(() => {
    const initialConfig = loadSiteConfig();
    if (typeof window !== 'undefined') {
      if (window.location.hash === '#admin' || window.location.pathname === '/admin') {
        return 'admin';
      }
      if (window.location.hash === '#sitio' || window.location.hash === '#preview') {
        return 'landing';
      }
    }
    return initialConfig.isSuspended ? 'suspended' : 'landing';
  });
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('moldmaq_admin_authenticated') === 'true';
  });

  // Check URL hash for direct #admin or #preview or #sitio access
  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash === '#admin' || window.location.pathname === '/admin') {
        setCurrentView('admin');
      } else if (window.location.hash === '#sitio' || window.location.hash === '#preview') {
        setCurrentView('landing');
      } else if (window.location.hash === '#suspendido') {
        setCurrentView('suspended');
      } else {
        setCurrentView(config.isSuspended ? 'suspended' : 'landing');
      }
    };
    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [config.isSuspended]);

  // Fetch live config from Supabase on mount
  useEffect(() => {
    async function fetchRemoteConfig() {
      const remoteConfig = await loadSiteConfigFromSupabase(config);
      if (remoteConfig) {
        setConfig(remoteConfig);
        applyThemeColors(remoteConfig.primaryColor, remoteConfig.secondaryColor);
        if (window.location.hash !== '#admin' && window.location.hash !== '#preview' && window.location.hash !== '#sitio') {
          setCurrentView(remoteConfig.isSuspended ? 'suspended' : 'landing');
        }
      }
    }
    fetchRemoteConfig();
  }, []);

  // Apply colors dynamically on boot or update
  useEffect(() => {
    applyThemeColors(config.primaryColor, config.secondaryColor);
  }, [config.primaryColor, config.secondaryColor]);

  // Update page title and favicon
  useEffect(() => {
    if (config.pageTitle) {
      document.title = config.pageTitle;
    }
    if (config.faviconUrl) {
      let link: HTMLLinkElement | null = document.querySelector("link[rel*='icon']");
      if (!link) {
        link = document.createElement('link');
        link.rel = 'shortcut icon';
        document.getElementsByTagName('head')[0].appendChild(link);
      }
      link.href = config.faviconUrl;
    }
  }, [config.pageTitle, config.faviconUrl]);

  const handleUpdateConfig = (newConfig: SiteConfig) => {
    setConfig(newConfig);
    applyThemeColors(newConfig.primaryColor, newConfig.secondaryColor);
  };

  const handleOpenAdmin = () => {
    setCurrentView('admin');
    window.location.hash = 'admin';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCloseAdmin = () => {
    setCurrentView(config.isSuspended ? 'suspended' : 'landing');
    if (window.location.hash === '#admin') {
      window.history.pushState("", document.title, window.location.pathname + window.location.search);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleGoToSuspended = () => {
    setCurrentView('suspended');
    window.location.hash = 'suspendido';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAdminLogout = () => {
    sessionStorage.removeItem('moldmaq_admin_authenticated');
    setIsAdminAuthenticated(false);
  };

  if (currentView === 'admin') {
    if (!isAdminAuthenticated) {
      return (
        <AdminLogin
          config={config}
          onLoginSuccess={() => setIsAdminAuthenticated(true)}
          onBackToSite={handleCloseAdmin}
        />
      );
    }

    return (
      <div className="min-h-screen bg-gray-100 font-sans text-gray-900 selection:bg-[#0F3B68] selection:text-white">
        <AdminPanel
          isOpen={true}
          onClose={handleCloseAdmin}
          onLogout={handleAdminLogout}
          config={config}
          onUpdateConfig={handleUpdateConfig}
        />
      </div>
    );
  }

  // Suspended Home view (only if site is suspended and not previewing)
  if (currentView === 'suspended') {
    return (
      <SuspendedHome
        config={config}
        onOpenAdmin={handleOpenAdmin}
        onPreviewSite={() => {
          setCurrentView('landing');
          window.location.hash = 'preview';
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans selection:bg-[#0F3B68] selection:text-white flex flex-col">
      
      {/* Preview Mode Alert Banner - Only shown if site is in suspended mode */}
      {config.isSuspended && (
        <div className="bg-amber-500 text-slate-950 px-4 py-2 text-xs font-bold flex items-center justify-between shadow-sm sticky top-0 z-50">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-slate-950 shrink-0" />
            <span>MODO VISTA PREVIA: El sitio público muestra la pantalla de suspensión por falta de pago.</span>
          </div>
          <button
            onClick={handleGoToSuspended}
            className="inline-flex items-center gap-1.5 bg-slate-950 text-white hover:bg-slate-800 px-3 py-1 rounded-md text-[11px] font-bold transition-all shrink-0 ml-2"
          >
            <ArrowLeft className="w-3 h-3" />
            <span>Volver al Home Suspendido</span>
          </button>
        </div>
      )}

      {/* 1. Top Bar */}
      <TopBar
        phones={config.topPhones}
        whatsappNumber={config.whatsappNumber}
        bgColor={config.topBarBgColor}
        textColor={config.topBarTextColor}
        noticeText={config.topBarNoticeText}
        coverageText={config.topBarCoverageText}
        buttonText={config.topBarButtonText}
        buttonBgColor={config.topBarButtonBgColor}
        buttonTextColor={config.topBarButtonTextColor}
      />

      {/* 2. Header Navigation */}
      <Header
        logoUrl={config.logoUrl}
        logoSubtext={config.logoSubtext}
        whatsappNumber={config.whatsappNumber}
        onOpenAdmin={handleOpenAdmin}
        headerBgColor={config.headerBgColor}
        headerTextColor={config.headerTextColor}
        headerCtaText={config.headerCtaText}
        headerCtaBgColor={config.headerCtaBgColor}
        headerCtaTextColor={config.headerCtaTextColor}
        primaryColor={config.primaryColor}
      />

      {/* Main Anchor Content Sections */}
      <main className="flex-1">
        {/* 3. Hero Slider (#inicio) */}
        <HeroSlider
          slides={config.heroSlides}
          whatsappNumber={config.whatsappNumber}
          defaultMessage={config.whatsappMessage}
        />

        {/* 4. Welcome Message Below Slider */}
        <WelcomeBanner
          title={config.welcomeMessageTitle}
          subtitle={config.welcomeMessageSubtitle}
          body={config.welcomeMessageBody}
          coverageAreas={config.coverageAreas}
        />

        {/* 5. About Us & 3 Value Added Points (#nosotros) */}
        <AboutSection
          title={config.aboutTitle}
          subtitle={config.aboutSubtitle}
          description={config.aboutDescription}
          values={config.aboutValues}
          imageUrl={config.aboutImageUrl}
          imageBadge={config.aboutImageBadge}
          imageTitle={config.aboutImageTitle}
          imageSubtitle={config.aboutImageSubtitle}
          feature1Title={config.aboutFeature1Title}
          feature1Desc={config.aboutFeature1Desc}
          feature2Title={config.aboutFeature2Title}
          feature2Desc={config.aboutFeature2Desc}
          welcomeTitle={config.aboutWelcomeTitle}
          welcomeText={config.aboutWelcomeText}
          quoteBoxTitle={config.aboutQuoteBoxTitle}
          quoteBoxSubtitle={config.aboutQuoteBoxSubtitle}
          quoteBoxButtonText={config.aboutQuoteBoxButtonText}
          whatsappNumber={config.whatsappNumber}
          aboutBgColor={config.aboutBgColor}
        />

        {/* 6. Services Section (#servicios) */}
        <ServicesSection
          title={config.servicesTitle}
          subtitle={config.servicesSubtitle}
          services={config.servicesList}
          whatsappNumber={config.whatsappNumber}
          servicesBgColor={config.servicesBgColor}
        />

        {/* 7. Horizontal Moving Business Gallery Slider */}
        <GallerySlider
          title={config.galleryTitle}
          subtitle={config.gallerySubtitle}
          images={config.galleryImages}
          galleryBgColor={config.galleryBgColor}
        />

        {/* 8. Contact Section (#contacto) */}
        <ContactSection
          title={config.contactTitle}
          subtitle={config.contactSubtitle}
          message={config.contactMessage}
          phones={config.topPhones}
          whatsappNumber={config.whatsappNumber}
          facebookPage={config.facebookPage}
          coverageAreas={config.coverageAreas}
          contactBgColor={config.contactBgColor}
        />
      </main>

      {/* 9. Footer */}
      <Footer
        logoUrl={config.logoUrl}
        logoSubtext={config.logoSubtext}
        whatsappNumber={config.whatsappNumber}
        phones={config.topPhones}
        onOpenAdmin={handleOpenAdmin}
        footerBgColor={config.footerBgColor}
        footerTextColor={config.footerTextColor}
      />

      {/* Floating WhatsApp Action Button */}
      {config.whatsappNumber && (
        <a
          href={`https://wa.me/${config.whatsappNumber.replace(/\D/g, '') || '525558724410'}?text=${encodeURIComponent(config.whatsappMessage || 'Hola, quisiera cotizar un maquinado/proyecto con Servicios Industriales Moldmaq S.A.')}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            backgroundColor: config.floatingWaBgColor || '#25D366',
            color: config.floatingWaTextColor || '#ffffff'
          }}
          className="fixed bottom-6 right-6 z-40 p-3.5 sm:p-4 rounded-full shadow-2xl transition-all transform hover:scale-110 flex items-center justify-center border-2 border-white group cursor-pointer"
          aria-label="Contactar por WhatsApp"
        >
          <WhatsAppIcon className="w-7 h-7 text-white shrink-0" />
          <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs transition-all duration-300 ease-in-out font-bold text-xs pl-0 group-hover:pl-2.5">
            {config.floatingWaTooltipText || 'Cotizar por WhatsApp'}
          </span>
        </a>
      )}
    </div>
  );
}
