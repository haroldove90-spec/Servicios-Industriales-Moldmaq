import React, { useState, useEffect } from 'react';
import { Logo } from './Logo';
import { Menu, X, MessageCircle, Settings } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { WhatsAppIcon } from './WhatsAppIcon';

interface HeaderProps {
  logoUrl?: string;
  brandName?: string;
  brandSuffix?: string;
  brandSubtitle?: string;
  logoSubtext?: string;
  showLogoText?: boolean;
  whatsappNumber: string;
  onOpenAdmin: () => void;
  headerBgColor?: string;
  headerTextColor?: string;
  headerCtaText?: string;
  headerCtaBgColor?: string;
  headerCtaTextColor?: string;
  primaryColor?: string;
}

export const Header: React.FC<HeaderProps> = ({
  logoUrl,
  brandName,
  brandSuffix,
  brandSubtitle,
  logoSubtext,
  showLogoText,
  whatsappNumber,
  onOpenAdmin,
  headerBgColor = '#ffffff',
  headerTextColor = '#1e293b',
  headerCtaText = 'Cotizar Proyecto',
  headerCtaBgColor = '#D97706',
  headerCtaTextColor = '#ffffff',
  primaryColor = '#0F3B68'
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('inicio');
  const [isScrolled, setIsScrolled] = useState(false);

  // Determine if header has dark background to adjust defaults
  const isDarkHeader = (() => {
    if (!headerBgColor) return false;
    const hex = headerBgColor.replace('#', '');
    if (hex.length === 6) {
      const r = parseInt(hex.substring(0, 2), 16);
      const g = parseInt(hex.substring(2, 4), 16);
      const b = parseInt(hex.substring(4, 6), 16);
      return (r * 0.299 + g * 0.587 + b * 0.114) < 140;
    }
    return false;
  })();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);

      const sections = ['inicio', 'nosotros', 'servicios', 'contacto'];
      const scrollPosition = window.scrollY + 120;

      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Inicio', href: '#inicio' },
    { name: 'Nosotros', href: '#nosotros' },
    { name: 'Servicios', href: '#servicios' },
    { name: 'Contacto', href: '#contacto' },
  ];

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const targetId = href.replace('#', '');
    const wasMenuOpen = isMenuOpen;
    setIsMenuOpen(false);

    const performScroll = () => {
      const targetEl = document.getElementById(targetId);
      if (targetEl) {
        const headerEl = document.querySelector('header');
        const headerOffset = headerEl ? headerEl.offsetHeight : 70;
        const elementPosition = targetEl.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: Math.max(0, offsetPosition),
          behavior: 'smooth'
        });
      }
    };

    if (wasMenuOpen) {
      setTimeout(performScroll, 260);
    } else {
      performScroll();
    }
  };

  return (
    <header 
      style={{ backgroundColor: headerBgColor }}
      className={`sticky top-0 z-40 transition-all duration-200 border-b ${
        isDarkHeader ? 'border-white/10' : 'border-gray-200/80'
      } ${
        isScrolled ? 'shadow-md py-1.5 sm:py-2' : 'py-2 sm:py-3.5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 flex items-center justify-between gap-2">
        {/* Brand Logo */}
        <a href="#inicio" onClick={(e) => handleNavClick(e, '#inicio')} className="focus:outline-hidden shrink-0">
          <Logo 
            logoUrl={logoUrl} 
            brandName={brandName}
            brandSuffix={brandSuffix}
            brandSubtitle={brandSubtitle}
            subtext={logoSubtext} 
            showLogoText={showLogoText}
            isDarkHeader={isDarkHeader}
          />
        </a>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-7">
          {navLinks.map((link) => {
            const isActive = activeSection === link.href.replace('#', '');
            return (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                style={{
                  color: isActive ? (isDarkHeader ? '#ffffff' : primaryColor) : headerTextColor,
                  opacity: isActive ? 1 : 0.85
                }}
                className="text-xs sm:text-sm font-semibold transition-all relative py-1 tracking-tight hover:opacity-100"
              >
                {link.name}
                {isActive && (
                  <motion.div
                    layoutId="activeNavIndicator"
                    style={{ backgroundColor: isDarkHeader ? '#fbbf24' : primaryColor }}
                    className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </a>
            );
          })}
        </nav>

        {/* Right Action Buttons */}
        <div className="hidden lg:flex items-center gap-3">
          {headerCtaText && headerCtaText.trim() !== '' && (
            <a
              href={`https://wa.me/${whatsappNumber.replace(/\D/g, '') || '525558724410'}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{ backgroundColor: headerCtaBgColor, color: headerCtaTextColor }}
              className="inline-flex items-center gap-2 font-bold text-xs px-4 py-2.5 rounded-md transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5 hover:opacity-90 cursor-pointer"
            >
              <WhatsAppIcon className="w-4 h-4 text-white shrink-0" />
              <span>{headerCtaText}</span>
            </a>
          )}

          <button
            onClick={onOpenAdmin}
            title="Panel de Administración"
            style={{
              color: isDarkHeader ? '#ffffff' : '#475569',
              borderColor: isDarkHeader ? 'rgba(255,255,255,0.2)' : '#e2e8f0'
            }}
            className="p-2 hover:opacity-80 rounded-md transition-colors border cursor-pointer"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>

        {/* Mobile Controls: Admin Icon & Hamburger Menu Toggle */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={onOpenAdmin}
            title="Panel de Administración"
            style={{ color: isDarkHeader ? '#ffffff' : headerTextColor }}
            className="p-2 rounded-lg"
          >
            <Settings className="w-5 h-5" />
          </button>

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            style={{ color: isDarkHeader ? '#ffffff' : headerTextColor }}
            className="p-2.5 rounded-lg focus:outline-hidden transition-colors"
            aria-label="Abrir Menú"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Animated Mobile Dropdown Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            style={{ backgroundColor: isDarkHeader ? '#0f172a' : '#ffffff' }}
            className="md:hidden border-b border-black/10 overflow-hidden shadow-xl"
          >
            <div className="px-4 pt-3 pb-6 space-y-2">
              {navLinks.map((link) => {
                const isActive = activeSection === link.href.replace('#', '');
                return (
                  <a
                    key={link.name}
                    href={link.href}
                    onClick={(e) => handleNavClick(e, link.href)}
                    style={{
                      color: isActive ? '#ffffff' : (isDarkHeader ? '#cbd5e1' : '#334155'),
                      backgroundColor: isActive ? primaryColor : 'transparent'
                    }}
                    className="block px-4 py-3 rounded-xl font-bold text-base transition-colors"
                  >
                    {link.name}
                  </a>
                );
              })}

              {headerCtaText && headerCtaText.trim() !== '' && (
                <div className="pt-2">
                  <a
                    href={`https://wa.me/${whatsappNumber.replace(/\D/g, '') || '525558724410'}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ backgroundColor: headerCtaBgColor, color: headerCtaTextColor }}
                    className="flex items-center justify-center gap-2.5 font-bold px-4 py-3 rounded-xl w-full text-center shadow-xs"
                  >
                    <WhatsAppIcon className="w-5 h-5 text-white shrink-0" />
                    <span>{headerCtaText}</span>
                  </a>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
