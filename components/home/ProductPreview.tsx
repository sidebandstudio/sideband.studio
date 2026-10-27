'use client'

import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import { products } from '@/lib/products'

const PAGE_MS = 6000

/**
 * A browser window with one tab per product and a real screenshot behind each.
 * Tabs advance on their own while the window is on screen. Hovering, focusing,
 * or picking a tab hands control to the visitor and the pager stays quiet.
 */
export default function ProductPreview() {
  const [active, setActive] = useState(0)
  const frameRef = useRef<HTMLDivElement>(null)
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([])
  const state = useRef({
    visible: false,
    hovered: false,
    focused: false,
    userControlled: false,
  })
  const timer = useRef<ReturnType<typeof setTimeout>>()

  useEffect(() => {
    const frame = frameRef.current
    if (!frame || typeof IntersectionObserver === 'undefined') return

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    const events = new AbortController()
    const opts = { signal: events.signal }
    const s = state.current

    const canPage = () =>
      s.visible &&
      !s.hovered &&
      !s.focused &&
      !s.userControlled &&
      document.visibilityState === 'visible' &&
      !reducedMotion.matches

    function schedule() {
      if (timer.current !== undefined) clearTimeout(timer.current)
      timer.current = undefined
      if (!canPage()) return
      timer.current = setTimeout(() => {
        timer.current = undefined
        if (!canPage()) return
        setActive((i) => (i + 1) % products.length)
        schedule()
      }, PAGE_MS)
    }

    const observer = new IntersectionObserver(([entry]) => {
      s.visible = entry.isIntersecting
      schedule()
    })
    observer.observe(frame)

    const on = (
      type: string,
      fn: (e: Event) => void,
      target: EventTarget = frame,
    ) => target.addEventListener(type, fn, opts)

    on('pointerenter', () => {
      s.hovered = true
      schedule()
    })
    on('pointerleave', () => {
      s.hovered = false
      schedule()
    })
    on('focusin', () => {
      s.focused = true
      schedule()
    })
    on('focusout', (e) => {
      const next = (e as FocusEvent).relatedTarget
      s.focused = next instanceof Node && frame.contains(next)
      schedule()
    })
    on('visibilitychange', schedule, document)
    reducedMotion.addEventListener('change', schedule, opts)

    return () => {
      events.abort()
      observer.disconnect()
      if (timer.current !== undefined) clearTimeout(timer.current)
    }
  }, [])

  function pick(i: number) {
    state.current.userControlled = true
    if (timer.current !== undefined) clearTimeout(timer.current)
    setActive(i)
  }

  function onKeyDown(e: React.KeyboardEvent) {
    const n = products.length
    let next: number | null = null
    if (e.key === 'ArrowRight') next = (active + 1) % n
    if (e.key === 'ArrowLeft') next = (active - 1 + n) % n
    if (e.key === 'Home') next = 0
    if (e.key === 'End') next = n - 1
    if (next === null) return
    e.preventDefault()
    pick(next)
    tabRefs.current[next]?.focus()
  }

  return (
    <div className="hero-preview">
      <div ref={frameRef} className="hero-frame">
        <div className="flex items-center gap-2 border-b border-sideband-border bg-white/[0.02] px-3 py-2">
          <span className="flex shrink-0 gap-1.5 pr-1">
            <i className="block h-2.5 w-2.5 rounded-full bg-white/[0.08]" />
            <i className="block h-2.5 w-2.5 rounded-full bg-white/[0.08]" />
            <i className="block h-2.5 w-2.5 rounded-full bg-white/[0.08]" />
          </span>
          <div
            role="tablist"
            aria-label="Products"
            onKeyDown={onKeyDown}
            className="flex min-w-0 flex-1 gap-0.5 overflow-x-auto"
          >
            {products.map((p, i) => (
              <button
                key={p.id}
                ref={(el) => {
                  tabRefs.current[i] = el
                }}
                type="button"
                role="tab"
                id={`preview-tab-${p.id}`}
                aria-selected={i === active}
                aria-controls={`preview-panel-${p.id}`}
                tabIndex={i === active ? 0 : -1}
                onClick={() => pick(i)}
                className="hero-tab"
              >
                <Image src={p.icon} alt="" width={28} height={28} />
                <span>{p.name}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="relative aspect-[16/10] bg-[#0a0913]">
          {products.map((p, i) => (
            <div
              key={p.id}
              role="tabpanel"
              id={`preview-panel-${p.id}`}
              aria-labelledby={`preview-tab-${p.id}`}
              aria-hidden={i !== active}
              className={`hero-frame-shot${i === active ? ' is-active' : ''}`}
            >
              <Image
                src={p.preview.src}
                alt={p.preview.alt}
                fill
                sizes="(max-width: 1120px) 100vw, 1120px"
                priority={i === 0}
                quality={90}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
