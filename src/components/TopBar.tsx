import React from 'react';
import { Phone, MessageCircle, Clock, MapPin, Mail } from 'lucide-react';

interface TopBarProps {
  phones: string[];
  emails?: string[];
  whatsappNumber: string;
  bgColor?: string;
  textColor?: string;
  iconColor?: string;
  noticeText?: string;
  coverageText?: string;
  buttonText?: string;
  buttonBgColor?: string;
  buttonTextColor?: string;
}

export const TopBar: React.FC<TopBarProps> = ({
  phones,
  emails = [],
  whatsappNumber,
  bgColor = '#020617',
  textColor = '#cbd5e1',
  iconColor = '#fbbf24',
  noticeText = 'Atención a Plantas Industriales y Maquinados Urgentes',
  coverageText = 'Zona Metropolitana, CDMX, Edo. Mex, Querétaro y Bajío',
  buttonText = 'Cotizar Maquinado',
  buttonBgColor = '#D97706',
  buttonTextColor = '#ffffff'
}) => {
  const cleanPhone = (phone: string) => phone.replace(/\D/g, '');
  const validPhones = (phones || []).filter((p) => p && p.trim() !== '');
  const validEmails = (emails || []).filter((e) => e && e.trim() !== '');
  const hasNotice = noticeText && noticeText.trim() !== '';
  const hasCoverage = coverageText && coverageText.trim() !== '';
  const hasButton = buttonText && buttonText.trim() !== '' && whatsappNumber && whatsappNumber.trim() !== '';

  return (
    <div
      style={{ backgroundColor: bgColor, color: textColor }}
      className="hidden md:block text-xs py-2 px-4 border-b border-black/10 transition-colors shadow-xs"
    >
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-2">
        {/* Left: Schedule & Coverage */}
        <div className="flex items-center gap-4 text-[11px] sm:text-xs">
          {hasNotice && (
            <div className="flex items-center gap-1.5 font-medium tracking-tight">
              <Clock style={{ color: iconColor }} className="w-3.5 h-3.5 opacity-90" />
              <span>{noticeText}</span>
            </div>
          )}
          {hasCoverage && (
            <div className={`hidden lg:flex items-center gap-1.5 font-medium ${hasNotice ? 'border-l border-white/20 pl-4' : ''}`}>
              <MapPin style={{ color: iconColor }} className="w-3.5 h-3.5 opacity-90" />
              <span className="opacity-90">{coverageText}</span>
            </div>
          )}
        </div>

        {/* Right: Telephones, Emails & WhatsApp */}
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 font-medium text-xs">
          {validEmails.length > 0 && (
            <a
              href={`mailto:${validEmails[0]}`}
              title={`Enviar correo a ${validEmails[0]}`}
              className="hidden lg:flex items-center gap-1.5 hover:opacity-100 transition-opacity font-semibold"
            >
              <Mail style={{ color: iconColor }} className="w-3.5 h-3.5 opacity-90" />
              <span className="truncate max-w-[200px]">{validEmails[0]}</span>
            </a>
          )}

          {validPhones.length > 0 && (
            <div className="flex items-center gap-2">
              <Phone style={{ color: iconColor }} className="w-3.5 h-3.5 opacity-90" />
              <span className="hidden sm:inline opacity-80 font-normal">Teléfonos:</span>
              {validPhones.map((phone, idx) => (
                <a
                  key={idx}
                  href={`tel:${cleanPhone(phone)}`}
                  title={`Llamar al ${phone}`}
                  className="hover:opacity-100 transition-opacity underline-offset-2 hover:underline font-semibold"
                >
                  {phone}
                  {idx < validPhones.length - 1 ? <span className="ml-2 opacity-50 font-normal">|</span> : ''}
                </a>
              ))}
            </div>
          )}

          {hasButton && (
            <a
              href={`https://wa.me/${whatsappNumber.replace(/\D/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{ backgroundColor: buttonBgColor, color: buttonTextColor }}
              className="inline-flex items-center gap-1.5 hover:opacity-90 font-bold px-3 py-1 rounded-md text-[11px] transition-all shadow-xs hover:shadow-md cursor-pointer"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>{buttonText}</span>
            </a>
          )}
        </div>
      </div>
    </div>
  );
};


