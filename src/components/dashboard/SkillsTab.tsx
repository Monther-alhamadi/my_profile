import { useState } from 'react'
import { Wrench, Plus } from 'lucide-react'
import { useLanguage } from '@/hooks/useLanguage'
import { useSkillsQuery, useCreateSkill, useUpdateSkill, useDeleteSkill } from '@/services/portfolio-queries'
import type { Skill } from '@/lib'
import DataTable from './DataTable'
import FormModal from './FormModal'
import ConfirmDialog from './ConfirmDialog'
import { toast } from 'sonner'

const emptyForm = { category: '', icon: '', description: '', technologies: '' }

const ICON_OPTIONS = ['cpu', 'code', 'brain', 'smartphone', 'layers', 'sparkles', 'network', 'database', 'cloud', 'shield']

export default function SkillsTab() {
  const { language } = useLanguage()
  const { data: skills, isLoading } = useSkillsQuery(language)
  const createMut = useCreateSkill()
  const updateMut = useUpdateSkill()
  const deleteMut = useDeleteSkill()
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Skill | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [deleteTarget, setDeleteTarget] = useState<Skill | null>(null)

  const openAdd = () => { setEditing(null); setForm(emptyForm); setModalOpen(true) }
  const openEdit = (s: Skill) => {
    setEditing(s); setForm({ category: s.category, icon: s.icon, description: s.description, technologies: s.technologies.join(', ') }); setModalOpen(true)
  }

  const handleSave = async () => {
    const payload = {
      category: form.category, icon: form.icon, description: form.description,
      technologies: form.technologies.split(',').map(s => s.trim()).filter(Boolean),
      locale: language,
    }
    try {
      if (editing) {
        await updateMut.mutateAsync({ id: editing.id!, updates: payload })
        toast.success(language === 'ar' ? 'تم التحديث' : 'Updated')
      } else {
        await createMut.mutateAsync(payload)
        toast.success(language === 'ar' ? 'تمت الإضافة' : 'Created')
      }
      setModalOpen(false)
    } catch { toast.error(language === 'ar' ? 'فشل الحفظ' : 'Save failed') }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Wrench className="w-5 h-5 text-emerald-brand" />
          <h2 className="text-lg font-bold text-obsidian">{language === 'ar' ? 'المهارات' : 'Skills'}</h2>
        </div>
        <button onClick={openAdd} className="btn-emerald text-xs py-2 px-3"><Plus className="w-3.5 h-3.5" />{language === 'ar' ? 'إضافة' : 'Add'}</button>
      </div>
      <DataTable
        columns={[
          { key: 'category', header: language === 'ar' ? 'التصنيف' : 'Category', render: (s: Skill) => <span className="font-medium text-sm">{s.category}</span> },
          { key: 'icon', header: 'Icon', render: (s: Skill) => <span className="text-[10px] font-mono text-muted-foreground bg-muted px-1.5 py-0.5 rounded-sm">{s.icon}</span> },
          { key: 'technologies', header: language === 'ar' ? 'التقنيات' : 'Technologies', render: (s: Skill) => <span className="text-xs text-muted-foreground">{s.technologies.join(', ')}</span> },
        ]}
        data={skills} isLoading={isLoading}
        onEdit={openEdit} onDelete={(s: Skill) => setDeleteTarget(s)}
        emptyMessage={language === 'ar' ? 'لا توجد مهارات' : 'No skills'}
        emptyAction={{ label: language === 'ar' ? 'أضف مهارة' : 'Add a skill', onClick: openAdd }}
      />
      <FormModal open={modalOpen} onClose={() => setModalOpen(false)}
        title={editing ? (language === 'ar' ? 'تعديل المهارة' : 'Edit Skill') : (language === 'ar' ? 'إضافة مهارة' : 'Add Skill')}>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-mono font-semibold text-muted-foreground mb-1 block">{language === 'ar' ? 'التصنيف' : 'Category'} *</label>
              <input value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} className="w-full h-9 px-3 border border-border rounded-sm text-sm focus:border-emerald-brand focus:outline-none" />
            </div>
            <div>
              <label className="text-xs font-mono font-semibold text-muted-foreground mb-1 block">{language === 'ar' ? 'الأيقونة' : 'Icon'} *</label>
              <select value={form.icon} onChange={e => setForm(f => ({ ...f, icon: e.target.value }))} className="w-full h-9 px-3 border border-border rounded-sm text-sm focus:border-emerald-brand focus:outline-none bg-white">
                {ICON_OPTIONS.map(io => <option key={io} value={io}>{io}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="text-xs font-mono font-semibold text-muted-foreground mb-1 block">{language === 'ar' ? 'الوصف' : 'Description'} *</label>
            <input value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} className="w-full h-9 px-3 border border-border rounded-sm text-sm focus:border-emerald-brand focus:outline-none" />
          </div>
          <div>
            <label className="text-xs font-mono font-semibold text-muted-foreground mb-1 block">{language === 'ar' ? 'التقنيات (مفصولة بفواصل)' : 'Technologies (comma-separated)'}</label>
            <input value={form.technologies} onChange={e => setForm(f => ({ ...f, technologies: e.target.value }))} className="w-full h-9 px-3 border border-border rounded-sm text-sm focus:border-emerald-brand focus:outline-none" placeholder="React, Node.js, PostgreSQL" />
          </div>
          <div className="flex gap-3 justify-end pt-2">
            <button onClick={() => setModalOpen(false)} className="btn-ghost text-sm py-2 px-4 text-muted-foreground hover:text-foreground transition-colors">{language === 'ar' ? 'إلغاء' : 'Cancel'}</button>
            <button onClick={handleSave} disabled={!form.category || !form.description || createMut.isPending || updateMut.isPending} className="btn-emerald text-sm py-2 px-4 disabled:opacity-40">
              {createMut.isPending || updateMut.isPending ? (language === 'ar' ? 'جاري الحفظ...' : 'Saving...') : (language === 'ar' ? 'حفظ' : 'Save')}
            </button>
          </div>
        </div>
      </FormModal>
      <ConfirmDialog open={!!deleteTarget} onConfirm={() => { if (deleteTarget) deleteMut.mutateAsync({ id: deleteTarget.id! }).then(() => { toast.success(language === 'ar' ? 'تم الحذف' : 'Deleted'); setDeleteTarget(null) }).catch(() => toast.error(language === 'ar' ? 'فشل الحذف' : 'Delete failed')) } } onCancel={() => setDeleteTarget(null)} loading={deleteMut.isPending} />
    </div>
  )
}
