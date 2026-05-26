import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, ArrowUpRight, CheckCircle2, Globe } from 'lucide-react'
import { useLanguage } from '@/hooks/useLanguage'
import { useProjects } from '@/hooks/usePortfolio'
import { PROJECT_IMAGES } from '@/assets/project-images'
import ProjectGallery from '@/components/ProjectGallery'
import { TechBadge, RevealWrapper } from '@/components/Sections'
import { translations } from '@/lib/data-static'

const LIVE_URLS: Record<string, string> = {
  'heic-converter': 'https://heiconverts.vercel.app',
  'nextvendors-ecommerce': 'https://next-vendors.vercel.app',
  'kayany7': 'https://kayany7.vercel.app',
}

export default function ProjectDetail() {
  const { id } = useParams<{ id: string }>()
  const { language } = useLanguage()
  const projects = useProjects()
  const t = translations[language]
  const project = projects.data?.find(p => p.id === id)

  if (!project) {
    return (
      <div className="section-ivory min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">
            {language === 'ar' ? 'المشروع غير موجود' : 'Project Not Found'}
          </h1>
          <Link to="/" className="btn-emerald inline-flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            {language === 'ar' ? 'العودة للرئيسية' : 'Back to Home'}
          </Link>
        </div>
      </div>
    )
  }

  const images = PROJECT_IMAGES[project.id]

  return (
    <div>
      {/* Hero section */}
      <section className="section-obsidian py-28 relative overflow-hidden">
        <span className="section-num text-ivory">{project.number}</span>

        <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
          <RevealWrapper>
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-sm text-ivory/50 hover:text-emerald-brand transition-colors mb-10 font-mono"
            >
              <ArrowLeft className="w-4 h-4" />
              {language === 'ar' ? 'العودة للمشاريع' : 'Back to Projects'}
            </Link>
          </RevealWrapper>

          <div className="grid lg:grid-cols-[1fr_1fr] gap-16 items-start">
            <RevealWrapper direction="left">
              <div className="flex items-baseline gap-4 mb-6">
                <span className="font-mono text-7xl font-bold text-emerald-brand opacity-[0.18] leading-none select-none">
                  {project.number}
                </span>
                <div>
                  <span className="text-[11px] font-mono text-emerald-brand uppercase tracking-widest block mb-1">
                    {project.category}
                  </span>
                  <h1 className="text-3xl lg:text-4xl font-bold text-ivory">{project.title}</h1>
                </div>
              </div>

              <span className={`inline-block px-3 py-1 rounded-sm text-xs font-mono font-semibold mb-8 ${
                project.complexity === 'Critical' ? 'bg-red-500/14 text-red-400'
                : project.complexity === 'Advanced' ? 'bg-emerald-brand/14 text-emerald-bright'
                : 'bg-ivory/10 text-ivory/55'
              }`}>
                {project.complexity}
              </span>

              <div className="space-y-8 mt-8">
                <div>
                  <h3 className="text-[11px] font-mono font-semibold text-emerald-brand uppercase tracking-widest mb-3">
                    {t.projects.problem}
                  </h3>
                  <p className="text-ivory/60 text-sm leading-relaxed">{project.problem}</p>
                </div>
                <div>
                  <h3 className="text-[11px] font-mono font-semibold text-emerald-brand uppercase tracking-widest mb-3">
                    {t.projects.solution}
                  </h3>
                  <p className="text-ivory/60 text-sm leading-relaxed">{project.solution}</p>
                </div>
              </div>
            </RevealWrapper>

            <RevealWrapper direction="right" delay={0.15}>
              {images && <ProjectGallery images={images} title={project.title} />}
            </RevealWrapper>
          </div>
        </div>
      </section>

      {/* Technologies & Highlights */}
      <section className="section-ivory py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-16">
            <RevealWrapper>
              <h3 className="text-[11px] font-mono font-semibold text-emerald-brand uppercase tracking-widest mb-5">
                {t.projects.technologies}
              </h3>
              <div className="flex flex-wrap gap-2">
                {project.technologies.map(tech => <TechBadge key={tech} name={tech} />)}
              </div>
            </RevealWrapper>

            <RevealWrapper delay={0.1}>
              <div className="ruled-card p-8">
                <h3 className="text-[11px] font-mono font-semibold text-emerald-brand uppercase tracking-widest mb-5">
                  {t.projects.highlights}
                </h3>
                <ul className="space-y-4">
                  {project.highlights.map((h, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <CheckCircle2 className="w-4 h-4 text-emerald-brand mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-muted-foreground leading-relaxed">{h}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </RevealWrapper>
          </div>

          <RevealWrapper delay={0.2}>
            <div className="mt-16 flex flex-wrap gap-4">
              <Link to="/" className="btn-outline-dark inline-flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" />
                {language === 'ar' ? 'جميع المشاريع' : 'All Projects'}
              </Link>
              {LIVE_URLS[project.id] && (
                <a
                  href={LIVE_URLS[project.id]}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-emerald inline-flex items-center gap-2"
                >
                  <Globe className="w-4 h-4" />
                  {language === 'ar' ? 'عرض الموقع' : 'Live Site'}
                  <ArrowUpRight className="w-4 h-4" />
                </a>
              )}
            </div>
          </RevealWrapper>
        </div>
      </section>
    </div>
  )
}
