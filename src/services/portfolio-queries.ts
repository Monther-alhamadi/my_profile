import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { Language } from '@/lib';
import {
  fetchProjects, fetchSkills, fetchServices, fetchExperience,
  fetchStats, fetchTestimonials, submitContact,
  createProject, updateProject, deleteProject,
  createSkill, updateSkill, deleteSkill,
  createService, updateService, deleteService,
  createExperience, updateExperience, deleteExperience,
  createStat, updateStat, deleteStat,
  createTestimonial, updateTestimonial, deleteTestimonial,
  updateProfile, reorderItems,
} from './portfolio-api';
import {
  PROJECTS_EN, PROJECTS_AR, SKILLS_EN, SKILLS_AR,
  SERVICES_EN, SERVICES_AR, EXPERIENCE_EN, EXPERIENCE_AR,
  STATS_EN, STATS_AR, TESTIMONIALS_EN, TESTIMONIALS_AR,
} from '@/lib/data-static';

const STALE_TIME = 5 * 60 * 1000;

function selectByLocale<T>(en: T[], ar: T[], locale: Language): T[] {
  return locale === 'ar' ? ar : en;
}

// ── Queries ──

export function useProjectsQuery(locale: Language) {
  return useQuery({
    queryKey: ['projects', locale],
    queryFn: () => fetchProjects(locale),
    staleTime: STALE_TIME, retry: 2, refetchOnWindowFocus: false,
    placeholderData: () => selectByLocale(PROJECTS_EN, PROJECTS_AR, locale),
  });
}

export function useSkillsQuery(locale: Language) {
  return useQuery({
    queryKey: ['skills', locale],
    queryFn: () => fetchSkills(locale),
    staleTime: STALE_TIME, retry: 2, refetchOnWindowFocus: false,
    placeholderData: () => selectByLocale(SKILLS_EN, SKILLS_AR, locale),
  });
}

export function useServicesQuery(locale: Language) {
  return useQuery({
    queryKey: ['services', locale],
    queryFn: () => fetchServices(locale),
    staleTime: STALE_TIME, retry: 2, refetchOnWindowFocus: false,
    placeholderData: () => selectByLocale(SERVICES_EN, SERVICES_AR, locale),
  });
}

export function useExperienceQuery(locale: Language) {
  return useQuery({
    queryKey: ['experience', locale],
    queryFn: () => fetchExperience(locale),
    staleTime: STALE_TIME, retry: 2, refetchOnWindowFocus: false,
    placeholderData: () => selectByLocale(EXPERIENCE_EN, EXPERIENCE_AR, locale),
  });
}

export function useStatsQuery(locale: Language) {
  return useQuery({
    queryKey: ['stats', locale],
    queryFn: () => fetchStats(locale),
    staleTime: STALE_TIME, retry: 2, refetchOnWindowFocus: false,
    placeholderData: () => selectByLocale(STATS_EN, STATS_AR, locale),
  });
}

export function useTestimonialsQuery(locale: Language) {
  return useQuery({
    queryKey: ['testimonials', locale],
    queryFn: () => fetchTestimonials(locale),
    staleTime: STALE_TIME, retry: 2, refetchOnWindowFocus: false,
    placeholderData: () => selectByLocale(TESTIMONIALS_EN, TESTIMONIALS_AR, locale),
  });
}

export function useAllQueries(locale: Language) {
  const projects = useProjectsQuery(locale);
  const skills = useSkillsQuery(locale);
  const services = useServicesQuery(locale);
  const experience = useExperienceQuery(locale);
  const stats = useStatsQuery(locale);
  const testimonials = useTestimonialsQuery(locale);

  const isLoading = projects.isLoading || skills.isLoading ||
    services.isLoading || experience.isLoading || stats.isLoading || testimonials.isLoading;

  const isError = projects.isError || skills.isError ||
    services.isError || experience.isError || stats.isError || testimonials.isError;

  return {
    projects: projects.data ?? selectByLocale(PROJECTS_EN, PROJECTS_AR, locale),
    skills: skills.data ?? selectByLocale(SKILLS_EN, SKILLS_AR, locale),
    services: services.data ?? selectByLocale(SERVICES_EN, SERVICES_AR, locale),
    experience: experience.data ?? selectByLocale(EXPERIENCE_EN, EXPERIENCE_AR, locale),
    stats: stats.data ?? selectByLocale(STATS_EN, STATS_AR, locale),
    testimonials: testimonials.data ?? selectByLocale(TESTIMONIALS_EN, TESTIMONIALS_AR, locale),
    isLoading, isError,
  };
}

export { submitContact };

// ── Mutations (for Dashboard CMS) ──

function useCreateMutation(key: string, fn: (data: any) => Promise<void>) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: fn,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [key] });
    },
  });
}

function useUpdateMutation(key: string, fn: (...args: any[]) => Promise<void>) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (args: { id: string; locale?: string; updates: any }) => {
      if (args.locale) return (fn as any)(args.id, args.locale, args.updates);
      return (fn as any)(args.id, args.updates);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [key] });
    },
  });
}

function useDeleteMutation(key: string, fn: (...args: any[]) => Promise<void>) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (args: { id: string; locale?: string }) => {
      if (args.locale) return (fn as any)(args.id, args.locale);
      return (fn as any)(args.id);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [key] });
    },
  });
}

export function useCreateProject() { return useCreateMutation('projects', createProject); }
export function useUpdateProject() { return useUpdateMutation('projects', updateProject); }
export function useDeleteProject() { return useDeleteMutation('projects', deleteProject); }

export function useCreateSkill() { return useCreateMutation('skills', createSkill); }
export function useUpdateSkill() { return useUpdateMutation('skills', updateSkill); }
export function useDeleteSkill() { return useDeleteMutation('skills', deleteSkill); }

export function useCreateService() { return useCreateMutation('services', createService); }
export function useUpdateService() { return useUpdateMutation('services', updateService); }
export function useDeleteService() { return useDeleteMutation('services', deleteService); }

export function useCreateExperience() { return useCreateMutation('experience', createExperience); }
export function useUpdateExperience() { return useUpdateMutation('experience', updateExperience); }
export function useDeleteExperience() { return useDeleteMutation('experience', deleteExperience); }

export function useCreateStat() { return useCreateMutation('stats', createStat); }
export function useUpdateStat() { return useUpdateMutation('stats', updateStat); }
export function useDeleteStat() { return useDeleteMutation('stats', deleteStat); }

export function useCreateTestimonial() { return useCreateMutation('testimonials', createTestimonial); }
export function useUpdateTestimonial() { return useUpdateMutation('testimonials', updateTestimonial); }
export function useDeleteTestimonial() { return useDeleteMutation('testimonials', deleteTestimonial); }

export function useUpdateProfile() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (args: { id: string; updates: any }) => updateProfile(args.id, args.updates),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['profile'] }); },
  });
}

export function useReorderItems() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (args: { table: string; items: { id: string; sort_order: number; locale?: string }[] }) =>
      reorderItems(args.table, args.items),
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: [variables.table] });
    },
  });
}
