import { useState } from 'react'
import { Star, Plus } from 'lucide-react'
import { useLanguage } from '@/hooks/useLanguage'
import { useTestimonialsQuery, useCreateTestimonial, useUpdateTestimonial, useDeleteTestimonial } from '@/services/portfolio-queries'
import { uploadImage, getImagePath } from '@/services/storage'
import { useAuth } from '@/hooks/useAuth'
import type { Testimonial } from '@/lib'
import DataTable from './DataTable'
import FormModal from './FormModal'
import ImageUploader from './ImageUploader'
import ConfirmDialog from './ConfirmDialog'
import { toast } from 'sonner'

const emptyForm = { name: '', role: '', company: '', content: '', rating: 5 }

export default function TestimonialsTab() {
  const { language } = useLanguage()
  const { user } = useAuth()
  const { data: testimonials, isLoading } = useTestimonialsQuery(language)
  const createMut = useCreateTestimonial()
  const updateMut = useUpdateTestimonial()
  const deleteMut = useDeleteTestimonial()
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Testimonial | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [deleteTarget, setDeleteTarget] = useState<Testimonial | null>(null)
  const [avatarFile, setAvatarFile] = useState<File | null>(null)

  const openAdd = () => { setEditing(null); setForm(emptyForm); setAvatarFile(null); setModalOpen(true) }
  const openEdit = (t: Testimonial) => { setEditing(t); setForm({ name: t.name, role: t.role, company: t.company, content: t.content, rating: t.rating }); setAvatarFile(null); setModalOpen(true) }

  const handleSave = async () => {
    const payload: Record<string, string | number> = { name: form.name, role: form.role, company: form.company, content: form.content, rating: form.rating, locale: language }
    try {
      if (avatarFile && user) {
        const path = getImagePath(user.id, 'avatars', avatarFile.name)
        payload.avatar_url = await uploadImage(avatarFile, path)
      }
      if (editing) {
        await updateMut.mutateAsync({ id: editing.id, locale: language, updates: payload })
        toast.success(language === 'ar' ? 'تم التحديث' : 'Updated')
      } else {
        await createMut.mutateAsync({ ...payload, id: crypto.randomUUID() })
        toast.success(language === 'ar' ? 'تمت الإضافة' : 'Created')
      }
      setModalOpen(false)
    } catch { toast.error(language === 'ar' ? 'فشل الحفظ' : 'Save failed') }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2"><Star className="w-5 h-5 text-emerald-brand" /><h2 className="text-lg font-bold text-obsidian">{language === 'ar' ? 'التوصيات' : 'Testimonials'}</h2></div>
        <button onClick={openAdd} className="btn-emerald text-xs py-2 px-3"><Plus className="w-3.5 h-3.5" />{language === 'ar' ? 'إضافة' : 'Add'}</button>
      </div>
      <DataTable
        columns={[
          { key: 'name', header: language === 'ar' ? 'الاسم' : 'Name', render: (t: Testimonial) => <span className="font-medium text-sm">{t.name}</span> },
          { key: 'company', header: language === 'ar' ? 'الشركة' : 'Company', render: (t: Testimonial) => <span className="text-xs text-muted-foreground">{t.company}</span> },
          { key: 'rating', header: language === 'ar' ? 'التقييم' : 'Rating', render: (t: Testimonial) => (
            <span className="flex items-center gap-0.5">{Array.from({ length: t.rating }).map((_, i) => <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />)}</span>
          )},
        ]}
        data={testimonials} isLoading={isLoading}
        onEdit={openEdit} onDelete={(t: Testimonial) => setDeleteTarget(t)}
        emptyMessage={language === 'ar' ? 'لا توجد توصيات' : 'No testimonials'}
        emptyAction={{ label: language === 'ar' ? 'أضف توصية' : 'Add a testimonial', onClick: openAdd }}
      />
      <FormModal open={modalOpen} onClose={() => setModalOpen(false)}
        title={editing ? (language === 'ar' ? 'تعديل التوصية' : 'Edit Testimonial') : (language === 'ar' ? 'إضافة توصية' : 'Add Testimonial')}>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-mono font-semibold text-muted-foreground mb-1 block">{language === 'ar' ? 'الاسم' : 'Name'} *</label>
              <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="w-full h-9 px-3 border border-border rounded-sm text-sm focus:border-emerald-brand focus:outline-none" />
            </div>
            <div>
              <label className="text-xs font-mono font-semibold text-muted-foreground mb-1 block">{language === 'ar' ? 'الشركة' : 'Company'} *</label>
              <input value={form.company} onChange={e => setForm(f => ({ ...f, company: e.target.value }))} className="w-full h-9 px-3 border border-border rounded-sm text-sm focus:border-emerald-brand focus:outline-none" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-mono font-semibold text-muted-foreground mb-1 block">{language === 'ar' ? 'المسمى' : 'Role'} *</label>
              <input value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))} className="w-full h-9 px-3 border border-border rounded-sm text-sm focus:border-emerald-brand focus:outline-none" />
            </div>
            <div>
              <label className="text-xs font-mono font-semibold text-muted-foreground mb-1 block">{language === 'ar' ? 'التقييم' : 'Rating'} *</label>
              <div className="flex items-center gap-1 h-9">
                {[1, 2, 3, 4, 5].map(n => (
                  <button key={n} type="button" onClick={() => setForm(f => ({ ...f, rating: n }))}>
                    <Star className={`w-5 h-5 transition-colors ${n <= form.rating ? 'fill-amber-400 text-amber-400' : 'text-muted-foreground/20'}`} />
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div>
            <label className="text-xs font-mono font-semibold text-muted-foreground mb-1 block">{language === 'ar' ? 'المحتوى' : 'Content'} *</label>
            <textarea value={form.content} onChange={e => setForm(f => ({ ...f, content: e.target.value }))} rows={3} className="w-full px-3 py-2 border border-border rounded-sm text-sm focus:border-emerald-brand focus:outline-none resize-none" />
          </div>
          <div>
            <label className="text-xs font-mono font-semibold text-muted-foreground mb-1 block">{language === 'ar' ? 'الصورة الرمزية' : 'Avatar'}</label>
            <ImageUploader currentUrl={editing?.avatar_url} onUpload={async (file) => setAvatarFile(file)} />
          </div>
          <div className="flex gap-3 justify-end pt-2">
            <button onClick={() => setModalOpen(false)} className="btn-ghost text-sm py-2 px-4 text-muted-foreground hover:text-foreground transition-colors">{language === 'ar' ? 'إلغاء' : 'Cancel'}</button>
            <button onClick={handleSave} disabled={!form.name || !form.content || createMut.isPending || updateMut.isPending} className="btn-emerald text-sm py-2 px-4 disabled:opacity-40">
              {createMut.isPending || updateMut.isPending ? (language === 'ar' ? 'جاري الحفظ...' : 'Saving...') : (language === 'ar' ? 'حفظ' : 'Save')}
            </button>
          </div>
        </div>
      </FormModal>
      <ConfirmDialog open={!!deleteTarget} onConfirm={() => { if (deleteTarget) deleteMut.mutateAsync({ id: deleteTarget.id, locale: language }).then(() => { toast.success(language === 'ar' ? 'تم الحذف' : 'Deleted'); setDeleteTarget(null) }).catch(() => toast.error(language === 'ar' ? 'فشل الحذف' : 'Delete failed')) } } onCancel={() => setDeleteTarget(null)} loading={deleteMut.isPending} />
    </div>
  )
}
