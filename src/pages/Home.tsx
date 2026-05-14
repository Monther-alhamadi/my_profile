import { useState, useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import {
  Code2, Cpu, Brain, Smartphone, Layers, Sparkles, Network,
  Mail, MapPin, Clock, Star, ArrowUpRight, ArrowRight,
  Send, Download, CheckCircle2, ChevronDown
} from 'lucide-react'
import { SiGithub, SiLinkedin } from 'react-icons/si'
import { useLanguage } from '@/hooks/useLanguage'
import { TypewriterText } from '@/components/AnimatedText'
import {
  SectionHeader, RevealWrapper, RuledCard, StatCard,
  TechBadge, TiltCard, Marquee
} from '@/components/Sections'
import {
  PROJECTS_EN, PROJECTS_AR,
  SKILLS_EN, SKILLS_AR,
  SERVICES_EN, SERVICES_AR,
  EXPERIENCE_EN, EXPERIENCE_AR,
  STATS_EN, STATS_AR,
  TESTIMONIALS_EN, TESTIMONIALS_AR,
  translations, CONTACT_INFO
} from '@/lib/index'
import { IMAGES } from '@/assets/images'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue
} from '@/components/ui/select'

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  cpu: Cpu, code: Code2, brain: Brain,
  smartphone: Smartphone, layers: Layers,
  sparkles: Sparkles, network: Network,
}

const TECH_MARQUEE = [
  'React', 'TypeScript', 'Node.js', 'Python', 'PostgreSQL',
  'FastAPI', 'Flutter', 'Docker', 'AI/ML', 'Next.js',
  'TensorFlow', 'GraphQL', 'Redis', 'React.js', 'Supabase',
]

const scrollTo = (id: string) => document.querySelector(id)?.scrollIntoView({ behavior: 'smooth' })

export default function Home() {
  const { language } = useLanguage()

  // Select data based on language
  const projects = language === 'ar' ? PROJECTS_AR : PROJECTS_EN;
  const skills = language === 'ar' ? SKILLS_AR : SKILLS_EN;
  const services = language === 'ar' ? SERVICES_AR : SERVICES_EN;
  const experience = language === 'ar' ? EXPERIENCE_AR : EXPERIENCE_EN;
  const stats = language === 'ar' ? STATS_AR : STATS_EN;
  const testimonials = language === 'ar' ? TESTIMONIALS_AR : TESTIMONIALS_EN;
  const t = translations[language]
  const [form, setForm] = useState({ name: '', email: '', projectType: 'none', message: '' })
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const heroRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 100])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.75], [1, 0])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          access_key: import.meta.env.VITE_WEB3FORMS_ACCESS_KEY,
          ...form,
          from_name: form.name,
          subject: `New Message from ${form.name} (${form.projectType})`,
        }),
      })

      const result = await response.json()
      if (result.success) {
        setSubmitted(true)
        setForm({ name: '', email: '', projectType: 'none', message: '' })
      } else {
        console.error('Submission failed:', result)
        alert(language === 'ar' ? 'فشل الإرسال. يرجى المحاولة مرة أخرى.' : 'Submission failed. Please try again.')
      }
    } catch (error) {
      console.error('Error submitting form:', error)
      alert(language === 'ar' ? 'حدث خطأ. يرجى المحاولة لاحقاً.' : 'An error occurred. Please try again later.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div>

      {/* ══════════════════════════════════════════════
          HERO — Ivory
      ══════════════════════════════════════════════= */}
      <section ref={heroRef} id="hero" className="section-ivory min-h-screen flex flex-col justify-center relative overflow-hidden">

        {/* Parallax BG */}
        <motion.div className="absolute inset-0 z-0" style={{ y: heroY, opacity: heroOpacity }}>
          <img src={IMAGES.HERO_BG_3} alt="" className="w-full h-full object-cover opacity-[0.05]" />
        </motion.div>

        {/* Subtle emerald orbs */}
        <div className="absolute top-1/4 right-[8%]  w-[550px] h-[550px] rounded-full bg-emerald-brand opacity-[0.04] blur-[100px] pointer-events-none" />
        <div className="absolute bottom-1/4 left-[4%] w-[380px] h-[380px] rounded-full bg-emerald-brand opacity-[0.03] blur-[80px]  pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10 w-full py-24">
          <div className="grid lg:grid-cols-[1fr_400px] gap-16 items-center">

            {/* Left */}
            <div>
              {/* Badge */}
              <motion.div initial={{ opacity:0, y:14 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.5 }} className="mb-8">
                <span className="available-badge">
                  <span className="available-dot" />
                  {language === 'ar' ? 'متاح للعمل' : 'Available for new projects'}
                </span>
              </motion.div>

              {/* Greeting */}
              <motion.p
                initial={{ opacity:0, y:14 }}
                animate={{ opacity:1, y:0 }}
                transition={{ duration:0.5, delay:0.05 }}
                className="text-emerald-brand font-mono font-medium mb-4"
              >
                {t.hero.greeting}
              </motion.p>

              {/* Headline */}
              <motion.h1
                initial={{ opacity:0, y:30 }}
                animate={{ opacity:1, y:0 }}
                transition={{ duration:0.7, delay:0.1, ease:[0.25,0.46,0.45,0.94] }}
                className="text-[clamp(2.6rem,6.5vw,5.5rem)] font-bold leading-[1.04] tracking-tight text-obsidian mb-6"
              >
                {t.hero.title}
              </motion.h1>

              {/* Typewriter */}
              <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.4 }} className="h-9 mb-8">
                <TypewriterText text={t.hero.specializations[0]} className="text-lg text-muted-foreground font-mono" speed={45} />
              </motion.div>

              {/* Description */}
              <motion.p
                initial={{ opacity:0, y:16 }}
                animate={{ opacity:1, y:0 }}
                transition={{ delay:0.5, duration:0.6 }}
                className="text-base text-muted-foreground max-w-lg leading-relaxed mb-10"
              >
                {language === 'ar'
                  ? 'أبني أنظمة برمجية متقدمة — من تطبيقات الويب إلى أدوات الذكاء الاصطناعي. أحوّل المشاكل المعقدة إلى حلول تقنية أنيقة وقابلة للتوسع.'
                  : 'I build advanced software systems — from full-stack web apps to AI-powered tools. I turn complex problems into elegant, scalable solutions.'}
              </motion.p>

              {/* CTAs */}
              <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.6 }} className="flex flex-wrap gap-4 mb-12">
                <button className="btn-emerald" onClick={() => scrollTo('#contact')}>
                  {t.hero.cta1} <ArrowUpRight className="w-4 h-4" />
                </button>
                <button className="btn-outline-dark" onClick={() => scrollTo('#projects')}>
                  {t.hero.cta2} <ArrowRight className="w-4 h-4" />
                </button>
                <a href="/cv.pdf" download className="hidden md:inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors border-b border-dashed border-border hover:border-emerald-brand pb-0.5">
                  <Download className="w-3.5 h-3.5" />
                  {language === 'ar' ? 'تحميل السيرة الذاتية' : 'Download CV'}
                </a>
              </motion.div>

              {/* Quick stats */}
              <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.8 }} className="flex items-center gap-8 flex-wrap">
                {stats.slice(0, 3).map(stat => (
                  <div key={stat.id}>
                    <div className="text-2xl font-bold font-heading text-obsidian">{stat.value}{stat.suffix}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">{stat.label}</div>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Right — tilt card */}
            <motion.div
              initial={{ opacity:0, x:36 }}
              animate={{ opacity:1, x:0 }}
              transition={{ duration:0.75, delay:0.3, ease:[0.25,0.46,0.45,0.94] }}
            >
              <TiltCard className="!p-0">
                <div className="relative aspect-[4/5] overflow-hidden">
                  <img src={IMAGES.ABOUT_BG_8} alt="Developer at work" className="w-full h-full object-cover" />
                  {/* <div className="absolute top-0 left-0 w-[3px] h-20 bg-emerald-brand" /> */}
                  <div className="absolute bottom-4 left-4 right-4 bg-obsidian/88 backdrop-blur-sm rounded-sm p-4">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="available-dot" />
                      <span className="text-xs text-emerald-brand font-mono font-medium">
                        {language === 'ar' ? 'متاح للعمل' : 'Open to work'}
                      </span>
                    </div>
                    <p className="text-xs text-ivory/55">{language === 'ar' ? 'مهندس برمجيات · عمل حر' : 'Software Engineer · Freelance'}</p>
                  </div>
                </div>
              </TiltCard>
            </motion.div>
          </div>
        </div>

        {/* Scroll hint */}
        <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:1.1 }} className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5">
          <span className="text-[10px] font-mono text-muted-foreground tracking-widest uppercase">
            {language === 'ar' ? 'مرر للأسفل' : 'Scroll'}
          </span>
          <motion.div animate={{ y:[0,6,0] }} transition={{ duration:1.5, repeat:Infinity }}>
            <ChevronDown className="w-4 h-4 text-emerald-brand" />
          </motion.div>
        </motion.div>
      </section>

      {/* ── Marquee strip ── */}
      <div className="bg-obsidian">
        <Marquee items={TECH_MARQUEE} dark />
      </div>

      {/* ══════════════════════════════════════════════
          ABOUT — Obsidian
      ══════════════════════════════════════════════ */}
      <section id="about" className="section-obsidian py-28 relative overflow-hidden">
        <span className="section-num text-ivory">01</span>
        <div className="absolute inset-0 z-0 opacity-[0.02]">
          <img src={IMAGES.DARK_BG_1} alt="" className="w-full h-full object-cover" />
        </div>

        <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
          <RevealWrapper>
            <SectionHeader number="01" title={t.about.title} subtitle={t.about.subtitle} light />
          </RevealWrapper>

          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <RevealWrapper delay={0.15} direction="left">
              <h3 className="text-2xl lg:text-3xl font-bold text-ivory leading-snug mb-7">{t.about.statement}</h3>
              <p className="text-ivory/52 text-base leading-relaxed mb-8">{t.about.bio}</p>
              <div className="space-y-3">
                {t.about.highlights.map((h: string, i: number) => (
                  <div key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="w-4 h-4 text-emerald-brand mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-ivory/58 leading-relaxed">{h}</p>
                  </div>
                ))}
              </div>
            </RevealWrapper>

            <RevealWrapper delay={0.3} direction="right">
              <div className="grid grid-cols-2 gap-5 mb-8">
                {stats.map(stat => (
                  <div key={stat.id} className="border border-ivory/10 rounded-sm p-6">
                    <StatCard value={parseInt(stat.value)} label={stat.label} suffix={stat.suffix} dark />
                  </div>
                ))}
              </div>
              <div className="relative overflow-hidden rounded-sm aspect-[16/7]">
                <img src={IMAGES.ABOUT_BG_1} alt="" className="w-full h-full object-cover opacity-45" />
                <div className="absolute inset-0 bg-gradient-to-r from-obsidian/80 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4">
                  <span className="font-mono text-xs text-emerald-brand">$ npm run build:production</span>
                </div>
              </div>
            </RevealWrapper>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          EXPERTISE — Ivory
      ══════════════════════════════════════════════ */}
      <section id="expertise" className="section-ivory py-28 relative overflow-hidden">
        <span className="section-num text-foreground">02</span>

        <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
          <RevealWrapper>
            <SectionHeader number="02" title={t.expertise.title} subtitle={t.expertise.subtitle} />
          </RevealWrapper>

          <div className="grid md:grid-cols-2 gap-6">
            {skills.map((skill, i) => {
              const Icon = iconMap[skill.icon]
              return (
                <RevealWrapper key={skill.category} delay={0.08 * i}>
                  <RuledCard className="h-full p-8">
                    <div className="flex items-start gap-4 mb-5">
                      <div className="w-11 h-11 bg-primary/8 border border-primary/15 rounded-sm flex items-center justify-center flex-shrink-0">
                        {Icon && <Icon className="w-5 h-5 text-emerald-brand" />}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-foreground">{skill.category}</h3>
                        <p className="text-sm text-muted-foreground mt-0.5">{skill.description}</p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {skill.technologies.map(tech => <TechBadge key={tech} name={tech} />)}
                    </div>
                  </RuledCard>
                </RevealWrapper>
              )
            })}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          PROJECTS — Obsidian
      ══════════════════════════════════════════════ */}
      <section id="projects" className="section-obsidian py-28 relative overflow-hidden">
        <span className="section-num text-ivory">03</span>
        <div className="absolute inset-0 opacity-[0.018]">
          <img src={IMAGES.DARK_BG_7} alt="" className="w-full h-full object-cover" />
        </div>

        <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
          <RevealWrapper>
            <SectionHeader number="03" title={t.projects.title} subtitle={t.projects.subtitle} light />
          </RevealWrapper>

          <div className="space-y-24">
            {projects.map((project, i) => (
              <RevealWrapper key={project.id} delay={0.05}>
                <div className={`grid lg:grid-cols-2 gap-12 items-start`}>

                  {/* Info */}
                  <div className={i % 2 === 1 ? 'lg:order-2' : ''}>
                    <div className="flex items-baseline gap-4 mb-6">
                      <span className="font-mono text-7xl font-bold text-emerald-brand opacity-[0.18] leading-none select-none">
                        {project.number}
                      </span>
                      <div>
                        <span className="text-[11px] font-mono text-emerald-brand uppercase tracking-widest block mb-1">{project.category}</span>
                        <h3 className="text-2xl lg:text-3xl font-bold text-ivory">{project.title}</h3>
                      </div>
                    </div>

                    <div className="hr-emerald mb-6 w-14" />

                    <div className="grid sm:grid-cols-2 gap-5 mb-6">
                      <div>
                        <h4 className="text-[11px] font-mono font-semibold text-emerald-brand uppercase tracking-widest mb-2">{t.projects.problem}</h4>
                        <p className="text-sm text-ivory/52 leading-relaxed">{project.problem}</p>
                      </div>
                      <div>
                        <h4 className="text-[11px] font-mono font-semibold text-emerald-brand uppercase tracking-widest mb-2">{t.projects.solution}</h4>
                        <p className="text-sm text-ivory/52 leading-relaxed">{project.solution}</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-5">
                      {project.technologies.slice(0, 5).map(tech => <TechBadge key={tech} name={tech} dark />)}
                    </div>

                    <span className={`px-3 py-1 rounded-sm text-xs font-mono font-semibold ${
                      project.complexity === 'Critical' ? 'bg-red-500/14 text-red-400'
                      : project.complexity === 'Advanced' ? 'bg-emerald-brand/14 text-emerald-bright'
                      : 'bg-ivory/10 text-ivory/55'
                    }`}>
                      {project.complexity}
                    </span>
                  </div>

                  {/* Highlights */}
                  <div className={i % 2 === 1 ? 'lg:order-1' : ''}>
                    <div className="ruled-card-dark p-8">
                      <h4 className="text-[11px] font-mono font-semibold text-ivory/35 uppercase tracking-widest mb-5">{t.projects.highlights}</h4>
                      <ul className="space-y-4">
                        {project.highlights.map((h, idx) => (
                          <li key={idx} className="flex items-start gap-3">
                            <ArrowRight className="w-4 h-4 text-emerald-brand mt-0.5 flex-shrink-0" />
                            <span className="text-sm text-ivory/57 leading-relaxed">{h}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {i < projects.length - 1 && (
                  <div className="hr-emerald mt-24 opacity-[0.18]" />
                )}
              </RevealWrapper>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          SERVICES — Ivory
      ══════════════════════════════════════════════ */}
      <section id="services" className="section-ivory py-28 relative overflow-hidden">
        <span className="section-num text-foreground">04</span>

        <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
          <RevealWrapper>
            <SectionHeader number="04" title={t.services.title} subtitle={t.services.subtitle} />
          </RevealWrapper>

          <div className="grid md:grid-cols-3 gap-6">
            {services.map((service, i) => {
              const Icon = iconMap[service.icon]
              return (
                <RevealWrapper key={service.id} delay={0.1 * i}>
                  <RuledCard className="h-full p-8 flex flex-col">
                    <div className="mb-6">
                      {Icon && (
                        <div className="w-11 h-11 bg-primary/8 border border-primary/14 rounded-sm flex items-center justify-center mb-5">
                          <Icon className="w-5 h-5 text-emerald-brand" />
                        </div>
                      )}
                      <h3 className="text-xl font-bold text-foreground mb-2">{service.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">{service.description}</p>
                    </div>
                    <div className="mt-auto">
                      <p className="text-3xl font-bold font-heading text-emerald-brand mb-5">{service.pricing}</p>
                      <div className="space-y-2.5">
                        {service.features.map((f, idx) => (
                          <div key={idx} className="flex items-start gap-2.5">
                            <CheckCircle2 className="w-4 h-4 text-emerald-brand mt-0.5 flex-shrink-0" />
                            <p className="text-sm text-muted-foreground">{f}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </RuledCard>
                </RevealWrapper>
              )
            })}
          </div>

          {/* CTA banner */}
          <RevealWrapper delay={0.25}>
            <div className="mt-12 bg-obsidian rounded-sm p-10 flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <h3 className="text-2xl font-bold text-ivory mb-2">
                  {language === 'ar' ? 'هل لديك مشروع في ذهنك؟' : 'Have a project in mind?'}
                </h3>
                <p className="text-ivory/45 text-sm">
                  {language === 'ar'
                    ? 'لنتحدث عن كيف يمكنني مساعدتك.'
                    : "Let's talk about how I can help you achieve your goals."}
                </p>
              </div>
              <button className="btn-emerald whitespace-nowrap" onClick={() => scrollTo('#contact')}>
                {t.hero.cta1} <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>
          </RevealWrapper>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          EXPERIENCE — Obsidian
      ══════════════════════════════════════════════ */}
      <section id="experience" className="section-obsidian py-28 relative overflow-hidden">
        <span className="section-num text-ivory">05</span>

        <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
          <RevealWrapper>
            <SectionHeader number="05" title={t.experience.title} subtitle={t.experience.subtitle} light />
          </RevealWrapper>

          <div className="space-y-5">
            {experience.map((exp, i) => (
              <RevealWrapper key={exp.id} delay={0.08 * i}>
                <div className="ruled-card-dark p-8">
                  <div className="flex flex-col md:flex-row md:items-start gap-6">
                    <div className="flex-shrink-0 md:w-28">
                      <span className="font-mono text-sm font-semibold text-emerald-brand">{exp.year}</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-wrap items-baseline gap-3 mb-3">
                        <h3 className="text-xl font-bold text-ivory">{exp.title}</h3>
                        <span className="text-sm text-ivory/38 font-mono">@ {exp.company}</span>
                      </div>
                      <p className="text-sm text-ivory/52 leading-relaxed mb-5">{exp.description}</p>
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
              </RevealWrapper>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          TESTIMONIALS — Ivory
      ══════════════════════════════════════════════ */}
      <section id="testimonials" className="section-ivory py-28 relative overflow-hidden">
        <span className="section-num text-foreground">06</span>

        <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
          <RevealWrapper>
            <SectionHeader number="06" title={t.testimonials.title} subtitle={t.testimonials.subtitle} />
          </RevealWrapper>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t2, i) => (
              <RevealWrapper key={t2.id} delay={0.1 * i}>
                <RuledCard className="h-full p-8 flex flex-col">
                  <div className="flex gap-1 mb-5">
                    {Array.from({ length: t2.rating }).map((_, idx) => (
                      <Star key={idx} className="w-4 h-4 fill-emerald-brand text-emerald-brand" />
                    ))}
                  </div>
                  <p className="text-muted-foreground text-sm leading-relaxed italic flex-1 mb-6">"{t2.content}"</p>
                  <div className="flex items-center gap-3 pt-5 border-t border-border">
                    <div className="w-10 h-10 rounded-sm bg-primary/10 flex items-center justify-center">
                      <span className="font-bold text-sm text-emerald-brand">{t2.name.charAt(0)}</span>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">{t2.name}</p>
                      <p className="text-xs text-muted-foreground">{t2.role}, {t2.company}</p>
                    </div>
                  </div>
                </RuledCard>
              </RevealWrapper>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          CONTACT — Split layout
      ══════════════════════════════════════════════ */}
      <section id="contact" className="relative overflow-hidden">
        <div className="grid lg:grid-cols-2 min-h-[80vh]">

          {/* Left — Obsidian info */}
          <div className="section-obsidian py-24 px-8 lg:px-16 relative overflow-hidden">
            <span className="section-num text-ivory">07</span>
            <div className="relative z-10">
              <RevealWrapper direction="left">
                <SectionHeader number="07" title={t.contact.title} subtitle={t.contact.subtitle} light className="mb-12" />
              </RevealWrapper>

              <RevealWrapper delay={0.15} direction="left">
                <div className="space-y-6 mb-10">
                  {[
                    { icon: Mail, label: t.contact.email, value: CONTACT_INFO.email, href: `mailto:${CONTACT_INFO.email}` },
                    { icon: MapPin, label: t.contact.location, value: CONTACT_INFO.location, href: undefined },
                    { icon: Clock, label: t.contact.availability, value: t.contact.availableText, href: undefined, accent: true },
                  ].map(({ icon: Icon, label, value, href, accent }) => {
                    const inner = (
                      <div className="flex items-center gap-4 group">
                        <div className="w-12 h-12 border border-ivory/14 rounded-sm flex items-center justify-center group-hover:border-emerald-brand transition-colors flex-shrink-0">
                          <Icon className="w-5 h-5 text-ivory/45 group-hover:text-emerald-brand transition-colors" />
                        </div>
                        <div>
                          <p className="text-[11px] font-mono text-ivory/32 mb-0.5 uppercase tracking-wider">{label}</p>
                          <p className={`text-sm font-medium ${accent ? 'text-emerald-brand' : 'text-ivory'}`}>{value}</p>
                        </div>
                      </div>
                    )
                    return href ? <a key={label} href={href}>{inner}</a> : <div key={label}>{inner}</div>
                  })}
                </div>
              </RevealWrapper>

              <RevealWrapper delay={0.28} direction="left">
                <div className="flex gap-3">
                  <a href={CONTACT_INFO.github} target="_blank" rel="noopener noreferrer"
                     className="p-3 border border-ivory/14 rounded-sm hover:border-emerald-brand hover:text-emerald-brand transition-colors text-ivory/45">
                    <SiGithub className="w-5 h-5" />
                  </a>
                  <a href={CONTACT_INFO.linkedin} target="_blank" rel="noopener noreferrer"
                     className="p-3 border border-ivory/14 rounded-sm hover:border-emerald-brand hover:text-emerald-brand transition-colors text-ivory/45">
                    <SiLinkedin className="w-5 h-5" />
                  </a>
                </div>
              </RevealWrapper>
            </div>
          </div>

          {/* Right — Form */}
          <div className="section-ivory py-24 px-8 lg:px-16">
            <RevealWrapper delay={0.18} direction="right">
              {submitted ? (
                <div className="flex flex-col items-center justify-center h-full gap-6 text-center py-20">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                    <CheckCircle2 className="w-8 h-8 text-emerald-brand" />
                  </div>
                  <h3 className="text-2xl font-bold">{language === 'ar' ? 'تم إرسال رسالتك!' : 'Message Sent!'}</h3>
                  <p className="text-muted-foreground text-sm max-w-xs">
                    {language === 'ar'
                      ? 'شكراً لتواصلك. سأرد عليك قريباً.'
                      : "Thank you for reaching out. I'll get back to you as soon as possible."}
                  </p>
                  <button onClick={() => setSubmitted(false)} className="btn-outline-dark text-sm py-2.5 px-6">
                    {language === 'ar' ? 'إرسال رسالة أخرى' : 'Send Another'}
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {[
                    { label: t.contact.form.name, type: 'text', key: 'name' as const, placeholder: t.contact.form.name },
                    { label: t.contact.form.email, type: 'email', key: 'email' as const, placeholder: t.contact.form.email },
                  ].map(({ label, type, key, placeholder }) => (
                    <div key={key}>
                      <label className="block text-xs font-mono font-semibold text-muted-foreground uppercase tracking-widest mb-2">{label}</label>
                      <Input
                        type={type}
                        placeholder={placeholder}
                        value={form[key]}
                        onChange={e => setForm({ ...form, [key]: e.target.value })}
                        required
                        className="border-border focus:border-emerald-brand rounded-sm h-12 bg-obsidian text-ivory placeholder:text-ivory/30"
                      />
                    </div>
                  ))}

                  <div>
                    <label className="block text-xs font-mono font-semibold text-muted-foreground uppercase tracking-widest mb-2">{t.contact.form.projectType}</label>
                    <Select value={form.projectType} onValueChange={v => setForm({ ...form, projectType: v })}>
                      <SelectTrigger className="border-border rounded-sm h-12 bg-obsidian text-ivory">
                        <SelectValue placeholder={t.contact.form.projectType} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">{t.contact.form.projectType}</SelectItem>
                        <SelectItem value="web">{t.contact.form.projectTypes.web}</SelectItem>
                        <SelectItem value="mobile">{t.contact.form.projectTypes.mobile}</SelectItem>
                        <SelectItem value="ai">{t.contact.form.projectTypes.ai}</SelectItem>
                        <SelectItem value="consulting">{t.contact.form.projectTypes.consulting}</SelectItem>
                        <SelectItem value="other">{t.contact.form.projectTypes.other}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-xs font-mono font-semibold text-muted-foreground uppercase tracking-widest mb-2">{t.contact.form.message}</label>
                    <Textarea
                      placeholder={t.contact.form.message}
                      value={form.message}
                      onChange={e => setForm({ ...form, message: e.target.value })}
                      rows={5}
                      required
                      className="border-border focus:border-emerald-brand rounded-sm bg-obsidian resize-none text-ivory placeholder:text-ivory/30"
                    />
                  </div>

                  <button type="submit" disabled={submitting} className="btn-emerald w-full justify-center">
                    {submitting ? (
                      <span className="flex items-center gap-2">
                        <motion.span
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                          className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                        />
                        {t.contact.form.sending}
                      </span>
                    ) : (
                      <>{t.contact.form.submit} <Send className="w-4 h-4" /></>
                    )}
                  </button>
                </form>
              )}
            </RevealWrapper>
          </div>
        </div>
      </section>
    </div>
  )
}
