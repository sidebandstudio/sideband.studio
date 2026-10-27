'use client'

import {
  useRef,
  type CSSProperties,
  type ElementType,
  type ReactNode,
} from 'react'
import { isBelowFold, prefersReducedMotion, useIsoLayoutEffect } from './motion'

interface RevealProps {
  children: ReactNode
  /**
   * `scroll` (default): rises once when it first enters the viewport. Content
   * already on screen at load, without script, or under reduced motion is
   * shown as is.
   * `mount`: part of the page-load sequence. Pure CSS ([data-rise]).
   */
  trigger?: 'scroll' | 'mount'
  /** Delay in ms. Stagger siblings by 70ms (`delay={i * 70}`). */
  delay?: number
  /** Rise distance in px, 16 to 32. */
  distance?: number
  as?: ElementType
  className?: string
  style?: CSSProperties
}

export default function Reveal({
  children,
  trigger = 'scroll',
  delay = 0,
  distance = 24,
  as: Tag = 'div',
  className,
  style,
}: RevealProps) {
  const ref = useRef<HTMLElement>(null)

  useIsoLayoutEffect(() => {
    const el = ref.current
    if (trigger !== 'scroll' || !el) return
    if (prefersReducedMotion() || !isBelowFold(el)) return

    el.setAttribute('data-reveal', 'hidden')
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        el.setAttribute('data-reveal', 'shown')
        io.disconnect()
      },
      { rootMargin: '0px 0px -10% 0px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [trigger])

  const vars = {
    ...style,
    ...(trigger === 'mount'
      ? { '--d': `${delay}ms` }
      : { '--reveal-delay': `${delay}ms`, '--reveal-y': `${distance}px` }),
  } as CSSProperties

  return (
    <Tag
      ref={ref}
      className={className}
      style={vars}
      {...(trigger === 'mount' ? { 'data-rise': '' } : {})}
    >
      {children}
    </Tag>
  )
}
