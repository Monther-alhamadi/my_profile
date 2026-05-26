import { useState } from 'react'
import { BarChart3, Plus } from 'lucide-react'
import { useLanguage } from '@/hooks/useLanguage'
import { useStatsQuery, useCreateStat, useUpdateStat, useDeleteStat } from '@/services/portfolio-queries'
import type { Stat } from '@/lib'
import DataTable from './DataTable'
import FormModal from './FormModal'
import ConfirmDialog from './ConfirmDialog'
import { toast } from 'sonner'

const emptyForm = { value: '', label: '', suffix: '' }

export default function StatsTab() {
  const { language } = useLanguage()
  const { data: stats, isLoading } = useStatsQuery(language)
  const createMut = useCreateStat()
  const updateMut = useUpdateStat()
  const deleteMut = useDeleteStat()
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Stat | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [deleteTarget, setDeleteTarget] = useState<Stat | null>(null)

  const openAdd = () => { setEditing(null); setForm(emptyForm); setModalOpen(true) }
  const openEdit = (s: Stat) => { setEditing(s); setForm({ value: s.value, label: s.label, suffix: s.suffix ?? '' }); setModalOpen(true) }

  const handleSave = async () => {
    const payload = { value: form.value, label: form.label, suffix: form.suffix || null, locale: language }
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
        <div className="flex items-center gap-2"><BarChart3 className="w-5 h-5 text-emerald-brand" /><h2 className="text-lg font-bold text-obsidian">{language === 'ar' ? 'الإحصائيات' : 'Stats'}</h2></div>
        <button onClick={openAdd} className="btn-emerald text-xs py-2 px-3"><Plus className="w-3.5 h-3.5" />{language === 'ar' ? 'إضافة' : 'Add'}</button>
      </div>
      <DataTable
        columns={[
          { key: 'value', header: language === 'ar' ? 'القيمة' : 'Value', render: (s: Stat) => <span className="font-medium text-sm">{s.value}{s.suffix && <span className="text-xs text-muted-foreground ml-0.5">{s.suffix}</span>}</span> },
          { key: 'label', header: language === 'ar' ? 'التسمية' : 'Label', render: (s: Stat) => <span className="text-xs text-muted-foreground">{s.label}</span> },
        ]}
        data={stats} isLoading={isLoading}
        onEdit={openEdit} onDelete={(s: Stat) => setDeleteTarget(s)}
        emptyMessage={language === 'ar' ? 'لا توجد إحصائيات' : 'No stats'}
        emptyAction={{ label: language === 'ar' ? 'أضف إحصائية' : 'Add a stat', onClick: openAdd }}
      />
      <FormModal open={modalOpen} onClose={() => setModalOpen(false)}
        title={editing ? (language === 'ar' ? 'تعديل الإحصائية' : 'Edit Stat') : (language === 'ar' ? 'إضافة إحصائية' : 'Add Stat')}>
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-mono font-semibold text-muted-foreground mb-1 block">{language === 'ar' ? 'القيمة' : 'Value'} *</label>
              <input value={form.value} onChange={e => setForm(f => ({ ...f, value: e.target.value }))} className="w-full h-9 px-3 border border-border rounded-sm text-sm focus:border-emerald-brand focus:outline-none" placeholder="4+" />
            </div>
            <div>
              <label className="text-xs font-mono font-semibold text-muted-foreground mb-1 block">{language === 'ar' ? 'التسمية' : 'Label'} *</label>
              <input value={form.label} onChange={e => setForm(f => ({ ...f, label: e.target.value }))} className="w-full h-9 px-3 border border-border rounded-sm text-sm focus:border-emerald-brand focus:outline-none" placeholder="Years Experience" />
            </div>
            <div>
              <label className="text-xs font-mono font-semibold text-muted-foreground mb-1 block">{language === 'ar' ? 'اللاحقة' : 'Suffix'}</label>
              <input value={form.suffix} onChange={e => setForm(f => ({ ...f, suffix: e.target.value }))} className="w-full h-9 px-3 border border-border rounded-sm text-sm focus:border-emerald-brand focus:outline-none" placeholder="+" />
            </div>
          </div>
          <div className="flex gap-3 justify-end pt-2">
            <button onClick={() => setModalOpen(false)} className="btn-ghost text-sm py-2 px-4 text-muted-foreground hover:text-foreground transition-colors">{language === 'ar' ? 'إلغاء' : 'Cancel'}</button>
            <button onClick={handleSave} disabled={!form.value || !form.label || createMut.isPending || updateMut.isPending} className="btn-emerald text-sm py-2 px-4 disabled:opacity-40">
              {createMut.isPending || updateMut.isPending ? (language === 'ar' ? 'جاري الحفظ...' : 'Saving...') : (language === 'ar' ? 'حفظ' : 'Save')}
            </button>
          </div>
        </div>
      </FormModal>
      <ConfirmDialog open={!!deleteTarget} onConfirm={() => { if (deleteTarget) deleteMut.mutateAsync({ id: deleteTarget.id, locale: language }).then(() => { toast.success(language === 'ar' ? 'تم الحذف' : 'Deleted'); setDeleteTarget(null) }).catch(() => toast.error(language === 'ar' ? 'فشل الحذف' : 'Delete failed')) } } onCancel={() => setDeleteTarget(null)} loading={deleteMut.isPending} />
    </div>
  )
}
