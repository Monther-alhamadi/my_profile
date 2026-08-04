import { X } from 'lucide-react'
import { useEffect, useRef } from 'react'

interface FormModalProps {
  open: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
  size?: 'sm' | 'lg'
}

export default function FormModal({ open, onClose, title, children, size = 'sm' }: FormModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  if (!open) return null

  const maxWidth = size === 'lg' ? 'max-w-4xl' : 'max-w-2xl'

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm p-0 sm:p-4"
      onClick={(e) => { if (e.target === overlayRef.current) onClose() }}
    >
      <div className={`bg-white rounded-t-lg sm:rounded-sm shadow-xl w-full ${maxWidth} max-h-[92dvh] sm:max-h-[90vh] flex flex-col overflow-hidden`}>
        <div className="flex items-center justify-between px-4 md:px-6 py-3 md:py-4 border-b border-border flex-shrink-0">
          <h2 className="text-sm md:text-base font-bold text-foreground">{title}</h2>
          <button onClick={onClose} className="p-2 hover:bg-muted rounded-sm transition-colors">
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>
        <div className="px-4 md:px-6 py-4 md:py-5 overflow-y-auto flex-1">
          {children}
        </div>
      </div>
    </div>
  )
}
