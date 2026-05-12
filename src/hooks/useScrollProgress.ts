import { useState, useEffect, useCallback, useRef } from 'react'

export function useScrollProgress() {
  const [scrollY, setScrollY] = useState(0)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const intersectionRef = useRef<HTMLElement | null>(null)

  const handleScroll = useCallback(() => {
    const currentScrollY = window.scrollY
    const windowHeight = window.innerHeight
    const documentHeight = document.documentElement.scrollHeight
    const maxScroll = documentHeight - windowHeight
    const progress = maxScroll > 0 ? currentScrollY / maxScroll : 0

    setScrollY(currentScrollY)
    setScrollProgress(Math.min(Math.max(progress, 0), 1))
    setIsScrolled(currentScrollY > 50)
  }, [])

  useEffect(() => {
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [handleScroll])

  useEffect(() => {
    if (!intersectionRef.current) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting)
      },
      {
        threshold: 0.1,
        rootMargin: '-50px 0px -50px 0px',
      }
    )

    observer.observe(intersectionRef.current)

    return () => observer.disconnect()
  }, [intersectionRef.current])

  return {
    scrollY,
    scrollProgress,
    isScrolled,
    isVisible,
    intersectionRef,
  }
}
