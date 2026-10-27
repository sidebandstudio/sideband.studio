'use client'

import { useRef, useState } from 'react'
import { isBelowFold, prefersReducedMotion, useIsoLayoutEffect } from './motion'
import { cx } from './cx'

interface StatProps {
  /** The figure as it should read, e.g. "1,204", "4", "98%", "v2.3". */
  value: string
  label: string
  /** Count up from zero the first time it scrolls into view. Numbers only. */
  countUp?: boolean
  className?: string
}

const NUMBER = /^(\D*?)(\d[\d,]*(?:\.\d+)?)(.*)$/

function format(n: number, decimals: number, grouped: boolean) {
  return n.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
    useGrouping: grouped,
  })
}

/**
 * A figure and what it counts, as one <dt>/<dd> pair: always place Stats
 * inside a <dl>. The final value is always in the markup, so
 * it reads correctly without script, to screen readers, and under reduced
 * motion. Count-up only runs for stats that start below the fold.
 */
export default function Stat({
  value,
  label,
  countUp = false,
  className,
}: StatProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const [shown, setShown] = useState(value)

  useIsoLayoutEffect(() => {
    const el = ref.current
    const match = value.match(NUMBER)
    if (!countUp || !el || !match || prefersReducedMotion() || !isBelowFold(el))
      return

    const [, prefix, digits, suffix] = match
    const target = Number(digits.replace(/,/g, ''))
    const decimals = digits.split('.')[1]?.length ?? 0
    const grouped = digits.includes(',')
    let frame = 0
    setShown(`${prefix}${format(0, decimals, grouped)}${suffix}`)

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        io.disconnect()
        const start = performance.now()
        const tick = (now: number) => {
          const t = Math.min(1, (now - start) / 1200)
          const eased = 1 - Math.pow(1 - t, 4)
          setShown(
            `${prefix}${format(target * eased, decimals, grouped)}${suffix}`,
          )
          if (t < 1) frame = requestAnimationFrame(tick)
        }
        frame = requestAnimationFrame(tick)
      },
      { rootMargin: '0px 0px -10% 0px' },
    )
    io.observe(el)
    return () => {
      io.disconnect()
      cancelAnimationFrame(frame)
      setShown(value)
    }
  }, [value, countUp])

  return (
    <div className={cx('flex flex-col-reverse gap-2', className)}>
      <dt className="text-small text-sideband-muted">{label}</dt>
      <dd className="text-head tabular-nums text-sideband-text">
        <span ref={ref} aria-hidden="true">
          {shown}
        </span>
        <span className="sr-only">{value}</span>
      </dd>
    </div>
  )
}
