import { motion, useInView, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useRef, useEffect, useState, useCallback } from "react";

const ease = [0.25, 0.46, 0.45, 0.94] as const;

/* ── Section Header ── */
interface SectionHeaderProps {
  number: string;
  title: string;
  subtitle?: string;
  light?: boolean;
  className?: string;
}

export function SectionHeader({ number, title, subtitle, light = false, className = "" }: SectionHeaderProps) {
  return (
    <div className={`mb-16 ${className}`}>
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.45, ease }}
        className="flex items-center gap-4 mb-5"
      >
        <span className="font-mono text-xs font-semibold tracking-widest text-emerald-brand uppercase">
          {number}
        </span>
        <div className={`h-px flex-1 ${light ? 'bg-ivory/12' : 'bg-border'}`} />
      </motion.div>

      <motion.h2
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.55, delay: 0.08, ease }}
        className={`text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.05] tracking-tight mb-4 ${
          light ? 'text-ivory' : 'text-foreground'
        }`}
      >
        {title}
      </motion.h2>

      {subtitle && (
        <motion.p
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.16, ease }}
          className={`text-lg max-w-2xl leading-relaxed ${light ? 'text-ivory/52' : 'text-muted-foreground'}`}
        >
          {subtitle}
        </motion.p>
      )}
    </div>
  );
}

/* ── Reveal Wrapper (with stagger support) ── */
interface RevealWrapperProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  direction?: 'up' | 'left' | 'right' | 'down' | 'none';
  stagger?: boolean;
  staggerDelay?: number;
}

export function RevealWrapper({
  children, delay = 0, className = "",
  direction = 'up', stagger = false, staggerDelay = 0.06
}: RevealWrapperProps) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const init = direction === 'up' ? { opacity: 0, y: 36 }
             : direction === 'down' ? { opacity: 0, y: -36 }
             : direction === 'left' ? { opacity: 0, x: -36 }
             : direction === 'right' ? { opacity: 0, x: 36 }
             : { opacity: 0 };
  const anim = direction === 'none' ? { opacity: 1 }
             : direction === 'down' ? { opacity: 1, y: 0 }
             : { opacity: 1, y: 0, x: 0 };
  return (
    <motion.div
      ref={ref}
      initial={init}
      animate={inView ? anim : init}
      transition={stagger ? {
        duration: 0.6, ease,
        staggerChildren: staggerDelay,
        delayChildren: delay,
      } : { duration: 0.6, delay, ease }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ── Ruled Card ── */
interface RuledCardProps {
  children: React.ReactNode;
  className?: string;
  dark?: boolean;
}

export function RuledCard({ children, className = "", dark = false }: RuledCardProps) {
  return (
    <motion.div
      whileHover={{ y: -6, boxShadow: dark
        ? '0 12px 40px rgba(0,0,0,0.3)'
        : '0 12px 40px rgba(0,0,0,0.06)'
      }}
      transition={{ type: 'spring', stiffness: 200, damping: 18 }}
      className={`${dark ? 'ruled-card-dark' : 'ruled-card'} p-6 ${className}`}
    >
      {children}
    </motion.div>
  );
}

/* ── Stat Counter ── */
interface StatCardProps {
  value: number;
  label: string;
  suffix?: string;
  dark?: boolean;
}

export function StatCard({ value, label, suffix = "", dark = false }: StatCardProps) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    let start: number | null = null;
    const dur = 2000;
    const step = (t: number) => {
      if (!start) start = t;
      const p = Math.min((t - start) / dur, 1);
      setCount(Math.floor((1 - Math.pow(1 - p, 3)) * value));
      if (p < 1) requestAnimationFrame(step);
      else setCount(value);
    };
    requestAnimationFrame(step);
  }, [inView, value]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.92 }}
      animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.92 }}
      transition={{ duration: 0.5, ease }}
      className="text-center"
    >
      <div className={`text-5xl md:text-6xl font-bold font-heading mb-2 ${dark ? 'text-ivory' : 'text-foreground'}`}>
        {count}
        <span className="text-emerald-brand">{suffix}</span>
      </div>
      <div className={`text-xs font-mono uppercase tracking-widest ${dark ? 'text-ivory/40' : 'text-muted-foreground'}`}>
        {label}
      </div>
    </motion.div>
  );
}

/* ── Tech Badge ── */
interface TechBadgeProps { name: string; dark?: boolean; className?: string; }

export function TechBadge({ name, dark = false, className = "" }: TechBadgeProps) {
  return (
    <motion.span
      whileHover={{ scale: 1.07, y: -2 }}
      transition={{ duration: 0.18 }}
      className={`tech-tag ${dark ? 'tech-tag-dark' : ''} ${className}`}
    >
      {name}
    </motion.span>
  );
}

/* ── Tilt Card (3-D mouse effect with glare + spring physics) ── */
interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
  dark?: boolean;
  tiltDegree?: number;
  glare?: boolean;
}

export function TiltCard({
  children, className = "", dark = false,
  tiltDegree = 8, glare = true
}: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);
  const springX = useSpring(mouseX, { stiffness: 180, damping: 18 });
  const springY = useSpring(mouseY, { stiffness: 180, damping: 18 });

  const rotateY = useTransform(springX, [0, 1], [tiltDegree, -tiltDegree]);
  const rotateX = useTransform(springY, [0, 1], [-tiltDegree, tiltDegree]);
  const glareX = useTransform(springX, [0, 1], [0, 100]);
  const glareY = useTransform(springY, [0, 1], [0, 100]);
  const glareBackground = useTransform([glareX, glareY], (gx: number, gy: number) =>
    `radial-gradient(circle at ${gx}% ${gy}%, rgba(255,255,255,0.15), transparent 70%)`
  );

  const onMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    mouseX.set((e.clientX - left) / width);
    mouseY.set((e.clientY - top) / height);
  }, [mouseX, mouseY]);

  const onLeave = useCallback(() => {
    mouseX.set(0.5);
    mouseY.set(0.5);
  }, [mouseX, mouseY]);

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ rotateX, rotateY, perspective: 900 }}
      whileHover={{ scale: 1.015 }}
      transition={{ scale: { duration: 0.3, ease } }}
      className={`${dark ? 'ruled-card-dark' : 'ruled-card'} overflow-hidden relative ${className}`}
    >
      {children}
      {glare && (
        <motion.div
          className="pointer-events-none absolute inset-0 z-10"
          style={{ background: glareBackground }}
        />
      )}
    </motion.div>
  );
}

/* ── Marquee Strip ── */
interface MarqueeProps { items: string[]; dark?: boolean; }

export function Marquee({ items, dark = false }: MarqueeProps) {
  const doubled = [...items, ...items];
  return (
    <div className={`marquee-wrap py-4 border-y ${dark ? 'border-ivory/10' : 'border-border'}`}>
      <div className="marquee-track">
        {doubled.map((item, i) => (
          <span
            key={`${item}-${i}`}
            className={`flex items-center gap-4 text-sm font-mono font-medium ${
              dark ? 'text-ivory/38' : 'text-muted-foreground'
            }`}
          >
            {item}
            <span className="text-emerald-brand text-base">·</span>
          </span>
        ))}
      </div>
    </div>
  );
}
