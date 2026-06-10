import { useState, useEffect } from 'react'
import { FileText, Plus, Save, Eye, Download, GripVertical, Trash2, ChevronDown, ChevronUp, Settings, ToggleLeft, ToggleRight } from 'lucide-react'
import { useLanguage } from '@/hooks/useLanguage'
import { useAuth } from '@/hooks/useAuth'
import { toast } from 'sonner'
import { supabase } from '@/services/api'
import type { CVData, CVSection } from '@/lib'

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
  const [activeSection, setActiveSection] = useState<string | null>(null)

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
      setCv(prev => ({ ...prev, user_id: user.id }))
    }
  }

  const saveCV = async () => {
    if (!user) return
    setSaving(true)
    try {
      const { error } = await supabase
        .from('cvs')
        .upsert({
          user_id: user.id,
          locale: cv.locale,
          sections: cv.sections,
          template: cv.template,
          settings: cv.settings,
          updated_at: new Date().toISOString(),
        })
      if (error) throw error
      toast.success(language === 'ar' ? 'تم حفظ السيرة الذاتية' : 'CV saved')
    } catch {
      toast.error(language === 'ar' ? 'فشل الحفظ' : 'Save failed')
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

  const generatePreview = () => {
    setPreview(true)
  }

  const downloadPDF = () => {
    window.print()
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
          <button onClick={generatePreview} className="btn-outline text-xs py-2 px-3">
            <Eye className="w-3.5 h-3.5" />
            <span className="hidden xs:inline ml-1">{isAr ? 'معاينة' : 'Preview'}</span>
          </button>
          <button onClick={downloadPDF} className="btn-outline text-xs py-2 px-3">
            <Download className="w-3.5 h-3.5" />
            <span className="hidden xs:inline ml-1">PDF</span>
          </button>
          <button onClick={saveCV} disabled={saving} className="btn-emerald text-xs py-2 px-3">
            <Save className="w-3.5 h-3.5" />
            <span className="hidden xs:inline ml-1">{isAr ? 'حفظ' : 'Save'}</span>
          </button>
        </div>
      </div>

      {preview ? (
        <PreviewPane cv={cv} language={language} onClose={() => setPreview(false)} />
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

function PreviewPane({ cv, language, onClose }: { cv: CVData; language: string; onClose: () => void }) {
  const isAr = language === 'ar'
  const sections = cv.sections.filter(s => s.enabled).sort((a, b) => a.order - b.order)
  const { theme_color, font_family, font_size, spacing, show_icons, show_borders, rtl } = cv.settings
  const spacingClass = spacing === 'compact' ? 'space-y-2' : spacing === 'relaxed' ? 'space-y-6' : 'space-y-4'
  const fontSizeClass = font_size === 'sm' ? 'text-xs' : font_size === 'lg' ? 'text-base' : 'text-sm'
  const previewDir = rtl ? 'rtl' : 'ltr'

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
        <h3 className="text-sm font-bold text-obsidian">{isAr ? 'معاينة السيرة الذاتية' : 'CV Preview'}</h3>
        <div className="flex gap-2">
          <button onClick={() => window.print()} className="btn-emerald text-xs py-2 px-3">
            <Download className="w-3.5 h-3.5" /> {isAr ? 'طباعة / PDF' : 'Print / PDF'}
          </button>
          <button onClick={onClose} className="btn-outline text-xs py-2 px-3">{isAr ? 'عودة' : 'Back'}</button>
        </div>
      </div>
      <div className="overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0">
        <div id="cv-preview" className="bg-white border border-gray-200 shadow-lg max-w-[210mm] w-full mx-auto" style={{ fontFamily: font_family === 'inter' ? 'Inter, sans-serif' : font_family === 'ibm-plex' ? '"IBM Plex Sans Arabic", sans-serif' : 'system-ui, sans-serif' }}>
          <div className={`p-4 sm:p-6 md:p-8 ${fontSizeClass} ${spacingClass}`} dir={previewDir}>
            {sections.map(section => (
              <SectionPreview key={section.id} section={section} themeColor={theme_color} showIcons={show_icons} showBorders={show_borders} isAr={isAr || rtl} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function SectionPreview({ section, themeColor, showIcons, showBorders, isAr }: { section: CVSection; themeColor: string; showIcons: boolean; showBorders: boolean; isAr: boolean }) {
  const data = section.data

  if (section.type === 'header') {
    return (
      <div className="text-center mb-6 pb-4" style={{ borderBottom: showBorders ? `1px solid ${themeColor}33` : 'none' }}>
        {data.name && <h1 className="text-2xl font-bold" style={{ color: themeColor }}>{data.name}</h1>}
        {(data.title_en || data.title_ar) && <p className="text-sm mt-1 text-gray-600">{isAr && data.title_ar ? data.title_ar : data.title_en}</p>}
        <div className="flex flex-wrap justify-center gap-3 mt-2 text-[10px] text-gray-500">
          {data.email && <span>{data.email}</span>}
          {data.phone && <span>{data.phone}</span>}
          {data.location && <span>{data.location}</span>}
          {data.linkedin && <span>{data.linkedin}</span>}
          {data.github && <span>{data.github}</span>}
        </div>
      </div>
    )
  }

  if (section.type === 'summary') {
    return (
      <div className="mb-4">
        <h2 className="text-sm font-bold mb-2" style={{ color: themeColor }}>{isAr ? 'ملخص' : 'Summary'}</h2>
        <p className="text-xs text-gray-600 leading-relaxed">{isAr && data.summary_ar ? data.summary_ar : data.summary_en}</p>
      </div>
    )
  }

  if (section.type === 'experience') {
    const items: any[] = data.items || []
    return (
      <div className="mb-4">
        <h2 className="text-sm font-bold mb-3" style={{ color: themeColor }}>{isAr ? 'الخبرة المهنية' : 'Experience'}</h2>
        {items.map((item: any) => (
          <div key={item.id} className="mb-3 pb-3" style={{ borderBottom: showBorders ? '1px solid #e5e7eb' : 'none' }}>
            <div className="flex justify-between items-baseline">
              <h3 className="text-xs font-semibold">{item.role}</h3>
              <span className="text-[10px] text-gray-400">{item.start_date} - {item.current ? (isAr ? 'حالياً' : 'Present') : item.end_date}</span>
            </div>
            <p className="text-[10px] text-gray-500">{item.company}</p>
          </div>
        ))}
      </div>
    )
  }

  if (section.type === 'education') {
    const items: any[] = data.education_items || []
    return (
      <div className="mb-4">
        <h2 className="text-sm font-bold mb-3" style={{ color: themeColor }}>{isAr ? 'التعليم' : 'Education'}</h2>
        {items.map((item: any) => (
          <div key={item.id} className="mb-2">
            <h3 className="text-xs font-semibold">{item.degree} in {item.field}</h3>
            <p className="text-[10px] text-gray-500">{item.institution} - {item.start_date} to {item.end_date || (isAr ? 'حالياً' : 'Present')}</p>
            {item.grade && <p className="text-[10px] text-gray-400">{isAr ? 'التقدير' : 'Grade'}: {item.grade}</p>}
          </div>
        ))}
      </div>
    )
  }

  if (section.type === 'skills') {
    const categories: any[] = data.skill_categories || []
    return (
      <div className="mb-4">
        <h2 className="text-sm font-bold mb-3" style={{ color: themeColor }}>{isAr ? 'المهارات' : 'Skills'}</h2>
        <div className="space-y-2">
          {categories.map((cat: any) => (
            <div key={cat.id}>
              <h3 className="text-[11px] font-semibold text-gray-700">{cat.name}</h3>
              <div className="flex flex-wrap gap-1 mt-1">
                {cat.skills.map((skill: string) => (
                  <span key={skill} className="text-[10px] bg-gray-100 px-2 py-0.5 rounded text-gray-600">{skill}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (section.type === 'languages') {
    const items: any[] = data.language_items || []
    const proficiencyLabels = isAr ? { native: 'أم', fluent: 'طلاقة', professional: 'احترافي', conversational: 'محادثة', basic: 'أساسي' } : { native: 'Native', fluent: 'Fluent', professional: 'Professional', conversational: 'Conversational', basic: 'Basic' }
    return (
      <div className="mb-4">
        <h2 className="text-sm font-bold mb-2" style={{ color: themeColor }}>{isAr ? 'اللغات' : 'Languages'}</h2>
        {items.map((item: any) => (
          <div key={item.id} className="flex justify-between text-xs">
            <span>{item.language}</span>
            <span className="text-gray-500">{proficiencyLabels[item.proficiency as keyof typeof proficiencyLabels]}</span>
          </div>
        ))}
      </div>
    )
  }

  if (section.type === 'certifications') {
    const items: any[] = data.cert_items || []
    return (
      <div className="mb-4">
        <h2 className="text-sm font-bold mb-3" style={{ color: themeColor }}>{isAr ? 'الشهادات' : 'Certifications'}</h2>
        {items.map((item: any) => (
          <div key={item.id} className="mb-2">
            <h3 className="text-xs font-semibold">{item.name}</h3>
            <p className="text-[10px] text-gray-500">{item.issuer} - {item.date}</p>
          </div>
        ))}
      </div>
    )
  }

  if (section.type === 'projects') {
    const items: any[] = data.project_items || []
    return (
      <div className="mb-4">
        <h2 className="text-sm font-bold mb-3" style={{ color: themeColor }}>{isAr ? 'المشاريع' : 'Projects'}</h2>
        {items.map((item: any) => (
          <div key={item.id} className="mb-2">
            <h3 className="text-xs font-semibold">{item.name}</h3>
            <p className="text-[10px] text-gray-600">{isAr && item.description_ar ? item.description_ar : item.description_en}</p>
          </div>
        ))}
      </div>
    )
  }

  if (section.type === 'custom') {
    return (
      <div className="mb-4">
        <h2 className="text-sm font-bold mb-2" style={{ color: themeColor }}>{isAr ? 'قسم مخصص' : 'Custom Section'}</h2>
        <div className="text-xs text-gray-600" dangerouslySetInnerHTML={{ __html: isAr && data.custom_content_ar ? data.custom_content_ar : data.custom_content_en }} />
      </div>
    )
  }

  return null
}
