import React, { useState, useRef } from 'react';
import { SiteConfig, HeroSlide, ValueAddedItem, ServiceItem, GalleryImage, CoverageLocationItem, QuoteServiceOption } from '../types';
import { uploadImageFile, syncToSupabase, saveSiteConfig, cleanSupabaseUrl } from '../lib/supabaseClient';
import { DEFAULT_QUOTE_SERVICES } from '../lib/defaultData';
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
  ExternalLink,
  Mail,
  Layers,
  Eye,
  EyeOff,
  ArrowUp,
  ArrowDown,
  RotateCcw
} from 'lucide-react';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onLogout?: () => void;
  config: SiteConfig;
  onUpdateConfig: (newConfig: SiteConfig) => void;
}

export const SUPABASE_SQL_SETUP = `-- ==============================================================================
-- SCRIPT SQL PARA SUPABASE - SERVICIOS INDUSTRIALES MOLDMAQ S.A.
-- Ejecutar en Supabase -> SQL Editor -> New Query -> Run
-- Permite que los cambios se guarden en la nube y se vean en cualquier dispositivo
-- ==============================================================================

-- 1. Crear tabla para guardar la configuración completa del sitio web
create table if not exists public.site_config (
  id text primary key,
  content jsonb not null,
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- 2. Habilitar Row Level Security (RLS)
alter table public.site_config enable row level security;

-- 3. Limpiar políticas previas para evitar conflictos
drop policy if exists "Acceso Publico site_config" on public.site_config;
drop policy if exists "Acceso Total public.site_config" on public.site_config;
drop policy if exists "Permitir lectura publica site_config" on public.site_config;
drop policy if exists "Permitir guardar site_config" on public.site_config;

-- 4. Permitir lectura y escritura universal (necesario para que cualquier visitante vea la web y el admin guarde)
create policy "Acceso Total public.site_config"
on public.site_config
for all
to public, anon, authenticated
using (true)
with check (true);

-- 5. Tabla para usuarios administradores (login del panel)
create table if not exists public.admin_users (
  id uuid primary key default gen_random_uuid(),
  username text unique not null,
  password text,
  password_hash text,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Asegurar columnas y remover restricciones conflictivas si la tabla ya existía
alter table public.admin_users add column if not exists username text;
alter table public.admin_users add column if not exists password text;
alter table public.admin_users add column if not exists password_hash text;

do $$
begin
  alter table public.admin_users alter column password_hash drop not null;
exception when others then null;
end $$;

alter table public.admin_users enable row level security;
drop policy if exists "Acceso Lectura admin_users" on public.admin_users;
create policy "Acceso Lectura admin_users"
on public.admin_users
for select
to public, anon, authenticated
using (true);

-- 6. Insertar o actualizar credenciales del usuario administrador (llenando password y password_hash)
insert into public.admin_users (username, password, password_hash)
values ('admin_1', 'Admin_123', 'Admin_123')
on conflict (username) do update set password = 'Admin_123', password_hash = 'Admin_123';

-- 7. Crear y asegurar el bucket de almacenamiento para imágenes y logo
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'moldmaq-media',
  'moldmaq-media',
  true,
  52428800,
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml']
)
on conflict (id) do update set public = true;

-- 8. Políticas de acceso para el bucket de imágenes
drop policy if exists "Permitir ver imagenes publicas" on storage.objects;
create policy "Permitir ver imagenes publicas"
on storage.objects for select
to public, anon, authenticated
using (bucket_id = 'moldmaq-media');

drop policy if exists "Permitir subir imagenes publicas" on storage.objects;
create policy "Permitir subir imagenes publicas"
on storage.objects for insert
to public, anon, authenticated
with check (bucket_id = 'moldmaq-media');

drop policy if exists "Permitir actualizar imagenes publicas" on storage.objects;
create policy "Permitir actualizar imagenes publicas"
on storage.objects for update
to public, anon, authenticated
using (bucket_id = 'moldmaq-media')
with check (bucket_id = 'moldmaq-media');

drop policy if exists "Permitir eliminar imagenes publicas" on storage.objects;
create policy "Permitir eliminar imagenes publicas"
on storage.objects for delete
to public, anon, authenticated
using (bucket_id = 'moldmaq-media');`;

interface ColorPickerInputProps {
  label: string;
  value?: string;
  onChange: (val: string) => void;
  defaultColor?: string;
  description?: string;
}

export const ColorPickerInput: React.FC<ColorPickerInputProps> = ({
  label,
  value,
  onChange,
  defaultColor = '#000000',
  description
}) => {
  const currentColor = value || defaultColor;
  // Ensure valid hex color for html input type color
  const safeHex = currentColor.startsWith('#') && (currentColor.length === 7 || currentColor.length === 4)
    ? currentColor
    : (defaultColor.startsWith('#') && defaultColor.length === 7 ? defaultColor : '#0F3B68');

  return (
    <div className="p-3 bg-white rounded-xl border border-gray-200 space-y-1.5 shadow-2xs hover:border-blue-400 transition-colors">
      <div className="flex items-center justify-between gap-1">
        <label className="text-[11px] font-bold text-gray-700 uppercase tracking-wide truncate max-w-[200px]" title={label}>
          {label}
        </label>
        {value && value.toLowerCase() !== defaultColor.toLowerCase() && (
          <button
            type="button"
            onClick={() => onChange(defaultColor)}
            className="text-[10px] text-gray-400 hover:text-red-600 font-bold cursor-pointer shrink-0"
            title="Restablecer color predeterminado"
          >
            Restablecer
          </button>
        )}
      </div>
      {description && <p className="text-[10px] text-gray-500 leading-tight">{description}</p>}
      <div className="flex items-center gap-2 pt-0.5">
        <input
          type="color"
          value={safeHex}
          onChange={(e) => onChange(e.target.value)}
          className="w-8 h-8 rounded-lg cursor-pointer border border-gray-300 shrink-0 p-0.5"
        />
        <input
          type="text"
          value={currentColor}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-2.5 py-1 text-xs border border-gray-300 rounded-lg font-mono uppercase text-gray-800 font-bold focus:ring-1 focus:ring-[#0F3B68]"
        />
        <div 
          className="w-6 h-6 rounded-md border border-gray-300 shadow-2xs shrink-0" 
          style={{ backgroundColor: currentColor }} 
        />
      </div>
    </div>
  );
};

export const AdminPanel: React.FC<AdminPanelProps> = ({
  isOpen,
  onClose,
  onLogout,
  config,
  onUpdateConfig,
}) => {
  const [formData, setFormData] = useState<SiteConfig>(config);
  const [activeTab, setActiveTab] = useState<'general' | 'colors' | 'contacts' | 'slider' | 'content' | 'services' | 'gallery' | 'footer' | 'supabase'>('general');
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

  // Extract Project ID from Supabase URL dynamically
  const currentProjectId = cleanSupabaseUrl(formData.supabaseUrl).replace(/^https?:\/\//i, '').split('.')[0] || 'glqyclphjelrdminvetb';

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
          title: fileNameWithoutExt ? fileNameWithoutExt : `Trabajo Moldmaq ${formData.galleryImages.length + i + 1}`
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
                ADMIN MODE: MOLDMAQ S.A.
              </span>
              <span className="opacity-50 text-xs hidden sm:inline">|</span>
              <span className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                Supabase Cloud: {currentProjectId}
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
                  ⚠️ <strong>Causa del Error:</strong> Tu proyecto en Supabase (<code>{currentProjectId}</code>) aún no tiene la tabla <code>site_config</code> o las políticas de acceso RLS no han sido ejecutadas.
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
                    href={`https://supabase.com/dashboard/project/${currentProjectId}/sql/new`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2 rounded-lg text-xs transition-all shadow-xs"
                  >
                    <span>2. Abrir SQL Editor en Supabase ({currentProjectId}) ↗</span>
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
                onClick={() => setActiveTab('colors')}
                className="inline-flex items-center gap-1 bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 px-2.5 py-1 rounded-md font-bold text-[11px] border border-purple-500/40 transition-colors cursor-pointer"
              >
                <Palette className="w-3 h-3 text-purple-400" />
                <span>🎨 Colores de Botones, Recuadros, Títulos...</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('contacts')}
                className="inline-flex items-center gap-1 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 px-2.5 py-1 rounded-md font-bold text-[11px] border border-amber-500/40 transition-colors cursor-pointer"
              >
                <MapPin className="w-3 h-3 text-amber-400" />
                <span>📍 Contacto, Mapa Google & Teléfonos</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('content')}
                className="inline-flex items-center gap-1 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 px-2.5 py-1 rounded-md font-bold text-[11px] border border-blue-500/40 transition-colors cursor-pointer"
              >
                <Sparkles className="w-3 h-3 text-blue-400" />
                <span>⭐ Editar Título "Líderes en Maquinados..."</span>
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
                <span>1. Identidad & Logo</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('colors')}
                className={`flex items-center gap-1.5 sm:gap-2 px-3 py-2 sm:px-3.5 sm:py-2.5 rounded-lg font-bold text-xs uppercase tracking-wider transition-all cursor-pointer ${
                  activeTab === 'colors'
                    ? 'bg-purple-600 text-white shadow-md ring-2 ring-purple-400'
                    : 'text-purple-300 hover:text-white hover:bg-purple-950/60 bg-slate-900 border border-purple-500/40'
                }`}
              >
                <Palette className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 text-purple-400" />
                <span className="font-extrabold">2. 🎨 Colores & Estilos Web</span>
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
                <span className="font-extrabold">3. 📍 Contacto & Mapa Google</span>
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
                <span>4. Slider Principal ({formData.heroSlides.length})</span>
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
                <span className="font-extrabold">5. ⭐ Bienvenida & Nosotros ("Líderes...")</span>
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
                <span>6. Servicios</span>
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
                <span>7. Galería ({formData.galleryImages.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('footer')}
                className={`flex items-center gap-1.5 sm:gap-2 px-3 py-2 sm:px-3.5 sm:py-2.5 rounded-lg font-bold text-xs uppercase tracking-wider transition-all cursor-pointer ${
                  activeTab === 'footer'
                    ? 'bg-blue-600 text-white shadow-md ring-2 ring-blue-400'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800 bg-slate-900 border border-slate-800'
                }`}
              >
                <FileText className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 text-blue-400" />
                <span>8. Pie de Página</span>
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
                <span className="font-extrabold text-white">9. Supabase DB</span>
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

          {/* TAB 2: 🎨 PALETA GLOBAL & COLORES DE TODA LA WEB */}
          {activeTab === 'colors' && (
            <div className="space-y-6">
              {/* Header Banner */}
              <div className="bg-linear-to-r from-purple-900 to-indigo-900 text-white p-6 rounded-2xl shadow-md border border-purple-800 space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <h3 className="font-extrabold text-lg flex items-center gap-2">
                      <Palette className="w-5 h-5 text-purple-300" />
                      <span>Centro de Control de Colores & Estilos Visuales</span>
                    </h3>
                    <p className="text-xs text-purple-200 leading-relaxed max-w-2xl">
                      Personalice en tiempo real los colores de fondos, botones, recuadros, barras, iconos, títulos, subtítulos y textos de toda la página web sin excepción. Todos los cambios se reflejan inmediatamente en la vista previa.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleSave}
                    className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-md transition-all shrink-0 cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    <span>Guardar Colores</span>
                  </button>
                </div>
              </div>

              {/* 1. COLORES DE BOTONES */}
              <div className="bg-gray-50 p-5 rounded-2xl border border-gray-200 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-extrabold text-sm text-gray-900 flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                    <span>1. Colores de Botones (Fondo y Texto)</span>
                  </h4>
                  <span className="text-[11px] font-bold bg-amber-100 text-amber-900 px-2.5 py-0.5 rounded-full">Botones de Toda la Web</span>
                </div>
                <p className="text-xs text-gray-600">
                  Defina los fondos y contrastes de texto para cada botón de acción de la plataforma.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  <ColorPickerInput
                    label="Botón Cotizar Barra Sup. (Fondo)"
                    value={formData.topBarButtonBgColor}
                    defaultColor="#D97706"
                    onChange={(val) => setFormData({ ...formData, topBarButtonBgColor: val })}
                  />
                  <ColorPickerInput
                    label="Botón Cotizar Barra Sup. (Texto)"
                    value={formData.topBarButtonTextColor}
                    defaultColor="#ffffff"
                    onChange={(val) => setFormData({ ...formData, topBarButtonTextColor: val })}
                  />
                  <ColorPickerInput
                    label="Botón CTA Cabecera Header (Fondo)"
                    value={formData.headerCtaBgColor}
                    defaultColor="#D97706"
                    onChange={(val) => setFormData({ ...formData, headerCtaBgColor: val })}
                  />
                  <ColorPickerInput
                    label="Botón CTA Cabecera Header (Texto)"
                    value={formData.headerCtaTextColor}
                    defaultColor="#ffffff"
                    onChange={(val) => setFormData({ ...formData, headerCtaTextColor: val })}
                  />
                  <ColorPickerInput
                    label="Botón Principal Slider (Fondo)"
                    value={formData.heroPrimaryBtnBgColor || formData.heroButtonBgColor}
                    defaultColor="#D97706"
                    onChange={(val) => setFormData({ ...formData, heroPrimaryBtnBgColor: val, heroButtonBgColor: val })}
                  />
                  <ColorPickerInput
                    label="Botón Principal Slider (Texto)"
                    value={formData.heroPrimaryBtnTextColor || formData.heroButtonTextColor}
                    defaultColor="#ffffff"
                    onChange={(val) => setFormData({ ...formData, heroPrimaryBtnTextColor: val, heroButtonTextColor: val })}
                  />
                  <ColorPickerInput
                    label="Botón Secundario Slider (Fondo)"
                    value={formData.heroSecondaryBtnBgColor || formData.heroSecButtonBgColor}
                    defaultColor="rgba(255, 255, 255, 0.1)"
                    onChange={(val) => setFormData({ ...formData, heroSecondaryBtnBgColor: val, heroSecButtonBgColor: val })}
                  />
                  <ColorPickerInput
                    label="Botón Secundario Slider (Texto)"
                    value={formData.heroSecondaryBtnTextColor || formData.heroSecButtonTextColor}
                    defaultColor="#ffffff"
                    onChange={(val) => setFormData({ ...formData, heroSecondaryBtnTextColor: val, heroSecButtonTextColor: val })}
                  />
                  <ColorPickerInput
                    label="Botón Cotizar Nosotros (Fondo)"
                    value={formData.aboutQuoteBoxButtonBgColor}
                    defaultColor="#D97706"
                    onChange={(val) => setFormData({ ...formData, aboutQuoteBoxButtonBgColor: val })}
                  />
                  <ColorPickerInput
                    label="Botón Cotizar Nosotros (Texto)"
                    value={formData.aboutQuoteBoxButtonTextColor}
                    defaultColor="#ffffff"
                    onChange={(val) => setFormData({ ...formData, aboutQuoteBoxButtonTextColor: val })}
                  />
                  <ColorPickerInput
                    label="Botón Formulario Contacto (Fondo)"
                    value={formData.contactFormButtonBgColor}
                    defaultColor="#0F3B68"
                    onChange={(val) => setFormData({ ...formData, contactFormButtonBgColor: val })}
                  />
                  <ColorPickerInput
                    label="Botón Formulario Contacto (Texto)"
                    value={formData.contactFormButtonTextColor}
                    defaultColor="#ffffff"
                    onChange={(val) => setFormData({ ...formData, contactFormButtonTextColor: val })}
                  />
                  <ColorPickerInput
                    label="Botón WhatsApp Contacto (Fondo)"
                    value={formData.contactDirectWaButtonBgColor || formData.contactWaButtonBgColor}
                    defaultColor="#25D366"
                    onChange={(val) => setFormData({ ...formData, contactDirectWaButtonBgColor: val, contactWaButtonBgColor: val })}
                  />
                  <ColorPickerInput
                    label="Botón WhatsApp Contacto (Texto)"
                    value={formData.contactDirectWaButtonTextColor || formData.contactWaButtonTextColor}
                    defaultColor="#ffffff"
                    onChange={(val) => setFormData({ ...formData, contactDirectWaButtonTextColor: val, contactWaButtonTextColor: val })}
                  />
                  <ColorPickerInput
                    label="Botón WhatsApp Pie Página (Fondo)"
                    value={formData.footerWaButtonBgColor}
                    defaultColor="#25D366"
                    onChange={(val) => setFormData({ ...formData, footerWaButtonBgColor: val })}
                  />
                  <ColorPickerInput
                    label="Botón WhatsApp Pie Página (Texto)"
                    value={formData.footerWaButtonTextColor}
                    defaultColor="#ffffff"
                    onChange={(val) => setFormData({ ...formData, footerWaButtonTextColor: val })}
                  />
                  <ColorPickerInput
                    label="Botón Flotante WhatsApp (Fondo)"
                    value={formData.floatingWaBgColor}
                    defaultColor="#25D366"
                    onChange={(val) => setFormData({ ...formData, floatingWaBgColor: val })}
                  />
                  <ColorPickerInput
                    label="Botón Flotante WhatsApp (Texto)"
                    value={formData.floatingWaTextColor}
                    defaultColor="#ffffff"
                    onChange={(val) => setFormData({ ...formData, floatingWaTextColor: val })}
                  />
                </div>
              </div>

              {/* 2. COLORES DE RECUADROS, TARJETAS Y BORDES */}
              <div className="bg-gray-50 p-5 rounded-2xl border border-gray-200 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-extrabold text-sm text-gray-900 flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
                    <span>2. Colores de Recuadros, Tarjetas y Bordes</span>
                  </h4>
                  <span className="text-[11px] font-bold bg-blue-100 text-[#0F3B68] px-2.5 py-0.5 rounded-full">Recuadros y Cajas</span>
                </div>
                <p className="text-xs text-gray-600">
                  Modifique los fondos y bordes de los recuadros de contenido, tarjetas de servicios y cajas de información.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  <ColorPickerInput
                    label="Tarjeta Bienvenida (Fondo)"
                    value={formData.welcomeCardBgColor}
                    defaultColor="#ffffff"
                    onChange={(val) => setFormData({ ...formData, welcomeCardBgColor: val })}
                  />
                  <ColorPickerInput
                    label="Tarjeta Bienvenida (Borde)"
                    value={formData.welcomeCardBorderColor}
                    defaultColor="#e2e8f0"
                    onChange={(val) => setFormData({ ...formData, welcomeCardBorderColor: val })}
                  />
                  <ColorPickerInput
                    label="Pastillas Cobertura (Fondo)"
                    value={formData.welcomeAreaBgColor}
                    defaultColor="#f8fafc"
                    onChange={(val) => setFormData({ ...formData, welcomeAreaBgColor: val })}
                  />
                  <ColorPickerInput
                    label="Pastillas Cobertura (Borde)"
                    value={formData.welcomeAreaBorderColor}
                    defaultColor="#cbd5e1"
                    onChange={(val) => setFormData({ ...formData, welcomeAreaBorderColor: val })}
                  />
                  <ColorPickerInput
                    label="Pastillas Cobertura (Texto)"
                    value={formData.welcomeAreaTextColor}
                    defaultColor="#334155"
                    onChange={(val) => setFormData({ ...formData, welcomeAreaTextColor: val })}
                  />
                  <ColorPickerInput
                    label="Tarjetas Características Nosotros (Fondo)"
                    value={formData.aboutCardBgColor}
                    defaultColor="#ffffff"
                    onChange={(val) => setFormData({ ...formData, aboutCardBgColor: val })}
                  />
                  <ColorPickerInput
                    label="Tarjetas Características Nosotros (Borde)"
                    value={formData.aboutCardBorderColor}
                    defaultColor="#e2e8f0"
                    onChange={(val) => setFormData({ ...formData, aboutCardBorderColor: val })}
                  />
                  <ColorPickerInput
                    label="Recuadro Cotización Nosotros (Fondo)"
                    value={formData.aboutQuoteBoxBgColor}
                    defaultColor="#0F3B68"
                    onChange={(val) => setFormData({ ...formData, aboutQuoteBoxBgColor: val })}
                  />
                  <ColorPickerInput
                    label="Recuadro Cotización Nosotros (Borde)"
                    value={formData.aboutQuoteBoxBorderColor}
                    defaultColor="#0F3B68"
                    onChange={(val) => setFormData({ ...formData, aboutQuoteBoxBorderColor: val })}
                  />
                  <ColorPickerInput
                    label="Tarjetas Servicios (Fondo)"
                    value={formData.servicesCardBgColor || formData.serviceCardBgColor}
                    defaultColor="#ffffff"
                    onChange={(val) => setFormData({ ...formData, servicesCardBgColor: val, serviceCardBgColor: val })}
                  />
                  <ColorPickerInput
                    label="Tarjetas Servicios (Borde)"
                    value={formData.servicesCardBorderColor || formData.serviceCardBorderColor}
                    defaultColor="#e2e8f0"
                    onChange={(val) => setFormData({ ...formData, servicesCardBorderColor: val, serviceCardBorderColor: val })}
                  />
                  <ColorPickerInput
                    label="Tarjetas de Contacto (Fondo)"
                    value={formData.contactCardBgColor}
                    defaultColor="#ffffff"
                    onChange={(val) => setFormData({ ...formData, contactCardBgColor: val })}
                  />
                  <ColorPickerInput
                    label="Tarjetas de Contacto (Borde)"
                    value={formData.contactCardBorderColor}
                    defaultColor="#e2e8f0"
                    onChange={(val) => setFormData({ ...formData, contactCardBorderColor: val })}
                  />
                </div>
              </div>

              {/* 3. COLORES DE BARRAS Y FONDOS DE SECCIÓN */}
              <div className="bg-gray-50 p-5 rounded-2xl border border-gray-200 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-extrabold text-sm text-gray-900 flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
                    <span>3. Colores de Barras y Fondos de Sección</span>
                  </h4>
                  <span className="text-[11px] font-bold bg-emerald-100 text-emerald-900 px-2.5 py-0.5 rounded-full">Barras y Secciones</span>
                </div>
                <p className="text-xs text-gray-600">
                  Configure los fondos de las barras superiores, menús y de cada una de las secciones principales del sitio.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  <ColorPickerInput
                    label="Barra Superior Top Bar (Fondo)"
                    value={formData.topBarBgColor}
                    defaultColor="#0F3B68"
                    onChange={(val) => setFormData({ ...formData, topBarBgColor: val })}
                  />
                  <ColorPickerInput
                    label="Cabecera Principal Header (Fondo)"
                    value={formData.headerBgColor}
                    defaultColor="#ffffff"
                    onChange={(val) => setFormData({ ...formData, headerBgColor: val })}
                  />
                  <ColorPickerInput
                    label="Menú Móvil (Fondo)"
                    value={formData.mobileMenuBgColor}
                    defaultColor="#ffffff"
                    onChange={(val) => setFormData({ ...formData, mobileMenuBgColor: val })}
                  />
                  <ColorPickerInput
                    label="Menú Móvil (Borde)"
                    value={formData.mobileMenuBorderColor}
                    defaultColor="#e2e8f0"
                    onChange={(val) => setFormData({ ...formData, mobileMenuBorderColor: val })}
                  />
                  <ColorPickerInput
                    label="Sección Bienvenida (Fondo)"
                    value={formData.welcomeBgColor}
                    defaultColor="#f1f5f9"
                    onChange={(val) => setFormData({ ...formData, welcomeBgColor: val })}
                  />
                  <ColorPickerInput
                    label="Franja de Aviso Bienvenida (Fondo)"
                    value={formData.welcomeStripBgColor || formData.welcomeBottomStripBgColor}
                    defaultColor="#0F3B68"
                    onChange={(val) => setFormData({ ...formData, welcomeStripBgColor: val, welcomeBottomStripBgColor: val })}
                  />
                  <ColorPickerInput
                    label="Franja de Aviso Bienvenida (Texto)"
                    value={formData.welcomeStripTextColor || formData.welcomeBottomStripTextColor}
                    defaultColor="#ffffff"
                    onChange={(val) => setFormData({ ...formData, welcomeStripTextColor: val, welcomeBottomStripTextColor: val })}
                  />
                  <ColorPickerInput
                    label="Sección Nosotros (Fondo)"
                    value={formData.aboutBgColor}
                    defaultColor="#ffffff"
                    onChange={(val) => setFormData({ ...formData, aboutBgColor: val })}
                  />
                  <ColorPickerInput
                    label="Sección Servicios (Fondo)"
                    value={formData.servicesBgColor}
                    defaultColor="#f8fafc"
                    onChange={(val) => setFormData({ ...formData, servicesBgColor: val })}
                  />
                  <ColorPickerInput
                    label="Sección Galería Flota (Fondo)"
                    value={formData.galleryBgColor}
                    defaultColor="#ffffff"
                    onChange={(val) => setFormData({ ...formData, galleryBgColor: val })}
                  />
                  <ColorPickerInput
                    label="Sección Contacto (Fondo)"
                    value={formData.contactBgColor}
                    defaultColor="#f8fafc"
                    onChange={(val) => setFormData({ ...formData, contactBgColor: val })}
                  />
                  <ColorPickerInput
                    label="Pie de Página Footer (Fondo)"
                    value={formData.footerBgColor}
                    defaultColor="#0B132B"
                    onChange={(val) => setFormData({ ...formData, footerBgColor: val })}
                  />
                </div>
              </div>

              {/* 4. COLORES DE ÍCONOS Y DISTINTIVOS / BADGES */}
              <div className="bg-gray-50 p-5 rounded-2xl border border-gray-200 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-extrabold text-sm text-gray-900 flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-cyan-600"></span>
                    <span>4. Colores de Íconos y Distintivos (Badges)</span>
                  </h4>
                  <span className="text-[11px] font-bold bg-cyan-100 text-cyan-900 px-2.5 py-0.5 rounded-full">Íconos & Insignias</span>
                </div>
                <p className="text-xs text-gray-600">
                  Personalice el color de los iconos de servicios, tarjetas de contacto e insignias de calidad.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  <ColorPickerInput
                    label="Íconos Barra Superior"
                    value={formData.topBarIconColor}
                    defaultColor="#D97706"
                    onChange={(val) => setFormData({ ...formData, topBarIconColor: val })}
                  />
                  <ColorPickerInput
                    label="Insignia / Badge Bienvenida (Fondo)"
                    value={formData.welcomeBadgeBgColor}
                    defaultColor="rgba(15, 59, 104, 0.08)"
                    onChange={(val) => setFormData({ ...formData, welcomeBadgeBgColor: val })}
                  />
                  <ColorPickerInput
                    label="Insignia / Badge Bienvenida (Texto)"
                    value={formData.welcomeBadgeTextColor}
                    defaultColor="#0F3B68"
                    onChange={(val) => setFormData({ ...formData, welcomeBadgeTextColor: val })}
                  />
                  <ColorPickerInput
                    label="Insignia / Badge Nosotros (Fondo)"
                    value={formData.aboutBadgeBgColor}
                    defaultColor="rgba(15, 59, 104, 0.08)"
                    onChange={(val) => setFormData({ ...formData, aboutBadgeBgColor: val })}
                  />
                  <ColorPickerInput
                    label="Insignia / Badge Nosotros (Texto)"
                    value={formData.aboutBadgeTextColor}
                    defaultColor="#0F3B68"
                    onChange={(val) => setFormData({ ...formData, aboutBadgeTextColor: val })}
                  />
                  <ColorPickerInput
                    label="Íconos Características Nosotros"
                    value={formData.aboutCardIconColor || formData.aboutIconColor}
                    defaultColor="#0F3B68"
                    onChange={(val) => setFormData({ ...formData, aboutCardIconColor: val, aboutIconColor: val })}
                  />
                  <ColorPickerInput
                    label="Íconos Tarjetas de Servicios"
                    value={formData.servicesCardIconColor || formData.serviceCardIconColor}
                    defaultColor="#0F3B68"
                    onChange={(val) => setFormData({ ...formData, servicesCardIconColor: val, serviceCardIconColor: val })}
                  />
                  <ColorPickerInput
                    label="Insignia Servicios (Fondo)"
                    value={formData.servicesCardBadgeBgColor || formData.serviceCardBadgeBgColor}
                    defaultColor="#eff6ff"
                    onChange={(val) => setFormData({ ...formData, servicesCardBadgeBgColor: val, serviceCardBadgeBgColor: val })}
                  />
                  <ColorPickerInput
                    label="Insignia Servicios (Texto)"
                    value={formData.servicesCardBadgeTextColor || formData.serviceCardBadgeTextColor}
                    defaultColor="#0F3B68"
                    onChange={(val) => setFormData({ ...formData, servicesCardBadgeTextColor: val, serviceCardBadgeTextColor: val })}
                  />
                  <ColorPickerInput
                    label="Íconos Tarjetas de Contacto"
                    value={formData.contactIconColor}
                    defaultColor="#0F3B68"
                    onChange={(val) => setFormData({ ...formData, contactIconColor: val })}
                  />
                  <ColorPickerInput
                    label="Acentos & Íconos Pie de Página"
                    value={formData.footerAccentColor}
                    defaultColor="#D97706"
                    onChange={(val) => setFormData({ ...formData, footerAccentColor: val })}
                  />
                </div>
              </div>

              {/* 5. COLORES DE TÍTULOS, SUBTÍTULOS Y TEXTOS */}
              <div className="bg-gray-50 p-5 rounded-2xl border border-gray-200 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-extrabold text-sm text-gray-900 flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-600"></span>
                    <span>5. Colores de Títulos, Subtítulos y Textos</span>
                  </h4>
                  <span className="text-[11px] font-bold bg-rose-100 text-rose-900 px-2.5 py-0.5 rounded-full">Tipografía & Encabezados</span>
                </div>
                <p className="text-xs text-gray-600">
                  Modifique los colores de los títulos principales, subtítulos destacados y párrafos descriptivos.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  <ColorPickerInput
                    label="Nombre de Marca / Logo (Texto)"
                    value={formData.brandNameColor}
                    defaultColor="#0F3B68"
                    onChange={(val) => setFormData({ ...formData, brandNameColor: val })}
                  />
                  <ColorPickerInput
                    label="Sufijo S.A. de Marca (Texto)"
                    value={formData.brandSuffixColor}
                    defaultColor="#D97706"
                    onChange={(val) => setFormData({ ...formData, brandSuffixColor: val })}
                  />
                  <ColorPickerInput
                    label="Subtítulo del Logo (Texto)"
                    value={formData.brandSubtitleColor}
                    defaultColor="#475569"
                    onChange={(val) => setFormData({ ...formData, brandSubtitleColor: val })}
                  />
                  <ColorPickerInput
                    label="Títulos Diapositivas Slider"
                    value={formData.heroTitleColor}
                    defaultColor="#ffffff"
                    onChange={(val) => setFormData({ ...formData, heroTitleColor: val })}
                  />
                  <ColorPickerInput
                    label="Subtítulos Diapositivas Slider"
                    value={formData.heroSubtitleColor}
                    defaultColor="#e2e8f0"
                    onChange={(val) => setFormData({ ...formData, heroSubtitleColor: val })}
                  />
                  <ColorPickerInput
                    label="Título Mensaje Bienvenida"
                    value={formData.welcomeTitleColor}
                    defaultColor="#0F3B68"
                    onChange={(val) => setFormData({ ...formData, welcomeTitleColor: val })}
                  />
                  <ColorPickerInput
                    label="Subtítulo Mensaje Bienvenida"
                    value={formData.welcomeSubtitleColor}
                    defaultColor="#D97706"
                    onChange={(val) => setFormData({ ...formData, welcomeSubtitleColor: val })}
                  />
                  <ColorPickerInput
                    label="Cuerpo Texto Bienvenida"
                    value={formData.welcomeBodyColor}
                    defaultColor="#475569"
                    onChange={(val) => setFormData({ ...formData, welcomeBodyColor: val })}
                  />
                  <ColorPickerInput
                    label="Título Sección Nosotros"
                    value={formData.aboutTitleColor}
                    defaultColor="#0F3B68"
                    onChange={(val) => setFormData({ ...formData, aboutTitleColor: val })}
                  />
                  <ColorPickerInput
                    label="Subtítulo Sección Nosotros"
                    value={formData.aboutSubtitleColor}
                    defaultColor="#D97706"
                    onChange={(val) => setFormData({ ...formData, aboutSubtitleColor: val })}
                  />
                  <ColorPickerInput
                    label="⭐ Encabezado Destacado Nosotros ('Líderes...')"
                    value={formData.aboutHeadlineColor}
                    defaultColor="#0F3B68"
                    onChange={(val) => setFormData({ ...formData, aboutHeadlineColor: val })}
                    description="Color para el título grande 'Líderes en Maquinados CNC...'"
                  />
                  <ColorPickerInput
                    label="Descripción Empresa Nosotros"
                    value={formData.aboutDescriptionColor}
                    defaultColor="#475569"
                    onChange={(val) => setFormData({ ...formData, aboutDescriptionColor: val })}
                  />
                  <ColorPickerInput
                    label="Título Sección Servicios"
                    value={formData.servicesTitleColor}
                    defaultColor="#0F3B68"
                    onChange={(val) => setFormData({ ...formData, servicesTitleColor: val })}
                  />
                  <ColorPickerInput
                    label="Subtítulo Sección Servicios"
                    value={formData.servicesSubtitleColor}
                    defaultColor="#D97706"
                    onChange={(val) => setFormData({ ...formData, servicesSubtitleColor: val })}
                  />
                  <ColorPickerInput
                    label="Títulos Tarjetas de Servicios"
                    value={formData.servicesCardTitleColor || formData.serviceCardTitleColor}
                    defaultColor="#0F3B68"
                    onChange={(val) => setFormData({ ...formData, servicesCardTitleColor: val, serviceCardTitleColor: val })}
                  />
                  <ColorPickerInput
                    label="Descripción Tarjetas de Servicios"
                    value={formData.servicesCardTextColor || formData.serviceCardDescColor}
                    defaultColor="#475569"
                    onChange={(val) => setFormData({ ...formData, servicesCardTextColor: val, serviceCardDescColor: val })}
                  />
                  <ColorPickerInput
                    label="Enlace 'Cotizar' en Servicios"
                    value={formData.servicesCardCtaColor || formData.serviceCardCtaColor}
                    defaultColor="#D97706"
                    onChange={(val) => setFormData({ ...formData, servicesCardCtaColor: val, serviceCardCtaColor: val })}
                  />
                  <ColorPickerInput
                    label="Título Galería de Fotos"
                    value={formData.galleryTitleColor}
                    defaultColor="#111827"
                    onChange={(val) => setFormData({ ...formData, galleryTitleColor: val })}
                  />
                  <ColorPickerInput
                    label="Subtítulo Galería de Fotos"
                    value={formData.gallerySubtitleColor}
                    defaultColor="#D97706"
                    onChange={(val) => setFormData({ ...formData, gallerySubtitleColor: val })}
                  />
                  <ColorPickerInput
                    label="Título Sección Contacto"
                    value={formData.contactTitleColor}
                    defaultColor="#0F3B68"
                    onChange={(val) => setFormData({ ...formData, contactTitleColor: val })}
                  />
                  <ColorPickerInput
                    label="Subtítulo Sección Contacto"
                    value={formData.contactSubtitleColor}
                    defaultColor="#D97706"
                    onChange={(val) => setFormData({ ...formData, contactSubtitleColor: val })}
                  />
                  <ColorPickerInput
                    label="Encabezados Pie de Página"
                    value={formData.footerHeadingsColor}
                    defaultColor="#ffffff"
                    onChange={(val) => setFormData({ ...formData, footerHeadingsColor: val })}
                  />
                  <ColorPickerInput
                    label="Textos Normales Pie de Página"
                    value={formData.footerTextColor}
                    defaultColor="#94a3b8"
                    onChange={(val) => setFormData({ ...formData, footerTextColor: val })}
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: CONTACTO, TELÉFONOS, MAPA DE GOOGLE & COBERTURA */}
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
                <div className="p-4 bg-white rounded-xl border border-gray-200 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center">
                        <Phone className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-xs font-bold text-gray-800 uppercase tracking-wide">
                          Teléfonos de Atención a Planta
                        </span>
                        <p className="text-[11px] text-gray-500">
                          Al hacer clic en la web, el cliente final iniciará una llamada directa (<code className="bg-slate-100 px-1 py-0.5 rounded text-[10px]">tel:</code>).
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, topPhones: [...(formData.topPhones || []), '+52 55 0000 0000'] })}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#0F3B68] text-white rounded-lg text-xs font-bold hover:bg-[#0F3B68]/90 transition-colors cursor-pointer shadow-2xs"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>+ Agregar Teléfono</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
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
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                        Subtítulo Explicativo de Teléfonos
                      </label>
                      <input
                        type="text"
                        value={formData.contactPhonesSubtitle ?? 'Haga clic en cualquier número para iniciar una llamada directa'}
                        onChange={(e) => setFormData({ ...formData, contactPhonesSubtitle: e.target.value })}
                        placeholder="Haga clic en cualquier número para iniciar una llamada directa"
                        className="w-full px-3 py-2 rounded-xl border border-gray-300 text-sm font-medium focus:ring-2 focus:ring-[#0F3B68]"
                      />
                    </div>
                  </div>

                  <div className="space-y-2 pt-1">
                    <label className="block text-xs font-bold text-gray-700 uppercase">
                      Lista de Números Telefónicos ({formData.topPhones ? formData.topPhones.length : 0})
                    </label>
                    {(!formData.topPhones || formData.topPhones.length === 0) && (
                      <p className="text-xs text-gray-400 italic py-2">No hay teléfonos configurados. Haga clic en "+ Agregar Teléfono".</p>
                    )}
                    {formData.topPhones && formData.topPhones.map((phone, idx) => (
                      <div key={idx} className="flex items-center gap-2 bg-slate-50 p-2 rounded-xl border border-slate-200">
                        <span className="text-xs font-bold text-gray-400 w-5 text-center shrink-0">#{idx + 1}</span>
                        <input
                          type="text"
                          value={phone}
                          placeholder="+52 55 5872 4410"
                          onChange={(e) => {
                            const newPhones = [...formData.topPhones];
                            newPhones[idx] = e.target.value;
                            setFormData({ ...formData, topPhones: newPhones });
                          }}
                          className="flex-1 px-3 py-1.5 bg-white rounded-lg border border-gray-300 text-sm font-bold focus:ring-2 focus:ring-[#0F3B68]"
                        />
                        <a
                          href={`tel:${phone.replace(/\D/g, '')}`}
                          title="Probar enlace de llamada tel:"
                          className="px-2.5 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-bold rounded-lg border border-amber-200 shrink-0 transition-colors flex items-center gap-1"
                        >
                          <Phone className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">Probar llamada</span>
                        </a>
                        <button
                          type="button"
                          onClick={() => {
                            const newPhones = formData.topPhones.filter((_, i) => i !== idx);
                            setFormData({ ...formData, topPhones: newPhones });
                          }}
                          title="Eliminar este teléfono"
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg cursor-pointer shrink-0 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Direct Email Lines */}
                <div className="p-4 bg-white rounded-xl border border-gray-200 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
                        <Mail className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-xs font-bold text-gray-800 uppercase tracking-wide">
                          Correos Electrónicos de Contacto
                        </span>
                        <p className="text-[11px] text-gray-500">
                          Al hacer clic en la web, el cliente final abrirá su gestor de correo (<code className="bg-slate-100 px-1 py-0.5 rounded text-[10px]">mailto:</code>) para enviar un mensaje.
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, contactEmails: [...(formData.contactEmails || []), 'contacto@moldmaq.com.mx'] })}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#0F3B68] text-white rounded-lg text-xs font-bold hover:bg-[#0F3B68]/90 transition-colors cursor-pointer shadow-2xs"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>+ Agregar Correo</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                        Título de la Sección de Correos
                      </label>
                      <input
                        type="text"
                        value={formData.contactEmailsTitle ?? 'Correos Electrónicos de Atención'}
                        onChange={(e) => setFormData({ ...formData, contactEmailsTitle: e.target.value })}
                        placeholder="Correos Electrónicos de Atención"
                        className="w-full px-3 py-2 rounded-xl border border-gray-300 text-sm font-bold focus:ring-2 focus:ring-[#0F3B68]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                        Subtítulo Explicativo de Correos
                      </label>
                      <input
                        type="text"
                        value={formData.contactEmailsSubtitle ?? 'Haga clic en cualquier correo para redactar y enviar un mensaje directo'}
                        onChange={(e) => setFormData({ ...formData, contactEmailsSubtitle: e.target.value })}
                        placeholder="Haga clic en cualquier correo para redactar y enviar un mensaje directo"
                        className="w-full px-3 py-2 rounded-xl border border-gray-300 text-sm font-medium focus:ring-2 focus:ring-[#0F3B68]"
                      />
                    </div>
                  </div>

                  <div className="space-y-2 pt-1">
                    <label className="block text-xs font-bold text-gray-700 uppercase">
                      Lista de Correos Electrónicos ({formData.contactEmails ? formData.contactEmails.length : 0})
                    </label>
                    {(!formData.contactEmails || formData.contactEmails.length === 0) && (
                      <p className="text-xs text-gray-400 italic py-2">No hay correos configurados. Haga clic en "+ Agregar Correo".</p>
                    )}
                    {formData.contactEmails && formData.contactEmails.map((email, idx) => (
                      <div key={idx} className="flex items-center gap-2 bg-slate-50 p-2 rounded-xl border border-slate-200">
                        <span className="text-xs font-bold text-gray-400 w-5 text-center shrink-0">#{idx + 1}</span>
                        <input
                          type="email"
                          value={email}
                          placeholder="ventas@moldmaq.com.mx"
                          onChange={(e) => {
                            const newEmails = [...(formData.contactEmails || [])];
                            newEmails[idx] = e.target.value;
                            setFormData({ ...formData, contactEmails: newEmails });
                          }}
                          className="flex-1 px-3 py-1.5 bg-white rounded-lg border border-gray-300 text-sm font-bold focus:ring-2 focus:ring-[#0F3B68]"
                        />
                        <a
                          href={`mailto:${email.trim()}?subject=${encodeURIComponent('Solicitud de Información / Cotización - Moldmaq S.A.')}`}
                          title="Probar enlace mailto:"
                          className="px-2.5 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-800 text-xs font-bold rounded-lg border border-blue-200 shrink-0 transition-colors flex items-center gap-1"
                        >
                          <Mail className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">Probar mailto:</span>
                        </a>
                        <button
                          type="button"
                          onClick={() => {
                            const newEmails = (formData.contactEmails || []).filter((_, i) => i !== idx);
                            setFormData({ ...formData, contactEmails: newEmails });
                          }}
                          title="Eliminar este correo"
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg cursor-pointer shrink-0 transition-colors"
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

                  {/* GESTIÓN DE OPCIONES DEL CAMPO: TIPO DE SERVICIO REQUERIDO */}
                  <div className="pt-3 border-t border-gray-200">
                    <div className="p-4 sm:p-5 bg-slate-50/90 rounded-2xl border border-slate-200 space-y-4">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                              <Layers className="w-4 h-4" />
                            </div>
                            <span className="text-xs font-extrabold text-gray-900 uppercase tracking-wide">
                              Opciones del campo: Tipo de Servicio Requerido
                            </span>
                            {(() => {
                              const services = formData.quoteServiceOptions || DEFAULT_QUOTE_SERVICES;
                              const activeCount = services.filter((s) => s.active !== false).length;
                              return (
                                <span className="text-[11px] px-2.5 py-0.5 rounded-full font-bold bg-blue-100 text-blue-800 border border-blue-200">
                                  {activeCount} activos / {services.length} en lista
                                </span>
                              );
                            })()}
                          </div>
                          <p className="text-xs text-gray-600 mt-1">
                            Edite los servicios que se despliegan en el formulario. Puede <b>modificar el nombre</b>, <b>desactivar</b> para ocultarlo temporalmente sin borrarlo, <b>quitar</b> los que no necesite o <b>agregar</b> nuevos servicios.
                          </p>
                        </div>

                        <div className="flex items-center gap-2 flex-wrap self-stretch sm:self-auto shrink-0">
                          <button
                            type="button"
                            onClick={() => {
                              if (window.confirm('¿Desea restaurar la lista de los 9 servicios estándar de maquinados y moldes?')) {
                                setFormData({
                                  ...formData,
                                  quoteServiceOptions: DEFAULT_QUOTE_SERVICES
                                });
                              }
                            }}
                            title="Restaurar los 9 servicios originales de Moldmaq"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold rounded-xl border border-slate-300 transition-colors shadow-2xs cursor-pointer"
                          >
                            <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
                            <span>Restaurar Predeterminados</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              const current = formData.quoteServiceOptions || DEFAULT_QUOTE_SERVICES;
                              const newItem: QuoteServiceOption = {
                                id: `srv-${Date.now()}`,
                                name: 'Nuevo Servicio Industrial',
                                active: true
                              };
                              setFormData({
                                ...formData,
                                quoteServiceOptions: [...current, newItem]
                              });
                            }}
                            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#0F3B68] hover:bg-slate-900 text-white text-xs font-bold rounded-xl transition-colors shadow-2xs cursor-pointer"
                          >
                            <Plus className="w-4 h-4" />
                            <span>+ Agregar Servicio</span>
                          </button>
                        </div>
                      </div>

                      {/* Lista de Servicios */}
                      <div className="space-y-2.5">
                        {(() => {
                          const services = formData.quoteServiceOptions || DEFAULT_QUOTE_SERVICES;
                          if (services.length === 0) {
                            return (
                              <div className="p-4 bg-white rounded-xl border border-dashed border-gray-300 text-center">
                                <p className="text-xs text-gray-500">No hay servicios en la lista.</p>
                                <button
                                  type="button"
                                  onClick={() => setFormData({ ...formData, quoteServiceOptions: DEFAULT_QUOTE_SERVICES })}
                                  className="mt-2 text-xs text-blue-600 font-bold hover:underline"
                                >
                                  Cargar servicios predeterminados
                                </button>
                              </div>
                            );
                          }

                          return services.map((service, idx) => {
                            const isActive = service.active !== false;
                            return (
                              <div
                                key={service.id || idx}
                                className={`p-3 rounded-xl border transition-all flex flex-col sm:flex-row items-start sm:items-center gap-3 ${
                                  isActive
                                    ? 'bg-white border-slate-200 shadow-2xs'
                                    : 'bg-slate-100/90 border-slate-300/80 opacity-75'
                                }`}
                              >
                                {/* Orden y Posición */}
                                <div className="flex items-center gap-1.5 shrink-0">
                                  <div className="flex flex-col gap-0.5">
                                    <button
                                      type="button"
                                      disabled={idx === 0}
                                      onClick={() => {
                                        if (idx === 0) return;
                                        const updated = [...services];
                                        const temp = updated[idx - 1];
                                        updated[idx - 1] = updated[idx];
                                        updated[idx] = temp;
                                        setFormData({ ...formData, quoteServiceOptions: updated });
                                      }}
                                      title="Subir posición en la lista"
                                      className="p-1 hover:bg-slate-100 disabled:opacity-30 disabled:hover:bg-transparent rounded text-slate-600 cursor-pointer transition-colors"
                                    >
                                      <ArrowUp className="w-3 h-3" />
                                    </button>
                                    <button
                                      type="button"
                                      disabled={idx === services.length - 1}
                                      onClick={() => {
                                        if (idx === services.length - 1) return;
                                        const updated = [...services];
                                        const temp = updated[idx + 1];
                                        updated[idx + 1] = updated[idx];
                                        updated[idx] = temp;
                                        setFormData({ ...formData, quoteServiceOptions: updated });
                                      }}
                                      title="Bajar posición en la lista"
                                      className="p-1 hover:bg-slate-100 disabled:opacity-30 disabled:hover:bg-transparent rounded text-slate-600 cursor-pointer transition-colors"
                                    >
                                      <ArrowDown className="w-3 h-3" />
                                    </button>
                                  </div>
                                  <span className="w-6 h-6 rounded-lg bg-slate-100 text-slate-600 text-xs font-extrabold flex items-center justify-center">
                                    #{idx + 1}
                                  </span>
                                </div>

                                {/* Campo de Texto para Editar el Nombre del Servicio */}
                                <div className="flex-1 w-full min-w-0">
                                  <input
                                    type="text"
                                    value={service.name}
                                    placeholder="Nombre del servicio (Ej. Maquinados CNC de Precisión)"
                                    onChange={(e) => {
                                      const updated = [...services];
                                      updated[idx] = { ...updated[idx], name: e.target.value };
                                      setFormData({ ...formData, quoteServiceOptions: updated });
                                    }}
                                    className={`w-full px-3 py-2 rounded-lg border text-sm font-semibold transition-colors focus:ring-2 focus:ring-[#0F3B68] ${
                                      isActive
                                        ? 'bg-white border-slate-300 text-slate-900'
                                        : 'bg-slate-200/50 border-slate-300 text-slate-600 italic'
                                    }`}
                                  />
                                </div>

                                {/* Controles: Toggle Activar/Desactivar y Eliminar */}
                                <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const updated = [...services];
                                      updated[idx] = { ...updated[idx], active: !isActive };
                                      setFormData({ ...formData, quoteServiceOptions: updated });
                                    }}
                                    title={
                                      isActive
                                        ? 'Haga clic para desactivar (se ocultará en la página web sin borrarse)'
                                        : 'Haga clic para activar (se mostrará en la página web)'
                                    }
                                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer border ${
                                      isActive
                                        ? 'bg-emerald-50 text-emerald-700 border-emerald-300 hover:bg-emerald-100'
                                        : 'bg-amber-50 text-amber-700 border-amber-300 hover:bg-amber-100'
                                    }`}
                                  >
                                    {isActive ? (
                                      <>
                                        <Eye className="w-3.5 h-3.5 text-emerald-600" />
                                        <span>Activo</span>
                                      </>
                                    ) : (
                                      <>
                                        <EyeOff className="w-3.5 h-3.5 text-amber-600" />
                                        <span>Desactivado</span>
                                      </>
                                    )}
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() => {
                                      const updated = services.filter((_, i) => i !== idx);
                                      setFormData({ ...formData, quoteServiceOptions: updated });
                                    }}
                                    title="Quitar este servicio permanentemente"
                                    className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer border border-transparent hover:border-red-200"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </div>
                            );
                          });
                        })()}
                      </div>

                      {/* Vista previa en tiempo real */}
                      <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1.5">
                        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wide block">
                          Vista previa de cómo se mostrará el campo en el formulario de la página:
                        </span>
                        {(() => {
                          const services = formData.quoteServiceOptions || DEFAULT_QUOTE_SERVICES;
                          const activeOnly = services.filter((s) => s.active !== false && s.name && s.name.trim() !== '');
                          return (
                            <select
                              disabled
                              className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-slate-50 text-xs font-medium text-slate-800 cursor-not-allowed"
                            >
                              {activeOnly.map((s, i) => (
                                <option key={i}>{s.name}</option>
                              ))}
                            </select>
                          );
                        })()}
                      </div>
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
                <div className="p-5 bg-linear-to-r from-amber-50 to-orange-50 rounded-2xl border-2 border-amber-400 shadow-sm space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <label className="text-xs font-black text-amber-950 uppercase tracking-wide flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-amber-600" />
                      <span>Título / Encabezado Destacado ("Líderes en Maquinados...")</span>
                    </label>
                    <span className="text-[10px] font-extrabold bg-amber-200 text-amber-900 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                      Texto Principal de Nosotros
                    </span>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-amber-900 mb-1">
                      Texto del Título (Aparece en letras grandes arriba de la descripción):
                    </label>
                    <input
                      type="text"
                      value={formData.aboutHeadline ?? 'Líderes en Maquinados CNC, Fabricación de Moldes y Soluciones Industriales'}
                      onChange={(e) => setFormData({ ...formData, aboutHeadline: e.target.value })}
                      placeholder="Líderes en Maquinados CNC, Fabricación de Moldes y Soluciones Industriales"
                      className="w-full px-4 py-3 rounded-xl border-2 border-amber-400 bg-white text-base font-extrabold text-gray-900 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 shadow-xs"
                    />
                  </div>
                  
                  <div className="pt-1">
                    <ColorPickerInput
                      label="Color del Título 'Líderes en Maquinados...'"
                      value={formData.aboutHeadlineColor}
                      defaultColor="#0F3B68"
                      onChange={(val) => setFormData({ ...formData, aboutHeadlineColor: val })}
                      description="Modifique el color del texto de este encabezado destacado"
                    />
                  </div>

                  <p className="text-xs text-amber-900/90 font-medium leading-relaxed bg-amber-100/70 p-2.5 rounded-lg border border-amber-300/60">
                    💡 <b>Edición en vivo:</b> Modifique tanto el texto como el color de las letras del título destacado. Se actualiza inmediatamente en la sección "Nosotros" de su página web.
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

          {/* TAB 8: 🦶 PIE DE PÁGINA & REDES */}
          {activeTab === 'footer' && (
            <div className="space-y-6">
              {/* Header Banner */}
              <div className="bg-linear-to-r from-slate-900 to-blue-950 text-white p-6 rounded-2xl shadow-md border border-slate-800 space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <h3 className="font-extrabold text-lg flex items-center gap-2">
                      <FileText className="w-5 h-5 text-blue-400" />
                      <span>Edición del Pie de Página (Footer)</span>
                    </h3>
                    <p className="text-xs text-slate-300 leading-relaxed max-w-2xl">
                      Configure todos los textos descriptivos, títulos de columnas, texto legal de derechos de autor y personalice todos los colores del pie de página.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleSave}
                    className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-md transition-all shrink-0 cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    <span>Guardar Cambios</span>
                  </button>
                </div>
              </div>

              {/* 1. Textos del Pie de Página */}
              <div className="bg-gray-50 p-5 rounded-2xl border border-gray-200 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-extrabold text-sm text-gray-900 flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
                    <span>1. Textos y Columnas del Pie de Página</span>
                  </h4>
                  <span className="text-[11px] font-bold bg-blue-100 text-[#0F3B68] px-2.5 py-0.5 rounded-full">Contenido</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                      Título Columna de Navegación
                    </label>
                    <input
                      type="text"
                      value={formData.footerNavTitle || ''}
                      onChange={(e) => setFormData({ ...formData, footerNavTitle: e.target.value })}
                      placeholder="Navegación"
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm font-semibold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                      Título Columna de Ubicación / Planta
                    </label>
                    <input
                      type="text"
                      value={formData.footerPlantTitle || ''}
                      onChange={(e) => setFormData({ ...formData, footerPlantTitle: e.target.value })}
                      placeholder="Nuestra Planta"
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm font-semibold"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                      Descripción de la Empresa en el Pie
                    </label>
                    <textarea
                      rows={2}
                      value={formData.footerDescription || ''}
                      onChange={(e) => setFormData({ ...formData, footerDescription: e.target.value })}
                      placeholder="Especialistas en maquinado CNC de alta precisión, pailería, corte con plasma y fabricación de piezas industriales bajo los más estrictos estándares de calidad."
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                      Texto del Botón de WhatsApp en Pie
                    </label>
                    <input
                      type="text"
                      value={formData.footerWaButtonText || ''}
                      onChange={(e) => setFormData({ ...formData, footerWaButtonText: e.target.value })}
                      placeholder="Contactar por WhatsApp"
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm font-semibold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                      Texto Legal de Derechos Reservados (Copyright)
                    </label>
                    <input
                      type="text"
                      value={formData.footerCopyrightText || ''}
                      onChange={(e) => setFormData({ ...formData, footerCopyrightText: e.target.value })}
                      placeholder="© 2025 Servicios Industriales Moldmaq S.A. de C.V. Todos los derechos reservados."
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* 2. Colores del Pie de Página */}
              <div className="bg-gray-50 p-5 rounded-2xl border border-gray-200 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-extrabold text-sm text-gray-900 flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-purple-600"></span>
                    <span>2. Colores del Pie de Página</span>
                  </h4>
                  <span className="text-[11px] font-bold bg-purple-100 text-purple-900 px-2.5 py-0.5 rounded-full">Estilos</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  <ColorPickerInput
                    label="Fondo del Pie de Página"
                    value={formData.footerBgColor}
                    defaultColor="#0B132B"
                    onChange={(val) => setFormData({ ...formData, footerBgColor: val })}
                  />
                  <ColorPickerInput
                    label="Encabezados de Columnas"
                    value={formData.footerHeadingsColor}
                    defaultColor="#ffffff"
                    onChange={(val) => setFormData({ ...formData, footerHeadingsColor: val })}
                  />
                  <ColorPickerInput
                    label="Textos y Enlaces del Pie"
                    value={formData.footerTextColor}
                    defaultColor="#94a3b8"
                    onChange={(val) => setFormData({ ...formData, footerTextColor: val })}
                  />
                  <ColorPickerInput
                    label="Color de Acentos & Íconos"
                    value={formData.footerAccentColor}
                    defaultColor="#D97706"
                    onChange={(val) => setFormData({ ...formData, footerAccentColor: val })}
                  />
                  <ColorPickerInput
                    label="Botón WhatsApp (Fondo)"
                    value={formData.footerWaButtonBgColor}
                    defaultColor="#25D366"
                    onChange={(val) => setFormData({ ...formData, footerWaButtonBgColor: val })}
                  />
                  <ColorPickerInput
                    label="Botón WhatsApp (Texto)"
                    value={formData.footerWaButtonTextColor}
                    defaultColor="#ffffff"
                    onChange={(val) => setFormData({ ...formData, footerWaButtonTextColor: val })}
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 9: SUPABASE DATABASE */}
          {activeTab === 'supabase' && (
            <div className="space-y-6">
              <div className="bg-emerald-50/80 p-5 rounded-2xl border border-emerald-200 space-y-3">
                <div className="flex items-center gap-2 text-emerald-900 font-extrabold text-base">
                  <Database className="w-5 h-5 text-[#1D7946]" />
                  <span>Configuración de Base de Datos y Sincronización Global</span>
                </div>
                <p className="text-xs text-emerald-800 leading-relaxed font-medium">
                  Al ejecutar el script SQL en su proyecto de Supabase, <strong>todos los cambios que guarde (textos, teléfonos, servicios, imágenes y colores) se guardarán en la nube de forma global</strong>. Cualquier usuario en cualquier computadora o teléfono móvil verá exactamente la información actualizada en vivo.
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
                      value={currentProjectId}
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
                    placeholder={`https://${currentProjectId}.supabase.co`}
                    value={formData.supabaseUrl}
                    onChange={(e) => setFormData({ ...formData, supabaseUrl: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                    Supabase Anon Key (API Key Pública)
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

              {/* Guía y Código SQL de Inicialización */}
              <div className="bg-blue-50/70 p-5 rounded-2xl border border-blue-200 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-2 text-[#0E5197] font-extrabold text-sm uppercase tracking-wide">
                    <Sparkles className="w-4 h-4 text-[#0E5197]" />
                    <span>Script SQL para Sincronización Global (Copiar en Supabase)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleCopySql}
                      className="inline-flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold px-3 py-1.5 rounded-lg text-xs transition-all shadow-xs cursor-pointer"
                    >
                      {copiedSql ? (
                        <>
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                          <span>¡Copiado!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 text-blue-400" />
                          <span>Copiar SQL</span>
                        </>
                      )}
                    </button>
                    <a
                      href={`https://supabase.com/dashboard/project/${currentProjectId}/sql/new`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white font-bold px-3 py-1.5 rounded-lg text-xs transition-all shadow-xs"
                    >
                      <span>Abrir SQL Editor ↗</span>
                    </a>
                  </div>
                </div>
                <p className="text-xs text-blue-900 leading-relaxed font-normal">
                  Vaya al <strong>SQL Editor</strong> de su proyecto en Supabase (ID: <code>{currentProjectId}</code>), cree una nueva consulta (<i>New Query</i>), pegue este código y presione <strong>Run</strong>:
                </p>
                <div className="relative">
                  <pre className="bg-slate-900 text-emerald-300 p-4 rounded-xl text-[11px] font-mono overflow-x-auto leading-relaxed max-h-[350px]">
{SUPABASE_SQL_SETUP}
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
