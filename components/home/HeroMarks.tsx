'use client'

import Image from 'next/image'
import { useEffect, useRef } from 'react'
import { products } from '@/lib/products'

/** Maps each product id to the CSS block that places its mark. */
const MARK_CLASS: Record<string, string> = {
  'eternal-monitor': 'hf-em',
  'eternal-rich-presence': 'hf-rp',
  exerly: 'hf-ex',
  eternal2x: 'hf-e2x',
  'eternal-summary': 'hf-es',
  'signature-cuts': 'hf-sc',
}

/**
 * Six product icons floating around the headline. CSS owns the entrance and
 * the drift loop. This component only decides when the loop may run (mark on
 * screen, tab visible, motion allowed) and feeds the pointer position in for
 * parallax on fine pointers. The hero section is the pointer surface.
 */
export default function HeroMarks({
  heroRef,
}: {
  heroRef: React.RefObject<HTMLElement>
}) {
  const fieldRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const hero = heroRef.current
    const field = fieldRef.current
    if (!hero || !field || typeof IntersectionObserver === 'undefined') return

    const marks = Array.from(
      field.querySelectorAll<HTMLElement>('.hero-float-mark'),
    )
    const visible = new Set<Element>()
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    const finePointer = window.matchMedia('(pointer: fine)')
    const events = new AbortController()
    const opts = { signal: events.signal }
    let pointerFrame: number | undefined
    let pointer: { x: number; y: number } | null = null

    const canMove = (el: Element) =>
      visible.has(el) &&
      document.visibilityState === 'visible' &&
      !reducedMotion.matches
    const canParallax = () => finePointer.matches && marks.some(canMove)

    function resetPointer() {
      if (pointerFrame !== undefined) cancelAnimationFrame(pointerFrame)
      pointerFrame = undefined
      pointer = null
      field!.style.setProperty('--px', '0px')
      field!.style.setProperty('--py', '0px')
    }

    function update() {
      for (const mark of marks) {
        mark.style.setProperty(
          '--home-motion-state',
          canMove(mark) ? 'running' : 'paused',
        )
      }
      const parallax = canParallax()
      field!.style.setProperty('--parallax-duration', parallax ? '0.7s' : '0s')
      if (!parallax) resetPointer()
    }

    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) visible.add(entry.target)
        else visible.delete(entry.target)
      }
      update()
    })
    for (const mark of marks) observer.observe(mark)

    hero.addEventListener(
      'pointermove',
      (event) => {
        if (!canParallax()) return
        pointer = { x: event.clientX, y: event.clientY }
        pointerFrame ??= requestAnimationFrame(() => {
          pointerFrame = undefined
          if (!pointer || !canParallax()) return
          const bounds = hero.getBoundingClientRect()
          if (bounds.width === 0 || bounds.height === 0) return
          const nx = (pointer.x - bounds.left) / bounds.width - 0.5
          const ny = (pointer.y - bounds.top) / bounds.height - 0.5
          field!.style.setProperty('--px', `${(nx * 36).toFixed(1)}px`)
          field!.style.setProperty('--py', `${(ny * 28).toFixed(1)}px`)
        })
      },
      opts,
    )
    hero.addEventListener('pointerleave', resetPointer, opts)
    document.addEventListener('visibilitychange', update, opts)
    window.addEventListener('resize', update, opts)
    reducedMotion.addEventListener('change', update, opts)
    finePointer.addEventListener('change', update, opts)
    update()

    return () => {
      events.abort()
      observer.disconnect()
      resetPointer()
    }
  }, [heroRef])

  return (
    <div ref={fieldRef} className="hero-float" aria-hidden="true">
      {products.map((p) => (
        <span
          key={p.id}
          className={`hero-float-mark ${MARK_CLASS[p.id] ?? ''}`}
        >
          <span className="hero-float-card">
            <Image src={p.icon} alt="" width={96} height={96} />
          </span>
        </span>
      ))}
    </div>
  )
}
