import { Download, MapPin, Mail, Calendar, CheckCircle2, ArrowRight } from 'lucide-react'
import { SiGithub, SiLinkedin } from 'react-icons/si'
import { useLanguage } from '@/hooks/useLanguage'
import { usePortfolio } from '@/hooks/usePortfolio'
import { RevealWrapper } from '@/components/Sections'
import { CONTACT_INFO } from '@/lib/data-static'

export default function CV() {
  const { language } = useLanguage()
  const { experience, skills, stats } = usePortfolio()

  return (
    <div className="min-h-screen bg-obsidian">
      {/* Header */}
      <section className="section-obsidian py-20 border-b border-ivory/10">
        <div className="max-w-4xl mx-auto px-6 lg:px-12">
          <RevealWrapper>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <h1 className="text-4xl font-bold text-ivory mb-2">Monther Alhamadi</h1>
                <p className="text-emerald-brand font-mono text-sm mb-4">
                  {language === 'ar' ? 'مهندس برمجيات | تطوير شامل وأنظمة ذكية' : 'Software Engineer | Full-Stack & Intelligent Systems'}
                </p>
                <div className="flex flex-wrap gap-4 text-xs text-ivory/50 font-mono">
                  <span className="flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5" /> {CONTACT_INFO.email}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5" /> {CONTACT_INFO.location}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    {language === 'ar' ? '4+ سنوات خبرة' : '4+ Years Experience'}
                  </span>
                </div>
              </div>
              <div className="flex gap-3">
                <a href={CONTACT_INFO.github} target="_blank" rel="noopener noreferrer"
                   className="p-3 border border-ivory/15 rounded-sm hover:border-emerald-brand hover:text-emerald-brand transition-colors text-ivory/50">
                  <SiGithub className="w-5 h-5" />
                </a>
                <a href={CONTACT_INFO.linkedin} target="_blank" rel="noopener noreferrer"
                   className="p-3 border border-ivory/15 rounded-sm hover:border-emerald-brand hover:text-emerald-brand transition-colors text-ivory/50">
                  <SiLinkedin className="w-5 h-5" />
                </a>
                <a href="/cv.pdf" download
                   className="btn-emerald inline-flex items-center gap-2 text-sm">
                  <Download className="w-4 h-4" />
                  {language === 'ar' ? 'تحميل PDF' : 'Download PDF'}
                </a>
              </div>
            </div>
          </RevealWrapper>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-6 lg:px-12 py-16">
        {/* Stats */}
        <RevealWrapper>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
            {stats.map(stat => (
              <div key={stat.id} className="border border-ivory/10 rounded-sm p-5 text-center">
                <div className="text-3xl font-bold text-emerald-brand font-heading">
                  {stat.value}{stat.suffix}
                </div>
                <div className="text-xs text-ivory/45 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </RevealWrapper>

        {/* Experience */}
        <RevealWrapper>
          <h2 className="text-xs font-mono font-semibold text-emerald-brand uppercase tracking-widest mb-8">
            {language === 'ar' ? 'الخبرة المهنية' : 'Professional Experience'}
          </h2>
          <div className="space-y-6 mb-16">
            {experience.map(exp => (
              <div key={exp.id} className="ruled-card-dark p-6 md:p-8">
                <div className="flex flex-col md:flex-row md:items-start gap-4 md:gap-8">
                  <div className="flex-shrink-0 md:w-28">
                    <span className="font-mono text-sm font-semibold text-emerald-brand">{exp.year}</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-wrap items-baseline gap-2 mb-2">
                      <h3 className="text-lg font-bold text-ivory">{exp.title}</h3>
                      <span className="text-sm text-ivory/38 font-mono">@ {exp.company}</span>
                    </div>
                    <p className="text-sm text-ivory/52 leading-relaxed mb-4">{exp.description}</p>
                    <div className="grid sm:grid-cols-2 gap-2">
                      {exp.achievements.map((a, idx) => (
                        <div key={idx} className="flex items-start gap-2">
                          <ArrowRight className="w-3.5 h-3.5 text-emerald-brand mt-0.5 flex-shrink-0" />
                          <p className="text-xs text-ivory/48">{a}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </RevealWrapper>

        {/* Skills */}
        <RevealWrapper delay={0.1}>
          <h2 className="text-xs font-mono font-semibold text-emerald-brand uppercase tracking-widest mb-8">
            {language === 'ar' ? 'المهارات التقنية' : 'Technical Skills'}
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {skills.map(skill => (
              <div key={skill.category} className="ruled-card-dark p-6">
                <h3 className="text-sm font-bold text-ivory mb-3">{skill.category}</h3>
                <div className="space-y-2">
                  {skill.technologies.map(tech => (
                    <div key={tech} className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-brand flex-shrink-0" />
                      <span className="text-xs text-ivory/55">{tech}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </RevealWrapper>
      </div>
    </div>
  )
}
