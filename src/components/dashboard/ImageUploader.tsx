import { useState, useRef } from 'react'
import { Upload, X, Image as ImageIcon } from 'lucide-react'
import { useLanguage } from '@/hooks/useLanguage'

interface ImageUploaderProps {
  currentUrl?: string | null
  onUpload: (file: File) => Promise<void>
  onRemove?: () => void
  folder?: string
}

export default function ImageUploader({ currentUrl, onUpload, onRemove }: ImageUploaderProps) {
  const { language } = useLanguage()
  const inputRef = useRef<HTMLInputElement>(null)
  const [preview, setPreview] = useState<string | null>(currentUrl ?? null)
  const [uploading, setUploading] = useState(false)

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setPreview(URL.createObjectURL(file))
    setUploading(true)
    try {
      await onUpload(file)
    } finally {
      setUploading(false)
    }
  }

  const handleRemove = () => {
    setPreview(null)
    if (inputRef.current) inputRef.current.value = ''
    onRemove?.()
  }

  return (
    <div>
      <input ref={inputRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />
      {preview ? (
        <div className="relative w-full h-40 rounded-sm overflow-hidden border border-border bg-muted/30 group">
          <img src={preview} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
            <button onClick={() => inputRef.current?.click()} disabled={uploading} className="p-2 bg-white/90 rounded-sm hover:bg-white transition-colors">
              <Upload className="w-4 h-4 text-obsidian" />
            </button>
            {onRemove && (
              <button onClick={handleRemove} className="p-2 bg-white/90 rounded-sm hover:bg-white transition-colors">
                <X className="w-4 h-4 text-red-500" />
              </button>
            )}
          </div>
          {uploading && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <span className="text-xs text-white font-mono">
                {language === 'ar' ? 'جاري الرفع...' : 'Uploading...'}
              </span>
            </div>
          )}
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="w-full h-40 rounded-sm border-2 border-dashed border-border hover:border-emerald-brand/50 transition-colors flex flex-col items-center justify-center gap-2 text-muted-foreground/50 hover:text-emerald-brand/70"
        >
          <ImageIcon className="w-6 h-6" />
          <span className="text-xs font-mono">
            {language === 'ar' ? 'اختر صورة' : 'Choose image'}
          </span>
        </button>
      )}
    </div>
  )
}
