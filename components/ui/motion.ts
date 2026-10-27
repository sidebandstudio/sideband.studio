'use client'

import { useEffect, useLayoutEffect, useState, type RefObject } from 'react'

/** useLayoutEffect on the client, nothing on the server. */
export const useIsoLayoutEffect =
  typeof window === 'undefined' ? () => {} : useLayoutEffect

export function prefersReducedMotion() {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )
}

/** True while the visitor asks for reduced motion, and follows changes. */
export function useReducedMotion() {
  const [reduced, setReduced] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setReduced(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])
  return reduced
}

/** Whether an element starts below the visible part of the page. */
export function isBelowFold(el: Element) {
  return el.getBoundingClientRect().top > window.innerHeight * 0.92
}

/**
 * Runs ambient loops only while `ref` is on screen, the tab is visible and
 * the visitor allows motion. Sets data-play="on" on the element, which turns
 * on every `animation-play-state: var(--play, paused)` inside it.
 * Returns the same state for script-driven loops.
 */
export function useAmbient(ref: RefObject<Element>) {
  const [playing, setPlaying] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    let onScreen = false

    const sync = () => {
      const on = onScreen && !document.hidden && !mq.matches
      el.setAttribute('data-play', on ? 'on' : 'off')
      setPlaying(on)
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        onScreen = entry.isIntersecting
        sync()
      },
      { rootMargin: '80px 0px' },
    )
    io.observe(el)
    document.addEventListener('visibilitychange', sync)
    mq.addEventListener('change', sync)
    return () => {
      io.disconnect()
      document.removeEventListener('visibilitychange', sync)
      mq.removeEventListener('change', sync)
    }
  }, [ref])

  return playing
}
