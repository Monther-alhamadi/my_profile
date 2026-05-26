import { supabase } from './api';
import type {
  Language, Project, Skill, Service, Experience,
  Stat, Testimonial, ContactMessage, ProfileData,
} from '@/lib';

function localeFilter<T extends { locale: string }>(data: T[], locale: Language): T[] {
  return data.filter(item => item.locale === locale);
}

// ── Fetch (public) ──

export async function fetchProjects(locale: Language): Promise<Project[]> {
  const { data, error } = await supabase
    .from('projects').select('*').order('sort_order', { ascending: true });
  if (error) throw error;
  return localeFilter(data as Project[], locale);
}

export async function fetchSkills(locale: Language): Promise<Skill[]> {
  const { data, error } = await supabase
    .from('skills').select('*').order('sort_order', { ascending: true });
  if (error) throw error;
  return localeFilter(data as Skill[], locale);
}

export async function fetchServices(locale: Language): Promise<Service[]> {
  const { data, error } = await supabase
    .from('services').select('*').order('sort_order', { ascending: true });
  if (error) throw error;
  return localeFilter(data as Service[], locale);
}

export async function fetchExperience(locale: Language): Promise<Experience[]> {
  const { data, error } = await supabase
    .from('experience').select('*').order('sort_order', { ascending: true });
  if (error) throw error;
  return localeFilter(data as Experience[], locale);
}

export async function fetchStats(locale: Language): Promise<Stat[]> {
  const { data, error } = await supabase
    .from('stats').select('*').order('sort_order', { ascending: true });
  if (error) throw error;
  return localeFilter(data as Stat[], locale);
}

export async function fetchTestimonials(locale: Language): Promise<Testimonial[]> {
  const { data, error } = await supabase
    .from('testimonials').select('*').order('sort_order', { ascending: true });
  if (error) throw error;
  return localeFilter(data as Testimonial[], locale);
}

export async function fetchProfile(): Promise<ProfileData | null> {
  const { data, error } = await supabase.from('profile').select('*').limit(1).single();
  if (error) throw error;
  return data as ProfileData;
}

// ── Contact (public insert / authenticated read+update+delete) ──

let lastSubmission = 0
const MIN_INTERVAL_MS = 30_000

export async function submitContact(fields: {
  name: string; email: string; projectType: string; message: string;
  _hp?: string; _t?: number;
}): Promise<{ success: boolean }> {
  if (fields._hp) throw new Error('Spam detected')
  if (!fields._t || Date.now() - fields._t < 3000) throw new Error('Submission too fast')
  const now = Date.now()
  if (now - lastSubmission < MIN_INTERVAL_MS) throw new Error('Please wait 30 seconds before sending another message')
  lastSubmission = now
  const { error } = await supabase.from('contact_messages').insert({
    name: fields.name, email: fields.email,
    subject: fields.projectType !== 'none' ? fields.projectType : null,
    message_type: fields.projectType !== 'none' ? fields.projectType : null,
    message: fields.message,
  });
  if (error) throw error;
  return { success: true };
}

export async function fetchMessages(): Promise<ContactMessage[]> {
  const { data, error } = await supabase
    .from('contact_messages').select('*').order('created_at', { ascending: false });
  if (error) throw error;
  return data as ContactMessage[];
}

export async function markMessageRead(id: string, isRead: boolean): Promise<void> {
  const { error } = await supabase
    .from('contact_messages').update({ is_read: isRead }).eq('id', id);
  if (error) throw error;
}

export async function deleteMessage(id: string): Promise<void> {
  const { error } = await supabase
    .from('contact_messages').delete().eq('id', id);
  if (error) throw error;
}

// ── CRUD: Projects ──

export async function createProject(project: Partial<Project> & { id: string; locale: string }): Promise<void> {
  const { error } = await supabase.from('projects').insert({
    id: project.id, locale: project.locale,
    sort_order: project.sort_order ?? 0, number: project.number ?? '',
    title: project.title ?? '', category: project.category ?? '',
    problem: project.problem ?? '', solution: project.solution ?? '',
    complexity: project.complexity ?? 'High',
    technologies: JSON.stringify(project.technologies ?? []),
    highlights: JSON.stringify(project.highlights ?? []),
    image_url: project.image_url ?? null,
    link_url: project.link_url ?? null,
  });
  if (error) throw error;
}

export async function updateProject(id: string, locale: string, updates: Partial<Project>): Promise<void> {
  const payload: Record<string, unknown> = {};
  if (updates.title !== undefined) payload.title = updates.title;
  if (updates.category !== undefined) payload.category = updates.category;
  if (updates.problem !== undefined) payload.problem = updates.problem;
  if (updates.solution !== undefined) payload.solution = updates.solution;
  if (updates.complexity !== undefined) payload.complexity = updates.complexity;
  if (updates.number !== undefined) payload.number = updates.number;
  if (updates.sort_order !== undefined) payload.sort_order = updates.sort_order;
  if (updates.technologies !== undefined) payload.technologies = JSON.stringify(updates.technologies);
  if (updates.highlights !== undefined) payload.highlights = JSON.stringify(updates.highlights);
  if (updates.image_url !== undefined) payload.image_url = updates.image_url;
  if (updates.link_url !== undefined) payload.link_url = updates.link_url;
  const { error } = await supabase.from('projects').update(payload).eq('id', id).eq('locale', locale);
  if (error) throw error;
}

export async function deleteProject(id: string, locale: string): Promise<void> {
  const { error } = await supabase.from('projects').delete().eq('id', id).eq('locale', locale);
  if (error) throw error;
}

// ── CRUD: Skills ──

export async function createSkill(skill: Partial<Skill>): Promise<void> {
  const { error } = await supabase.from('skills').insert({
    locale: skill.locale ?? 'en', sort_order: skill.sort_order ?? 0,
    category: skill.category ?? '', icon: skill.icon ?? '',
    description: skill.description ?? '',
    technologies: JSON.stringify(skill.technologies ?? []),
  });
  if (error) throw error;
}

export async function updateSkill(id: string, updates: Partial<Skill>): Promise<void> {
  const payload: Record<string, unknown> = {};
  if (updates.category !== undefined) payload.category = updates.category;
  if (updates.icon !== undefined) payload.icon = updates.icon;
  if (updates.description !== undefined) payload.description = updates.description;
  if (updates.sort_order !== undefined) payload.sort_order = updates.sort_order;
  if (updates.technologies !== undefined) payload.technologies = JSON.stringify(updates.technologies);
  if (updates.locale !== undefined) payload.locale = updates.locale;
  const { error } = await supabase.from('skills').update(payload).eq('id', id);
  if (error) throw error;
}

export async function deleteSkill(id: string): Promise<void> {
  const { error } = await supabase.from('skills').delete().eq('id', id);
  if (error) throw error;
}

// ── CRUD: Services ──

export async function createService(service: Partial<Service> & { id: string; locale: string }): Promise<void> {
  const { error } = await supabase.from('services').insert({
    id: service.id, locale: service.locale, sort_order: service.sort_order ?? 0,
    icon: service.icon ?? '', title: service.title ?? '',
    description: service.description ?? '', pricing: service.pricing ?? '',
    features: JSON.stringify(service.features ?? []),
  });
  if (error) throw error;
}

export async function updateService(id: string, locale: string, updates: Partial<Service>): Promise<void> {
  const payload: Record<string, unknown> = {};
  if (updates.icon !== undefined) payload.icon = updates.icon;
  if (updates.title !== undefined) payload.title = updates.title;
  if (updates.description !== undefined) payload.description = updates.description;
  if (updates.pricing !== undefined) payload.pricing = updates.pricing;
  if (updates.sort_order !== undefined) payload.sort_order = updates.sort_order;
  if (updates.features !== undefined) payload.features = JSON.stringify(updates.features);
  const { error } = await supabase.from('services').update(payload).eq('id', id).eq('locale', locale);
  if (error) throw error;
}

export async function deleteService(id: string, locale: string): Promise<void> {
  const { error } = await supabase.from('services').delete().eq('id', id).eq('locale', locale);
  if (error) throw error;
}

// ── CRUD: Experience ──

export async function createExperience(exp: Partial<Experience> & { id: string; locale: string }): Promise<void> {
  const { error } = await supabase.from('experience').insert({
    id: exp.id, locale: exp.locale, sort_order: exp.sort_order ?? 0,
    year: exp.year ?? '', title: exp.title ?? '',
    company: exp.company ?? '', description: exp.description ?? '',
    achievements: JSON.stringify(exp.achievements ?? []),
  });
  if (error) throw error;
}

export async function updateExperience(id: string, locale: string, updates: Partial<Experience>): Promise<void> {
  const payload: Record<string, unknown> = {};
  if (updates.year !== undefined) payload.year = updates.year;
  if (updates.title !== undefined) payload.title = updates.title;
  if (updates.company !== undefined) payload.company = updates.company;
  if (updates.description !== undefined) payload.description = updates.description;
  if (updates.sort_order !== undefined) payload.sort_order = updates.sort_order;
  if (updates.achievements !== undefined) payload.achievements = JSON.stringify(updates.achievements);
  const { error } = await supabase.from('experience').update(payload).eq('id', id).eq('locale', locale);
  if (error) throw error;
}

export async function deleteExperience(id: string, locale: string): Promise<void> {
  const { error } = await supabase.from('experience').delete().eq('id', id).eq('locale', locale);
  if (error) throw error;
}

// ── CRUD: Stats ──

export async function createStat(stat: Partial<Stat> & { id: string; locale: string }): Promise<void> {
  const { error } = await supabase.from('stats').insert({
    id: stat.id, locale: stat.locale, sort_order: stat.sort_order ?? 0,
    value: stat.value ?? '', label: stat.label ?? '', suffix: stat.suffix ?? null,
  });
  if (error) throw error;
}

export async function updateStat(id: string, locale: string, updates: Partial<Stat>): Promise<void> {
  const payload: Record<string, unknown> = {};
  if (updates.value !== undefined) payload.value = updates.value;
  if (updates.label !== undefined) payload.label = updates.label;
  if (updates.suffix !== undefined) payload.suffix = updates.suffix;
  if (updates.sort_order !== undefined) payload.sort_order = updates.sort_order;
  const { error } = await supabase.from('stats').update(payload).eq('id', id).eq('locale', locale);
  if (error) throw error;
}

export async function deleteStat(id: string, locale: string): Promise<void> {
  const { error } = await supabase.from('stats').delete().eq('id', id).eq('locale', locale);
  if (error) throw error;
}

// ── CRUD: Testimonials ──

export async function createTestimonial(test: Partial<Testimonial> & { id: string; locale: string }): Promise<void> {
  const { error } = await supabase.from('testimonials').insert({
    id: test.id, locale: test.locale, sort_order: test.sort_order ?? 0,
    name: test.name ?? '', role: test.role ?? '',
    company: test.company ?? '', content: test.content ?? '',
    rating: test.rating ?? 5, avatar_url: test.avatar_url ?? null,
  });
  if (error) throw error;
}

export async function updateTestimonial(id: string, locale: string, updates: Partial<Testimonial>): Promise<void> {
  const payload: Record<string, unknown> = {};
  if (updates.name !== undefined) payload.name = updates.name;
  if (updates.role !== undefined) payload.role = updates.role;
  if (updates.company !== undefined) payload.company = updates.company;
  if (updates.content !== undefined) payload.content = updates.content;
  if (updates.rating !== undefined) payload.rating = updates.rating;
  if (updates.sort_order !== undefined) payload.sort_order = updates.sort_order;
  if (updates.avatar_url !== undefined) payload.avatar_url = updates.avatar_url;
  const { error } = await supabase.from('testimonials').update(payload).eq('id', id).eq('locale', locale);
  if (error) throw error;
}

export async function deleteTestimonial(id: string, locale: string): Promise<void> {
  const { error } = await supabase.from('testimonials').delete().eq('id', id).eq('locale', locale);
  if (error) throw error;
}

// ── CRUD: Profile ──

export async function updateProfile(id: string, updates: Partial<ProfileData>): Promise<void> {
  const payload: Record<string, unknown> = {};
  if (updates.name !== undefined) payload.name = updates.name;
  if (updates.title_en !== undefined) payload.title_en = updates.title_en;
  if (updates.title_ar !== undefined) payload.title_ar = updates.title_ar;
  if (updates.bio_en !== undefined) payload.bio_en = updates.bio_en;
  if (updates.bio_ar !== undefined) payload.bio_ar = updates.bio_ar;
  if (updates.location !== undefined) payload.location = updates.location;
  if (updates.email !== undefined) payload.email = updates.email;
  if (updates.avatar_url !== undefined) payload.avatar_url = updates.avatar_url;
  if (updates.github_url !== undefined) payload.github_url = updates.github_url;
  if (updates.linkedin_url !== undefined) payload.linkedin_url = updates.linkedin_url;
  if (updates.facebook_url !== undefined) payload.facebook_url = updates.facebook_url;
  if (updates.cv_url !== undefined) payload.cv_url = updates.cv_url;
  const { error } = await supabase.from('profile').update(payload).eq('id', id);
  if (error) throw error;
}

// ── Reorder ──

export async function reorderItems(
  table: string,
  items: { id: string; sort_order: number; locale?: string }[],
): Promise<void> {
  const promises = items.map(item => {
    const base = supabase.from(table as never).update({ sort_order: item.sort_order }).eq('id', item.id);
    if (item.locale) base.eq('locale', item.locale);
    return base;
  });
  const results = await Promise.all(promises);
  for (const result of results) {
    if (result.error) throw result.error;
  }
}
