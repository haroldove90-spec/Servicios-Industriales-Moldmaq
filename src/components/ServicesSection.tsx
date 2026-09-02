import React from 'react';
import { ServiceItem } from '../types';
import {
  Cog,
  Cpu,
  Wrench,
  Layers,
  Settings,
  ShieldCheck,
  Flame,
  Factory,
  Hammer,
  PackageCheck,
  Building2,
  Container,
  MessageCircle,
  ArrowRight
} from 'lucide-react';

interface ServicesSectionProps {
  title: string;
  subtitle: string;
  services: ServiceItem[];
  whatsappNumber: string;
  servicesBgColor?: string;

  // New styling props
  servicesBadgeText?: string;
  servicesBadgeBgColor?: string;
  servicesBadgeTextColor?: string;
  servicesTitleColor?: string;
  servicesSubtitleColor?: string;
  serviceCardBgColor?: string;
  serviceCardBorderColor?: string;
  serviceCardBadgeBgColor?: string;
  serviceCardBadgeTextColor?: string;
  serviceCardIconBgColor?: string;
  serviceCardIconColor?: string;
  serviceCardTitleColor?: string;
  serviceCardDescColor?: string;
  serviceCardCtaText?: string;
  serviceCardCtaColor?: string;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({
  title,
  subtitle,
  services,
  whatsappNumber,
  servicesBgColor = "#f8fafc",

  servicesBadgeText = "Servicios Industriales y Manufactura",
  servicesBadgeBgColor = "rgba(217, 119, 6, 0.1)",
  servicesBadgeTextColor = "#D97706",
  servicesTitleColor = "#111827",
  servicesSubtitleColor = "#D97706",
  serviceCardBgColor = "#ffffff",
  serviceCardBorderColor = "#e2e8f0",
  serviceCardBadgeBgColor = "rgba(217, 119, 6, 0.1)",
  serviceCardBadgeTextColor = "#D97706",
  serviceCardIconBgColor = "#f1f5f9",
  serviceCardIconColor = "#0F3B68",
  serviceCardTitleColor = "#111827",
  serviceCardDescColor = "#4b5563",
  serviceCardCtaText = "Cotizar Solución",
  serviceCardCtaColor = "#D97706",
}) => {
  const renderServiceIcon = (iconName: string) => {
    switch (iconName) {
      case 'Home':
      case 'Cog':
        return <Cog className="w-6 h-6" style={{ color: serviceCardIconColor }} />;
      case 'Truck':
      case 'Cpu':
        return <Cpu className="w-6 h-6" style={{ color: serviceCardIconColor }} />;
      case 'PackageCheck':
      case 'Wrench':
        return <Wrench className="w-6 h-6" style={{ color: serviceCardIconColor }} />;
      case 'Palette':
      case 'Flame':
        return <Flame className="w-6 h-6" style={{ color: serviceCardIconColor }} />;
      case 'Building2':
      case 'Factory':
        return <Factory className="w-6 h-6" style={{ color: serviceCardIconColor }} />;
      case 'Layers':
        return <Layers className="w-6 h-6" style={{ color: serviceCardIconColor }} />;
      case 'Volume2':
      case 'Settings':
        return <Settings className="w-6 h-6" style={{ color: serviceCardIconColor }} />;
      case 'Container':
      case 'Hammer':
        return <Hammer className="w-6 h-6" style={{ color: serviceCardIconColor }} />;
      default:
        return <Wrench className="w-6 h-6" style={{ color: serviceCardIconColor }} />;
    }
  };

  const getServiceWaUrl = (serviceName: string) => {
    const text = `Hola, me interesa solicitar información y cotización del servicio de: ${serviceName} con Servicios Industriales Moldmaq S.A.`;
    return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`;
  };

  return (
    <section id="servicios" style={{ backgroundColor: servicesBgColor }} className="py-20 border-b border-gray-100 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          {servicesBadgeText && servicesBadgeText.trim() !== '' && (
            <div
              style={{
                backgroundColor: servicesBadgeBgColor,
                color: servicesBadgeTextColor,
                borderColor: `${servicesBadgeTextColor}30`
              }}
              className="inline-block font-extrabold text-xs uppercase tracking-widest px-3.5 py-1 rounded-full border"
            >
              {servicesBadgeText}
            </div>
          )}
          <h2
            style={{ color: servicesTitleColor }}
            className="text-3xl sm:text-4xl font-extrabold tracking-tight"
          >
            {title}
          </h2>
          <p
            style={{ color: servicesSubtitleColor }}
            className="text-base sm:text-lg font-semibold"
          >
            {subtitle}
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services && services.map((service, idx) => (
            <div
              key={service.id || idx}
              style={{
                backgroundColor: serviceCardBgColor,
                borderColor: serviceCardBorderColor
              }}
              className="rounded-2xl p-6 border shadow-2xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between hover:-translate-y-1 group relative overflow-hidden"
            >
              <div>
                {/* Badge if present */}
                {service.badge && (
                  <span
                    style={{
                      backgroundColor: serviceCardBadgeBgColor,
                      color: serviceCardBadgeTextColor,
                      borderColor: `${serviceCardBadgeTextColor}30`
                    }}
                    className="inline-block text-xs font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-md mb-4 border"
                  >
                    {service.badge}
                  </span>
                )}

                <div
                  style={{ backgroundColor: serviceCardIconBgColor }}
                  className="w-11 h-11 rounded-xl flex items-center justify-center mb-4 transition-colors border border-black/5"
                >
                  {renderServiceIcon(service.iconName)}
                </div>

                <h3
                  style={{ color: serviceCardTitleColor }}
                  className="text-lg font-extrabold mb-2 transition-colors leading-snug"
                >
                  {service.title}
                </h3>

                <p
                  style={{ color: serviceCardDescColor }}
                  className="text-sm leading-relaxed mb-6 font-normal"
                >
                  {service.description}
                </p>
              </div>

              <div className="pt-3 border-t border-gray-100">
                <a
                  href={getServiceWaUrl(service.title)}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: serviceCardCtaColor }}
                  className="inline-flex items-center justify-between w-full text-xs font-bold hover:opacity-80 group-hover:translate-x-0.5 transition-all py-1 uppercase tracking-tight"
                >
                  <span className="flex items-center gap-1.5">
                    <MessageCircle className="w-3.5 h-3.5" />
                    {serviceCardCtaText}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

