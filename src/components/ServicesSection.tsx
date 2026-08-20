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
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({
  title,
  subtitle,
  services,
  whatsappNumber,
  servicesBgColor = "#f8fafc"
}) => {
  const renderServiceIcon = (iconName: string, index: number) => {
    const isAmber = index % 2 === 1;
    const colorClass = isAmber ? "text-[#D97706]" : "text-[#0F3B68]";

    switch (iconName) {
      case 'Home':
      case 'Cog':
        return <Cog className={`w-6 h-6 ${colorClass}`} />;
      case 'Truck':
      case 'Cpu':
        return <Cpu className={`w-6 h-6 ${colorClass}`} />;
      case 'PackageCheck':
      case 'Wrench':
        return <Wrench className={`w-6 h-6 ${colorClass}`} />;
      case 'Palette':
      case 'Flame':
        return <Flame className={`w-6 h-6 ${colorClass}`} />;
      case 'Building2':
      case 'Factory':
        return <Factory className={`w-6 h-6 ${colorClass}`} />;
      case 'Layers':
        return <Layers className={`w-6 h-6 ${colorClass}`} />;
      case 'Volume2':
      case 'Settings':
        return <Settings className={`w-6 h-6 ${colorClass}`} />;
      case 'Container':
      case 'Hammer':
        return <Hammer className={`w-6 h-6 ${colorClass}`} />;
      default:
        return <Wrench className={`w-6 h-6 ${colorClass}`} />;
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
          <div className="inline-block bg-[#D97706]/10 text-[#D97706] font-extrabold text-xs uppercase tracking-widest px-3.5 py-1 rounded-full">
            Servicios Industriales y Manufactura
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
          {services && services.map((service, idx) => (
            <div
              key={service.id || idx}
              className="bg-white rounded-2xl p-6 border border-gray-200 shadow-2xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between hover:-translate-y-1 group relative overflow-hidden"
            >
              <div>
                {/* Badge if present */}
                {service.badge && (
                  <span className="inline-block bg-amber-50 text-[#D97706] text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-md mb-4 border border-amber-200">
                    {service.badge}
                  </span>
                )}

                <div className="w-11 h-11 rounded-xl bg-slate-50 group-hover:bg-blue-50/80 flex items-center justify-center mb-4 transition-colors border border-slate-100">
                  {renderServiceIcon(service.iconName, idx)}
                </div>

                <h3 className="text-lg font-extrabold text-gray-900 mb-2 group-hover:text-[#0F3B68] transition-colors leading-snug">
                  {service.title}
                </h3>

                <p className="text-xs text-gray-600 leading-relaxed mb-6 font-normal">
                  {service.description}
                </p>
              </div>

              <div className="pt-3 border-t border-gray-100">
                <a
                  href={getServiceWaUrl(service.title)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-between w-full text-xs font-bold text-[#D97706] hover:text-amber-700 group-hover:translate-x-0.5 transition-all py-1 uppercase tracking-tight"
                >
                  <span className="flex items-center gap-1.5">
                    <MessageCircle className="w-3.5 h-3.5" />
                    Cotizar Solución
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

