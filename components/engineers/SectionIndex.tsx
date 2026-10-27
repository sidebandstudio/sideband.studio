'use client'

import { useEffect, useRef, useState, type KeyboardEvent } from 'react'
import Container from '@/components/ui/Container'
import { cx } from '@/components/ui/cx'

export interface IndexItem {
  /** The section element's id. */
  id: string
  label: string
}

/**
 * The dossier's sections, held under the navigation bar while the page
 * scrolls. Wide screens get a row of links with the current section marked.
 * Phones get one "Jump to" control that opens the same links. Both are plain
 * links to the section ids, so they work by keyboard and without script.
 */
export default function SectionIndex({ items }: { items: IndexItem[] }) {
  const [current, setCurrent] = useState<string | null>(null)
  const menu = useRef<HTMLDetailsElement>(null)

  useEffect(() => {
    const sections = items
      .map((i) => document.getElementById(i.id))
      .filter((el): el is HTMLElement => Boolean(el))
    // The current section is the last one whose top has passed the upper
    // third of the screen. Above the first section, there is none.
    let frame = 0
    const update = () => {
      frame = 0
      const line = window.innerHeight * 0.3
      const passed = sections.filter(
        (s) => s.getBoundingClientRect().top <= line,
      )
      setCurrent(passed.length ? passed[passed.length - 1].id : null)
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [items])

  const close = () => {
    if (menu.current) menu.current.open = false
  }
  const onMenuKey = (e: KeyboardEvent<HTMLDetailsElement>) => {
    if (e.key !== 'Escape' || !menu.current?.open) return
    close()
    menu.current.querySelector('summary')?.focus()
  }

  const label = items.find((i) => i.id === current)?.label
  const link = (item: IndexItem, extra?: string) =>
    cx(
      'inline-flex h-10 items-center rounded-full px-3.5 text-small transition-colors duration-hover ease-standard focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sideband-accent',
      item.id === current
        ? 'bg-sideband-surface-2 text-sideband-text'
        : 'text-sideband-text-secondary hover:text-sideband-text',
      extra,
    )

  return (
    <nav
      aria-label="Sections of this dossier"
      className="sticky top-nav z-40 bg-sideband-black py-2"
    >
      <Container>
        <ul className="-mx-3.5 hidden flex-wrap gap-1 sm:flex">
          {items.map((item) => (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                aria-current={item.id === current ? 'location' : undefined}
                className={link(item)}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
        <details
          ref={menu}
          onKeyDown={onMenuKey}
          className="relative sm:hidden"
        >
          <summary className="flex h-11 cursor-pointer list-none items-center justify-between rounded-inner bg-sideband-surface px-4 text-small text-sideband-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sideband-accent [&::-webkit-details-marker]:hidden">
            <span>
              Jump to
              {label && (
                <span className="text-sideband-muted"> · now at {label}</span>
              )}
            </span>
            <span aria-hidden="true" className="text-sideband-muted">
              ▾
            </span>
          </summary>
          <ul className="absolute inset-x-0 top-full mt-1 rounded-inner bg-sideband-surface-2 p-2">
            {items.map((item) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  onClick={close}
                  aria-current={item.id === current ? 'location' : undefined}
                  className={link(item, 'flex w-full')}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </details>
      </Container>
    </nav>
  )
}
