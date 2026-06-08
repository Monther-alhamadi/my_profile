import { useState } from 'react'
import { BarChart3, Plus } from 'lucide-react'
import { useDualLocaleStatsQuery, useBilingualSave, useBilingualDelete } from '@/services/portfolio-queries'
import { createStat, updateStat, deleteStat } from '@/services/portfolio-api'
import type { BilingualItem } from '@/services/portfolio-queries'
import type { Stat } from '@/lib'
import DataTable from './DataTable'
import FormModal from './FormModal'
import ConfirmDialog from './ConfirmDialog'
import BilingualFields, { Field, TextInput } from './BilingualFields'
import { toast } from 'sonner'

type FormData = {
  sort_order: number
  en: { value: string; label: string; suffix: string }
  ar: { value: string; label: string; suffix: string }
}

const emptyForm: FormData = {
  sort_order: 0,
  en: { value: '', label: '', suffix: '' },
  ar: { value: '', label: '', suffix: '' },
}

export default function StatsTab() {
  const { data: stats, isLoading } = useDualLocaleStatsQuery()
  const saveMut = useBilingualSave('stats', createStat, updateStat)
  const deleteMut = useBilingualDelete('stats', deleteStat)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<BilingualItem<Stat> | null>(null)
  const [form, setForm] = useState<FormData>(emptyForm)
  const [deleteTarget, setDeleteTarget] = useState<BilingualItem<Stat> | null>(null)

  const openAdd = () => { setEditing(null); setForm(emptyForm); setModalOpen(true) }

  const openEdit = (item: BilingualItem<Stat>) => {
    setEditing(item)
    setForm({
      sort_order: item.en.sort_order ?? 0,
      en: { value: item.en.value, label: item.en.label, suffix: item.en.suffix ?? '' },
      ar: { value: item.ar?.value ?? '', label: item.ar?.label ?? '', suffix: item.ar?.suffix ?? '' },
    })
    setModalOpen(true)
  }

  const handleSave = async () => {
    const shared = { sort_order: form.sort_order }
    const enData = { ...shared, ...form.en, suffix: form.en.suffix || null }
    const arData = { ...shared, ...form.ar, suffix: form.ar.suffix || null }
    try {
      if (editing) {
        await saveMut.mutateAsync({ mode: 'edit', id: editing.id, en: enData, ar: arData })
        toast.success('Updated')
      } else {
        await saveMut.mutateAsync({ mode: 'add', en: enData, ar: arData })
        toast.success('Created')
      }
      setModalOpen(false)
    } catch { toast.error('Save failed') }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-emerald-brand" />
          <h2 className="text-lg font-bold text-obsidian">Stats</h2>
        </div>
        <button onClick={openAdd} className="btn-emerald text-xs py-2 px-3"><Plus className="w-3.5 h-3.5" />Add</button>
      </div>

      <DataTable
        columns={[
          { key: 'value', header: 'Value', render: (item: BilingualItem<Stat>) => (
            <span className="font-medium text-sm">{item.en.value}{item.en.suffix && <span className="text-xs text-muted-foreground ml-0.5">{item.en.suffix}</span>}</span>
          )},
          { key: 'label', header: 'Label', render: (item: BilingualItem<Stat>) => <span className="text-xs text-muted-foreground">{item.en.label}</span> },
        ]}
        data={stats} isLoading={isLoading}
        onEdit={openEdit} onDelete={(item: BilingualItem<Stat>) => setDeleteTarget(item)}
        onBulkDelete={(items) => {
          if (confirm(`Delete ${items.length} stat(s)?`)) {
            Promise.all(items.map(item => deleteMut.mutateAsync({ id: item.id })))
              .then(() => toast.success(`Deleted ${items.length} stat(s)`))
              .catch(() => toast.error('Delete failed'))
          }
        }}
        getId={(item) => item.id}
        exportFileName="stats"
        emptyMessage="No stats"
        emptyAction={{ label: 'Add a stat', onClick: openAdd }}
      />

      <FormModal open={modalOpen} onClose={() => setModalOpen(false)} size="lg"
        title={editing ? 'Edit Stat' : 'Add Stat'}>
        <div className="space-y-5">
          <BilingualFields
            sharedFields={
              <Field label="Order"><TextInput value={String(form.sort_order)} onChange={v => setForm(f => ({ ...f, sort_order: Number(v) || 0 }))} /></Field>
            }
            enFields={
              <>
                <Field label="Value" required><TextInput value={form.en.value} onChange={v => setForm(f => ({ ...f, en: { ...f.en, value: v } }))} placeholder="4+" /></Field>
                <Field label="Label" required><TextInput value={form.en.label} onChange={v => setForm(f => ({ ...f, en: { ...f.en, label: v } }))} placeholder="Years Experience" /></Field>
                <Field label="Suffix"><TextInput value={form.en.suffix} onChange={v => setForm(f => ({ ...f, en: { ...f.en, suffix: v } }))} placeholder="+" /></Field>
              </>
            }
            arFields={
              <>
                <Field label="القيمة" required><TextInput value={form.ar.value} onChange={v => setForm(f => ({ ...f, ar: { ...f.ar, value: v } }))} placeholder="+٤" /></Field>
                <Field label="التسمية" required><TextInput value={form.ar.label} onChange={v => setForm(f => ({ ...f, ar: { ...f.ar, label: v } }))} placeholder="سنوات خبرة" /></Field>
                <Field label="اللاحقة"><TextInput value={form.ar.suffix} onChange={v => setForm(f => ({ ...f, ar: { ...f.ar, suffix: v } }))} placeholder="+" /></Field>
              </>
            }
          />
          <div className="flex gap-3 justify-end pt-2 border-t border-border">
            <button onClick={() => setModalOpen(false)} className="btn-ghost text-sm py-2 px-4 text-muted-foreground hover:text-foreground transition-colors">Cancel</button>
            <button onClick={handleSave} disabled={!form.en.value || !form.ar.value || !form.en.label || !form.ar.label || saveMut.isPending}
              className="btn-emerald text-sm py-2 px-4 disabled:opacity-40">
              {saveMut.isPending ? 'Saving...' : 'Save Both'}
            </button>
          </div>
        </div>
      </FormModal>

      <ConfirmDialog open={!!deleteTarget} onConfirm={() => {
        if (deleteTarget) deleteMut.mutateAsync({ id: deleteTarget.id })
          .then(() => { toast.success('Deleted'); setDeleteTarget(null) })
          .catch(() => toast.error('Delete failed'))
      }} onCancel={() => setDeleteTarget(null)} loading={deleteMut.isPending} />
    </div>
  )
}
