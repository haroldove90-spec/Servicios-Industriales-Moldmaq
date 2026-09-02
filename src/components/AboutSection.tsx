import React from 'react';
import { ValueAddedItem } from '../types';
import { ShieldCheck, Wrench, Clock, CheckCircle2, Award, Cpu, Factory, Cog } from 'lucide-react';
import { WhatsAppIcon } from './WhatsAppIcon';

interface AboutSectionProps {
  title: string;
  subtitle: string;
  aboutHeadline?: string;
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

  // New styling props
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
  aboutImageBadgeBgColor?: string;
  aboutImageBadgeTextColor?: string;
  aboutImageTitleColor?: string;
  aboutImageSubtitleColor?: string;
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
  aboutQuoteBoxTitleColor?: string;
  aboutQuoteBoxSubtitleColor?: string;
  aboutQuoteBoxButtonBgColor?: string;
  aboutQuoteBoxButtonTextColor?: string;
  aboutQuoteBoxBgColor?: string;
  aboutQuoteBoxBorderColor?: string;
  aboutQuoteBoxIconBgColor?: string;
  aboutQuoteBoxIconColor?: string;
}

export const AboutSection: React.FC<AboutSectionProps> = ({
  title,
  subtitle,
  aboutHeadline = "Líderes en Maquinados CNC, Fabricación de Moldes y Soluciones Industriales",
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
  aboutBgColor = "#ffffff",

  aboutBadgeText = "Nuestra Empresa",
  aboutBadgeBgColor = "rgba(217, 119, 6, 0.1)",
  aboutBadgeTextColor = "#D97706",
  aboutTitleColor = "#111827",
  aboutSubtitleColor = "#D97706",
  aboutHeadlineColor = "#0F3B68",
  aboutDescriptionColor = "#374151",
  aboutCardBgColor = "#f8fafc",
  aboutCardBorderColor = "#e2e8f0",
  aboutFeatureTitleColor = "#111827",
  aboutFeatureDescColor = "#4b5563",
  aboutIconColor = "#0F3B68",
  aboutImageBadgeBgColor = "#D97706",
  aboutImageBadgeTextColor = "#ffffff",
  aboutImageTitleColor = "#ffffff",
  aboutImageSubtitleColor = "rgba(255, 255, 255, 0.9)",
  aboutWelcomeCardBgColor = "#f8fafc",
  aboutWelcomeTitleColor = "#0F3B68",
  aboutWelcomeTextColor = "#4b5563",
  aboutWelcomeLinkText = "Conoce nuestras capacidades",
  aboutWelcomeLinkColor = "#D97706",
  aboutPillarsTitle = "Nuestros Pilares Técnicos",
  aboutPillarsCardBgColor = "#ffffff",
  aboutValuesTitle = "Valores Agregados de Nuestro Servicio Industrial",
  aboutValuesTitleColor = "#0F3B68",
  aboutValuesSubtitle = "Precisión, confiabilidad y cumplimiento estricto de tolerancias",
  aboutValuesSubtitleColor = "#4b5563",
  aboutQuoteBoxTitleColor = "#111827",
  aboutQuoteBoxSubtitleColor = "#4b5563",
  aboutQuoteBoxButtonBgColor = "#D97706",
  aboutQuoteBoxButtonTextColor = "#ffffff",
  aboutQuoteBoxBgColor = "#f8fafc",
  aboutQuoteBoxBorderColor = "#e2e8f0",
  aboutQuoteBoxIconBgColor = "#D97706",
  aboutQuoteBoxIconColor = "#ffffff",
}) => {
  const getWaUrl = () => {
    const text = "Hola, deseo solicitar una cotización técnica con Servicios Industriales Moldmaq S.A.";
    return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`;
  };

  return (
    <section id="nosotros" style={{ backgroundColor: aboutBgColor }} className="py-20 border-b border-gray-100 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          {aboutBadgeText && aboutBadgeText.trim() !== '' && (
            <div
              style={{
                backgroundColor: aboutBadgeBgColor,
                color: aboutBadgeTextColor,
                borderColor: `${aboutBadgeTextColor}30`
              }}
              className="inline-block font-extrabold text-xs uppercase tracking-widest px-3.5 py-1 rounded-full border"
            >
              {aboutBadgeText}
            </div>
          )}
          <h2
            style={{ color: aboutTitleColor }}
            className="text-3xl sm:text-4xl font-extrabold tracking-tight"
          >
            {title}
          </h2>
          <p
            style={{ color: aboutSubtitleColor }}
            className="text-base sm:text-lg font-semibold"
          >
            {subtitle}
          </p>
        </div>

        {/* Business Description & Visual Box */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-16">
          <div className="lg:col-span-7 space-y-6">
            <h3
              style={{ color: aboutHeadlineColor }}
              className="text-xl sm:text-2xl font-bold leading-snug"
            >
              {aboutHeadline}
            </h3>

            <p
              style={{ color: aboutDescriptionColor }}
              className="text-base leading-relaxed whitespace-pre-line"
            >
              {description}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div
                style={{
                  backgroundColor: aboutCardBgColor,
                  borderColor: aboutCardBorderColor
                }}
                className="flex items-start gap-3 p-4 rounded-xl border shadow-2xs transition-colors"
              >
                <CheckCircle2 style={{ color: aboutIconColor }} className="w-5 h-5 shrink-0 mt-0.5" />
                <div>
                  <h4 style={{ color: aboutFeatureTitleColor }} className="font-bold text-base">{feature1Title}</h4>
                  <p style={{ color: aboutFeatureDescColor }} className="text-sm leading-relaxed mt-0.5">{feature1Desc}</p>
                </div>
              </div>

              <div
                style={{
                  backgroundColor: aboutCardBgColor,
                  borderColor: aboutCardBorderColor
                }}
                className="flex items-start gap-3 p-4 rounded-xl border shadow-2xs transition-colors"
              >
                <CheckCircle2 style={{ color: aboutIconColor }} className="w-5 h-5 shrink-0 mt-0.5" />
                <div>
                  <h4 style={{ color: aboutFeatureTitleColor }} className="font-bold text-base">{feature2Title}</h4>
                  <p style={{ color: aboutFeatureDescColor }} className="text-sm leading-relaxed mt-0.5">{feature2Desc}</p>
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
              <div className="absolute bottom-6 left-6 right-6 space-y-1.5">
                {imageBadge && (
                  <span
                    style={{
                      backgroundColor: aboutImageBadgeBgColor,
                      color: aboutImageBadgeTextColor
                    }}
                    className="inline-block font-extrabold text-xs uppercase px-3 py-1 rounded-md shadow-xs"
                  >
                    {imageBadge}
                  </span>
                )}
                {imageTitle && (
                  <p style={{ color: aboutImageTitleColor }} className="font-extrabold text-xl pt-1 leading-snug">
                    {imageTitle}
                  </p>
                )}
                {imageSubtitle && (
                  <p style={{ color: aboutImageSubtitleColor }} className="text-sm font-medium leading-relaxed">
                    {imageSubtitle}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* 3 Value Added Points */}
        <div className="pt-8 border-t border-gray-100">
          <div className="text-center mb-10">
            <h3
              style={{ color: aboutValuesTitleColor }}
              className="text-2xl sm:text-3xl font-extrabold"
            >
              {aboutValuesTitle}
            </h3>
            <p style={{ color: aboutValuesSubtitleColor }} className="text-sm mt-1.5">
              {aboutValuesSubtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Welcome Text */}
            <div
              style={{
                backgroundColor: aboutWelcomeCardBgColor,
                borderColor: aboutCardBorderColor
              }}
              className="space-y-4 p-6 rounded-xl border flex flex-col justify-between transition-colors"
            >
              <div>
                <h3 style={{ color: aboutWelcomeTitleColor }} className="text-lg sm:text-xl font-bold mb-2">
                  {welcomeTitle}
                </h3>
                <p style={{ color: aboutWelcomeTextColor }} className="text-sm leading-relaxed font-normal">
                  {welcomeText}
                </p>
              </div>
              <a
                href="#contacto"
                style={{ color: aboutWelcomeLinkColor }}
                className="pt-4 flex items-center gap-2 text-xs font-bold uppercase tracking-wider hover:underline"
              >
                <div style={{ backgroundColor: aboutWelcomeLinkColor }} className="w-6 h-[1px]"></div>
                <span>{aboutWelcomeLinkText}</span>
              </a>
            </div>

            {/* Middle Values List */}
            <div
              style={{
                backgroundColor: aboutPillarsCardBgColor,
                borderColor: aboutCardBorderColor
              }}
              className="space-y-4 p-6 rounded-xl border shadow-2xs transition-colors"
            >
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                {aboutPillarsTitle}
              </h3>
              <ul className="space-y-3.5">
                {values && values.map((val, index) => (
                  <li key={val.id || index} className="flex items-start gap-3">
                    <div
                      style={{
                        backgroundColor: index % 2 === 0 ? 'rgba(15, 59, 104, 0.1)' : 'rgba(217, 119, 6, 0.1)',
                        color: index % 2 === 0 ? aboutIconColor : aboutSubtitleColor
                      }}
                      className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                    >
                      {index + 1}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900">{val.title}</p>
                      <p className="text-xs text-gray-600 leading-relaxed">{val.description}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Right Quick WhatsApp Quote Card */}
            {(quoteBoxTitle || quoteBoxSubtitle || (quoteBoxButtonText && quoteBoxButtonText.trim() !== '')) && (
              <div
                style={{
                  backgroundColor: aboutQuoteBoxBgColor,
                  borderColor: aboutQuoteBoxBorderColor
                }}
                className="rounded-xl p-6 flex flex-col justify-center items-center text-center border shadow-xs transition-colors"
              >
                <div
                  style={{
                    backgroundColor: aboutQuoteBoxIconBgColor,
                    color: aboutQuoteBoxIconColor
                  }}
                  className="w-12 h-12 rounded-full flex items-center justify-center mb-3 shadow-sm transition-colors"
                >
                  <WhatsAppIcon className="w-6 h-6 shrink-0" style={{ color: aboutQuoteBoxIconColor }} />
                </div>
                {quoteBoxTitle && quoteBoxTitle.trim() !== '' && (
                  <h4 style={{ color: aboutQuoteBoxTitleColor }} className="text-base font-bold mb-1">
                    {quoteBoxTitle}
                  </h4>
                )}
                {quoteBoxSubtitle && quoteBoxSubtitle.trim() !== '' && (
                  <p style={{ color: aboutQuoteBoxSubtitleColor }} className="text-xs mb-4 leading-relaxed">
                    {quoteBoxSubtitle}
                  </p>
                )}
                {quoteBoxButtonText && quoteBoxButtonText.trim() !== '' && (
                  <a
                    href={getWaUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      backgroundColor: aboutQuoteBoxButtonBgColor,
                      color: aboutQuoteBoxButtonTextColor
                    }}
                    className="w-full py-3 hover:opacity-90 rounded-xl text-sm font-bold text-center transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <WhatsAppIcon className="w-4 h-4 shrink-0" style={{ color: aboutQuoteBoxButtonTextColor }} />
                    <span>{quoteBoxButtonText}</span>
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

