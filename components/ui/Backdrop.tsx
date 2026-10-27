'use client'

import { useRef, type CSSProperties } from 'react'
import { useAmbient } from './motion'
import { cx } from './cx'

interface BackdropProps {
  /**
   * `grid`: a dot grid that fades out from the top centre. Behind product stages.
   * `spotlight`: one soft light from above (or below) the section. The one lit
   * thing per screen, usually behind a hero object.
   * `bands`: the mark's two offset tiles as faint flat fields, drifting
   * slowly while on screen. The signature, once per page at most.
   */
  variant: 'grid' | 'spotlight' | 'bands'
  /** Spotlight only. `accent` tints it with --band-a (default the brand accent). */
  tone?: 'neutral' | 'accent'
  /** Spotlight only. Where the light comes from. */
  from?: 'top' | 'bottom'
  /** Override the band colours, for example with a product's accent. */
  colors?: { a?: string; b?: string }
  className?: string
}

/**
 * Decorative layer for <Section backdrop={...}>. Purely CSS, aria-hidden,
 * pointer-events off. Paints behind the section's content.
 */
export default function Backdrop({
  variant,
  tone = 'neutral',
  from = 'top',
  colors,
  className,
}: BackdropProps) {
  const style = {
    ...(colors?.a ? { '--band-a': colors.a } : {}),
    ...(colors?.b ? { '--band-b': colors.b } : {}),
  } as CSSProperties
  const base = cx('pointer-events-none absolute inset-0 -z-10', className)

  if (variant === 'bands') return <Bands className={base} style={style} />

  return (
    <div
      aria-hidden="true"
      className={cx(base, variant === 'grid' ? 'bd-grid' : 'bd-spotlight')}
      style={style}
      {...(variant === 'spotlight'
        ? { 'data-tone': tone, 'data-from': from }
        : {})}
    />
  )
}

function Bands({
  className,
  style,
}: {
  className: string
  style: CSSProperties
}) {
  const ref = useRef<HTMLDivElement>(null)
  useAmbient(ref)
  return (
    <div
      ref={ref}
      aria-hidden="true"
      className={cx(className, 'bd-bands')}
      style={style}
    >
      <span className="bd-band bd-band-a" />
      <span className="bd-band bd-band-b" />
    </div>
  )
}
