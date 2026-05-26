import { useState } from 'react'
import { FolderKanban, Plus } from 'lucide-react'
import { useLanguage } from '@/hooks/useLanguage'
import { useProjectsQuery, useCreateProject, useUpdateProject, useDeleteProject } from '@/services/portfolio-queries'
import { uploadImage, getImagePath } from '@/services/storage'
import { useAuth } from '@/hooks/useAuth'
import type { Project } from '@/lib'
import DataTable from './DataTable'
import FormModal from './FormModal'
import ConfirmDialog from './ConfirmDialog'
import ImageUploader from './ImageUploader'
import { toast } from 'sonner'

const COMPLEXITIES = ['High', 'Critical', 'Advanced'] as const

const emptyForm = {
  title: '', category: '', problem: '', solution: '',
  complexity: 'High' as const, technologies: '', highlights: '',
  link_url: '', number: '',
}

export default function ProjectsTab() {
  const { language } = useLanguage()
  const { user } = useAuth()
  const { data: projects, isLoading } = useProjectsQuery(language)
  const createMut = useCreateProject()
  const updateMut = useUpdateProject()
  const deleteMut = useDeleteProject()
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Project | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [deleteTarget, setDeleteTarget] = useState<Project | null>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)

  const openAdd = () => {
    setEditing(null)
    setForm(emptyForm)
    setImageFile(null)
    setModalOpen(true)
  }

  const openEdit = (p: Project) => {
    setEditing(p)
    setForm({
      title: p.title, category: p.category,
      problem: p.problem, solution: p.solution,
      complexity: p.complexity, technologies: p.technologies.join(', '),
      highlights: p.highlights.join(', '),
      link_url: p.link_url ?? '', number: p.number,
    })
    setImageFile(null)
    setModalOpen(true)
  }

  const handleSave = async () => {
    const payload: Record<string, string | string[] | null> = {
      title: form.title, category: form.category,
      problem: form.problem, solution: form.solution,
      complexity: form.complexity,
      technologies: form.technologies.split(',').map(s => s.trim()).filter(Boolean),
      highlights: form.highlights.split(',').map(s => s.trim()).filter(Boolean),
      link_url: form.link_url || null,
      number: form.number,
    }

    try {
      if (imageFile && user) {
        const path = getImagePath(user.id, 'projects', imageFile.name)
        payload.image_url = await uploadImage(imageFile, path)
      }

      if (editing) {
        await updateMut.mutateAsync({ id: editing.id, locale: language, updates: payload })
        toast.success(language === 'ar' ? 'تم تحديث المشروع' : 'Project updated')
      } else {
        await createMut.mutateAsync({ ...payload, id: crypto.randomUUID(), locale: language })
        toast.success(language === 'ar' ? 'تم إنشاء المشروع' : 'Project created')
      }
      setModalOpen(false)
    } catch {
      toast.error(language === 'ar' ? 'فشل الحفظ' : 'Save failed')
    }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    try {
      await deleteMut.mutateAsync({ id: deleteTarget.id, locale: deleteTarget.locale ?? language })
      toast.success(language === 'ar' ? 'تم الحذف' : 'Deleted')
      setDeleteTarget(null)
    } catch {
      toast.error(language === 'ar' ? 'فشل الحذف' : 'Delete failed')
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <FolderKanban className="w-5 h-5 text-emerald-brand" />
          <h2 className="text-lg font-bold text-obsidian">{language === 'ar' ? 'المشاريع' : 'Projects'}</h2>
        </div>
        <button onClick={openAdd} className="btn-emerald text-xs py-2 px-3">
          <Plus className="w-3.5 h-3.5" />
          {language === 'ar' ? 'إضافة' : 'Add'}
        </button>
      </div>

      <DataTable
        columns={[
          { key: 'number', header: '#', render: (p: Project) => <span className="font-mono text-xs text-muted-foreground">{p.number}</span> },
          { key: 'title', header: language === 'ar' ? 'العنوان' : 'Title', render: (p: Project) => <span className="font-medium text-sm">{p.title}</span> },
          { key: 'category', header: language === 'ar' ? 'التصنيف' : 'Category', render: (p: Project) => <span className="text-xs text-muted-foreground">{p.category}</span> },
          { key: 'complexity', header: language === 'ar' ? 'التعقيد' : 'Complexity', render: (p: Project) => (
            <span className={`text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded-sm ${
              p.complexity === 'Critical' ? 'bg-red-50 text-red-600'
              : p.complexity === 'High' ? 'bg-amber-50 text-amber-600'
              : 'bg-blue-50 text-blue-600'
            }`}>{p.complexity}</span>
          )},
        ]}
        data={projects}
        onEdit={openEdit}
        onDelete={(p: Project) => setDeleteTarget(p)}
        isLoading={isLoading}
        emptyMessage={language === 'ar' ? 'لا توجد مشاريع' : 'No projects'}
        emptyAction={{ label: language === 'ar' ? 'أضف مشروعاً' : 'Add a project', onClick: openAdd }}
      />

      <FormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing
          ? (language === 'ar' ? 'تعديل المشروع' : 'Edit Project')
          : (language === 'ar' ? 'إضافة مشروع' : 'Add Project')}
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-mono font-semibold text-muted-foreground mb-1 block">{language === 'ar' ? 'العنوان' : 'Title'} *</label>
              <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} className="w-full h-9 px-3 border border-border rounded-sm text-sm focus:border-emerald-brand focus:outline-none" />
            </div>
            <div>
              <label className="text-xs font-mono font-semibold text-muted-foreground mb-1 block">{language === 'ar' ? 'الرقم' : 'Number'} *</label>
              <input value={form.number} onChange={e => setForm(f => ({ ...f, number: e.target.value }))} className="w-full h-9 px-3 border border-border rounded-sm text-sm focus:border-emerald-brand focus:outline-none" placeholder="01" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-mono font-semibold text-muted-foreground mb-1 block">{language === 'ar' ? 'التصنيف' : 'Category'} *</label>
              <input value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} className="w-full h-9 px-3 border border-border rounded-sm text-sm focus:border-emerald-brand focus:outline-none" />
            </div>
            <div>
              <label className="text-xs font-mono font-semibold text-muted-foreground mb-1 block">{language === 'ar' ? 'التعقيد' : 'Complexity'} *</label>
              <select value={form.complexity} onChange={e => setForm(f => ({ ...f, complexity: e.target.value as typeof COMPLEXITIES[number] }))} className="w-full h-9 px-3 border border-border rounded-sm text-sm focus:border-emerald-brand focus:outline-none bg-white">
                {COMPLEXITIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="text-xs font-mono font-semibold text-muted-foreground mb-1 block">{language === 'ar' ? 'وصف المشكلة' : 'Problem'} *</label>
            <textarea value={form.problem} onChange={e => setForm(f => ({ ...f, problem: e.target.value }))} rows={3} className="w-full px-3 py-2 border border-border rounded-sm text-sm focus:border-emerald-brand focus:outline-none resize-none" />
          </div>
          <div>
            <label className="text-xs font-mono font-semibold text-muted-foreground mb-1 block">{language === 'ar' ? 'وصف الحل' : 'Solution'} *</label>
            <textarea value={form.solution} onChange={e => setForm(f => ({ ...f, solution: e.target.value }))} rows={3} className="w-full px-3 py-2 border border-border rounded-sm text-sm focus:border-emerald-brand focus:outline-none resize-none" />
          </div>
          <div>
            <label className="text-xs font-mono font-semibold text-muted-foreground mb-1 block">{language === 'ar' ? 'التقنيات (مفصولة بفواصل)' : 'Technologies (comma-separated)'}</label>
            <input value={form.technologies} onChange={e => setForm(f => ({ ...f, technologies: e.target.value }))} className="w-full h-9 px-3 border border-border rounded-sm text-sm focus:border-emerald-brand focus:outline-none" placeholder="React, Node.js, PostgreSQL" />
          </div>
          <div>
            <label className="text-xs font-mono font-semibold text-muted-foreground mb-1 block">{language === 'ar' ? 'أبرز النقاط (مفصولة بفواصل)' : 'Highlights (comma-separated)'}</label>
            <textarea value={form.highlights} onChange={e => setForm(f => ({ ...f, highlights: e.target.value }))} rows={2} className="w-full px-3 py-2 border border-border rounded-sm text-sm focus:border-emerald-brand focus:outline-none resize-none" placeholder="Feature 1, Feature 2, Feature 3" />
          </div>
          <div>
            <label className="text-xs font-mono font-semibold text-muted-foreground mb-1 block">{language === 'ar' ? 'الرابط' : 'Link URL'}</label>
            <input value={form.link_url} onChange={e => setForm(f => ({ ...f, link_url: e.target.value }))} className="w-full h-9 px-3 border border-border rounded-sm text-sm focus:border-emerald-brand focus:outline-none" placeholder="https://..." />
          </div>
          <div>
            <label className="text-xs font-mono font-semibold text-muted-foreground mb-1 block">{language === 'ar' ? 'صورة المشروع' : 'Project Image'}</label>
            <ImageUploader
              currentUrl={editing?.image_url}
              onUpload={async (file) => setImageFile(file)}
            />
          </div>
          <div className="flex gap-3 justify-end pt-2">
            <button onClick={() => setModalOpen(false)} className="btn-ghost text-sm py-2 px-4 text-muted-foreground hover:text-foreground transition-colors">
              {language === 'ar' ? 'إلغاء' : 'Cancel'}
            </button>
            <button
              onClick={handleSave}
              disabled={!form.title || !form.problem || !form.solution || createMut.isPending || updateMut.isPending}
              className="btn-emerald text-sm py-2 px-4 disabled:opacity-40"
            >
              {createMut.isPending || updateMut.isPending
                ? (language === 'ar' ? 'جاري الحفظ...' : 'Saving...')
                : (language === 'ar' ? 'حفظ' : 'Save')}
            </button>
          </div>
        </div>
      </FormModal>

      <ConfirmDialog
        open={!!deleteTarget}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        loading={deleteMut.isPending}
      />
    </div>
  )
}
