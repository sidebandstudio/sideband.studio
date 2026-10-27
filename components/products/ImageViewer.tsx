'use client'

import Image from 'next/image'
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import type { ProductImage, ProductImageKind } from '@/lib/products'
import { cx } from '@/components/ui/cx'
import { useIsoLayoutEffect } from '@/components/ui/motion'
import DeviceFrame from './DeviceFrame'
import styles from './ImageViewer.module.css'

const KIND_LABEL: Record<ProductImageKind, string> = {
  screenshot: 'Screenshot',
  artwork: 'Artwork',
  photo: 'Photo',
}

interface ViewerContext {
  images: ProductImage[]
  open: (index: number) => void
  register: (index: number, el: HTMLButtonElement | null) => void
}

const Context = createContext<ViewerContext | null>(null)

/**
 * One large viewer for every image on a product page, wherever on the page
 * the image sits. Enter opens it on the image in focus, the arrow keys step
 * through the product's images in data order, Escape closes and focus returns
 * to the image it came from.
 */
export function ImageViewerProvider({
  images,
  productName,
  children,
}: {
  images: ProductImage[]
  productName: string
  children: ReactNode
}) {
  const [open, setOpen] = useState<number | null>(null)
  const dialogRef = useRef<HTMLDialogElement>(null)
  const triggers = useRef<(HTMLButtonElement | null)[]>([])
  const returnTo = useRef<number | null>(null)
  const titleId = useId()

  const show = useCallback((index: number) => {
    returnTo.current = index
    setOpen(index)
  }, [])

  const register = useCallback(
    (index: number, el: HTMLButtonElement | null) => {
      triggers.current[index] = el
    },
    [],
  )

  const step = useCallback(
    (by: number) =>
      setOpen((i) =>
        i === null ? i : (i + by + images.length) % images.length,
      ),
    [images.length],
  )

  const isOpen = open !== null

  const bodyRef = useRef<HTMLDivElement>(null)
  const headRef = useRef<HTMLDivElement>(null)
  const footRef = useRef<HTMLDivElement>(null)
  const [size, setSize] = useState<{ width: number; height: number } | null>(
    null,
  )

  // The viewer shows the image as large as the viewport allows once its own
  // controls and caption are placed, never past the image's natural size, and
  // never smaller than it appeared on the page. If the page showed it larger
  // than the viewport is tall, the viewer scrolls rather than shrink it.
  const measure = useCallback(() => {
    const body = bodyRef.current
    if (open === null || !body) return
    const image = images[open]
    const css = getComputedStyle(body)
    const gap = parseFloat(css.rowGap) || 0
    const availWidth =
      body.clientWidth -
      parseFloat(css.paddingLeft) -
      parseFloat(css.paddingRight)
    const availHeight =
      window.innerHeight -
      parseFloat(css.paddingTop) -
      parseFloat(css.paddingBottom) -
      (headRef.current?.offsetHeight ?? 0) -
      (footRef.current?.offsetHeight ?? 0) -
      gap * 2
    const fit = Math.min(
      availWidth / image.width,
      availHeight / image.height,
      1,
    )
    const inline =
      triggers.current[open]?.querySelector('img')?.getBoundingClientRect()
        .width ?? 0
    const width = Math.max(
      image.width * fit,
      Math.min(inline, availWidth, image.width),
    )
    setSize({ width, height: (width * image.height) / image.width })
  }, [images, open])

  // Open and close the native modal dialog with the state, then size the
  // image before the first paint. showModal() makes the rest of the page inert.
  useIsoLayoutEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (isOpen && !dialog.open) {
      dialog.showModal()
      dialog.querySelector<HTMLElement>('[data-autofocus]')?.focus()
    }
    if (!isOpen && dialog.open) dialog.close()
    measure()
  }, [isOpen, measure])

  useEffect(() => {
    if (!isOpen) return
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [isOpen, measure])

  // While the viewer is open the page behind does not scroll. The cleanup
  // releases the lock however the viewer goes away: closed, or unmounted by a
  // route change such as the browser's Back button.
  useEffect(() => {
    if (!isOpen) return
    const root = document.documentElement
    const previous = root.style.overflow
    root.style.overflow = 'hidden'
    return () => {
      root.style.overflow = previous
    }
  }, [isOpen])

  // Arrow keys step through while the viewer is open, wherever focus sits in
  // it (the scroll area can stop being focusable when an image fits).
  useEffect(() => {
    if (!isOpen) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'ArrowRight') {
        event.preventDefault()
        step(1)
      } else if (event.key === 'ArrowLeft') {
        event.preventDefault()
        step(-1)
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [isOpen, step])

  const onClose = () => {
    setOpen(null)
    const index = returnTo.current
    if (index !== null) triggers.current[index]?.focus()
  }

  const current = open === null ? null : images[open]

  return (
    <Context.Provider value={{ images, open: show, register }}>
      {children}

      <dialog
        ref={dialogRef}
        aria-labelledby={titleId}
        className={styles.viewer}
        onClose={onClose}
        onClick={(event) => {
          if (event.target === event.currentTarget) setOpen(null)
        }}
      >
        {current && open !== null && (
          <div ref={bodyRef} className={styles.viewerBody}>
            <div
              ref={headRef}
              className="flex items-center justify-between gap-4"
            >
              <p className="text-small tabular-nums text-sideband-text-secondary">
                <span id={titleId} className="text-sideband-text">
                  {KIND_LABEL[current.kind]} {open + 1} of {images.length}
                </span>
                <span className="sr-only">, {productName}</span>
              </p>
              <ViewerButton
                label="Close viewer"
                onClick={() => setOpen(null)}
                autoFocus
              >
                <path d="M6 6l12 12M18 6L6 18" />
              </ViewerButton>
            </div>

            <div
              className={styles.stage}
              onClick={(event) => {
                if (event.target === event.currentTarget) setOpen(null)
              }}
            >
              <Image
                key={current.src}
                src={current.src}
                alt={current.alt}
                width={current.width}
                height={current.height}
                sizes={size ? `${Math.ceil(size.width)}px` : '100vw'}
                className={styles.stageImage}
                style={
                  size
                    ? { width: size.width, height: size.height }
                    : { visibility: 'hidden' }
                }
              />
            </div>

            <div
              ref={footRef}
              className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between md:gap-10"
            >
              <div className="flex max-w-prose flex-col gap-1">
                <p className="text-small text-sideband-text">{current.alt}</p>
              </div>
              {images.length > 1 && (
                <div className="flex shrink-0 gap-3">
                  <ViewerButton label="Previous image" onClick={() => step(-1)}>
                    <path d="M15 5l-7 7 7 7" />
                  </ViewerButton>
                  <ViewerButton label="Next image" onClick={() => step(1)}>
                    <path d="M9 5l7 7-7 7" />
                  </ViewerButton>
                </div>
              )}
            </div>
          </div>
        )}
      </dialog>
    </Context.Provider>
  )
}

/**
 * One of the product's images, by its index in the data, in its device frame
 * and labelled by what it is, with its credit. Selecting it opens the viewer.
 * Never shown wider than the image's natural size.
 */
export function ViewableImage({
  index,
  sizes,
  className,
}: {
  index: number
  /** next/image `sizes` for the width this placement lays the image out at. */
  sizes: string
  className?: string
}) {
  const context = useContext(Context)
  if (!context) throw new Error('ViewableImage needs an ImageViewerProvider.')
  const image = context.images[index]
  const { register, open } = context

  return (
    <figure
      className={cx('flex flex-col gap-4', className)}
      style={{ maxWidth: image.width }}
    >
      <button
        ref={(el) => register(index, el)}
        type="button"
        onClick={() => open(index)}
        aria-label={`View larger: ${image.alt}`}
        className={cx(
          'group relative block w-full cursor-zoom-in text-left focus-visible:outline-offset-4',
          image.device === 'mobile' || image.device === 'ipad'
            ? 'rounded-[12%]'
            : 'rounded-panel',
        )}
      >
        <DeviceFrame
          src={image.src}
          alt=""
          width={image.width}
          height={image.height}
          device={image.device}
          sizes={sizes}
          className="transition-transform duration-ui ease-out group-hover:-translate-y-1"
        />
        <span
          aria-hidden="true"
          className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-sideband-black/80 text-sideband-text opacity-0 transition-opacity duration-hover ease-standard group-hover:opacity-100 group-focus-visible:opacity-100"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M14 4h6v6M10 20H4v-6M20 4l-7 7M4 20l7-7" />
          </svg>
        </span>
      </button>
      <figcaption className="flex flex-col gap-1">
        <p className="text-small text-sideband-text-secondary">
          <span className="text-sideband-text">{KIND_LABEL[image.kind]}.</span>{' '}
          {image.alt}
        </p>
      </figcaption>
    </figure>
  )
}

function ViewerButton({
  label,
  onClick,
  autoFocus = false,
  children,
}: {
  label: string
  onClick: () => void
  /** Takes focus when the viewer opens. */
  autoFocus?: boolean
  children: ReactNode
}) {
  return (
    <button
      type="button"
      aria-label={label}
      data-autofocus={autoFocus ? '' : undefined}
      onClick={onClick}
      className="flex h-11 w-11 items-center justify-center rounded-full bg-sideband-surface-2 text-sideband-text transition-[transform,background-color] duration-hover ease-standard hover:bg-sideband-surface-3 active:scale-[0.97]"
    >
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        {children}
      </svg>
    </button>
  )
}
