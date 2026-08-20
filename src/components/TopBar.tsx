import React from 'react';
import { Phone, MessageCircle, Clock, MapPin, Database } from 'lucide-react';

interface TopBarProps {
  phones: string[];
  whatsappNumber: string;
}

export const TopBar: React.FC<TopBarProps> = ({ phones, whatsappNumber }) => {
  const cleanPhone = (phone: string) => phone.replace(/\D/g, '');

  return (
    <div className="hidden md:block bg-slate-900 text-white text-xs py-2 px-4 border-b border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-2">
        {/* Left: Schedule & Coverage */}
        <div className="flex items-center gap-4 text-slate-300 text-[11px] sm:text-xs">
          <div className="flex items-center gap-1.5 font-medium tracking-tight">
            <Clock className="w-3.5 h-3.5 text-emerald-400" />
            <span>Servicio Local y Nacional los 365 Días</span>
          </div>
          <div className="hidden lg:flex items-center gap-1.5 font-medium border-l border-slate-700 pl-4">
            <MapPin className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-slate-300">CDMX, Edomex, Toluca, Pachuca, Querétaro y Toda la República</span>
          </div>
        </div>

        {/* Right: Telephones list & WhatsApp */}
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 font-medium text-xs">
          <div className="flex items-center gap-2 text-slate-300">
            <Phone className="w-3.5 h-3.5 text-blue-400" />
            <span className="hidden sm:inline text-slate-400 font-normal">Teléfonos:</span>
            {phones && phones.length > 0 ? (
              phones.map((phone, idx) => (
                <a
                  key={idx}
                  href={`tel:${cleanPhone(phone)}`}
                  className="hover:text-white transition-colors underline-offset-2 hover:underline font-semibold"
                >
                  {phone}
                  {idx < phones.length - 1 ? <span className="ml-2 text-slate-600 font-normal">|</span> : ''}
                </a>
              ))
            ) : (
              <span className="font-semibold">55-6347-7853</span>
            )}
          </div>

          {whatsappNumber && (
            <a
              href={`https://wa.me/${whatsappNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 bg-[#1D7946] hover:bg-emerald-600 text-white font-bold px-3 py-1 rounded-md text-[11px] transition-all shadow-xs hover:shadow-md"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>WhatsApp Directo</span>
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

