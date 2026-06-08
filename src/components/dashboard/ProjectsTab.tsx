import { useState } from 'react'
import { FolderOpen, Plus } from 'lucide-react'
import { useDualLocaleProjectsQuery, useBilingualSave, useBilingualDelete } from '@/services/portfolio-queries'
import { createProject, updateProject, deleteProject } from '@/services/portfolio-api'
import { uploadImage, getImagePath } from '@/services/storage'
import { useAuth } from '@/hooks/useAuth'
import type { BilingualItem } from '@/services/portfolio-queries'
import type { Project } from '@/lib'
import DataTable from './DataTable'
import FormModal from './FormModal'
import ConfirmDialog from './ConfirmDialog'
import ImageUploader from './ImageUploader'
import BilingualFields, { Field, TextInput, TextArea, SelectInput } from './BilingualFields'
import { toast } from 'sonner'

const COMPLEXITY_OPTIONS = ['High', 'Critical', 'Advanced']

type FormData = {
  number: string
  complexity: string
  sort_order: number
  image_url: string
  link_url: string
  technologies: string
  highlights: string
  en: { title: string; category: string; problem: string; solution: string }
  ar: { title: string; category: string; problem: string; solution: string }
}

const emptyForm: FormData = {
  number: '', complexity: 'High', sort_order: 0,
  image_url: '', link_url: '', technologies: '', highlights: '',
  en: { title: '', category: '', problem: '', solution: '' },
  ar: { title: '', category: '', problem: '', solution: '' },
}

export default function ProjectsTab() {
  const { user } = useAuth()
  const { data: projects, isLoading } = useDualLocaleProjectsQuery()
  const saveMut = useBilingualSave('projects', createProject, updateProject)
  const deleteMut = useBilingualDelete('projects', deleteProject)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<BilingualItem<Project> | null>(null)
  const [form, setForm] = useState<FormData>(emptyForm)
  const [deleteTarget, setDeleteTarget] = useState<BilingualItem<Project> | null>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)

  const openAdd = () => { setEditing(null); setForm(emptyForm); setImageFile(null); setModalOpen(true) }

  const openEdit = (item: BilingualItem<Project>) => {
    setEditing(item)
    setForm({
      number: item.en.number, complexity: item.en.complexity, sort_order: item.en.sort_order ?? 0,
      image_url: item.en.image_url ?? '', link_url: item.en.link_url ?? '',
      technologies: item.en.technologies.join(', '),
      highlights: item.en.highlights.join(', '),
      en: { title: item.en.title, category: item.en.category, problem: item.en.problem, solution: item.en.solution },
      ar: { title: item.ar?.title ?? '', category: item.ar?.category ?? '', problem: item.ar?.problem ?? '', solution: item.ar?.solution ?? '' },
    })
    setImageFile(null)
    setModalOpen(true)
  }

  const handleSave = async () => {
    let imageUrl = form.image_url || null
    try {
      if (imageFile && user) {
        const path = getImagePath(user.id, 'projects', imageFile.name)
        imageUrl = await uploadImage(imageFile, path)
      }
      const shared = {
        number: form.number, complexity: form.complexity, sort_order: form.sort_order,
        image_url: imageUrl, link_url: form.link_url || null,
        technologies: form.technologies.split(',').map(s => s.trim()).filter(Boolean),
        highlights: form.highlights.split(',').map(s => s.trim()).filter(Boolean),
      }
      const enData = { ...shared, ...form.en }
      const arData = { ...shared, ...form.ar }
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
          <FolderOpen className="w-5 h-5 text-emerald-brand" />
          <h2 className="text-lg font-bold text-obsidian">Projects</h2>
        </div>
        <button onClick={openAdd} className="btn-emerald text-xs py-2 px-3"><Plus className="w-3.5 h-3.5" />Add</button>
      </div>

      <DataTable
        columns={[
          { key: 'number', header: '#', render: (item: BilingualItem<Project>) => <span className="font-mono text-xs text-muted-foreground">{item.en.number}</span> },
          { key: 'title', header: 'Title', render: (item: BilingualItem<Project>) => <span className="font-medium text-sm">{item.en.title}</span> },
          { key: 'category', header: 'Category', render: (item: BilingualItem<Project>) => <span className="text-xs text-muted-foreground">{item.en.category}</span> },
          { key: 'complexity', header: 'Complexity', render: (item: BilingualItem<Project>) => (
            <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded-sm ${item.en.complexity === 'Critical' ? 'bg-red-100 text-red-700' : item.en.complexity === 'Advanced' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>
              {item.en.complexity}
            </span>
          )},
        ]}
        data={projects} isLoading={isLoading}
        onEdit={openEdit} onDelete={(item: BilingualItem<Project>) => setDeleteTarget(item)}
        onBulkDelete={(items) => {
          if (confirm(`Delete ${items.length} project(s)?`)) {
            Promise.all(items.map(item => deleteMut.mutateAsync({ id: item.id })))
              .then(() => toast.success(`Deleted ${items.length} project(s)`))
              .catch(() => toast.error('Delete failed'))
          }
        }}
        getId={(item) => item.id}
        exportFileName="projects"
        emptyMessage="No projects"
        emptyAction={{ label: 'Add a project', onClick: openAdd }}
      />

      <FormModal open={modalOpen} onClose={() => setModalOpen(false)} size="lg"
        title={editing ? 'Edit Project' : 'Add Project'}>
        <div className="space-y-5">
          <BilingualFields
            sharedFields={
              <>
                <Field label="Number" required><TextInput value={form.number} onChange={v => setForm(f => ({ ...f, number: v }))} placeholder="01" /></Field>
                <Field label="Complexity" required>
                  <SelectInput value={form.complexity} onChange={v => setForm(f => ({ ...f, complexity: v }))} options={COMPLEXITY_OPTIONS} />
                </Field>
                <Field label="Order"><TextInput value={String(form.sort_order)} onChange={v => setForm(f => ({ ...f, sort_order: Number(v) || 0 }))} /></Field>
                <Field label="Image">
                  <ImageUploader
                    currentUrl={form.image_url || editing?.en.image_url}
                    onUpload={async (file) => setImageFile(file)}
                    onRemove={() => { setForm(f => ({ ...f, image_url: '' })); setImageFile(null) }}
                  />
                </Field>
                <Field label="Link URL"><TextInput value={form.link_url} onChange={v => setForm(f => ({ ...f, link_url: v }))} placeholder="https://..." /></Field>
                <Field label="Technologies"><TextInput value={form.technologies} onChange={v => setForm(f => ({ ...f, technologies: v }))} placeholder="React, Node.js" /></Field>
                <Field label="Highlights"><TextInput value={form.highlights} onChange={v => setForm(f => ({ ...f, highlights: v }))} /></Field>
              </>
            }
            enFields={
              <>
                <Field label="Title" required><TextInput value={form.en.title} onChange={v => setForm(f => ({ ...f, en: { ...f.en, title: v } }))} /></Field>
                <Field label="Category" required><TextInput value={form.en.category} onChange={v => setForm(f => ({ ...f, en: { ...f.en, category: v } }))} /></Field>
                <Field label="Problem" required><TextArea value={form.en.problem} onChange={v => setForm(f => ({ ...f, en: { ...f.en, problem: v } }))} /></Field>
                <Field label="Solution" required><TextArea value={form.en.solution} onChange={v => setForm(f => ({ ...f, en: { ...f.en, solution: v } }))} /></Field>
              </>
            }
            arFields={
              <>
                <Field label="العنوان" required><TextInput value={form.ar.title} onChange={v => setForm(f => ({ ...f, ar: { ...f.ar, title: v } }))} /></Field>
                <Field label="التصنيف" required><TextInput value={form.ar.category} onChange={v => setForm(f => ({ ...f, ar: { ...f.ar, category: v } }))} /></Field>
                <Field label="المشكلة" required><TextArea value={form.ar.problem} onChange={v => setForm(f => ({ ...f, ar: { ...f.ar, problem: v } }))} /></Field>
                <Field label="الحل" required><TextArea value={form.ar.solution} onChange={v => setForm(f => ({ ...f, ar: { ...f.ar, solution: v } }))} /></Field>
              </>
            }
          />
          <div className="flex gap-3 justify-end pt-2 border-t border-border">
            <button onClick={() => setModalOpen(false)} className="btn-ghost text-sm py-2 px-4 text-muted-foreground hover:text-foreground transition-colors">Cancel</button>
            <button onClick={handleSave} disabled={!form.number || !form.en.title || !form.ar.title || saveMut.isPending}
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
