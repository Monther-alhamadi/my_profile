import { useState, useCallback, useEffect, useRef } from 'react'
import { Monitor, Smartphone, Store, Sparkles, Lock, Zap } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLanguage } from '@/hooks/useLanguage'

interface ProjectGalleryProps {
  images: { desktop: string; mobile: string; type?: 'mobile-app' | 'web-app' }
  title: string
  projectId?: string
}

function PhoneFrame({ children, variant = 'modern' }: { children: React.ReactNode; variant?: 'modern' | 'classic' }) {
  return (
    <div className="relative select-none" style={{ width: 'min(220px, 38vh)', aspectRatio: '9/19.5' }}>
      {/* Phone outer shell with realistic shadow */}
      <div className="absolute inset-0 rounded-[28px] bg-gradient-to-b from-zinc-700 via-zinc-800 to-zinc-900 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.7),0_0_0_1px_rgba(255,255,255,0.05)]" />

      {/* Side buttons - right */}
      <div className="absolute -right-[3px] top-[18%] w-[3px] h-[8%] rounded-r-sm bg-zinc-600" />
      <div className="absolute -right-[3px] top-[30%] w-[3px] h-[14%] rounded-r-sm bg-zinc-600" />
      <div className="absolute -right-[3px] top-[48%] w-[3px] h-[14%] rounded-r-sm bg-zinc-600" />

      {/* Side buttons - left */}
      <div className="absolute -left-[3px] top-[28%] w-[3px] h-[6%] rounded-l-sm bg-zinc-600" />
      <div className="absolute -left-[3px] top-[38%] w-[3px] h-[6%] rounded-l-sm bg-zinc-600" />

      {/* Inner screen area */}
      <div className="absolute inset-[3px] rounded-[25px] overflow-hidden bg-black">
        {/* Status bar */}
        <div className="absolute top-0 inset-x-0 z-20 h-10 flex items-end justify-between px-5 pb-1">
          <span className="text-[9px] font-semibold text-white/90">9:41</span>
          <div className="flex items-center gap-1">
            <svg className="w-3 h-3 text-white/90" viewBox="0 0 24 24" fill="currentColor">
              <path d="M1 9l2 2c4.97-4.97 13.03-4.97 18 0l2-2C16.93 2.93 7.08 2.93 1 9zm8 8l3 3 3-3c-1.65-1.66-4.34-1.66-6 0zm-4-4l2 2c2.76-2.76 7.24-2.76 10 0l2-2C15.14 9.14 8.87 9.14 5 13z"/>
            </svg>
            <svg className="w-3 h-3 text-white/90" viewBox="0 0 24 24" fill="currentColor">
              <path d="M15.67 4H14V2h-4v2H8.33C7.6 4 7 4.6 7 5.33v15.33C7 21.4 7.6 22 8.33 22h7.33c.74 0 1.34-.6 1.34-1.33V5.33C17 4.6 16.4 4 15.67 4z"/>
            </svg>
          </div>
        </div>

        {/* Dynamic Island */}
        {variant === 'modern' && (
          <div className="absolute top-[7px] left-1/2 -translate-x-1/2 z-30 w-[30%] h-[22px] bg-black rounded-full flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-zinc-800 ring-1 ring-zinc-700" />
          </div>
        )}

        {/* Classic notch */}
        {variant === 'classic' && (
          <div className="absolute top-0 left-0 right-0 z-30 h-[22px] flex justify-center">
            <div className="w-[40%] h-full bg-black rounded-b-2xl flex items-center justify-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-zinc-800" />
              <div className="w-2.5 h-2.5 rounded-full bg-zinc-800 ring-1 ring-zinc-700" />
            </div>
          </div>
        )}

        {/* Screen content */}
        <div className="absolute inset-0 overflow-hidden">
          {children}
        </div>

        {/* Home indicator */}
        <div className="absolute bottom-[6px] left-1/2 -translate-x-1/2 z-20 w-[35%] h-[4px] rounded-full bg-white/30" />
      </div>
    </div>
  )
}

function BrowserFrame({ children, title }: { children: React.ReactNode; title: string }) {
  return (
    <div className="relative w-full h-full select-none">
      {/* Browser chrome */}
      <div className="flex items-center gap-2 px-3 py-2 bg-[#1e1e2e] border-b border-white/[0.06] shrink-0">
        <div className="flex items-center gap-1.5">
          <span className="w-[10px] h-[10px] rounded-full bg-[#ff5f57] shadow-[0_0_4px_rgba(255,95,87,0.4)]" />
          <span className="w-[10px] h-[10px] rounded-full bg-[#febc2e] shadow-[0_0_4px_rgba(254,188,46,0.4)]" />
          <span className="w-[10px] h-[10px] rounded-full bg-[#28c840] shadow-[0_0_4px_rgba(40,200,64,0.4)]" />
        </div>
        <div className="flex-1 mx-2">
          <div className="flex items-center gap-1.5 h-[24px] rounded-md bg-black/30 border border-white/[0.06] px-2.5">
            <Lock className="w-2.5 h-2.5 text-white/25 shrink-0" />
            <span className="text-[10px] text-white/30 font-mono truncate">
              {title.toLowerCase().replace(/\s+/g, '')}.com
            </span>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-5 h-5 rounded flex items-center justify-center hover:bg-white/[0.06]">
            <svg className="w-3 h-3 text-white/30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 5v14M5 12h14" />
            </svg>
          </div>
        </div>
      </div>
      {/* Page content */}
      <div className="flex-1 overflow-hidden bg-[#0d0d14]">
        {children}
      </div>
    </div>
  )
}

function PlaceholderContent({ title, type, language }: { title: string; type: 'mobile-app' | 'web-app'; language: string }) {
  const icons = {
    'mobile-app': Store,
    'web-app': Sparkles,
  }
  const Icon = icons[type]

  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-zinc-900 via-zinc-900 to-zinc-800 p-4">
      <div className="w-10 h-10 mb-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
        <Icon className="w-5 h-5 text-emerald-400" />
      </div>
      <span className="text-[10px] font-bold text-white/80 text-center leading-tight mb-1">{title}</span>
      <span className="text-[7px] text-white/30 font-mono uppercase tracking-wider">
        {language === 'ar' ? 'قريباً' : 'Coming Soon'}
      </span>
      <div className="flex gap-1 mt-3">
        {[1, 2, 3].map(i => (
          <div key={i} className="w-8 h-5 rounded-[3px] bg-white/[0.04] border border-white/[0.06]" />
        ))}
      </div>
    </div>
  )
}

export default function ProjectGallery({ images, title, projectId }: ProjectGalleryProps) {
  const { language } = useLanguage()
  const [view, setView] = useState<'desktop' | 'mobile'>(
    images.type === 'mobile-app' ? 'mobile' : 'desktop'
  )
  const [zoomed, setZoomed] = useState(false)
  const intervalRef = useRef<ReturnType<typeof setInterval>>()

  const isMobileApp = images.type === 'mobile-app'

  const toggleView = useCallback(() => {
    setView(v => v === 'desktop' ? 'mobile' : 'desktop')
  }, [])

  useEffect(() => {
    if (!isMobileApp) {
      intervalRef.current = setInterval(toggleView, 5000)
    }
    return () => clearInterval(intervalRef.current)
  }, [toggleView, isMobileApp])

  const desktopImg = images.desktop
  const mobileImg = images.mobile

  return (
    <div className="relative group">
      <div
        className="relative overflow-hidden rounded-sm cursor-pointer border border-white/[0.06] transition-all duration-500 hover:border-emerald-500/30 hover:shadow-[0_0_40px_-15px_rgba(16,185,129,0.15)] aspect-[4/3]"
        onClick={() => setZoomed(!zoomed)}
        onMouseEnter={() => clearInterval(intervalRef.current)}
        onMouseLeave={() => {
          if (!isMobileApp) {
            intervalRef.current = setInterval(toggleView, 5000)
          }
        }}
      >
        <AnimatePresence mode="wait">
          {view === 'desktop' ? (
            <motion.div
              key="desktop"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="absolute inset-0"
            >
              <BrowserFrame title={title}>
                {desktopImg ? (
                  <img
                    src={desktopImg}
                    alt={title}
                    loading="lazy"
                    className="w-full h-full object-cover object-top"
                  />
                ) : (
                  <PlaceholderContent title={title} type="web-app" language={language} />
                )}
              </BrowserFrame>
            </motion.div>
          ) : (
            <motion.div
              key="mobile"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950"
            >
              {/* Subtle ambient glow behind phone */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-[60%] h-[60%] rounded-full bg-emerald-500/[0.03] blur-3xl" />
              </div>

              <div className="relative z-10 flex items-center gap-4">
                {/* Phone mockup */}
                <PhoneFrame variant="modern">
                  {mobileImg ? (
                    <img
                      src={mobileImg}
                      alt={title}
                      loading="lazy"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <PlaceholderContent title={title} type="mobile-app" language={language} />
                  )}
                </PhoneFrame>

                {/* Second phone (shadow/depth) for mobile apps */}
                {isMobileApp && mobileImg && (
                  <div className="hidden lg:block opacity-40 -ml-8 relative z-0">
                    <PhoneFrame variant="classic">
                      <img
                        src={mobileImg}
                        alt=""
                        loading="lazy"
                        className="w-full h-full object-cover blur-[1px]"
                      />
                    </PhoneFrame>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* View badge */}
        <div className="absolute top-3 right-3 z-20 px-2.5 py-1 text-[10px] font-mono font-semibold uppercase tracking-wider rounded-sm bg-black/60 text-white/60 border border-white/10 backdrop-blur-md flex items-center gap-1.5 pointer-events-none">
          {view === 'desktop' ? <Monitor className="w-3 h-3" /> : <Smartphone className="w-3 h-3" />}
          {view === 'desktop'
            ? (language === 'ar' ? 'واجهة ويب' : 'Web View')
            : (language === 'ar' ? 'تطبيق جوال' : 'Mobile App')}
        </div>

        {/* Hover gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10" />

        {/* Toggle button */}
        <button
          onClick={(e) => { e.stopPropagation(); toggleView() }}
          aria-label={view === 'desktop'
            ? (language === 'ar' ? 'عرض الجوال' : 'Switch to mobile view')
            : (language === 'ar' ? 'عرض سطح المكتب' : 'Switch to desktop view')}
          className="absolute bottom-3 right-3 z-20 px-3 py-1.5 text-[11px] font-mono font-semibold uppercase tracking-wider rounded-sm bg-black/60 text-white/70 border border-white/10 hover:border-emerald-500/50 hover:text-emerald-400 transition-all backdrop-blur-md opacity-0 group-hover:opacity-100 flex items-center gap-1.5"
        >
          {view === 'desktop' ? <Smartphone className="w-3.5 h-3.5" /> : <Monitor className="w-3.5 h-3.5" />}
          {view === 'desktop'
            ? (language === 'ar' ? 'تطبيق' : 'App')
            : (language === 'ar' ? 'ويب' : 'Web')}
        </button>
      </div>

      {/* Lightbox */}
      {zoomed && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 md:p-8 cursor-zoom-out"
          onClick={() => setZoomed(false)}
        >
          <motion.img
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
            src={view === 'desktop' ? desktopImg : mobileImg}
            alt={title}
            className="max-w-[90vw] max-h-[90vh] object-contain rounded-lg shadow-2xl"
          />
        </motion.div>
      )}
    </div>
  )
}
