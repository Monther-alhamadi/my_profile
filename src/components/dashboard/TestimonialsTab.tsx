import { useState } from 'react'
import { Star, Plus } from 'lucide-react'
import { useDualLocaleTestimonialsQuery, useBilingualSave, useBilingualDelete } from '@/services/portfolio-queries'
import { createTestimonial, updateTestimonial, deleteTestimonial } from '@/services/portfolio-api'
import { uploadImage, getImagePath } from '@/services/storage'
import { useAuth } from '@/hooks/useAuth'
import type { BilingualItem } from '@/services/portfolio-queries'
import type { Testimonial } from '@/lib'
import DataTable from './DataTable'
import FormModal from './FormModal'
import ConfirmDialog from './ConfirmDialog'
import ImageUploader from './ImageUploader'
import BilingualFields, { Field, TextInput, TextArea } from './BilingualFields'
import { toast } from 'sonner'

type FormData = {
  sort_order: number
  rating: number
  avatar_url: string | null
  en: { name: string; role: string; company: string; content: string }
  ar: { name: string; role: string; company: string; content: string }
}

const emptyForm: FormData = {
  sort_order: 0, rating: 5, avatar_url: null,
  en: { name: '', role: '', company: '', content: '' },
  ar: { name: '', role: '', company: '', content: '' },
}

export default function TestimonialsTab() {
  const { user } = useAuth()
  const { data: testimonials, isLoading } = useDualLocaleTestimonialsQuery()
  const saveMut = useBilingualSave('testimonials', createTestimonial, updateTestimonial)
  const deleteMut = useBilingualDelete('testimonials', deleteTestimonial)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<BilingualItem<Testimonial> | null>(null)
  const [form, setForm] = useState<FormData>(emptyForm)
  const [deleteTarget, setDeleteTarget] = useState<BilingualItem<Testimonial> | null>(null)
  const [avatarFile, setAvatarFile] = useState<File | null>(null)

  const openAdd = () => { setEditing(null); setForm(emptyForm); setAvatarFile(null); setModalOpen(true) }

  const openEdit = (item: BilingualItem<Testimonial>) => {
    setEditing(item)
    setForm({
      sort_order: item.en.sort_order ?? 0, rating: item.en.rating, avatar_url: item.en.avatar_url ?? null,
      en: { name: item.en.name, role: item.en.role, company: item.en.company, content: item.en.content },
      ar: { name: item.ar?.name ?? '', role: item.ar?.role ?? '', company: item.ar?.company ?? '', content: item.ar?.content ?? '' },
    })
    setAvatarFile(null)
    setModalOpen(true)
  }

  const handleSave = async () => {
    const shared = { sort_order: form.sort_order, rating: form.rating }
    let avatarUrl = form.avatar_url
    try {
      if (avatarFile && user) {
        const path = getImagePath(user.id, 'avatars', avatarFile.name)
        avatarUrl = await uploadImage(avatarFile, path)
      }
      const enData = { ...shared, ...form.en, avatar_url: avatarUrl }
      const arData = { ...shared, ...form.ar, avatar_url: avatarUrl }
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
          <Star className="w-5 h-5 text-emerald-brand" />
          <h2 className="text-lg font-bold text-obsidian">Testimonials</h2>
        </div>
        <button onClick={openAdd} className="btn-emerald text-xs py-2 px-3"><Plus className="w-3.5 h-3.5" />Add</button>
      </div>

      <DataTable
        columns={[
          { key: 'name', header: 'Name', render: (item: BilingualItem<Testimonial>) => <span className="font-medium text-sm">{item.en.name}</span> },
          { key: 'company', header: 'Company', render: (item: BilingualItem<Testimonial>) => <span className="text-xs text-muted-foreground">{item.en.company}</span> },
          { key: 'rating', header: 'Rating', render: (item: BilingualItem<Testimonial>) => (
            <span className="flex items-center gap-0.5">{Array.from({ length: item.en.rating }).map((_, i) => <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />)}</span>
          )},
        ]}
        data={testimonials} isLoading={isLoading}
        onEdit={openEdit} onDelete={(item: BilingualItem<Testimonial>) => setDeleteTarget(item)}
        onBulkDelete={(items) => {
          if (confirm(`Delete ${items.length} testimonial(s)?`)) {
            Promise.all(items.map(item => deleteMut.mutateAsync({ id: item.id })))
              .then(() => toast.success(`Deleted ${items.length} testimonial(s)`))
              .catch(() => toast.error('Delete failed'))
          }
        }}
        getId={(item) => item.id}
        exportFileName="testimonials"
        emptyMessage="No testimonials"
        emptyAction={{ label: 'Add a testimonial', onClick: openAdd }}
      />

      <FormModal open={modalOpen} onClose={() => setModalOpen(false)} size="lg"
        title={editing ? 'Edit Testimonial' : 'Add Testimonial'}>
        <div className="space-y-5">
          <div className="flex items-center gap-2 text-xs font-mono font-semibold text-muted-foreground mb-1">
            <Star className="w-3.5 h-3.5" />
            <span>Shared</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            <Field label="Rating" required>
              <div className="flex items-center gap-1 h-9">
                {[1, 2, 3, 4, 5].map(n => (
                  <button key={n} type="button" onClick={() => setForm(f => ({ ...f, rating: n }))}>
                    <Star className={`w-5 h-5 transition-colors ${n <= form.rating ? 'fill-amber-400 text-amber-400' : 'text-muted-foreground/20'}`} />
                  </button>
                ))}
              </div>
            </Field>
            <Field label="Order"><TextInput value={String(form.sort_order)} onChange={v => setForm(f => ({ ...f, sort_order: Number(v) || 0 }))} /></Field>
          </div>
          <Field label="Avatar"><ImageUploader currentUrl={editing?.en.avatar_url ?? undefined} onUpload={async (file) => setAvatarFile(file)} /></Field>

          <div className="border-t border-border" />

          <BilingualFields
            enFields={
              <>
                <Field label="Name" required><TextInput value={form.en.name} onChange={v => setForm(f => ({ ...f, en: { ...f.en, name: v } }))} /></Field>
                <Field label="Role" required><TextInput value={form.en.role} onChange={v => setForm(f => ({ ...f, en: { ...f.en, role: v } }))} /></Field>
                <Field label="Company" required><TextInput value={form.en.company} onChange={v => setForm(f => ({ ...f, en: { ...f.en, company: v } }))} /></Field>
                <Field label="Content" required><TextArea value={form.en.content} onChange={v => setForm(f => ({ ...f, en: { ...f.en, content: v } }))} /></Field>
              </>
            }
            arFields={
              <>
                <Field label="الاسم" required><TextInput value={form.ar.name} onChange={v => setForm(f => ({ ...f, ar: { ...f.ar, name: v } }))} /></Field>
                <Field label="المسمى" required><TextInput value={form.ar.role} onChange={v => setForm(f => ({ ...f, ar: { ...f.ar, role: v } }))} /></Field>
                <Field label="الشركة" required><TextInput value={form.ar.company} onChange={v => setForm(f => ({ ...f, ar: { ...f.ar, company: v } }))} /></Field>
                <Field label="المحتوى" required><TextArea value={form.ar.content} onChange={v => setForm(f => ({ ...f, ar: { ...f.ar, content: v } }))} /></Field>
              </>
            }
          />
          <div className="flex gap-3 justify-end pt-2 border-t border-border">
            <button onClick={() => setModalOpen(false)} className="btn-ghost text-sm py-2 px-4 text-muted-foreground hover:text-foreground transition-colors">Cancel</button>
            <button onClick={handleSave} disabled={!form.en.name || !form.ar.name || !form.en.content || !form.ar.content || saveMut.isPending}
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
