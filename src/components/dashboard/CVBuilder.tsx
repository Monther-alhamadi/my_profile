import { useState, useEffect, useRef, useCallback } from 'react'
import { FileText, Plus, Save, Eye, Download, GripVertical, Trash2, ChevronDown, ChevronUp, Settings, ToggleLeft, ToggleRight, RotateCcw, ArrowLeft, Mail, Phone, MapPin, Globe, Linkedin, Github, ExternalLink } from 'lucide-react'
import { useLanguage } from '@/hooks/useLanguage'
import { useAuth } from '@/hooks/useAuth'
import { toast } from 'sonner'
import { supabase } from '@/services/api'
import html2canvas from 'html2canvas'
import { jsPDF } from 'jspdf'
import type { CVData, CVSection } from '@/lib'
import { PROFILE_STATIC, EXPERIENCE_EN, EXPERIENCE_AR, SKILLS_EN, SKILLS_AR, PROJECTS_EN, PROJECTS_AR } from '@/lib/data-static'

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

function buildInitialSections(): CVSection[] {
  const sections = DEFAULT_SECTIONS.map(s => ({ ...s, data: { ...s.data } }))

  const header = sections.find(s => s.id === 'header')!
  header.data = {
    name: PROFILE_STATIC.name,
    title_en: PROFILE_STATIC.title_en,
    title_ar: PROFILE_STATIC.title_ar,
    email: PROFILE_STATIC.email,
    phone: '',
    location: PROFILE_STATIC.location,
    linkedin: PROFILE_STATIC.linkedin_url || '',
    github: PROFILE_STATIC.github_url || '',
    website: '',
  }

  const summary = sections.find(s => s.id === 'summary')!
  summary.data = {
    summary_en: PROFILE_STATIC.bio_en,
    summary_ar: PROFILE_STATIC.bio_ar,
  }

  const exp = sections.find(s => s.id === 'experience')!
  exp.data = {
    items: EXPERIENCE_EN.map((e, i) => {
      const ar = EXPERIENCE_AR[i]
      const parts = e.year.split(' - ')
      const end = parts[1]
      const current = end?.toLowerCase() === 'present'
      return {
        id: crypto.randomUUID(),
        role: e.title,
        company: e.company,
        start_date: parts[0] || '',
        end_date: current ? '' : (end || ''),
        current,
        description_en: e.description,
        description_ar: ar?.description || '',
        achievements_en: e.achievements,
        achievements_ar: ar?.achievements || [],
        technologies: [],
      }
    }),
  }

  const skills = sections.find(s => s.id === 'skills')!
  skills.data = {
    skill_categories: SKILLS_EN.map(s => ({
      id: crypto.randomUUID(),
      name: s.category,
      skills: s.technologies,
    })),
  }

  const projects = sections.find(s => s.id === 'projects')!
  projects.data = {
    project_items: PROJECTS_EN.map((p, i) => {
      const ar = PROJECTS_AR[i]
      const cvDesc = PROJECT_CV_DESCRIPTIONS[p.id]
      const links = PROJECT_LINKS[p.id] || {}
      return {
        id: crypto.randomUUID(),
        name: p.title,
        description_en: cvDesc?.en || p.solution,
        description_ar: cvDesc?.ar || ar?.solution || '',
        technologies: p.technologies,
        url: links.url || '',
        github_url: links.github_url || '',
      }
    }),
  }

  return sections
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
  const [exporting, setExporting] = useState(false)

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
      .single()
    if (error && error.code !== 'PGRST116') return
    if (data) {
      setCv(data as unknown as CVData)
    } else {
      setCv({
        user_id: user.id,
        locale: language,
        sections: buildInitialSections(),
        template: 'modern',
        settings: { ...DEFAULT_SETTINGS },
      })
    }
  }

  const refreshFromPortfolio = () => {
    setCv(prev => ({
      ...prev,
      sections: buildInitialSections(),
    }))
    toast.success(language === 'ar' ? 'تم تحديث البيانات من الملف الشخصي' : 'Data refreshed from portfolio')
  }

  const saveCV = async () => {
    if (!user) return
    setSaving(true)
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
      toast.success(language === 'ar' ? 'تم حفظ السيرة الذاتية بنجاح' : 'CV saved successfully')
    } catch (err: any) {
      console.error('CV save error:', err)
      toast.error(language === 'ar' ? `فشل الحفظ: ${err?.message || 'خطأ غير معروف'}` : `Save failed: ${err?.message || 'Unknown error'}`)
    } finally {
      setSaving(false)
    }
  }

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

  const isAr = language === 'ar'

  return (
    <div className="space-y-6" dir={isAr ? 'rtl' : 'ltr'}>
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:justify-between">
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-emerald-brand flex-shrink-0" />
          <h2 className="text-lg font-bold text-obsidian">
            {isAr ? 'بناء السيرة الذاتية' : 'CV Builder'}
          </h2>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setPreview(true)} className="btn-outline text-xs py-2 px-3">
            <Eye className="w-3.5 h-3.5" />
            <span className="hidden xs:inline ml-1">{isAr ? 'معاينة' : 'Preview'}</span>
          </button>
          <button onClick={refreshFromPortfolio} className="btn-outline text-xs py-2 px-3" title={isAr ? 'تحديث من الملف الشخصي' : 'Refresh from portfolio'}>
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden xs:inline ml-1">{isAr ? 'تحديث' : 'Refresh'}</span>
          </button>
          <button onClick={saveCV} disabled={saving} className="btn-emerald text-xs py-2 px-3">
            <Save className="w-3.5 h-3.5" />
            <span className="hidden xs:inline ml-1">{saving ? (isAr ? 'جاري الحفظ...' : 'Saving...') : (isAr ? 'حفظ' : 'Save')}</span>
          </button>
        </div>
      </div>

      {preview ? (
        <PreviewPane
          cv={cv}
          previewLang={previewLang}
          setPreviewLang={setPreviewLang}
          onClose={() => setPreview(false)}
          exporting={exporting}
          setExporting={setExporting}
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
    </div>
  )
}

/* ── Settings Panel ─────────────────────────────────────── */

function SettingsPanel({ cv, setCv, isAr }: { cv: CVData; setCv: (c: CVData) => void; isAr: boolean }) {
  return (
    <div className="border border-ivory/10 rounded-sm p-4 bg-white">
      <div className="flex items-center gap-2 mb-4">
        <Settings className="w-4 h-4 text-emerald-brand" />
        <h3 className="text-sm font-bold text-obsidian">{isAr ? 'الإعدادات' : 'Settings'}</h3>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div>
          <label className="text-xs font-mono text-muted-foreground">{isAr ? 'اللون الأساسي' : 'Theme Color'}</label>
          <input
            type="color"
            value={cv.settings.theme_color}
            onChange={(e) => setCv({ ...cv, settings: { ...cv.settings, theme_color: e.target.value } })}
            className="w-full h-8 rounded cursor-pointer mt-1"
          />
        </div>
        <div>
          <label className="text-xs font-mono text-muted-foreground">{isAr ? 'الخط' : 'Font'}</label>
          <select
            value={cv.settings.font_family}
            onChange={(e) => setCv({ ...cv, settings: { ...cv.settings, font_family: e.target.value as any } })}
            className="w-full text-xs bg-ivory/5 border border-ivory/10 rounded px-2 py-1.5 mt-1"
          >
            <option value="inter">Inter</option>
            <option value="ibm-plex">IBM Plex</option>
            <option value="system">System</option>
            <option value="geist">Geist</option>
          </select>
        </div>
        <div>
          <label className="text-xs font-mono text-muted-foreground">{isAr ? 'التباعد' : 'Spacing'}</label>
          <select
            value={cv.settings.spacing}
            onChange={(e) => setCv({ ...cv, settings: { ...cv.settings, spacing: e.target.value as any } })}
            className="w-full text-xs bg-ivory/5 border border-ivory/10 rounded px-2 py-1.5 mt-1"
          >
            <option value="compact">{isAr ? 'مضغوط' : 'Compact'}</option>
            <option value="normal">{isAr ? 'عادي' : 'Normal'}</option>
            <option value="relaxed">{isAr ? 'واسع' : 'Relaxed'}</option>
          </select>
        </div>
        <div>
          <label className="text-xs font-mono text-muted-foreground">{isAr ? 'القالب' : 'Template'}</label>
          <select
            value={cv.template}
            onChange={(e) => setCv({ ...cv, template: e.target.value as any })}
            className="w-full text-xs bg-ivory/5 border border-ivory/10 rounded px-2 py-1.5 mt-1"
          >
            <option value="modern">{isAr ? 'حديث' : 'Modern'}</option>
            <option value="classic">{isAr ? 'كلاسيكي' : 'Classic'}</option>
            <option value="minimal">{isAr ? 'بسيط' : 'Minimal'}</option>
            <option value="executive">{isAr ? 'تنفيذي' : 'Executive'}</option>
          </select>
        </div>
      </div>
    </div>
  )
}

/* ── Section Card ───────────────────────────────────────── */

function SectionCard({ section, index, total, isActive, isAr, onToggle, onMoveUp, onMoveDown, onToggleActive, onUpdate }: {
  section: CVSection; index: number; total: number; isActive: boolean; isAr: boolean;
  onToggle: () => void; onMoveUp: () => void; onMoveDown: () => void; onToggleActive: () => void; onUpdate: (data: any) => void;
}) {
  return (
    <div className={`border rounded-sm transition-all ${section.enabled ? 'border-ivory/10' : 'border-red-200 bg-red-50/30'} ${isActive ? 'ring-1 ring-emerald-brand' : ''}`}>
      <div className="flex items-center gap-1.5 px-3 py-2.5 bg-ivory/5">
        <GripVertical className="w-4 h-4 text-ivory/30 cursor-grab flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <h3 className={`text-sm font-semibold truncate ${section.enabled ? 'text-obsidian' : 'text-muted-foreground line-through'}`}>
            {section.title}
          </h3>
        </div>
        {!section.enabled && (
          <span className="text-[10px] text-red-500 whitespace-nowrap hidden sm:inline">{isAr ? 'معطل' : 'Disabled'}</span>
        )}
        <div className="flex items-center gap-0.5 sm:gap-1">
          <button onClick={onToggle} className="p-1 hover:text-emerald-brand transition-colors" title={isAr ? 'تفعيل/تعطيل' : 'Toggle'}>
            {section.enabled ? <ToggleRight className="w-4 h-4 text-emerald-brand" /> : <ToggleLeft className="w-4 h-4 text-ivory/30" />}
          </button>
          <button onClick={onMoveUp} disabled={index === 0} className="p-1 hover:text-emerald-brand transition-colors disabled:opacity-30">
            <ChevronUp className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
          <button onClick={onMoveDown} disabled={index === total - 1} className="p-1 hover:text-emerald-brand transition-colors disabled:opacity-30">
            <ChevronDown className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
          <button onClick={onToggleActive} className="p-1 hover:text-emerald-brand transition-colors">
            <Settings className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
      {isActive && (
        <div className="p-4 border-t border-ivory/10">
          <SectionEditor section={section} onUpdate={onUpdate} isAr={isAr} />
        </div>
      )}
    </div>
  )
}

/* ── Section Editor ─────────────────────────────────────── */

function SectionEditor({ section, onUpdate, isAr }: { section: CVSection; onUpdate: (data: any) => void; isAr: boolean }) {
  switch (section.type) {
    case 'header':
      return <HeaderEditor data={section.data} onUpdate={onUpdate} isAr={isAr} />
    case 'summary':
      return <SummaryEditor data={section.data} onUpdate={onUpdate} isAr={isAr} />
    case 'experience':
      return <ExperienceEditor data={section.data} onUpdate={onUpdate} isAr={isAr} />
    case 'education':
      return <EducationEditor data={section.data} onUpdate={onUpdate} isAr={isAr} />
    case 'skills':
      return <SkillsEditor data={section.data} onUpdate={onUpdate} isAr={isAr} />
    case 'languages':
      return <LanguagesEditor data={section.data} onUpdate={onUpdate} isAr={isAr} />
    case 'certifications':
      return <CertificationsEditor data={section.data} onUpdate={onUpdate} isAr={isAr} />
    case 'projects':
      return <ProjectsEditor data={section.data} onUpdate={onUpdate} isAr={isAr} />
    case 'custom':
      return <CustomEditor data={section.data} onUpdate={onUpdate} isAr={isAr} />
    default:
      return <p className="text-xs text-muted-foreground">{isAr ? 'لا يوجد محرر لهذا القسم' : 'No editor for this section'}</p>
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
  const addItem = () => {
    const newItem = { id: crypto.randomUUID(), role: '', company: '', start_date: '', end_date: '', current: false, description_en: '', description_ar: '', achievements_en: [], achievements_ar: [], technologies: [] }
    onUpdate({ items: [...items, newItem] })
  }
  const updateItem = (id: string, updates: any) => {
    onUpdate({ items: items.map((i: any) => (i.id === id ? { ...i, ...updates } : i)) })
  }
  const removeItem = (id: string) => {
    onUpdate({ items: items.filter((i: any) => i.id !== id) })
  }

  return (
    <div className="space-y-3">
      {items.map((item: any) => (
        <div key={item.id} className="border border-ivory/10 rounded-sm p-3 relative">
          <button onClick={() => removeItem(item.id)} className="absolute top-2 right-2 p-1 hover:text-red-500 transition-colors">
            <Trash2 className="w-3.5 h-3.5" />
          </button>
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-2">
            <TextAreaField label={isAr ? 'الوصف (English)' : 'Description (English)'} value={item.description_en || ''} onChange={(v: string) => updateItem(item.id, { description_en: v })} isAr={isAr} rows={2} />
            <TextAreaField label={isAr ? 'الوصف (عربي)' : 'Description (Arabic)'} value={item.description_ar || ''} onChange={(v: string) => updateItem(item.id, { description_ar: v })} isAr={isAr} rows={2} />
          </div>
          <TextAreaField label={isAr ? 'التقنيات المستخدمة (مفصولة بفاصلة)' : 'Technologies (comma-separated)'} value={item.technologies?.join(', ') || ''} onChange={(v: string) => updateItem(item.id, { technologies: v.split(',').map((s: string) => s.trim()).filter(Boolean) })} isAr={isAr} rows={1} />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
            <TextAreaField label={isAr ? 'الإنجازات (English, كل إنجاز بسطر)' : 'Achievements (English, one per line)'} value={item.achievements_en?.join('\n') || ''} onChange={(v: string) => updateItem(item.id, { achievements_en: v.split('\n').map((s: string) => s.trim()).filter(Boolean) })} isAr={isAr} rows={3} />
            <TextAreaField label={isAr ? 'الإنجازات (عربي, كل إنجاز بسطر)' : 'Achievements (Arabic, one per line)'} value={item.achievements_ar?.join('\n') || ''} onChange={(v: string) => updateItem(item.id, { achievements_ar: v.split('\n').map((s: string) => s.trim()).filter(Boolean) })} isAr={isAr} rows={3} />
          </div>
        </div>
      ))}
      <button onClick={addItem} className="text-xs text-emerald-brand hover:underline flex items-center gap-1">
        <Plus className="w-3 h-3" /> {isAr ? 'إضافة خبرة' : 'Add Experience'}
      </button>
    </div>
  )
}

function EducationEditor({ data, onUpdate, isAr }: { data: any; onUpdate: (d: any) => void; isAr: boolean }) {
  const items: any[] = data.education_items || []
  const addItem = () => {
    const newItem = { id: crypto.randomUUID(), degree: '', field: '', institution: '', start_date: '', end_date: '', grade: '' }
    onUpdate({ education_items: [...items, newItem] })
  }
  const updateItem = (id: string, updates: any) => {
    onUpdate({ education_items: items.map((i: any) => (i.id === id ? { ...i, ...updates } : i)) })
  }
  const removeItem = (id: string) => {
    onUpdate({ education_items: items.filter((i: any) => i.id !== id) })
  }

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
      <button onClick={addItem} className="text-xs text-emerald-brand hover:underline flex items-center gap-1">
        <Plus className="w-3 h-3" /> {isAr ? 'إضافة تعليم' : 'Add Education'}
      </button>
    </div>
  )
}

function SkillsEditor({ data, onUpdate, isAr }: { data: any; onUpdate: (d: any) => void; isAr: boolean }) {
  const categories: any[] = data.skill_categories || []
  const addCategory = () => {
    const newCat = { id: crypto.randomUUID(), name: '', skills: [] }
    onUpdate({ skill_categories: [...categories, newCat] })
  }
  const updateCategory = (id: string, updates: any) => {
    onUpdate({ skill_categories: categories.map((c: any) => (c.id === id ? { ...c, ...updates } : c)) })
  }
  const removeCategory = (id: string) => {
    onUpdate({ skill_categories: categories.filter((c: any) => c.id !== id) })
  }

  return (
    <div className="space-y-3">
      {categories.map((cat: any) => (
        <div key={cat.id} className="border border-ivory/10 rounded-sm p-3 relative">
          <button onClick={() => removeCategory(cat.id)} className="absolute top-2 right-2 p-1 hover:text-red-500"><Trash2 className="w-3.5 h-3.5" /></button>
          <Field label={isAr ? 'اسم الفئة' : 'Category Name'} value={cat.name} onChange={(v: string) => updateCategory(cat.id, { name: v })} isAr={isAr} className="mb-2" />
          <TextAreaField label={isAr ? 'المهارات (مفصولة بفاصلة)' : 'Skills (comma-separated)'} value={cat.skills.join(', ')} onChange={(v: string) => updateCategory(cat.id, { skills: v.split(',').map((s: string) => s.trim()).filter(Boolean) })} isAr={isAr} />
        </div>
      ))}
      <button onClick={addCategory} className="text-xs text-emerald-brand hover:underline flex items-center gap-1">
        <Plus className="w-3 h-3" /> {isAr ? 'إضافة فئة' : 'Add Category'}
      </button>
    </div>
  )
}

function LanguagesEditor({ data, onUpdate, isAr }: { data: any; onUpdate: (d: any) => void; isAr: boolean }) {
  const items: any[] = data.language_items || []
  const addItem = () => {
    const newItem = { id: crypto.randomUUID(), language: '', proficiency: 'professional' }
    onUpdate({ language_items: [...items, newItem] })
  }
  const updateItem = (id: string, updates: any) => {
    onUpdate({ language_items: items.map((i: any) => (i.id === id ? { ...i, ...updates } : i)) })
  }
  const removeItem = (id: string) => {
    onUpdate({ language_items: items.filter((i: any) => i.id !== id) })
  }

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
      <button onClick={addItem} className="text-xs text-emerald-brand hover:underline flex items-center gap-1">
        <Plus className="w-3 h-3" /> {isAr ? 'إضافة لغة' : 'Add Language'}
      </button>
    </div>
  )
}

function CertificationsEditor({ data, onUpdate, isAr }: { data: any; onUpdate: (d: any) => void; isAr: boolean }) {
  const items: any[] = data.cert_items || []
  const addItem = () => {
    const newItem = { id: crypto.randomUUID(), name: '', issuer: '', date: '' }
    onUpdate({ cert_items: [...items, newItem] })
  }
  const updateItem = (id: string, updates: any) => {
    onUpdate({ cert_items: items.map((i: any) => (i.id === id ? { ...i, ...updates } : i)) })
  }
  const removeItem = (id: string) => {
    onUpdate({ cert_items: items.filter((i: any) => i.id !== id) })
  }

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
      <button onClick={addItem} className="text-xs text-emerald-brand hover:underline flex items-center gap-1">
        <Plus className="w-3 h-3" /> {isAr ? 'إضافة شهادة' : 'Add Certification'}
      </button>
    </div>
  )
}

function ProjectsEditor({ data, onUpdate, isAr }: { data: any; onUpdate: (d: any) => void; isAr: boolean }) {
  const items: any[] = data.project_items || []
  const addItem = () => {
    const newItem = { id: crypto.randomUUID(), name: '', description_en: '', description_ar: '', technologies: [], url: '', github_url: '' }
    onUpdate({ project_items: [...items, newItem] })
  }
  const updateItem = (id: string, updates: any) => {
    onUpdate({ project_items: items.map((i: any) => (i.id === id ? { ...i, ...updates } : i)) })
  }
  const removeItem = (id: string) => {
    onUpdate({ project_items: items.filter((i: any) => i.id !== id) })
  }

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
      <button onClick={addItem} className="text-xs text-emerald-brand hover:underline flex items-center gap-1">
        <Plus className="w-3 h-3" /> {isAr ? 'إضافة مشروع' : 'Add Project'}
      </button>
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

function Field({ label, value, onChange, isAr, className }: { label: string; value: string; onChange: (v: string) => void; isAr: boolean; className?: string }) {
  return (
    <div className={className}>
      <label className="text-[10px] font-mono text-muted-foreground block mb-0.5">{label}</label>
      <input type="text" value={value} onChange={(e) => onChange(e.target.value)} className="w-full text-xs bg-ivory/5 border border-ivory/10 rounded px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-emerald-brand" />
    </div>
  )
}

function TextAreaField({ label, value, onChange, isAr, rows = 3 }: { label: string; value: string; onChange: (v: string) => void; isAr: boolean; rows?: number }) {
  return (
    <div>
      <label className="text-[10px] font-mono text-muted-foreground block mb-0.5">{label}</label>
      <textarea rows={rows} value={value} onChange={(e) => onChange(e.target.value)} className="w-full text-xs bg-ivory/5 border border-ivory/10 rounded px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-emerald-brand resize-y" />
    </div>
  )
}

/* ── Professional CV Preview ────────────────────────────── */

function PreviewPane({ cv, previewLang, setPreviewLang, onClose, exporting, setExporting }: {
  cv: CVData; previewLang: 'en' | 'ar'; setPreviewLang: (l: 'en' | 'ar') => void; onClose: () => void; exporting: boolean; setExporting: (e: boolean) => void;
}) {
  const cvRef = useRef<HTMLDivElement>(null)
  const isAr = previewLang === 'ar'
  const sections = cv.sections.filter(s => s.enabled).sort((a, b) => a.order - b.order)
  const { theme_color, font_family, spacing } = cv.settings

  const spacingGap = spacing === 'compact' ? '6px' : spacing === 'relaxed' ? '16px' : '10px'
  const fontFamily = font_family === 'ibm-plex' ? '"IBM Plex Sans Arabic", Inter, sans-serif' : font_family === 'geist' ? 'Geist, Inter, sans-serif' : 'Inter, system-ui, sans-serif'

  const handleExportPDF = useCallback(async () => {
    const el = cvRef.current
    if (!el) return
    setExporting(true)
    try {
      const canvas = await html2canvas(el, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
        logging: false,
        windowWidth: 794,
      })
      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF('p', 'mm', 'a4')
      const pdfW = pdf.internal.pageSize.getWidth()
      const pdfH = pdf.internal.pageSize.getHeight()
      const imgW = pdfW
      const imgH = (canvas.height * imgW) / canvas.width

      let y = 0
      while (y < imgH) {
        pdf.addImage(imgData, 'PNG', 0, -y, imgW, imgH)
        if (y + pdfH < imgH) pdf.addPage()
        y += pdfH
      }

      const fileName = isAr ? 'السيرة_الذاتية.pdf' : 'cv.pdf'
      pdf.save(fileName)
      toast.success(isAr ? 'تم تحميل ملف PDF' : 'PDF downloaded')
    } catch (err) {
      console.error('PDF export error:', err)
      toast.error(isAr ? 'فشل تصدير PDF' : 'PDF export failed')
    } finally {
      setExporting(false)
    }
  }, [isAr, setExporting])

  return (
    <div>
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <button onClick={onClose} className="flex items-center gap-1.5 text-sm text-obsidian hover:text-emerald-brand transition-colors">
          <ArrowLeft className="w-4 h-4" />
          {isAr ? 'عودة للتحرير' : 'Back to Editor'}
        </button>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Language Toggle */}
          <div className="flex items-center border border-ivory/10 rounded-sm overflow-hidden">
            <button
              onClick={() => setPreviewLang('en')}
              className={`px-3 py-1.5 text-xs font-medium transition-colors ${previewLang === 'en' ? 'bg-emerald-brand text-white' : 'bg-white text-obsidian hover:bg-ivory/10'}`}
            >
              English
            </button>
            <button
              onClick={() => setPreviewLang('ar')}
              className={`px-3 py-1.5 text-xs font-medium transition-colors ${previewLang === 'ar' ? 'bg-emerald-brand text-white' : 'bg-white text-obsidian hover:bg-ivory/10'}`}
            >
              عربي
            </button>
          </div>

          <button onClick={handleExportPDF} disabled={exporting} className="btn-emerald text-xs py-2 px-3 flex items-center gap-1.5">
            <Download className="w-3.5 h-3.5" />
            {exporting ? (isAr ? 'جاري التصدير...' : 'Exporting...') : (isAr ? 'تحميل PDF' : 'Download PDF')}
          </button>
        </div>
      </div>

      {/* CV Preview */}
      <div className="overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0 pb-4">
        <div
          ref={cvRef}
          id="cv-preview"
          className="bg-white shadow-lg mx-auto"
          dir={isAr ? 'rtl' : 'ltr'}
          style={{
            width: '210mm',
            maxWidth: '100%',
            fontFamily,
            color: '#1a1a1a',
          }}
        >
          <div style={{ padding: '20px 24px' }}>
            {sections.map(section => (
              <CVSectionRender
                key={section.id}
                section={section}
                themeColor={theme_color}
                isAr={isAr}
                spacingGap={spacingGap}
                fontFamily={fontFamily}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

/* ── Professional Section Renderers ─────────────────────── */

function SectionTitle({ title, themeColor, isAr }: { title: string; themeColor: string; isAr: boolean }) {
  return (
    <div style={{ marginBottom: '8px', borderBottom: `2px solid ${themeColor}`, paddingBottom: '4px' }}>
      <h2
        style={{
          fontSize: '13px',
          fontWeight: 700,
          color: themeColor,
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          margin: 0,
          fontFamily: 'Inter, system-ui, sans-serif',
        }}
      >
        {title}
      </h2>
    </div>
  )
}

function CVSectionRender({ section, themeColor, isAr, spacingGap, fontFamily }: {
  section: CVSection; themeColor: string; isAr: boolean; spacingGap: string; fontFamily: string;
}) {
  const data = section.data

  /* ── Header ──────────────────────── */
  if (section.type === 'header') {
    const contactItems: { icon: JSX.Element; value: string; href?: string }[] = []
    if (data.email) contactItems.push({ icon: <Mail size={10} />, value: data.email, href: `mailto:${data.email}` })
    if (data.phone) contactItems.push({ icon: <Phone size={10} />, value: data.phone, href: `tel:${data.phone}` })
    if (data.location) contactItems.push({ icon: <MapPin size={10} />, value: data.location })
    if (data.website) contactItems.push({ icon: <Globe size={10} />, value: data.website, href: data.website.startsWith('http') ? data.website : `https://${data.website}` })
    if (data.linkedin) contactItems.push({ icon: <Linkedin size={10} />, value: data.linkedin.replace('https://linkedin.com/in/', ''), href: data.linkedin })
    if (data.github) contactItems.push({ icon: <Github size={10} />, value: data.github.replace('https://github.com/', ''), href: data.github })

    return (
      <div style={{ marginBottom: spacingGap, textAlign: isAr ? 'right' : 'center' }}>
        {data.name && (
          <h1 style={{
            fontSize: '22px',
            fontWeight: 800,
            color: '#111827',
            margin: 0,
            lineHeight: 1.2,
            fontFamily: 'Inter, system-ui, sans-serif',
          }}>
            {data.name}
          </h1>
        )}
        {(data.title_en || data.title_ar) && (
          <p style={{
            fontSize: '12px',
            color: themeColor,
            fontWeight: 500,
            margin: '2px 0 0',
            fontFamily: 'Inter, system-ui, sans-serif',
          }}>
            {isAr && data.title_ar ? data.title_ar : data.title_en}
          </p>
        )}
        {contactItems.length > 0 && (
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '8px',
            marginTop: '8px',
            justifyContent: isAr ? 'flex-end' : 'center',
            fontSize: '9px',
            color: '#6b7280',
            fontFamily: 'Inter, system-ui, sans-serif',
          }}>
            {contactItems.map((item, i) => (
              <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                <span style={{ color: themeColor, display: 'flex' }}>{item.icon}</span>
                {item.href ? (
                  <a href={item.href} target="_blank" rel="noopener noreferrer" style={{ color: '#374151', textDecoration: 'none' }}>
                    {item.value}
                  </a>
                ) : (
                  <span style={{ color: '#374151' }}>{item.value}</span>
                )}
              </span>
            ))}
          </div>
        )}
      </div>
    )
  }

  /* ── Summary ─────────────────────── */
  if (section.type === 'summary') {
    const text = isAr && data.summary_ar ? data.summary_ar : data.summary_en
    if (!text) return null
    return (
      <div style={{ marginBottom: spacingGap }}>
        <SectionTitle title={isAr ? 'الملخص Professional' : 'Professional Summary'} themeColor={themeColor} isAr={isAr} />
        <p style={{
          fontSize: '10.5px',
          lineHeight: 1.6,
          color: '#374151',
          margin: 0,
          fontFamily,
        }}>
          {text}
        </p>
      </div>
    )
  }

  /* ── Experience ──────────────────── */
  if (section.type === 'experience') {
    const items: any[] = data.items || []
    if (items.length === 0) return null
    return (
      <div style={{ marginBottom: spacingGap }}>
        <SectionTitle title={isAr ? 'الخبرة المهنية' : 'Professional Experience'} themeColor={themeColor} isAr={isAr} />
        {items.map((item: any) => (
          <div key={item.id} style={{ marginBottom: '10px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap' }}>
              <h3 style={{ fontSize: '11.5px', fontWeight: 700, color: '#111827', margin: 0, fontFamily: 'Inter, system-ui, sans-serif' }}>
                {item.role}
              </h3>
              <span style={{ fontSize: '9px', color: '#9ca3af', fontFamily: 'Inter, system-ui, sans-serif', whiteSpace: 'nowrap' }}>
                {item.start_date} — {item.current ? (isAr ? 'الحالي' : 'Present') : item.end_date}
              </span>
            </div>
            <p style={{ fontSize: '10px', color: '#6b7280', margin: '1px 0 4px', fontFamily: 'Inter, system-ui, sans-serif' }}>
              {item.company}
            </p>
            {item.description_en || item.description_ar ? (
              <p style={{ fontSize: '10px', color: '#4b5563', margin: '0 0 4px', lineHeight: 1.5, fontFamily }}>
                {isAr && item.description_ar ? item.description_ar : item.description_en}
              </p>
            ) : null}
            {((isAr ? item.achievements_ar : item.achievements_en)?.length > 0) && (
              <ul style={{ margin: '4px 0 0', paddingLeft: isAr ? 0 : '16px', paddingRight: isAr ? '16px' : 0, listStyleType: isAr ? 'none' : 'disc' }}>
                {(isAr ? item.achievements_ar : item.achievements_en).map((ach: string, i: number) => (
                  <li key={i} style={{ fontSize: '9.5px', color: '#4b5563', lineHeight: 1.5, marginBottom: '2px', fontFamily }}>
                    {isAr && <span style={{ marginRight: '4px' }}>◂</span>}
                    {ach}
                  </li>
                ))}
              </ul>
            )}
            {item.technologies?.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '4px' }}>
                {item.technologies.map((tech: string) => (
                  <span key={tech} style={{
                    fontSize: '8px',
                    padding: '1px 6px',
                    borderRadius: '3px',
                    backgroundColor: `${themeColor}12`,
                    color: themeColor,
                    fontWeight: 500,
                    fontFamily: 'Inter, system-ui, sans-serif',
                  }}>
                    {tech}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    )
  }

  /* ── Education ───────────────────── */
  if (section.type === 'education') {
    const items: any[] = data.education_items || []
    if (items.length === 0) return null
    return (
      <div style={{ marginBottom: spacingGap }}>
        <SectionTitle title={isAr ? 'التعليم' : 'Education'} themeColor={themeColor} isAr={isAr} />
        {items.map((item: any) => (
          <div key={item.id} style={{ marginBottom: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap' }}>
              <h3 style={{ fontSize: '11px', fontWeight: 700, color: '#111827', margin: 0, fontFamily: 'Inter, system-ui, sans-serif' }}>
                {item.degree}{item.field ? ` in ${item.field}` : ''}
              </h3>
              <span style={{ fontSize: '9px', color: '#9ca3af', fontFamily: 'Inter, system-ui, sans-serif' }}>
                {item.start_date} — {item.end_date || (isAr ? 'الحالي' : 'Present')}
              </span>
            </div>
            <p style={{ fontSize: '10px', color: '#6b7280', margin: '1px 0', fontFamily: 'Inter, system-ui, sans-serif' }}>
              {item.institution}
            </p>
            {item.grade && (
              <p style={{ fontSize: '9px', color: '#9ca3af', margin: 0, fontFamily: 'Inter, system-ui, sans-serif' }}>
                {isAr ? 'التقدير' : 'Grade'}: {item.grade}
              </p>
            )}
          </div>
        ))}
      </div>
    )
  }

  /* ── Skills ──────────────────────── */
  if (section.type === 'skills') {
    const categories: any[] = data.skill_categories || []
    if (categories.length === 0) return null
    return (
      <div style={{ marginBottom: spacingGap }}>
        <SectionTitle title={isAr ? 'المهارات التقنية' : 'Technical Skills'} themeColor={themeColor} isAr={isAr} />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px 16px' }}>
          {categories.map((cat: any) => (
            <div key={cat.id} style={{ fontSize: '10px' }}>
              <span style={{ fontWeight: 700, color: '#111827', fontFamily: 'Inter, system-ui, sans-serif' }}>
                {cat.name}:
              </span>{' '}
              <span style={{ color: '#4b5563', fontFamily }}>
                {cat.skills.join(' · ')}
              </span>
            </div>
          ))}
        </div>
      </div>
    )
  }

  /* ── Projects ────────────────────── */
  if (section.type === 'projects') {
    const items: any[] = data.project_items || []
    if (items.length === 0) return null
    return (
      <div style={{ marginBottom: spacingGap }}>
        <SectionTitle title={isAr ? 'المشاريع' : 'Projects'} themeColor={themeColor} isAr={isAr} />
        {items.map((item: any) => (
          <div key={item.id} style={{ marginBottom: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
              <h3 style={{ fontSize: '11px', fontWeight: 700, color: '#111827', margin: 0, fontFamily: 'Inter, system-ui, sans-serif' }}>
                {item.name}
              </h3>
              {item.url && (
                <a href={item.url} target="_blank" rel="noopener noreferrer" style={{ fontSize: '8px', color: themeColor, display: 'inline-flex', alignItems: 'center', gap: '2px', textDecoration: 'none' }}>
                  <ExternalLink size={8} /> {isAr ? 'معاينة' : 'Live'}
                </a>
              )}
              {item.github_url && (
                <a href={item.github_url} target="_blank" rel="noopener noreferrer" style={{ fontSize: '8px', color: '#6b7280', display: 'inline-flex', alignItems: 'center', gap: '2px', textDecoration: 'none' }}>
                  <Github size={8} /> GitHub
                </a>
              )}
            </div>
            <p style={{ fontSize: '9.5px', color: '#4b5563', margin: '2px 0', lineHeight: 1.5, fontFamily }}>
              {isAr && item.description_ar ? item.description_ar : item.description_en}
            </p>
            {item.technologies?.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '3px', marginTop: '3px' }}>
                {item.technologies.map((tech: string) => (
                  <span key={tech} style={{
                    fontSize: '7.5px',
                    padding: '1px 5px',
                    borderRadius: '2px',
                    backgroundColor: '#f3f4f6',
                    color: '#6b7280',
                    fontFamily: 'Inter, system-ui, sans-serif',
                  }}>
                    {tech}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    )
  }

  /* ── Languages ───────────────────── */
  if (section.type === 'languages') {
    const items: any[] = data.language_items || []
    if (items.length === 0) return null
    const profLabels: Record<string, string> = isAr
      ? { native: 'اللغة الأم', fluent: 'طلاقة', professional: 'احترافي', conversational: 'محادثة', basic: 'أساسي' }
      : { native: 'Native', fluent: 'Fluent', professional: 'Professional', conversational: 'Conversational', basic: 'Basic' }

    return (
      <div style={{ marginBottom: spacingGap }}>
        <SectionTitle title={isAr ? 'اللغات' : 'Languages'} themeColor={themeColor} isAr={isAr} />
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', fontSize: '10px' }}>
          {items.map((item: any) => (
            <span key={item.id} style={{ color: '#374151', fontFamily: 'Inter, system-ui, sans-serif' }}>
              <strong>{item.language}</strong>
              <span style={{ color: '#9ca3af', marginLeft: isAr ? 0 : '4px', marginRight: isAr ? '4px' : 0 }}>
                — {profLabels[item.proficiency] || item.proficiency}
              </span>
            </span>
          ))}
        </div>
      </div>
    )
  }

  /* ── Certifications ──────────────── */
  if (section.type === 'certifications') {
    const items: any[] = data.cert_items || []
    if (items.length === 0) return null
    return (
      <div style={{ marginBottom: spacingGap }}>
        <SectionTitle title={isAr ? 'الشهادات' : 'Certifications'} themeColor={themeColor} isAr={isAr} />
        {items.map((item: any) => (
          <div key={item.id} style={{ marginBottom: '6px', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <div>
              <span style={{ fontSize: '10.5px', fontWeight: 600, color: '#111827', fontFamily: 'Inter, system-ui, sans-serif' }}>
                {item.name}
              </span>
              <span style={{ fontSize: '9.5px', color: '#6b7280', marginLeft: isAr ? 0 : '6px', marginRight: isAr ? '6px' : 0, fontFamily: 'Inter, system-ui, sans-serif' }}>
                — {item.issuer}
              </span>
            </div>
            <span style={{ fontSize: '9px', color: '#9ca3af', fontFamily: 'Inter, system-ui, sans-serif', whiteSpace: 'nowrap' }}>
              {item.date}
            </span>
          </div>
        ))}
      </div>
    )
  }

  /* ── Custom ──────────────────────── */
  if (section.type === 'custom') {
    const content = isAr && data.custom_content_ar ? data.custom_content_ar : data.custom_content_en
    if (!content) return null
    return (
      <div style={{ marginBottom: spacingGap }}>
        <SectionTitle title={isAr ? 'قسم مخصص' : 'Additional Information'} themeColor={themeColor} isAr={isAr} />
        <div style={{ fontSize: '10px', color: '#374151', lineHeight: 1.6, fontFamily }} dangerouslySetInnerHTML={{ __html: content }} />
      </div>
    )
  }

  return null
}
