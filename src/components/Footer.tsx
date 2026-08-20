import React from 'react';
import { Logo } from './Logo';
import { Phone, MessageCircle, MapPin, Settings } from 'lucide-react';
import { WhatsAppIcon } from './WhatsAppIcon';

interface FooterProps {
  logoUrl?: string;
  logoSubtext?: string;
  whatsappNumber: string;
  phones: string[];
  onOpenAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  logoUrl,
  logoSubtext,
  whatsappNumber,
  phones,
  onOpenAdmin,
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
    <footer className="bg-gray-900 text-white pt-16 pb-12 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-gray-800">
          {/* Brand Info */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white p-3 rounded-xl inline-block shadow-md">
              <Logo logoUrl={logoUrl} subtext={logoSubtext} />
            </div>
            <p className="text-gray-400 text-sm leading-relaxed max-w-sm">
              Servicios Industriales Moldmaq S.A. Especialistas en maquinados CNC de precisión, diseño y fabricación de moldes de inyección, pailería y mantenimiento industrial integral con cobertura nacional.
            </p>
          </div>

          {/* Anchor Menu Sections */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-white font-extrabold text-sm uppercase tracking-wider border-l-2 border-[#D97706] pl-3">
              Navegación
            </h4>
            <ul className="space-y-2 text-sm text-gray-300 font-medium">
              <li>
                <a
                  href="#inicio"
                  onClick={(e) => handleNavClick(e, '#inicio')}
                  className="hover:text-amber-400 transition-colors"
                >
                  • Inicio
                </a>
              </li>
              <li>
                <a
                  href="#nosotros"
                  onClick={(e) => handleNavClick(e, '#nosotros')}
                  className="hover:text-amber-400 transition-colors"
                >
                  • Nosotros
                </a>
              </li>
              <li>
                <a
                  href="#servicios"
                  onClick={(e) => handleNavClick(e, '#servicios')}
                  className="hover:text-amber-400 transition-colors"
                >
                  • Servicios & Soluciones
                </a>
              </li>
              <li>
                <a
                  href="#contacto"
                  onClick={(e) => handleNavClick(e, '#contacto')}
                  className="hover:text-amber-400 transition-colors"
                >
                  • Contacto & Cotizaciones
                </a>
              </li>
            </ul>
          </div>

          {/* Direct Telephones */}
          <div className="lg:col-span-4 space-y-4">
            <h4 className="text-white font-extrabold text-sm uppercase tracking-wider border-l-2 border-[#D97706] pl-3">
              Atención a Plantas
            </h4>
            <div className="space-y-2 text-sm text-gray-300">
              {phones && phones.map((p, idx) => (
                <a
                  key={idx}
                  href={`tel:${cleanPhone(p)}`}
                  className="flex items-center gap-2 hover:text-amber-400 transition-colors"
                >
                  <Phone className="w-4 h-4 text-[#D97706]" />
                  <span>{p}</span>
                </a>
              ))}
              <a
                href={`https://wa.me/${whatsappNumber.replace(/\D/g, '') || '525558724410'}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#D97706] hover:bg-amber-600 text-white font-bold text-xs px-3.5 py-2 rounded-lg transition-all mt-2 shadow-xs"
              >
                <WhatsAppIcon className="w-4 h-4 text-white shrink-0" />
                <span>WhatsApp Técnico: {whatsappNumber}</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar & Admin Trigger */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 gap-4">
          <p>© {new Date().getFullYear()} Servicios Industriales Moldmaq S.A. Todos los derechos reservados.</p>

          <button
            onClick={onOpenAdmin}
            className="flex items-center gap-1.5 text-gray-400 hover:text-white transition-colors border border-gray-800 hover:border-gray-600 px-3 py-1.5 rounded-lg"
          >
            <Settings className="w-3.5 h-3.5 text-[#D97706]" />
            <span>Panel de Configuración</span>
          </button>
        </div>
      </div>
    </footer>
  );
};
