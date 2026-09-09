import React from 'react';
import { Logo } from './Logo';
import { Phone, MessageCircle, MapPin, Settings, Mail } from 'lucide-react';
import { WhatsAppIcon } from './WhatsAppIcon';

interface FooterProps {
  logoUrl?: string;
  brandName?: string;
  brandNameColor?: string;
  brandSuffix?: string;
  brandSuffixColor?: string;
  brandSuffixBgColor?: string;
  brandSubtitle?: string;
  brandSubtitleColor?: string;
  logoSubtext?: string;
  logoSubtextColor?: string;
  showLogoText?: boolean;
  whatsappNumber: string;
  phones: string[];
  emails?: string[];
  onOpenAdmin: () => void;
  footerBgColor?: string;
  footerTextColor?: string;

  // New styling props
  footerHeadingsColor?: string;
  footerAccentColor?: string;
  footerNavTitle?: string;
  footerPlantTitle?: string;
  footerDescriptionText?: string;
  footerWaButtonText?: string;
  footerWaButtonBgColor?: string;
  footerWaButtonTextColor?: string;
  footerCopyrightText?: string;
}

export const Footer: React.FC<FooterProps> = ({
  logoUrl,
  brandName,
  brandNameColor,
  brandSuffix,
  brandSuffixColor,
  brandSuffixBgColor,
  brandSubtitle,
  brandSubtitleColor,
  logoSubtext,
  logoSubtextColor,
  showLogoText,
  whatsappNumber,
  phones,
  emails = [],
  onOpenAdmin,
  footerBgColor = "#0f172a",
  footerTextColor = "#94a3b8",

  footerHeadingsColor = "#ffffff",
  footerAccentColor = "#D97706",
  footerNavTitle = "Navegación",
  footerPlantTitle = "Atención a Plantas",
  footerDescriptionText = "Servicios Industriales Moldmaq S.A. Especialistas en maquinados CNC de precisión, diseño y fabricación de moldes de inyección, pailería y mantenimiento industrial integral con cobertura nacional.",
  footerWaButtonText = "WhatsApp Técnico",
  footerWaButtonBgColor = "#D97706",
  footerWaButtonTextColor = "#ffffff",
  footerCopyrightText = "Servicios Industriales Moldmaq S.A. Todos los derechos reservados.",
}) => {
  const cleanPhone = (p: string) => p.replace(/\D/g, '');

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const targetId = href.replace('#', '');
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

  return (
    <footer style={{ backgroundColor: footerBgColor, color: footerTextColor }} className="pt-16 pb-12 border-t border-black/20 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-white/10">
          {/* Brand Info */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white p-3 rounded-xl inline-block shadow-md">
              <Logo 
                logoUrl={logoUrl} 
                brandName={brandName}
                brandNameColor={brandNameColor}
                brandSuffix={brandSuffix}
                brandSuffixColor={brandSuffixColor}
                brandSuffixBgColor={brandSuffixBgColor}
                brandSubtitle={brandSubtitle}
                brandSubtitleColor={brandSubtitleColor}
                subtext={logoSubtext} 
                logoSubtextColor={logoSubtextColor}
                showLogoText={showLogoText}
                isDarkHeader={false}
              />
            </div>
            <p className="text-sm leading-relaxed max-w-sm opacity-90">
              {footerDescriptionText}
            </p>
          </div>

          {/* Anchor Menu Sections */}
          <div className="lg:col-span-3 space-y-4">
            <h4
              style={{ color: footerHeadingsColor, borderColor: footerAccentColor }}
              className="font-extrabold text-sm uppercase tracking-wider border-l-2 pl-3"
            >
              {footerNavTitle}
            </h4>
            <ul className="space-y-2 text-sm opacity-90 font-medium">
              <li>
                <a
                  href="#inicio"
                  onClick={(e) => handleNavClick(e, '#inicio')}
                  className="hover:opacity-100 transition-colors"
                  style={{ color: footerTextColor }}
                >
                  • Inicio
                </a>
              </li>
              <li>
                <a
                  href="#nosotros"
                  onClick={(e) => handleNavClick(e, '#nosotros')}
                  className="hover:opacity-100 transition-colors"
                  style={{ color: footerTextColor }}
                >
                  • Nosotros
                </a>
              </li>
              <li>
                <a
                  href="#servicios"
                  onClick={(e) => handleNavClick(e, '#servicios')}
                  className="hover:opacity-100 transition-colors"
                  style={{ color: footerTextColor }}
                >
                  • Servicios & Soluciones
                </a>
              </li>
              <li>
                <a
                  href="#contacto"
                  onClick={(e) => handleNavClick(e, '#contacto')}
                  className="hover:opacity-100 transition-colors"
                  style={{ color: footerTextColor }}
                >
                  • Contacto & Cotizaciones
                </a>
              </li>
            </ul>
          </div>

          {/* Direct Telephones */}
          <div className="lg:col-span-4 space-y-4">
            <h4
              style={{ color: footerHeadingsColor, borderColor: footerAccentColor }}
              className="font-extrabold text-sm uppercase tracking-wider border-l-2 pl-3"
            >
              {footerPlantTitle}
            </h4>
            <div className="space-y-2 text-sm">
              {phones && phones.map((p, idx) => (
                <a
                  key={idx}
                  href={`tel:${cleanPhone(p)}`}
                  style={{ color: footerTextColor }}
                  className="flex items-center gap-2 hover:opacity-100 transition-colors"
                >
                  <Phone className="w-4 h-4" style={{ color: footerAccentColor }} />
                  <span>{p}</span>
                </a>
              ))}
              {emails && emails.length > 0 && emails.map((e, idx) => (
                <a
                  key={idx}
                  href={`mailto:${e.trim()}`}
                  style={{ color: footerTextColor }}
                  title={`Enviar correo a ${e}`}
                  className="flex items-center gap-2 hover:opacity-100 transition-colors"
                >
                  <Mail className="w-4 h-4" style={{ color: footerAccentColor }} />
                  <span className="truncate">{e}</span>
                </a>
              ))}
              <a
                href={`https://wa.me/${whatsappNumber.replace(/\D/g, '') || '525558724410'}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  backgroundColor: footerWaButtonBgColor,
                  color: footerWaButtonTextColor
                }}
                className="inline-flex items-center gap-2 hover:opacity-95 font-bold text-xs px-3.5 py-2 rounded-lg transition-all mt-2 shadow-xs cursor-pointer"
              >
                <WhatsAppIcon className="w-4 h-4 shrink-0" style={{ color: footerWaButtonTextColor }} />
                <span>{footerWaButtonText}: {whatsappNumber}</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar & Admin Trigger */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-400 gap-4">
          <p>© {new Date().getFullYear()} {footerCopyrightText}</p>

          <button
            onClick={onOpenAdmin}
            className="flex items-center gap-1.5 text-gray-400 hover:text-white transition-colors border border-gray-800 hover:border-gray-600 px-3 py-1.5 rounded-lg cursor-pointer"
          >
            <Settings className="w-3.5 h-3.5" style={{ color: footerAccentColor }} />
            <span>Panel de Configuración</span>
          </button>
        </div>
      </div>
    </footer>
  );
};
