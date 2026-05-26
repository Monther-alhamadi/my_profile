export const ROUTE_PATHS = {
  HOME: '/',
} as const;

export type Language = 'en' | 'ar';

export interface Project {
  id: string;
  locale?: string;
  sort_order?: number;
  number: string;
  title: string;
  category: string;
  problem: string;
  solution: string;
  complexity: 'High' | 'Critical' | 'Advanced';
  technologies: string[];
  highlights: string[];
  image_url?: string;
  link_url?: string;
  created_at?: string;
}

export interface Skill {
  id?: string;
  locale?: string;
  sort_order?: number;
  category: string;
  icon: string;
  description: string;
  technologies: string[];
}

export interface Service {
  id: string;
  locale?: string;
  sort_order?: number;
  icon: string;
  title: string;
  description: string;
  pricing: string;
  features: string[];
}

export interface Experience {
  id: string;
  locale?: string;
  sort_order?: number;
  year: string;
  title: string;
  company: string;
  description: string;
  achievements: string[];
}

export interface Stat {
  id: string;
  locale?: string;
  sort_order?: number;
  value: string;
  label: string;
  suffix?: string;
}

export interface Testimonial {
  id: string;
  locale?: string;
  sort_order?: number;
  name: string;
  role: string;
  company: string;
  content: string;
  rating: number;
  avatar_url?: string;
}

export interface ProfileData {
  id?: string;
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
  created_at?: string;
  updated_at?: string;
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
