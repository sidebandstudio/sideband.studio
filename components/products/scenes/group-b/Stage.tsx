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
