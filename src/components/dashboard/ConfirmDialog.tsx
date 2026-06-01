import { AlertTriangle } from 'lucide-react'
import { useLanguage } from '@/hooks/useLanguage'

interface ConfirmDialogProps {
  open: boolean
  onConfirm: () => void
  onCancel: () => void
  title?: string
  description?: string
  confirmLabel?: string
  loading?: boolean
}

export default function ConfirmDialog({
  open, onConfirm, onCancel, title, description, confirmLabel, loading,
}: ConfirmDialogProps) {
  const { language } = useLanguage()

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-3">
      <div className="bg-white rounded-sm shadow-xl w-full max-w-sm mx-auto p-5 md:p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-9 h-9 md:w-10 md:h-10 bg-red-50 rounded-sm flex items-center justify-center flex-shrink-0">
            <AlertTriangle className="w-4 h-4 md:w-5 md:h-5 text-red-500" />
          </div>
          <div className="min-w-0">
            <h3 className="text-sm md:text-base font-bold text-foreground">
              {title ?? (language === 'ar' ? 'تأكيد الحذف' : 'Confirm deletion')}
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              {description ?? (language === 'ar' ? 'لا يمكن التراجع عن هذا الإجراء.' : 'This action cannot be undone.')}
            </p>
          </div>
        </div>
        <div className="flex gap-3 justify-end">
          <button
            onClick={onCancel}
            disabled={loading}
            className="btn-ghost text-sm py-[11px] px-5 text-muted-foreground hover:text-foreground transition-colors"
          >
            {language === 'ar' ? 'إلغاء' : 'Cancel'}
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="bg-red-500 hover:bg-red-600 text-white text-sm py-[11px] px-5 rounded-sm transition-colors disabled:opacity-40 font-medium"
          >
            {loading
              ? (language === 'ar' ? 'جاري الحذف...' : 'Deleting...')
              : (confirmLabel ?? (language === 'ar' ? 'حذف' : 'Delete'))}
          </button>
        </div>
      </div>
    </div>
  )
}
