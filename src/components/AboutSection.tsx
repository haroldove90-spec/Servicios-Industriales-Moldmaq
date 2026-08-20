import React from 'react';
import { ValueAddedItem } from '../types';
import { ShieldCheck, Wrench, Clock, CheckCircle2, Award, Cpu, Factory, Cog } from 'lucide-react';
import { WhatsAppIcon } from './WhatsAppIcon';

interface AboutSectionProps {
  title: string;
  subtitle: string;
  description: string;
  values: ValueAddedItem[];
  imageUrl?: string;
  imageBadge?: string;
  imageTitle?: string;
  imageSubtitle?: string;
  feature1Title?: string;
  feature1Desc?: string;
  feature2Title?: string;
  feature2Desc?: string;
  welcomeTitle?: string;
  welcomeText?: string;
  quoteBoxTitle?: string;
  quoteBoxSubtitle?: string;
  quoteBoxButtonText?: string;
  whatsappNumber?: string;
  aboutBgColor?: string;
}

export const AboutSection: React.FC<AboutSectionProps> = ({
  title,
  subtitle,
  description,
  values,
  imageUrl = "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80",
  imageBadge = "Calidad de Exportación",
  imageTitle = "Personal Altamente Capacitado",
  imageSubtitle = "Ingenieros mecánicos, matriceros y operadores CNC certificados.",
  feature1Title = "Centros de Maquinado CNC Multiejes",
  feature1Desc = "Capacidad para piezas complejas y producciones en serie.",
  feature2Title = "Soporte y Mantenimiento 24/7",
  feature2Desc = "Atención inmediata a paros de línea y urgencias industriales.",
  welcomeTitle = "Bienvenidos a Moldmaq S.A.",
  welcomeText = "En Servicios Industriales Moldmaq S.A., transformamos acero y metales en componentes de máxima exactitud. Ofrecemos soluciones integrales en maquinados, moldes y mantenimiento con los más rigurosos estándares.",
  quoteBoxTitle = "Cotiza tu proyecto industrial",
  quoteBoxSubtitle = "Envíanos tus planos o requerimientos por WhatsApp y te responderemos de inmediato.",
  quoteBoxButtonText = "COTIZAR PROYECTO",
  whatsappNumber = "525558724410",
  aboutBgColor = "#ffffff"
}) => {
  const renderIcon = (name: string) => {
    switch (name) {
      case 'ShieldCheck':
        return <ShieldCheck className="w-7 h-7 text-[#0F3B68]" />;
      case 'Truck':
      case 'Wrench':
      case 'Factory':
        return <Wrench className="w-7 h-7 text-[#D97706]" />;
      case 'Clock':
        return <Clock className="w-7 h-7 text-[#0F3B68]" />;
      case 'Cpu':
        return <Cpu className="w-7 h-7 text-[#D97706]" />;
      default:
        return <Award className="w-7 h-7 text-[#0F3B68]" />;
    }
  };

  const getWaUrl = () => {
    const text = "Hola, deseo solicitar una cotización técnica con Servicios Industriales Moldmaq S.A.";
    return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`;
  };

  return (
    <section id="nosotros" style={{ backgroundColor: aboutBgColor }} className="py-20 border-b border-gray-100 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-block bg-[#0F3B68]/10 text-[#0F3B68] font-extrabold text-xs uppercase tracking-widest px-3 py-1 rounded-full">
            Nuestra Empresa
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
            {title}
          </h2>
          <p className="text-lg font-semibold text-[#D97706]">
            {subtitle}
          </p>
        </div>

        {/* Business Description & Visual Box */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-16">
          <div className="lg:col-span-7 space-y-6">
            <h3 className="text-2xl font-bold text-gray-900 leading-snug">
              Líderes en Maquinados CNC, Fabricación de Moldes y Soluciones Industriales
            </h3>

            <p className="text-gray-700 text-base leading-relaxed whitespace-pre-line">
              {description}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-gray-200 shadow-2xs">
                <CheckCircle2 className="w-5 h-5 text-[#D97706] shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-sm text-gray-900">{feature1Title}</h4>
                  <p className="text-xs text-gray-600">{feature1Desc}</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-gray-200 shadow-2xs">
                <CheckCircle2 className="w-5 h-5 text-[#D97706] shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-sm text-gray-900">{feature2Title}</h4>
                  <p className="text-xs text-gray-600">{feature2Desc}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl overflow-hidden shadow-xl border border-gray-200 group">
              <img
                src={imageUrl}
                alt={imageTitle || "Nuestra Empresa - Servicios Industriales Moldmaq S.A."}
                className="w-full h-80 sm:h-96 object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 text-white space-y-1.5">
                {imageBadge && (
                  <span className="inline-block bg-[#D97706] text-white font-extrabold text-xs uppercase px-3 py-1 rounded-md shadow-xs">
                    {imageBadge}
                  </span>
                )}
                {imageTitle && (
                  <p className="font-extrabold text-xl pt-1 leading-snug">{imageTitle}</p>
                )}
                {imageSubtitle && (
                  <p className="text-xs text-gray-200 font-medium leading-relaxed">{imageSubtitle}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* 3 Value Added Points */}
        <div className="pt-8 border-t border-gray-100">
          <div className="text-center mb-10">
            <h3 className="text-2xl font-extrabold text-[#0F3B68]">
              Valores Agregados de Nuestro Servicio Industrial
            </h3>
            <p className="text-xs text-gray-500 mt-1">Precisión, confiabilidad y cumplimiento estricto de tolerancias</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 bg-white">
            {/* Left Welcome Text */}
            <div className="space-y-4 p-6 bg-slate-50/80 rounded-xl border border-gray-200 flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-bold text-[#0F3B68] mb-2">{welcomeTitle}</h3>
                <p className="text-xs text-gray-600 leading-relaxed font-normal">
                  {welcomeText}
                </p>
              </div>
              <a href="#contacto" className="pt-4 flex items-center gap-2 text-[#D97706] text-[10px] font-bold uppercase tracking-wider hover:underline">
                <div className="w-6 h-[1px] bg-[#D97706]"></div> Conoce nuestras capacidades
              </a>
            </div>

            {/* Middle Values List */}
            <div className="space-y-4 p-6 bg-white rounded-xl border border-gray-200 shadow-2xs">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Nuestros Pilares Técnicos</h3>
              <ul className="space-y-3.5">
                {values && values.map((val, index) => (
                  <li key={val.id || index} className="flex items-start gap-3">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${
                      index % 2 === 0 ? 'bg-blue-50 text-[#0F3B68]' : 'bg-amber-50 text-[#D97706]'
                    }`}>
                      {index + 1}
                    </div>
                    <div>
                      <p className="text-[11px] font-bold text-gray-900">{val.title}</p>
                      <p className="text-[10px] text-gray-500 leading-tight">{val.description}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Right Quick WhatsApp Quote Card */}
            <div className="bg-slate-50 rounded-xl p-6 flex flex-col justify-center items-center text-center border border-gray-200 shadow-xs">
              <div className="w-12 h-12 rounded-full bg-[#D97706] text-white flex items-center justify-center mb-3 shadow-sm">
                <WhatsAppIcon className="w-6 h-6 text-white shrink-0" />
              </div>
              <h4 className="text-sm font-bold text-gray-800 mb-1">{quoteBoxTitle}</h4>
              <p className="text-[10px] text-gray-500 mb-4">{quoteBoxSubtitle}</p>
              <a
                href={getWaUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 bg-[#D97706] hover:bg-amber-600 text-white rounded-xl text-xs font-bold text-center transition-all shadow-md flex items-center justify-center gap-2"
              >
                <WhatsAppIcon className="w-4 h-4 text-white shrink-0" />
                <span>{quoteBoxButtonText}</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

