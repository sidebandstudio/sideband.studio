'use client'

import { useEffect, useState } from 'react'
import { useIsoLayoutEffect } from '@/components/ui/motion'
import { cx } from '@/components/ui/cx'

const PHONE = '(max-width: 639px)'

export interface CollapseTarget {
  /** Id of a list, or of a block to hide whole. */
  id: string
  /** Children of the list kept in view. 0 hides the block itself. */
  keep: number
}

/**
 * A long section shortened on phones. The server renders everything, so the
 * full content is in the page for search, without script and in print. On a
 * phone the children past each target's `keep` are hidden until the visitor
 * presses the button. Wider screens always show everything.
 */
export default function ShowAll({
  targets,
  total,
  noun,
  label,
  className,
}: {
  targets: CollapseTarget[]
  /** How many items the section holds, for the button's label. */
  total: number
  /** Plural noun for the label: "roles", "projects". */
  noun: string
  /** Replaces "Show all {total} {noun}" when the button reveals more than items. */
  label?: string
  className?: string
}) {
  const [phone, setPhone] = useState(false)
  const [open, setOpen] = useState(false)

  useIsoLayoutEffect(() => {
    const mq = window.matchMedia(PHONE)
    const update = () => setPhone(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])

  // Hidden before paint, so a phone never sees the long version flash.
  useIsoLayoutEffect(() => {
    const hide = phone && !open
    for (const { id, keep } of targets) {
      const el = document.getElementById(id)
      if (!el) continue
      const hidden = keep === 0 ? [el] : Array.from(el.children).slice(keep)
      for (const child of hidden)
        (child as HTMLElement).style.display = hide ? 'none' : ''
    }
  }, [phone, open, targets])

  // Print the whole section.
  useEffect(() => {
    const show = () => setOpen(true)
    window.addEventListener('beforeprint', show)
    return () => window.removeEventListener('beforeprint', show)
  }, [])

  if (!phone) return null
  return (
    <button
      type="button"
      aria-expanded={open}
      aria-controls={targets.map((t) => t.id).join(' ')}
      onClick={() => setOpen((v) => !v)}
      className={cx(
        'inline-flex h-11 items-center rounded-full bg-sideband-surface-2 px-5 text-small font-medium text-sideband-text transition-colors duration-hover hover:bg-sideband-surface-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sideband-accent',
        className,
      )}
    >
      {open
        ? label
          ? 'Show less'
          : `Show fewer ${noun}`
        : (label ?? `Show all ${total} ${noun}`)}
    </button>
  )
}
