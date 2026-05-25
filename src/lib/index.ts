export const ROUTE_PATHS = {
  HOME: '/',
} as const;

export type Language = 'en' | 'ar';

export interface Project {
  id: string;
  number: string;
  title: string;
  category: string;
  problem: string;
  solution: string;
  complexity: 'High' | 'Critical' | 'Advanced';
  technologies: string[];
  highlights: string[];
  image?: string;
  link?: string;
}

export interface Skill {
  category: string;
  icon: string;
  description: string;
  technologies: string[];
}

export interface Service {
  id: string;
  icon: string;
  title: string;
  description: string;
  pricing: string;
  features: string[];
}

export interface Experience {
  id: string;
  year: string;
  title: string;
  company: string;
  description: string;
  achievements: string[];
}

export interface Stat {
  id: string;
  value: string;
  label: string;
  suffix?: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  content: string;
  rating: number;
  avatar?: string;
}

export interface ProfileData {
  name: string;
  title_en: string;
  title_ar: string;
  bio_en: string;
  bio_ar: string;
  location: string;
  email: string;
  avatar_url: string | null;
  github_url: string | null;
  linkedin_url: string | null;
  facebook_url: string | null;
  cv_url: string | null;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string | null;
  message_type: string | null;
  message: string;
  is_read: boolean;
  created_at: string;
}

export interface PortfolioData {
  profile: ProfileData | null;
  projects: Project[];
  skills: Skill[];
  services: Service[];
  experience: Experience[];
  stats: Stat[];
  testimonials: Testimonial[];
}
