import { useState, useEffect } from 'react'
import { User, Save } from 'lucide-react'
import { useLanguage } from '@/hooks/useLanguage'
import { fetchProfile } from '@/services/portfolio-api'
import { useUpdateProfile } from '@/services/portfolio-queries'
import { uploadImage, getImagePath } from '@/services/storage'
import { useAuth } from '@/hooks/useAuth'
import type { ProfileData } from '@/lib'
import ImageUploader from './ImageUploader'
import { toast } from 'sonner'

export default function ProfileTab() {
  const { language } = useLanguage()
  const { user } = useAuth()
  const updateMut = useUpdateProfile()
  const [profile, setProfile] = useState<ProfileData | null>(null)
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({
    name: '', title_en: '', title_ar: '', bio_en: '', bio_ar: '',
    location: '', email: '', github_url: '', linkedin_url: '',
    facebook_url: '', cv_url: '',
  })
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [cvFile, setCvFile] = useState<File | null>(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchProfile().then(p => {
      if (p) {
        setProfile(p)
        setForm({
          name: p.name, title_en: p.title_en, title_ar: p.title_ar,
          bio_en: p.bio_en, bio_ar: p.bio_ar, location: p.location,
          email: p.email, github_url: p.github_url ?? '',
          linkedin_url: p.linkedin_url ?? '',
          facebook_url: p.facebook_url ?? '',
          cv_url: p.cv_url ?? '',
        })
      }
    }).catch(() => toast.error(language === 'ar' ? 'فشل تحميل البروفايل' : 'Failed to load profile'))
    .finally(() => setLoading(false))
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const handleSave = async () => {
    if (!profile?.id) return
    setSaving(true)
    const updates: Record<string, string | null> = { ...form }
    updates.github_url = updates.github_url || null
    updates.linkedin_url = updates.linkedin_url || null
    updates.facebook_url = updates.facebook_url || null
    updates.cv_url = updates.cv_url || null

    try {
      if (avatarFile && user) {
        const path = getImagePath(user.id, 'avatar', avatarFile.name)
        updates.avatar_url = await uploadImage(avatarFile, path)
      }
      if (cvFile && user) {
        const path = getImagePath(user.id, 'cv', cvFile.name)
        updates.cv_url = await uploadImage(cvFile, path)
      }
      await updateMut.mutateAsync({ id: profile.id, updates })
      toast.success(language === 'ar' ? 'تم حفظ البروفايل' : 'Profile saved')
    } catch {
      toast.error(language === 'ar' ? 'فشل الحفظ' : 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="text-center py-12 text-sm text-muted-foreground font-mono">{language === 'ar' ? 'جاري التحميل...' : 'Loading...'}</div>

  return (
    <div>
      <div className="flex items-center gap-2 mb-6">
        <User className="w-5 h-5 text-emerald-brand" />
        <h2 className="text-lg font-bold text-obsidian">{language === 'ar' ? 'الملف الشخصي' : 'Profile'}</h2>
      </div>

      <div className="max-w-2xl space-y-6">
        <div className="flex gap-6">
          <div className="w-32 flex-shrink-0">
            <label className="text-xs font-mono font-semibold text-muted-foreground mb-2 block">{language === 'ar' ? 'الصورة الرمزية' : 'Avatar'}</label>
            <ImageUploader currentUrl={profile?.avatar_url} onUpload={async (file) => setAvatarFile(file)} />
          </div>
          <div className="flex-1">
            <label className="text-xs font-mono font-semibold text-muted-foreground mb-2 block">{language === 'ar' ? 'السيرة الذاتية (PDF)' : 'CV (PDF)'}</label>
            <input type="file" accept=".pdf" onChange={e => setCvFile(e.target.files?.[0] ?? null)} className="block w-full text-xs text-muted-foreground file:mr-3 file:py-1.5 file:px-3 file:border file:border-border file:rounded-sm file:text-xs file:font-mono file:bg-muted file:text-foreground hover:file:bg-muted/80" />
            {form.cv_url && <a href={form.cv_url} target="_blank" rel="noopener noreferrer" className="text-xs text-emerald-brand mt-1 inline-block hover:underline">{language === 'ar' ? 'عرض السيرة الحالية' : 'View current CV'}</a>}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-mono font-semibold text-muted-foreground mb-1 block">{language === 'ar' ? 'الاسم' : 'Name'} *</label>
            <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="w-full h-9 px-3 border border-border rounded-sm text-sm focus:border-emerald-brand focus:outline-none" />
          </div>
          <div>
            <label className="text-xs font-mono font-semibold text-muted-foreground mb-1 block">{language === 'ar' ? 'الموقع' : 'Location'} *</label>
            <input value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} className="w-full h-9 px-3 border border-border rounded-sm text-sm focus:border-emerald-brand focus:outline-none" />
          </div>
          <div>
            <label className="text-xs font-mono font-semibold text-muted-foreground mb-1 block">{language === 'ar' ? 'المسمى (إنجليزي)' : 'Title (EN)'} *</label>
            <input value={form.title_en} onChange={e => setForm(f => ({ ...f, title_en: e.target.value }))} className="w-full h-9 px-3 border border-border rounded-sm text-sm focus:border-emerald-brand focus:outline-none" />
          </div>
          <div>
            <label className="text-xs font-mono font-semibold text-muted-foreground mb-1 block">{language === 'ar' ? 'المسمى (عربي)' : 'Title (AR)'} *</label>
            <input value={form.title_ar} onChange={e => setForm(f => ({ ...f, title_ar: e.target.value }))} className="w-full h-9 px-3 border border-border rounded-sm text-sm focus:border-emerald-brand focus:outline-none" />
          </div>
        </div>

        <div>
          <label className="text-xs font-mono font-semibold text-muted-foreground mb-1 block">{language === 'ar' ? 'نبذة (إنجليزي)' : 'Bio (EN)'} *</label>
          <textarea value={form.bio_en} onChange={e => setForm(f => ({ ...f, bio_en: e.target.value }))} rows={3} className="w-full px-3 py-2 border border-border rounded-sm text-sm focus:border-emerald-brand focus:outline-none resize-none" />
        </div>
        <div>
          <label className="text-xs font-mono font-semibold text-muted-foreground mb-1 block">{language === 'ar' ? 'نبذة (عربي)' : 'Bio (AR)'} *</label>
          <textarea value={form.bio_ar} onChange={e => setForm(f => ({ ...f, bio_ar: e.target.value }))} rows={3} className="w-full px-3 py-2 border border-border rounded-sm text-sm focus:border-emerald-brand focus:outline-none resize-none" />
        </div>

        <div>
          <label className="text-xs font-mono font-semibold text-muted-foreground mb-1 block">{language === 'ar' ? 'البريد الإلكتروني' : 'Email'} *</label>
          <input value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} className="w-full h-9 px-3 border border-border rounded-sm text-sm focus:border-emerald-brand focus:outline-none" />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="text-xs font-mono font-semibold text-muted-foreground mb-1 block">GitHub</label>
            <input value={form.github_url} onChange={e => setForm(f => ({ ...f, github_url: e.target.value }))} className="w-full h-9 px-3 border border-border rounded-sm text-sm focus:border-emerald-brand focus:outline-none" placeholder="https://github.com/..." />
          </div>
          <div>
            <label className="text-xs font-mono font-semibold text-muted-foreground mb-1 block">LinkedIn</label>
            <input value={form.linkedin_url} onChange={e => setForm(f => ({ ...f, linkedin_url: e.target.value }))} className="w-full h-9 px-3 border border-border rounded-sm text-sm focus:border-emerald-brand focus:outline-none" />
          </div>
          <div>
            <label className="text-xs font-mono font-semibold text-muted-foreground mb-1 block">Facebook</label>
            <input value={form.facebook_url} onChange={e => setForm(f => ({ ...f, facebook_url: e.target.value }))} className="w-full h-9 px-3 border border-border rounded-sm text-sm focus:border-emerald-brand focus:outline-none" />
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button onClick={handleSave} disabled={saving || !form.name || !form.email} className="btn-emerald text-sm py-2.5 px-6 disabled:opacity-40">
            <Save className="w-4 h-4" />
            {saving ? (language === 'ar' ? 'جاري الحفظ...' : 'Saving...') : (language === 'ar' ? 'حفظ' : 'Save')}
          </button>
        </div>
      </div>
    </div>
  )
}
