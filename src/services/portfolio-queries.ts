import { useQuery } from '@tanstack/react-query';
import type { Language } from '@/lib';
import {
  fetchProjects,
  fetchSkills,
  fetchServices,
  fetchExperience,
  fetchStats,
  fetchTestimonials,
  submitContact,
} from './portfolio-api';
import {
  PROJECTS_EN,
  PROJECTS_AR,
  SKILLS_EN,
  SKILLS_AR,
  SERVICES_EN,
  SERVICES_AR,
  EXPERIENCE_EN,
  EXPERIENCE_AR,
  STATS_EN,
  STATS_AR,
  TESTIMONIALS_EN,
  TESTIMONIALS_AR,
} from '@/lib/data-static';

const STALE_TIME = 5 * 60 * 1000;

function selectByLocale<T>(en: T[], ar: T[], locale: Language): T[] {
  return locale === 'ar' ? ar : en;
}

export function useProjectsQuery(locale: Language) {
  return useQuery({
    queryKey: ['projects', locale],
    queryFn: () => fetchProjects(locale),
    staleTime: STALE_TIME,
    retry: 2,
    refetchOnWindowFocus: false,
    placeholderData: () => selectByLocale(PROJECTS_EN, PROJECTS_AR, locale),
  });
}

export function useSkillsQuery(locale: Language) {
  return useQuery({
    queryKey: ['skills', locale],
    queryFn: () => fetchSkills(locale),
    staleTime: STALE_TIME,
    retry: 2,
    refetchOnWindowFocus: false,
    placeholderData: () => selectByLocale(SKILLS_EN, SKILLS_AR, locale),
  });
}

export function useServicesQuery(locale: Language) {
  return useQuery({
    queryKey: ['services', locale],
    queryFn: () => fetchServices(locale),
    staleTime: STALE_TIME,
    retry: 2,
    refetchOnWindowFocus: false,
    placeholderData: () => selectByLocale(SERVICES_EN, SERVICES_AR, locale),
  });
}

export function useExperienceQuery(locale: Language) {
  return useQuery({
    queryKey: ['experience', locale],
    queryFn: () => fetchExperience(locale),
    staleTime: STALE_TIME,
    retry: 2,
    refetchOnWindowFocus: false,
    placeholderData: () => selectByLocale(EXPERIENCE_EN, EXPERIENCE_AR, locale),
  });
}

export function useStatsQuery(locale: Language) {
  return useQuery({
    queryKey: ['stats', locale],
    queryFn: () => fetchStats(locale),
    staleTime: STALE_TIME,
    retry: 2,
    refetchOnWindowFocus: false,
    placeholderData: () => selectByLocale(STATS_EN, STATS_AR, locale),
  });
}

export function useTestimonialsQuery(locale: Language) {
  return useQuery({
    queryKey: ['testimonials', locale],
    queryFn: () => fetchTestimonials(locale),
    staleTime: STALE_TIME,
    retry: 2,
    refetchOnWindowFocus: false,
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
    isLoading,
    isError,
  };
}

export { submitContact };
