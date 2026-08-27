import React, { useState } from 'react';
import { Phone, MapPin, Facebook, ExternalLink, Navigation, CheckCircle2 } from 'lucide-react';
import { WhatsAppIcon } from './WhatsAppIcon';
import { CoverageLocationItem } from '../types';

interface ContactSectionProps {
  title: string;
  subtitle: string;
  message: string;
  phones: string[];
  whatsappNumber: string;
  whatsappMessage?: string;
  facebookPage: string;
  coverageAreas?: string[];
  coverageLocations?: CoverageLocationItem[];
  contactBgColor?: string;
  
  // Custom texts
  contactWaCardTitle?: string;
  contactWaCardSubtitle?: string;
  contactWaButtonText?: string;
  contactPhonesTitle?: string;
  contactFacebookTitle?: string;
  contactFacebookSubtitle?: string;
  contactCoverageTitle?: string;
  contactFormTitle?: string;
  contactFormSubtitle?: string;
  contactFormButtonText?: string;
  
  // Google Maps props
  showContactMap?: boolean;
  contactMapUrl?: string;
  contactMapTitle?: string;
  contactMapSubtitle?: string;
  contactMapAddress?: string;
}

export const ContactSection: React.FC<ContactSectionProps> = ({
  title,
  subtitle,
  message,
  phones,
  whatsappNumber,
  whatsappMessage,
  facebookPage,
  coverageAreas = [],
  coverageLocations = [],
  contactBgColor = "#ffffff",
  contactWaCardTitle = "WhatsApp Técnico Directo",
  contactWaCardSubtitle = "Respuesta inmediata de ingenieros de proyecto",
  contactWaButtonText = "Enviar WhatsApp",
  contactPhonesTitle = "Líneas de Atención a Planta",
  contactFacebookTitle = "Página Oficial de Facebook",
  contactFacebookSubtitle = "Siga nuestros proyectos y casos de éxito",
  contactCoverageTitle = "Cobertura y Atención en Sitio:",
  contactFormTitle = "Solicitar Cotización de Maquinados o Moldes",
  contactFormSubtitle = "Llene el formulario con los datos de su proyecto para canalizarlo con el ingeniero especialista.",
  contactFormButtonText = "Enviar Cotización Técnica por WhatsApp",
  showContactMap = true,
  contactMapUrl = "https://maps.app.goo.gl/LQcL7r4fDj9WjZZp8",
  contactMapTitle = "Ubicación de Planta y Talleres Industriales",
  contactMapSubtitle = "Visítenos en nuestras instalaciones o solicite una visita técnica a su empresa",
  contactMapAddress = "Servicios Industriales Moldmaq S.A. de C.V. - Estado de México, CDMX y Zona Bajío",
}) => {
  const [companyName, setCompanyName] = useState('');
  const [location, setLocation] = useState('');
  const [serviceType, setServiceType] = useState('Maquinados CNC de Precisión');
  const [details, setDetails] = useState('');

  const cleanPhone = (p: string) => p.replace(/\D/g, '');

  const handleSendQuote = (e: React.FormEvent) => {
    e.preventDefault();
    const text = `Hola, quisiera solicitar una cotización técnica con Servicios Industriales Moldmaq S.A.:\n- Servicio/Proyecto: ${serviceType}\n- Empresa / Contacto: ${companyName || 'No especificado'}\n- Ubicación / Planta: ${location || 'No especificado'}\n- Especificaciones / Material: ${details || 'Sin detalles extra'}`;
    const url = `https://wa.me/${whatsappNumber.replace(/\D/g, '') || '525558724410'}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  // Helper to build embeddable iframe URL from user's Google Maps link
  const getGoogleMapsEmbedUrl = (rawUrl?: string): string => {
    if (!rawUrl || rawUrl.trim() === '') {
      return 'https://maps.google.com/maps?q=Mexico&t=&z=13&ie=UTF8&iwloc=&output=embed';
    }
    const trimmed = rawUrl.trim();

    // Check if user pasted an iframe tag
    const iframeSrcMatch = trimmed.match(/src=["']([^"']+)["']/i);
    if (iframeSrcMatch && iframeSrcMatch[1]) {
      return iframeSrcMatch[1];
    }

    // If it's already an embed link
    if (trimmed.includes('google.com/maps/embed')) {
      return trimmed;
    }

    // If it's a short URL (maps.app.goo.gl), standard URL or custom address
    return `https://maps.google.com/maps?q=${encodeURIComponent(trimmed)}&t=&z=14&ie=UTF8&iwloc=&output=embed`;
  };

  // Helper to open location in Google Maps
  const handleOpenLocationMap = (loc: CoverageLocationItem | string) => {
    if (typeof loc === 'string') {
      const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(loc)}`;
      window.open(url, '_blank', 'noopener,noreferrer');
      return;
    }

    if (loc.mapUrl && loc.mapUrl.trim() !== '') {
      window.open(loc.mapUrl.trim(), '_blank', 'noopener,noreferrer');
    } else {
      const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(loc.name)}`;
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  // Compile coverage items
  const activeCoverageList: CoverageLocationItem[] = (coverageLocations && coverageLocations.length > 0)
    ? coverageLocations
    : (coverageAreas && coverageAreas.length > 0)
      ? coverageAreas.map((area, idx) => ({
          id: `cov-${idx}`,
          name: area,
          mapUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(area)}`
        }))
      : [
          { id: '1', name: 'CDMX', mapUrl: 'https://www.google.com/maps/search/CDMX' },
          { id: '2', name: 'Estado de México', mapUrl: 'https://www.google.com/maps/search/Estado+de+Mexico' },
          { id: '3', name: 'Querétaro', mapUrl: 'https://www.google.com/maps/search/Queretaro' },
          { id: '4', name: 'Toluca', mapUrl: 'https://www.google.com/maps/search/Toluca' },
          { id: '5', name: 'Bajío', mapUrl: 'https://www.google.com/maps/search/Bajio+Mexico' },
          { id: '6', name: 'Toda la República', mapUrl: 'https://www.google.com/maps/search/Mexico' }
        ];

  return (
    <section id="contacto" style={{ backgroundColor: contactBgColor }} className="py-20 border-b border-gray-100 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-block bg-[#D97706]/10 text-[#D97706] font-extrabold text-xs uppercase tracking-widest px-3.5 py-1 rounded-full">
            Contacto & Cotizaciones Técnicas
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
            {title}
          </h2>
          <p className="text-base sm:text-lg font-semibold text-[#D97706]">
            {subtitle}
          </p>
          <p className="text-base text-gray-700 leading-relaxed max-w-2xl mx-auto">
            {message}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mb-16">
          {/* Contact Direct Cards (Phone, WhatsApp, FB, Coverage) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Primary WhatsApp Card */}
            <div className="bg-amber-50/70 border-2 border-[#D97706] p-6 rounded-2xl shadow-md relative overflow-hidden">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-[#D97706] text-white flex items-center justify-center shrink-0 shadow-md">
                  <WhatsAppIcon className="w-7 h-7 text-white shrink-0" />
                </div>
                <div>
                  <h3 className="font-extrabold text-xl text-gray-900">{contactWaCardTitle}</h3>
                  <p className="text-sm text-amber-800 font-semibold">{contactWaCardSubtitle}</p>
                </div>
              </div>

              <a
                href={`https://wa.me/${whatsappNumber.replace(/\D/g, '') || '525558724410'}?text=${encodeURIComponent(whatsappMessage || 'Hola, deseo solicitar una cotización técnica con Servicios Industriales Moldmaq S.A.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2.5 bg-[#D97706] hover:bg-amber-600 text-white font-extrabold text-sm sm:text-base px-6 py-3.5 rounded-xl w-full text-center transition-all shadow-md transform hover:-translate-y-0.5 cursor-pointer"
              >
                <WhatsAppIcon className="w-5 h-5 text-white shrink-0" />
                <span>{contactWaButtonText}: {whatsappNumber}</span>
              </a>
            </div>

            {/* Direct Telephones Card */}
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-4">
              <div className="flex items-center gap-3 border-b border-gray-100 pb-3">
                <Phone className="w-6 h-6 text-[#0F3B68]" />
                <h3 className="font-bold text-lg text-gray-900">{contactPhonesTitle}</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                {phones && phones.map((p, idx) => (
                  <a
                    key={idx}
                    href={`tel:${cleanPhone(p)}`}
                    className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-[#0F3B68] text-gray-900 font-bold text-sm transition-all group cursor-pointer"
                  >
                    <Phone className="w-4 h-4 text-[#0F3B68] group-hover:scale-110 transition-transform" />
                    <span>{p}</span>
                  </a>
                ))}
              </div>
            </div>

            {/* Facebook Page */}
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-4">
              <div className="flex items-center gap-3">
                <Facebook className="w-6 h-6 text-blue-600 shrink-0" />
                <div>
                  <h4 className="font-bold text-base text-gray-900">{contactFacebookTitle}</h4>
                  <p className="text-sm text-gray-600">{contactFacebookSubtitle}</p>
                </div>
              </div>

              <a
                href={`https://facebook.com/${facebookPage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-bold text-blue-700 hover:text-blue-900 hover:underline"
              >
                <span>facebook.com/{facebookPage}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              {/* Interactive Coverage and Location Pills */}
              <div className="pt-4 border-t border-slate-200 space-y-2.5">
                <div className="flex items-center gap-2 text-xs font-bold text-gray-800 uppercase tracking-wide">
                  <MapPin className="w-4 h-4 text-[#D97706] shrink-0" />
                  <span>{contactCoverageTitle}</span>
                </div>
                <p className="text-xs text-gray-500">
                  Haga clic en cualquier zona para ver el mapa y detalles de cobertura:
                </p>

                <div className="flex flex-wrap gap-2 pt-1">
                  {activeCoverageList.map((item, idx) => (
                    <button
                      key={item.id || idx}
                      type="button"
                      onClick={() => handleOpenLocationMap(item)}
                      title={`Abrir mapa de ${item.name} en Google Maps`}
                      className="group inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-amber-500 text-gray-800 hover:text-white font-bold text-xs rounded-lg border border-gray-200 hover:border-amber-600 shadow-2xs hover:shadow-xs transition-all cursor-pointer transform hover:-translate-y-0.5"
                    >
                      <MapPin className="w-3.5 h-3.5 text-[#D97706] group-hover:text-white transition-colors" />
                      <span>{item.name}</span>
                      <ExternalLink className="w-3 h-3 text-gray-400 group-hover:text-white/90 transition-colors" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Direct Interactive Quote Form */}
          <div className="lg:col-span-7 bg-white p-8 sm:p-10 rounded-2xl border border-gray-200 shadow-md">
            <div className="mb-6">
              <span className="text-xs font-extrabold uppercase tracking-wider text-[#0F3B68] bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
                Cotización en Línea
              </span>
              <h3 className="text-xl sm:text-2xl font-extrabold text-gray-900 mt-2">
                {contactFormTitle}
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                {contactFormSubtitle}
              </p>
            </div>

            <form onSubmit={handleSendQuote} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1">
                  Tipo de Servicio Requerido
                </label>
                <select
                  value={serviceType}
                  onChange={(e) => setServiceType(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#0F3B68] focus:border-[#0F3B68] text-sm font-medium bg-white"
                >
                  <option value="Diseño y Fabricación de Molde">Diseño y Fabricación de Molde de Inyección</option>
                  <option value="Reparación de Moldes / Troqueles">Reparación o Modificación de Moldes y Troqueles</option>
                  <option value="Maquinados CNC de Precisión">Maquinados CNC de Precisión (Fresado / Torno)</option>
                  <option value="Mantenimiento Industrial en Planta">Mantenimiento Industrial Preventivo / Correctivo</option>
                  <option value="Pailería y Soldadura Especializada">Pailería y Soldadura Especializada (TIG/MIG)</option>
                  <option value="Fabricación de Refacciones sobre Muestra">Fabricación de Refacciones Industriales sobre Muestra</option>
                  <option value="Corte por Hilo / Electroerosión EDM">Electroerosión por Hilo y Penetración (EDM)</option>
                  <option value="Automatización y Robótica">Automatización y Control de Procesos</option>
                  <option value="Montaje y Reubicación de Maquinaria">Montaje y Reubicación de Maquinaria Pesada</option>
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1">
                    Empresa / Razón Social
                  </label>
                  <input
                    type="text"
                    placeholder="Ej. Industrias ABC / Tu Nombre"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#0F3B68] text-sm"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1">
                    Planta / Ciudad / Ubicación
                  </label>
                  <input
                    type="text"
                    placeholder="Ej. Tlalnepantla, Toluca, Querétaro..."
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#0F3B68] text-sm"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1">
                  Especificaciones, Materiales y Cantidad de Piezas
                </label>
                <textarea
                  rows={3}
                  placeholder="Ej. 50 piezas en Acero AISI 4140 templado, o molde de 4 cavidades para polipropileno según plano adjunto..."
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#0F3B68] text-sm resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2.5 bg-[#D97706] hover:bg-amber-600 text-white font-extrabold text-base px-6 py-4 rounded-xl transition-all shadow-lg hover:shadow-amber-900/30 transform hover:-translate-y-0.5 cursor-pointer"
              >
                <WhatsAppIcon className="w-5 h-5 text-white shrink-0" />
                <span>{contactFormButtonText}</span>
              </button>
            </form>
          </div>
        </div>

        {/* Google Maps Interactive Section */}
        {showContactMap && (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-md overflow-hidden">
            <div className="p-6 sm:p-8 bg-slate-50 border-b border-gray-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-[#0F3B68] bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
                  <MapPin className="w-3.5 h-3.5 text-[#D97706]" />
                  <span>Ubicación Estratégica</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-extrabold text-gray-900">
                  {contactMapTitle}
                </h3>
                <p className="text-sm text-gray-600">
                  {contactMapSubtitle}
                </p>
                {contactMapAddress && (
                  <p className="text-xs font-semibold text-gray-500 pt-0.5">
                    📍 {contactMapAddress}
                  </p>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-3 shrink-0">
                <a
                  href={contactMapUrl || 'https://maps.app.goo.gl/LQcL7r4fDj9WjZZp8'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-[#0F3B68] hover:bg-blue-900 text-white font-bold text-xs sm:text-sm px-5 py-3 rounded-xl shadow-md transition-all transform hover:-translate-y-0.5 cursor-pointer"
                >
                  <Navigation className="w-4 h-4 text-[#D97706]" />
                  <span>Abrir en Google Maps / Cómo llegar</span>
                  <ExternalLink className="w-3.5 h-3.5 opacity-80" />
                </a>
              </div>
            </div>

            {/* Embedded Google Map Iframe */}
            <div className="relative w-full h-80 sm:h-96 bg-gray-100">
              <iframe
                title="Google Maps Moldmaq"
                src={getGoogleMapsEmbedUrl(contactMapUrl)}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-full"
              />
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
