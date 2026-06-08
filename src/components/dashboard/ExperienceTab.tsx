import { useState } from 'react'
import { FileText, Plus } from 'lucide-react'
import { useDualLocaleExperienceQuery, useBilingualSave, useBilingualDelete } from '@/services/portfolio-queries'
import { createExperience, updateExperience, deleteExperience } from '@/services/portfolio-api'
import type { BilingualItem } from '@/services/portfolio-queries'
import type { Experience } from '@/lib'
import DataTable from './DataTable'
import FormModal from './FormModal'
import ConfirmDialog from './ConfirmDialog'
import BilingualFields, { Field, TextInput, TextArea } from './BilingualFields'
import { toast } from 'sonner'

type FormData = {
  year: string
  sort_order: number
  en: { title: string; company: string; description: string; achievements: string }
  ar: { title: string; company: string; description: string; achievements: string }
}

const emptyForm: FormData = {
  year: '', sort_order: 0,
  en: { title: '', company: '', description: '', achievements: '' },
  ar: { title: '', company: '', description: '', achievements: '' },
}

export default function ExperienceTab() {
  const { data: experience, isLoading } = useDualLocaleExperienceQuery()
  const saveMut = useBilingualSave('experience', createExperience, updateExperience)
  const deleteMut = useBilingualDelete('experience', deleteExperience)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<BilingualItem<Experience> | null>(null)
  const [form, setForm] = useState<FormData>(emptyForm)
  const [deleteTarget, setDeleteTarget] = useState<BilingualItem<Experience> | null>(null)

  const openAdd = () => { setEditing(null); setForm(emptyForm); setModalOpen(true) }

  const openEdit = (item: BilingualItem<Experience>) => {
    setEditing(item)
    setForm({
      year: item.en.year, sort_order: item.en.sort_order ?? 0,
      en: { title: item.en.title, company: item.en.company, description: item.en.description, achievements: item.en.achievements.join(', ') },
      ar: { title: item.ar?.title ?? '', company: item.ar?.company ?? '', description: item.ar?.description ?? '', achievements: item.ar?.achievements?.join(', ') ?? '' },
    })
    setModalOpen(true)
  }

  const handleSave = async () => {
    const shared = { year: form.year, sort_order: form.sort_order }
    const enData = { ...shared, ...form.en, achievements: form.en.achievements.split(',').map(s => s.trim()).filter(Boolean) }
    const arData = { ...shared, ...form.ar, achievements: form.ar.achievements.split(',').map(s => s.trim()).filter(Boolean) }
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
          <FileText className="w-5 h-5 text-emerald-brand" />
          <h2 className="text-lg font-bold text-obsidian">Experience</h2>
        </div>
        <button onClick={openAdd} className="btn-emerald text-xs py-2 px-3"><Plus className="w-3.5 h-3.5" />Add</button>
      </div>

      <DataTable
        columns={[
          { key: 'year', header: 'Year', render: (item: BilingualItem<Experience>) => <span className="font-mono text-xs text-muted-foreground">{item.en.year}</span> },
          { key: 'title', header: 'Title', render: (item: BilingualItem<Experience>) => <span className="font-medium text-sm">{item.en.title}</span> },
          { key: 'company', header: 'Company', render: (item: BilingualItem<Experience>) => <span className="text-xs text-muted-foreground">{item.en.company}</span> },
        ]}
        data={experience} isLoading={isLoading}
        onEdit={openEdit} onDelete={(item: BilingualItem<Experience>) => setDeleteTarget(item)}
        onBulkDelete={(items) => {
          if (confirm(`Delete ${items.length} experience(s)?`)) {
            Promise.all(items.map(item => deleteMut.mutateAsync({ id: item.id })))
              .then(() => toast.success(`Deleted ${items.length} experience(s)`))
              .catch(() => toast.error('Delete failed'))
          }
        }}
        getId={(item) => item.id}
        exportFileName="experience"
        emptyMessage="No experience"
        emptyAction={{ label: 'Add experience', onClick: openAdd }}
      />

      <FormModal open={modalOpen} onClose={() => setModalOpen(false)} size="lg"
        title={editing ? 'Edit Experience' : 'Add Experience'}>
        <div className="space-y-5">
          <BilingualFields
            sharedFields={
              <>
                <Field label="Year" required><TextInput value={form.year} onChange={v => setForm(f => ({ ...f, year: v }))} placeholder="2022" /></Field>
                <Field label="Order"><TextInput value={String(form.sort_order)} onChange={v => setForm(f => ({ ...f, sort_order: Number(v) || 0 }))} /></Field>
              </>
            }
            enFields={
              <>
                <Field label="Title" required><TextInput value={form.en.title} onChange={v => setForm(f => ({ ...f, en: { ...f.en, title: v } }))} /></Field>
                <Field label="Company" required><TextInput value={form.en.company} onChange={v => setForm(f => ({ ...f, en: { ...f.en, company: v } }))} /></Field>
                <Field label="Description" required><TextArea value={form.en.description} onChange={v => setForm(f => ({ ...f, en: { ...f.en, description: v } }))} /></Field>
                <Field label="Achievements"><TextArea value={form.en.achievements} onChange={v => setForm(f => ({ ...f, en: { ...f.en, achievements: v } }))} rows={2} /></Field>
              </>
            }
            arFields={
              <>
                <Field label="المسمى" required><TextInput value={form.ar.title} onChange={v => setForm(f => ({ ...f, ar: { ...f.ar, title: v } }))} /></Field>
                <Field label="الشركة" required><TextInput value={form.ar.company} onChange={v => setForm(f => ({ ...f, ar: { ...f.ar, company: v } }))} /></Field>
                <Field label="الوصف" required><TextArea value={form.ar.description} onChange={v => setForm(f => ({ ...f, ar: { ...f.ar, description: v } }))} /></Field>
                <Field label="الإنجازات"><TextArea value={form.ar.achievements} onChange={v => setForm(f => ({ ...f, ar: { ...f.ar, achievements: v } }))} rows={2} /></Field>
              </>
            }
          />
          <div className="flex gap-3 justify-end pt-2 border-t border-border">
            <button onClick={() => setModalOpen(false)} className="btn-ghost text-sm py-2 px-4 text-muted-foreground hover:text-foreground transition-colors">Cancel</button>
            <button onClick={handleSave} disabled={!form.year || !form.en.title || !form.ar.title || saveMut.isPending}
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
