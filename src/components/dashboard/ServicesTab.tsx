import { useState } from 'react'
import { Briefcase, Plus } from 'lucide-react'
import { useDualLocaleServicesQuery, useBilingualSave, useBilingualDelete } from '@/services/portfolio-queries'
import { createService, updateService, deleteService } from '@/services/portfolio-api'
import type { BilingualItem } from '@/services/portfolio-queries'
import type { Service } from '@/lib'
import DataTable from './DataTable'
import FormModal from './FormModal'
import ConfirmDialog from './ConfirmDialog'
import BilingualFields, { Field, TextInput, TextArea } from './BilingualFields'
import { toast } from 'sonner'

type FormData = {
  icon: string
  sort_order: number
  en: { title: string; description: string; pricing: string; features: string }
  ar: { title: string; description: string; pricing: string; features: string }
}

const emptyForm: FormData = {
  icon: '', sort_order: 0,
  en: { title: '', description: '', pricing: '', features: '' },
  ar: { title: '', description: '', pricing: '', features: '' },
}

export default function ServicesTab() {
  const { data: services, isLoading } = useDualLocaleServicesQuery()
  const saveMut = useBilingualSave('services', createService, updateService)
  const deleteMut = useBilingualDelete('services', deleteService)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<BilingualItem<Service> | null>(null)
  const [form, setForm] = useState<FormData>(emptyForm)
  const [deleteTarget, setDeleteTarget] = useState<BilingualItem<Service> | null>(null)

  const openAdd = () => { setEditing(null); setForm(emptyForm); setModalOpen(true) }

  const openEdit = (item: BilingualItem<Service>) => {
    setEditing(item)
    setForm({
      icon: item.en.icon, sort_order: item.en.sort_order ?? 0,
      en: { title: item.en.title, description: item.en.description, pricing: item.en.pricing, features: item.en.features.join(', ') },
      ar: { title: item.ar?.title ?? '', description: item.ar?.description ?? '', pricing: item.ar?.pricing ?? '', features: item.ar?.features?.join(', ') ?? '' },
    })
    setModalOpen(true)
  }

  const handleSave = async () => {
    const shared = { icon: form.icon, sort_order: form.sort_order }
    const enData = { ...shared, ...form.en, features: form.en.features.split(',').map(s => s.trim()).filter(Boolean) }
    const arData = { ...shared, ...form.ar, features: form.ar.features.split(',').map(s => s.trim()).filter(Boolean) }
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
          <Briefcase className="w-5 h-5 text-emerald-brand" />
          <h2 className="text-lg font-bold text-obsidian">Services</h2>
        </div>
        <button onClick={openAdd} className="btn-emerald text-xs py-2 px-3"><Plus className="w-3.5 h-3.5" />Add</button>
      </div>

      <DataTable
        columns={[
          { key: 'title', header: 'Title', render: (item: BilingualItem<Service>) => <span className="font-medium text-sm">{item.en.title}</span> },
          { key: 'pricing', header: 'Pricing', render: (item: BilingualItem<Service>) => <span className="text-xs font-mono text-muted-foreground">{item.en.pricing}</span> },
        ]}
        data={services} isLoading={isLoading}
        onEdit={openEdit} onDelete={(item: BilingualItem<Service>) => setDeleteTarget(item)}
        onBulkDelete={(items) => {
          if (confirm(`Delete ${items.length} service(s)?`)) {
            Promise.all(items.map(item => deleteMut.mutateAsync({ id: item.id })))
              .then(() => toast.success(`Deleted ${items.length} service(s)`))
              .catch(() => toast.error('Delete failed'))
          }
        }}
        getId={(item) => item.id}
        exportFileName="services"
        emptyMessage="No services"
        emptyAction={{ label: 'Add a service', onClick: openAdd }}
      />

      <FormModal open={modalOpen} onClose={() => setModalOpen(false)} size="lg"
        title={editing ? 'Edit Service' : 'Add Service'}>
        <div className="space-y-5">
          <BilingualFields
            sharedFields={
              <>
                <Field label="Icon" required><TextInput value={form.icon} onChange={v => setForm(f => ({ ...f, icon: v }))} placeholder="briefcase" /></Field>
                <Field label="Order"><TextInput value={String(form.sort_order)} onChange={v => setForm(f => ({ ...f, sort_order: Number(v) || 0 }))} /></Field>
              </>
            }
            enFields={
              <>
                <Field label="Title" required><TextInput value={form.en.title} onChange={v => setForm(f => ({ ...f, en: { ...f.en, title: v } }))} /></Field>
                <Field label="Description" required><TextArea value={form.en.description} onChange={v => setForm(f => ({ ...f, en: { ...f.en, description: v } }))} /></Field>
                <Field label="Pricing" required><TextInput value={form.en.pricing} onChange={v => setForm(f => ({ ...f, en: { ...f.en, pricing: v } }))} placeholder="From $5,000" /></Field>
                <Field label="Features"><TextArea value={form.en.features} onChange={v => setForm(f => ({ ...f, en: { ...f.en, features: v } }))} rows={2} /></Field>
              </>
            }
            arFields={
              <>
                <Field label="العنوان" required><TextInput value={form.ar.title} onChange={v => setForm(f => ({ ...f, ar: { ...f.ar, title: v } }))} /></Field>
                <Field label="الوصف" required><TextArea value={form.ar.description} onChange={v => setForm(f => ({ ...f, ar: { ...f.ar, description: v } }))} /></Field>
                <Field label="السعر" required><TextInput value={form.ar.pricing} onChange={v => setForm(f => ({ ...f, ar: { ...f.ar, pricing: v } }))} placeholder="يبدأ من ٥,٠٠٠ ريال" /></Field>
                <Field label="الميزات"><TextArea value={form.ar.features} onChange={v => setForm(f => ({ ...f, ar: { ...f.ar, features: v } }))} rows={2} /></Field>
              </>
            }
          />
          <div className="flex gap-3 justify-end pt-2 border-t border-border">
            <button onClick={() => setModalOpen(false)} className="btn-ghost text-sm py-2 px-4 text-muted-foreground hover:text-foreground transition-colors">Cancel</button>
            <button onClick={handleSave} disabled={!form.icon || !form.en.title || !form.ar.title || saveMut.isPending}
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
