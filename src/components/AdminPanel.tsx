import React, { useState, useRef } from 'react';
import { SiteConfig, HeroSlide, ValueAddedItem, ServiceItem, GalleryImage, CoverageLocationItem } from '../types';
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
  Copy,
  MapPin,
  Navigation,
  ExternalLink
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

-- 4. Crear Bucket 'moldmaq-media' para guardar imágenes
insert into storage.buckets (id, name, public) values ('moldmaq-media', 'moldmaq-media', true) on conflict (id) do update set public = true;

-- 5. Habilitar politicas de acceso publico para el bucket
drop policy if exists "Permitir ver imagenes publicas" on storage.objects;
create policy "Permitir ver imagenes publicas" on storage.objects for select using (bucket_id = 'moldmaq-media');

drop policy if exists "Permitir subir imagenes publicas" on storage.objects;
create policy "Permitir subir imagenes publicas" on storage.objects for insert with check (bucket_id = 'moldmaq-media');

drop policy if exists "Permitir actualizar imagenes publicas" on storage.objects;
create policy "Permitir actualizar imagenes publicas" on storage.objects for update using (bucket_id = 'moldmaq-media');`;

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

  // Sync formData whenever config is reloaded or modal is opened
  React.useEffect(() => {
    if (isOpen) {
      setFormData(config);
    }
  }, [config, isOpen]);

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
          {/* Quick Jump Shortcuts */}
          <div className="bg-slate-900 px-3.5 py-2 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-slate-400 font-bold uppercase tracking-wider text-[11px]">Accesos Rápidos:</span>
              <button
                type="button"
                onClick={() => setActiveTab('contacts')}
                className="inline-flex items-center gap-1 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 px-2.5 py-1 rounded-md font-bold text-[11px] border border-amber-500/40 transition-colors cursor-pointer"
              >
                <MapPin className="w-3 h-3 text-amber-400" />
                <span>📍 Ir a Contacto, Mapa Google & Teléfonos</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('content')}
                className="inline-flex items-center gap-1 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 px-2.5 py-1 rounded-md font-bold text-[11px] border border-blue-500/40 transition-colors cursor-pointer"
              >
                <Sparkles className="w-3 h-3 text-blue-400" />
                <span>⭐ Ir a Editar Título "Líderes en Maquinados..."</span>
              </button>
            </div>
            <span className="text-[11px] text-slate-400 font-medium hidden sm:inline">Haga clic en cualquier pestaña para editar</span>
          </div>

          {/* Tab Navigation with fully responsive wrapping - NO HIDDEN TABS */}
          <div className="w-full bg-slate-950 border-b border-slate-800 p-2.5">
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
              <button
                type="button"
                onClick={() => setActiveTab('general')}
                className={`flex items-center gap-1.5 sm:gap-2 px-3 py-2 sm:px-3.5 sm:py-2.5 rounded-lg font-bold text-xs uppercase tracking-wider transition-all cursor-pointer ${
                  activeTab === 'general'
                    ? 'bg-blue-600 text-white shadow-md ring-2 ring-blue-400'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800 bg-slate-900 border border-slate-800'
                }`}
              >
                <Palette className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 text-blue-400" />
                <span>1. Identidad & Colores</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('contacts')}
                className={`flex items-center gap-1.5 sm:gap-2 px-3 py-2 sm:px-3.5 sm:py-2.5 rounded-lg font-bold text-xs uppercase tracking-wider transition-all cursor-pointer ${
                  activeTab === 'contacts'
                    ? 'bg-amber-600 text-white shadow-md ring-2 ring-amber-400'
                    : 'text-amber-300 hover:text-white hover:bg-amber-950/60 bg-slate-900 border border-amber-500/40'
                }`}
              >
                <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 text-amber-400" />
                <span className="font-extrabold">2. 📍 Contacto, Mapa Google & Teléfonos</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('slider')}
                className={`flex items-center gap-1.5 sm:gap-2 px-3 py-2 sm:px-3.5 sm:py-2.5 rounded-lg font-bold text-xs uppercase tracking-wider transition-all cursor-pointer ${
                  activeTab === 'slider'
                    ? 'bg-blue-600 text-white shadow-md ring-2 ring-blue-400'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800 bg-slate-900 border border-slate-800'
                }`}
              >
                <ImageIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 text-blue-400" />
                <span>3. Slider Principal ({formData.heroSlides.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('content')}
                className={`flex items-center gap-1.5 sm:gap-2 px-3 py-2 sm:px-3.5 sm:py-2.5 rounded-lg font-bold text-xs uppercase tracking-wider transition-all cursor-pointer ${
                  activeTab === 'content'
                    ? 'bg-blue-600 text-white shadow-md ring-2 ring-blue-400'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800 bg-slate-900 border border-slate-800'
                }`}
              >
                <FileText className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 text-blue-400" />
                <span className="font-extrabold">4. ⭐ Bienvenida & Nosotros ("Líderes...")</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('services')}
                className={`flex items-center gap-1.5 sm:gap-2 px-3 py-2 sm:px-3.5 sm:py-2.5 rounded-lg font-bold text-xs uppercase tracking-wider transition-all cursor-pointer ${
                  activeTab === 'services'
                    ? 'bg-blue-600 text-white shadow-md ring-2 ring-blue-400'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800 bg-slate-900 border border-slate-800'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 text-blue-400" />
                <span>5. Servicios</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('gallery')}
                className={`flex items-center gap-1.5 sm:gap-2 px-3 py-2 sm:px-3.5 sm:py-2.5 rounded-lg font-bold text-xs uppercase tracking-wider transition-all cursor-pointer ${
                  activeTab === 'gallery'
                    ? 'bg-blue-600 text-white shadow-md ring-2 ring-blue-400'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800 bg-slate-900 border border-slate-800'
                }`}
              >
                <ImageIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 text-blue-400" />
                <span>6. Galería ({formData.galleryImages.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('supabase')}
                className={`flex items-center gap-1.5 sm:gap-2 px-3 py-2 sm:px-3.5 sm:py-2.5 rounded-lg font-bold text-xs uppercase tracking-wider transition-all cursor-pointer ${
                  activeTab === 'supabase'
                    ? 'bg-emerald-600 text-white shadow-md ring-2 ring-emerald-400'
                    : 'text-emerald-400 hover:text-white hover:bg-slate-800 bg-slate-900 border border-emerald-600/40'
                }`}
              >
                <Database className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
                <span className="font-extrabold text-white">7. Supabase DB</span>
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

          {/* TAB 1: IDENTIDAD, BARRA SUPERIOR, HEADER & COLORES */}
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

              {/* General Page & Brand Identity Information */}
              <div className="bg-gray-50 p-5 rounded-2xl border border-gray-200 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-extrabold text-base text-gray-900">1. Identidad de Marca, Textos del Logo & Títulos</h3>
                  <span className="text-xs font-semibold bg-blue-100 text-[#0F3B68] px-2.5 py-0.5 rounded-full">Textos & Colores del Logo</span>
                </div>
                <p className="text-xs text-gray-600">
                  Modifique el nombre comercial, subtítulos, eslogan, título de pestaña del navegador y personalice los <b>colores de cada texto</b> individualmente.
                </p>

                <div className="space-y-5">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                      Título de la Página Web (Pestaña del Navegador y SEO)
                    </label>
                    <input
                      type="text"
                      value={formData.pageTitle || ''}
                      onChange={(e) => setFormData({ ...formData, pageTitle: e.target.value })}
                      placeholder="Servicios Industriales Moldmaq S.A. | Maquinados CNC, Moldes..."
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm font-medium focus:ring-2 focus:ring-[#0F3B68]"
                    />
                  </div>

                  {/* Line 1: Brand Name & Suffix with Colors */}
                  <div className="p-4 bg-white rounded-xl border border-gray-200 space-y-3">
                    <span className="text-xs font-bold text-gray-800 uppercase tracking-wide">
                      Línea 1: Nombre de la Empresa y Distintivo
                    </span>

                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
                      {/* Brand Name */}
                      <div className="sm:col-span-7 space-y-2">
                        <label className="block text-[11px] font-bold text-gray-600 uppercase">
                          Texto del Nombre (Ej: MOLDMAQ)
                        </label>
                        <input
                          type="text"
                          value={formData.brandName ?? 'MOLDMAQ'}
                          onChange={(e) => setFormData({ ...formData, brandName: e.target.value })}
                          placeholder="MOLDMAQ"
                          className="w-full px-3 py-2 rounded-xl border border-gray-300 text-sm font-bold text-[#0F3B68] focus:ring-2 focus:ring-[#0F3B68]"
                        />
                        <div className="flex items-center gap-2">
                          <label className="text-[10px] font-bold text-gray-500 uppercase">Color Texto:</label>
                          <input
                            type="color"
                            value={formData.brandNameColor || '#0F3B68'}
                            onChange={(e) => setFormData({ ...formData, brandNameColor: e.target.value })}
                            className="w-7 h-7 rounded-lg cursor-pointer border border-gray-300"
                          />
                          <input
                            type="text"
                            value={formData.brandNameColor || '#0F3B68'}
                            onChange={(e) => setFormData({ ...formData, brandNameColor: e.target.value })}
                            className="w-24 px-2 py-0.5 text-xs border border-gray-300 rounded font-mono uppercase"
                          />
                        </div>
                      </div>

                      {/* Brand Suffix */}
                      <div className="sm:col-span-5 space-y-2">
                        <label className="block text-[11px] font-bold text-gray-600 uppercase">
                          Sufijo (Ej: S.A.)
                        </label>
                        <input
                          type="text"
                          value={formData.brandSuffix ?? 'S.A.'}
                          onChange={(e) => setFormData({ ...formData, brandSuffix: e.target.value })}
                          placeholder="S.A."
                          className="w-full px-3 py-2 rounded-xl border border-gray-300 text-sm font-bold text-[#D97706] focus:ring-2 focus:ring-[#0F3B68]"
                        />
                        <div className="flex items-center gap-2">
                          <label className="text-[10px] font-bold text-gray-500 uppercase">Color Letra:</label>
                          <input
                            type="color"
                            value={formData.brandSuffixColor || '#D97706'}
                            onChange={(e) => setFormData({ ...formData, brandSuffixColor: e.target.value })}
                            className="w-7 h-7 rounded-lg cursor-pointer border border-gray-300"
                          />
                          <input
                            type="text"
                            value={formData.brandSuffixColor || '#D97706'}
                            onChange={(e) => setFormData({ ...formData, brandSuffixColor: e.target.value })}
                            className="w-24 px-2 py-0.5 text-xs border border-gray-300 rounded font-mono uppercase"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Line 2: Brand Subtitle & Line 3: Eslogan */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Subtitle */}
                    <div className="p-4 bg-white rounded-xl border border-gray-200 space-y-2">
                      <label className="block text-xs font-bold text-gray-700 uppercase">
                        Subtítulo del Logo (Línea 2)
                      </label>
                      <input
                        type="text"
                        value={formData.brandSubtitle ?? 'Servicios Industriales'}
                        onChange={(e) => setFormData({ ...formData, brandSubtitle: e.target.value })}
                        placeholder="SERVICIOS INDUSTRIALES (dejar vacío para ocultar)"
                        className="w-full px-3 py-2 rounded-xl border border-gray-300 text-sm font-medium focus:ring-2 focus:ring-[#0F3B68]"
                      />
                      <div className="flex items-center gap-2 pt-1">
                        <label className="text-[10px] font-bold text-gray-500 uppercase">Color:</label>
                        <input
                          type="color"
                          value={formData.brandSubtitleColor || '#475569'}
                          onChange={(e) => setFormData({ ...formData, brandSubtitleColor: e.target.value })}
                          className="w-7 h-7 rounded-lg cursor-pointer border border-gray-300"
                        />
                        <input
                          type="text"
                          value={formData.brandSubtitleColor || '#475569'}
                          onChange={(e) => setFormData({ ...formData, brandSubtitleColor: e.target.value })}
                          className="w-24 px-2 py-0.5 text-xs border border-gray-300 rounded font-mono uppercase"
                        />
                      </div>
                    </div>

                    {/* Eslogan / Line 3 */}
                    <div className="p-4 bg-white rounded-xl border border-gray-200 space-y-2">
                      <label className="block text-xs font-bold text-gray-700 uppercase">
                        Eslogan / Línea 3 (Detalle)
                      </label>
                      <input
                        type="text"
                        value={formData.logoSubtext ?? 'Maquinados CNC • Moldes • Mantenimiento Industrial'}
                        onChange={(e) => setFormData({ ...formData, logoSubtext: e.target.value })}
                        placeholder="MAQUINADOS CNC • MOLDES • MANTENIMIENTO INDUSTRIAL"
                        className="w-full px-3 py-2 rounded-xl border border-gray-300 text-sm font-medium focus:ring-2 focus:ring-[#0F3B68]"
                      />
                      <div className="flex items-center gap-2 pt-1">
                        <label className="text-[10px] font-bold text-gray-500 uppercase">Color:</label>
                        <input
                          type="color"
                          value={formData.logoSubtextColor || '#94a3b8'}
                          onChange={(e) => setFormData({ ...formData, logoSubtextColor: e.target.value })}
                          className="w-7 h-7 rounded-lg cursor-pointer border border-gray-300"
                        />
                        <input
                          type="text"
                          value={formData.logoSubtextColor || '#94a3b8'}
                          onChange={(e) => setFormData({ ...formData, logoSubtextColor: e.target.value })}
                          className="w-24 px-2 py-0.5 text-xs border border-gray-300 rounded font-mono uppercase"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Toggle show logo text */}
                  <div className="pt-1">
                    <label className="flex items-center gap-3 p-3 bg-white rounded-xl border border-gray-200 cursor-pointer hover:bg-slate-50 transition-colors">
                      <input
                        type="checkbox"
                        checked={formData.showLogoText !== false}
                        onChange={(e) => setFormData({ ...formData, showLogoText: e.target.checked })}
                        className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 cursor-pointer"
                      />
                      <span className="text-xs font-bold text-gray-800">
                        Mostrar textos al lado del logotipo (Desmarque si su imagen de logo ya incluye el texto integrado)
                      </span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Top Bar Customization */}
              <div className="bg-gray-50 p-5 rounded-2xl border border-gray-200 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <h3 className="font-extrabold text-base text-gray-900">2. Barra Superior (Top Bar)</h3>
                    <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                      formData.showTopBar !== false ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                    }`}>
                      {formData.showTopBar !== false ? '● Visible en Sitio' : '○ Desactivada'}
                    </span>
                  </div>
                  <span className="text-xs font-semibold bg-blue-100 text-[#0F3B68] px-2.5 py-0.5 rounded-full">Colores & Textos</span>
                </div>
                <p className="text-xs text-gray-600">
                  Active o desactive la barra superior que aparece encima del menú de navegación, y configure sus colores y textos.
                </p>

                {/* Master Toggle for Top Bar */}
                <div className="p-4 bg-white rounded-xl border border-gray-200 shadow-xs flex items-center justify-between gap-4">
                  <div>
                    <span className="text-sm font-bold text-gray-900 block">
                      Mostrar Barra Superior en el Sitio Web
                    </span>
                    <span className="text-xs text-gray-500 block mt-0.5">
                      Si se desactiva, la barra con teléfonos, horario y botón superior quedará completamente oculta.
                    </span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer shrink-0">
                    <input
                      type="checkbox"
                      checked={formData.showTopBar !== false}
                      onChange={(e) => setFormData({ ...formData, showTopBar: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-12 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                  </label>
                </div>

                {formData.showTopBar !== false && (
                  <div className="space-y-4 pt-2 animate-fadeIn">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Top Bar Background Color */}
                      <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase mb-2">
                          Color de Fondo Barra Superior
                        </label>
                        <div className="flex items-center gap-3">
                          <input
                            type="color"
                            value={formData.topBarBgColor || '#020617'}
                            onChange={(e) => setFormData({ ...formData, topBarBgColor: e.target.value })}
                            className="w-11 h-11 rounded-xl cursor-pointer border border-gray-300"
                          />
                          <input
                            type="text"
                            value={formData.topBarBgColor || '#020617'}
                            onChange={(e) => setFormData({ ...formData, topBarBgColor: e.target.value })}
                            className="w-32 px-3 py-2 rounded-xl border border-gray-300 text-sm font-mono uppercase"
                          />
                        </div>
                      </div>

                      {/* Top Bar Text Color */}
                      <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase mb-2">
                          Color de Texto Barra Superior
                        </label>
                        <div className="flex items-center gap-3">
                          <input
                            type="color"
                            value={formData.topBarTextColor || '#cbd5e1'}
                            onChange={(e) => setFormData({ ...formData, topBarTextColor: e.target.value })}
                            className="w-11 h-11 rounded-xl cursor-pointer border border-gray-300"
                          />
                          <input
                            type="text"
                            value={formData.topBarTextColor || '#cbd5e1'}
                            onChange={(e) => setFormData({ ...formData, topBarTextColor: e.target.value })}
                            className="w-32 px-3 py-2 rounded-xl border border-gray-300 text-sm font-mono uppercase"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3 pt-2">
                      <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                          Texto de Atención / Horario (Izquierda)
                        </label>
                        <input
                          type="text"
                          value={formData.topBarNoticeText ?? 'Atención a Plantas Industriales y Maquinados Urgentes'}
                          onChange={(e) => setFormData({ ...formData, topBarNoticeText: e.target.value })}
                          placeholder="Atención a Plantas Industriales y Maquinados Urgentes"
                          className="w-full px-4 py-2 rounded-xl border border-gray-300 text-sm font-medium"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                          Texto de Cobertura Geográfica (Centro)
                        </label>
                        <input
                          type="text"
                          value={formData.topBarCoverageText ?? 'Zona Metropolitana, CDMX, Edo. Mex, Querétaro y Bajío'}
                          onChange={(e) => setFormData({ ...formData, topBarCoverageText: e.target.value })}
                          placeholder="Zona Metropolitana, CDMX, Edo. Mex, Querétaro y Bajío"
                          className="w-full px-4 py-2 rounded-xl border border-gray-300 text-sm font-medium"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                        <div>
                          <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                            Texto del Botón en Barra Superior <span className="text-[10px] text-gray-500 font-normal lowercase">(dejar vacío para ocultar)</span>
                          </label>
                          <input
                            type="text"
                            value={formData.topBarButtonText ?? ''}
                            onChange={(e) => setFormData({ ...formData, topBarButtonText: e.target.value })}
                            placeholder="Ej: Cotizar Maquinado (o dejar en blanco para ocultar)"
                            className="w-full px-4 py-2 rounded-xl border border-gray-300 text-sm font-medium"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                            Color del Botón Barra Superior
                          </label>
                          <div className="flex items-center gap-3">
                            <input
                              type="color"
                              value={formData.topBarButtonBgColor || '#D97706'}
                              onChange={(e) => setFormData({ ...formData, topBarButtonBgColor: e.target.value })}
                              className="w-11 h-11 rounded-xl cursor-pointer border border-gray-300"
                            />
                            <input
                              type="text"
                              value={formData.topBarButtonBgColor || '#D97706'}
                              onChange={(e) => setFormData({ ...formData, topBarButtonBgColor: e.target.value })}
                              className="w-32 px-3 py-2 rounded-xl border border-gray-300 text-sm font-mono uppercase"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Header Navigation Customization */}
              <div className="bg-gray-50 p-5 rounded-2xl border border-gray-200 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-extrabold text-base text-gray-900">3. Cabecera Principal (Header & Navegación)</h3>
                  <span className="text-xs font-semibold bg-blue-100 text-[#0F3B68] px-2.5 py-0.5 rounded-full">Colores & CTA</span>
                </div>
                <p className="text-xs text-gray-600">Configure el fondo de la barra de navegación, el color del texto y el botón de llamada a la acción.</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Header Background Color */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-2">
                      Color de Fondo del Header
                    </label>
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        value={formData.headerBgColor || '#ffffff'}
                        onChange={(e) => setFormData({ ...formData, headerBgColor: e.target.value })}
                        className="w-11 h-11 rounded-xl cursor-pointer border border-gray-300"
                      />
                      <input
                        type="text"
                        value={formData.headerBgColor || '#ffffff'}
                        onChange={(e) => setFormData({ ...formData, headerBgColor: e.target.value })}
                        className="w-32 px-3 py-2 rounded-xl border border-gray-300 text-sm font-mono uppercase"
                      />
                    </div>
                    <div className="flex gap-1.5 mt-2">
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, headerBgColor: '#ffffff', headerTextColor: '#1e293b' })}
                        className="text-[10px] bg-white border border-gray-300 px-2 py-0.5 rounded font-semibold text-gray-800 hover:bg-gray-100"
                      >
                        Blanco
                      </button>
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, headerBgColor: '#0F3B68', headerTextColor: '#ffffff' })}
                        className="text-[10px] bg-[#0F3B68] text-white px-2 py-0.5 rounded font-semibold hover:opacity-90"
                      >
                        Azul Moldmaq
                      </button>
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, headerBgColor: '#0f172a', headerTextColor: '#f8fafc' })}
                        className="text-[10px] bg-[#0f172a] text-white px-2 py-0.5 rounded font-semibold hover:opacity-90"
                      >
                        Slate Oscuro
                      </button>
                    </div>
                  </div>

                  {/* Header Nav Links Text Color */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-2">
                      Color de Texto de los Enlaces (Menú)
                    </label>
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        value={formData.headerTextColor || '#1e293b'}
                        onChange={(e) => setFormData({ ...formData, headerTextColor: e.target.value })}
                        className="w-11 h-11 rounded-xl cursor-pointer border border-gray-300"
                      />
                      <input
                        type="text"
                        value={formData.headerTextColor || '#1e293b'}
                        onChange={(e) => setFormData({ ...formData, headerTextColor: e.target.value })}
                        className="w-32 px-3 py-2 rounded-xl border border-gray-300 text-sm font-mono uppercase"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                      Texto del Botón Principal (CTA Header) <span className="text-[10px] text-gray-500 font-normal lowercase">(dejar vacío para ocultar)</span>
                    </label>
                    <input
                      type="text"
                      value={formData.headerCtaText ?? ''}
                      onChange={(e) => setFormData({ ...formData, headerCtaText: e.target.value })}
                      placeholder="Ej: Cotizar Proyecto (o dejar en blanco para ocultar)"
                      className="w-full px-4 py-2 rounded-xl border border-gray-300 text-sm font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                      Color del Botón Principal (CTA Header)
                    </label>
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        value={formData.headerCtaBgColor || '#D97706'}
                        onChange={(e) => setFormData({ ...formData, headerCtaBgColor: e.target.value })}
                        className="w-10 h-10 rounded-xl cursor-pointer border border-gray-300"
                      />
                      <input
                        type="text"
                        value={formData.headerCtaBgColor || '#D97706'}
                        onChange={(e) => setFormData({ ...formData, headerCtaBgColor: e.target.value })}
                        className="w-32 px-3 py-1.5 rounded-xl border border-gray-300 text-sm font-mono uppercase"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Mobile Menu Customization Section */}
              <div className="bg-gray-50 p-5 rounded-2xl border border-gray-200 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-extrabold text-base text-gray-900">4. Menú de Navegación Móvil (Celulares y Tablets)</h3>
                  <span className="text-xs font-semibold bg-indigo-100 text-indigo-800 px-2.5 py-0.5 rounded-full">Menú Móvil</span>
                </div>
                <p className="text-xs text-gray-600">
                  Personalice el aspecto completo del desplegable que ven los usuarios al abrir el menú en dispositivos móviles.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {/* Mobile Menu Background */}
                  <div className="p-3 bg-white rounded-xl border border-gray-200 space-y-2">
                    <label className="block text-xs font-bold text-gray-700 uppercase">
                      Color de Fondo del Menú Móvil
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={formData.mobileMenuBgColor || '#0f172a'}
                        onChange={(e) => setFormData({ ...formData, mobileMenuBgColor: e.target.value })}
                        className="w-9 h-9 rounded-lg cursor-pointer border border-gray-300"
                      />
                      <input
                        type="text"
                        value={formData.mobileMenuBgColor || '#0f172a'}
                        onChange={(e) => setFormData({ ...formData, mobileMenuBgColor: e.target.value })}
                        className="w-24 px-2 py-1 text-xs border border-gray-300 rounded font-mono uppercase"
                      />
                    </div>
                  </div>

                  {/* Mobile Menu Text Color (Normal) */}
                  <div className="p-3 bg-white rounded-xl border border-gray-200 space-y-2">
                    <label className="block text-xs font-bold text-gray-700 uppercase">
                      Color de Texto (Enlaces)
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={formData.mobileMenuTextColor || '#cbd5e1'}
                        onChange={(e) => setFormData({ ...formData, mobileMenuTextColor: e.target.value })}
                        className="w-9 h-9 rounded-lg cursor-pointer border border-gray-300"
                      />
                      <input
                        type="text"
                        value={formData.mobileMenuTextColor || '#cbd5e1'}
                        onChange={(e) => setFormData({ ...formData, mobileMenuTextColor: e.target.value })}
                        className="w-24 px-2 py-1 text-xs border border-gray-300 rounded font-mono uppercase"
                      />
                    </div>
                  </div>

                  {/* Mobile Menu Active / Hover Background */}
                  <div className="p-3 bg-white rounded-xl border border-gray-200 space-y-2">
                    <label className="block text-xs font-bold text-gray-700 uppercase">
                      Fondo al Pasar Mouse / Activo
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={formData.mobileMenuActiveBgColor || '#D97706'}
                        onChange={(e) => setFormData({ ...formData, mobileMenuActiveBgColor: e.target.value })}
                        className="w-9 h-9 rounded-lg cursor-pointer border border-gray-300"
                      />
                      <input
                        type="text"
                        value={formData.mobileMenuActiveBgColor || '#D97706'}
                        onChange={(e) => setFormData({ ...formData, mobileMenuActiveBgColor: e.target.value })}
                        className="w-24 px-2 py-1 text-xs border border-gray-300 rounded font-mono uppercase"
                      />
                    </div>
                  </div>

                  {/* Mobile Menu Active / Hover Text Color */}
                  <div className="p-3 bg-white rounded-xl border border-gray-200 space-y-2">
                    <label className="block text-xs font-bold text-gray-700 uppercase">
                      Texto al Pasar Mouse / Activo
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={formData.mobileMenuActiveTextColor || '#ffffff'}
                        onChange={(e) => setFormData({ ...formData, mobileMenuActiveTextColor: e.target.value })}
                        className="w-9 h-9 rounded-lg cursor-pointer border border-gray-300"
                      />
                      <input
                        type="text"
                        value={formData.mobileMenuActiveTextColor || '#ffffff'}
                        onChange={(e) => setFormData({ ...formData, mobileMenuActiveTextColor: e.target.value })}
                        className="w-24 px-2 py-1 text-xs border border-gray-300 rounded font-mono uppercase"
                      />
                    </div>
                  </div>

                  {/* Mobile Menu Border / Divider Color */}
                  <div className="p-3 bg-white rounded-xl border border-gray-200 space-y-2">
                    <label className="block text-xs font-bold text-gray-700 uppercase">
                      Borde Inferior del Menú
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={formData.mobileMenuBorderColor || '#1e293b'}
                        onChange={(e) => setFormData({ ...formData, mobileMenuBorderColor: e.target.value })}
                        className="w-9 h-9 rounded-lg cursor-pointer border border-gray-300"
                      />
                      <input
                        type="text"
                        value={formData.mobileMenuBorderColor || '#1e293b'}
                        onChange={(e) => setFormData({ ...formData, mobileMenuBorderColor: e.target.value })}
                        className="w-24 px-2 py-1 text-xs border border-gray-300 rounded font-mono uppercase"
                      />
                    </div>
                  </div>
                </div>

                {/* Live Preview Box of Mobile Menu Item */}
                <div className="p-4 rounded-xl border border-gray-300 space-y-2" style={{ backgroundColor: formData.mobileMenuBgColor || '#0f172a' }}>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                    Vista previa de elementos en Menú Móvil:
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <div 
                      className="px-4 py-2.5 rounded-xl font-bold text-sm"
                      style={{ 
                        backgroundColor: formData.mobileMenuActiveBgColor || '#D97706',
                        color: formData.mobileMenuActiveTextColor || '#ffffff'
                      }}
                    >
                      ✓ Enlace Activo / Con Mouse Encima (Ej: Inicio)
                    </div>
                    <div 
                      className="px-4 py-2.5 rounded-xl font-bold text-sm"
                      style={{ 
                        color: formData.mobileMenuTextColor || '#cbd5e1'
                      }}
                    >
                      Enlace Normal (Ej: Nosotros)
                    </div>
                  </div>
                </div>
              </div>

              {/* Logo Upload Section */}
              <div className="bg-gray-50 p-5 rounded-2xl border border-gray-200 space-y-4">
                <h3 className="font-extrabold text-base text-gray-900">5. Subir o Reemplazar Logo Oficial</h3>
                <p className="text-xs text-gray-600">Puede subir una imagen de su logotipo (PNG, JPG, SVG) o ingresar la URL directa.</p>

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
                    className="inline-flex items-center gap-2 bg-[#0F3B68] text-white font-bold text-xs px-4 py-2.5 rounded-xl hover:bg-slate-900 transition-colors shadow-xs cursor-pointer disabled:opacity-50"
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

                <div className="w-full">
                  <label className="block text-[10px] font-bold text-gray-600 uppercase mb-1">URL Directa del Logo</label>
                  <input
                    type="text"
                    placeholder="https://..."
                    value={formData.logoUrl || ''}
                    onChange={(e) => setFormData({ ...formData, logoUrl: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-lg border border-gray-300 text-xs font-mono"
                  />
                </div>

                {formData.logoUrl && (
                  <div className="p-3 bg-white rounded-xl border border-gray-200 inline-block shadow-xs">
                    <img src={formData.logoUrl} alt="Logo Preview" className="h-14 w-auto object-contain" />
                  </div>
                )}
              </div>

              {/* Favicon Upload Section */}
              <div className="bg-gray-50 p-5 rounded-2xl border border-gray-200 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-extrabold text-base text-gray-900">6. Favicon del Sitio (Ícono de Pestaña)</h3>
                  <span className="text-xs font-semibold bg-amber-100 text-amber-800 px-2.5 py-0.5 rounded-full">Icono Pestaña</span>
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
                    className="inline-flex items-center gap-2 bg-[#D97706] hover:bg-amber-600 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-colors shadow-xs cursor-pointer disabled:opacity-50"
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

              {/* Dynamic Theme Colors & Section Backgrounds */}
              <div className="bg-gray-50 p-5 rounded-2xl border border-gray-200 space-y-4">
                <h3 className="font-extrabold text-base text-gray-900">7. Colores Institucionales de la Marca</h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-2">
                      Color Primario (Títulos, Secciones y Destacados)
                    </label>
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        value={formData.primaryColor || '#0F3B68'}
                        onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
                        className="w-12 h-12 rounded-xl cursor-pointer border border-gray-300"
                      />
                      <input
                        type="text"
                        value={formData.primaryColor || '#0F3B68'}
                        onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
                        className="w-32 px-3 py-2 rounded-xl border border-gray-300 text-sm font-mono uppercase"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-2">
                      Color Secundario (Botones WhatsApp, Acentos Industriales)
                    </label>
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        value={formData.secondaryColor || '#D97706'}
                        onChange={(e) => setFormData({ ...formData, secondaryColor: e.target.value })}
                        className="w-12 h-12 rounded-xl cursor-pointer border border-gray-300"
                      />
                      <input
                        type="text"
                        value={formData.secondaryColor || '#D97706'}
                        onChange={(e) => setFormData({ ...formData, secondaryColor: e.target.value })}
                        className="w-32 px-3 py-2 rounded-xl border border-gray-300 text-sm font-mono uppercase"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Section Background Colors Customization */}
              <div className="bg-gray-50 p-5 rounded-2xl border border-gray-200 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-extrabold text-base text-gray-900">8. Colores de Fondo de Cada Sección</h3>
                  <span className="text-xs font-semibold bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full">Fondos de Secciones</span>
                </div>
                <p className="text-xs text-gray-600">Personalice el color de fondo para cada bloque del sitio web.</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {/* About Section Bg */}
                  <div className="p-3 bg-white rounded-xl border border-gray-200 space-y-2">
                    <label className="block text-xs font-bold text-gray-700 uppercase">Fondo Sección "Nosotros"</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={formData.aboutBgColor || '#ffffff'}
                        onChange={(e) => setFormData({ ...formData, aboutBgColor: e.target.value })}
                        className="w-9 h-9 rounded-lg cursor-pointer border border-gray-300"
                      />
                      <input
                        type="text"
                        value={formData.aboutBgColor || '#ffffff'}
                        onChange={(e) => setFormData({ ...formData, aboutBgColor: e.target.value })}
                        className="w-24 px-2 py-1 text-xs border border-gray-300 rounded font-mono uppercase"
                      />
                    </div>
                  </div>

                  {/* Services Section Bg */}
                  <div className="p-3 bg-white rounded-xl border border-gray-200 space-y-2">
                    <label className="block text-xs font-bold text-gray-700 uppercase">Fondo Sección "Servicios"</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={formData.servicesBgColor || '#f8fafc'}
                        onChange={(e) => setFormData({ ...formData, servicesBgColor: e.target.value })}
                        className="w-9 h-9 rounded-lg cursor-pointer border border-gray-300"
                      />
                      <input
                        type="text"
                        value={formData.servicesBgColor || '#f8fafc'}
                        onChange={(e) => setFormData({ ...formData, servicesBgColor: e.target.value })}
                        className="w-24 px-2 py-1 text-xs border border-gray-300 rounded font-mono uppercase"
                      />
                    </div>
                  </div>

                  {/* Gallery Section Bg */}
                  <div className="p-3 bg-white rounded-xl border border-gray-200 space-y-2">
                    <label className="block text-xs font-bold text-gray-700 uppercase">Fondo Sección "Galería"</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={formData.galleryBgColor || '#ffffff'}
                        onChange={(e) => setFormData({ ...formData, galleryBgColor: e.target.value })}
                        className="w-9 h-9 rounded-lg cursor-pointer border border-gray-300"
                      />
                      <input
                        type="text"
                        value={formData.galleryBgColor || '#ffffff'}
                        onChange={(e) => setFormData({ ...formData, galleryBgColor: e.target.value })}
                        className="w-24 px-2 py-1 text-xs border border-gray-300 rounded font-mono uppercase"
                      />
                    </div>
                  </div>

                  {/* Contact Section Bg */}
                  <div className="p-3 bg-white rounded-xl border border-gray-200 space-y-2">
                    <label className="block text-xs font-bold text-gray-700 uppercase">Fondo Sección "Contacto"</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={formData.contactBgColor || '#ffffff'}
                        onChange={(e) => setFormData({ ...formData, contactBgColor: e.target.value })}
                        className="w-9 h-9 rounded-lg cursor-pointer border border-gray-300"
                      />
                      <input
                        type="text"
                        value={formData.contactBgColor || '#ffffff'}
                        onChange={(e) => setFormData({ ...formData, contactBgColor: e.target.value })}
                        className="w-24 px-2 py-1 text-xs border border-gray-300 rounded font-mono uppercase"
                      />
                    </div>
                  </div>

                  {/* Footer Bg */}
                  <div className="p-3 bg-white rounded-xl border border-gray-200 space-y-2">
                    <label className="block text-xs font-bold text-gray-700 uppercase">Fondo del Pie de Página (Footer)</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={formData.footerBgColor || '#0f172a'}
                        onChange={(e) => setFormData({ ...formData, footerBgColor: e.target.value })}
                        className="w-9 h-9 rounded-lg cursor-pointer border border-gray-300"
                      />
                      <input
                        type="text"
                        value={formData.footerBgColor || '#0f172a'}
                        onChange={(e) => setFormData({ ...formData, footerBgColor: e.target.value })}
                        className="w-24 px-2 py-1 text-xs border border-gray-300 rounded font-mono uppercase"
                      />
                    </div>
                  </div>

                  {/* Footer Text Color */}
                  <div className="p-3 bg-white rounded-xl border border-gray-200 space-y-2">
                    <label className="block text-xs font-bold text-gray-700 uppercase">Color Texto Pie de Página (Footer)</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={formData.footerTextColor || '#94a3b8'}
                        onChange={(e) => setFormData({ ...formData, footerTextColor: e.target.value })}
                        className="w-9 h-9 rounded-lg cursor-pointer border border-gray-300"
                      />
                      <input
                        type="text"
                        value={formData.footerTextColor || '#94a3b8'}
                        onChange={(e) => setFormData({ ...formData, footerTextColor: e.target.value })}
                        className="w-24 px-2 py-1 text-xs border border-gray-300 rounded font-mono uppercase"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating WhatsApp Button Customization */}
              <div className="bg-gray-50 p-5 rounded-2xl border border-gray-200 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-extrabold text-base text-gray-900">9. Botón Flotante de WhatsApp</h3>
                  <span className="text-xs font-semibold bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full">Botón Flotante</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                      Texto del Mensaje Flotante (Tooltip)
                    </label>
                    <input
                      type="text"
                      value={formData.floatingWaTooltipText ?? 'Cotizar por WhatsApp'}
                      onChange={(e) => setFormData({ ...formData, floatingWaTooltipText: e.target.value })}
                      placeholder="Cotizar por WhatsApp"
                      className="w-full px-4 py-2 rounded-xl border border-gray-300 text-sm font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                      Color de Fondo Botón Flotante
                    </label>
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        value={formData.floatingWaBgColor || '#25D366'}
                        onChange={(e) => setFormData({ ...formData, floatingWaBgColor: e.target.value })}
                        className="w-10 h-10 rounded-xl cursor-pointer border border-gray-300"
                      />
                      <input
                        type="text"
                        value={formData.floatingWaBgColor || '#25D366'}
                        onChange={(e) => setFormData({ ...formData, floatingWaBgColor: e.target.value })}
                        className="w-32 px-3 py-1.5 rounded-xl border border-gray-300 text-sm font-mono uppercase"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: CONTACTO, TELÉFONOS, MAPA DE GOOGLE & COBERTURA */}
          {activeTab === 'contacts' && (
            <div className="space-y-6">
              {/* 1. Textos Generales de la Sección Contacto */}
              <div className="bg-gray-50 p-5 rounded-2xl border border-gray-200 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-extrabold text-base text-gray-900">1. Textos Principales de la Sección Contacto</h3>
                  <span className="text-xs font-semibold bg-blue-100 text-[#0F3B68] px-2.5 py-0.5 rounded-full">Sección #contacto</span>
                </div>
                <p className="text-xs text-gray-600">
                  Edite el título principal, subtítulo y mensaje introductorio de la sección de contacto en la página web.
                </p>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                      Título Principal de Contacto
                    </label>
                    <input
                      type="text"
                      value={formData.contactTitle || ''}
                      onChange={(e) => setFormData({ ...formData, contactTitle: e.target.value })}
                      placeholder="Contáctenos para Cotizar su Proyecto"
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm font-bold focus:ring-2 focus:ring-[#0F3B68]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                      Subtítulo Destacado
                    </label>
                    <input
                      type="text"
                      value={formData.contactSubtitle || ''}
                      onChange={(e) => setFormData({ ...formData, contactSubtitle: e.target.value })}
                      placeholder="Atención técnica inmediata por WhatsApp, teléfono o visita a planta"
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm font-semibold text-[#D97706] focus:ring-2 focus:ring-[#0F3B68]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                      Descripción / Mensaje Explicativo
                    </label>
                    <textarea
                      rows={3}
                      value={formData.contactMessage || ''}
                      onChange={(e) => setFormData({ ...formData, contactMessage: e.target.value })}
                      placeholder="Estamos listos para evaluar sus requerimientos técnicos..."
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm font-normal focus:ring-2 focus:ring-[#0F3B68]"
                    />
                  </div>
                </div>
              </div>

              {/* 2. Mapa de Ubicación de Google Maps */}
              <div className="bg-gray-50 p-5 rounded-2xl border-2 border-amber-500/40 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-[#D97706]" />
                    <h3 className="font-extrabold text-base text-gray-900">2. Mapa de Ubicación de Google Maps</h3>
                  </div>
                  <label className="inline-flex items-center gap-2 cursor-pointer bg-white px-3 py-1.5 rounded-lg border border-gray-300 shadow-2xs">
                    <input
                      type="checkbox"
                      checked={formData.showContactMap ?? true}
                      onChange={(e) => setFormData({ ...formData, showContactMap: e.target.checked })}
                      className="w-4 h-4 text-[#0F3B68] rounded border-gray-300 focus:ring-[#0F3B68]"
                    />
                    <span className="text-xs font-bold text-gray-800">Mostrar Mapa en Sección Contacto</span>
                  </label>
                </div>

                <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 leading-relaxed space-y-1">
                  <p className="font-bold">📍 ¿Cómo enlazar la ubicación de su empresa con Google Maps?</p>
                  <p>
                    Puede pegar directamente un <b>enlace corto de Google Maps</b> (ejemplo: <code className="bg-amber-100 px-1 py-0.5 rounded text-amber-950 font-mono font-bold">https://maps.app.goo.gl/LQcL7r4fDj9WjZZp8</code>), la URL completa de Google Maps, el código iframe o la dirección física. El sistema detecta y embebe automáticamente el mapa en tiempo real.
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                      Link / Enlace de Google Maps del Negocio
                    </label>
                    <div className="flex flex-col sm:flex-row items-center gap-2">
                      <input
                        type="text"
                        value={formData.contactMapUrl ?? 'https://maps.app.goo.gl/LQcL7r4fDj9WjZZp8'}
                        onChange={(e) => setFormData({ ...formData, contactMapUrl: e.target.value })}
                        placeholder="https://maps.app.goo.gl/LQcL7r4fDj9WjZZp8 o dirección"
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm font-mono text-blue-900 focus:ring-2 focus:ring-[#0F3B68]"
                      />
                      {formData.contactMapUrl && (
                        <a
                          href={formData.contactMapUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 bg-[#0F3B68] hover:bg-slate-900 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-all shadow-xs shrink-0 cursor-pointer"
                        >
                          <Navigation className="w-4 h-4 text-[#D97706]" />
                          <span>Probar Link ↗</span>
                        </a>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                        Título del Bloque del Mapa
                      </label>
                      <input
                        type="text"
                        value={formData.contactMapTitle ?? 'Ubicación de Planta y Talleres Industriales'}
                        onChange={(e) => setFormData({ ...formData, contactMapTitle: e.target.value })}
                        placeholder="Ubicación de Planta y Talleres Industriales"
                        className="w-full px-3 py-2 rounded-xl border border-gray-300 text-sm font-bold focus:ring-2 focus:ring-[#0F3B68]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                        Subtítulo del Bloque del Mapa
                      </label>
                      <input
                        type="text"
                        value={formData.contactMapSubtitle ?? 'Visítenos en nuestras instalaciones o solicite una visita técnica presencial'}
                        onChange={(e) => setFormData({ ...formData, contactMapSubtitle: e.target.value })}
                        placeholder="Visítenos en nuestras instalaciones..."
                        className="w-full px-3 py-2 rounded-xl border border-gray-300 text-sm font-medium focus:ring-2 focus:ring-[#0F3B68]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                      Dirección Física o Referencia Visible
                    </label>
                    <input
                      type="text"
                      value={formData.contactMapAddress ?? 'Servicios Industriales Moldmaq S.A. de C.V. - Estado de México, CDMX y Bajío'}
                      onChange={(e) => setFormData({ ...formData, contactMapAddress: e.target.value })}
                      placeholder="Ej. Tlalnepantla / Cuautitlán Izcalli, Estado de México"
                      className="w-full px-3 py-2 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-[#0F3B68]"
                    />
                  </div>

                  {/* Live Embedded Map Preview in Admin */}
                  {formData.contactMapUrl && (
                    <div className="p-3 bg-white rounded-xl border border-gray-200 space-y-2">
                      <div className="flex items-center justify-between text-xs font-bold text-gray-600 uppercase">
                        <span>Vista Previa en Vivo del Mapa Embebido:</span>
                        <span className="text-[11px] text-emerald-600 font-semibold">✓ Conectado</span>
                      </div>
                      <div className="h-56 rounded-lg overflow-hidden border border-gray-200">
                        <iframe
                          title="Vista Previa Mapa Admin"
                          src={`https://maps.google.com/maps?q=${encodeURIComponent(formData.contactMapUrl.trim())}&t=&z=14&ie=UTF8&iwloc=&output=embed`}
                          width="100%"
                          height="100%"
                          style={{ border: 0 }}
                          allowFullScreen={false}
                          loading="lazy"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* 3. Zonas de Cobertura con Enlaces de Google Maps Individuales */}
              <div className="bg-gray-50 p-5 rounded-2xl border border-gray-200 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h3 className="font-extrabold text-base text-gray-900">3. Zonas de Cobertura y Ciudades de Atención</h3>
                    <p className="text-xs text-gray-600 mt-0.5">
                      Agregue desde 1 hasta múltiples ubicaciones. Cada zona tiene su propio <b>link de Google Maps</b> para que cuando el usuario haga clic desde su celular o computadora, se abra directamente la app de Google Maps con la ubicación.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const currentLocs = formData.coverageLocations || (formData.coverageAreas || []).map((name, i) => ({
                        id: `cov-${Date.now()}-${i}`,
                        name,
                        mapUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(name)}`
                      }));
                      const newLoc: CoverageLocationItem = {
                        id: `cov-${Date.now()}`,
                        name: 'Nueva Zona / Ciudad',
                        mapUrl: 'https://www.google.com/maps/search/?api=1&query=Mexico'
                      };
                      const updated = [...currentLocs, newLoc];
                      setFormData({
                        ...formData,
                        coverageLocations: updated,
                        coverageAreas: updated.map(l => l.name)
                      });
                    }}
                    className="inline-flex items-center gap-1.5 bg-[#0F3B68] hover:bg-slate-900 text-white font-bold text-xs px-3.5 py-2 rounded-xl transition-all shadow-xs shrink-0 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>+ Agregar Zona de Cobertura</span>
                  </button>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                    Título del Apartado de Cobertura
                  </label>
                  <input
                    type="text"
                    value={formData.contactCoverageTitle ?? 'Cobertura y Atención en Sitio:'}
                    onChange={(e) => setFormData({ ...formData, contactCoverageTitle: e.target.value })}
                    placeholder="Cobertura y Atención en Sitio:"
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 text-sm font-bold focus:ring-2 focus:ring-[#0F3B68]"
                  />
                </div>

                {/* Locations List */}
                <div className="space-y-3">
                  {((formData.coverageLocations && formData.coverageLocations.length > 0)
                    ? formData.coverageLocations
                    : (formData.coverageAreas || ['CDMX', 'Estado de México', 'Querétaro', 'Toluca', 'Bajío', 'Toda la República']).map((name, i) => ({
                        id: `cov-default-${i}`,
                        name,
                        mapUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(name)}`
                      }))
                  ).map((loc, idx) => (
                    <div key={loc.id || idx} className="p-4 bg-white rounded-xl border border-gray-200 shadow-2xs space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-full bg-amber-100 text-[#D97706] flex items-center justify-center text-xs font-extrabold">
                            {idx + 1}
                          </span>
                          <span className="text-xs font-bold text-gray-800 uppercase tracking-wide">
                            Ubicación #{idx + 1}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            const current = formData.coverageLocations || (formData.coverageAreas || []).map((name, i) => ({
                              id: `cov-${Date.now()}-${i}`,
                              name,
                              mapUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(name)}`
                            }));
                            const filtered = current.filter((_, i) => i !== idx);
                            setFormData({
                              ...formData,
                              coverageLocations: filtered,
                              coverageAreas: filtered.map(l => l.name)
                            });
                          }}
                          className="inline-flex items-center gap-1 text-xs text-red-600 hover:text-red-800 font-bold hover:underline cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Eliminar</span>
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                        <div className="sm:col-span-4">
                          <label className="block text-[11px] font-bold text-gray-600 uppercase mb-1">
                            Nombre de la Zona / Ciudad
                          </label>
                          <input
                            type="text"
                            value={loc.name}
                            onChange={(e) => {
                              const current = formData.coverageLocations || (formData.coverageAreas || []).map((name, i) => ({
                                id: `cov-${Date.now()}-${i}`,
                                name,
                                mapUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(name)}`
                              }));
                              const updated = [...current];
                              updated[idx] = { ...updated[idx], name: e.target.value };
                              setFormData({
                                ...formData,
                                coverageLocations: updated,
                                coverageAreas: updated.map(l => l.name)
                              });
                            }}
                            placeholder="Ej. CDMX, Querétaro, etc."
                            className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm font-bold text-gray-900 focus:ring-2 focus:ring-[#0F3B68]"
                          />
                        </div>

                        <div className="sm:col-span-8">
                          <label className="block text-[11px] font-bold text-gray-600 uppercase mb-1">
                            Link de Google Maps para {loc.name || 'esta zona'}
                          </label>
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              value={loc.mapUrl || ''}
                              onChange={(e) => {
                                const current = formData.coverageLocations || (formData.coverageAreas || []).map((name, i) => ({
                                  id: `cov-${Date.now()}-${i}`,
                                  name,
                                  mapUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(name)}`
                                }));
                                const updated = [...current];
                                updated[idx] = { ...updated[idx], mapUrl: e.target.value };
                                setFormData({
                                  ...formData,
                                  coverageLocations: updated,
                                  coverageAreas: updated.map(l => l.name)
                                });
                              }}
                              placeholder={`https://maps.app.goo.gl/... o https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(loc.name || 'Mexico')}`}
                              className="w-full px-3 py-2 rounded-lg border border-gray-300 text-xs font-mono text-blue-900 focus:ring-2 focus:ring-[#0F3B68]"
                            />
                            {loc.mapUrl && (
                              <a
                                href={loc.mapUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                title="Probar apertura de mapa"
                                className="inline-flex items-center gap-1 bg-gray-100 hover:bg-amber-100 text-gray-800 hover:text-amber-900 p-2 rounded-lg border border-gray-300 text-xs font-bold shrink-0 transition-colors"
                              >
                                <ExternalLink className="w-3.5 h-3.5" />
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 4. Teléfonos, WhatsApp y Redes Sociales */}
              <div className="bg-gray-50 p-5 rounded-2xl border border-gray-200 space-y-4">
                <h3 className="font-extrabold text-base text-gray-900">4. Líneas Telefónicas & WhatsApp Directo</h3>

                {/* WhatsApp Technical Card Texts */}
                <div className="p-4 bg-white rounded-xl border border-gray-200 space-y-3">
                  <span className="text-xs font-bold text-gray-800 uppercase tracking-wide">
                    Tarjeta de WhatsApp Técnico
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                        Título de la Tarjeta WhatsApp
                      </label>
                      <input
                        type="text"
                        value={formData.contactWaCardTitle ?? 'WhatsApp Técnico Directo'}
                        onChange={(e) => setFormData({ ...formData, contactWaCardTitle: e.target.value })}
                        placeholder="WhatsApp Técnico Directo"
                        className="w-full px-3 py-2 rounded-xl border border-gray-300 text-sm font-bold focus:ring-2 focus:ring-[#0F3B68]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                        Subtítulo / Tiempo de Respuesta
                      </label>
                      <input
                        type="text"
                        value={formData.contactWaCardSubtitle ?? 'Respuesta inmediata de ingenieros de proyecto'}
                        onChange={(e) => setFormData({ ...formData, contactWaCardSubtitle: e.target.value })}
                        placeholder="Respuesta inmediata de ingenieros..."
                        className="w-full px-3 py-2 rounded-xl border border-gray-300 text-sm font-medium focus:ring-2 focus:ring-[#0F3B68]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                        Número de WhatsApp (con lada ej. 525558724410)
                      </label>
                      <input
                        type="text"
                        value={formData.whatsappNumber}
                        onChange={(e) => setFormData({ ...formData, whatsappNumber: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-gray-300 text-sm font-bold text-emerald-800 focus:ring-2 focus:ring-[#0F3B68]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                        Texto del Botón de WhatsApp
                      </label>
                      <input
                        type="text"
                        value={formData.contactWaButtonText ?? 'Enviar WhatsApp'}
                        onChange={(e) => setFormData({ ...formData, contactWaButtonText: e.target.value })}
                        placeholder="Enviar WhatsApp"
                        className="w-full px-3 py-2 rounded-xl border border-gray-300 text-sm font-bold focus:ring-2 focus:ring-[#0F3B68]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                      Mensaje Inicial de WhatsApp
                    </label>
                    <textarea
                      rows={2}
                      value={formData.whatsappMessage}
                      onChange={(e) => setFormData({ ...formData, whatsappMessage: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-gray-300 text-sm font-medium focus:ring-2 focus:ring-[#0F3B68]"
                    />
                  </div>
                </div>

                {/* Direct Phone Lines */}
                <div className="p-4 bg-white rounded-xl border border-gray-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-gray-800 uppercase tracking-wide">
                      Teléfonos de Atención a Planta
                    </span>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, topPhones: [...formData.topPhones, '+52 55 0000 0000'] })}
                      className="inline-flex items-center gap-1 text-xs font-bold text-[#0F3B68] hover:underline"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>+ Agregar Teléfono</span>
                    </button>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                      Título de la Sección de Teléfonos
                    </label>
                    <input
                      type="text"
                      value={formData.contactPhonesTitle ?? 'Líneas de Atención a Planta'}
                      onChange={(e) => setFormData({ ...formData, contactPhonesTitle: e.target.value })}
                      placeholder="Líneas de Atención a Planta"
                      className="w-full px-3 py-2 rounded-xl border border-gray-300 text-sm font-bold focus:ring-2 focus:ring-[#0F3B68]"
                    />
                  </div>

                  <div className="space-y-2 pt-1">
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
                          className="flex-1 px-3 py-2 rounded-xl border border-gray-300 text-sm font-bold focus:ring-2 focus:ring-[#0F3B68]"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const newPhones = formData.topPhones.filter((_, i) => i !== idx);
                            setFormData({ ...formData, topPhones: newPhones });
                          }}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Facebook and Form Customization */}
                <div className="p-4 bg-white rounded-xl border border-gray-200 space-y-3">
                  <span className="text-xs font-bold text-gray-800 uppercase tracking-wide">
                    Página de Facebook & Formulario de Cotización
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                        Página de Facebook (usuario o enlace)
                      </label>
                      <input
                        type="text"
                        value={formData.facebookPage}
                        onChange={(e) => setFormData({ ...formData, facebookPage: e.target.value })}
                        placeholder="moldmaqindustriales"
                        className="w-full px-3 py-2 rounded-xl border border-gray-300 text-sm font-bold focus:ring-2 focus:ring-[#0F3B68]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                        Botón del Formulario de Cotización
                      </label>
                      <input
                        type="text"
                        value={formData.contactFormButtonText ?? 'Enviar Cotización Técnica por WhatsApp'}
                        onChange={(e) => setFormData({ ...formData, contactFormButtonText: e.target.value })}
                        placeholder="Enviar Cotización Técnica por WhatsApp"
                        className="w-full px-3 py-2 rounded-xl border border-gray-300 text-sm font-bold focus:ring-2 focus:ring-[#0F3B68]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                        Título del Formulario de Cotización
                      </label>
                      <input
                        type="text"
                        value={formData.contactFormTitle ?? 'Solicitar Cotización de Maquinados o Moldes'}
                        onChange={(e) => setFormData({ ...formData, contactFormTitle: e.target.value })}
                        placeholder="Solicitar Cotización de Maquinados o Moldes"
                        className="w-full px-3 py-2 rounded-xl border border-gray-300 text-sm font-bold focus:ring-2 focus:ring-[#0F3B68]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                        Subtítulo del Formulario
                      </label>
                      <input
                        type="text"
                        value={formData.contactFormSubtitle ?? 'Llene el formulario con los datos de su proyecto para canalizarlo con el ingeniero especialista.'}
                        onChange={(e) => setFormData({ ...formData, contactFormSubtitle: e.target.value })}
                        placeholder="Llene el formulario con los datos..."
                        className="w-full px-3 py-2 rounded-xl border border-gray-300 text-sm font-medium focus:ring-2 focus:ring-[#0F3B68]"
                      />
                    </div>
                  </div>
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

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                      Texto del Botón de la Diapositiva <span className="text-[10px] text-gray-500 font-normal lowercase">(dejar vacío para ocultar el botón)</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Ej: Cotizar Proyecto (o dejar en blanco para ocultar)"
                      value={slide.buttonText || ''}
                      onChange={(e) => {
                        const newSlides = [...formData.heroSlides];
                        newSlides[idx] = { ...newSlides[idx], buttonText: e.target.value };
                        setFormData({ ...formData, heroSlides: newSlides });
                      }}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm font-medium"
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

                {/* TÍTULO DESTACADO "LÍDERES EN MAQUINADOS CNC..." */}
                <div className="p-4 bg-amber-50 rounded-2xl border-2 border-amber-400/80 shadow-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-black text-amber-950 uppercase tracking-wide flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-amber-600" />
                      <span>Título / Encabezado Destacado ("Líderes en Maquinados...")</span>
                    </label>
                    <span className="text-[10px] font-extrabold bg-amber-200 text-amber-900 px-2 py-0.5 rounded-md uppercase">
                      Texto Principal de Nosotros
                    </span>
                  </div>
                  <input
                    type="text"
                    value={formData.aboutHeadline ?? 'Líderes en Maquinados CNC, Fabricación de Moldes y Soluciones Industriales'}
                    onChange={(e) => setFormData({ ...formData, aboutHeadline: e.target.value })}
                    placeholder="Líderes en Maquinados CNC, Fabricación de Moldes y Soluciones Industriales"
                    className="w-full px-4 py-3 rounded-xl border-2 border-amber-300 bg-white text-base font-extrabold text-gray-900 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 shadow-2xs"
                  />
                  <p className="text-xs text-amber-800 font-medium leading-relaxed">
                    💡 <b>Edite aquí directamente</b> el texto que aparece en letras grandes arriba de la descripción en la sección Nosotros: <i>"Líderes en Maquinados CNC, Fabricación de Moldes y Soluciones Industriales"</i>.
                  </p>
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
                      <label className="block text-[10px] font-bold text-gray-600 mb-0.5">
                        Texto del Botón <span className="text-gray-400 font-normal lowercase">(dejar vacío para ocultar)</span>
                      </label>
                      <input
                        type="text"
                        placeholder="Ej: COTIZAR PROYECTO (o dejar en blanco para ocultar)"
                        value={formData.aboutQuoteBoxButtonText || ''}
                        onChange={(e) => setFormData({ ...formData, aboutQuoteBoxButtonText: e.target.value })}
                        className="w-full px-3 py-1.5 rounded-lg border border-gray-300 text-xs font-bold text-[#D97706]"
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
                        iconName: 'Wrench',
                        title: 'Nuevo Servicio Industrial',
                        description: 'Descripción del nuevo servicio ofrecido por Servicios Industriales Moldmaq S.A.',
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
                      placeholder="moldmaq-media"
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

-- 3. Crear Bucket 'moldmaq-media' en Supabase Storage
insert into storage.buckets (id, name, public) values ('moldmaq-media', 'moldmaq-media', true) on conflict do nothing;
create policy "Acceso Publico Storage Media" on storage.objects for all using (bucket_id = 'moldmaq-media') with check (bucket_id = 'moldmaq-media');`}
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
