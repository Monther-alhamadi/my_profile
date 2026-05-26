import { useState, useCallback, useEffect, useRef } from 'react'
import { Monitor, Smartphone } from 'lucide-react'
import { useLanguage } from '@/hooks/useLanguage'

interface ProjectGalleryProps {
  images: { desktop: string; mobile: string }
  title: string
}

export default function ProjectGallery({ images, title }: ProjectGalleryProps) {
  const { language } = useLanguage()
  const [view, setView] = useState<'desktop' | 'mobile'>('desktop')
  const [zoomed, setZoomed] = useState(false)
  const intervalRef = useRef<ReturnType<typeof setInterval>>()

  const toggleView = useCallback(() => {
    setView(v => v === 'desktop' ? 'mobile' : 'desktop')
  }, [])

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setView(v => v === 'desktop' ? 'mobile' : 'desktop')
    }, 4000)
    return () => clearInterval(intervalRef.current)
  }, [])

  return (
    <div className="relative group">
      <div
        className="relative overflow-hidden rounded-sm cursor-pointer border border-border/40 transition-all duration-500 hover:border-emerald-brand/30"
        onClick={() => setZoomed(!zoomed)}
        onMouseEnter={() => { clearInterval(intervalRef.current) }}
        onMouseLeave={() => {
          intervalRef.current = setInterval(() => setView(v => v === 'desktop' ? 'mobile' : 'desktop'), 4000)
        }}
      >
        <img
          src={view === 'desktop' ? images.desktop : images.mobile}
          alt={title}
          loading="lazy"
          className={`w-full transition-all duration-700 ${view === 'desktop' ? 'object-cover' : 'object-contain max-w-[280px] mx-auto'}`}
        />

        <div className="absolute inset-0 bg-gradient-to-t from-obsidian/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        <button
          onClick={(e) => { e.stopPropagation(); toggleView() }}
          aria-label={view === 'desktop'
            ? (language === 'ar' ? 'عرض الجوال' : 'Switch to mobile view')
            : (language === 'ar' ? 'عرض سطح المكتب' : 'Switch to desktop view')}
          className="absolute bottom-3 right-3 px-3 py-1.5 text-[11px] font-mono font-semibold uppercase tracking-wider rounded-sm bg-obsidian/80 text-ivory/70 border border-border/30 hover:border-emerald-brand/50 hover:text-emerald-brand transition-all backdrop-blur-sm opacity-0 group-hover:opacity-100 flex items-center gap-1.5"
        >
          {view === 'desktop' ? <Smartphone className="w-3.5 h-3.5" /> : <Monitor className="w-3.5 h-3.5" />}
          {view === 'desktop'
            ? (language === 'ar' ? 'جوال' : 'Mobile')
            : (language === 'ar' ? 'سطح المكتب' : 'Desktop')}
        </button>
      </div>

      {zoomed && (
        <div
          className="fixed inset-0 z-50 bg-obsidian/95 backdrop-blur-xl flex items-center justify-center p-8 cursor-zoom-out"
          onClick={() => setZoomed(false)}
        >
          <img
            src={view === 'desktop' ? images.desktop : images.mobile}
            alt={title}
            className="max-w-[90vw] max-h-[90vh] object-contain rounded-sm shadow-2xl"
          />
        </div>
      )}
    </div>
  )
}
