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

// CV Builder Types
export interface CVSection {
  id: string;
  type: CVSectionType;
  title: string;
  enabled: boolean;
  order: number;
  data: CVSectionData;
}

export type CVSectionType = 
  | 'header' 
  | 'summary' 
  | 'experience' 
  | 'education' 
  | 'skills' 
  | 'projects' 
  | 'certifications' 
  | 'languages' 
  | 'publications' 
  | 'awards' 
  | 'volunteer' 
  | 'references' 
  | 'custom';

export interface CVSectionData {
  // Header
  name?: string;
  title_en?: string;
  title_ar?: string;
  email?: string;
  phone?: string;
  location?: string;
  website?: string;
  github?: string;
  linkedin?: string;
  summary_en?: string;
  summary_ar?: string;
  avatar_url?: string;
  
  // Experience items
  items?: CVExperienceItem[];
  
  // Education items
  education_items?: CVEducationItem[];
  
  // Skills
  skill_categories?: CVSkillCategory[];
  
  // Projects
  project_items?: CVProjectItem[];
  
  // Certifications
  cert_items?: CVCertItem[];
  
  // Languages
  language_items?: CVLanguageItem[];
  
  // Publications
  publication_items?: CVPublicationItem[];
  
  // Awards
  award_items?: CVAwardItem[];
  
  // Volunteer
  volunteer_items?: CVVolunteerItem[];
  
  // References
  reference_items?: CVReferenceItem[];
  
  // Custom
  custom_content_en?: string;
  custom_content_ar?: string;
}

export interface CVExperienceItem {
  id: string;
  role: string;
  company: string;
  location?: string;
  start_date: string;
  end_date?: string;
  current: boolean;
  description_en: string;
  description_ar: string;
  achievements_en: string[];
  achievements_ar: string[];
  technologies: string[];
}

export interface CVEducationItem {
  id: string;
  degree: string;
  field: string;
  institution: string;
  location?: string;
  start_date: string;
  end_date?: string;
  grade?: string;
  description_en?: string;
  description_ar?: string;
}

export interface CVSkillCategory {
  id: string;
  name: string;
  skills: string[];
}

export interface CVProjectItem {
  id: string;
  name: string;
  description_en: string;
  description_ar: string;
  url?: string;
  github_url?: string;
  technologies: string[];
  start_date?: string;
  end_date?: string;
}

export interface CVCertItem {
  id: string;
  name: string;
  issuer: string;
  date: string;
  expiry_date?: string;
  credential_id?: string;
  url?: string;
}

export interface CVLanguageItem {
  id: string;
  language: string;
  proficiency: 'native' | 'fluent' | 'professional' | 'conversational' | 'basic';
}

export interface CVPublicationItem {
  id: string;
  title: string;
  publisher: string;
  date: string;
  url?: string;
  description_en?: string;
  description_ar?: string;
}

export interface CVAwardItem {
  id: string;
  name: string;
  issuer: string;
  date: string;
  description_en?: string;
  description_ar?: string;
}

export interface CVVolunteerItem {
  id: string;
  role: string;
  organization: string;
  start_date: string;
  end_date?: string;
  description_en: string;
  description_ar: string;
}

export interface CVReferenceItem {
  id: string;
  name: string;
  title: string;
  company: string;
  email: string;
  phone?: string;
  relationship: string;
}

export interface CVData {
  id?: string;
  user_id: string;
  locale: 'en' | 'ar';
  sections: CVSection[];
  template: 'modern' | 'classic' | 'minimal' | 'executive';
  settings: CVSettings;
  created_at?: string;
  updated_at?: string;
}

export interface CVSettings {
  theme_color: string;
  font_family: 'inter' | 'ibm-plex' | 'system' | 'geist' | 'merriweather' | 'georgia';
  font_size: 'sm' | 'base' | 'lg';
  spacing: 'compact' | 'normal' | 'relaxed';
  show_icons: boolean;
  show_borders: boolean;
  rtl: boolean;
}
