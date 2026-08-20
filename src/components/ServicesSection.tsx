import React from 'react';
import { ServiceItem } from '../types';
import {
  Home,
  Truck,
  PackageCheck,
  Palette,
  Building2,
  Layers,
  Volume2,
  Container,
  MessageCircle,
  ArrowRight
} from 'lucide-react';

interface ServicesSectionProps {
  title: string;
  subtitle: string;
  services: ServiceItem[];
  whatsappNumber: string;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({
  title,
  subtitle,
  services,
  whatsappNumber,
}) => {
  const renderServiceIcon = (iconName: string) => {
    switch (iconName) {
      case 'Home':
        return <Home className="w-6 h-6 text-[#0E5197]" />;
      case 'Truck':
        return <Truck className="w-6 h-6 text-[#1D7946]" />;
      case 'PackageCheck':
        return <PackageCheck className="w-6 h-6 text-[#0E5197]" />;
      case 'Palette':
        return <Palette className="w-6 h-6 text-[#0E5197]" />;
      case 'Building2':
        return <Building2 className="w-6 h-6 text-[#0E5197]" />;
      case 'Layers':
        return <Layers className="w-6 h-6 text-[#1D7946]" />;
      case 'Volume2':
        return <Volume2 className="w-6 h-6 text-[#0E5197]" />;
      case 'Container':
        return <Container className="w-6 h-6 text-[#0E5197]" />;
      default:
        return <Truck className="w-6 h-6 text-[#0E5197]" />;
    }
  };

  const getServiceWaUrl = (serviceName: string) => {
    const text = `Hola, me interesa solicitar información y cotización del servicio de: ${serviceName} con Vazquez Multitransport.`;
    return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`;
  };

  return (
    <section id="servicios" className="py-20 bg-gray-50/50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-block bg-[#1D7946]/10 text-[#1D7946] font-extrabold text-xs uppercase tracking-widest px-3 py-1 rounded-full">
            Servicios de Mudanza y Transporte
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
            {title}
          </h2>
          <p className="text-lg text-gray-600 font-medium">
            {subtitle}
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services && services.map((service) => (
            <div
              key={service.id}
              className="bg-white rounded-xl p-6 border border-gray-200 shadow-2xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between hover:-translate-y-1 group relative overflow-hidden"
            >
              <div>
                {/* Badge if present */}
                {service.badge && (
                  <span className="inline-block bg-blue-50 text-[#0E5197] text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md mb-4 border border-blue-100">
                    {service.badge}
                  </span>
                )}

                <div className="w-10 h-10 rounded-lg bg-gray-50 group-hover:bg-blue-50/80 flex items-center justify-center mb-4 transition-colors border border-gray-100">
                  {renderServiceIcon(service.iconName)}
                </div>

                <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-[#0E5197] transition-colors leading-snug">
                  {service.title}
                </h3>

                <p className="text-xs text-gray-500 leading-relaxed mb-6 font-normal">
                  {service.description}
                </p>
              </div>

              <div className="pt-3 border-t border-gray-100">
                <a
                  href={getServiceWaUrl(service.title)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-between w-full text-xs font-bold text-[#1D7946] hover:text-emerald-700 group-hover:translate-x-0.5 transition-all py-1 uppercase tracking-tight"
                >
                  <span className="flex items-center gap-1.5">
                    <MessageCircle className="w-3.5 h-3.5" />
                    Cotizar Servicio
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
