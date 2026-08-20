import React, { useState } from 'react';
import { MessageCircle, Phone, MapPin, Facebook, Send, Clock, CheckCircle2, Factory, FileCode2 } from 'lucide-react';
import { WhatsAppIcon } from './WhatsAppIcon';

interface ContactSectionProps {
  title: string;
  subtitle: string;
  message: string;
  phones: string[];
  whatsappNumber: string;
  facebookPage: string;
  coverageAreas: string[];
  contactBgColor?: string;
}

export const ContactSection: React.FC<ContactSectionProps> = ({
  title,
  subtitle,
  message,
  phones,
  whatsappNumber,
  facebookPage,
  coverageAreas,
  contactBgColor = "#ffffff"
}) => {
  const [companyName, setCompanyName] = useState('');
  const [location, setLocation] = useState('');
  const [serviceType, setServiceType] = useState('Maquinados CNC de Precisión');
  const [details, setDetails] = useState('');

  const cleanPhone = (p: string) => p.replace(/\D/g, '');

  const handleSendQuote = (e: React.FormEvent) => {
    e.preventDefault();
    const text = `Hola, quisiera solicitar una cotización técnica con Servicios Industriales Moldmaq S.A.:\n- Servicio/Proyecto: ${serviceType}\n- Empresa / Contacto: ${companyName || 'No especificado'}\n- Ubicación / Planta: ${location || 'No especificado'}\n- Especificaciones / Material: ${details || 'Sin detalles extra'}`;
    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  return (
    <section id="contacto" style={{ backgroundColor: contactBgColor }} className="py-20 border-b border-gray-100 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-block bg-[#D97706]/10 text-[#D97706] font-extrabold text-xs uppercase tracking-widest px-3 py-1 rounded-full">
            Contacto & Cotizaciones Técnicas
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
            {title}
          </h2>
          <p className="text-lg font-semibold text-[#D97706]">
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
            <div className="bg-amber-50/70 border-2 border-[#D97706] p-6 rounded-2xl shadow-md relative overflow-hidden">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-[#D97706] text-white flex items-center justify-center shrink-0 shadow-md">
                  <WhatsAppIcon className="w-7 h-7 text-white shrink-0" />
                </div>
                <div>
                  <h3 className="font-extrabold text-xl text-gray-900">WhatsApp Técnico</h3>
                  <p className="text-xs text-amber-800 font-semibold">Respuesta inmediata de ingenieros de proyecto</p>
                </div>
              </div>

              <a
                href={`https://wa.me/${whatsappNumber.replace(/\D/g, '') || '525558724410'}?text=${encodeURIComponent('Hola, deseo solicitar una cotización técnica con Servicios Industriales Moldmaq S.A.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2.5 bg-[#D97706] hover:bg-amber-600 text-white font-extrabold px-6 py-3.5 rounded-xl w-full text-center transition-all shadow-md transform hover:-translate-y-0.5"
              >
                <WhatsAppIcon className="w-5 h-5 text-white shrink-0" />
                <span>Enviar WhatsApp: {whatsappNumber}</span>
              </a>
            </div>

            {/* Direct Telephones Card */}
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-4">
              <div className="flex items-center gap-3 border-b border-gray-100 pb-3">
                <Phone className="w-6 h-6 text-[#0F3B68]" />
                <h3 className="font-bold text-lg text-gray-900">Líneas de Atención a Planta</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                {phones && phones.map((p, idx) => (
                  <a
                    key={idx}
                    href={`tel:${cleanPhone(p)}`}
                    className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-[#0F3B68] text-gray-900 font-bold text-sm transition-all group"
                  >
                    <Phone className="w-4 h-4 text-[#0F3B68] group-hover:scale-110 transition-transform" />
                    <span>{p}</span>
                  </a>
                ))}
              </div>
            </div>

            {/* Facebook Page & Coverage */}
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-4">
              <div className="flex items-center gap-3">
                <Facebook className="w-6 h-6 text-blue-600" />
                <div>
                  <h4 className="font-bold text-sm text-gray-900">Página Oficial de Facebook</h4>
                  <p className="text-xs text-gray-600">Siga nuestros proyectos y casos de éxito</p>
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

              <div className="pt-3 border-t border-slate-200">
                <div className="flex items-center gap-2 text-xs font-bold text-gray-700 mb-2">
                  <MapPin className="w-4 h-4 text-[#D97706]" />
                  <span>Cobertura y Atención en Sitio:</span>
                </div>
                <p className="text-xs text-gray-600 leading-relaxed font-medium">
                  {coverageAreas ? coverageAreas.join(', ') : 'Zona Metropolitana, CDMX, Estado de México, Querétaro y Bajío.'}
                </p>
              </div>
            </div>
          </div>

          {/* Direct Interactive Quote Form */}
          <div className="lg:col-span-7 bg-white p-8 sm:p-10 rounded-2xl border border-gray-200 shadow-md">
            <div className="mb-6">
              <span className="text-xs font-extrabold uppercase tracking-wider text-[#0F3B68] bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
                Cotización en Línea
              </span>
              <h3 className="text-2xl font-extrabold text-gray-900 mt-2">
                Solicitar Cotización de Maquinados o Moldes
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                Llene el formulario con los datos de su proyecto para canalizarlo con el ingeniero especialista.
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
                <span>Enviar Cotización Técnica por WhatsApp</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

