import type { CVData } from '@/lib';
import { supabase } from '@/services/api';

// ─── Types ───────────────────────────────────────────────

export interface CVVersion {
  id: string;
  versionName: string;
  isPrimary: boolean;
  locale: 'en' | 'ar';
  template: string;
  themeColor: string;
  updatedAt: string;
}

export interface CVVersionFull extends CVVersion {
  data: CVData;
}

// ─── Local Storage Keys ──────────────────────────────────

const LS_PREFIX = 'cv_versions_';
const LS_ACTIVE = 'cv_active_version';

function lsKey(userId: string): string {
  return `${LS_PREFIX}${userId}`;
}

// ─── Supabase CRUD ───────────────────────────────────────

export async function fetchAllVersions(userId: string): Promise<CVVersionFull[]> {
  const { data, error } = await supabase
    .from('cvs')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: true });

  if (error) throw error;

  return (data ?? []).map(mapRowToVersion);
}

export async function fetchPrimaryVersion(userId: string): Promise<CVVersionFull | null> {
  const { data, error } = await supabase
    .from('cvs')
    .select('*')
    .eq('user_id', userId)
    .eq('is_primary', true)
    .maybeSingle();

  if (error) throw error;
  return data ? mapRowToVersion(data) : null;
}

import { PROFILE_STATIC, EXPERIENCE_EN, EXPERIENCE_AR, SKILLS_EN, PROJECTS_EN, PROJECTS_AR } from '@/lib/data-static';

export function buildDefaultCVData(locale: 'en' | 'ar' = 'ar'): CVData {
  const isAr = locale === 'ar';
  return {
    id: 'default-primary',
    user_id: 'public',
    locale,
    sections: [
      {
        id: 'header',
        type: 'header',
        title: 'Header',
        enabled: true,
        order: 0,
        data: {
          name: PROFILE_STATIC.name,
          title_en: PROFILE_STATIC.title_en,
          title_ar: PROFILE_STATIC.title_ar,
          email: PROFILE_STATIC.email,
          phone: '',
          location: PROFILE_STATIC.location,
          linkedin: PROFILE_STATIC.linkedin_url ?? '',
          github: PROFILE_STATIC.github_url ?? '',
          website: '',
        },
      },
      {
        id: 'summary',
        type: 'summary',
        title: 'Summary',
        enabled: true,
        order: 1,
        data: {
          summary_en: PROFILE_STATIC.bio_en,
          summary_ar: PROFILE_STATIC.bio_ar,
        },
      },
      {
        id: 'experience',
        type: 'experience',
        title: 'Experience',
        enabled: true,
        order: 2,
        data: {
          items: EXPERIENCE_EN.map((e, idx) => {
            const ar = EXPERIENCE_AR[idx];
            const parts = (e.year || '').split(' - ');
            const end = parts[1];
            const current = end?.toLowerCase() === 'present' || end?.includes('الآن');
            return {
              id: e.id || crypto.randomUUID(),
              role: e.title,
              company: e.company,
              start_date: parts[0] || '',
              end_date: current ? '' : (end || ''),
              current,
              description_en: e.description,
              description_ar: ar?.description || e.description,
              achievements_en: Array.isArray(e.achievements) ? e.achievements : [],
              achievements_ar: Array.isArray(ar?.achievements) ? ar.achievements : (e.achievements || []),
              technologies: [],
            };
          }),
        },
      },
      {
        id: 'skills',
        type: 'skills',
        title: 'Skills',
        enabled: true,
        order: 3,
        data: {
          skill_categories: SKILLS_EN.map((s) => ({
            id: s.id || crypto.randomUUID(),
            name: s.category,
            skills: Array.isArray(s.technologies) ? s.technologies : [],
          })),
        },
      },
      {
        id: 'projects',
        type: 'projects',
        title: 'Projects',
        enabled: true,
        order: 4,
        data: {
          project_items: PROJECTS_EN.map((p, idx) => {
            const ar = PROJECTS_AR[idx];
            return {
              id: p.id || crypto.randomUUID(),
              name: p.title,
              description_en: p.solution,
              description_ar: ar?.solution || p.solution,
              technologies: Array.isArray(p.technologies) ? p.technologies : [],
              url: p.link_url || '',
              github_url: 'https://github.com/Monther-alhamadi',
            };
          }),
        },
      },
    ],
    template: 'modern',
    settings: {
      theme_color: '#10b981',
      font_family: 'inter',
      font_size: 'base',
      spacing: 'normal',
      show_icons: true,
      show_borders: true,
      rtl: isAr,
    },
  };
}

export async function fetchPublicPrimaryCV(preferredLocale: 'en' | 'ar' = 'ar'): Promise<CVData> {
  try {
    // 1. Try to fetch explicit primary version
    const { data: primaryData, error: primaryErr } = await supabase
      .from('cvs')
      .select('*')
      .eq('is_primary', true)
      .limit(1)
      .maybeSingle();

    if (!primaryErr && primaryData) {
      return {
        id: primaryData.id,
        user_id: primaryData.user_id,
        locale: primaryData.locale || 'ar',
        sections: primaryData.sections || [],
        template: primaryData.template || 'modern',
        settings: primaryData.settings || {},
        created_at: primaryData.created_at,
        updated_at: primaryData.updated_at,
      };
    }

    // 2. Fallback: try to fetch the most recent CV version
    const { data: latestData, error: latestErr } = await supabase
      .from('cvs')
      .select('*')
      .order('updated_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (!latestErr && latestData) {
      return {
        id: latestData.id,
        user_id: latestData.user_id,
        locale: latestData.locale || 'ar',
        sections: latestData.sections || [],
        template: latestData.template || 'modern',
        settings: latestData.settings || {},
        created_at: latestData.created_at,
        updated_at: latestData.updated_at,
      };
    }
  } catch (err) {
    console.warn('Error fetching public primary CV:', err);
  }

  // 3. Fallback: build default dynamic CV matching portfolio DB
  return buildDefaultCVData(preferredLocale);
}

export async function saveVersion(userId: string, cv: CVData, versionName: string, isPrimary: boolean): Promise<CVVersionFull> {
  // If setting as primary, unset existing primary first
  if (isPrimary) {
    await supabase
      .from('cvs')
      .update({ is_primary: false })
      .eq('user_id', userId)
      .eq('is_primary', true);
  }

  const payload = {
    user_id: userId,
    locale: cv.locale,
    sections: cv.sections,
    template: cv.template,
    settings: cv.settings,
    version_name: versionName,
    is_primary: isPrimary,
    updated_at: new Date().toISOString(),
  };

  if (cv.id) {
    // Update existing
    const { data, error } = await supabase
      .from('cvs')
      .update(payload)
      .eq('id', cv.id)
      .select()
      .single();

    if (error) throw error;
    return mapRowToVersion(data);
  }

  // Insert new
  const { data, error } = await supabase
    .from('cvs')
    .insert(payload)
    .select()
    .single();

  if (error) throw error;
  return mapRowToVersion(data);
}

export async function deleteVersion(versionId: string): Promise<void> {
  const { error } = await supabase
    .from('cvs')
    .delete()
    .eq('id', versionId);

  if (error) throw error;
}

export async function setPrimary(userId: string, versionId: string): Promise<void> {
  // Unset all existing primaries for this user
  await supabase
    .from('cvs')
    .update({ is_primary: false })
    .eq('user_id', userId)
    .eq('is_primary', true);

  // Set the new primary
  const { error } = await supabase
    .from('cvs')
    .update({ is_primary: true })
    .eq('id', versionId);

  if (error) throw error;
}

export async function duplicateVersion(
  userId: string,
  sourceId: string,
  newName: string,
): Promise<CVVersionFull> {
  const { data: source, error: fetchError } = await supabase
    .from('cvs')
    .select('*')
    .eq('id', sourceId)
    .single();

  if (fetchError || !source) throw fetchError ?? new Error('Source version not found');

  const { data, error } = await supabase
    .from('cvs')
    .insert({
      user_id: userId,
      locale: source.locale,
      sections: source.sections,
      template: source.template,
      settings: source.settings,
      version_name: newName,
      is_primary: false,
    })
    .select()
    .single();

  if (error) throw error;
  return mapRowToVersion(data);
}

// ─── Local Storage Helpers ───────────────────────────────

export function cacheVersionsLocally(userId: string, versions: CVVersionFull[]): void {
  try {
    const summary = versions.map((v) => ({
      id: v.id,
      versionName: v.versionName,
      isPrimary: v.isPrimary,
      locale: v.locale,
      template: v.template,
      themeColor: v.themeColor,
      updatedAt: v.updatedAt,
    }));
    localStorage.setItem(lsKey(userId), JSON.stringify(summary));
  } catch {
    // localStorage may be full or unavailable
  }
}

export function getCachedVersionList(userId: string): CVVersion[] {
  try {
    const raw = localStorage.getItem(lsKey(userId));
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function setActiveVersionId(versionId: string): void {
  try {
    localStorage.setItem(LS_ACTIVE, versionId);
  } catch {
    // ignore
  }
}

export function getActiveVersionId(): string | null {
  try {
    return localStorage.getItem(LS_ACTIVE);
  } catch {
    return null;
  }
}

// ─── Row Mapper ──────────────────────────────────────────

function mapRowToVersion(row: Record<string, unknown>): CVVersionFull {
  const sections = Array.isArray(row.sections) ? row.sections : [];
  const settings = (row.settings && typeof row.settings === 'object') ? row.settings : {};

  const cvData: CVData = {
    id: row.id as string,
    user_id: row.user_id as string,
    locale: (row.locale as 'en' | 'ar') ?? 'en',
    sections: sections as CVData['sections'],
    template: (row.template as CVData['template']) ?? 'modern',
    settings: settings as CVData['settings'],
    created_at: row.created_at as string,
    updated_at: row.updated_at as string,
  };

  return {
    id: row.id as string,
    versionName: (row.version_name as string) ?? 'Default',
    isPrimary: (row.is_primary as boolean) ?? false,
    locale: cvData.locale,
    template: cvData.template,
    themeColor: cvData.settings.theme_color ?? '#10b981',
    updatedAt: (row.updated_at as string) ?? '',
    data: cvData,
  };
}
