import React, { useState } from 'react';
import { 
  AlertTriangle, 
  ShieldAlert, 
  CreditCard, 
  Lock, 
  FileText, 
  Phone, 
  Mail, 
  HelpCircle, 
  CheckCircle2, 
  ArrowRight,
  Eye,
  Settings,
  Clock
} from 'lucide-react';
import { WhatsAppIcon } from './WhatsAppIcon';
import { SiteConfig } from '../types';

interface SuspendedHomeProps {
  config: SiteConfig;
  onOpenAdmin: () => void;
  onPreviewSite: () => void;
}

export const SuspendedHome: React.FC<SuspendedHomeProps> = ({
  config,
  onOpenAdmin,
  onPreviewSite,
}) => {
  const [showSupportModal, setShowSupportModal] = useState(false);
  const currentDomain = typeof window !== 'undefined' ? window.location.hostname || 'vazquezmultitransport.com' : 'vazquezmultitransport.com';
  const currentDate = new Date().toLocaleDateString('es-MX', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-red-950 text-white font-sans flex flex-col justify-between selection:bg-red-600 selection:text-white">
      
      {/* Top Warning Strip */}
      <div className="bg-red-600 text-white text-xs sm:text-sm font-bold py-2.5 px-4 text-center tracking-wide flex items-center justify-center gap-2 shadow-md">
        <AlertTriangle className="w-4 h-4 shrink-0 animate-bounce" />
        <span>AVISO OFICIAL: SERVICIO WEB SUSPENDIDO TEMPORALMENTE</span>
      </div>

      {/* Main Notice Container */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 md:p-10 my-auto">
        <div className="w-full max-w-3xl bg-slate-900/90 backdrop-blur-md border border-red-500/30 rounded-3xl p-6 sm:p-10 shadow-2xl shadow-red-950/50 relative overflow-hidden">
          
          {/* Background Ambient Glow */}
          <div className="absolute -top-24 -right-24 w-72 h-72 bg-red-600/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />

          {/* Header Badge */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-4 mb-8 border-b border-gray-800 pb-6">
            <div className="flex items-center gap-4 text-center sm:text-left">
              <div className="w-16 h-16 rounded-2xl bg-red-500/10 border-2 border-red-500/30 flex items-center justify-center text-red-500 shadow-inner shrink-0">
                <ShieldAlert className="w-9 h-9 animate-pulse" />
              </div>
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-black uppercase tracking-wider bg-red-500/20 text-red-400 border border-red-500/30 mb-1">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                  Estado: Inactivo
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  Página Web Desactivada
                </h1>
              </div>
            </div>

            <div className="text-right sm:block hidden">
              <span className="text-[11px] font-mono text-gray-400 block">CÓDIGO DE ESTADO</span>
              <span className="text-sm font-mono font-bold text-red-400 bg-red-950/60 px-2.5 py-1 rounded border border-red-800/40">
                HTTP 402 - PAYMENT REQUIRED
              </span>
            </div>
          </div>

          {/* Primary Alert Message */}
          <div className="bg-red-950/40 border border-red-500/40 rounded-2xl p-5 sm:p-6 mb-8 text-center sm:text-left">
            <div className="flex items-start gap-3">
              <Lock className="w-6 h-6 text-red-400 shrink-0 mt-0.5 hidden sm:block" />
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-red-200 mb-2">
                  Servicio suspendido por falta de pago
                </h2>
                <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
                  Estimado visitante, el acceso a este sitio web ha sido inhabilitado temporalmente debido a la <strong className="text-white font-semibold">falta de pago y liquidación de los servicios de desarrollo web, mantenimiento o alojamiento (hosting)</strong> correspondientes a este dominio.
                </p>
              </div>
            </div>
          </div>

          {/* Details Table */}
          <div className="bg-slate-800/60 rounded-2xl p-5 border border-gray-700/60 mb-8">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3.5 flex items-center gap-2">
              <FileText className="w-4 h-4 text-gray-400" />
              Detalles del Servicio Afectado
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-sm">
              <div className="bg-slate-900/60 p-3 rounded-xl border border-gray-800">
                <span className="text-xs text-gray-400 block mb-0.5">Dominio Web:</span>
                <span className="font-semibold text-white font-mono">{currentDomain}</span>
              </div>
              <div className="bg-slate-900/60 p-3 rounded-xl border border-gray-800">
                <span className="text-xs text-gray-400 block mb-0.5">Motivo de Suspensión:</span>
                <span className="font-semibold text-red-300">Falta de Pago / Saldo Vencido</span>
              </div>
              <div className="bg-slate-900/60 p-3 rounded-xl border border-gray-800">
                <span className="text-xs text-gray-400 block mb-0.5">Fecha de Notificación:</span>
                <span className="font-semibold text-gray-200">{currentDate}</span>
              </div>
              <div className="bg-slate-900/60 p-3 rounded-xl border border-gray-800">
                <span className="text-xs text-gray-400 block mb-0.5">Acción Requerida:</span>
                <span className="font-semibold text-amber-300">Regularización de Pago</span>
              </div>
            </div>
          </div>

          {/* Instructions for the Owner */}
          <div className="bg-amber-950/20 border border-amber-500/30 rounded-2xl p-5 mb-8">
            <h3 className="text-sm font-bold text-amber-300 mb-2 flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-amber-400" />
              ¿Eres el propietario o titular de este sitio web?
            </h3>
            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed mb-4">
              Para reactivar de forma inmediata el sitio web y reanudar el tráfico comercial, por favor realiza la liquidación del importe pendiente con tu proveedor o desarrollador web.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href={`https://wa.me/${config.whatsappNumber.replace(/\D/g, '') || '525563477853'}?text=${encodeURIComponent(`Hola, me comunico sobre la suspensión por falta de pago del sitio web ${currentDomain}. Deseo solicitar los datos para liquidar el saldo pendiente y reactivar la página.`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 inline-flex items-center justify-center gap-2.5 bg-[#1D7946] hover:bg-emerald-600 text-white font-bold text-sm px-5 py-3.5 rounded-xl transition-all shadow-lg hover:shadow-emerald-950/50"
              >
                <WhatsAppIcon className="w-5 h-5 text-white shrink-0" />
                <span>Contactar para Regularizar Pago</span>
              </a>

              <button
                onClick={() => setShowSupportModal(true)}
                className="inline-flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-gray-200 font-semibold text-sm px-5 py-3.5 rounded-xl border border-gray-700 transition-all"
              >
                <HelpCircle className="w-4 h-4 text-gray-400" />
                <span>Instrucciones de Reactivación</span>
              </button>
            </div>
          </div>

          {/* Bottom Actions & Preview toggle */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-gray-800/80 text-xs text-gray-400">
            <div className="flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-gray-500" />
              <span>Reactivación automática tras confirmación de liquidación.</span>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={onPreviewSite}
                className="hover:text-gray-200 transition-colors inline-flex items-center gap-1.5 underline decoration-gray-600 underline-offset-4"
                title="Ver vista previa de la web"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Ver vista previa del sitio</span>
              </button>

              <span className="text-gray-700">•</span>

              <button
                onClick={onOpenAdmin}
                className="hover:text-blue-400 transition-colors inline-flex items-center gap-1.5"
                title="Acceso al Panel de Control"
              >
                <Settings className="w-3.5 h-3.5" />
                <span>Panel de Control</span>
              </button>
            </div>
          </div>

        </div>
      </main>

      {/* Footer Notice */}
      <footer className="py-4 px-6 text-center text-xs text-gray-400 border-t border-gray-900 bg-black/40">
        <p>© {new Date().getFullYear()} Sistema de Notificaciones de Suspensión de Servidor. Todos los derechos reservados.</p>
      </footer>

      {/* Reactivation Details Modal */}
      {showSupportModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-gray-700 rounded-2xl max-w-md w-full p-6 text-left shadow-2xl relative">
            <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-emerald-400" />
              Proceso de Reactivación
            </h3>
            
            <ol className="space-y-3 text-xs sm:text-sm text-gray-300 mb-6">
              <li className="flex items-start gap-2.5">
                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-red-950 text-red-400 text-xs font-bold shrink-0 mt-0.5 border border-red-800">
                  1
                </span>
                <span>Póngase en contacto con el desarrollador o administrador del servicio web.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-red-950 text-red-400 text-xs font-bold shrink-0 mt-0.5 border border-red-800">
                  2
                </span>
                <span>Solicite el estado de cuenta y los datos bancarios para liquidar el monto pendiente.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-emerald-950 text-emerald-400 text-xs font-bold shrink-0 mt-0.5 border border-emerald-800">
                  3
                </span>
                <span>Una vez validado el comprobante de pago, el sitio será restaurado en su totalidad en un lapso de 15 a 60 minutos.</span>
              </li>
            </ol>

            <div className="flex gap-3">
              <button
                onClick={() => setShowSupportModal(false)}
                className="w-full py-2.5 bg-gray-800 hover:bg-gray-700 text-gray-200 rounded-xl text-xs font-bold transition-all border border-gray-700"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
