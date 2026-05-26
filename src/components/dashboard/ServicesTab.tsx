import { useState } from 'react'
import { Briefcase, Plus } from 'lucide-react'
import { useLanguage } from '@/hooks/useLanguage'
import { useServicesQuery, useCreateService, useUpdateService, useDeleteService } from '@/services/portfolio-queries'
import type { Service } from '@/lib'
import DataTable from './DataTable'
import FormModal from './FormModal'
import ConfirmDialog from './ConfirmDialog'
import { toast } from 'sonner'

const emptyForm = { icon: '', title: '', description: '', pricing: '', features: '' }

export default function ServicesTab() {
  const { language } = useLanguage()
  const { data: services, isLoading } = useServicesQuery(language)
  const createMut = useCreateService()
  const updateMut = useUpdateService()
  const deleteMut = useDeleteService()
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Service | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [deleteTarget, setDeleteTarget] = useState<Service | null>(null)

  const openAdd = () => { setEditing(null); setForm(emptyForm); setModalOpen(true) }
  const openEdit = (s: Service) => {
    setEditing(s)
    setForm({ icon: s.icon, title: s.title, description: s.description, pricing: s.pricing, features: s.features.join(', ') })
    setModalOpen(true)
  }

  const handleSave = async () => {
    const payload = { icon: form.icon, title: form.title, description: form.description, pricing: form.pricing, features: form.features.split(',').map(s => s.trim()).filter(Boolean), locale: language }
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
        <div className="flex items-center gap-2"><Briefcase className="w-5 h-5 text-emerald-brand" /><h2 className="text-lg font-bold text-obsidian">{language === 'ar' ? 'الخدمات' : 'Services'}</h2></div>
        <button onClick={openAdd} className="btn-emerald text-xs py-2 px-3"><Plus className="w-3.5 h-3.5" />{language === 'ar' ? 'إضافة' : 'Add'}</button>
      </div>
      <DataTable
        columns={[
          { key: 'title', header: language === 'ar' ? 'العنوان' : 'Title', render: (s: Service) => <span className="font-medium text-sm">{s.title}</span> },
          { key: 'pricing', header: language === 'ar' ? 'السعر' : 'Pricing', render: (s: Service) => <span className="text-xs font-mono text-muted-foreground">{s.pricing}</span> },
        ]}
        data={services} isLoading={isLoading}
        onEdit={openEdit} onDelete={(s: Service) => setDeleteTarget(s)}
        emptyMessage={language === 'ar' ? 'لا توجد خدمات' : 'No services'}
        emptyAction={{ label: language === 'ar' ? 'أضف خدمة' : 'Add a service', onClick: openAdd }}
      />
      <FormModal open={modalOpen} onClose={() => setModalOpen(false)}
        title={editing ? (language === 'ar' ? 'تعديل الخدمة' : 'Edit Service') : (language === 'ar' ? 'إضافة خدمة' : 'Add Service')}>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-mono font-semibold text-muted-foreground mb-1 block">{language === 'ar' ? 'العنوان' : 'Title'} *</label>
              <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} className="w-full h-9 px-3 border border-border rounded-sm text-sm focus:border-emerald-brand focus:outline-none" />
            </div>
            <div>
              <label className="text-xs font-mono font-semibold text-muted-foreground mb-1 block">{language === 'ar' ? 'السعر' : 'Pricing'} *</label>
              <input value={form.pricing} onChange={e => setForm(f => ({ ...f, pricing: e.target.value }))} className="w-full h-9 px-3 border border-border rounded-sm text-sm focus:border-emerald-brand focus:outline-none" placeholder="From $5,000" />
            </div>
          </div>
          <div>
            <label className="text-xs font-mono font-semibold text-muted-foreground mb-1 block">{language === 'ar' ? 'الوصف' : 'Description'} *</label>
            <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={3} className="w-full px-3 py-2 border border-border rounded-sm text-sm focus:border-emerald-brand focus:outline-none resize-none" />
          </div>
          <div>
            <label className="text-xs font-mono font-semibold text-muted-foreground mb-1 block">{language === 'ar' ? 'الميزات (مفصولة بفواصل)' : 'Features (comma-separated)'}</label>
            <textarea value={form.features} onChange={e => setForm(f => ({ ...f, features: e.target.value }))} rows={2} className="w-full px-3 py-2 border border-border rounded-sm text-sm focus:border-emerald-brand focus:outline-none resize-none" />
          </div>
          <div className="flex gap-3 justify-end pt-2">
            <button onClick={() => setModalOpen(false)} className="btn-ghost text-sm py-2 px-4 text-muted-foreground hover:text-foreground transition-colors">{language === 'ar' ? 'إلغاء' : 'Cancel'}</button>
            <button onClick={handleSave} disabled={!form.title || !form.description || createMut.isPending || updateMut.isPending} className="btn-emerald text-sm py-2 px-4 disabled:opacity-40">
              {createMut.isPending || updateMut.isPending ? (language === 'ar' ? 'جاري الحفظ...' : 'Saving...') : (language === 'ar' ? 'حفظ' : 'Save')}
            </button>
          </div>
        </div>
      </FormModal>
      <ConfirmDialog open={!!deleteTarget} onConfirm={() => { if (deleteTarget) deleteMut.mutateAsync({ id: deleteTarget.id, locale: language }).then(() => { toast.success(language === 'ar' ? 'تم الحذف' : 'Deleted'); setDeleteTarget(null) }).catch(() => toast.error(language === 'ar' ? 'فشل الحذف' : 'Delete failed')) } } onCancel={() => setDeleteTarget(null)} loading={deleteMut.isPending} />
    </div>
  )
}
