'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useRef, useState, type KeyboardEvent } from 'react'
import ImageCredit from '@/components/products/ImageCredit'
import StatusBadge from '@/components/ui/StatusBadge'
import { ArrowRightIcon } from '@/components/ui/Icons'
import { cx } from '@/components/ui/cx'
import type { HeroItem } from '@/lib/home-data'
import styles from './HeroPreview.module.css'

const PAGE_MS = 6000

/** DESIGN.md: a product window floating over a backdrop is the one thing at rest that casts a shadow. */
const WINDOW_SHADOW = 'shadow-[0_40px_80px_-40px_rgba(0,0,0,0.8)]' // taste-skill-ignore

/**
 * A window onto the top-ranked products: one tab per product, a real
 * screenshot behind each, and a caption with its key number and a link to its
 * page. Tabs page on their own while the window is on screen, the tab is
 * visible and motion is allowed. Hovering, focusing or picking a tab hands
 * control to the visitor. Items arrive from the server in ranked order.
 */
export default function HeroPreview({ items }: { items: HeroItem[] }) {
  const count = items.length
  const [active, setActive] = useState(0)
  const [paging, setPaging] = useState(false)
  const [cycle, setCycle] = useState(0)
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
      if (!canPage()) return setPaging(false)
      setPaging(true)
      setCycle((c) => c + 1)
      timer.current = setTimeout(() => {
        timer.current = undefined
        if (!canPage()) return setPaging(false)
        setActive((i) => (i + 1) % count)
        schedule()
      }, PAGE_MS)
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        s.visible = entry.isIntersecting
        schedule()
      },
      { threshold: 0.35 },
    )
    observer.observe(frame)

    const on = (type: string, fn: (e: Event) => void) =>
      frame.addEventListener(type, fn, opts)
    on('pointerenter', (e) => {
      if ((e as PointerEvent).pointerType !== 'mouse') return
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
    document.addEventListener('visibilitychange', schedule, opts)
    reducedMotion.addEventListener('change', schedule, opts)

    return () => {
      events.abort()
      observer.disconnect()
      if (timer.current !== undefined) clearTimeout(timer.current)
    }
  }, [count])

  function pick(i: number) {
    state.current.userControlled = true
    if (timer.current !== undefined) clearTimeout(timer.current)
    setPaging(false)
    setActive(i)
  }

  function onKeyDown(e: KeyboardEvent) {
    let next: number | null = null
    if (e.key === 'ArrowRight') next = (active + 1) % count
    if (e.key === 'ArrowLeft') next = (active - 1 + count) % count
    if (e.key === 'Home') next = 0
    if (e.key === 'End') next = count - 1
    if (next === null) return
    e.preventDefault()
    pick(next)
    tabRefs.current[next]?.focus()
  }

  return (
    <div
      ref={frameRef}
      data-ui
      className={cx(
        'rounded-panel bg-sideband-surface p-2 md:p-3',
        WINDOW_SHADOW,
      )}
    >
      <div
        role="tablist"
        aria-label="Products"
        onKeyDown={onKeyDown}
        className="flex flex-wrap gap-1 pb-2 md:pb-3"
      >
        {items.map((item, i) => {
          const selected = i === active
          return (
            <button
              key={item.id}
              ref={(el) => {
                tabRefs.current[i] = el
              }}
              type="button"
              role="tab"
              id={`preview-tab-${item.id}`}
              aria-selected={selected}
              aria-controls={`preview-panel-${item.id}`}
              tabIndex={selected ? 0 : -1}
              onClick={() => pick(i)}
              className={cx(
                'relative flex h-10 shrink-0 items-center gap-2 overflow-hidden rounded-full pl-2 pr-4 text-small font-medium transition-colors duration-hover ease-standard',
                selected
                  ? 'bg-sideband-surface-3 text-sideband-text'
                  : 'text-sideband-text-secondary hover:bg-sideband-surface-2 hover:text-sideband-text',
              )}
            >
              <Image
                src={item.icon}
                alt=""
                width={48}
                height={48}
                className="h-6 w-6 rounded-[22%]"
              />
              {item.name}
              {selected && paging && (
                <span
                  key={cycle}
                  aria-hidden="true"
                  className={styles.progress}
                />
              )}
            </button>
          )
        })}
      </div>

      <div className="grid">
        {items.map((item, i) => {
          const shown = i === active
          return (
            <div
              key={item.id}
              role="tabpanel"
              id={`preview-panel-${item.id}`}
              aria-labelledby={`preview-tab-${item.id}`}
              aria-hidden={!shown}
              className={cx(
                'flex flex-col transition-opacity duration-ui ease-standard [grid-area:1/1]',
                shown ? 'opacity-100' : 'pointer-events-none opacity-0',
              )}
            >
              <div className="relative aspect-[16/10] overflow-hidden rounded-inner bg-sideband-black">
                <Image
                  src={item.shot.src}
                  alt={item.shot.alt}
                  fill
                  sizes="(max-width: 1440px) 96vw, 1380px"
                  priority={i === 0}
                  quality={85}
                  className="object-cover object-top"
                />
              </div>
              <div className="flex flex-col gap-4 px-2 pb-1 pt-4 sm:flex-row sm:items-center sm:justify-between md:px-3 md:pt-5">
                <div className="flex min-w-0 flex-col gap-1">
                  <p className="flex flex-wrap items-center gap-x-3 gap-y-2 text-body font-medium text-sideband-text">
                    {item.name}
                    <StatusBadge status={item.status} />
                  </p>
                  <p className="text-small text-sideband-text-secondary">
                    {item.category}
                    <span aria-hidden="true"> &middot; </span>
                    <span className="tabular-nums text-sideband-text">
                      {item.figure.value}
                    </span>{' '}
                    {item.figure.label}
                  </p>
                  {item.shot.credit && (
                    <ImageCredit credit={item.shot.credit} plain={!shown} />
                  )}
                </div>
                <Link
                  href={`/products/${item.id}`}
                  tabIndex={shown ? 0 : -1}
                  className="group inline-flex shrink-0 items-center gap-1.5 text-small font-medium text-sideband-text transition-colors duration-hover ease-standard hover:text-white"
                >
                  Open {item.name}
                  <ArrowRightIcon
                    size={14}
                    className="transition-transform duration-hover ease-out group-hover:translate-x-1"
                  />
                </Link>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
