import React, { useState } from 'react';
import { Lock, User, KeyRound, ShieldCheck, ArrowLeft, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { SiteConfig } from '../types';
import { cleanSupabaseUrl } from '../lib/supabaseClient';
import { createClient } from '@supabase/supabase-js';

interface AdminLoginProps {
  config: SiteConfig;
  onLoginSuccess: () => void;
  onBackToSite: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ config, onLoginSuccess, onBackToSite }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsLoading(true);

    const cleanUser = username.trim();
    const cleanPass = password.trim();

    if (!cleanUser || !cleanPass) {
      setErrorMsg('Por favor ingrese el usuario y la contraseña.');
      setIsLoading(false);
      return;
    }

    try {
      // 1. Direct validation with requested credentials
      let isValid = (cleanUser === 'admin_1' && cleanPass === 'Admin_123');

      // 2. Also check Supabase table 'admin_users' if configured
      const sanitizedUrl = cleanSupabaseUrl(config.supabaseUrl);
      if (!isValid && sanitizedUrl && config.supabaseAnonKey) {
        try {
          const client = createClient(sanitizedUrl, config.supabaseAnonKey);
          const { data, error } = await client
            .from('admin_users')
            .select('id')
            .eq('username', cleanUser)
            .eq('password', cleanPass)
            .maybeSingle();

          if (!error && data) {
            isValid = true;
          }
        } catch (dbErr) {
          console.warn('Error verificando usuario en Supabase:', dbErr);
        }
      }

      if (isValid) {
        sessionStorage.setItem('vazquez_admin_authenticated', 'true');
        onLoginSuccess();
      } else {
        setErrorMsg('Usuario o contraseña incorrectos. Verifique sus credenciales.');
      }
    } catch (err) {
      console.error('Error durante el inicio de sesión:', err);
      setErrorMsg('Ocurrió un error al verificar las credenciales.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Background Decorative Element */}
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-[#0E5197]/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-[#1D7946]/20 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200 relative z-10 animate-fade-in">
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-[#0E5197] to-[#1D7946] p-8 text-white text-center relative">
          <button
            onClick={onBackToSite}
            className="absolute top-4 left-4 inline-flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-white text-xs font-bold px-3 py-1.5 rounded-full transition-colors backdrop-blur-xs cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Volver al sitio</span>
          </button>

          <div className="w-16 h-16 mx-auto bg-white/10 rounded-2xl flex items-center justify-center mb-3 backdrop-blur-md border border-white/20 shadow-inner">
            <Lock className="w-8 h-8 text-white" />
          </div>

          <h2 className="text-2xl font-extrabold tracking-tight">Acceso Administrador</h2>
          <p className="text-xs text-blue-100 mt-1 font-medium">
            Vazquez Multitransport • Control Panel
          </p>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-8 space-y-5">
          {errorMsg && (
            <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold flex items-start gap-2.5 animate-shake">
              <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
              Usuario
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                <User className="w-4 h-4" />
              </div>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Ingresa tu usuario (ej: admin_1)"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#0E5197] focus:border-transparent text-sm font-medium transition-all outline-none"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
              Contraseña
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                <KeyRound className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Ingresa tu contraseña"
                className="w-full pl-10 pr-12 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#0E5197] focus:border-transparent text-sm font-medium transition-all outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 px-4 bg-[#0E5197] hover:bg-blue-900 text-white font-extrabold text-sm rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <ShieldCheck className="w-5 h-5" />
            <span>{isLoading ? 'Verificando...' : 'Iniciar Sesión'}</span>
          </button>

          <div className="pt-2 text-center border-t border-gray-100">
            <p className="text-[11px] text-gray-400 font-medium">
              Credenciales por defecto: <strong className="text-gray-600">admin_1</strong> / <strong className="text-gray-600">Admin_123</strong>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};
