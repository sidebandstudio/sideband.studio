'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { useAmbient, useReducedMotion } from '@/components/ui/motion'
import { cx } from '@/components/ui/cx'
import type { ProductVideoCut, ProductVideoCutName } from '@/lib/products'
import ImageCredit from './ImageCredit'

const FRAME: Record<ProductVideoCutName, string> = {
  card: 'aspect-[4/3]',
  hero: 'aspect-[4/3] md:aspect-[16/10]',
}

const SIZES: Record<ProductVideoCutName, string> = {
  card: '(min-width: 1024px) 31vw, (min-width: 640px) 46vw, 92vw',
  hero: '(min-width: 1024px) 56vw, 92vw',
}

interface ProductVideoProps {
  video: ProductVideoCut
  cut: ProductVideoCutName
  /** On the product page's own hero: the poster loads first and the video's metadata with it. */
  priority?: boolean
  /** The poster's rendered width, for next/image. */
  sizes?: string
  /** Lifts the frame 4px when a `group` around it is hovered. */
  lift?: boolean
  /**
   * Makes the frame a link out of the tab order and hidden from assistive
   * tech, for a list where the product's name links to the same page. The
   * label is that name.
   */
  link?: { href: string; label: string }
  /** Drops the credit's links, for a video inside a link. */
  plainCredit?: boolean
  className?: string
}

/**
 * A product's silent video in a fixed-aspect frame: 4:3 for a card, 16:10
 * for a hero (4:3 below md, where the hero cut's centre carries it). The
 * poster paints first and stays the picture until the video plays. The video
 * plays only while it is on screen, the tab is visible and the visitor allows
 * motion (useAmbient). Under reduced motion only the poster shows. The frame
 * is decorative, so the page names the product in text next to it. A cut's
 * credit is shown under the frame.
 */
export default function ProductVideo({
  video,
  cut,
  priority = false,
  sizes,
  lift = false,
  link,
  plainCredit = false,
  className,
}: ProductVideoProps) {
  const frameRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const play = useAmbient(frameRef)
  const reduced = useReducedMotion()
  const [started, setStarted] = useState(false)

  useEffect(() => {
    const el = videoRef.current
    if (!el) return
    if (play) {
      el.muted = true
      el.play().catch(() => {})
    } else el.pause()
  }, [play])

  const frame = (
    <div
      ref={frameRef}
      aria-hidden="true"
      data-video-frame=""
      className={cx(
        'relative isolate overflow-hidden rounded-panel bg-sideband-surface',
        FRAME[cut],
        lift &&
          'transition-transform duration-ui ease-out group-hover:-translate-y-1',
      )}
    >
      <Image
        src={video.poster}
        alt=""
        fill
        priority={priority}
        sizes={sizes ?? SIZES[cut]}
        className="object-cover"
      />
      <video
        ref={videoRef}
        muted
        loop
        playsInline
        disablePictureInPicture
        preload={priority ? 'metadata' : 'none'}
        onPlaying={() => setStarted(true)}
        className={cx(
          'absolute inset-0 h-full w-full object-cover transition-opacity duration-ui ease-standard',
          started && !reduced ? 'opacity-100' : 'opacity-0',
        )}
      >
        <source src={video.webm} type="video/webm" />
        <source src={video.mp4} type="video/mp4" />
      </video>
    </div>
  )

  return (
    <div data-product-video={cut} className={className}>
      {link ? (
        <Link
          href={link.href}
          aria-label={link.label}
          tabIndex={-1}
          aria-hidden="true"
          className="group block rounded-panel"
        >
          {frame}
        </Link>
      ) : (
        frame
      )}
      {video.credit && (
        <ImageCredit
          credit={video.credit}
          plain={plainCredit}
          className="relative z-10 mt-3"
        />
      )}
    </div>
  )
}
