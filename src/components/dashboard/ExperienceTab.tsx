import { useState } from 'react'
import { FileText, Plus } from 'lucide-react'
import { useLanguage } from '@/hooks/useLanguage'
import { useExperienceQuery, useCreateExperience, useUpdateExperience, useDeleteExperience } from '@/services/portfolio-queries'
import type { Experience } from '@/lib'
import DataTable from './DataTable'
import FormModal from './FormModal'
import ConfirmDialog from './ConfirmDialog'
import { toast } from 'sonner'

const emptyForm = { year: '', title: '', company: '', description: '', achievements: '' }

export default function ExperienceTab() {
  const { language } = useLanguage()
  const { data: experience, isLoading } = useExperienceQuery(language)
  const createMut = useCreateExperience()
  const updateMut = useUpdateExperience()
  const deleteMut = useDeleteExperience()
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Experience | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [deleteTarget, setDeleteTarget] = useState<Experience | null>(null)

  const openAdd = () => { setEditing(null); setForm(emptyForm); setModalOpen(true) }
  const openEdit = (e: Experience) => {
    setEditing(e); setForm({ year: e.year, title: e.title, company: e.company, description: e.description, achievements: e.achievements.join(', ') }); setModalOpen(true)
  }

  const handleSave = async () => {
    const payload = { year: form.year, title: form.title, company: form.company, description: form.description, achievements: form.achievements.split(',').map(s => s.trim()).filter(Boolean), locale: language }
    try {
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
        <div className="flex items-center gap-2"><FileText className="w-5 h-5 text-emerald-brand" /><h2 className="text-lg font-bold text-obsidian">{language === 'ar' ? 'الخبرات' : 'Experience'}</h2></div>
        <button onClick={openAdd} className="btn-emerald text-xs py-2 px-3"><Plus className="w-3.5 h-3.5" />{language === 'ar' ? 'إضافة' : 'Add'}</button>
      </div>
      <DataTable
        columns={[
          { key: 'year', header: language === 'ar' ? 'السنة' : 'Year', render: (e: Experience) => <span className="font-mono text-xs text-muted-foreground">{e.year}</span> },
          { key: 'title', header: language === 'ar' ? 'المسمى' : 'Title', render: (e: Experience) => <span className="font-medium text-sm">{e.title}</span> },
          { key: 'company', header: language === 'ar' ? 'الشركة' : 'Company', render: (e: Experience) => <span className="text-xs text-muted-foreground">{e.company}</span> },
        ]}
        data={experience} isLoading={isLoading}
        onEdit={openEdit} onDelete={(e: Experience) => setDeleteTarget(e)}
        emptyMessage={language === 'ar' ? 'لا توجد خبرات' : 'No experience'}
        emptyAction={{ label: language === 'ar' ? 'أضف خبرة' : 'Add experience', onClick: openAdd }}
      />
      <FormModal open={modalOpen} onClose={() => setModalOpen(false)}
        title={editing ? (language === 'ar' ? 'تعديل الخبرة' : 'Edit Experience') : (language === 'ar' ? 'إضافة خبرة' : 'Add Experience')}>
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-mono font-semibold text-muted-foreground mb-1 block">{language === 'ar' ? 'السنة' : 'Year'} *</label>
              <input value={form.year} onChange={e => setForm(f => ({ ...f, year: e.target.value }))} className="w-full h-9 px-3 border border-border rounded-sm text-sm focus:border-emerald-brand focus:outline-none" placeholder="2022" />
            </div>
            <div>
              <label className="text-xs font-mono font-semibold text-muted-foreground mb-1 block">{language === 'ar' ? 'المسمى' : 'Title'} *</label>
              <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} className="w-full h-9 px-3 border border-border rounded-sm text-sm focus:border-emerald-brand focus:outline-none" />
            </div>
            <div>
              <label className="text-xs font-mono font-semibold text-muted-foreground mb-1 block">{language === 'ar' ? 'الشركة' : 'Company'} *</label>
              <input value={form.company} onChange={e => setForm(f => ({ ...f, company: e.target.value }))} className="w-full h-9 px-3 border border-border rounded-sm text-sm focus:border-emerald-brand focus:outline-none" />
            </div>
          </div>
          <div>
            <label className="text-xs font-mono font-semibold text-muted-foreground mb-1 block">{language === 'ar' ? 'الوصف' : 'Description'} *</label>
            <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={3} className="w-full px-3 py-2 border border-border rounded-sm text-sm focus:border-emerald-brand focus:outline-none resize-none" />
          </div>
          <div>
            <label className="text-xs font-mono font-semibold text-muted-foreground mb-1 block">{language === 'ar' ? 'الإنجازات (مفصولة بفواصل)' : 'Achievements (comma-separated)'}</label>
            <textarea value={form.achievements} onChange={e => setForm(f => ({ ...f, achievements: e.target.value }))} rows={2} className="w-full px-3 py-2 border border-border rounded-sm text-sm focus:border-emerald-brand focus:outline-none resize-none" />
          </div>
          <div className="flex gap-3 justify-end pt-2">
            <button onClick={() => setModalOpen(false)} className="btn-ghost text-sm py-2 px-4 text-muted-foreground hover:text-foreground transition-colors">{language === 'ar' ? 'إلغاء' : 'Cancel'}</button>
            <button onClick={handleSave} disabled={!form.title || !form.company || createMut.isPending || updateMut.isPending} className="btn-emerald text-sm py-2 px-4 disabled:opacity-40">
              {createMut.isPending || updateMut.isPending ? (language === 'ar' ? 'جاري الحفظ...' : 'Saving...') : (language === 'ar' ? 'حفظ' : 'Save')}
            </button>
          </div>
        </div>
      </FormModal>
      <ConfirmDialog open={!!deleteTarget} onConfirm={() => { if (deleteTarget) deleteMut.mutateAsync({ id: deleteTarget.id, locale: language }).then(() => { toast.success(language === 'ar' ? 'تم الحذف' : 'Deleted'); setDeleteTarget(null) }).catch(() => toast.error(language === 'ar' ? 'فشل الحذف' : 'Delete failed')) } } onCancel={() => setDeleteTarget(null)} loading={deleteMut.isPending} />
    </div>
  )
}
