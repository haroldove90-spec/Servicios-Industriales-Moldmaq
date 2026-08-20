import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { SiteConfig } from '../types';
import { DEFAULT_SITE_CONFIG } from './defaultData';

const LOCAL_STORAGE_KEY = 'moldmaq_site_config_v4';

let supabaseInstance: SupabaseClient | null = null;

export function cleanSupabaseUrl(url?: string): string {
  if (!url) return '';
  return url.trim().replace(/\/rest\/v1\/?$/i, '').replace(/\/+$/, '');
}

export function getSupabaseClient(url?: string, key?: string): SupabaseClient | null {
  const sanitizedUrl = cleanSupabaseUrl(url);
  if (sanitizedUrl && key) {
    try {
      return createClient(sanitizedUrl, key);
    } catch (e) {
      console.error('Error initializing Supabase client:', e);
      return null;
    }
  }
  return supabaseInstance;
}

// Check if a config object is stale / contains old Vazquez texts
function isStaleVazquezConfig(cfg: any): boolean {
  if (!cfg) return true;
  const str = JSON.stringify(cfg).toLowerCase();
  return str.includes('vazquez') || str.includes('multitransport');
}

// Load config from LocalStorage first, fallback to DEFAULT_SITE_CONFIG
export function loadSiteConfig(): SiteConfig {
  try {
    // Clear old deprecated keys
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem('vazquez_multitransport_config_v1');
      localStorage.removeItem('moldmaq_site_config_v1');
      localStorage.removeItem('moldmaq_site_config_v2');
      
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (isStaleVazquezConfig(parsed)) {
          localStorage.removeItem(LOCAL_STORAGE_KEY);
          return DEFAULT_SITE_CONFIG;
        }
        return { ...DEFAULT_SITE_CONFIG, ...parsed };
      }
    }
  } catch (e) {
    console.error('Error loading config from localStorage:', e);
  }
  return DEFAULT_SITE_CONFIG;
}

// Fetch remote config from Supabase if configured
export async function loadSiteConfigFromSupabase(config: SiteConfig): Promise<SiteConfig | null> {
  const sanitizedUrl = cleanSupabaseUrl(config.supabaseUrl);
  if (!sanitizedUrl || !config.supabaseAnonKey) return null;

  try {
    const client = createClient(sanitizedUrl, config.supabaseAnonKey);
    const { data, error } = await client
      .from('site_config')
      .select('content')
      .eq('id', 'main_config')
      .maybeSingle();

    if (!error && data?.content) {
      if (isStaleVazquezConfig(data.content)) {
        console.info('Remote Supabase config was outdated. Migrating to Moldmaq S.A.');
        await syncToSupabase(DEFAULT_SITE_CONFIG);
        return DEFAULT_SITE_CONFIG;
      }
      return { ...DEFAULT_SITE_CONFIG, ...data.content };
    }
  } catch (e) {
    console.warn('Could not load site_config from Supabase:', e);
  }
  return null;
}

// Save config to LocalStorage and sync CSS colors
export function saveSiteConfig(config: SiteConfig): void {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(config));
    applyThemeColors(config.primaryColor, config.secondaryColor);
  } catch (e) {
    console.error('Error saving config to localStorage:', e);
  }
}

// Apply CSS root variables dynamically for instant live color changes
export function applyThemeColors(primary: string, secondary: string): void {
  if (typeof document !== 'undefined') {
    const root = document.documentElement;
    root.style.setProperty('--primary-color', primary || '#0F3B68');
    root.style.setProperty('--secondary-color', secondary || '#D97706');
  }
}

// Optional Supabase DB Sync helper
export async function syncToSupabase(config: SiteConfig): Promise<{ success: boolean; message: string }> {
  const sanitizedUrl = cleanSupabaseUrl(config.supabaseUrl);
  if (!sanitizedUrl || !config.supabaseAnonKey) {
    return { success: false, message: 'Falta configurar la URL y Anon Key de Supabase.' };
  }

  try {
    const client = createClient(sanitizedUrl, config.supabaseAnonKey);
    const { error } = await client
      .from('site_config')
      .upsert({ id: 'main_config', content: config, updated_at: new Date().toISOString() });

    if (error) {
      if (error.message.includes('site_config') || error.code === 'PGRST301' || error.message.includes('cache')) {
        return {
          success: false,
          message: `No se encontró la tabla 'public.site_config' en Supabase. Debes ejecutar el script SQL de creación en Supabase SQL Editor.`
        };
      }
      return { success: false, message: `Error en Supabase: ${error.message}` };
    }

    return { success: true, message: '¡Configuración guardada correctamente en Supabase!' };
  } catch (err: any) {
    return { success: false, message: `Error de conexión con Supabase: ${err?.message || err}` };
  }
}

// Optional Supabase Image Upload helper with base64 data-URL fallback
export async function uploadImageFile(
  file: File, 
  config: SiteConfig
): Promise<string> {
  const sanitizedUrl = cleanSupabaseUrl(config.supabaseUrl);
  // If Supabase is configured and storage is enabled
  if (config.useSupabaseStorage && sanitizedUrl && config.supabaseAnonKey) {
    try {
      const client = createClient(sanitizedUrl, config.supabaseAnonKey);
      const fileExt = file.name.split('.').pop() || 'png';
      const fileName = `img_${Date.now()}_${Math.random().toString(36).substring(2, 7)}.${fileExt}`;
      const filePath = `uploads/${fileName}`;
      const bucketName = config.supabaseBucketName || 'moldmaq-media';

      const { error: uploadError } = await client.storage
        .from(bucketName)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (!uploadError) {
        const { data } = client.storage
          .from(bucketName)
          .getPublicUrl(filePath);

        if (data?.publicUrl) {
          return data.publicUrl;
        }
      } else {
        console.warn('Supabase Storage error:', uploadError.message);
      }
    } catch (e) {
      console.warn('Supabase upload failed, falling back to base64 DataURL', e);
    }
  }

  // Fallback: convert file to Base64 Data URL so it uploads immediately and displays locally
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
}
