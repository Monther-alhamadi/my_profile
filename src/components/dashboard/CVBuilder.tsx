import { useState, useEffect, useRef, useCallback } from 'react'
import { FileText, Plus, Save, Eye, Download, GripVertical, Trash2, ChevronDown, ChevronUp, Settings, ToggleLeft, ToggleRight, RotateCcw, ArrowLeft, Sparkles, Target, History, Undo, Redo } from 'lucide-react'
import { useLanguage } from '@/hooks/useLanguage'
import { useAuth } from '@/hooks/useAuth'
import { toast } from 'sonner'
import { supabase } from '@/services/api'
import html2canvas from 'html2canvas-pro'
import { jsPDF } from 'jspdf'
import type { CVData, CVSection } from '@/lib'
import { PROFILE_STATIC, EXPERIENCE_EN, EXPERIENCE_AR, SKILLS_EN, PROJECTS_EN, PROJECTS_AR } from '@/lib/data-static'
import { fetchProfile, fetchExperience, fetchSkills, fetchProjects } from '@/services/portfolio-api'
import { CVAICoPilot } from './CVAICoPilot'
import { CVATSChecker } from './CVATSChecker'
import { CVVersionManager } from './CVVersionManager'
import { CVHistoryPanel } from './CVHistoryPanel'
import { CVImportModal } from './CVImportModal'
import type { CVAIAssistantResponse } from '@/services/gemini-cv-assistant'
import { CVHistory } from '@/services/cv-history'
import { applyDeltaPatches, type CVDeltaPatch } from '@/services/cv-delta-merge'
import {
  fetchAllVersions,
  saveVersion,
  deleteVersion as deleteVersionFromDB,
  setPrimary as setPrimaryInDB,
  duplicateVersion as duplicateVersionInDB,
  cacheVersionsLocally,
  setActiveVersionId,
  getActiveVersionId,
  type CVVersionFull,
} from '@/services/cv-version-store'

const DEFAULT_SECTIONS: CVSection[] = [
  { id: 'header', type: 'header', title: 'Header', enabled: true, order: 0, data: {} },
  { id: 'summary', type: 'summary', title: 'Summary', enabled: true, order: 1, data: {} },
  { id: 'experience', type: 'experience', title: 'Experience', enabled: true, order: 2, data: {} },
  { id: 'education', type: 'education', title: 'Education', enabled: true, order: 3, data: {} },
  { id: 'skills', type: 'skills', title: 'Skills', enabled: true, order: 4, data: {} },
  { id: 'languages', type: 'languages', title: 'Languages', enabled: true, order: 5, data: {} },
  { id: 'certifications', type: 'certifications', title: 'Certifications', enabled: true, order: 6, data: {} },
  { id: 'projects', type: 'projects', title: 'Projects', enabled: true, order: 7, data: {} },
  { id: 'custom', type: 'custom', title: 'Custom Section', enabled: false, order: 8, data: {} },
]

const DEFAULT_SETTINGS = {
  theme_color: '#10b981',
  font_family: 'inter' as const,
  font_size: 'base' as const,
  spacing: 'normal' as const,
  show_icons: true,
  show_borders: true,
  rtl: false,
}

const PRESET_COLORS = [
  { name: 'Emerald', value: '#10b981' },
  { name: 'Navy', value: '#1e3a5f' },
  { name: 'Burgundy', value: '#722f37' },
  { name: 'Charcoal', value: '#36454f' },
  { name: 'Teal', value: '#008080' },
  { name: 'Indigo', value: '#3f51b5' },
  { name: 'Slate', value: '#475569' },
  { name: 'Rose', value: '#be123c' },
  { name: 'Amber', value: '#b45309' },
  { name: 'Violet', value: '#7c3aed' },
]

const TEMPLATE_OPTIONS = [
  { id: 'modern', label_en: 'Modern', label_ar: 'حديث', desc_en: 'Clean centered layout', desc_ar: 'تصميم نظيف ومركزي' },
  { id: 'classic', label_en: 'Classic', label_ar: 'كلاسيكي', desc_en: 'Serif headings, centered', desc_ar: 'عناوين كلاسيكية مركزية' },
  { id: 'minimal', label_en: 'Minimal', label_ar: 'بسيط', desc_en: 'Ultra-clean, no borders', desc_ar: 'تصميم بسيط بلا حدود' },
  { id: 'executive', label_en: 'Executive', label_ar: 'تنفيذي', desc_en: 'Accent bar, shaded entries', desc_ar: 'شريط جانبي مع خلفيات' },
  { id: 'sidebar', label_en: 'Sidebar', label_ar: 'شريط جانبي', desc_en: 'Colored sidebar column', desc_ar: 'عمود جانبي ملون' },
  { id: 'two-column', label_en: 'Two-Column', label_ar: 'عمودين', desc_en: 'Dark left, white right', desc_ar: 'عمود داكن وآخر أبيض' },
  { id: 'timeline', label_en: 'Timeline', label_ar: 'خط زمني', desc_en: 'Vertical timeline dots', desc_ar: 'نقاط على خط زمني' },
  { id: 'bold-header', label_en: 'Bold Header', label_ar: 'ترويسة جريئة', desc_en: 'Full-width colored banner', desc_ar: 'شريط علوي ملون عريض' },
]

/* ── Helper Functions and SVG Icons for Contacts ────────── */

const cleanUrlText = (url: string, type: 'linkedin' | 'github' | 'website') => {
  if (!url) return ''
  let cleaned = url.trim()
  cleaned = cleaned.replace(/^https?:\/\//i, '')
  cleaned = cleaned.replace(/^www\./i, '')
  if (type === 'linkedin') {
    cleaned = cleaned.split('?')[0]
    if (cleaned.endsWith('/')) cleaned = cleaned.slice(0, -1)
    if (!cleaned.includes('linkedin.com/in/')) {
      cleaned = 'linkedin.com/in/' + cleaned
    }
    return cleaned
  }
  if (type === 'github') {
    cleaned = cleaned.split('?')[0]
    if (cleaned.endsWith('/')) cleaned = cleaned.slice(0, -1)
    if (!cleaned.includes('github.com/')) {
      cleaned = 'github.com/' + cleaned
    }
    return cleaned
  }
  if (type === 'website') {
    if (cleaned.endsWith('/')) cleaned = cleaned.slice(0, -1)
    return cleaned
  }
  return cleaned
}

const getFullUrl = (val: string, type: 'linkedin' | 'github' | 'website') => {
  if (!val) return ''
  const trimmed = val.trim()
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return trimmed
  }
  if (type === 'linkedin') {
    return `https://linkedin.com/in/${trimmed}`
  }
  if (type === 'github') {
    return `https://github.com/${trimmed}`
  }
  return `https://${trimmed}`
}

const MailIcon = ({ color }: { color: string }) => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline-block', verticalAlign: 'middle' }}>
    <rect width="20" height="16" x="2" y="4" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
)

const PhoneIcon = ({ color }: { color: string }) => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline-block', verticalAlign: 'middle' }}>
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
)

const MapPinIcon = ({ color }: { color: string }) => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline-block', verticalAlign: 'middle' }}>
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
)

const GlobeIcon = ({ color }: { color: string }) => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline-block', verticalAlign: 'middle' }}>
    <circle cx="12" cy="12" r="10" />
    <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
    <path d="M2 12h20" />
  </svg>
)

const LinkedInIcon = ({ color }: { color: string }) => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline-block', verticalAlign: 'middle' }}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
)

const GitHubIcon = ({ color }: { color: string }) => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline-block', verticalAlign: 'middle' }}>
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
)

/* ── Template Style Configurations ─────────────────────── */

interface TplCfg {
  pagePad: string
  layout: 'single' | 'sidebar' | 'two-column'
  name: { size: string; weight: number; align: string; color: string; spacing: string }
  title: { size: string; weight: number }
  contact: { size: string; justify: string; gap: string; sep: string }
  sec: { size: string; spacing: string; transform: string; align: string; borderW: string; pb: string; mb: string; useColor: boolean; useBorder: boolean }
  entry: { titleSize: string; weight: number; coSize: string; dateSize: string; dateColor: string }
  body: { size: string; lh: number; color: string }
  bullet: { ch: string; size: string; useTheme: boolean }
  tech: { show: boolean; size: string; rad: string; pad: string }
  skills: { layout: 'grid' | 'inline'; size: string }
  gap: { sec: string; entry: string }
  hFont: string; bFont: string
  accentBar: boolean; entryBg: string | null
  sidebarBg: string | null; sidebarColor: string | null
  headerBanner: boolean; timelineDots: boolean
}

function getTplCfg(tpl: string, ff: string, isAr: boolean = false): TplCfg {
  const serif = 'Merriweather, Georgia, "Times New Roman", serif'
  const m: TplCfg = {
    pagePad: '18mm 20mm',
    layout: 'single',
    name: { size: '20pt', weight: 800, align: isAr ? 'right' : 'center', color: '#111827', spacing: isAr ? '0' : '0.02em' },
    title: { size: '10.5pt', weight: 500 },
    contact: { size: '8.5pt', justify: isAr ? 'flex-end' : 'center', gap: '14px', sep: '' },
    sec: { size: '10pt', spacing: isAr ? '0.04em' : '0.1em', transform: 'none', align: isAr ? 'right' : 'left', borderW: '1.5pt', pb: '3pt', mb: '8pt', useColor: true, useBorder: true },
    entry: { titleSize: '10.5pt', weight: 700, coSize: '9.5pt', dateSize: '8.5pt', dateColor: '#9ca3af' },
    body: { size: '9.5pt', lh: isAr ? 1.6 : 1.4, color: '#374151' },
    bullet: { ch: isAr ? '◂' : '▸', size: '8pt', useTheme: true },
    tech: { show: true, size: '7.5pt', rad: '2pt', pad: '1pt 5pt' },
    skills: { layout: 'grid', size: '9pt' },
    gap: { sec: '12pt', entry: '10pt' },
    hFont: ff, bFont: ff,
    accentBar: false, entryBg: null,
    sidebarBg: null, sidebarColor: null,
    headerBanner: false, timelineDots: false,
  }
  if (tpl === 'minimal') return { ...m,
    pagePad: '20mm 22mm',
    name: { size: '18pt', weight: 700, align: isAr ? 'right' : 'left', color: '#111827', spacing: '0' },
    title: { size: '10pt', weight: 400 },
    contact: { size: '8.5pt', justify: isAr ? 'flex-end' : 'flex-start', gap: '6px', sep: '·' },
    sec: { size: '9.5pt', spacing: isAr ? '0.02em' : '0.06em', transform: 'none', align: isAr ? 'right' : 'left', borderW: '0.75pt', pb: '2pt', mb: '6pt', useColor: false, useBorder: false },
    entry: { ...m.entry, titleSize: '10pt', coSize: '9pt', dateColor: '#6b7280' },
    body: { ...m.body, lh: isAr ? 1.55 : 1.35 },
    bullet: { ch: isAr ? '•' : '•', size: '9pt', useTheme: false },
    tech: { ...m.tech, show: false },
    skills: { layout: 'inline', size: '9pt' },
    gap: { sec: '10pt', entry: '8pt' },
  }
  if (tpl === 'classic') return { ...m,
    pagePad: '20mm 24mm',
    name: { size: '22pt', weight: 700, align: isAr ? 'right' : 'center', color: '#111827', spacing: isAr ? '0' : '0.04em' },
    title: { size: '10.5pt', weight: 400 },
    contact: { size: '8.5pt', justify: isAr ? 'flex-end' : 'center', gap: '8px', sep: '|' },
    sec: { ...m.sec, size: '10.5pt', spacing: isAr ? '0.06em' : '0.14em', transform: 'none', align: 'center', borderW: '0.75pt', pb: '4pt', mb: '10pt' },
    body: { size: '10pt', lh: isAr ? 1.6 : 1.45, color: '#374151' },
    bullet: { ch: isAr ? '–' : '–', size: '9pt', useTheme: true },
    tech: { ...m.tech, rad: '0', pad: '1pt 4pt' },
    gap: { sec: '14pt', entry: '10pt' },
    hFont: serif,
  }
  if (tpl === 'executive') return { ...m,
    pagePad: '16mm 18mm',
    name: { size: '22pt', weight: 800, align: isAr ? 'right' : 'left', color: '#111827', spacing: isAr ? '0' : '0.02em' },
    title: { size: '10pt', weight: 500 },
    contact: { ...m.contact, justify: isAr ? 'flex-end' : 'flex-start' },
    sec: { ...m.sec, size: '10pt', spacing: isAr ? '0.03em' : '0.08em', borderW: '0', useBorder: false },
    tech: { ...m.tech, rad: '3pt', pad: '1.5pt 6pt' },
    accentBar: true, entryBg: '#f9fafb',
  }
  if (tpl === 'sidebar') return { ...m,
    pagePad: '0',
    layout: 'sidebar' as const,
    name: { size: '16pt', weight: 800, align: isAr ? 'right' : 'left', color: '#ffffff', spacing: '0' },
    title: { size: '9.5pt', weight: 400 },
    contact: { size: '8pt', justify: 'flex-start', gap: '8px', sep: '' },
    sec: { ...m.sec, size: '9.5pt', spacing: isAr ? '0.02em' : '0.08em', borderW: '0', useBorder: false, pb: '0', mb: '6pt' },
    entry: { ...m.entry, titleSize: '10pt', coSize: '9pt' },
    body: { ...m.body, size: '9pt', lh: isAr ? 1.55 : 1.35 },
    skills: { layout: 'inline', size: '8.5pt' },
    gap: { sec: '10pt', entry: '8pt' },
    sidebarBg: null, sidebarColor: '#ffffff',
  }
  if (tpl === 'two-column') return { ...m,
    pagePad: '0',
    layout: 'two-column' as const,
    name: { size: '18pt', weight: 800, align: isAr ? 'right' : 'left', color: '#ffffff', spacing: '0' },
    title: { size: '9.5pt', weight: 400 },
    contact: { size: '8pt', justify: 'flex-start', gap: '6px', sep: '' },
    sec: { ...m.sec, size: '9.5pt', spacing: isAr ? '0.02em' : '0.08em', borderW: '0', useBorder: false, pb: '0', mb: '6pt' },
    entry: { ...m.entry, titleSize: '10pt', coSize: '9pt' },
    body: { ...m.body, size: '9pt', lh: isAr ? 1.55 : 1.35 },
    skills: { layout: 'inline', size: '8.5pt' },
    gap: { sec: '10pt', entry: '8pt' },
    sidebarBg: '#1a1a2e', sidebarColor: '#e2e8f0',
  }
  if (tpl === 'timeline') return { ...m,
    pagePad: '16mm 18mm',
    name: { size: '22pt', weight: 800, align: isAr ? 'right' : 'center', color: '#111827', spacing: isAr ? '0' : '0.02em' },
    title: { size: '10.5pt', weight: 500 },
    contact: { ...m.contact, justify: isAr ? 'flex-end' : 'center' },
    sec: { ...m.sec, borderW: '0', useBorder: false, pb: '0', mb: '6pt' },
    entry: { ...m.entry, dateColor: '#ffffff' },
    bullet: { ch: isAr ? '•' : '•', size: '8pt', useTheme: true },
    gap: { sec: '14pt', entry: '12pt' },
    timelineDots: true,
  }
  if (tpl === 'bold-header') return { ...m,
    pagePad: '0',
    name: { size: '24pt', weight: 800, align: isAr ? 'right' : 'left', color: '#ffffff', spacing: isAr ? '0' : '0.02em' },
    title: { size: '11pt', weight: 400 },
    contact: { size: '8.5pt', justify: isAr ? 'flex-end' : 'flex-start', gap: '12px', sep: '' },
    sec: { ...m.sec, spacing: isAr ? '0.03em' : '0.08em', borderW: '1.5pt', useColor: true, useBorder: true },
    gap: { sec: '12pt', entry: '10pt' },
    headerBanner: true,
  }
  return m
}

const PROJECT_CV_DESCRIPTIONS: Record<string, { en: string; ar: string }> = {
  'cachear-pos': {
    en: 'Offline-first enterprise POS with QR-sandboxed workspaces, omnidirectional barcode scanning, Bluetooth thermal printing, and sovereign SQLite database with SQL triggers.',
    ar: 'نظام POS مؤسسي يعمل بدون إنترنت مع بيئات معزولة عبر QR، مسح باركود ذكي، طباعة حرارية، وقاعدة بيانات سيادية مع محفزات SQL.',
  },
  'heic-converter': {
    en: 'Privacy-first HEIC-to-JPG converter using WebAssembly (zero-upload). Evolved into SaaS with 20+ format standards, multi-country compliance, and SEO content system.',
    ar: 'محول HEIC إلى JPG يعمل محلياً بالكامل عبر WebAssembly بدون رفع. تطور إلى منصة SaaS مع 20+ تنسيق دولي ونظام محتوى SEO.',
  },
  'university-scheduler': {
    en: 'Hybrid scheduling engine combining Genetic Algorithms with Google OR-Tools (CP-SAT). Reduced generation time from 3 weeks to 4 minutes for 10,000+ variables.',
    ar: 'محرك جدولة هجين يجمع بين الخوارزميات الجينية وGoogle OR-Tools. قلّل وقت الإنشاء من 3 أسابيع إلى 4 دقائق لأكثر من 10,000 متغير.',
  },
  'nextvendors-ecommerce': {
    en: 'Multi-vendor SaaS with custom borderless payment engine, Alembic migrations, Zustand/React Query state management, and Docker/Nginx deployment.',
    ar: 'منصة SaaS متعددة البائعين مع محرك دفع مخصص مستقل، إدارة حالة Zustand، ونشر Docker/Nginx.',
  },
  'ai-tools-hub': {
    en: 'AI orchestration platform unifying GPT, Claude, and Midjourney with prompt templates, A/B testing, cost tracking, and real-time streaming.',
    ar: 'منصة تنسيق ذكاء اصطناعي توحد GPT وClaude وMidjourney مع قوالب أوامر واختبار A/B وتتبع التكلفة.',
  },
  'kayany': {
    en: 'Tax compliance SaaS for GCC freelancers — 6-country calculator, ZATCA e-invoicing with QR codes, multi-currency tracking, and subscription billing.',
    ar: 'منصة امتثال ضريبي لمستقلين الخليج — حاسبة 6 دول، فواتير ZATCA مع QR، تتبع متعدد العملات، واشتراكات.',
  },
}

const PROJECT_LINKS: Record<string, { url?: string; github_url?: string }> = {
  'cachear-pos': { github_url: 'https://github.com/Monther-alhamadi/cachear' },
  'heic-converter': { url: 'https://heiconverts.vercel.app' },
  'university-scheduler': { github_url: 'https://github.com/Monther-alhamadi/Timetabling_v2' },
  'nextvendors-ecommerce': { url: 'https://next-vendors.vercel.app' },
  'ai-tools-hub': {},
  'kayany': { url: 'https://kayany7.vercel.app' },
}

async function buildInitialSectionsFromDB(): Promise<CVSection[]> {
  const sections = DEFAULT_SECTIONS.map(s => ({ ...s, data: { ...s.data } }))

  let prof = PROFILE_STATIC
  try {
    const dbProf = await fetchProfile()
    if (dbProf) prof = dbProf
  } catch { /* use fallback */ }

  let expEn = EXPERIENCE_EN
  let expAr = EXPERIENCE_AR
  try {
    const dbExpEn = await fetchExperience('en')
    const dbExpAr = await fetchExperience('ar')
    if (dbExpEn.length) expEn = dbExpEn
    if (dbExpAr.length) expAr = dbExpAr
  } catch { /* use fallback */ }

  let skillsEn = SKILLS_EN
  try {
    const dbSkills = await fetchSkills('en')
    if (dbSkills.length) skillsEn = dbSkills
  } catch { /* use fallback */ }

  let projEn = PROJECTS_EN
  let projAr = PROJECTS_AR
  try {
    const dbProjEn = await fetchProjects('en')
    const dbProjAr = await fetchProjects('ar')
    if (dbProjEn.length) projEn = dbProjEn
    if (dbProjAr.length) projAr = dbProjAr
  } catch { /* use fallback */ }

  const header = sections.find(s => s.id === 'header')!
  header.data = {
    name: prof.name || PROFILE_STATIC.name,
    title_en: prof.title_en || PROFILE_STATIC.title_en,
    title_ar: prof.title_ar || PROFILE_STATIC.title_ar,
    email: prof.email || PROFILE_STATIC.email,
    phone: '',
    location: prof.location || PROFILE_STATIC.location,
    linkedin: prof.linkedin_url || PROFILE_STATIC.linkedin_url || '',
    github: prof.github_url || PROFILE_STATIC.github_url || '',
    website: '',
  }

  const summary = sections.find(s => s.id === 'summary')!
  summary.data = {
    summary_en: prof.bio_en || PROFILE_STATIC.bio_en,
    summary_ar: prof.bio_ar || PROFILE_STATIC.bio_ar,
  }

  const exp = sections.find(s => s.id === 'experience')!
  exp.data = {
    items: expEn.map((e, i) => {
      const ar = expAr[i]
      const parts = (e.year || '').split(' - ')
      const end = parts[1]
      const current = end?.toLowerCase() === 'present'
      return {
        id: e.id || crypto.randomUUID(),
        role: e.title,
        company: e.company,
        start_date: parts[0] || '',
        end_date: current ? '' : (end || ''),
        current,
        description_en: e.description,
        description_ar: ar?.description || '',
        achievements_en: Array.isArray(e.achievements) ? e.achievements : [],
        achievements_ar: Array.isArray(ar?.achievements) ? ar.achievements : [],
        technologies: [],
      }
    }),
  }

  const skills = sections.find(s => s.id === 'skills')!
  skills.data = {
    skill_categories: skillsEn.map(s => ({
      id: s.id || crypto.randomUUID(),
      name: s.category,
      skills: Array.isArray(s.technologies) ? s.technologies : [],
    })),
  }

  const projects = sections.find(s => s.id === 'projects')!
  projects.data = {
    project_items: projEn.map((p, i) => {
      const ar = projAr[i]
      const cvDesc = PROJECT_CV_DESCRIPTIONS[p.id]
      const links = PROJECT_LINKS[p.id] || {}
      return {
        id: p.id || crypto.randomUUID(),
        name: p.title,
        description_en: cvDesc?.en || p.solution,
        description_ar: cvDesc?.ar || ar?.solution || '',
        technologies: Array.isArray(p.technologies) ? p.technologies : [],
        url: p.link_url || links.url || '',
        github_url: links.github_url || '',
      }
    }),
  }

  return sections
}

/* ── Generate Print HTML ────────────────────────────────── */

export function generatePrintHTML(sections: CVSection[], themeColor: string, fontFamily: string, isAr: boolean): string {
  const dir = isAr ? 'rtl' : 'ltr'
  const ff = fontFamily === 'ibm-plex' ? '"IBM Plex Sans Arabic", Inter, sans-serif' : fontFamily === 'geist' ? 'Geist, Inter, sans-serif' : 'Inter, system-ui, sans-serif'

  let body = ''

  for (const section of sections) {
    if (!section.enabled) continue
    const d = section.data as any

    if (section.type === 'header') {
      const iconColor = themeColor
      const svgIcon = (path: string, extra?: string) => `<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="${iconColor}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block;vertical-align:middle">${extra || ''}${path}</svg>`

      const mailSvg = svgIcon('<rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>')
      const phoneSvg = svgIcon('<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>')
      const mapSvg = svgIcon('<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>')
      const globeSvg = svgIcon('<circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/>')
      const linkedinSvg = svgIcon('<path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/>')
      const githubSvg = svgIcon('<path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/>')

      const buildContactItem = (icon: string, value: string, href?: string) => {
        const iconSpan = `<span style="display:inline-flex;align-items:center;justify-content:center;width:12px;height:12px">${icon}</span>`
        const textSpan = `<span>${value}</span>`
        if (href) return `<span style="display:inline-flex;align-items:center;gap:4px"><a href="${href}" target="_blank" rel="noopener noreferrer" style="color:#374151;text-decoration:none;display:inline-flex;align-items:center;gap:4px">${iconSpan}${textSpan}</a></span>`
        return `<span style="display:inline-flex;align-items:center;gap:4px;color:#374151">${iconSpan}${textSpan}</span>`
      }

      const row1: string[] = []
      if (d.location) row1.push(buildContactItem(mapSvg, d.location))
      if (d.email) row1.push(buildContactItem(mailSvg, d.email, `mailto:${d.email}`))
      if (d.phone) row1.push(buildContactItem(phoneSvg, d.phone, `tel:${d.phone}`))

      const row2: string[] = []
      if (d.website) {
        const cleanUrl = cleanUrlText(d.website, 'website')
        const fullUrl = getFullUrl(d.website, 'website')
        row2.push(buildContactItem(globeSvg, cleanUrl, fullUrl))
      }
      if (d.linkedin) {
        const cleanUrl = cleanUrlText(d.linkedin, 'linkedin')
        const fullUrl = getFullUrl(d.linkedin, 'linkedin')
        row2.push(buildContactItem(linkedinSvg, cleanUrl, fullUrl))
      }
      if (d.github) {
        const cleanUrl = cleanUrlText(d.github, 'github')
        const fullUrl = getFullUrl(d.github, 'github')
        row2.push(buildContactItem(githubSvg, cleanUrl, fullUrl))
      }

      const justify = isAr ? 'flex-end' : 'center'
      const sep = ''
      const renderRow = (items: string[]) => items.map((c, i) => c + (i < items.length - 1 && sep ? `<span style="color:#d1d5db;margin-${isAr ? 'right' : 'left'}:6px;margin-${isAr ? 'left' : 'right'}:2px">${sep}</span>` : '')).join('')

      body += `<div style="margin-bottom:10px;text-align:${isAr ? 'right' : 'center'}">
        <h1 style="font-size:22px;font-weight:800;color:#111827;margin:0;line-height:1.2">${d.name || ''}</h1>
        ${(d.title_en || d.title_ar) ? `<p style="font-size:11px;color:${themeColor};font-weight:500;margin:2px 0 0">${isAr && d.title_ar ? d.title_ar : d.title_en}</p>` : ''}
        ${row1.length ? `<div style="display:flex;flex-wrap:wrap;gap:10px;margin-top:6px;justify-content:${justify};font-size:9px;color:#6b7280">${renderRow(row1)}</div>` : ''}
        ${row2.length ? `<div style="display:flex;flex-wrap:wrap;gap:10px;margin-top:4px;justify-content:${justify};font-size:9px;color:#6b7280">${renderRow(row2)}</div>` : ''}
      </div>`
    }

    if (section.type === 'summary') {
      const text = isAr && d.summary_ar ? d.summary_ar : d.summary_en
      if (!text) continue
      body += `<div style="margin-bottom:8px">
        <h2 style="font-size:11px;font-weight:700;color:${themeColor};${isAr ? '' : 'text-transform:uppercase;'}letter-spacing:${isAr ? '0.04em' : '0.1em'};margin:0 0 5px;padding-bottom:3px;border-bottom:2px solid ${themeColor};text-align:${isAr ? 'right' : 'left'}">${isAr ? 'الملخص المهني' : 'Professional Summary'}</h2>
        <p style="font-size:10px;line-height:1.6;color:#374151;margin:0;word-wrap:break-word;overflow-wrap:break-word">${text}</p>
      </div>`
    }

    if (section.type === 'experience') {
      const items: any[] = d.items || []
      if (!items.length) continue
      body += `<div style="margin-bottom:8px">
        <h2 style="font-size:11px;font-weight:700;color:${themeColor};${isAr ? '' : 'text-transform:uppercase;'}letter-spacing:${isAr ? '0.04em' : '0.1em'};margin:0 0 5px;padding-bottom:3px;border-bottom:2px solid ${themeColor};text-align:${isAr ? 'right' : 'left'}">${isAr ? 'الخبرة المهنية' : 'Professional Experience'}</h2>`
      for (const item of items) {
        body += `<div style="margin-bottom:8px;page-break-inside:avoid">
          <div style="display:flex;justify-content:space-between;align-items:baseline;gap:8px">
            <h3 style="font-size:11px;font-weight:700;color:#111827;margin:0;flex-shrink:1;min-width:0;word-wrap:break-word;overflow-wrap:break-word">${item.role}</h3>
            <span style="font-size:9px;color:#9ca3af;white-space:nowrap;flex-shrink:0">${item.start_date} — ${item.current ? (isAr ? 'الحالي' : 'Present') : item.end_date}</span>
          </div>
          <p style="font-size:10px;color:#6b7280;margin:1px 0 4px">${item.company}</p>
          ${item.description_en || item.description_ar ? `<p style="font-size:9.5px;color:#4b5563;margin:0 0 4px;line-height:1.55;word-wrap:break-word;overflow-wrap:break-word">${isAr && item.description_ar ? item.description_ar : item.description_en}</p>` : ''}
          ${(isAr ? item.achievements_ar : item.achievements_en)?.length ? `<ul style="margin:3px 0 0;padding-${isAr ? 'right' : 'left'}:14px;list-style:none">
            ${(isAr ? item.achievements_ar : item.achievements_en).map((ach: string) => `<li style="font-size:9.5px;color:#4b5563;line-height:1.5;margin-bottom:2px;word-wrap:break-word;overflow-wrap:break-word;display:flex;gap:4px;flex-direction:${isAr ? 'row-reverse' : 'row'}"><span style="color:${themeColor};flex-shrink:0;font-size:8px;line-height:1.6">${isAr ? '◂' : '▸'}</span><span>${ach}</span></li>`).join('')}
          </ul>` : ''}
          ${item.technologies?.length ? `<div style="display:flex;flex-wrap:wrap;gap:3px;margin-top:3px">${item.technologies.map((t: string) => `<span style="font-size:8px;padding:1px 5px;border-radius:2px;background:${themeColor}12;color:${themeColor};font-weight:500">${t}</span>`).join('')}</div>` : ''}
        </div>`
      }
      body += '</div>'
    }

    if (section.type === 'education') {
      const items: any[] = d.education_items || []
      if (!items.length) continue
      body += `<div style="margin-bottom:8px">
        <h2 style="font-size:11px;font-weight:700;color:${themeColor};${isAr ? '' : 'text-transform:uppercase;'}letter-spacing:${isAr ? '0.04em' : '0.1em'};margin:0 0 5px;padding-bottom:3px;border-bottom:2px solid ${themeColor};text-align:${isAr ? 'right' : 'left'}">${isAr ? 'التعليم' : 'Education'}</h2>`
      for (const item of items) {
        body += `<div style="margin-bottom:6px;page-break-inside:avoid">
          <div style="display:flex;justify-content:space-between;align-items:baseline;gap:8px">
            <h3 style="font-size:10.5px;font-weight:700;color:#111827;margin:0;flex-shrink:1;min-width:0;word-wrap:break-word;overflow-wrap:break-word">${item.degree}${item.field ? ` in ${item.field}` : ''}</h3>
            <span style="font-size:9px;color:#9ca3af;white-space:nowrap;flex-shrink:0">${item.start_date} — ${item.end_date || (isAr ? 'الحالي' : 'Present')}</span>
          </div>
          <p style="font-size:9.5px;color:#6b7280;margin:1px 0">${item.institution}</p>
          ${item.grade ? `<p style="font-size:9px;color:#9ca3af;margin:0">${isAr ? 'التقدير' : 'Grade'}: ${item.grade}</p>` : ''}
        </div>`
      }
      body += '</div>'
    }

    if (section.type === 'skills') {
      const categories: any[] = d.skill_categories || []
      if (!categories.length) continue
      body += `<div style="margin-bottom:8px">
        <h2 style="font-size:11px;font-weight:700;color:${themeColor};text-transform:uppercase;letter-spacing:0.1em;margin:0 0 5px;padding-bottom:3px;border-bottom:2px solid ${themeColor}">${isAr ? 'المهارات التقنية' : 'Technical Skills'}</h2>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:4px 16px">`
      for (const cat of categories) {
        body += `<div style="font-size:9.5px;word-wrap:break-word;overflow-wrap:break-word"><strong style="color:#111827">${cat.name}:</strong> <span style="color:#4b5563">${cat.skills.join(' · ')}</span></div>`
      }
      body += '</div></div>'
    }

    if (section.type === 'projects') {
      const items: any[] = d.project_items || []
      if (!items.length) continue
      body += `<div style="margin-bottom:8px">
        <h2 style="font-size:11px;font-weight:700;color:${themeColor};${isAr ? '' : 'text-transform:uppercase;'}letter-spacing:${isAr ? '0.04em' : '0.1em'};margin:0 0 5px;padding-bottom:3px;border-bottom:2px solid ${themeColor};text-align:${isAr ? 'right' : 'left'}">${isAr ? 'المشاريع' : 'Projects'}</h2>`
      for (const item of items) {
        const links: string[] = []
        if (item.url) links.push(`<a href="${item.url}" target="_blank" style="font-size:8px;color:${themeColor};text-decoration:none">↗ ${isAr ? 'معاينة' : 'Live'}</a>`)
        if (item.github_url) links.push(`<a href="${item.github_url}" target="_blank" style="font-size:8px;color:#6b7280;text-decoration:none">⌘ GitHub</a>`)
        body += `<div style="margin-bottom:6px;page-break-inside:avoid">
          <div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap">
            <h3 style="font-size:10.5px;font-weight:700;color:#111827;margin:0">${item.name}</h3>
            ${links.join('')}
          </div>
          <p style="font-size:9.5px;color:#4b5563;margin:2px 0;line-height:1.5;word-wrap:break-word;overflow-wrap:break-word">${isAr && item.description_ar ? item.description_ar : item.description_en}</p>
          ${item.technologies?.length ? `<div style="display:flex;flex-wrap:wrap;gap:3px;margin-top:2px">${item.technologies.map((t: string) => `<span style="font-size:7.5px;padding:1px 4px;border-radius:2px;background:#f3f4f6;color:#6b7280">${t}</span>`).join('')}</div>` : ''}
        </div>`
      }
      body += '</div>'
    }

    if (section.type === 'languages') {
      const items: any[] = d.language_items || []
      if (!items.length) continue
      const profLabels: Record<string, string> = isAr
        ? { native: 'اللغة الأم', fluent: 'طلاقة', professional: 'احترافي', conversational: 'محادثة', basic: 'أساسي' }
        : { native: 'Native', fluent: 'Fluent', professional: 'Professional', conversational: 'Conversational', basic: 'Basic' }
      body += `<div style="margin-bottom:8px">
        <h2 style="font-size:11px;font-weight:700;color:${themeColor};${isAr ? '' : 'text-transform:uppercase;'}letter-spacing:${isAr ? '0.04em' : '0.1em'};margin:0 0 5px;padding-bottom:3px;border-bottom:2px solid ${themeColor};text-align:${isAr ? 'right' : 'left'}">${isAr ? 'اللغات' : 'Languages'}</h2>
        <div style="display:flex;flex-wrap:wrap;gap:10px;font-size:9.5px">
          ${items.map((item: any) => `<span style="color:#374151"><strong>${item.language}</strong> <span style="color:#9ca3af">— ${profLabels[item.proficiency] || item.proficiency}</span></span>`).join('')}
        </div>
      </div>`
    }

    if (section.type === 'certifications') {
      const items: any[] = d.cert_items || []
      if (!items.length) continue
      body += `<div style="margin-bottom:8px">
        <h2 style="font-size:11px;font-weight:700;color:${themeColor};${isAr ? '' : 'text-transform:uppercase;'}letter-spacing:${isAr ? '0.04em' : '0.1em'};margin:0 0 5px;padding-bottom:3px;border-bottom:2px solid ${themeColor};text-align:${isAr ? 'right' : 'left'}">${isAr ? 'الشهادات' : 'Certifications'}</h2>`
      for (const item of items) {
        body += `<div style="margin-bottom:4px;display:flex;justify-content:space-between;align-items:baseline;gap:8px">
          <div style="flex-shrink:1;min-width:0;word-wrap:break-word;overflow-wrap:break-word">
            <span style="font-size:10px;font-weight:600;color:#111827">${item.name}</span>
            <span style="font-size:9.5px;color:#6b7280;margin-${isAr ? 'right' : 'left'}:6px">— ${item.issuer}</span>
          </div>
          <span style="font-size:9px;color:#9ca3af;white-space:nowrap;flex-shrink:0">${item.date}</span>
        </div>`
      }
      body += '</div>'
    }

    if (section.type === 'custom') {
      const content = isAr && d.custom_content_ar ? d.custom_content_ar : d.custom_content_en
      if (!content) continue
      body += `<div style="margin-bottom:8px">
        <h2 style="font-size:11px;font-weight:700;color:${themeColor};${isAr ? '' : 'text-transform:uppercase;'}letter-spacing:${isAr ? '0.04em' : '0.1em'};margin:0 0 5px;padding-bottom:3px;border-bottom:2px solid ${themeColor};text-align:${isAr ? 'right' : 'left'}">${isAr ? 'قسم مخصص' : 'Additional Information'}</h2>
        <div style="font-size:9.5px;color:#374151;line-height:1.6;word-wrap:break-word;overflow-wrap:break-word">${content}</div>
      </div>`
    }
  }

  return `<!DOCTYPE html>
<html lang="${isAr ? 'ar' : 'en'}" dir="${dir}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>CV - ${isAr ? 'السيرة الذاتية' : 'Resume'}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: ${ff};
      color: #1a1a1a;
      background: #fff;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    @media print {
      body { margin: 0; padding: 0; }
      @page { margin: 12mm 14mm; size: A4; }
    }
  </style>
</head>
<body>
  <div style="padding:20px 24px;max-width:210mm;margin:0 auto" dir="${dir}">
    ${body}
  </div>
</body>
</html>`
}

export default function CVBuilder() {
  const { language } = useLanguage()
  const { user } = useAuth()
  const [cv, setCv] = useState<CVData>(() => ({
    user_id: '',
    locale: language,
    sections: DEFAULT_SECTIONS.map(s => ({ ...s, data: { ...s.data } })),
    template: 'modern',
    settings: { ...DEFAULT_SETTINGS },
  }))
  const [saving, setSaving] = useState(false)
  const [preview, setPreview] = useState(false)
  const [previewLang, setPreviewLang] = useState<'en' | 'ar'>(language as 'en' | 'ar')
  const [activeSection, setActiveSection] = useState<string | null>(null)
  const [isAiOpen, setIsAiOpen] = useState(false)
  const [isAtsOpen, setIsAtsOpen] = useState(false)

  // ── Multi-CV Engine V2 State ──────────────────────────────
  const historyRef = useRef<CVHistory | null>(null)
  const [, forceUpdate] = useState(0) // trigger re-render for history badge
  const [versions, setVersions] = useState<CVVersionFull[]>([])
  const [activeVersionId, setActiveVerState] = useState<string | null>(null)
  const [activeVersionName, setActiveVersionName] = useState('Default')
  const [isHistoryOpen, setIsHistoryOpen] = useState(false)
  const [isImportOpen, setIsImportOpen] = useState(false)
  const [versionsLoading, setVersionsLoading] = useState(false)

  // Initialise history engine once CV loads
  const ensureHistory = useCallback((cvData: CVData) => {
    if (!historyRef.current) {
      historyRef.current = new CVHistory(cvData)
    }
  }, [])

  const pushHistory = useCallback((newCv: CVData, label: string, source: 'user' | 'ai' = 'user') => {
    if (historyRef.current) {
      historyRef.current.push(newCv, label, source)
      forceUpdate(n => n + 1)
    }
  }, [])

  const handleUndo = useCallback(() => {
    if (!historyRef.current) return
    const restored = historyRef.current.undo()
    if (restored) {
      setCv(restored)
      forceUpdate(n => n + 1)
    }
  }, [])

  const handleRedo = useCallback(() => {
    if (!historyRef.current) return
    const restored = historyRef.current.redo()
    if (restored) {
      setCv(restored)
      forceUpdate(n => n + 1)
    }
  }, [])

  const handleRestoreTo = useCallback((index: number) => {
    if (!historyRef.current) return
    const restored = historyRef.current.restoreTo(index)
    if (restored) {
      setCv(restored)
      forceUpdate(n => n + 1)
    }
  }, [])

  // ── Delta Patches handler (called from CVAICoPilot) ──────
  const handleApplyPatches = useCallback((patches: CVDeltaPatch[], label: string) => {
    setCv(prevCv => {
      const result = applyDeltaPatches(prevCv, patches)
      if (result.rejected.length > 0) {
        const reasons = result.rejected.map(r => r.reason).join(', ')
        toast.warning(language === 'ar' ? `تم رفض بعض التعديلات: ${reasons}` : `Some patches rejected: ${reasons}`)
      }
      pushHistory(result.cv, label, 'ai')
      return result.cv
    })
  }, [language, pushHistory])

  const handleApplyAIAction = (actionType: CVAIAssistantResponse['actionType'], payload: any) => {
    if (!payload || actionType === 'NONE') return

    setCv(prevCv => {
      const updatedSections = [...prevCv.sections]

      if (actionType === 'UPDATE_HEADER') {
        const idx = updatedSections.findIndex(s => s.type === 'header')
        if (idx !== -1) {
          updatedSections[idx] = {
            ...updatedSections[idx],
            data: { ...updatedSections[idx].data, ...payload },
          }
        }
      } else if (actionType === 'UPDATE_SUMMARY') {
        const idx = updatedSections.findIndex(s => s.type === 'summary')
        if (idx !== -1) {
          updatedSections[idx] = {
            ...updatedSections[idx],
            data: { ...updatedSections[idx].data, ...payload },
          }
        }
      } else if (actionType === 'ADD_EXPERIENCE') {
        const idx = updatedSections.findIndex(s => s.type === 'experience')
        if (idx !== -1) {
          const currentItems = (updatedSections[idx].data as any).items || []
          const newItem = { id: crypto.randomUUID(), ...payload }
          updatedSections[idx] = {
            ...updatedSections[idx],
            data: { ...updatedSections[idx].data, items: [newItem, ...currentItems] },
          }
        }
      } else if (actionType === 'ADD_EDUCATION') {
        const idx = updatedSections.findIndex(s => s.type === 'education')
        if (idx !== -1) {
          const currentItems = (updatedSections[idx].data as any).education_items || []
          const newItem = { id: crypto.randomUUID(), ...payload }
          updatedSections[idx] = {
            ...updatedSections[idx],
            data: { ...updatedSections[idx].data, education_items: [newItem, ...currentItems] },
          }
        }
      } else if (actionType === 'ADD_SKILL_CATEGORY') {
        const idx = updatedSections.findIndex(s => s.type === 'skills')
        if (idx !== -1) {
          const currentCats = (updatedSections[idx].data as any).skill_categories || []
          const newCat = { id: crypto.randomUUID(), ...payload }
          updatedSections[idx] = {
            ...updatedSections[idx],
            data: { ...updatedSections[idx].data, skill_categories: [...currentCats, newCat] },
          }
        }
      } else if (actionType === 'ADD_PROJECT') {
        const idx = updatedSections.findIndex(s => s.type === 'projects')
        if (idx !== -1) {
          const currentItems = (updatedSections[idx].data as any).project_items || []
          const newItem = { id: crypto.randomUUID(), ...payload }
          updatedSections[idx] = {
            ...updatedSections[idx],
            data: { ...updatedSections[idx].data, project_items: [newItem, ...currentItems] },
          }
        }
      } else if (actionType === 'ADD_CERTIFICATION') {
        const idx = updatedSections.findIndex(s => s.type === 'certifications')
        if (idx !== -1) {
          const currentItems = (updatedSections[idx].data as any).cert_items || []
          const newItem = { id: crypto.randomUUID(), ...payload }
          updatedSections[idx] = {
            ...updatedSections[idx],
            data: { ...updatedSections[idx].data, cert_items: [...currentItems, newItem] },
          }
        }
      }

      let newTemplate = prevCv.template
      let newSettings = { ...prevCv.settings }

      if (actionType === 'CHANGE_SETTINGS') {
        if (payload.template) newTemplate = payload.template
        if (payload.theme_color) newSettings.theme_color = payload.theme_color
        if (payload.font_family) newSettings.font_family = payload.font_family
        if (payload.spacing) newSettings.spacing = payload.spacing
      }

      const newCv = {
        ...prevCv,
        sections: updatedSections,
        template: newTemplate,
        settings: newSettings,
      }
      pushHistory(newCv, `AI: ${String(actionType)}`, 'ai')
      return newCv
    })
  }

  // ── Load versions list from Supabase ─────────────────────
  const loadVersions = useCallback(async () => {
    if (!user) return
    setVersionsLoading(true)
    try {
      const all = await fetchAllVersions(user.id)
      setVersions(all)
      cacheVersionsLocally(user.id, all)

      // Determine which version to activate
      const savedActiveId = getActiveVersionId()
      const target = all.find(v => v.id === savedActiveId) || all.find(v => v.isPrimary) || all[0]
      if (target) {
        setActiveVerState(target.id)
        setActiveVersionName(target.versionName)
        setActiveVersionId(target.id)
        setCv(target.data)
        ensureHistory(target.data)
      }
    } catch (err) {
      console.warn('Failed to load CV versions:', err)
    } finally {
      setVersionsLoading(false)
    }
  }, [user, ensureHistory])

  useEffect(() => {
    if (!user) return
    loadCV()
  }, [user])

  const loadCV = async () => {
    if (!user) return
    const { data, error } = await supabase
      .from('cvs')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle()
    if (error && error.code !== 'PGRST116') return
    if (data) {
      const loaded = data as unknown as CVData
      setCv(loaded)
      ensureHistory(loaded)
    } else {
      const initSections = await buildInitialSectionsFromDB()
      const initial: CVData = {
        user_id: user.id,
        locale: language,
        sections: initSections,
        template: 'modern',
        settings: { ...DEFAULT_SETTINGS },
      }
      setCv(initial)
      ensureHistory(initial)
    }
    // Also try to load versions list (non-blocking, graceful if columns don't exist yet)
    try { await loadVersions() } catch { /* schema not migrated yet — OK */ }
  }

  const refreshFromPortfolio = async () => {
    try {
      const freshSections = await buildInitialSectionsFromDB()
      setCv(prev => {
        const newCv = { ...prev, sections: freshSections }
        pushHistory(newCv, language === 'ar' ? 'تحديث من الملف الشخصي' : 'Refreshed from portfolio')
        return newCv
      })
      toast.success(language === 'ar' ? 'تم تحديث البيانات من قاعدة البيانات والملف الشخصي' : 'Data refreshed from portfolio DB')
    } catch {
      toast.error(language === 'ar' ? 'فشل تحديث البيانات' : 'Failed to refresh data')
    }
  }

  const saveCV = async () => {
    if (!user) return
    setSaving(true)
    try {
      const isPrimary = versions.length === 0 || versions.find(v => v.id === activeVersionId)?.isPrimary || false
      const saved = await saveVersion(user.id, cv, activeVersionName, isPrimary)
      // Update local state
      setActiveVerState(saved.id)
      setActiveVersionId(saved.id)
      setCv(prev => ({ ...prev, id: saved.id }))
      // Refresh versions list
      await loadVersions()
      toast.success(language === 'ar' ? 'تم حفظ السيرة الذاتية بنجاح' : 'CV saved successfully')
    } catch (err: any) {
      console.error('CV save error:', err)
      // Fallback to legacy upsert if version columns don't exist yet
      try {
        const payload: Record<string, unknown> = {
          user_id: user.id,
          locale: cv.locale,
          sections: cv.sections,
          template: cv.template,
          settings: cv.settings,
          updated_at: new Date().toISOString(),
        }
        if (cv.id) payload.id = cv.id
        const { error } = await supabase
          .from('cvs')
          .upsert(payload, { onConflict: 'user_id' })
        if (error) throw error
        toast.success(language === 'ar' ? 'تم حفظ السيرة الذاتية بنجاح (legacy)' : 'CV saved (legacy mode)')
      } catch (e2: any) {
        toast.error(language === 'ar' ? `فشل الحفظ: ${e2?.message || 'خطأ غير معروف'}` : `Save failed: ${e2?.message || 'Unknown error'}`)
      }
    } finally {
      setSaving(false)
    }
  }

  // ── Version management callbacks ─────────────────────────
  const handleSelectVersion = useCallback((ver: CVVersionFull) => {
    setActiveVerState(ver.id)
    setActiveVersionName(ver.versionName)
    setActiveVersionId(ver.id)
    setCv(ver.data)
    historyRef.current = new CVHistory(ver.data)
    forceUpdate(n => n + 1)
  }, [])

  const handleCreateNewVersion = useCallback(async (name: string) => {
    if (!user) return
    const blankCv: CVData = {
      user_id: user.id,
      locale: language as 'en' | 'ar',
      sections: DEFAULT_SECTIONS.map(s => ({ ...s, data: { ...s.data } })),
      template: 'modern',
      settings: { ...DEFAULT_SETTINGS },
    }
    const saved = await saveVersion(user.id, blankCv, name, false)
    handleSelectVersion(saved)
    await loadVersions()
  }, [user, language, handleSelectVersion, loadVersions])

  const handleDuplicateVersion = useCallback(async (sourceId: string, newName: string) => {
    if (!user) return
    const dup = await duplicateVersionInDB(user.id, sourceId, newName)
    handleSelectVersion(dup)
    await loadVersions()
  }, [user, handleSelectVersion, loadVersions])

  const handleDeleteVersion = useCallback(async (versionId: string) => {
    await deleteVersionFromDB(versionId)
    await loadVersions()
  }, [loadVersions])

  const handleSetPrimary = useCallback(async (versionId: string) => {
    if (!user) return
    await setPrimaryInDB(user.id, versionId)
    await loadVersions()
  }, [user, loadVersions])

  const handleConfirmImport = useCallback(async (importedCv: Partial<CVData>, versionName: string) => {
    if (!user) return
    const fullCv: CVData = {
      user_id: user.id,
      locale: importedCv.locale || (language as 'en' | 'ar'),
      sections: importedCv.sections || DEFAULT_SECTIONS.map(s => ({ ...s, data: { ...s.data } })),
      template: (importedCv.template as CVData['template']) || 'modern',
      settings: importedCv.settings || { ...DEFAULT_SETTINGS },
    }
    const saved = await saveVersion(user.id, fullCv, versionName, false)
    handleSelectVersion(saved)
    await loadVersions()
  }, [user, language, handleSelectVersion, loadVersions])

  const moveSection = (index: number, direction: 'up' | 'down') => {
    const newSections = [...cv.sections]
    const targetIndex = direction === 'up' ? index - 1 : index + 1
    if (targetIndex < 0 || targetIndex >= newSections.length) return
    ;[newSections[index], newSections[targetIndex]] = [newSections[targetIndex], newSections[index]]
    newSections.forEach((s, i) => (s.order = i))
    setCv({ ...cv, sections: newSections })
  }

  const toggleSection = (id: string) => {
    setCv({
      ...cv,
      sections: cv.sections.map(s => (s.id === id ? { ...s, enabled: !s.enabled } : s)),
    })
  }

  const updateSectionData = (id: string, data: Record<string, unknown>) => {
    setCv({
      ...cv,
      sections: cv.sections.map(s => (s.id === id ? { ...s, data: { ...s.data, ...data } } : s)),
    })
  }

  const downloadPDF = async () => {
    const el = document.getElementById('cv-preview')
    if (!el) return
    toast.info(language === 'ar' ? 'جاري إنشاء ملف PDF...' : 'Generating PDF...')
    try {
      const canvas = await html2canvas(el, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
        logging: false,
        allowTaint: true,
      } as any)
      const imgData = canvas.toDataURL('image/png', 1.0)
      const pdf = new jsPDF('p', 'mm', 'a4')
      const pdfW = pdf.internal.pageSize.getWidth()
      const pdfH = pdf.internal.pageSize.getHeight()
      const marginX = 0
      const marginY = 0
      const availW = pdfW - marginX * 2
      const imgW = availW
      const imgH = (canvas.height * imgW) / canvas.width
      let remainingH = imgH
      let position = 0

      pdf.addImage(imgData, 'PNG', marginX, marginY, imgW, imgH)
      while (remainingH > pdfH) {
        pdf.addPage()
        position -= pdfH
        pdf.addImage(imgData, 'PNG', marginX, position + marginY, imgW, imgH)
        remainingH -= pdfH
      }

      const fileName = previewLang === 'ar' ? 'السيرة_الذاتية.pdf' : 'cv.pdf'
      pdf.save(fileName)
      toast.success(language === 'ar' ? 'تم تحميل ملف PDF بنجاح' : 'PDF downloaded successfully')
    } catch (err: any) {
      console.error('PDF export error:', err)
      toast.error(language === 'ar' ? 'فشل تصدير PDF: ' + (err?.message || 'خطأ غير معروف') : 'PDF export failed: ' + (err?.message || 'Unknown error'))
    }
  }

  const isAr = language === 'ar'

  return (
    <div className="space-y-6" dir={isAr ? 'rtl' : 'ltr'}>
      {/* ── Version Manager Toolbar ── */}
      {versions.length > 0 && (
        <CVVersionManager
          versions={versions}
          activeVersionId={activeVersionId}
          language={language}
          onSelectVersion={handleSelectVersion}
          onCreateNewVersion={handleCreateNewVersion}
          onDuplicateVersion={handleDuplicateVersion}
          onDeleteVersion={handleDeleteVersion}
          onSetPrimaryVersion={handleSetPrimary}
          onOpenImportModal={() => setIsImportOpen(true)}
          loading={versionsLoading}
        />
      )}

      <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:justify-between">
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-emerald-brand flex-shrink-0" />
          <h2 className="text-lg font-bold text-obsidian">
            {isAr ? 'بناء السيرة الذاتية' : 'CV Builder'}
          </h2>
        </div>
        <div className="flex gap-2 flex-wrap">
          {/* Undo / Redo buttons */}
          <button
            onClick={handleUndo}
            disabled={!historyRef.current?.canUndo}
            title={historyRef.current?.undoLabel || (isAr ? 'تراجع' : 'Undo')}
            className="btn-outline text-xs py-2 px-2 disabled:opacity-30"
          >
            <Undo className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleRedo}
            disabled={!historyRef.current?.canRedo}
            title={historyRef.current?.redoLabel || (isAr ? 'إعادة' : 'Redo')}
            className="btn-outline text-xs py-2 px-2 disabled:opacity-30"
          >
            <Redo className="w-3.5 h-3.5" />
          </button>

          <button onClick={() => setIsAiOpen(true)} className="btn-emerald text-xs py-2 px-3 flex items-center gap-1.5 shadow-sm">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isAr ? 'المساعد الذكي' : 'AI Co-Pilot'}</span>
          </button>
          <button onClick={() => setIsAtsOpen(true)} className="btn-outline text-xs py-2 px-3 flex items-center gap-1.5">
            <Target className="w-3.5 h-3.5 text-emerald-brand" />
            <span>{isAr ? 'فحص ATS' : 'ATS Checker'}</span>
          </button>
          <button onClick={() => setIsHistoryOpen(true)} className="btn-outline text-xs py-2 px-3 flex items-center gap-1.5">
            <History className="w-3.5 h-3.5 text-purple-500" />
            <span className="hidden sm:inline">{isAr ? 'السجل' : 'History'}</span>
            {historyRef.current && historyRef.current.pastEntries.length > 0 && (
              <span className="bg-purple-100 text-purple-700 text-[9px] font-mono px-1 rounded">{historyRef.current.pastEntries.length}</span>
            )}
          </button>
          <button onClick={() => setPreview(true)} className="btn-outline text-xs py-2 px-3">
            <Eye className="w-3.5 h-3.5" />
            <span className="hidden sm:inline ml-1">{isAr ? 'معاينة' : 'Preview'}</span>
          </button>
          <button onClick={refreshFromPortfolio} className="btn-outline text-xs py-2 px-3" title={isAr ? 'تحديث من الملف الشخصي' : 'Refresh from portfolio'}>
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline ml-1">{isAr ? 'تحديث' : 'Refresh'}</span>
          </button>
          <button onClick={saveCV} disabled={saving} className="btn-emerald text-xs py-2 px-3">
            <Save className="w-3.5 h-3.5" />
            <span className="hidden sm:inline ml-1">{saving ? (isAr ? 'جاري الحفظ...' : 'Saving...') : (isAr ? 'حفظ' : 'Save')}</span>
          </button>
        </div>
      </div>

      {preview ? (
        <PreviewPane
          cv={cv}
          previewLang={previewLang}
          setPreviewLang={setPreviewLang}
          onClose={() => setPreview(false)}
          onDownloadPDF={downloadPDF}
        />
      ) : (
        <>
          <SettingsPanel cv={cv} setCv={setCv} isAr={isAr} />
          <div className="space-y-3">
            {cv.sections.map((section, index) => (
              <SectionCard
                key={section.id}
                section={section}
                index={index}
                total={cv.sections.length}
                isActive={activeSection === section.id}
                isAr={isAr}
                onToggle={() => toggleSection(section.id)}
                onMoveUp={() => moveSection(index, 'up')}
                onMoveDown={() => moveSection(index, 'down')}
                onToggleActive={() => setActiveSection(activeSection === section.id ? null : section.id)}
                onUpdate={(data) => updateSectionData(section.id, data)}
              />
            ))}
          </div>
        </>
      )}

      {/* AI Assistant Drawer (with Delta Patches) */}
      <CVAICoPilot
        cv={cv}
        isOpen={isAiOpen}
        onClose={() => setIsAiOpen(false)}
        language={language}
        onApplyAction={handleApplyAIAction}
        onApplyPatches={handleApplyPatches}
      />

      {/* ATS Checker Modal */}
      <CVATSChecker
        cv={cv}
        isOpen={isAtsOpen}
        onClose={() => setIsAtsOpen(false)}
        language={language}
        onApplySummary={(sumEn, sumAr) => {
          handleApplyAIAction('UPDATE_SUMMARY', { summary_en: sumEn, summary_ar: sumAr });
          setIsAtsOpen(false);
        }}
      />

      {/* History Panel */}
      <CVHistoryPanel
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        language={language}
        pastEntries={historyRef.current?.pastEntries || []}
        canUndo={historyRef.current?.canUndo || false}
        canRedo={historyRef.current?.canRedo || false}
        undoLabel={historyRef.current?.undoLabel || null}
        redoLabel={historyRef.current?.redoLabel || null}
        onUndo={handleUndo}
        onRedo={handleRedo}
        onRestoreTo={handleRestoreTo}
      />

      {/* Smart AI Import Modal */}
      <CVImportModal
        isOpen={isImportOpen}
        onClose={() => setIsImportOpen(false)}
        language={language}
        onConfirmImport={handleConfirmImport}
      />
    </div>
  )
}

/* ── Settings Panel ─────────────────────────────────────── */

function SettingsPanel({ cv, setCv, isAr }: { cv: CVData; setCv: (c: CVData) => void; isAr: boolean }) {
  const themeColor = cv.settings.theme_color
  return (
    <div className="border border-border/60 rounded-sm p-4 bg-white space-y-5">
      <div className="flex items-center gap-2">
        <Settings className="w-4 h-4 text-emerald-brand" />
        <h3 className="text-sm font-bold text-obsidian">{isAr ? 'الإعدادات' : 'Settings'}</h3>
      </div>

      {/* ── Template Cards ── */}
      <div>
        <label className="text-[10px] font-mono font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">{isAr ? 'القالب' : 'Template'}</label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {TEMPLATE_OPTIONS.map(tpl => (
            <button
              key={tpl.id}
              onClick={() => setCv({ ...cv, template: tpl.id as any })}
              className={`group relative border rounded-md p-2.5 text-left transition-all hover:shadow-md ${cv.template === tpl.id ? 'border-emerald-brand ring-1 ring-emerald-brand bg-emerald-50/40' : 'border-border/60 bg-white hover:border-gray-300'}`}
            >
              <TemplateMiniPreview id={tpl.id} color={themeColor} isSelected={cv.template === tpl.id} />
              <p className={`text-[11px] font-semibold mt-1.5 ${cv.template === tpl.id ? 'text-emerald-brand' : 'text-obsidian'}`}>{isAr ? tpl.label_ar : tpl.label_en}</p>
              <p className="text-[9px] text-muted-foreground leading-tight">{isAr ? tpl.desc_ar : tpl.desc_en}</p>
            </button>
          ))}
        </div>
      </div>

      {/* ── Color & Font & Spacing ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="text-[10px] font-mono font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">{isAr ? 'اللون الأساسي' : 'Theme Color'}</label>
          <div className="flex flex-wrap items-center gap-1.5 mb-1.5">
            {PRESET_COLORS.map(c => (
              <button
                key={c.value}
                onClick={() => setCv({ ...cv, settings: { ...cv.settings, theme_color: c.value } })}
                title={c.name}
                className={`w-6 h-6 rounded-full border-2 transition-all hover:scale-110 ${themeColor === c.value ? 'border-obsidian ring-1 ring-offset-1 ring-obsidian scale-110' : 'border-transparent'}`}
                style={{ backgroundColor: c.value }}
              />
            ))}
          </div>
          <input type="color" value={themeColor} onChange={(e) => setCv({ ...cv, settings: { ...cv.settings, theme_color: e.target.value } })} className="w-full h-7 rounded cursor-pointer" />
        </div>
        <div>
          <label className="text-[10px] font-mono font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">{isAr ? 'الخط' : 'Font'}</label>
          <select value={cv.settings.font_family} onChange={(e) => setCv({ ...cv, settings: { ...cv.settings, font_family: e.target.value as any } })} className="w-full text-xs bg-white border border-border rounded px-2 py-1.5 h-9">
            <option value="inter">Inter</option>
            <option value="ibm-plex">IBM Plex Sans Arabic</option>
            <option value="system">System UI</option>
            <option value="geist">Geist</option>
            <option value="merriweather">Merriweather (Serif)</option>
            <option value="georgia">Georgia (Serif)</option>
          </select>
        </div>
        <div>
          <label className="text-[10px] font-mono font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">{isAr ? 'التباعد' : 'Spacing'}</label>
          <select value={cv.settings.spacing} onChange={(e) => setCv({ ...cv, settings: { ...cv.settings, spacing: e.target.value as any } })} className="w-full text-xs bg-white border border-border rounded px-2 py-1.5 h-9">
            <option value="compact">{isAr ? 'مضغوط' : 'Compact'}</option>
            <option value="normal">{isAr ? 'عادي' : 'Normal'}</option>
            <option value="relaxed">{isAr ? 'واسع' : 'Relaxed'}</option>
          </select>
        </div>
      </div>
    </div>
  )
}

/* ── Template Mini-Preview SVG ──────────────────────────── */

function TemplateMiniPreview({ id, color, isSelected }: { id: string; color: string; isSelected: boolean }) {
  const bg = isSelected ? '#f0fdf4' : '#fafafa'
  const line = '#d1d5db'
  const w = 64
  const h = 44

  if (id === 'sidebar') return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="rounded-sm overflow-hidden">
      <rect width={w} height={h} fill={bg} />
      <rect x="0" y="0" width="20" height={h} fill={color} opacity="0.85" />
      <rect x="3" y="4" width="14" height="2" rx="0.5" fill="#fff" />
      <rect x="3" y="8" width="10" height="1" rx="0.5" fill="#fff" opacity="0.6" />
      <rect x="3" y="14" width="14" height="1" rx="0.5" fill="#fff" opacity="0.4" />
      <rect x="3" y="17" width="12" height="1" rx="0.5" fill="#fff" opacity="0.4" />
      <rect x="3" y="20" width="14" height="1" rx="0.5" fill="#fff" opacity="0.4" />
      <rect x="24" y="4" width="20" height="2" rx="0.5" fill={color} />
      <rect x="24" y="9" width="36" height="1" rx="0.5" fill={line} />
      <rect x="24" y="12" width="34" height="1" rx="0.5" fill={line} />
      <rect x="24" y="18" width="18" height="2" rx="0.5" fill={color} />
      <rect x="24" y="23" width="36" height="1" rx="0.5" fill={line} />
      <rect x="24" y="26" width="30" height="1" rx="0.5" fill={line} />
      <rect x="24" y="32" width="18" height="2" rx="0.5" fill={color} />
      <rect x="24" y="37" width="34" height="1" rx="0.5" fill={line} />
      <rect x="24" y="40" width="28" height="1" rx="0.5" fill={line} />
    </svg>
  )

  if (id === 'two-column') return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="rounded-sm overflow-hidden">
      <rect width={w} height={h} fill={bg} />
      <rect x="0" y="0" width="24" height={h} fill="#1a1a2e" />
      <rect x="3" y="4" width="18" height="2.5" rx="0.5" fill="#fff" />
      <rect x="3" y="9" width="14" height="1" rx="0.5" fill="#94a3b8" />
      <rect x="3" y="15" width="10" height="1.5" rx="0.5" fill={color} />
      <rect x="3" y="19" width="18" height="1" rx="0.5" fill="#64748b" />
      <rect x="3" y="22" width="16" height="1" rx="0.5" fill="#64748b" />
      <rect x="3" y="28" width="10" height="1.5" rx="0.5" fill={color} />
      <rect x="3" y="32" width="18" height="1" rx="0.5" fill="#64748b" />
      <rect x="28" y="4" width="18" height="2" rx="0.5" fill={color} />
      <rect x="28" y="9" width="32" height="1" rx="0.5" fill={line} />
      <rect x="28" y="12" width="30" height="1" rx="0.5" fill={line} />
      <rect x="28" y="18" width="16" height="2" rx="0.5" fill={color} />
      <rect x="28" y="23" width="32" height="1" rx="0.5" fill={line} />
      <rect x="28" y="26" width="28" height="1" rx="0.5" fill={line} />
      <rect x="28" y="32" width="16" height="2" rx="0.5" fill={color} />
      <rect x="28" y="37" width="30" height="1" rx="0.5" fill={line} />
    </svg>
  )

  if (id === 'timeline') return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="rounded-sm overflow-hidden">
      <rect width={w} height={h} fill={bg} />
      <rect x="16" y="3" width="32" height="3" rx="0.5" fill="#111827" />
      <rect x="22" y="8" width="20" height="1" rx="0.5" fill={color} />
      <line x1="14" y1="14" x2="14" y2="42" stroke={color} strokeWidth="1" opacity="0.4" />
      <circle cx="14" cy="16" r="2" fill={color} />
      <rect x="19" y="15" width="22" height="1.5" rx="0.5" fill="#374151" />
      <rect x="19" y="18.5" width="36" height="1" rx="0.5" fill={line} />
      <rect x="19" y="21" width="30" height="1" rx="0.5" fill={line} />
      <circle cx="14" cy="27" r="2" fill={color} />
      <rect x="19" y="26" width="20" height="1.5" rx="0.5" fill="#374151" />
      <rect x="19" y="29.5" width="36" height="1" rx="0.5" fill={line} />
      <rect x="19" y="32" width="32" height="1" rx="0.5" fill={line} />
      <circle cx="14" cy="38" r="2" fill={color} />
      <rect x="19" y="37" width="18" height="1.5" rx="0.5" fill="#374151" />
      <rect x="19" y="40.5" width="34" height="1" rx="0.5" fill={line} />
    </svg>
  )

  if (id === 'bold-header') return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="rounded-sm overflow-hidden">
      <rect width={w} height={h} fill={bg} />
      <rect x="0" y="0" width={w} height="14" fill={color} />
      <rect x="4" y="3" width="28" height="3" rx="0.5" fill="#fff" />
      <rect x="4" y="8" width="20" height="1" rx="0.5" fill="#fff" opacity="0.7" />
      <rect x="4" y="10.5" width="40" height="1" rx="0.5" fill="#fff" opacity="0.5" />
      <rect x="4" y="18" width="20" height="2" rx="0.5" fill={color} />
      <rect x="4" y="23" width="56" height="1" rx="0.5" fill={line} />
      <rect x="4" y="26" width="50" height="1" rx="0.5" fill={line} />
      <rect x="4" y="31" width="18" height="2" rx="0.5" fill={color} />
      <rect x="4" y="36" width="56" height="1" rx="0.5" fill={line} />
      <rect x="4" y="39" width="44" height="1" rx="0.5" fill={line} />
    </svg>
  )

  if (id === 'executive') return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="rounded-sm overflow-hidden">
      <rect width={w} height={h} fill={bg} />
      <rect x="4" y="3" width="30" height="3" rx="0.5" fill="#111827" />
      <rect x="4" y="8" width="18" height="1" rx="0.5" fill={color} />
      <rect x="0" y="13" width="2" height="6" fill={color} />
      <rect x="4" y="14" width="16" height="1.5" rx="0.5" fill="#374151" />
      <rect x="4" y="17.5" width={w - 8} height="4" rx="1" fill="#f9fafb" />
      <rect x="0" y="24" width="2" height="6" fill={color} />
      <rect x="4" y="25" width="20" height="1.5" rx="0.5" fill="#374151" />
      <rect x="4" y="28.5" width={w - 8} height="4" rx="1" fill="#f9fafb" />
      <rect x="0" y="35" width="2" height="6" fill={color} />
      <rect x="4" y="36" width="16" height="1.5" rx="0.5" fill="#374151" />
      <rect x="4" y="39.5" width={w - 8} height="3" rx="1" fill="#f9fafb" />
    </svg>
  )

  if (id === 'minimal') return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="rounded-sm overflow-hidden">
      <rect width={w} height={h} fill={bg} />
      <rect x="4" y="4" width="24" height="3" rx="0.5" fill="#111827" />
      <rect x="4" y="9" width="16" height="1" rx="0.5" fill="#9ca3af" />
      <rect x="4" y="15" width="14" height="1.5" rx="0.5" fill="#6b7280" />
      <rect x="4" y="19" width={w - 8} height="1" rx="0.5" fill={line} />
      <rect x="4" y="22" width={w - 12} height="1" rx="0.5" fill={line} />
      <rect x="4" y="27" width="14" height="1.5" rx="0.5" fill="#6b7280" />
      <rect x="4" y="31" width={w - 8} height="1" rx="0.5" fill={line} />
      <rect x="4" y="34" width={w - 14} height="1" rx="0.5" fill={line} />
      <rect x="4" y="39" width="14" height="1.5" rx="0.5" fill="#6b7280" />
      <rect x="4" y="42" width="30" height="1" rx="0.5" fill={line} />
    </svg>
  )

  if (id === 'classic') return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="rounded-sm overflow-hidden">
      <rect width={w} height={h} fill={bg} />
      <rect x="14" y="3" width="36" height="3" rx="0.5" fill="#111827" />
      <rect x="20" y="8" width="24" height="1" rx="0.5" fill={color} />
      <rect x="18" y="11" width="28" height="1" rx="0.5" fill="#9ca3af" />
      <line x1="4" y1="16" x2="60" y2="16" stroke={color} strokeWidth="0.5" />
      <rect x="18" y="18" width="28" height="2" rx="0.5" fill={color} />
      <rect x="4" y="23" width={w - 8} height="1" rx="0.5" fill={line} />
      <rect x="4" y="26" width={w - 12} height="1" rx="0.5" fill={line} />
      <line x1="4" y1="31" x2="60" y2="31" stroke={color} strokeWidth="0.5" />
      <rect x="18" y="33" width="28" height="2" rx="0.5" fill={color} />
      <rect x="4" y="38" width={w - 8} height="1" rx="0.5" fill={line} />
      <rect x="4" y="41" width={w - 14} height="1" rx="0.5" fill={line} />
    </svg>
  )

  // Modern (default)
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="rounded-sm overflow-hidden">
      <rect width={w} height={h} fill={bg} />
      <rect x="12" y="3" width="40" height="3" rx="0.5" fill="#111827" />
      <rect x="18" y="8" width="28" height="1" rx="0.5" fill={color} />
      <rect x="14" y="11" width="36" height="1" rx="0.5" fill="#9ca3af" />
      <rect x="4" y="17" width="20" height="2" rx="0.5" fill={color} />
      <line x1="4" y1="21" x2="60" y2="21" stroke={color} strokeWidth="1" />
      <rect x="4" y="24" width={w - 8} height="1" rx="0.5" fill={line} />
      <rect x="4" y="27" width={w - 12} height="1" rx="0.5" fill={line} />
      <rect x="4" y="32" width="18" height="2" rx="0.5" fill={color} />
      <line x1="4" y1="36" x2="60" y2="36" stroke={color} strokeWidth="1" />
      <rect x="4" y="39" width={w - 8} height="1" rx="0.5" fill={line} />
      <rect x="4" y="42" width={w - 14} height="1" rx="0.5" fill={line} />
    </svg>
  )
}

/* ── Section Card ───────────────────────────────────────── */

function SectionCard({ section, index, total, isActive, isAr, onToggle, onMoveUp, onMoveDown, onToggleActive, onUpdate }: {
  section: CVSection; index: number; total: number; isActive: boolean; isAr: boolean;
  onToggle: () => void; onMoveUp: () => void; onMoveDown: () => void; onToggleActive: () => void; onUpdate: (data: any) => void;
}) {
  return (
    <div className={`border rounded-sm transition-all ${section.enabled ? 'border-border/60 bg-white' : 'border-red-200 bg-red-50/30'} ${isActive ? 'ring-1 ring-emerald-brand' : ''}`}>
      <div className="flex items-center gap-1.5 px-3 py-2.5 bg-muted/10">
        <GripVertical className="w-4 h-4 text-muted-foreground/40 cursor-grab flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <h3 className={`text-sm font-semibold truncate ${section.enabled ? 'text-obsidian' : 'text-muted-foreground line-through'}`}>{section.title}</h3>
        </div>
        {!section.enabled && <span className="text-[10px] text-red-500 whitespace-nowrap hidden sm:inline">{isAr ? 'معطل' : 'Disabled'}</span>}
        <div className="flex items-center gap-1">
          <button onClick={onToggle} className="p-1.5 hover:text-emerald-brand transition-colors" title={isAr ? 'تفعيل/تعطيل' : 'Toggle'}>
            {section.enabled ? <ToggleRight className="w-5 h-5 text-emerald-brand" /> : <ToggleLeft className="w-5 h-5 text-muted-foreground/30" />}
          </button>
          <button onClick={onMoveUp} disabled={index === 0} className="p-1.5 hover:text-emerald-brand transition-colors disabled:opacity-30"><ChevronUp className="w-4 h-4" /></button>
          <button onClick={onMoveDown} disabled={index === total - 1} className="p-1.5 hover:text-emerald-brand transition-colors disabled:opacity-30"><ChevronDown className="w-4 h-4" /></button>
          <button onClick={onToggleActive} className="p-1.5 hover:text-emerald-brand transition-colors"><Settings className="w-4 h-4" /></button>
        </div>
      </div>
      {isActive && <div className="p-4 border-t border-ivory/10"><SectionEditor section={section} onUpdate={onUpdate} isAr={isAr} /></div>}
    </div>
  )
}

/* ── Section Editor ─────────────────────────────────────── */

function SectionEditor({ section, onUpdate, isAr }: { section: CVSection; onUpdate: (data: any) => void; isAr: boolean }) {
  switch (section.type) {
    case 'header': return <HeaderEditor data={section.data} onUpdate={onUpdate} isAr={isAr} />
    case 'summary': return <SummaryEditor data={section.data} onUpdate={onUpdate} isAr={isAr} />
    case 'experience': return <ExperienceEditor data={section.data} onUpdate={onUpdate} isAr={isAr} />
    case 'education': return <EducationEditor data={section.data} onUpdate={onUpdate} isAr={isAr} />
    case 'skills': return <SkillsEditor data={section.data} onUpdate={onUpdate} isAr={isAr} />
    case 'languages': return <LanguagesEditor data={section.data} onUpdate={onUpdate} isAr={isAr} />
    case 'certifications': return <CertificationsEditor data={section.data} onUpdate={onUpdate} isAr={isAr} />
    case 'projects': return <ProjectsEditor data={section.data} onUpdate={onUpdate} isAr={isAr} />
    case 'custom': return <CustomEditor data={section.data} onUpdate={onUpdate} isAr={isAr} />
    default: return <p className="text-xs text-muted-foreground">{isAr ? 'لا يوجد محرر لهذا القسم' : 'No editor for this section'}</p>
  }
}

function HeaderEditor({ data, onUpdate, isAr }: { data: any; onUpdate: (d: any) => void; isAr: boolean }) {
  return (
    <div className="grid gap-3">
      <Field label={isAr ? 'الاسم الكامل' : 'Full Name'} value={data.name || ''} onChange={(v: string) => onUpdate({ name: v })} isAr={isAr} />
      <Field label={isAr ? 'المسمى (English)' : 'Title (English)'} value={data.title_en || ''} onChange={(v: string) => onUpdate({ title_en: v })} isAr={isAr} />
      <Field label={isAr ? 'المسمى (عربي)' : 'Title (Arabic)'} value={data.title_ar || ''} onChange={(v: string) => onUpdate({ title_ar: v })} isAr={isAr} />
      <Field label={isAr ? 'البريد الإلكتروني' : 'Email'} value={data.email || ''} onChange={(v: string) => onUpdate({ email: v })} isAr={isAr} />
      <Field label={isAr ? 'رقم الهاتف' : 'Phone'} value={data.phone || ''} onChange={(v: string) => onUpdate({ phone: v })} isAr={isAr} />
      <Field label={isAr ? 'الموقع' : 'Location'} value={data.location || ''} onChange={(v: string) => onUpdate({ location: v })} isAr={isAr} />
      <Field label="LinkedIn" value={data.linkedin || ''} onChange={(v: string) => onUpdate({ linkedin: v })} isAr={isAr} />
      <Field label="GitHub" value={data.github || ''} onChange={(v: string) => onUpdate({ github: v })} isAr={isAr} />
      <Field label={isAr ? 'الموقع الإلكتروني' : 'Website'} value={data.website || ''} onChange={(v: string) => onUpdate({ website: v })} isAr={isAr} />
    </div>
  )
}

function SummaryEditor({ data, onUpdate, isAr }: { data: any; onUpdate: (d: any) => void; isAr: boolean }) {
  return (
    <div className="grid gap-3">
      <TextAreaField label={isAr ? 'الملخص (English)' : 'Summary (English)'} value={data.summary_en || ''} onChange={(v: string) => onUpdate({ summary_en: v })} isAr={isAr} />
      <TextAreaField label={isAr ? 'الملخص (عربي)' : 'Summary (Arabic)'} value={data.summary_ar || ''} onChange={(v: string) => onUpdate({ summary_ar: v })} isAr={isAr} />
    </div>
  )
}

function ExperienceEditor({ data, onUpdate, isAr }: { data: any; onUpdate: (d: any) => void; isAr: boolean }) {
  const items: any[] = data.items || []
  const addItem = () => onUpdate({ items: [...items, { id: crypto.randomUUID(), role: '', company: '', start_date: '', end_date: '', current: false, description_en: '', description_ar: '', achievements_en: [], achievements_ar: [], technologies: [] }] })
  const updateItem = (id: string, updates: any) => onUpdate({ items: items.map((i: any) => (i.id === id ? { ...i, ...updates } : i)) })
  const removeItem = (id: string) => onUpdate({ items: items.filter((i: any) => i.id !== id) })

  return (
    <div className="space-y-3">
      {items.map((item: any) => (
        <div key={item.id} className="border border-ivory/10 rounded-sm p-3 relative">
          <button onClick={() => removeItem(item.id)} className="absolute top-2 right-2 p-1 hover:text-red-500"><Trash2 className="w-3.5 h-3.5" /></button>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-2">
            <Field label={isAr ? 'المسمى الوظيفي' : 'Role'} value={item.role} onChange={(v: string) => updateItem(item.id, { role: v })} isAr={isAr} />
            <Field label={isAr ? 'الشركة' : 'Company'} value={item.company} onChange={(v: string) => updateItem(item.id, { company: v })} isAr={isAr} />
            <Field label={isAr ? 'تاريخ البداية' : 'Start Date'} value={item.start_date} onChange={(v: string) => updateItem(item.id, { start_date: v })} isAr={isAr} />
            <div className="flex items-end gap-2">
              <Field label={isAr ? 'تاريخ النهاية' : 'End Date'} value={item.end_date || ''} onChange={(v: string) => updateItem(item.id, { end_date: v })} isAr={isAr} className="flex-1" />
              <label className="flex items-center gap-1.5 pb-1.5 cursor-pointer">
                <input type="checkbox" checked={item.current} onChange={(e) => updateItem(item.id, { current: e.target.checked, end_date: e.target.checked ? '' : item.end_date })} className="w-3.5 h-3.5 accent-emerald-brand" />
                <span className="text-[10px] font-mono text-muted-foreground whitespace-nowrap">{isAr ? 'حالياً' : 'Current'}</span>
              </label>
            </div>
          </div>
          <TextAreaField label={isAr ? 'الإنجازات (كل إنجاز بسطر)' : 'Achievements (one per line)'} value={(isAr ? item.achievements_ar : item.achievements_en)?.join('\n') || ''} onChange={(v: string) => updateItem(item.id, { [isAr ? 'achievements_ar' : 'achievements_en']: v.split('\n').map((s: string) => s.trim()).filter(Boolean) })} isAr={isAr} rows={3} />
          <TextAreaField label={isAr ? 'التقنيات (فاصلة)' : 'Technologies (comma)'} value={item.technologies?.join(', ') || ''} onChange={(v: string) => updateItem(item.id, { technologies: v.split(',').map((s: string) => s.trim()).filter(Boolean) })} isAr={isAr} rows={1} />
        </div>
      ))}
      <button onClick={addItem} className="text-xs text-emerald-brand hover:underline flex items-center gap-1"><Plus className="w-3 h-3" /> {isAr ? 'إضافة خبرة' : 'Add Experience'}</button>
    </div>
  )
}

function EducationEditor({ data, onUpdate, isAr }: { data: any; onUpdate: (d: any) => void; isAr: boolean }) {
  const items: any[] = data.education_items || []
  const addItem = () => onUpdate({ education_items: [...items, { id: crypto.randomUUID(), degree: '', field: '', institution: '', start_date: '', end_date: '', grade: '' }] })
  const updateItem = (id: string, updates: any) => onUpdate({ education_items: items.map((i: any) => (i.id === id ? { ...i, ...updates } : i)) })
  const removeItem = (id: string) => onUpdate({ education_items: items.filter((i: any) => i.id !== id) })

  return (
    <div className="space-y-3">
      {items.map((item: any) => (
        <div key={item.id} className="border border-ivory/10 rounded-sm p-3 relative">
          <button onClick={() => removeItem(item.id)} className="absolute top-2 right-2 p-1 hover:text-red-500"><Trash2 className="w-3.5 h-3.5" /></button>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <Field label={isAr ? 'الشهادة' : 'Degree'} value={item.degree} onChange={(v: string) => updateItem(item.id, { degree: v })} isAr={isAr} />
            <Field label={isAr ? 'التخصص' : 'Field'} value={item.field} onChange={(v: string) => updateItem(item.id, { field: v })} isAr={isAr} />
            <Field label={isAr ? 'المؤسسة' : 'Institution'} value={item.institution} onChange={(v: string) => updateItem(item.id, { institution: v })} isAr={isAr} className="sm:col-span-2" />
            <Field label={isAr ? 'تاريخ البداية' : 'Start Date'} value={item.start_date} onChange={(v: string) => updateItem(item.id, { start_date: v })} isAr={isAr} />
            <Field label={isAr ? 'تاريخ النهاية' : 'End Date'} value={item.end_date || ''} onChange={(v: string) => updateItem(item.id, { end_date: v })} isAr={isAr} />
            <Field label={isAr ? 'التقدير' : 'Grade'} value={item.grade || ''} onChange={(v: string) => updateItem(item.id, { grade: v })} isAr={isAr} />
          </div>
        </div>
      ))}
      <button onClick={addItem} className="text-xs text-emerald-brand hover:underline flex items-center gap-1"><Plus className="w-3 h-3" /> {isAr ? 'إضافة تعليم' : 'Add Education'}</button>
    </div>
  )
}

function SkillsEditor({ data, onUpdate, isAr }: { data: any; onUpdate: (d: any) => void; isAr: boolean }) {
  const categories: any[] = data.skill_categories || []
  const addCategory = () => onUpdate({ skill_categories: [...categories, { id: crypto.randomUUID(), name: '', skills: [] }] })
  const updateCategory = (id: string, updates: any) => onUpdate({ skill_categories: categories.map((c: any) => (c.id === id ? { ...c, ...updates } : c)) })
  const removeCategory = (id: string) => onUpdate({ skill_categories: categories.filter((c: any) => c.id !== id) })

  return (
    <div className="space-y-3">
      {categories.map((cat: any) => (
        <div key={cat.id} className="border border-ivory/10 rounded-sm p-3 relative">
          <button onClick={() => removeCategory(cat.id)} className="absolute top-2 right-2 p-1 hover:text-red-500"><Trash2 className="w-3.5 h-3.5" /></button>
          <Field label={isAr ? 'اسم الفئة' : 'Category Name'} value={cat.name} onChange={(v: string) => updateCategory(cat.id, { name: v })} isAr={isAr} className="mb-2" />
          <TextAreaField label={isAr ? 'المهارات (فاصلة)' : 'Skills (comma)'} value={cat.skills.join(', ')} onChange={(v: string) => updateCategory(cat.id, { skills: v.split(',').map((s: string) => s.trim()).filter(Boolean) })} isAr={isAr} />
        </div>
      ))}
      <button onClick={addCategory} className="text-xs text-emerald-brand hover:underline flex items-center gap-1"><Plus className="w-3 h-3" /> {isAr ? 'إضافة فئة' : 'Add Category'}</button>
    </div>
  )
}

function LanguagesEditor({ data, onUpdate, isAr }: { data: any; onUpdate: (d: any) => void; isAr: boolean }) {
  const items: any[] = data.language_items || []
  const addItem = () => onUpdate({ language_items: [...items, { id: crypto.randomUUID(), language: '', proficiency: 'professional' }] })
  const updateItem = (id: string, updates: any) => onUpdate({ language_items: items.map((i: any) => (i.id === id ? { ...i, ...updates } : i)) })
  const removeItem = (id: string) => onUpdate({ language_items: items.filter((i: any) => i.id !== id) })
  const proficiencies = ['native', 'fluent', 'professional', 'conversational', 'basic']
  const labels = isAr ? ['أم', 'طلاقة', 'احترافي', 'محادثة', 'أساسي'] : ['Native', 'Fluent', 'Professional', 'Conversational', 'Basic']

  return (
    <div className="space-y-3">
      {items.map((item: any) => (
        <div key={item.id} className="border border-ivory/10 rounded-sm p-3 relative flex items-center gap-3">
          <button onClick={() => removeItem(item.id)} className="p-1 hover:text-red-500"><Trash2 className="w-3.5 h-3.5" /></button>
          <input type="text" value={item.language} onChange={(e) => updateItem(item.id, { language: e.target.value })} placeholder={isAr ? 'اللغة' : 'Language'} className="flex-1 text-xs bg-ivory/5 border border-ivory/10 rounded px-2 py-1.5" />
          <select value={item.proficiency} onChange={(e) => updateItem(item.id, { proficiency: e.target.value })} className="text-xs bg-ivory/5 border border-ivory/10 rounded px-2 py-1.5">
            {proficiencies.map((p, i) => <option key={p} value={p}>{labels[i]}</option>)}
          </select>
        </div>
      ))}
      <button onClick={addItem} className="text-xs text-emerald-brand hover:underline flex items-center gap-1"><Plus className="w-3 h-3" /> {isAr ? 'إضافة لغة' : 'Add Language'}</button>
    </div>
  )
}

function CertificationsEditor({ data, onUpdate, isAr }: { data: any; onUpdate: (d: any) => void; isAr: boolean }) {
  const items: any[] = data.cert_items || []
  const addItem = () => onUpdate({ cert_items: [...items, { id: crypto.randomUUID(), name: '', issuer: '', date: '' }] })
  const updateItem = (id: string, updates: any) => onUpdate({ cert_items: items.map((i: any) => (i.id === id ? { ...i, ...updates } : i)) })
  const removeItem = (id: string) => onUpdate({ cert_items: items.filter((i: any) => i.id !== id) })

  return (
    <div className="space-y-3">
      {items.map((item: any) => (
        <div key={item.id} className="border border-ivory/10 rounded-sm p-3 relative">
          <button onClick={() => removeItem(item.id)} className="absolute top-2 right-2 p-1 hover:text-red-500"><Trash2 className="w-3.5 h-3.5" /></button>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <Field label={isAr ? 'اسم الشهادة' : 'Name'} value={item.name} onChange={(v: string) => updateItem(item.id, { name: v })} isAr={isAr} />
            <Field label={isAr ? 'الجهة المانحة' : 'Issuer'} value={item.issuer} onChange={(v: string) => updateItem(item.id, { issuer: v })} isAr={isAr} />
            <Field label={isAr ? 'التاريخ' : 'Date'} value={item.date} onChange={(v: string) => updateItem(item.id, { date: v })} isAr={isAr} />
            <Field label="URL" value={item.url || ''} onChange={(v: string) => updateItem(item.id, { url: v })} isAr={isAr} />
          </div>
        </div>
      ))}
      <button onClick={addItem} className="text-xs text-emerald-brand hover:underline flex items-center gap-1"><Plus className="w-3 h-3" /> {isAr ? 'إضافة شهادة' : 'Add Certification'}</button>
    </div>
  )
}

function ProjectsEditor({ data, onUpdate, isAr }: { data: any; onUpdate: (d: any) => void; isAr: boolean }) {
  const items: any[] = data.project_items || []
  const addItem = () => onUpdate({ project_items: [...items, { id: crypto.randomUUID(), name: '', description_en: '', description_ar: '', technologies: [], url: '', github_url: '' }] })
  const updateItem = (id: string, updates: any) => onUpdate({ project_items: items.map((i: any) => (i.id === id ? { ...i, ...updates } : i)) })
  const removeItem = (id: string) => onUpdate({ project_items: items.filter((i: any) => i.id !== id) })

  return (
    <div className="space-y-3">
      {items.map((item: any) => (
        <div key={item.id} className="border border-ivory/10 rounded-sm p-3 relative">
          <button onClick={() => removeItem(item.id)} className="absolute top-2 right-2 p-1 hover:text-red-500"><Trash2 className="w-3.5 h-3.5" /></button>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <Field label={isAr ? 'اسم المشروع' : 'Project Name'} value={item.name} onChange={(v: string) => updateItem(item.id, { name: v })} isAr={isAr} />
            <Field label="URL" value={item.url || ''} onChange={(v: string) => updateItem(item.id, { url: v })} isAr={isAr} />
            <TextAreaField label={isAr ? 'الوصف (English)' : 'Description (English)'} value={item.description_en} onChange={(v: string) => updateItem(item.id, { description_en: v })} isAr={isAr} />
            <TextAreaField label={isAr ? 'الوصف (عربي)' : 'Description (Arabic)'} value={item.description_ar} onChange={(v: string) => updateItem(item.id, { description_ar: v })} isAr={isAr} />
          </div>
        </div>
      ))}
      <button onClick={addItem} className="text-xs text-emerald-brand hover:underline flex items-center gap-1"><Plus className="w-3 h-3" /> {isAr ? 'إضافة مشروع' : 'Add Project'}</button>
    </div>
  )
}

function CustomEditor({ data, onUpdate, isAr }: { data: any; onUpdate: (d: any) => void; isAr: boolean }) {
  return (
    <div className="grid gap-3">
      <TextAreaField label={isAr ? 'المحتوى (English)' : 'Content (English)'} value={data.custom_content_en || ''} onChange={(v: string) => onUpdate({ custom_content_en: v })} isAr={isAr} rows={6} />
      <TextAreaField label={isAr ? 'المحتوى (عربي)' : 'Content (Arabic)'} value={data.custom_content_ar || ''} onChange={(v: string) => onUpdate({ custom_content_ar: v })} isAr={isAr} rows={6} />
    </div>
  )
}

/* ── Shared Form Fields ─────────────────────────────────── */

function Field({ label, value, onChange, isAr: _isAr, className }: { label: string; value: string; onChange: (v: string) => void; isAr: boolean; className?: string }) {
  return (
    <div className={className}>
      <label className="text-[10px] font-mono text-muted-foreground block mb-0.5">{label}</label>
      <input type="text" value={value} onChange={(e) => onChange(e.target.value)} className="w-full text-xs bg-ivory/5 border border-ivory/10 rounded px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-emerald-brand" />
    </div>
  )
}

function TextAreaField({ label, value, onChange, isAr: _isAr, rows = 3 }: { label: string; value: string; onChange: (v: string) => void; isAr: boolean; rows?: number }) {
  return (
    <div>
      <label className="text-[10px] font-mono text-muted-foreground block mb-0.5">{label}</label>
      <textarea rows={rows} value={value} onChange={(e) => onChange(e.target.value)} className="w-full text-xs bg-ivory/5 border border-ivory/10 rounded px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-emerald-brand resize-y" />
    </div>
  )
}

/* ── Professional CV Preview ────────────────────────────── */

function PreviewPane({ cv, previewLang, setPreviewLang, onClose, onDownloadPDF }: {
  cv: CVData; previewLang: 'en' | 'ar'; setPreviewLang: (l: 'en' | 'ar') => void; onClose: () => void; onDownloadPDF: () => void;
}) {
  const cvRef = useRef<HTMLDivElement>(null)
  const isAr = previewLang === 'ar'
  const sections = cv.sections.filter(s => s.enabled).sort((a, b) => a.order - b.order)
  const { theme_color, font_family, spacing } = cv.settings

  const spacingGap = spacing === 'compact' ? '5px' : spacing === 'relaxed' ? '12px' : '8px'
  const fontFamily = font_family === 'ibm-plex' ? '"IBM Plex Sans Arabic", Inter, sans-serif' : font_family === 'geist' ? 'Geist, Inter, sans-serif' : font_family === 'merriweather' ? 'Merriweather, Georgia, serif' : font_family === 'georgia' ? 'Georgia, "Times New Roman", serif' : 'Inter, system-ui, sans-serif'

  const downloadHTML = () => {
    const el = cvRef.current
    if (!el) return
    const title = isAr ? 'السيرة الذاتية' : 'Resume'
    const fontImports = `
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=IBM+Plex+Sans+Arabic:wght@300;400;500;600;700&family=Merriweather:ital,wght@0,300;0,400;0,700;1,300&display=swap');
    `

    const htmlContent = `<!DOCTYPE html>
<html lang="${previewLang}" dir="${isAr ? 'rtl' : 'ltr'}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    ${fontImports}
    
    body {
      margin: 0;
      padding: 20px 0;
      background-color: #f3f4f6;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
    }

    /* Print styling to make it exactly A4 and remove margins/headers/footers */
    @page {
      size: A4 portrait;
      margin: 0;
    }

    @media print {
      body {
        background-color: #ffffff;
        padding: 0;
        margin: 0;
      }
      .cv-container {
        box-shadow: none !important;
        width: 210mm !important;
        height: auto !important;
        margin: 0 !important;
        padding: ${getTplCfg(cv.template, fontFamily, isAr).pagePad} !important;
      }
    }

    .cv-container {
      background-color: #ffffff;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
      width: 210mm;
      box-sizing: border-box;
    }
  </style>
</head>
<body>
  <div class="cv-container" style="font-family: ${fontFamily}; color: #1a1a1a; padding: ${getTplCfg(cv.template, fontFamily, isAr).pagePad};">
    ${el.innerHTML}
  </div>
</body>
</html>`

    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = previewLang === 'ar' ? 'السيرة_الذاتية.html' : 'resume.html'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
    toast.success(isAr ? 'تم تحميل ملف HTML بنجاح' : 'HTML file downloaded successfully')
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <button onClick={onClose} className="flex items-center gap-1.5 text-sm text-obsidian hover:text-emerald-brand transition-colors">
          <ArrowLeft className="w-4 h-4" /> {isAr ? 'عودة للتحرير' : 'Back to Editor'}
        </button>
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center border border-ivory/10 rounded-sm overflow-hidden">
            <button onClick={() => setPreviewLang('en')} className={`px-3 py-1.5 text-xs font-medium transition-colors ${previewLang === 'en' ? 'bg-emerald-brand text-white' : 'bg-white text-obsidian hover:bg-ivory/10'}`}>English</button>
            <button onClick={() => setPreviewLang('ar')} className={`px-3 py-1.5 text-xs font-medium transition-colors ${previewLang === 'ar' ? 'bg-emerald-brand text-white' : 'bg-white text-obsidian hover:bg-ivory/10'}`}>عربي</button>
          </div>
          <button onClick={downloadHTML} className="btn-outline text-xs py-2 px-3 flex items-center gap-1.5">
            <Download className="w-3.5 h-3.5" /> {isAr ? 'تحميل HTML' : 'Download HTML'}
          </button>
          <button onClick={onDownloadPDF} className="btn-emerald text-xs py-2 px-3 flex items-center gap-1.5">
            <Download className="w-3.5 h-3.5" /> {isAr ? 'تحميل PDF (صورة)' : 'Download PDF (Image)'}
          </button>
        </div>
      </div>

      <div className="overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0 pb-4">
        <div ref={cvRef} id="cv-preview" className="bg-white shadow-lg mx-auto" dir={isAr ? 'rtl' : 'ltr'}
          style={{ width: '210mm', maxWidth: '100%', fontFamily, color: '#1a1a1a' }}>
          <CVLayoutRenderer sections={sections} template={cv.template} themeColor={theme_color} isAr={isAr} fontFamily={fontFamily} spacingGap={spacingGap} />
        </div>
      </div>
    </div>
  )
}

/* ── Layout Renderer ─────────────────────────────────────── */

const SIDEBAR_SECTION_TYPES = new Set(['header', 'skills', 'languages', 'certifications'])

function CVLayoutRenderer({ sections, template, themeColor, isAr, fontFamily, spacingGap }: {
  sections: CVSection[]; template: string; themeColor: string; isAr: boolean; fontFamily: string; spacingGap: string;
}) {
  const cfg = getTplCfg(template, fontFamily, isAr)

  if (cfg.layout === 'sidebar' || cfg.layout === 'two-column') {
    const sidebarSections = sections.filter(s => SIDEBAR_SECTION_TYPES.has(s.type))
    const mainSections = sections.filter(s => !SIDEBAR_SECTION_TYPES.has(s.type))
    const bgColor = cfg.layout === 'two-column' ? (cfg.sidebarBg || '#1a1a2e') : themeColor
    const sideW = cfg.layout === 'two-column' ? '38%' : '32%'
    const mainW = cfg.layout === 'two-column' ? '62%' : '68%'

    return (
      <div style={{ display: 'flex', flexDirection: isAr ? 'row-reverse' : 'row', minHeight: '297mm' }}>
        <div style={{ width: sideW, backgroundColor: bgColor, color: '#ffffff', padding: '24pt 16pt', flexShrink: 0 }}>
          {sidebarSections.map(section => (
            <div key={section.id} style={{ marginBottom: spacingGap }}>
              <CVSectionRender section={section} themeColor={themeColor} isAr={isAr} fontFamily={fontFamily} template={template} sidebarMode />
            </div>
          ))}
        </div>
        <div style={{ width: mainW, padding: '24pt 20pt', backgroundColor: '#ffffff', color: '#1a1a1a' }}>
          {mainSections.map(section => (
            <div key={section.id} style={{ marginBottom: spacingGap }}>
              <CVSectionRender section={section} themeColor={themeColor} isAr={isAr} fontFamily={fontFamily} template={template} />
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (cfg.headerBanner) {
    const headerSection = sections.find(s => s.type === 'header')
    const restSections = sections.filter(s => s.type !== 'header')
    return (
      <>
        {headerSection && (
          <div style={{ backgroundColor: themeColor, padding: '28pt 24pt 20pt', color: '#ffffff' }}>
            <CVSectionRender section={headerSection} themeColor={themeColor} isAr={isAr} fontFamily={fontFamily} template={template} sidebarMode />
          </div>
        )}
        <div style={{ padding: '18pt 24pt' }}>
          {restSections.map(section => (
            <div key={section.id} style={{ marginBottom: spacingGap }}>
              <CVSectionRender section={section} themeColor={themeColor} isAr={isAr} fontFamily={fontFamily} template={template} />
            </div>
          ))}
        </div>
      </>
    )
  }

  return (
    <div style={{ padding: cfg.pagePad }}>
      {sections.map(section => (
        <div key={section.id} style={{ marginBottom: spacingGap }}>
          <CVSectionRender section={section} themeColor={themeColor} isAr={isAr} fontFamily={fontFamily} template={template} />
        </div>
      ))}
    </div>
  )
}

/* ── Section Renderers ──────────────────────────────────── */

function SectionTitle({ title, themeColor, cfg, isAr }: { title: string; themeColor: string; cfg: TplCfg; isAr: boolean }) {
  const color = cfg.sec.useColor ? themeColor : '#374151'
  const borderColor = cfg.sec.useBorder ? themeColor : '#d1d5db'
  const border = cfg.sec.borderW !== '0' ? `${cfg.sec.borderW} solid ${borderColor}` : 'none'
  const secAlign = isAr ? 'right' : cfg.sec.align
  return (
    <div style={{
      marginBottom: cfg.sec.mb,
      paddingBottom: cfg.sec.pb,
      borderBottom: cfg.accentBar ? 'none' : border,
      [isAr ? 'borderRight' : 'borderLeft']: cfg.accentBar ? `3pt solid ${themeColor}` : 'none',
      [isAr ? 'paddingRight' : 'paddingLeft']: cfg.accentBar ? '8pt' : '0',
      textAlign: secAlign as any,
    }}>
      <h2 style={{ fontSize: cfg.sec.size, fontWeight: 700, color, textTransform: cfg.sec.transform as any, letterSpacing: cfg.sec.spacing, margin: 0, fontFamily: cfg.hFont }}>{title}</h2>
    </div>
  )
}

function CVSectionRender({ section, themeColor, isAr, fontFamily, template, sidebarMode = false }: {
  section: CVSection; themeColor: string; isAr: boolean; fontFamily: string; template: string; sidebarMode?: boolean;
}) {
  const d = section.data as any
  const cfg = getTplCfg(template, fontFamily, isAr)
  const bColor = cfg.bullet.useTheme ? themeColor : '#6b7280'
  const inSidebar = sidebarMode

  if (section.type === 'header') {
    const iconColor = inSidebar ? 'rgba(255,255,255,0.8)' : (cfg.sec.useColor ? themeColor : '#6b7280')

    const row1: { icon: React.ReactNode; value: string; href?: string }[] = []
    if (d.location) row1.push({ icon: <MapPinIcon color={iconColor} />, value: d.location })
    if (d.email) row1.push({ icon: <MailIcon color={iconColor} />, value: d.email, href: `mailto:${d.email}` })
    if (d.phone) row1.push({ icon: <PhoneIcon color={iconColor} />, value: d.phone, href: `tel:${d.phone}` })

    const row2: { icon: React.ReactNode; value: string; href?: string }[] = []
    if (d.website) {
      row2.push({
        icon: <GlobeIcon color={iconColor} />,
        value: cleanUrlText(d.website, 'website'),
        href: getFullUrl(d.website, 'website')
      })
    }
    if (d.linkedin) {
      row2.push({
        icon: <LinkedInIcon color={iconColor} />,
        value: cleanUrlText(d.linkedin, 'linkedin'),
        href: getFullUrl(d.linkedin, 'linkedin')
      })
    }
    if (d.github) {
      row2.push({
        icon: <GitHubIcon color={iconColor} />,
        value: cleanUrlText(d.github, 'github'),
        href: getFullUrl(d.github, 'github')
      })
    }

    const alignment = isAr ? 'right' : (inSidebar ? 'left' : cfg.name.align)
    const justify = isAr ? 'flex-end' : (inSidebar ? 'flex-start' : cfg.contact.justify)
    const nameColor = inSidebar ? '#ffffff' : cfg.name.color
    const titleColor = inSidebar ? 'rgba(255,255,255,0.85)' : themeColor
    const contactColor = inSidebar ? 'rgba(255,255,255,0.75)' : '#6b7280'
    const contactLinkColor = inSidebar ? 'rgba(255,255,255,0.9)' : '#374151'

    return (
      <div style={{ marginBottom: cfg.gap.sec, textAlign: alignment as any }}>
        {d.name && <h1 style={{ fontSize: cfg.name.size, fontWeight: cfg.name.weight, color: nameColor, margin: 0, lineHeight: 1.2, letterSpacing: cfg.name.spacing, fontFamily: cfg.hFont }}>{d.name}</h1>}
        {(d.title_en || d.title_ar) && <p style={{ fontSize: cfg.title.size, color: titleColor, fontWeight: cfg.title.weight, margin: '2pt 0 0', fontFamily: cfg.bFont }}>{isAr && d.title_ar ? d.title_ar : d.title_en}</p>}
        
        {/* Row 1: Location, Email, Phone */}
        {row1.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: cfg.contact.gap, marginTop: '6pt', justifyContent: justify as any, fontSize: cfg.contact.size, color: contactColor, fontFamily: cfg.bFont }}>
            {row1.map((c, i) => (
              <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                {c.href ? (
                  <a href={c.href} target="_blank" rel="noopener noreferrer" style={{ color: contactLinkColor, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '12px', height: '12px' }}>{c.icon}</span>
                    <span>{c.value}</span>
                  </a>
                ) : (
                  <span style={{ color: contactLinkColor, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '12px', height: '12px' }}>{c.icon}</span>
                    <span>{c.value}</span>
                  </span>
                )}
                {i < row1.length - 1 && cfg.contact.sep && <span style={{ color: '#d1d5db', [isAr ? 'marginRight' : 'marginLeft']: '6px', [isAr ? 'marginLeft' : 'marginRight']: '2px' }}>{cfg.contact.sep}</span>}
              </span>
            ))}
          </div>
        )}

        {/* Row 2: Website, LinkedIn, GitHub */}
        {row2.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: cfg.contact.gap, marginTop: '4pt', justifyContent: justify as any, fontSize: cfg.contact.size, color: '#6b7280', fontFamily: cfg.bFont }}>
            {row2.map((c, i) => (
              <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                {c.href ? (
                  <a href={c.href} target="_blank" rel="noopener noreferrer" style={{ color: contactLinkColor, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '12px', height: '12px' }}>{c.icon}</span>
                    <span>{c.value}</span>
                  </a>
                ) : (
                  <span style={{ color: contactLinkColor, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '12px', height: '12px' }}>{c.icon}</span>
                    <span>{c.value}</span>
                  </span>
                )}
                {i < row2.length - 1 && cfg.contact.sep && <span style={{ color: '#d1d5db', [isAr ? 'marginRight' : 'marginLeft']: '6px', [isAr ? 'marginLeft' : 'marginRight']: '2px' }}>{cfg.contact.sep}</span>}
              </span>
            ))}
          </div>
        )}
      </div>
    )
  }

  if (section.type === 'summary') {
    const text = isAr && d.summary_ar ? d.summary_ar : d.summary_en
    if (!text) return null
    return (
      <div style={{ marginBottom: cfg.gap.sec }}>
        <SectionTitle title={isAr ? 'الملخص المهني' : 'Professional Summary'} themeColor={themeColor} cfg={cfg} isAr={isAr} />
        <p style={{ fontSize: cfg.body.size, lineHeight: cfg.body.lh, color: cfg.body.color, margin: 0, fontFamily: cfg.bFont, wordWrap: 'break-word', overflowWrap: 'break-word' }}>{text}</p>
      </div>
    )
  }

  if (section.type === 'experience') {
    const items: any[] = d.items || []
    if (!items.length) return null
    return (
      <div style={{ marginBottom: cfg.gap.sec }}>
        <SectionTitle title={isAr ? 'الخبرة المهنية' : 'Professional Experience'} themeColor={themeColor} cfg={cfg} isAr={isAr} />
        {items.map((item: any) => (
          <div key={item.id} style={{ marginBottom: cfg.gap.entry, pageBreakInside: 'avoid', background: cfg.entryBg || 'transparent', padding: cfg.entryBg ? '6pt 8pt' : '0', borderRadius: cfg.entryBg ? '2pt' : '0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '8px' }}>
              <h3 style={{ fontSize: cfg.entry.titleSize, fontWeight: cfg.entry.weight, color: '#111827', margin: 0, flexShrink: 1, minWidth: 0, wordWrap: 'break-word', overflowWrap: 'break-word', fontFamily: cfg.hFont }}>{item.role}</h3>
              <span style={{ fontSize: cfg.entry.dateSize, color: cfg.entry.dateColor, whiteSpace: 'nowrap', flexShrink: 0 }}>{item.start_date} — {item.current ? (isAr ? 'الحالي' : 'Present') : item.end_date}</span>
            </div>
            <p style={{ fontSize: cfg.entry.coSize, color: '#6b7280', margin: '1pt 0 3pt', fontFamily: cfg.bFont }}>{item.company}</p>
            {((isAr ? item.achievements_ar : item.achievements_en)?.length > 0) && (
              <ul style={{ margin: '3pt 0 0', paddingLeft: isAr ? 0 : '14pt', paddingRight: isAr ? '14pt' : 0, listStyle: 'none', padding: 0 }}>
                {(isAr ? item.achievements_ar : item.achievements_en).map((ach: string, i: number) => (
                  <li key={i} style={{ fontSize: cfg.body.size, color: cfg.body.color, lineHeight: cfg.body.lh, marginBottom: '2pt', wordWrap: 'break-word', overflowWrap: 'break-word', display: 'flex', gap: '4pt', flexDirection: isAr ? 'row-reverse' : 'row', fontFamily: cfg.bFont }}>
                    <span style={{ color: bColor, flexShrink: 0, fontSize: cfg.bullet.size, lineHeight: String(cfg.body.lh) }}>{cfg.bullet.ch}</span><span>{ach}</span>
                  </li>
                ))}
              </ul>
            )}
            {cfg.tech.show && item.technologies?.length > 0 && <div style={{ display: 'flex', flexWrap: 'wrap', gap: '3pt', marginTop: '3pt' }}>{item.technologies.map((t: string) => <span key={t} style={{ fontSize: cfg.tech.size, padding: cfg.tech.pad, borderRadius: cfg.tech.rad, backgroundColor: `${themeColor}14`, color: themeColor, fontWeight: 500 }}>{t}</span>)}</div>}
          </div>
        ))}
      </div>
    )
  }

  if (section.type === 'education') {
    const items: any[] = d.education_items || []
    if (!items.length) return null
    return (
      <div style={{ marginBottom: cfg.gap.sec }}>
        <SectionTitle title={isAr ? 'التعليم' : 'Education'} themeColor={themeColor} cfg={cfg} isAr={isAr} />
        {items.map((item: any) => (
          <div key={item.id} style={{ marginBottom: cfg.gap.entry, pageBreakInside: 'avoid' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '8px' }}>
              <h3 style={{ fontSize: cfg.entry.titleSize, fontWeight: cfg.entry.weight, color: '#111827', margin: 0, flexShrink: 1, minWidth: 0, wordWrap: 'break-word', overflowWrap: 'break-word', fontFamily: cfg.hFont }}>{item.degree}{item.field ? ` in ${item.field}` : ''}</h3>
              <span style={{ fontSize: cfg.entry.dateSize, color: cfg.entry.dateColor, whiteSpace: 'nowrap', flexShrink: 0 }}>{item.start_date} — {item.end_date || (isAr ? 'الحالي' : 'Present')}</span>
            </div>
            <p style={{ fontSize: cfg.entry.coSize, color: '#6b7280', margin: '1pt 0', fontFamily: cfg.bFont }}>{item.institution}</p>
            {item.grade && <p style={{ fontSize: cfg.entry.dateSize, color: '#9ca3af', margin: 0, fontFamily: cfg.bFont }}>{isAr ? 'التقدير' : 'Grade'}: {item.grade}</p>}
          </div>
        ))}
      </div>
    )
  }

  if (section.type === 'skills') {
    const categories: any[] = d.skill_categories || []
    if (!categories.length) return null
    return (
      <div style={{ marginBottom: cfg.gap.sec }}>
        <SectionTitle title={isAr ? 'المهارات التقنية' : 'Technical Skills'} themeColor={themeColor} cfg={cfg} isAr={isAr} />
        {cfg.skills.layout === 'grid' ? (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4pt 16pt' }}>
            {categories.map((cat: any) => <div key={cat.id} style={{ fontSize: cfg.skills.size, wordWrap: 'break-word', overflowWrap: 'break-word', fontFamily: cfg.bFont }}><strong style={{ color: '#111827' }}>{cat.name}:</strong> <span style={{ color: cfg.body.color }}>{cat.skills.join(' · ')}</span></div>)}
          </div>
        ) : (
          <div style={{ fontSize: cfg.skills.size, fontFamily: cfg.bFont }}>
            {categories.map((cat: any, i: number) => <div key={cat.id} style={{ marginBottom: i < categories.length - 1 ? '3pt' : '0' }}><strong style={{ color: '#111827' }}>{cat.name}:</strong> <span style={{ color: cfg.body.color }}>{cat.skills.join(', ')}</span></div>)}
          </div>
        )}
      </div>
    )
  }

  if (section.type === 'projects') {
    const items: any[] = d.project_items || []
    if (!items.length) return null
    return (
      <div style={{ marginBottom: cfg.gap.sec }}>
        <SectionTitle title={isAr ? 'المشاريع' : 'Projects'} themeColor={themeColor} cfg={cfg} isAr={isAr} />
        {items.map((item: any) => (
          <div key={item.id} style={{ marginBottom: cfg.gap.entry, pageBreakInside: 'avoid', background: cfg.entryBg || 'transparent', padding: cfg.entryBg ? '6pt 8pt' : '0', borderRadius: cfg.entryBg ? '2pt' : '0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6pt', flexWrap: 'wrap' }}>
              <h3 style={{ fontSize: cfg.entry.titleSize, fontWeight: cfg.entry.weight, color: '#111827', margin: 0, wordWrap: 'break-word', overflowWrap: 'break-word', fontFamily: cfg.hFont }}>{item.name}</h3>
              {item.url && <a href={item.url} target="_blank" rel="noopener noreferrer" style={{ fontSize: '8pt', color: themeColor, textDecoration: 'none' }}>↗ {isAr ? 'معاينة' : 'Live'}</a>}
              {item.github_url && <a href={item.github_url} target="_blank" rel="noopener noreferrer" style={{ fontSize: '8pt', color: '#6b7280', textDecoration: 'none' }}>⌘ GitHub</a>}
            </div>
            <p style={{ fontSize: cfg.body.size, color: cfg.body.color, margin: '2pt 0', lineHeight: cfg.body.lh, wordWrap: 'break-word', overflowWrap: 'break-word', fontFamily: cfg.bFont }}>{isAr && item.description_ar ? item.description_ar : item.description_en}</p>
            {cfg.tech.show && item.technologies?.length > 0 && <div style={{ display: 'flex', flexWrap: 'wrap', gap: '3pt', marginTop: '2pt' }}>{item.technologies.map((t: string) => <span key={t} style={{ fontSize: cfg.tech.size, padding: cfg.tech.pad, borderRadius: cfg.tech.rad, backgroundColor: '#f3f4f6', color: '#6b7280' }}>{t}</span>)}</div>}
          </div>
        ))}
      </div>
    )
  }

  if (section.type === 'languages') {
    const items: any[] = d.language_items || []
    if (!items.length) return null
    const profLabels: Record<string, string> = isAr ? { native: 'اللغة الأم', fluent: 'طلاقة', professional: 'احترافي', conversational: 'محادثة', basic: 'أساسي' } : { native: 'Native', fluent: 'Fluent', professional: 'Professional', conversational: 'Conversational', basic: 'Basic' }
    return (
      <div style={{ marginBottom: cfg.gap.sec }}>
        <SectionTitle title={isAr ? 'اللغات' : 'Languages'} themeColor={themeColor} cfg={cfg} isAr={isAr} />
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10pt', fontSize: cfg.body.size, fontFamily: cfg.bFont }}>
          {items.map((item: any) => <span key={item.id} style={{ color: '#374151' }}><strong>{item.language}</strong> <span style={{ color: '#9ca3af' }}>— {profLabels[item.proficiency] || item.proficiency}</span></span>)}
        </div>
      </div>
    )
  }

  if (section.type === 'certifications') {
    const items: any[] = d.cert_items || []
    if (!items.length) return null
    return (
      <div style={{ marginBottom: cfg.gap.sec }}>
        <SectionTitle title={isAr ? 'الشهادات' : 'Certifications'} themeColor={themeColor} cfg={cfg} isAr={isAr} />
        {items.map((item: any) => (
          <div key={item.id} style={{ marginBottom: '4pt', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '8px' }}>
            <div style={{ flexShrink: 1, minWidth: 0, wordWrap: 'break-word', overflowWrap: 'break-word' }}>
              <span style={{ fontSize: cfg.entry.titleSize, fontWeight: 600, color: '#111827', fontFamily: cfg.hFont }}>{item.name}</span>
              <span style={{ fontSize: cfg.entry.coSize, color: '#6b7280', [isAr ? 'marginRight' : 'marginLeft']: '6pt', [isAr ? 'marginLeft' : 'marginRight']: 0 }}>— {item.issuer}</span>
            </div>
            <span style={{ fontSize: cfg.entry.dateSize, color: cfg.entry.dateColor, whiteSpace: 'nowrap', flexShrink: 0 }}>{item.date}</span>
          </div>
        ))}
      </div>
    )
  }

  if (section.type === 'custom') {
    const content = isAr && d.custom_content_ar ? d.custom_content_ar : d.custom_content_en
    if (!content) return null
    return (
      <div style={{ marginBottom: cfg.gap.sec }}>
        <SectionTitle title={isAr ? 'قسم مخصص' : 'Additional Information'} themeColor={themeColor} cfg={cfg} isAr={isAr} />
        <div style={{ fontSize: cfg.body.size, color: cfg.body.color, lineHeight: cfg.body.lh, fontFamily: cfg.bFont, wordWrap: 'break-word', overflowWrap: 'break-word' }} dangerouslySetInnerHTML={{ __html: content }} />
      </div>
    )
  }

  return null
}
