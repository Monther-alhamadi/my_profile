import { motion } from 'framer-motion'

const pulse = {
  initial: { opacity: 0.5 },
  animate: { opacity: [0.5, 0.8, 0.5] },
  transition: { duration: 1.4, repeat: Infinity, ease: 'easeInOut' },
}

export function SkeletonBlock({ className = '' }: { className?: string }) {
  return (
    <motion.div
      {...pulse}
      className={`bg-muted rounded-sm ${className}`}
    />
  )
}

export function HeroSkeleton() {
  return (
    <div className="section-ivory min-h-screen flex flex-col justify-center relative overflow-hidden px-6 lg:px-12">
      <div className="max-w-7xl mx-auto w-full">
        <SkeletonBlock className="h-3 w-24 mb-8" />
        <SkeletonBlock className="h-14 w-3/4 mb-3" />
        <SkeletonBlock className="h-14 w-1/2 mb-6" />
        <SkeletonBlock className="h-5 w-96 max-w-full mb-4" />
        <SkeletonBlock className="h-5 w-80 max-w-full mb-10" />
        <div className="flex gap-4">
          <SkeletonBlock className="h-12 w-40" />
          <SkeletonBlock className="h-12 w-40" />
        </div>
      </div>
    </div>
  )
}

export function SectionHeaderSkeleton() {
  return (
    <div className="mb-16">
      <SkeletonBlock className="h-3 w-16 mb-5" />
      <SkeletonBlock className="h-12 w-72 mb-4" />
      <SkeletonBlock className="h-5 w-96 max-w-full" />
    </div>
  )
}

export function ProjectsSkeleton() {
  return (
    <section className="section-obsidian px-6 lg:px-12 py-24">
      <div className="max-w-7xl mx-auto">
        <SectionHeaderSkeleton />
        <div className="grid md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="ruled-card-dark p-6">
              <SkeletonBlock className="h-40 w-full mb-4" />
              <SkeletonBlock className="h-5 w-3/4 mb-2" />
              <SkeletonBlock className="h-4 w-1/2 mb-4" />
              <div className="flex gap-2">
                <SkeletonBlock className="h-6 w-16" />
                <SkeletonBlock className="h-6 w-20" />
                <SkeletonBlock className="h-6 w-14" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export function SkillsSkeleton() {
  return (
    <section className="section-ivory px-6 lg:px-12 py-24">
      <div className="max-w-7xl mx-auto">
        <SectionHeaderSkeleton />
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="ruled-card p-6">
              <SkeletonBlock className="h-8 w-8 mb-4" />
              <SkeletonBlock className="h-5 w-32 mb-2" />
              <SkeletonBlock className="h-4 w-full mb-1" />
              <SkeletonBlock className="h-4 w-3/4 mb-3" />
              <div className="flex flex-wrap gap-2 mt-3">
                {[1, 2, 3, 4].map(j => (
                  <SkeletonBlock key={j} className="h-6 w-16" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export function ServicesSkeleton() {
  return (
    <section className="section-obsidian px-6 lg:px-12 py-24">
      <div className="max-w-7xl mx-auto">
        <SectionHeaderSkeleton />
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="ruled-card-dark p-6">
              <SkeletonBlock className="h-10 w-10 mb-4" />
              <SkeletonBlock className="h-5 w-40 mb-2" />
              <SkeletonBlock className="h-4 w-full mb-1" />
              <SkeletonBlock className="h-4 w-3/4 mb-4" />
              <SkeletonBlock className="h-8 w-24" />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export function StatsSkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 my-16">
      {[1, 2, 3, 4].map(i => (
        <div key={i} className="text-center">
          <SkeletonBlock className="h-14 w-24 mx-auto mb-2" />
          <SkeletonBlock className="h-3 w-20 mx-auto" />
        </div>
      ))}
    </div>
  )
}

export function TestimonialsSkeleton() {
  return (
    <section className="section-ivory px-6 lg:px-12 py-24">
      <div className="max-w-7xl mx-auto">
        <SectionHeaderSkeleton />
        <div className="grid md:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="ruled-card p-6">
              <div className="flex gap-1 mb-4">
                {[1, 2, 3, 4, 5].map(j => (
                  <SkeletonBlock key={j} className="h-4 w-4" />
                ))}
              </div>
              <SkeletonBlock className="h-4 w-full mb-1" />
              <SkeletonBlock className="h-4 w-full mb-1" />
              <SkeletonBlock className="h-4 w-3/4 mb-4" />
              <div className="flex items-center gap-3 mt-4">
                <SkeletonBlock className="h-10 w-10 rounded-full" />
                <div>
                  <SkeletonBlock className="h-4 w-24 mb-1" />
                  <SkeletonBlock className="h-3 w-32" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export function ExperienceSkeleton() {
  return (
    <section className="section-obsidian px-6 lg:px-12 py-24">
      <div className="max-w-7xl mx-auto">
        <SectionHeaderSkeleton />
        <div className="space-y-8">
          {[1, 2, 3].map(i => (
            <div key={i} className="ruled-card-dark p-6">
              <SkeletonBlock className="h-4 w-16 mb-3" />
              <SkeletonBlock className="h-5 w-48 mb-1" />
              <SkeletonBlock className="h-4 w-32 mb-3" />
              <SkeletonBlock className="h-4 w-full mb-1" />
              <SkeletonBlock className="h-4 w-3/4" />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
