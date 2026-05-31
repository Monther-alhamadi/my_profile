import { useState, useCallback, useEffect, useRef } from 'react'
import { Monitor, Smartphone } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
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
    intervalRef.current = setInterval(toggleView, 4000)
    return () => clearInterval(intervalRef.current)
  }, [toggleView])

  return (
    <div className="relative group">
      <div
        className="relative overflow-hidden rounded-sm cursor-pointer border border-border/40 transition-all duration-500 hover:border-emerald-brand/30 aspect-[3/2] md:aspect-[4/3]"
        onClick={() => setZoomed(!zoomed)}
        onMouseEnter={() => clearInterval(intervalRef.current)}
        onMouseLeave={() => {
          intervalRef.current = setInterval(toggleView, 4000)
        }}
      >
        <AnimatePresence mode="wait">
          {view === 'desktop' ? (
            <motion.div
              key="desktop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="absolute inset-0 flex flex-col"
            >
              {/* Browser top bar */}
              <div className="flex items-center gap-1.5 px-3 py-[5px] bg-obsidian/90 border-b border-border/20 shrink-0">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
                <div className="ml-3 flex-1 max-w-[55%] h-[14px] rounded-[3px] bg-ivory/5 border border-border/10 px-2 flex items-center">
                  <span className="text-[7px] text-ivory/30 font-mono truncate">{title.toLowerCase().replace(/\s+/g, '-')}.com</span>
                </div>
              </div>
              {/* Image fills remaining space */}
              <div className="flex-1 relative overflow-hidden bg-obsidian/40">
                <img
                  src={images.desktop}
                  alt={title}
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="mobile"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="absolute inset-0 flex items-center justify-center bg-obsidian/60"
            >
              {/* Phone frame */}
              <div className="relative rounded-[14px] overflow-hidden border-[2px] border-ivory/10 bg-obsidian h-[88%] aspect-[9/19]">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 z-10 w-14 h-3 bg-obsidian/80 rounded-b-md flex items-center justify-center gap-1">
                  <span className="w-1 h-1 rounded-full bg-ivory/30" />
                  <span className="w-3 h-1 rounded-full bg-ivory/20" />
                </div>
                <div className="absolute inset-0 overflow-hidden">
                  <img
                    src={images.mobile}
                    alt={title}
                    loading="lazy"
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                </div>
                <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-16 h-[3px] rounded-full bg-ivory/20" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* View badge - top right */}
        <div className="absolute top-3 right-3 z-20 px-2.5 py-1 text-[10px] font-mono font-semibold uppercase tracking-wider rounded-sm bg-obsidian/80 text-ivory/60 border border-border/30 backdrop-blur-sm flex items-center gap-1.5 pointer-events-none">
          {view === 'desktop' ? <Monitor className="w-3 h-3" /> : <Smartphone className="w-3 h-3" />}
          {view === 'desktop'
            ? (language === 'ar' ? 'سطح المكتب' : 'Desktop')
            : (language === 'ar' ? 'جوال' : 'Mobile')}
        </div>

        {/* Hover gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-obsidian/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10" />

        {/* Toggle button */}
        <button
          onClick={(e) => { e.stopPropagation(); toggleView() }}
          aria-label={view === 'desktop'
            ? (language === 'ar' ? 'عرض الجوال' : 'Switch to mobile view')
            : (language === 'ar' ? 'عرض سطح المكتب' : 'Switch to desktop view')}
          className="absolute bottom-3 right-3 z-20 px-3 py-1.5 text-[11px] font-mono font-semibold uppercase tracking-wider rounded-sm bg-obsidian/80 text-ivory/70 border border-border/30 hover:border-emerald-brand/50 hover:text-emerald-brand transition-all backdrop-blur-sm opacity-0 group-hover:opacity-100 flex items-center gap-1.5"
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
