import { useLanguage } from './useLanguage';
import {
  useAllQueries,
  useProjectsQuery,
  useSkillsQuery,
  useServicesQuery,
  useExperienceQuery,
  useStatsQuery,
  useTestimonialsQuery,
} from '@/services/portfolio-queries';

export function usePortfolio() {
  const { language } = useLanguage();
  return useAllQueries(language);
}

export function useProjects() {
  const { language } = useLanguage();
  return useProjectsQuery(language);
}

export function useSkills() {
  const { language } = useLanguage();
  return useSkillsQuery(language);
}

export function useServices() {
  const { language } = useLanguage();
  return useServicesQuery(language);
}

export function useExperience() {
  const { language } = useLanguage();
  return useExperienceQuery(language);
}

export function useStats() {
  const { language } = useLanguage();
  return useStatsQuery(language);
}

export function useTestimonials() {
  const { language } = useLanguage();
  return useTestimonialsQuery(language);
}
