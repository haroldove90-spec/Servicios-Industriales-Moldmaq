import React, { useState, useEffect } from 'react';
import { Logo } from './Logo';
import { Menu, X, MessageCircle, Settings } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { WhatsAppIcon } from './WhatsAppIcon';

interface HeaderProps {
  logoUrl?: string;
  logoSubtext?: string;
  whatsappNumber: string;
  onOpenAdmin: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  logoUrl,
  logoSubtext,
  whatsappNumber,
  onOpenAdmin
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('inicio');
  const [isScrolled, setIsScrolled] = useState(false);

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
    <header className={`sticky top-0 z-40 bg-white transition-all duration-200 border-b border-gray-200/80 ${
      isScrolled ? 'shadow-md py-1.5 sm:py-2' : 'py-2 sm:py-3.5'
    }`}>
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 flex items-center justify-between gap-2">
        {/* Brand Logo */}
        <a href="#inicio" onClick={(e) => handleNavClick(e, '#inicio')} className="focus:outline-hidden shrink-0">
          <Logo logoUrl={logoUrl} subtext={logoSubtext} />
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
                className={`text-xs sm:text-sm font-semibold transition-all relative py-1 tracking-tight ${
                  isActive ? 'text-[#0E5197] font-bold' : 'text-gray-600 hover:text-[#0E5197]'
                }`}
              >
                {link.name}
                {isActive && (
                  <motion.div
                    layoutId="activeNavIndicator"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0E5197] rounded-full"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </a>
            );
          })}
        </nav>

        {/* Right Action Buttons */}
        <div className="hidden lg:flex items-center gap-3">
          <a
            href={`https://wa.me/${whatsappNumber.replace(/\D/g, '') || '525558724410'}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-[#D97706] hover:bg-amber-600 text-white font-bold text-xs px-4 py-2.5 rounded-md transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
          >
            <WhatsAppIcon className="w-4 h-4 text-white shrink-0" />
            <span>Cotizar Proyecto</span>
          </a>

          <button
            onClick={onOpenAdmin}
            title="Panel de Administración"
            className="p-2 text-gray-500 hover:text-[#0F3B68] hover:bg-gray-100 rounded-md transition-colors border border-gray-200"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>

        {/* Mobile Controls: Admin Icon & Hamburger Menu Toggle */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={onOpenAdmin}
            title="Panel de Administración"
            className="p-2 text-gray-500 hover:text-[#0E5197] rounded-lg"
          >
            <Settings className="w-5 h-5" />
          </button>

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2.5 text-gray-800 hover:text-[#0E5197] hover:bg-gray-100 rounded-lg focus:outline-hidden transition-colors"
            aria-label="Abrir Menú"
          >
            {isMenuOpen ? <X className="w-6 h-6 text-[#0E5197]" /> : <Menu className="w-6 h-6 text-gray-800" />}
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
            className="md:hidden bg-white border-b border-gray-200 overflow-hidden shadow-xl"
          >
            <div className="px-4 pt-3 pb-6 space-y-2">
              {navLinks.map((link) => {
                const isActive = activeSection === link.href.replace('#', '');
                return (
                  <a
                    key={link.name}
                    href={link.href}
                    onClick={(e) => handleNavClick(e, link.href)}
                    className={`block px-4 py-3 rounded-xl font-bold text-base transition-colors ${
                      isActive
                        ? 'bg-blue-50 text-[#0E5197]'
                        : 'text-gray-700 hover:bg-gray-50 hover:text-[#0E5197]'
                    }`}
                  >
                    {link.name}
                  </a>
                );
              })}

              <div className="pt-2">
                <a
                  href={`https://wa.me/${whatsappNumber.replace(/\D/g, '') || '525558724410'}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2.5 bg-[#D97706] hover:bg-amber-600 text-white font-bold px-4 py-3 rounded-xl w-full text-center shadow-xs"
                >
                  <WhatsAppIcon className="w-5 h-5 text-white shrink-0" />
                  <span>Cotizar Proyecto por WhatsApp</span>
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
