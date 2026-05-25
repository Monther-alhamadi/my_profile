import { supabase } from './api';
import type { Language, Project, Skill, Service, Experience, Stat, Testimonial, ContactMessage } from '@/lib';

function localeFilter<T extends { locale: string }>(data: T[], locale: Language): T[] {
  return data.filter(item => item.locale === locale);
}

export async function fetchProjects(locale: Language): Promise<Project[]> {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .order('sort_order', { ascending: true });
  if (error) throw error;
  return localeFilter(data as Project[], locale);
}

export async function fetchSkills(locale: Language): Promise<Skill[]> {
  const { data, error } = await supabase
    .from('skills')
    .select('*')
    .order('sort_order', { ascending: true });
  if (error) throw error;
  return localeFilter(data as Skill[], locale);
}

export async function fetchServices(locale: Language): Promise<Service[]> {
  const { data, error } = await supabase
    .from('services')
    .select('*')
    .order('sort_order', { ascending: true });
  if (error) throw error;
  return localeFilter(data as Service[], locale);
}

export async function fetchExperience(locale: Language): Promise<Experience[]> {
  const { data, error } = await supabase
    .from('experience')
    .select('*')
    .order('sort_order', { ascending: true });
  if (error) throw error;
  return localeFilter(data as Experience[], locale);
}

export async function fetchStats(locale: Language): Promise<Stat[]> {
  const { data, error } = await supabase
    .from('stats')
    .select('*')
    .order('sort_order', { ascending: true });
  if (error) throw error;
  return localeFilter(data as Stat[], locale);
}

export async function fetchTestimonials(locale: Language): Promise<Testimonial[]> {
  const { data, error } = await supabase
    .from('testimonials')
    .select('*')
    .order('sort_order', { ascending: true });
  if (error) throw error;
  return localeFilter(data as Testimonial[], locale);
}

export async function submitContact(data: {
  name: string;
  email: string;
  projectType: string;
  message: string;
}): Promise<{ success: boolean }> {
  const { error } = await supabase
    .from('contact_messages')
    .insert({
      name: data.name,
      email: data.email,
      subject: data.projectType !== 'none' ? data.projectType : null,
      message_type: data.projectType !== 'none' ? data.projectType : null,
      message: data.message,
    });

  if (error) throw error;
  return { success: true };
}

export async function fetchMessages(): Promise<ContactMessage[]> {
  const { data, error } = await supabase
    .from('contact_messages')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data as ContactMessage[];
}

export async function markMessageRead(id: string, isRead: boolean): Promise<void> {
  const { error } = await supabase
    .from('contact_messages')
    .update({ is_read: isRead })
    .eq('id', id);
  if (error) throw error;
}
