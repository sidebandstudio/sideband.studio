'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { ReactNode } from 'react'

interface FadeUpProps {
  children: ReactNode
  delay?: number
  className?: string
}

// The server always renders the hidden initial state, so the reveal must run
// on the client even when motion is reduced. Otherwise the inline opacity: 0
// from SSR is never overwritten and the section stays invisible.
export default function FadeUp({
  children,
  delay = 0,
  className,
}: FadeUpProps) {
  const reduceMotion = useReducedMotion()

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={
        reduceMotion
          ? { duration: 0 }
          : { duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }
      }
      className={className}
    >
      {children}
    </motion.div>
  )
}
