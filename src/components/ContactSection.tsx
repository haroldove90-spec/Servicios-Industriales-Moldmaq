import React, { useState } from 'react';
import { MessageCircle, Phone, MapPin, Facebook, Send, Clock, CheckCircle2 } from 'lucide-react';
import { WhatsAppIcon } from './WhatsAppIcon';

interface ContactSectionProps {
  title: string;
  subtitle: string;
  message: string;
  phones: string[];
  whatsappNumber: string;
  facebookPage: string;
  coverageAreas: string[];
}

export const ContactSection: React.FC<ContactSectionProps> = ({
  title,
  subtitle,
  message,
  phones,
  whatsappNumber,
  facebookPage,
  coverageAreas,
}) => {
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [serviceType, setServiceType] = useState('Mudanza Residencial');
  const [details, setDetails] = useState('');

  const cleanPhone = (p: string) => p.replace(/\D/g, '');

  const handleSendQuote = (e: React.FormEvent) => {
    e.preventDefault();
    const text = `Hola, quisiera solicitar una cotización con Vazquez Multitransport:\n- Servicio: ${serviceType}\n- Origen: ${origin || 'No especificado'}\n- Destino: ${destination || 'No especificado'}\n- Detalle: ${details || 'Sin detalles extra'}`;
    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  return (
    <section id="contacto" className="py-20 bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-block bg-[#1D7946]/10 text-[#1D7946] font-extrabold text-xs uppercase tracking-widest px-3 py-1 rounded-full">
            Contacto e Informes
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
            {title}
          </h2>
          <p className="text-lg font-semibold text-[#1D7946]">
            {subtitle}
          </p>
          <p className="text-base text-gray-700 leading-relaxed max-w-2xl mx-auto">
            {message}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Contact Direct Cards (Phone, WhatsApp, FB, Schedule) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Primary WhatsApp Card */}
            <div className="bg-emerald-50 border-2 border-[#1D7946] p-6 rounded-2xl shadow-md relative overflow-hidden">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-[#1D7946] text-white flex items-center justify-center shrink-0 shadow-md">
                  <WhatsAppIcon className="w-7 h-7 text-white shrink-0" />
                </div>
                <div>
                  <h3 className="font-extrabold text-xl text-gray-900">WhatsApp Directo</h3>
                  <p className="text-xs text-emerald-800 font-semibold">Respuesta inmediata los 365 días</p>
                </div>
              </div>

              <a
                href={`https://wa.me/${whatsappNumber.replace(/\D/g, '') || '5523068535'}?text=${encodeURIComponent('Hola, deseo solicitar una cotización con Vazquez Multitransport.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2.5 bg-[#1D7946] hover:bg-emerald-700 text-white font-extrabold px-6 py-3.5 rounded-xl w-full text-center transition-all shadow-md transform hover:-translate-y-0.5"
              >
                <WhatsAppIcon className="w-5 h-5 text-white shrink-0" />
                <span>Enviar WhatsApp: {whatsappNumber}</span>
              </a>
            </div>

            {/* Direct Telephones Card */}
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-4">
              <div className="flex items-center gap-3 border-b border-gray-100 pb-3">
                <Phone className="w-6 h-6 text-[#0E5197]" />
                <h3 className="font-bold text-lg text-gray-900">Líneas Telefónicas Directas</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                {phones && phones.map((p, idx) => (
                  <a
                    key={idx}
                    href={`tel:${cleanPhone(p)}`}
                    className="flex items-center gap-2.5 p-3 rounded-xl bg-gray-50 hover:bg-blue-50 border border-gray-200 hover:border-[#0E5197] text-gray-900 font-bold text-sm transition-all group"
                  >
                    <Phone className="w-4 h-4 text-[#0E5197] group-hover:scale-110 transition-transform" />
                    <span>{p}</span>
                  </a>
                ))}
              </div>
            </div>

            {/* Facebook Page & Coverage */}
            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200 space-y-4">
              <div className="flex items-center gap-3">
                <Facebook className="w-6 h-6 text-blue-600" />
                <div>
                  <h4 className="font-bold text-sm text-gray-900">Página Oficial de Facebook</h4>
                  <p className="text-xs text-gray-600">Siga nuestras publicaciones y reseñas</p>
                </div>
              </div>

              <a
                href={`https://facebook.com/${facebookPage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-bold text-blue-700 hover:text-blue-900 hover:underline"
              >
                facebook.com/{facebookPage}
              </a>

              <div className="pt-3 border-t border-gray-200">
                <div className="flex items-center gap-2 text-xs font-bold text-gray-700 mb-2">
                  <MapPin className="w-4 h-4 text-[#1D7946]" />
                  <span>Rutas de Servicio Continuo:</span>
                </div>
                <p className="text-xs text-gray-600 leading-relaxed font-medium">
                  {coverageAreas ? coverageAreas.join(', ') : 'Toluca, Pachuca, Querétaro, CDMX, Edomex y toda la República.'}
                </p>
              </div>
            </div>
          </div>

          {/* Direct Interactive Quote Form */}
          <div className="lg:col-span-7 bg-white p-8 sm:p-10 rounded-2xl border border-gray-200 shadow-md">
            <div className="mb-6">
              <span className="text-xs font-extrabold uppercase tracking-wider text-[#0E5197] bg-blue-50 px-3 py-1 rounded-full">
                Cotización Expresa
              </span>
              <h3 className="text-2xl font-extrabold text-gray-900 mt-2">
                Solicitar Cotización sin Compromiso
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                Llene este formulario y se enviará estructurado a nuestro WhatsApp para atención inmediata.
              </p>
            </div>

            <form onSubmit={handleSendQuote} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1">
                  Tipo de Servicio
                </label>
                <select
                  value={serviceType}
                  onChange={(e) => setServiceType(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#0E5197] focus:border-[#0E5197] text-sm font-medium bg-white"
                >
                  <option value="Mudanza Residencial">Mudanza Residencial / Ejecutiva</option>
                  <option value="Flete Local">Flete Local / Carga Ligera</option>
                  <option value="Flete Foráneo">Flete Foráneo a Toda la República</option>
                  <option value="Empaques Especiales">Empaque y Embalaje Profesional</option>
                  <option value="Cambio de Oficinas">Cambio de Oficinas Corporativas</option>
                  <option value="Obras de Arte">Traslado de Obras de Arte / Delicado</option>
                  <option value="Stands / Expos">Stands y Material para Expos</option>
                  <option value="Trailer 53 Pies">Tráiler Caja Seca 53 Pies</option>
                  <option value="Audio e Iluminación">Transporte de Audio e Iluminación</option>
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1">
                    Lugar de Origen
                  </label>
                  <input
                    type="text"
                    placeholder="Ej. CDMX, Col. Roma / Toluca"
                    value={origin}
                    onChange={(e) => setOrigin(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#0E5197] text-sm"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1">
                    Lugar de Destino
                  </label>
                  <input
                    type="text"
                    placeholder="Ej. Querétaro / Pachuca / Edomex"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#0E5197] text-sm"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1">
                  Detalles adicionales / Objetos a trasladar
                </label>
                <textarea
                  rows={3}
                  placeholder="Ej. Casa de 3 recámaras, requiere maniobras o volado de muebles..."
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#0E5197] text-sm resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2.5 bg-[#1D7946] hover:bg-emerald-700 text-white font-extrabold text-base px-6 py-4 rounded-xl transition-all shadow-lg hover:shadow-emerald-900/30 transform hover:-translate-y-0.5 cursor-pointer"
              >
                <WhatsAppIcon className="w-5 h-5 text-white shrink-0" />
                <span>Enviar Cotización por WhatsApp</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};
