import { Mail, Download, ArrowUpRight } from 'lucide-react'
import { SiGithub, SiLinkedin } from 'react-icons/si'
import { FaFacebook } from 'react-icons/fa'
import { useLanguage } from '@/hooks/useLanguage'
import { CONTACT_INFO } from '@/lib/data-static'

export default function Links() {
  const { language } = useLanguage()

  const links = [
    {
      href: CONTACT_INFO.github,
      icon: SiGithub,
      label: 'GitHub',
      subtitle: '@Monther-alhamadi',
    },
    {
      href: CONTACT_INFO.linkedin,
      icon: SiLinkedin,
      label: 'LinkedIn',
      subtitle: 'Monther Alhamadi',
    },
    {
      href: CONTACT_INFO.Facebook,
      icon: FaFacebook,
      label: 'Facebook',
      subtitle: 'Monther Alhamadi',
    },
    {
      href: `mailto:${CONTACT_INFO.email}`,
      icon: Mail,
      label: language === 'ar' ? 'البريد الإلكتروني' : 'Email',
      subtitle: CONTACT_INFO.email,
    },
  ]

  return (
    <div className="min-h-screen section-ivory flex items-center justify-center py-20">
      <div className="max-w-md mx-auto px-6 w-full text-center">
        {/* Avatar / Logo */}
        <div className="w-20 h-20 bg-obsidian rounded-sm flex items-center justify-center mx-auto mb-5">
          <span className="text-ivory font-mono font-bold text-2xl">MA</span>
        </div>

        <h1 className="text-2xl font-bold text-obsidian mb-1">Monther Alhamadi</h1>
        <p className="text-sm text-muted-foreground mb-10 font-mono">
          {language === 'ar' ? 'مهندس برمجيات | تطوير شامل وأنظمة ذكية' : 'Software Engineer | Full-Stack & Intelligent Systems'}
        </p>

        {/* Links */}
        <div className="space-y-3 mb-8">
          {links.map(link => {
            const Icon = link.icon
            return (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-4 rounded-sm border border-border bg-white/50 hover:border-emerald-brand hover:bg-emerald-brand/5 transition-all group"
              >
                <Icon className="w-5 h-5 text-muted-foreground group-hover:text-emerald-brand transition-colors flex-shrink-0" />
                <div className="flex-1 text-left">
                  <p className="text-sm font-semibold text-foreground">{link.label}</p>
                  <p className="text-xs text-muted-foreground">{link.subtitle}</p>
                </div>
                <ArrowUpRight className="w-4 h-4 text-muted-foreground group-hover:text-emerald-brand transition-colors" />
              </a>
            )
          })}
        </div>

        {/* Download CV */}
        <a
          href="/cv.pdf"
          download
          className="btn-emerald w-full justify-center inline-flex items-center gap-2 mb-8"
        >
          <Download className="w-4 h-4" />
          {language === 'ar' ? 'تحميل السيرة الذاتية' : 'Download CV'}
        </a>

        <p className="text-xs text-muted-foreground font-mono">
          {CONTACT_INFO.location}
        </p>
      </div>
    </div>
  )
}
