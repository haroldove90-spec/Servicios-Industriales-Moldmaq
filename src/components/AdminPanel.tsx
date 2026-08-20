import React, { useState, useRef } from 'react';
import { SiteConfig, HeroSlide, ValueAddedItem, ServiceItem, GalleryImage } from '../types';
import { uploadImageFile, syncToSupabase, saveSiteConfig } from '../lib/supabaseClient';
import {
  X,
  Upload,
  Save,
  Palette,
  Image as ImageIcon,
  Phone,
  FileText,
  Sliders,
  Database,
  Plus,
  Trash2,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Sparkles,
  Lock,
  Copy
} from 'lucide-react';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onLogout?: () => void;
  config: SiteConfig;
  onUpdateConfig: (newConfig: SiteConfig) => void;
}

export const SUPABASE_SQL_SETUP = `-- 1. Crear tabla para guardar la configuración del sitio
create table if not exists public.site_config (
  id text primary key,
  content jsonb not null,
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- 2. Crear tabla de usuarios administradores
create table if not exists public.admin_users (
  id uuid primary key default gen_random_uuid(),
  username text unique not null,
  password text not null,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Insertar o actualizar credenciales requeridas
insert into public.admin_users (username, password)
values ('admin_1', 'Admin_123')
on conflict (username) do update set password = 'Admin_123';

-- 3. Habilitar permisos RLS
alter table public.site_config enable row level security;
drop policy if exists "Acceso Publico site_config" on public.site_config;
create policy "Acceso Publico site_config" on public.site_config for all using (true) with check (true);

alter table public.admin_users enable row level security;
drop policy if exists "Acceso Lectura admin_users" on public.admin_users;
create policy "Acceso Lectura admin_users" on public.admin_users for select using (true);

-- 4. Crear Bucket 'vazquez-media' para guardar imágenes
insert into storage.buckets (id, name, public) values ('vazquez-media', 'vazquez-media', true) on conflict (id) do update set public = true;

-- 5. Habilitar politicas de acceso publico para el bucket
drop policy if exists "Permitir ver imagenes publicas" on storage.objects;
create policy "Permitir ver imagenes publicas" on storage.objects for select using (bucket_id = 'vazquez-media');

drop policy if exists "Permitir subir imagenes publicas" on storage.objects;
create policy "Permitir subir imagenes publicas" on storage.objects for insert with check (bucket_id = 'vazquez-media');

drop policy if exists "Permitir actualizar imagenes publicas" on storage.objects;
create policy "Permitir actualizar imagenes publicas" on storage.objects for update using (bucket_id = 'vazquez-media');`;

export const AdminPanel: React.FC<AdminPanelProps> = ({
  isOpen,
  onClose,
  onLogout,
  config,
  onUpdateConfig,
}) => {
  const [formData, setFormData] = useState<SiteConfig>(config);
  const [activeTab, setActiveTab] = useState<'general' | 'contacts' | 'slider' | 'content' | 'services' | 'gallery' | 'supabase'>('general');
  const [isUploading, setIsUploading] = useState(false);
  const [saveStatus, setSaveStatus] = useState<{ type: 'success' | 'error' | null; message: string }>({ type: null, message: '' });
  const [copiedSql, setCopiedSql] = useState(false);

  const logoFileInputRef = useRef<HTMLInputElement>(null);
  const faviconFileInputRef = useRef<HTMLInputElement>(null);
  const aboutImageFileInputRef = useRef<HTMLInputElement>(null);
  const sliderFileInputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const galleryFileInputRef = useRef<HTMLInputElement>(null);
  const [uploadProgress, setUploadProgress] = useState<{ current: number; total: number } | null>(null);

  const handleFaviconUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const url = await uploadImageFile(file, formData);
      setFormData(prev => ({ ...prev, faviconUrl: url }));
    } catch (err) {
      console.error('Error subiendo favicon:', err);
    } finally {
      setIsUploading(false);
      if (e.target) e.target.value = '';
    }
  };

  const handleAboutImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const url = await uploadImageFile(file, formData);
      setFormData(prev => ({ ...prev, aboutImageUrl: url }));
    } catch (err) {
      console.error('Error subiendo imagen de Nuestra Empresa:', err);
    } finally {
      setIsUploading(false);
      if (e.target) e.target.value = '';
    }
  };

  if (!isOpen) return null;

  const handleCopySql = () => {
    navigator.clipboard.writeText(SUPABASE_SQL_SETUP);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 3000);
  };

  const handleSave = async () => {
    // Save to LocalStorage and update global state
    saveSiteConfig(formData);
    onUpdateConfig(formData);

    // If Supabase credentials are configured, sync to DB as well
    if (formData.supabaseUrl && formData.supabaseAnonKey) {
      setSaveStatus({ type: null, message: 'Guardando en Supabase...' });
      const res = await syncToSupabase(formData);
      if (res.success) {
        setSaveStatus({ type: 'success', message: '¡Guardado localmente y en Supabase exitosamente!' });
        setTimeout(() => {
          setSaveStatus({ type: null, message: '' });
        }, 4000);
      } else {
        setSaveStatus({ type: 'error', message: res.message });
      }
    } else {
      setSaveStatus({ type: 'success', message: '¡Cambios guardados correctamente en la aplicación!' });
      setTimeout(() => {
        setSaveStatus({ type: null, message: '' });
      }, 4000);
    }
  };

  // Handle Logo File Upload
  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const url = await uploadImageFile(file, formData);
      setFormData(prev => ({ ...prev, logoUrl: url }));
    } catch (err) {
      console.error('Error subiendo logo:', err);
    } finally {
      setIsUploading(false);
      if (e.target) e.target.value = '';
    }
  };

  // Handle Hero Slide Image Upload
  const handleSlideImageUpload = async (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const url = await uploadImageFile(file, formData);
      setFormData(prev => {
        const newSlides = [...prev.heroSlides];
        newSlides[index] = { ...newSlides[index], imageUrl: url };
        return { ...prev, heroSlides: newSlides };
      });
    } catch (err) {
      console.error('Error subiendo imagen de slider:', err);
    } finally {
      setIsUploading(false);
      if (e.target) e.target.value = '';
    }
  };

  // Clear / Remove Slide Image
  const handleClearSlideImage = (index: number) => {
    setFormData(prev => {
      const newSlides = [...prev.heroSlides];
      newSlides[index] = { ...newSlides[index], imageUrl: '' };
      return { ...prev, heroSlides: newSlides };
    });
  };

  // Add new slide
  const handleAddSlide = () => {
    const newSlide = {
      id: `slide-${Date.now()}`,
      imageUrl: '',
      title: 'Nuevo Servicio de Transporte',
      subtitle: 'Descripción personalizada del servicio de logística y fletes.'
    };
    setFormData(prev => ({
      ...prev,
      heroSlides: [...prev.heroSlides, newSlide]
    }));
  };

  // Delete slide
  const handleDeleteSlide = (index: number) => {
    if (formData.heroSlides.length <= 1) return;
    setFormData(prev => ({
      ...prev,
      heroSlides: prev.heroSlides.filter((_, i) => i !== index)
    }));
  };

  // Handle Fleet Gallery Batch Image Upload (Up to 20 photos at once)
  const handleGalleryImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const filesList = e.target.files;
    if (!filesList) return;
    const files: File[] = (Array.from(filesList) as File[]).slice(0, 20);
    if (files.length === 0) return;

    setIsUploading(true);
    setUploadProgress({ current: 0, total: files.length });
    try {
      const newImages: GalleryImage[] = [];
      for (let i = 0; i < files.length; i++) {
        setUploadProgress({ current: i + 1, total: files.length });
        const file = files[i];
        const url = await uploadImageFile(file, formData);
        const fileNameWithoutExt = file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ");
        newImages.push({
          id: `gal-${Date.now()}-${i}-${Math.random().toString(36).substring(2, 6)}`,
          url: url,
          title: fileNameWithoutExt ? fileNameWithoutExt : `Unidad Vazquez ${formData.galleryImages.length + i + 1}`
        });
      }
      setFormData(prev => ({
        ...prev,
        galleryImages: [...prev.galleryImages, ...newImages]
      }));
    } catch (err) {
      console.error('Error en subida masiva a galería:', err);
    } finally {
      setIsUploading(false);
      setUploadProgress(null);
      if (e.target) e.target.value = '';
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col w-full">
      {/* Top Admin Header Bar matching theme screenshot */}
      <div className="bg-slate-900 text-white px-6 py-3.5 flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 shadow-md">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-md bg-blue-600 text-white">
            <Sliders className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider">
                ADMIN MODE: VAZQUE MULTITRANSPORT
              </span>
              <span className="opacity-50 text-xs hidden sm:inline">|</span>
              <span className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                Conectado a Supabase (snjcjrjyoouzhixymbnq)
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Panel Autoadministrable • Hostinger & Supabase Cloud Ready
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleSave}
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2 rounded transition-colors shadow-sm cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Guardar Cambios</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold px-4 py-2 rounded transition-colors border border-white/20 cursor-pointer"
          >
            <span>Ver Sitio en Vivo</span>
          </button>

          {onLogout && (
            <button
              type="button"
              onClick={onLogout}
              className="inline-flex items-center gap-1.5 bg-red-600/80 hover:bg-red-600 text-white text-xs font-semibold px-3 py-2 rounded transition-colors border border-red-500/30 cursor-pointer"
              title="Cerrar Sesión de Administrador"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Cerrar Sesión</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Admin Page Workspace */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 md:p-8 flex flex-col">
        {/* Status Toast Notification */}
        {saveStatus.message && (
          <div className={`mb-5 p-4 sm:p-5 rounded-xl border flex flex-col gap-3 shadow-md ${
            saveStatus.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
              : saveStatus.type === 'error'
              ? 'bg-red-50 text-red-950 border-red-200'
              : 'bg-blue-50 text-blue-800 border-blue-200'
          }`}>
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                {saveStatus.type === 'error' ? (
                  <AlertCircle className="w-5 h-5 shrink-0 text-red-600" />
                ) : !saveStatus.type ? (
                  <RefreshCw className="w-5 h-5 shrink-0 animate-spin text-blue-600" />
                ) : (
                  <CheckCircle className="w-5 h-5 shrink-0 text-emerald-600" />
                )}
                <span className="font-bold text-sm leading-snug">{saveStatus.message}</span>
              </div>
              {saveStatus.type === 'error' && (
                <button
                  type="button"
                  onClick={() => setSaveStatus({ type: null, message: '' })}
                  className="text-xs text-red-700 hover:text-red-900 font-bold underline shrink-0 cursor-pointer"
                >
                  Cerrar
                </button>
              )}
            </div>

            {/* Quick Resolution Box for missing Supabase Table or Storage Bucket */}
            {saveStatus.type === 'error' && (
              <div className="pt-3 border-t border-red-200/80 text-xs text-red-900 space-y-3">
                <p className="font-medium leading-relaxed">
                  ⚠️ <strong>Causa del Error:</strong> Tu proyecto en Supabase (<code>snjcjrjyoouzhixymbnq</code>) está recién creado y aún no tiene la tabla <code>site_config</code> ni el bucket <code>vazquez-media</code>.
                </p>
                <div className="flex flex-wrap items-center gap-2.5 pt-1">
                  <button
                    type="button"
                    onClick={handleCopySql}
                    className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-bold px-4 py-2 rounded-lg text-xs transition-all shadow-xs cursor-pointer"
                  >
                    {copiedSql ? (
                      <>
                        <CheckCircle className="w-4 h-4 text-emerald-400" />
                        <span>¡Código SQL Copiado!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4 text-blue-400" />
                        <span>1. Copiar Script SQL</span>
                      </>
                    )}
                  </button>

                  <a
                    href="https://supabase.com/dashboard/project/snjcjrjyoouzhixymbnq/sql/new"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2 rounded-lg text-xs transition-all shadow-xs"
                  >
                    <span>2. Abrir SQL Editor en Supabase ↗</span>
                  </a>

                  <button
                    type="button"
                    onClick={handleSave}
                    className="inline-flex items-center gap-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-4 py-2 rounded-lg text-xs transition-all shadow-xs cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>3. Volver a Probar Guardar</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        <div className="bg-white rounded-xl shadow-lg border border-gray-200 flex-1 flex flex-col overflow-hidden">
          {/* Tab Navigation with responsive horizontal scrolling */}
          <div className="w-full bg-slate-900 border-b border-slate-800 p-2 overflow-x-auto scrollbar-thin scrollbar-thumb-blue-600">
            <div className="flex items-center min-w-max gap-2 px-1">
              <button
                onClick={() => setActiveTab('general')}
                className={`flex items-center gap-2 px-3.5 py-2.5 rounded-lg font-bold text-xs uppercase tracking-wider whitespace-nowrap shrink-0 transition-all cursor-pointer ${
                  activeTab === 'general'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Palette className="w-4 h-4 shrink-0" />
                <span>Identidad & Colores</span>
              </button>

              <button
                onClick={() => setActiveTab('contacts')}
                className={`flex items-center gap-2 px-3.5 py-2.5 rounded-lg font-bold text-xs uppercase tracking-wider whitespace-nowrap shrink-0 transition-all cursor-pointer ${
                  activeTab === 'contacts'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Phone className="w-4 h-4 shrink-0" />
                <span>Teléfonos & WhatsApp</span>
              </button>

              <button
                onClick={() => setActiveTab('slider')}
                className={`flex items-center gap-2 px-3.5 py-2.5 rounded-lg font-bold text-xs uppercase tracking-wider whitespace-nowrap shrink-0 transition-all cursor-pointer ${
                  activeTab === 'slider'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                <ImageIcon className="w-4 h-4 shrink-0" />
                <span>Slider Principal ({formData.heroSlides.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('content')}
                className={`flex items-center gap-2 px-3.5 py-2.5 rounded-lg font-bold text-xs uppercase tracking-wider whitespace-nowrap shrink-0 transition-all cursor-pointer ${
                  activeTab === 'content'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                <FileText className="w-4 h-4 shrink-0" />
                <span>Bienvenida & Empresa</span>
              </button>

              <button
                onClick={() => setActiveTab('services')}
                className={`flex items-center gap-2 px-3.5 py-2.5 rounded-lg font-bold text-xs uppercase tracking-wider whitespace-nowrap shrink-0 transition-all cursor-pointer ${
                  activeTab === 'services'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Sparkles className="w-4 h-4 shrink-0" />
                <span>Servicios</span>
              </button>

              <button
                onClick={() => setActiveTab('gallery')}
                className={`flex items-center gap-2 px-3.5 py-2.5 rounded-lg font-bold text-xs uppercase tracking-wider whitespace-nowrap shrink-0 transition-all cursor-pointer ${
                  activeTab === 'gallery'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                <ImageIcon className="w-4 h-4 shrink-0" />
                <span>Galería de Flota ({formData.galleryImages.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('supabase')}
                className={`flex items-center gap-2 px-3.5 py-2.5 rounded-lg font-bold text-xs uppercase tracking-wider whitespace-nowrap shrink-0 transition-all cursor-pointer ${
                  activeTab === 'supabase'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-emerald-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Database className="w-4 h-4 shrink-0" />
                <span className="font-extrabold text-white">Base de Datos Supabase</span>
              </button>
            </div>
          </div>

        {/* Tab Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Status Message */}
          {saveStatus.message && (
            <div
              className={`p-4 rounded-xl flex items-center gap-3 text-sm font-bold ${
                saveStatus.type === 'error'
                  ? 'bg-red-50 text-red-800 border border-red-200'
                  : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              }`}
            >
              {saveStatus.type === 'error' ? (
                <AlertCircle className="w-5 h-5 shrink-0" />
              ) : (
                <CheckCircle className="w-5 h-5 shrink-0" />
              )}
              <span>{saveStatus.message}</span>
            </div>
          )}

          {/* TAB 1: IDENTIDAD & COLORES */}
          {activeTab === 'general' && (
            <div className="space-y-6">
              {/* Site Online / Offline Status */}
              <div className="bg-white p-5 rounded-2xl border-2 border-emerald-500/40 shadow-xs space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`inline-block w-3 h-3 rounded-full ${formData.isSuspended ? 'bg-red-500 animate-ping' : 'bg-emerald-500 animate-pulse'}`} />
                      <h3 className="font-extrabold text-base text-gray-900">
                        Estado del Sitio Web: {formData.isSuspended ? (
                          <span className="text-red-600">Página Desactivada (Suspendida)</span>
                        ) : (
                          <span className="text-emerald-600">Activo y Operativo (En Línea)</span>
                        )}
                      </h3>
                    </div>
                    <p className="text-xs text-gray-600 mt-1">
                      {formData.isSuspended 
                        ? 'La página muestra actualmente la pantalla de suspensión de servicio a los visitantes públicos.' 
                        : 'El sitio web oficial completo está 100% activo, visible y recibiendo cotizaciones de clientes.'}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, isSuspended: !formData.isSuspended })}
                    className={`inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer shadow-xs shrink-0 ${
                      formData.isSuspended
                        ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                        : 'bg-red-50 hover:bg-red-100 text-red-700 border border-red-200'
                    }`}
                  >
                    {formData.isSuspended ? (
                      <>
                        <CheckCircle className="w-4 h-4" />
                        <span>Reactivar Sitio Web Oficial</span>
                      </>
                    ) : (
                      <>
                        <AlertCircle className="w-4 h-4" />
                        <span>Desactivar / Suspender Sitio</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              <div className="bg-gray-50 p-5 rounded-2xl border border-gray-200 space-y-4">
                <h3 className="font-extrabold text-base text-gray-900">Configuración General de la Página</h3>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                    Título Principal del Sitio
                  </label>
                  <input
                    type="text"
                    value={formData.pageTitle}
                    onChange={(e) => setFormData({ ...formData, pageTitle: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm font-medium focus:ring-2 focus:ring-[#0E5197]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                    Subtexto / Eslogan del Logo
                  </label>
                  <input
                    type="text"
                    value={formData.logoSubtext}
                    onChange={(e) => setFormData({ ...formData, logoSubtext: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm font-medium focus:ring-2 focus:ring-[#0E5197]"
                  />
                </div>
              </div>

              {/* Logo Upload Section */}
              <div className="bg-gray-50 p-5 rounded-2xl border border-gray-200 space-y-4">
                <h3 className="font-extrabold text-base text-gray-900">Subir Logo Oficial</h3>
                <p className="text-xs text-gray-600">Puede subir una imagen de su logotipo (PNG, JPG, SVG) o utilizar el diseño vectorial predeterminado.</p>

                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <input
                    type="file"
                    ref={logoFileInputRef}
                    onChange={handleLogoUpload}
                    accept="image/*"
                    className="hidden"
                  />

                  <button
                    type="button"
                    onClick={() => logoFileInputRef.current?.click()}
                    disabled={isUploading}
                    className="inline-flex items-center gap-2 bg-[#0E5197] text-white font-bold text-xs px-4 py-2.5 rounded-xl hover:bg-blue-900 transition-colors shadow-xs cursor-pointer disabled:opacity-50"
                  >
                    <Upload className="w-4 h-4" />
                    <span>{isUploading ? 'Subiendo imagen...' : 'Subir Imagen de Logo'}</span>
                  </button>

                  {formData.logoUrl && (
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, logoUrl: '' })}
                      className="text-xs text-red-600 font-bold hover:underline cursor-pointer"
                    >
                      Restablecer Logo Predeterminado
                    </button>
                  )}
                </div>

                {formData.logoUrl && (
                  <div className="p-3 bg-white rounded-xl border border-gray-200 inline-block">
                    <img src={formData.logoUrl} alt="Logo Preview" className="h-16 w-auto object-contain" />
                  </div>
                )}
              </div>

              {/* Favicon Upload Section */}
              <div className="bg-gray-50 p-5 rounded-2xl border border-gray-200 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-extrabold text-base text-gray-900">Favicon del Sitio (Ícono de Pestaña del Navegador)</h3>
                  <span className="text-xs font-semibold bg-emerald-100 text-[#1D7946] px-2.5 py-0.5 rounded-full">Personalizable</span>
                </div>
                <p className="text-xs text-gray-600">
                  Suba la imagen que se mostrará en la pestaña del navegador (recomendado: imagen cuadrada .ico, .png, .svg de 32x32 o 64x64 píxeles).
                </p>

                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <input
                    type="file"
                    ref={faviconFileInputRef}
                    onChange={handleFaviconUpload}
                    accept="image/*,.ico"
                    className="hidden"
                  />

                  <button
                    type="button"
                    onClick={() => faviconFileInputRef.current?.click()}
                    disabled={isUploading}
                    className="inline-flex items-center gap-2 bg-[#1D7946] hover:bg-emerald-800 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-colors shadow-xs cursor-pointer disabled:opacity-50"
                  >
                    <Upload className="w-4 h-4" />
                    <span>{isUploading ? 'Subiendo favicon...' : 'Subir o Reemplazar Favicon'}</span>
                  </button>

                  {formData.faviconUrl && (
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, faviconUrl: '' })}
                      className="text-xs text-red-600 font-bold hover:underline cursor-pointer"
                    >
                      Quitar Favicon
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <div className="w-full">
                    <label className="block text-[10px] font-bold text-gray-600 uppercase mb-1">URL Directa del Favicon</label>
                    <input
                      type="text"
                      placeholder="https://..."
                      value={formData.faviconUrl || ''}
                      onChange={(e) => setFormData({ ...formData, faviconUrl: e.target.value })}
                      className="w-full px-3 py-1.5 rounded-lg border border-gray-300 text-xs font-mono"
                    />
                  </div>

                  {formData.faviconUrl && (
                    <div className="shrink-0 p-2 bg-white rounded-lg border border-gray-200 flex flex-col items-center">
                      <span className="text-[9px] font-bold text-gray-400 mb-1">Vista previa</span>
                      <img src={formData.faviconUrl} alt="Favicon Preview" className="w-8 h-8 object-contain" />
                    </div>
                  )}
                </div>
              </div>

              {/* Dynamic Theme Colors */}
              <div className="bg-gray-50 p-5 rounded-2xl border border-gray-200 space-y-4">
                <h3 className="font-extrabold text-base text-gray-900">Ajuste de Colores de la Marca</h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-2">
                      Color Principal (Header, Títulos, Alas)
                    </label>
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        value={formData.primaryColor || '#0E5197'}
                        onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
                        className="w-12 h-12 rounded-xl cursor-pointer border border-gray-300"
                      />
                      <input
                        type="text"
                        value={formData.primaryColor || '#0E5197'}
                        onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
                        className="w-32 px-3 py-2 rounded-xl border border-gray-300 text-sm font-mono uppercase"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-2">
                      Color Secundario (Botones WhatsApp, Mapa, Acentos)
                    </label>
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        value={formData.secondaryColor || '#1D7946'}
                        onChange={(e) => setFormData({ ...formData, secondaryColor: e.target.value })}
                        className="w-12 h-12 rounded-xl cursor-pointer border border-gray-300"
                      />
                      <input
                        type="text"
                        value={formData.secondaryColor || '#1D7946'}
                        onChange={(e) => setFormData({ ...formData, secondaryColor: e.target.value })}
                        className="w-32 px-3 py-2 rounded-xl border border-gray-300 text-sm font-mono uppercase"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: TELÉFONOS & WHATSAPP */}
          {activeTab === 'contacts' && (
            <div className="space-y-6">
              <div className="bg-gray-50 p-5 rounded-2xl border border-gray-200 space-y-4">
                <h3 className="font-extrabold text-base text-gray-900">Barra Superior de Teléfonos (Top Bar Header)</h3>
                <p className="text-xs text-gray-600">Agregue o modifique los números telefónicos que se muestran en la barra superior del header.</p>

                <div className="space-y-3">
                  {formData.topPhones.map((phone, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={phone}
                        onChange={(e) => {
                          const newPhones = [...formData.topPhones];
                          newPhones[idx] = e.target.value;
                          setFormData({ ...formData, topPhones: newPhones });
                        }}
                        className="flex-1 px-4 py-2 rounded-xl border border-gray-300 text-sm font-bold"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const newPhones = formData.topPhones.filter((_, i) => i !== idx);
                          setFormData({ ...formData, topPhones: newPhones });
                        }}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, topPhones: [...formData.topPhones, '55-0000-0000'] })}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0E5197] hover:underline pt-1"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Agregar otro teléfono</span>
                  </button>
                </div>
              </div>

              <div className="bg-gray-50 p-5 rounded-2xl border border-gray-200 space-y-4">
                <h3 className="font-extrabold text-base text-gray-900">WhatsApp Directo y Redes Sociales</h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                      Número de WhatsApp (con código de país ej. 525563477853)
                    </label>
                    <input
                      type="text"
                      value={formData.whatsappNumber}
                      onChange={(e) => setFormData({ ...formData, whatsappNumber: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                      Página de Facebook
                    </label>
                    <input
                      type="text"
                      value={formData.facebookPage}
                      onChange={(e) => setFormData({ ...formData, facebookPage: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm font-bold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                    Mensaje Inicial Predeterminado de WhatsApp
                  </label>
                  <textarea
                    rows={2}
                    value={formData.whatsappMessage}
                    onChange={(e) => setFormData({ ...formData, whatsappMessage: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm font-medium"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: SLIDER PRINCIPAL */}
          {activeTab === 'slider' && (
            <div className="space-y-6">
              <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-bold text-[#0E5197]">
                    Configure las imágenes y mensajes del slider principal de la página de inicio.
                  </p>
                  <p className="text-[11px] text-gray-600 mt-0.5">
                    Puede cambiar la imagen por una nueva, o presionar "Borrar Imagen" para limpiarla.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleAddSlide}
                  className="inline-flex items-center gap-1.5 bg-[#0E5197] hover:bg-blue-900 text-white font-bold text-xs px-3.5 py-2 rounded-xl transition-colors shrink-0 cursor-pointer shadow-xs"
                >
                  <Plus className="w-4 h-4" />
                  <span>Agregar Nueva Diapositiva</span>
                </button>
              </div>

              {formData.heroSlides.map((slide, idx) => (
                <div key={slide.id || idx} className="bg-gray-50 p-5 rounded-2xl border border-gray-200 space-y-4">
                  <div className="flex items-center justify-between border-b border-gray-200 pb-2">
                    <span className="font-extrabold text-sm text-[#0E5197] uppercase">
                      Diapositiva #{idx + 1}
                    </span>
                    {formData.heroSlides.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleDeleteSlide(idx)}
                        className="inline-flex items-center gap-1 text-xs text-red-600 hover:text-red-800 font-bold hover:underline cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Eliminar Diapositiva</span>
                      </button>
                    )}
                  </div>

                  {/* Slide Image Upload */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-2">
                      Imagen del Slider #{idx + 1}
                    </label>
                    <div className="flex flex-col sm:flex-row items-center gap-4">
                      {slide.imageUrl ? (
                        <div className="relative group shrink-0">
                          <img
                            src={slide.imageUrl}
                            alt={`Slide ${idx + 1}`}
                            className="w-36 h-24 object-cover rounded-xl border border-gray-300 shadow-xs"
                          />
                        </div>
                      ) : (
                        <div className="w-36 h-24 rounded-xl border-2 border-dashed border-gray-300 bg-gray-100 flex flex-col items-center justify-center text-gray-400 shrink-0">
                          <ImageIcon className="w-6 h-6 mb-1" />
                          <span className="text-[10px] font-bold">Sin Imagen</span>
                        </div>
                      )}

                      <div className="space-y-2 flex-1 w-full">
                        <input
                          type="file"
                          ref={(el) => { sliderFileInputRefs.current[idx] = el; }}
                          onChange={(e) => handleSlideImageUpload(idx, e)}
                          accept="image/*"
                          className="hidden"
                        />
                        <div className="flex flex-wrap items-center gap-2">
                          <button
                            type="button"
                            onClick={() => sliderFileInputRefs.current[idx]?.click()}
                            disabled={isUploading}
                            className="inline-flex items-center gap-2 bg-[#0E5197] text-white font-bold text-xs px-3.5 py-2 rounded-xl hover:bg-blue-900 transition-colors cursor-pointer shadow-xs"
                          >
                            <Upload className="w-3.5 h-3.5" />
                            <span>{slide.imageUrl ? 'Reemplazar / Cambiar Imagen' : 'Subir Imagen Directamente'}</span>
                          </button>

                          {slide.imageUrl && (
                            <button
                              type="button"
                              onClick={() => handleClearSlideImage(idx)}
                              className="inline-flex items-center gap-1.5 bg-red-50 hover:bg-red-100 text-red-700 font-bold text-xs px-3 py-2 rounded-xl border border-red-200 transition-colors cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>Borrar Imagen</span>
                            </button>
                          )}
                        </div>

                        <input
                          type="text"
                          placeholder="O ingrese URL de imagen..."
                          value={slide.imageUrl}
                          onChange={(e) => {
                            const newSlides = [...formData.heroSlides];
                            newSlides[idx] = { ...newSlides[idx], imageUrl: e.target.value };
                            setFormData({ ...formData, heroSlides: newSlides });
                          }}
                          className="w-full px-3 py-1.5 rounded-lg border border-gray-300 text-xs font-mono"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                      Título de la Diapositiva
                    </label>
                    <input
                      type="text"
                      value={slide.title}
                      onChange={(e) => {
                        const newSlides = [...formData.heroSlides];
                        newSlides[idx] = { ...newSlides[idx], title: e.target.value };
                        setFormData({ ...formData, heroSlides: newSlides });
                      }}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                      Subtítulo / Descripción
                    </label>
                    <textarea
                      rows={2}
                      value={slide.subtitle}
                      onChange={(e) => {
                        const newSlides = [...formData.heroSlides];
                        newSlides[idx] = { ...newSlides[idx], subtitle: e.target.value };
                        setFormData({ ...formData, heroSlides: newSlides });
                      }}
                      className="w-full px-4 py-2 rounded-xl border border-gray-300 text-sm"
                    />
                  </div>
                </div>
              ))}

              <div className="pt-2 text-center">
                <button
                  type="button"
                  onClick={handleAddSlide}
                  className="inline-flex items-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold text-xs px-5 py-2.5 rounded-xl transition-colors cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Agregar Otra Diapositiva al Slider</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 4: BIENVENIDA & NOSOTROS */}
          {activeTab === 'content' && (
            <div className="space-y-6">
              {/* Welcome Section */}
              <div className="bg-gray-50 p-5 rounded-2xl border border-gray-200 space-y-4">
                <h3 className="font-extrabold text-base text-gray-900">Mensaje de Bienvenida (Abajo del Slider)</h3>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                    Título del Mensaje
                  </label>
                  <input
                    type="text"
                    value={formData.welcomeMessageTitle}
                    onChange={(e) => setFormData({ ...formData, welcomeMessageTitle: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                    Subtítulo
                  </label>
                  <input
                    type="text"
                    value={formData.welcomeMessageSubtitle}
                    onChange={(e) => setFormData({ ...formData, welcomeMessageSubtitle: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm font-bold text-[#1D7946]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                    Cuerpo del Mensaje de Bienvenida
                  </label>
                  <textarea
                    rows={4}
                    value={formData.welcomeMessageBody}
                    onChange={(e) => setFormData({ ...formData, welcomeMessageBody: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm font-normal"
                  />
                </div>
              </div>

              {/* About Section */}
              <div className="bg-gray-50 p-5 rounded-2xl border border-gray-200 space-y-5">
                <h3 className="font-extrabold text-base text-gray-900 flex items-center justify-between">
                  <span>Sección "Nosotros" (Descripción e Imagen de la Empresa)</span>
                  <span className="text-xs font-semibold bg-blue-100 text-[#0E5197] px-2.5 py-0.5 rounded-full">Personalizable 100%</span>
                </h3>

                {/* About Image Upload Box */}
                <div className="p-4 bg-white rounded-xl border border-gray-200 space-y-3">
                  <label className="block text-xs font-bold text-gray-700 uppercase">
                    Imagen Principal de la Sección "Nuestra Empresa"
                  </label>
                  
                  <div className="flex flex-col sm:flex-row items-center gap-4">
                    {formData.aboutImageUrl ? (
                      <img
                        src={formData.aboutImageUrl}
                        alt="Vista Previa Nuestra Empresa"
                        className="w-32 h-24 object-cover rounded-lg border border-gray-200 shadow-2xs shrink-0"
                      />
                    ) : (
                      <div className="w-32 h-24 bg-gray-100 rounded-lg border border-dashed border-gray-300 flex items-center justify-center text-gray-400 shrink-0">
                        <ImageIcon className="w-8 h-8" />
                      </div>
                    )}

                    <div className="space-y-2 w-full">
                      <input
                        type="file"
                        ref={aboutImageFileInputRef}
                        accept="image/*"
                        onChange={handleAboutImageUpload}
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={() => aboutImageFileInputRef.current?.click()}
                        disabled={isUploading}
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#0E5197] hover:bg-blue-800 text-white font-bold text-xs px-4 py-2 rounded-xl transition-all shadow-xs cursor-pointer disabled:opacity-50"
                      >
                        <Upload className="w-4 h-4" />
                        <span>{isUploading ? 'Subiendo Imagen...' : 'Subir o Reemplazar Imagen'}</span>
                      </button>

                      <div className="pt-1">
                        <input
                          type="text"
                          placeholder="O ingrese la URL directa de la imagen..."
                          value={formData.aboutImageUrl || ''}
                          onChange={(e) => setFormData({ ...formData, aboutImageUrl: e.target.value })}
                          className="w-full px-3 py-1.5 rounded-lg border border-gray-300 text-xs font-mono"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-gray-100">
                    <div>
                      <label className="block text-[10px] font-bold text-gray-600 uppercase mb-1">Insignia / Badge de Imagen</label>
                      <input
                        type="text"
                        value={formData.aboutImageBadge || ''}
                        onChange={(e) => setFormData({ ...formData, aboutImageBadge: e.target.value })}
                        placeholder="Ej. Garantía de Satisfacción"
                        className="w-full px-3 py-1.5 rounded-lg border border-gray-300 text-xs font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-600 uppercase mb-1">Título de la Imagen</label>
                      <input
                        type="text"
                        value={formData.aboutImageTitle || ''}
                        onChange={(e) => setFormData({ ...formData, aboutImageTitle: e.target.value })}
                        placeholder="Ej. Personal Altamente Capacitado"
                        className="w-full px-3 py-1.5 rounded-lg border border-gray-300 text-xs font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-600 uppercase mb-1">Subtítulo de la Imagen</label>
                      <input
                        type="text"
                        value={formData.aboutImageSubtitle || ''}
                        onChange={(e) => setFormData({ ...formData, aboutImageSubtitle: e.target.value })}
                        placeholder="Ej. Protección, embalaje..."
                        className="w-full px-3 py-1.5 rounded-lg border border-gray-300 text-xs"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                    Título Principal
                  </label>
                  <input
                    type="text"
                    value={formData.aboutTitle}
                    onChange={(e) => setFormData({ ...formData, aboutTitle: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                    Subtítulo de la Sección
                  </label>
                  <input
                    type="text"
                    value={formData.aboutSubtitle}
                    onChange={(e) => setFormData({ ...formData, aboutSubtitle: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm font-semibold text-[#1D7946]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                    Descripción Completa del Negocio
                  </label>
                  <textarea
                    rows={5}
                    value={formData.aboutDescription}
                    onChange={(e) => setFormData({ ...formData, aboutDescription: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm font-normal"
                  />
                </div>

                {/* Feature 1 & 2 Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="p-3.5 bg-white rounded-xl border border-gray-200 space-y-2">
                    <span className="text-[10px] font-extrabold uppercase text-[#1D7946]">Destacado 1</span>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-600 mb-0.5">Título</label>
                      <input
                        type="text"
                        value={formData.aboutFeature1Title || ''}
                        onChange={(e) => setFormData({ ...formData, aboutFeature1Title: e.target.value })}
                        className="w-full px-3 py-1.5 rounded-lg border border-gray-300 text-xs font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-600 mb-0.5">Descripción</label>
                      <input
                        type="text"
                        value={formData.aboutFeature1Desc || ''}
                        onChange={(e) => setFormData({ ...formData, aboutFeature1Desc: e.target.value })}
                        className="w-full px-3 py-1.5 rounded-lg border border-gray-300 text-xs"
                      />
                    </div>
                  </div>

                  <div className="p-3.5 bg-white rounded-xl border border-gray-200 space-y-2">
                    <span className="text-[10px] font-extrabold uppercase text-[#1D7946]">Destacado 2</span>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-600 mb-0.5">Título</label>
                      <input
                        type="text"
                        value={formData.aboutFeature2Title || ''}
                        onChange={(e) => setFormData({ ...formData, aboutFeature2Title: e.target.value })}
                        className="w-full px-3 py-1.5 rounded-lg border border-gray-300 text-xs font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-600 mb-0.5">Descripción</label>
                      <input
                        type="text"
                        value={formData.aboutFeature2Desc || ''}
                        onChange={(e) => setFormData({ ...formData, aboutFeature2Desc: e.target.value })}
                        className="w-full px-3 py-1.5 rounded-lg border border-gray-300 text-xs"
                      />
                    </div>
                  </div>
                </div>

                {/* Lower Cards: Bienvenidos & Cotiza tu mudanza */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="p-3.5 bg-white rounded-xl border border-gray-200 space-y-2">
                    <span className="text-[10px] font-extrabold uppercase text-[#0E5197]">Caja "Bienvenidos"</span>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-600 mb-0.5">Título de la caja</label>
                      <input
                        type="text"
                        value={formData.aboutWelcomeTitle || ''}
                        onChange={(e) => setFormData({ ...formData, aboutWelcomeTitle: e.target.value })}
                        className="w-full px-3 py-1.5 rounded-lg border border-gray-300 text-xs font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-600 mb-0.5">Texto de bienvenida</label>
                      <textarea
                        rows={2}
                        value={formData.aboutWelcomeText || ''}
                        onChange={(e) => setFormData({ ...formData, aboutWelcomeText: e.target.value })}
                        className="w-full px-3 py-1.5 rounded-lg border border-gray-300 text-xs"
                      />
                    </div>
                  </div>

                  <div className="p-3.5 bg-white rounded-xl border border-gray-200 space-y-2">
                    <span className="text-[10px] font-extrabold uppercase text-[#1D7946]">Tarjeta de Cotización WhatsApp</span>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-600 mb-0.5">Título</label>
                      <input
                        type="text"
                        value={formData.aboutQuoteBoxTitle || ''}
                        onChange={(e) => setFormData({ ...formData, aboutQuoteBoxTitle: e.target.value })}
                        className="w-full px-3 py-1.5 rounded-lg border border-gray-300 text-xs font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-600 mb-0.5">Subtítulo</label>
                      <input
                        type="text"
                        value={formData.aboutQuoteBoxSubtitle || ''}
                        onChange={(e) => setFormData({ ...formData, aboutQuoteBoxSubtitle: e.target.value })}
                        className="w-full px-3 py-1.5 rounded-lg border border-gray-300 text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-600 mb-0.5">Texto del Botón</label>
                      <input
                        type="text"
                        value={formData.aboutQuoteBoxButtonText || ''}
                        onChange={(e) => setFormData({ ...formData, aboutQuoteBoxButtonText: e.target.value })}
                        className="w-full px-3 py-1.5 rounded-lg border border-gray-300 text-xs font-bold text-[#1D7946]"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* 3 Value Added Points */}
              <div className="bg-gray-50 p-5 rounded-2xl border border-gray-200 space-y-4">
                <h3 className="font-extrabold text-base text-gray-900">3 Valores Agregados de la Empresa</h3>

                {formData.aboutValues.map((val, idx) => (
                  <div key={val.id || idx} className="p-4 bg-white rounded-xl border border-gray-200 space-y-3">
                    <span className="font-extrabold text-xs text-[#0E5197] uppercase">Valor #{idx + 1}</span>
                    <input
                      type="text"
                      value={val.title}
                      onChange={(e) => {
                        const newVals = [...formData.aboutValues];
                        newVals[idx] = { ...newVals[idx], title: e.target.value };
                        setFormData({ ...formData, aboutValues: newVals });
                      }}
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm font-bold"
                    />
                    <textarea
                      rows={2}
                      value={val.description}
                      onChange={(e) => {
                        const newVals = [...formData.aboutValues];
                        newVals[idx] = { ...newVals[idx], description: e.target.value };
                        setFormData({ ...formData, aboutValues: newVals });
                      }}
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 text-xs"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: SERVICIOS */}
          {activeTab === 'services' && (
            <div className="space-y-6">
              <div className="bg-gray-50 p-5 rounded-2xl border border-gray-200 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-extrabold text-base text-gray-900">Catálogo de Servicios</h3>
                  <button
                    type="button"
                    onClick={() => {
                      const newServ: ServiceItem = {
                        id: `serv-${Date.now()}`,
                        iconName: 'Truck',
                        title: 'Nuevo Servicio',
                        description: 'Descripción del nuevo servicio ofrecido por Vazquez Multitransport.',
                        badge: 'Disponible'
                      };
                      setFormData({ ...formData, servicesList: [...formData.servicesList, newServ] });
                    }}
                    className="inline-flex items-center gap-1.5 bg-[#0E5197] text-white text-xs font-bold px-3 py-2 rounded-xl"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Agregar Servicio</span>
                  </button>
                </div>

                <div className="space-y-4">
                  {formData.servicesList.map((serv, idx) => (
                    <div key={serv.id || idx} className="p-4 bg-white rounded-xl border border-gray-200 space-y-3">
                      <div className="flex items-center justify-between">
                        <input
                          type="text"
                          value={serv.title}
                          onChange={(e) => {
                            const newServs = [...formData.servicesList];
                            newServs[idx] = { ...newServs[idx], title: e.target.value };
                            setFormData({ ...formData, servicesList: newServs });
                          }}
                          className="font-bold text-sm px-3 py-1.5 rounded-lg border border-gray-300 w-2/3"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const newServs = formData.servicesList.filter((_, i) => i !== idx);
                            setFormData({ ...formData, servicesList: newServs });
                          }}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <input
                          type="text"
                          placeholder="Etiqueta / Badge (ej. Especializado)"
                          value={serv.badge || ''}
                          onChange={(e) => {
                            const newServs = [...formData.servicesList];
                            newServs[idx] = { ...newServs[idx], badge: e.target.value };
                            setFormData({ ...formData, servicesList: newServs });
                          }}
                          className="text-xs px-3 py-1.5 rounded-lg border border-gray-300"
                        />
                      </div>

                      <textarea
                        rows={2}
                        value={serv.description}
                        onChange={(e) => {
                          const newServs = [...formData.servicesList];
                          newServs[idx] = { ...newServs[idx], description: e.target.value };
                          setFormData({ ...formData, servicesList: newServs });
                        }}
                        className="w-full text-xs p-2.5 rounded-lg border border-gray-300"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: GALERÍA DE FLOTA */}
          {activeTab === 'gallery' && (
            <div className="space-y-6">
              <div className="bg-gray-50 p-5 rounded-2xl border border-gray-200 space-y-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="font-extrabold text-base text-gray-900 flex items-center gap-2">
                      <span>Imágenes del Negocio y Flota</span>
                      <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2.5 py-0.5 rounded-full">
                        {formData.galleryImages.length} fotos
                      </span>
                    </h3>
                    <p className="text-xs text-gray-600 mt-0.5">
                      Sube fotos de tus camiones, plataformas y equipo. Se muestran en el carrusel continuo.
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <input
                      type="file"
                      ref={galleryFileInputRef}
                      onChange={handleGalleryImageUpload}
                      accept="image/*"
                      multiple
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => galleryFileInputRef.current?.click()}
                      disabled={isUploading}
                      className="inline-flex items-center gap-2 bg-[#1D7946] text-white text-xs font-bold px-4 py-2.5 rounded-xl hover:bg-emerald-700 transition-colors shadow-xs cursor-pointer"
                    >
                      <Upload className="w-4 h-4" />
                      <span>Subir Fotos (Masivo max 20)</span>
                    </button>

                    {formData.galleryImages.length > 0 && (
                      <button
                        type="button"
                        onClick={() => {
                          if (window.confirm('¿Está seguro de vaciar toda la galería de fotos?')) {
                            setFormData({ ...formData, galleryImages: [] });
                          }
                        }}
                        className="inline-flex items-center gap-1.5 text-xs text-red-600 hover:text-red-800 hover:bg-red-50 font-bold px-3 py-2.5 rounded-xl border border-red-200 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Vaciar Toda la Galería</span>
                      </button>
                    )}
                  </div>
                </div>

                {uploadProgress && (
                  <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-xl flex items-center gap-3 animate-pulse">
                    <div className="w-4 h-4 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-xs font-bold text-emerald-800">
                      Subiendo foto {uploadProgress.current} de {uploadProgress.total} a la galería...
                    </span>
                  </div>
                )}

                {formData.galleryImages.length === 0 ? (
                  <div className="text-center py-12 bg-white rounded-xl border-2 border-dashed border-gray-200 text-gray-500 space-y-2">
                    <ImageIcon className="w-10 h-10 mx-auto text-gray-300" />
                    <p className="text-xs font-bold">No hay fotos en la galería de la flota.</p>
                    <p className="text-[11px] text-gray-400">Haz clic en "Subir Fotos (Masivo max 20)" para añadir imágenes.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {formData.galleryImages.map((img, idx) => (
                      <div key={img.id || idx} className="p-3 bg-white rounded-xl border border-gray-200 flex flex-col gap-2 shadow-2xs group hover:border-emerald-300 transition-colors">
                        <div className="relative overflow-hidden rounded-lg bg-gray-100 aspect-4/3">
                          <img src={img.url} alt={img.title} className="w-full h-full object-cover" />
                        </div>
                        <div className="space-y-1.5">
                          <input
                            type="text"
                            value={img.title}
                            onChange={(e) => {
                              const newImgs = [...formData.galleryImages];
                              newImgs[idx] = { ...newImgs[idx], title: e.target.value };
                              setFormData({ ...formData, galleryImages: newImgs });
                            }}
                            placeholder="Título de la imagen..."
                            className="w-full text-xs font-bold px-2 py-1 border border-gray-200 rounded-md focus:border-emerald-500 focus:outline-hidden"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const newImgs = formData.galleryImages.filter((_, i) => i !== idx);
                              setFormData({ ...formData, galleryImages: newImgs });
                            }}
                            className="text-[11px] text-red-600 hover:text-red-800 hover:underline flex items-center gap-1 font-semibold cursor-pointer"
                          >
                            <Trash2 className="w-3 h-3" />
                            <span>Eliminar Foto</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 7: SUPABASE DATABASE */}
          {activeTab === 'supabase' && (
            <div className="space-y-6">
              <div className="bg-emerald-50/80 p-5 rounded-2xl border border-emerald-200 space-y-3">
                <div className="flex items-center gap-2 text-emerald-900 font-extrabold text-base">
                  <Database className="w-5 h-5 text-[#1D7946]" />
                  <span>Configuración del Proyecto Supabase (vazquezadmin)</span>
                </div>
                <p className="text-xs text-emerald-800 leading-relaxed font-medium">
                  Su proyecto de Supabase está preconfigurado para sincronización en la nube en tiempo real. Cuando realice cambios desde este panel autoadministrable, se actualizarán en Supabase y se cargarán automáticamente en su página web alojada en Hostinger.
                </p>
              </div>

              <div className="bg-gray-50 p-5 rounded-2xl border border-gray-200 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                      ID del Proyecto (Project ID)
                    </label>
                    <input
                      type="text"
                      readOnly
                      value="snjcjrjyoouzhixymbnq"
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 text-xs font-mono bg-gray-100 text-gray-700"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                      Bucket de Storage (Imágenes)
                    </label>
                    <input
                      type="text"
                      placeholder="vazquez-media"
                      value={formData.supabaseBucketName}
                      onChange={(e) => setFormData({ ...formData, supabaseBucketName: e.target.value })}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 text-xs font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                    Supabase Project URL
                  </label>
                  <input
                    type="text"
                    placeholder="https://snjcjrjyoouzhixymbnq.supabase.co"
                    value={formData.supabaseUrl}
                    onChange={(e) => setFormData({ ...formData, supabaseUrl: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                    Supabase Anon Key (API Key)
                  </label>
                  <input
                    type="text"
                    placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                    value={formData.supabaseAnonKey}
                    onChange={(e) => setFormData({ ...formData, supabaseAnonKey: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-xs font-mono"
                  />
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <input
                    type="checkbox"
                    id="useSupabaseStorage"
                    checked={formData.useSupabaseStorage}
                    onChange={(e) => setFormData({ ...formData, useSupabaseStorage: e.target.checked })}
                    className="w-4 h-4 text-[#0E5197] rounded cursor-pointer"
                  />
                  <label htmlFor="useSupabaseStorage" className="text-xs font-bold text-gray-800 cursor-pointer">
                    Activar subida directa de imágenes y logos a Supabase Storage
                  </label>
                </div>
              </div>

              {/* Guía para Hostinger y Código SQL de Inicialización */}
              <div className="bg-blue-50/70 p-5 rounded-2xl border border-blue-200 space-y-4">
                <div className="flex items-center gap-2 text-[#0E5197] font-extrabold text-sm uppercase tracking-wide">
                  <Sparkles className="w-4 h-4 text-[#0E5197]" />
                  <span>Script SQL de Inicialización en Supabase (Copiar en SQL Editor)</span>
                </div>
                <p className="text-xs text-blue-900 leading-relaxed font-normal">
                  Si aún no ha creado la tabla de configuración en su panel de Supabase, vaya al <strong>SQL Editor</strong> de su proyecto en Supabase (ID: <code>snjcjrjyoouzhixymbnq</code>) y ejecute este comando:
                </p>
                <div className="relative">
                  <pre className="bg-slate-900 text-emerald-300 p-4 rounded-xl text-[11px] font-mono overflow-x-auto leading-relaxed">
{`-- 1. Crear tabla para guardar la configuración completa del sitio
create table if not exists public.site_config (
  id text primary key,
  content jsonb not null,
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- 2. Habilitar permisos de lectura y actualización pública
alter table public.site_config enable row level security;
create policy "Acceso Publico site_config" on public.site_config for all using (true) with check (true);

-- 3. Crear Bucket 'vazquez-media' en Supabase Storage
insert into storage.buckets (id, name, public) values ('vazquez-media', 'vazquez-media', true) on conflict do nothing;
create policy "Acceso Publico Storage Media" on storage.objects for all using (bucket_id = 'vazquez-media') with check (bucket_id = 'vazquez-media');`}
                  </pre>
                </div>

                <div className="pt-2 border-t border-blue-200/80">
                  <h4 className="text-xs font-bold text-[#0E5197] uppercase mb-1">
                    🚀 Pasos para publicar su sitio web en Hostinger:
                  </h4>
                  <ol className="list-decimal list-inside text-xs text-gray-700 space-y-1 pl-1">
                    <li>Generar la compilación ejecutando el comando de exportación o build de la aplicación.</li>
                    <li>Subir el contenido generado en la carpeta <code>dist/</code> al directorio <code>public_html</code> del File Manager en Hostinger.</li>
                    <li>¡Listo! El sitio cargará los datos guardados en Supabase automáticamente. Para editar el contenido en Hostinger, puede ingresar agregando <code>/#admin</code> a su dominio.</li>
                  </ol>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Panel Footer Action */}
        <div className="p-6 bg-gray-50 border-t border-gray-200 flex items-center justify-between gap-4 rounded-b-xl">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-lg border border-gray-300 text-gray-700 font-bold text-xs hover:bg-gray-200 transition-colors cursor-pointer"
          >
            Volver a la Página Principal
          </button>

          <button
            type="button"
            onClick={handleSave}
            className="inline-flex items-center gap-2 bg-[#1D7946] hover:bg-emerald-700 text-white font-bold text-xs px-6 py-2.5 rounded-lg transition-all shadow-md transform hover:-translate-y-0.5 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Guardar Todos los Cambios</span>
          </button>
        </div>
      </div>
    </div>
  </div>
  );
};
