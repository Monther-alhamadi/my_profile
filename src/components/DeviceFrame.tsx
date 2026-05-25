interface DeviceFrameProps {
  src: string
  type: 'desktop' | 'mobile'
  alt: string
  className?: string
}

export default function DeviceFrame({ src, type, alt, className = '' }: DeviceFrameProps) {
  if (type === 'mobile') {
    return (
      <div className={`relative mx-auto w-[240px] ${className}`}>
        <div className="absolute inset-0 rounded-[32px] border-[3px] border-ivory/10" />
        <div className="absolute top-2 left-1/2 -translate-x-1/2 w-20 h-1.5 bg-ivory/8 rounded-full" />
        <div className="overflow-hidden rounded-[28px] border border-ivory/5 m-[6px]">
          <img src={src} alt={alt} className="w-full h-auto" />
        </div>
      </div>
    )
  }

  return (
    <div className={`relative ${className}`}>
      <div className="overflow-hidden rounded-sm border border-ivory/10 shadow-lg">
        <div className="h-5 bg-obsidian-mid flex items-center px-3 gap-1.5 border-b border-ivory/5">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
          <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/60" />
        </div>
        <img src={src} alt={alt} className="w-full h-auto" />
      </div>
    </div>
  )
}
