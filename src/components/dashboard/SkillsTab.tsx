import { useState } from 'react'
import { Wrench, Plus } from 'lucide-react'
import { useDualLocaleSkillsQuery, useBilingualSave, useBilingualDelete } from '@/services/portfolio-queries'
import { createSkill, updateSkill, deleteSkill } from '@/services/portfolio-api'
import type { BilingualItem } from '@/services/portfolio-queries'
import type { Skill } from '@/lib'
import DataTable from './DataTable'
import FormModal from './FormModal'
import ConfirmDialog from './ConfirmDialog'
import BilingualFields, { Field, TextInput, SelectInput } from './BilingualFields'
import { toast } from 'sonner'

const ICON_OPTIONS = ['cpu', 'code', 'brain', 'smartphone', 'layers', 'sparkles', 'network', 'database', 'cloud', 'shield']

type FormData = {
  icon: string
  sort_order: number
  technologies: string
  en: { category: string; description: string }
  ar: { category: string; description: string }
}

const emptyForm: FormData = {
  icon: '', sort_order: 0, technologies: '',
  en: { category: '', description: '' },
  ar: { category: '', description: '' },
}

export default function SkillsTab() {
  const { data: skills, isLoading } = useDualLocaleSkillsQuery()
  const saveMut = useBilingualSave('skills', createSkill, updateSkill)
  const deleteMut = useBilingualDelete('skills', deleteSkill)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<BilingualItem<Skill> | null>(null)
  const [form, setForm] = useState<FormData>(emptyForm)
  const [deleteTarget, setDeleteTarget] = useState<BilingualItem<Skill> | null>(null)

  const openAdd = () => { setEditing(null); setForm(emptyForm); setModalOpen(true) }

  const openEdit = (item: BilingualItem<Skill>) => {
    setEditing(item)
    setForm({
      icon: item.en.icon, sort_order: item.en.sort_order ?? 0,
      technologies: item.en.technologies.join(', '),
      en: { category: item.en.category, description: item.en.description },
      ar: { category: item.ar?.category ?? '', description: item.ar?.description ?? '' },
    })
    setModalOpen(true)
  }

  const handleSave = async () => {
    const shared = {
      icon: form.icon, sort_order: form.sort_order,
      technologies: form.technologies.split(',').map(s => s.trim()).filter(Boolean),
    }
    const enData = { ...shared, ...form.en }
    const arData = { ...shared, ...form.ar }
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
          <Wrench className="w-5 h-5 text-emerald-brand" />
          <h2 className="text-lg font-bold text-obsidian">Skills</h2>
        </div>
        <button onClick={openAdd} className="btn-emerald text-xs py-2 px-3"><Plus className="w-3.5 h-3.5" />Add</button>
      </div>

      <DataTable
        columns={[
          { key: 'category', header: 'Category', render: (item: BilingualItem<Skill>) => <span className="font-medium text-sm">{item.en.category}</span> },
          { key: 'icon', header: 'Icon', render: (item: BilingualItem<Skill>) => <span className="text-[10px] font-mono text-muted-foreground bg-muted px-1.5 py-0.5 rounded-sm">{item.en.icon}</span> },
          { key: 'technologies', header: 'Technologies', render: (item: BilingualItem<Skill>) => <span className="text-xs text-muted-foreground">{item.en.technologies.join(', ')}</span> },
        ]}
        data={skills} isLoading={isLoading}
        onEdit={openEdit} onDelete={(item: BilingualItem<Skill>) => setDeleteTarget(item)}
        onBulkDelete={(items) => {
          if (confirm(`Delete ${items.length} skill(s)?`)) {
            Promise.all(items.map(item => deleteMut.mutateAsync({ id: item.id! })))
              .then(() => toast.success(`Deleted ${items.length} skill(s)`))
              .catch(() => toast.error('Delete failed'))
          }
        }}
        getId={(item) => item.id ?? ''}
        exportFileName="skills"
        emptyMessage="No skills"
        emptyAction={{ label: 'Add a skill', onClick: openAdd }}
      />

      <FormModal open={modalOpen} onClose={() => setModalOpen(false)} size="lg"
        title={editing ? 'Edit Skill' : 'Add Skill'}>
        <div className="space-y-5">
          <BilingualFields
            sharedFields={
              <>
                <Field label="Icon" required>
                  <SelectInput value={form.icon} onChange={v => setForm(f => ({ ...f, icon: v }))} options={ICON_OPTIONS} />
                </Field>
                <Field label="Order"><TextInput value={String(form.sort_order)} onChange={v => setForm(f => ({ ...f, sort_order: Number(v) || 0 }))} /></Field>
                <Field label="Technologies"><TextInput value={form.technologies} onChange={v => setForm(f => ({ ...f, technologies: v }))} placeholder="React, Node.js" /></Field>
              </>
            }
            enFields={
              <>
                <Field label="Category" required><TextInput value={form.en.category} onChange={v => setForm(f => ({ ...f, en: { ...f.en, category: v } }))} /></Field>
                <Field label="Description" required><TextInput value={form.en.description} onChange={v => setForm(f => ({ ...f, en: { ...f.en, description: v } }))} /></Field>
              </>
            }
            arFields={
              <>
                <Field label="التصنيف" required><TextInput value={form.ar.category} onChange={v => setForm(f => ({ ...f, ar: { ...f.ar, category: v } }))} /></Field>
                <Field label="الوصف" required><TextInput value={form.ar.description} onChange={v => setForm(f => ({ ...f, ar: { ...f.ar, description: v } }))} /></Field>
              </>
            }
          />
          <div className="flex gap-3 justify-end pt-2 border-t border-border">
            <button onClick={() => setModalOpen(false)} className="btn-ghost text-sm py-2 px-4 text-muted-foreground hover:text-foreground transition-colors">Cancel</button>
            <button onClick={handleSave} disabled={!form.icon || !form.en.category || !form.ar.category || saveMut.isPending}
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
