import React, { useState } from 'react';

interface LogoProps {
  logoUrl?: string;
  brandName?: string;
  brandSuffix?: string;
  brandSubtitle?: string;
  subtext?: string;
  showLogoText?: boolean;
  isDarkHeader?: boolean;
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({
  logoUrl,
  brandName = "MOLDMAQ",
  brandSuffix = "S.A.",
  brandSubtitle = "Servicios Industriales",
  subtext = "Maquinados CNC • Moldes • Mantenimiento Industrial",
  showLogoText = true,
  isDarkHeader = false,
  className = ""
}) => {
  const [imgError, setImgError] = useState(false);

  const hasAnyText = showLogoText && (
    (brandName && brandName.trim() !== '') ||
    (brandSubtitle && brandSubtitle.trim() !== '') ||
    (subtext && subtext.trim() !== '')
  );

  return (
    <div className={`flex items-center gap-2.5 sm:gap-3.5 group cursor-pointer ${className}`}>
      {logoUrl && !imgError ? (
        <img 
          src={logoUrl} 
          alt={brandName || "Servicios Industriales Moldmaq S.A."} 
          onError={() => setImgError(true)}
          className="h-10 sm:h-12 w-auto max-w-[160px] sm:max-w-[220px] object-contain shrink-0 rounded"
        />
      ) : (
        <div className="relative flex items-center justify-center shrink-0">
          <svg viewBox="0 0 100 100" className="w-10 h-10 sm:w-12 sm:h-12">
            <defs>
              <linearGradient id="moldmaqGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="var(--primary-color, #0F3B68)" />
                <stop offset="100%" stopColor="#1E293B" />
              </linearGradient>
              <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="var(--secondary-color, #D97706)" />
                <stop offset="100%" stopColor="#F59E0B" />
              </linearGradient>
            </defs>

            {/* Industrial Hexagon Housing */}
            <polygon 
              points="50,4 92,26 92,74 50,96 8,74 8,26" 
              fill="url(#moldmaqGrad)" 
              stroke="var(--secondary-color, #D97706)" 
              strokeWidth="3.5" 
              strokeLinejoin="round" 
            />

            {/* Precision Gear / CNC Milling Cutters */}
            <circle cx="50" cy="50" r="28" fill="none" stroke="#FFFFFF" strokeWidth="2.5" strokeDasharray="6 3" />
            
            {/* Central 'M' Monogram */}
            <path 
              d="M 32 68 L 32 34 L 50 52 L 68 34 L 68 68" 
              fill="none" 
              stroke="url(#goldGrad)" 
              strokeWidth="5.5" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
            />

            {/* Precision Crosshair / Target Dots */}
            <circle cx="50" cy="50" r="3" fill="#FFFFFF" />
            <circle cx="50" cy="18" r="2" fill="var(--secondary-color, #D97706)" />
            <circle cx="50" cy="82" r="2" fill="var(--secondary-color, #D97706)" />
          </svg>
        </div>
      )}

      {hasAnyText && (
        <div className="flex flex-col leading-tight min-w-0">
          {brandName && brandName.trim() !== '' && (
            <span 
              style={{ color: isDarkHeader ? '#ffffff' : '#0F3B68' }}
              className="font-black text-base sm:text-xl md:text-2xl tracking-tight leading-none whitespace-nowrap flex items-center gap-1.5"
            >
              {brandName}
              {brandSuffix && brandSuffix.trim() !== '' && (
                <span className="text-[#D97706] font-bold text-xs sm:text-sm px-1.5 py-0.5 rounded bg-amber-500/10 border border-amber-500/30">
                  {brandSuffix}
                </span>
              )}
            </span>
          )}

          {brandSubtitle && brandSubtitle.trim() !== '' && (
            <span 
              style={{ color: isDarkHeader ? '#cbd5e1' : '#475569' }}
              className="text-[9px] sm:text-[11px] font-extrabold uppercase tracking-widest mt-0.5 truncate max-w-[200px] sm:max-w-sm"
            >
              {brandSubtitle}
            </span>
          )}

          {subtext && subtext.trim() !== '' && (
            <span 
              style={{ color: isDarkHeader ? '#94a3b8' : '#94a3b8' }}
              className="text-[8px] sm:text-[9px] font-semibold uppercase tracking-wider truncate max-w-[200px] sm:max-w-xs hidden sm:block mt-0.5"
            >
              {subtext}
            </span>
          )}
        </div>
      )}
    </div>
  );
};



