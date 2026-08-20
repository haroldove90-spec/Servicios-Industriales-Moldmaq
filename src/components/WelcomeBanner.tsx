import React from 'react';
import { ShieldCheck, Truck, Clock, Sparkles } from 'lucide-react';

interface WelcomeBannerProps {
  title: string;
  subtitle: string;
  body: string;
  coverageAreas: string[];
}

export const WelcomeBanner: React.FC<WelcomeBannerProps> = ({
  title,
  subtitle,
  body,
  coverageAreas,
}) => {
  return (
    <section className="bg-gray-100/70 py-8 sm:py-12 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-[10px] text-gray-400 mb-2 font-mono uppercase tracking-widest">
          Vista Previa de Landing Page
        </div>

        <div className="bg-white shadow-xl sm:shadow-2xl rounded-lg border border-gray-200 overflow-hidden flex flex-col">
          {/* Top Info Header Strip */}
          <div className="h-8 bg-[#0E5197] flex items-center justify-between px-6 text-white text-[10px] sm:text-xs font-medium">
            <span className="flex items-center gap-1.5">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-400"></span>
              📍 Servicio local y nacional
            </span>
            <div className="hidden sm:flex items-center gap-4 text-blue-100">
              <span>📞 Atencion 365 días</span>
              <span>✉️ contacto@vazque.com</span>
            </div>
          </div>

          <div className="p-8 sm:p-12 bg-white relative">
            <div className="relative z-10 max-w-4xl mx-auto text-center space-y-4">
              <div className="inline-flex items-center gap-2 bg-blue-50 text-[#0E5197] text-xs font-bold uppercase tracking-widest px-3.5 py-1 rounded-full border border-blue-100">
                <Sparkles className="w-3.5 h-3.5 text-[#0E5197]" />
                <span>Transportes y Mudanzas Vazquez</span>
              </div>

              <h2 className="text-2xl sm:text-4xl font-bold text-[#0E5197] tracking-tight leading-snug">
                {title}
              </h2>

              <p className="text-base sm:text-lg font-bold text-[#1D7946]">
                {subtitle}
              </p>

              <p className="text-xs sm:text-sm text-gray-500 leading-relaxed font-normal max-w-3xl mx-auto pt-1">
                {body}
              </p>

              {/* Coverage Badges */}
              <div className="pt-6">
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-3">
                  Rutas con Servicio Continuo:
                </p>
                <div className="flex flex-wrap items-center justify-center gap-2">
                  {coverageAreas && coverageAreas.map((area, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1.5 bg-gray-50 text-gray-700 text-xs font-semibold px-3 py-1.5 rounded-md border border-gray-200 shadow-2xs"
                    >
                      <Truck className="w-3.5 h-3.5 text-[#0E5197]" />
                      {area}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

