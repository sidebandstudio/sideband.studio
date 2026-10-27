'use client'

import { useRef, type CSSProperties, type ReactNode } from 'react'
import { useAmbient } from '@/components/ui/motion'
import { cx } from '@/components/ui/cx'
import type { SceneVariant } from '..'
import s from './stage.module.css'

const VIEWBOX: Record<SceneVariant, string> = {
  card: '0 0 800 600',
  hero: '0 0 1600 1000',
}

interface StageProps {
  /** Product id, written to data-scene so tests can find the drawing. */
  id: string
  variant: SceneVariant
  /** Length of the loop. Every `.a` element inside shares it. */
  loop: number
  className?: string
  children: ReactNode
}

/**
 * The SVG every group-b scene draws into: the variant's viewBox, the dot grid
 * behind it, and the ambient gate. Animated elements take the `a` class from
 * `stage.module.css` plus an `animation-name` from their own scene module, so
 * nothing moves until useAmbient sets data-play, and under reduced motion the
 * base styles (the scene's still frame) are what renders.
 */
export function Stage({ id, variant, loop, className, children }: StageProps) {
  const ref = useRef<SVGSVGElement>(null)
  useAmbient(ref)
  return (
    <>
      <div className="bd-grid scene-grid absolute inset-0 -z-10" />
      <svg
        ref={ref}
        data-scene={id}
        data-variant={variant}
        viewBox={VIEWBOX[variant]}
        preserveAspectRatio={
          variant === 'hero' ? 'xMidYMid slice' : 'xMidYMid meet'
        }
        className={cx(s.root, className)}
        style={{ '--loop': `${loop}s` } as CSSProperties}
        aria-hidden="true"
        focusable="false"
      >
        {children}
      </svg>
    </>
  )
}

/**
 * Picks a scene's drawing for its framing. A card shows the card drawing. A
 * hero shows the card drawing while its stage is narrower than 480px (a 4:3
 * phone stage), where the hero drawing's labels would fall under 12px, and
 * the hero drawing from there up. The hidden one is display:none, so it
 * never plays.
 */
export function Framings({
  variant,
  card,
  hero,
}: {
  variant: SceneVariant
  card: ReactNode
  hero: ReactNode
}) {
  if (variant === 'card') return <>{card}</>
  return (
    <div className={s.framings}>
      <div className={s.compact}>{card}</div>
      <div className={s.wide}>{hero}</div>
    </div>
  )
}

/** The shared animation class: add it to every element that moves. */
export const a = s.a
/** Monospace text, for strings that are code or product UI in a mono face. */
export const mono = s.mono

/** Colours a scene may use: the surface steps, ink, and the product accent. */
export const C = {
  ground: 'var(--sideband-black)',
  s1: 'var(--sideband-surface)',
  s2: 'var(--sideband-surface-2)',
  s3: 'var(--sideband-surface-3)',
  ink: 'var(--sideband-text)',
  ink2: 'var(--sideband-text-secondary)',
  muted: 'var(--sideband-muted)',
  line: 'rgba(255, 255, 255, 0.08)',
  lineStrong: 'rgba(255, 255, 255, 0.14)',
  accent: 'var(--product-accent)',
} as const
