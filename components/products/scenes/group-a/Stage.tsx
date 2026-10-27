'use client'

import { useRef, type CSSProperties, type ReactNode } from 'react'
import { useAmbient } from '@/components/ui/motion'
import type { SceneVariant } from '..'
import u from './ui.module.css'

interface StageProps {
  id: string
  variant: SceneVariant
  /** The 800×600 drawing. Also used by the hero below md, where it is 4:3. */
  card: ReactNode
  /** The 1600×1000 drawing, shown from md. */
  hero: ReactNode
}

/**
 * Hosts a product scene. Runs its loops only while it is on screen, the
 * tab is visible and motion is allowed (useAmbient). The hero framing shows
 * the card drawing while its stage is narrower than 480px (a 4:3 phone
 * stage), where the hero drawing's labels would fall under 12px, and the
 * hero drawing from there up. See ui.module.css.
 */
export function SceneStage({ id, variant, card, hero }: StageProps) {
  const ref = useRef<HTMLDivElement>(null)
  useAmbient(ref)

  return (
    <div ref={ref} className={u.stage} data-scene={id}>
      {variant === 'card' ? (
        card
      ) : (
        <>
          <div className={`${u.frame} ${u.compact}`}>{card}</div>
          <div className={`${u.frame} ${u.wide}`}>{hero}</div>
        </>
      )}
    </div>
  )
}

interface SvgProps {
  frame: SceneVariant
  /** Loop length in seconds. */
  duration: number
  /**
   * Where the still frame sits in the loop, 0 to 1. Every animated element
   * matches its base style at this point, so the loop starts here and the
   * paused, reduced-motion and pre-hydration pictures are the same frame.
   */
  still: number
  children: ReactNode
}

export function SceneSvg({ frame, duration, still, children }: SvgProps) {
  const style = {
    '--dur': `${duration}s`,
    '--at': `${-still * duration}s`,
  } as CSSProperties
  return (
    <svg
      viewBox={frame === 'card' ? '0 0 800 600' : '0 0 1600 1000'}
      preserveAspectRatio="xMidYMid slice"
      className={u.svg}
      data-frame={frame}
      focusable="false"
      style={style}
    >
      {children}
    </svg>
  )
}
