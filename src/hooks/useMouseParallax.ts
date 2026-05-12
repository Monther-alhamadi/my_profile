import { useState, useEffect, useRef } from 'react'

export function useMouseParallax() {
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [smoothPosition, setSmoothPosition] = useState({ x: 0, y: 0 })
  const rafRef = useRef<number>()
  const targetRef = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1
      const y = (e.clientY / window.innerHeight) * 2 - 1
      targetRef.current = { x, y }
      setPosition({ x, y })
    }

    const animate = () => {
      setSmoothPosition((prev) => {
        const dx = targetRef.current.x - prev.x
        const dy = targetRef.current.y - prev.y
        return {
          x: prev.x + dx * 0.1,
          y: prev.y + dy * 0.1,
        }
      })
      rafRef.current = requestAnimationFrame(animate)
    }

    window.addEventListener('mousemove', handleMouseMove)
    rafRef.current = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current)
      }
    }
  }, [])

  return {
    x: position.x,
    y: position.y,
    smoothX: smoothPosition.x,
    smoothY: smoothPosition.y,
  }
}
