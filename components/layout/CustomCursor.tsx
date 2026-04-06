'use client'

import { useEffect, useRef, useState } from 'react'

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null)
  const [isHovering, setIsHovering] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const mousePos = useRef({ x: 0, y: 0 })
  const cursorPos = useRef({ x: 0, y: 0 })

  useEffect(() => {
    // Don't show on touch devices
    if (typeof window !== 'undefined' && 'ontouchstart' in window) return

    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY }
      if (!isVisible) setIsVisible(true)
    }

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const isInteractive =
        target.closest('a') ||
        target.closest('button') ||
        target.closest('input') ||
        target.closest('textarea') ||
        target.closest('[role="button"]')
      setIsHovering(!!isInteractive)
    }

    const handleMouseLeave = () => {
      setIsVisible(false)
    }

    const handleMouseEnter = () => {
      setIsVisible(true)
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseover', handleMouseOver)
    document.documentElement.addEventListener('mouseleave', handleMouseLeave)
    document.documentElement.addEventListener('mouseenter', handleMouseEnter)

    let animationId: number
    const lerp = (start: number, end: number, factor: number) =>
      start + (end - start) * factor

    const animate = () => {
      cursorPos.current.x = lerp(
        cursorPos.current.x,
        mousePos.current.x,
        0.15,
      )
      cursorPos.current.y = lerp(
        cursorPos.current.y,
        mousePos.current.y,
        0.15,
      )

      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate(${cursorPos.current.x}px, ${cursorPos.current.y}px)`
      }

      animationId = requestAnimationFrame(animate)
    }

    animationId = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseover', handleMouseOver)
      document.documentElement.removeEventListener(
        'mouseleave',
        handleMouseLeave,
      )
      document.documentElement.removeEventListener(
        'mouseenter',
        handleMouseEnter,
      )
      cancelAnimationFrame(animationId)
    }
  }, [isVisible])

  // Don't render on touch devices
  if (typeof window !== 'undefined' && 'ontouchstart' in window) return null

  return (
    <div
      ref={cursorRef}
      className="pointer-events-none fixed left-0 top-0 z-[99999] -translate-x-1/2 -translate-y-1/2"
      style={{
        opacity: isVisible ? 1 : 0,
        transition: 'opacity 0.2s ease',
      }}
    >
      <div
        className="rounded-full transition-all duration-200"
        style={{
          width: isHovering ? 24 : 8,
          height: isHovering ? 24 : 8,
          backgroundColor: isHovering
            ? 'rgba(168, 85, 247, 0.3)'
            : '#A855F7',
          mixBlendMode: isHovering ? 'difference' : 'normal',
          transform: `translate(-50%, -50%)`,
        }}
      />
    </div>
  )
}
