import React from 'react';
import { Clock, Sparkles, Factory } from 'lucide-react';

interface WelcomeBannerProps {
  title: string;
  subtitle: string;
  body: string;
  coverageAreas: string[];
  welcomeBgColor?: string;
  welcomeCardBgColor?: string;
  welcomeCardBorderColor?: string;
  welcomeTagline?: string;
  welcomeTaglineColor?: string;
  welcomeStripBgColor?: string;
  welcomeStripTextColor?: string;
  welcomeStripNotice?: string;
  welcomeStripUrgent?: string;
  welcomeStripEmail?: string;
  welcomeBadgeText?: string;
  welcomeBadgeBgColor?: string;
  welcomeBadgeTextColor?: string;
  welcomeTitleColor?: string;
  welcomeSubtitleColor?: string;
  welcomeBodyColor?: string;
  welcomeCoverageTitle?: string;
  welcomeAreaBgColor?: string;
  welcomeAreaTextColor?: string;
  welcomeAreaBorderColor?: string;
}

export const WelcomeBanner: React.FC<WelcomeBannerProps> = ({
  title,
  subtitle,
  body,
  coverageAreas,
  welcomeBgColor = "#f1f5f9",
  welcomeCardBgColor = "#ffffff",
  welcomeCardBorderColor = "#e2e8f0",
  welcomeTagline = "SERVICIOS INDUSTRIALES MOLDMAQ S.A. • CAPACIDAD DE MANUFACTURA",
  welcomeTaglineColor = "#64748b",
  welcomeStripBgColor = "#0F3B68",
  welcomeStripTextColor = "#ffffff",
  welcomeStripNotice = "Maquinados CNC, Moldes y Mantenimiento a Nivel Nacional",
  welcomeStripUrgent = "Atención a Urgencias Industriales",
  welcomeStripEmail = "contacto@moldmaq.com",
  welcomeBadgeText = "SERVICIOS INDUSTRIALES MOLDMAQ S.A.",
  welcomeBadgeBgColor = "rgba(15, 59, 104, 0.08)",
  welcomeBadgeTextColor = "#0F3B68",
  welcomeTitleColor = "#0F3B68",
  welcomeSubtitleColor = "#D97706",
  welcomeBodyColor = "#475569",
  welcomeCoverageTitle = "Zonas de Atención Industrial y Cobertura:",
  welcomeAreaBgColor = "#f8fafc",
  welcomeAreaTextColor = "#334155",
  welcomeAreaBorderColor = "#cbd5e1",
}) => {
  return (
    <section style={{ backgroundColor: welcomeBgColor }} className="py-8 sm:py-12 border-b border-gray-200 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {welcomeTagline && welcomeTagline.trim() !== '' && (
          <div
            style={{ color: welcomeTaglineColor }}
            className="text-[10px] mb-2 font-mono uppercase tracking-widest flex items-center gap-1.5"
          >
            <Factory className="w-3.5 h-3.5" />
            <span>{welcomeTagline}</span>
          </div>
        )}

        <div
          style={{
            backgroundColor: welcomeCardBgColor,
            borderColor: welcomeCardBorderColor
          }}
          className="shadow-xl sm:shadow-2xl rounded-2xl border overflow-hidden flex flex-col transition-colors"
        >
          {/* Top Info Header Strip */}
          <div
            style={{
              backgroundColor: welcomeStripBgColor,
              color: welcomeStripTextColor
            }}
            className="h-9 flex items-center justify-between px-6 text-[10px] sm:text-xs font-medium transition-colors"
          >
            <span className="flex items-center gap-1.5">
              <span className="inline-block w-2 h-2 rounded-full bg-amber-400"></span>
              <span>📍 {welcomeStripNotice}</span>
            </span>
            <div className="hidden sm:flex items-center gap-4 opacity-95">
              {welcomeStripUrgent && (
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3 text-amber-400" /> {welcomeStripUrgent}
                </span>
              )}
              {welcomeStripEmail && <span>✉️ {welcomeStripEmail}</span>}
            </div>
          </div>

          <div style={{ backgroundColor: welcomeCardBgColor }} className="p-8 sm:p-12 relative">
            <div className="relative z-10 max-w-4xl mx-auto text-center space-y-4">
              {welcomeBadgeText && welcomeBadgeText.trim() !== '' && (
                <div
                  style={{
                    backgroundColor: welcomeBadgeBgColor,
                    color: welcomeBadgeTextColor,
                    borderColor: `${welcomeBadgeTextColor}30`
                  }}
                  className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-widest px-3.5 py-1 rounded-full border"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{welcomeBadgeText}</span>
                </div>
              )}

              <h2
                style={{ color: welcomeTitleColor }}
                className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight"
              >
                {title}
              </h2>

              <p
                style={{ color: welcomeSubtitleColor }}
                className="text-base sm:text-lg font-semibold"
              >
                {subtitle}
              </p>

              <p
                style={{ color: welcomeBodyColor }}
                className="text-base leading-relaxed font-normal max-w-3xl mx-auto pt-1"
              >
                {body}
              </p>

              {/* Coverage Badges */}
              {coverageAreas && coverageAreas.length > 0 && (
                <div className="pt-6">
                  {welcomeCoverageTitle && (
                    <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">
                      {welcomeCoverageTitle}
                    </p>
                  )}
                  <div className="flex flex-wrap items-center justify-center gap-2">
                    {coverageAreas.map((area, idx) => (
                      <span
                        key={idx}
                        style={{
                          backgroundColor: welcomeAreaBgColor,
                          color: welcomeAreaTextColor,
                          borderColor: welcomeAreaBorderColor
                        }}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border shadow-2xs transition-colors"
                      >
                        <Factory className="w-3.5 h-3.5 opacity-80" />
                        {area}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};


