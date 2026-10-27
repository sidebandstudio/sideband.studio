'use client'

import Image from 'next/image'
import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from 'react'
import type { ProductImage, ProductImageKind } from '@/lib/products'
import { cx } from '@/components/ui/cx'
import DeviceFrame from './DeviceFrame'
import ImageCredit from './ImageCredit'
import styles from './ProductGallery.module.css'

const KIND_LABEL: Record<ProductImageKind, string> = {
  screenshot: 'Screenshot',
  artwork: 'Artwork',
  photo: 'Photo',
}

/** Landscape images sit in the wide band, phones, portraits and squares in the tall one. */
function isWide(image: ProductImage) {
  return image.width / image.height >= 1.25
}

interface Item {
  image: ProductImage
  /** Position in the data, which is also the viewer's order. */
  index: number
}

/**
 * Every image a product lists, each in its device frame and labelled by what
 * it is, with its credit. Any image opens in a large viewer that works by
 * keyboard: Enter opens it, the arrow keys step through, Escape closes and
 * focus returns to the image it came from.
 */
export default function ProductGallery({
  images,
  productName,
}: {
  images: ProductImage[]
  productName: string
}) {
  const [open, setOpen] = useState<number | null>(null)
  const dialogRef = useRef<HTMLDialogElement>(null)
  const triggers = useRef<(HTMLButtonElement | null)[]>([])
  const returnTo = useRef<number | null>(null)
  const titleId = useId()

  const items = images.map((image, index) => ({ image, index }))
  const wide = items.filter((i) => isWide(i.image))
  const tall = items.filter((i) => !isWide(i.image))
  const bands = isWide(images[0]) ? ['wide', 'tall'] : ['tall', 'wide']

  const show = (index: number) => {
    returnTo.current = index
    setOpen(index)
  }

  const step = useCallback(
    (by: number) =>
      setOpen((i) =>
        i === null ? i : (i + by + images.length) % images.length,
      ),
    [images.length],
  )

  const isOpen = open !== null

  // Open and close the native modal dialog with the state. showModal() makes
  // the rest of the page inert and moves focus inside.
  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (isOpen && !dialog.open) dialog.showModal()
    if (!isOpen && dialog.open) dialog.close()
  }, [isOpen])

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

  const onClose = () => {
    setOpen(null)
    const index = returnTo.current
    if (index !== null) triggers.current[index]?.focus()
  }

  const onKeyDown = (event: KeyboardEvent<HTMLDialogElement>) => {
    if (event.key === 'ArrowRight') {
      event.preventDefault()
      step(1)
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault()
      step(-1)
    }
  }

  const current = open === null ? null : images[open]

  return (
    <>
      <div className="flex flex-col gap-16 md:gap-20">
        {bands.map((band) =>
          band === 'wide'
            ? wide.length > 0 && (
                <ul
                  key="wide"
                  className="grid gap-x-6 gap-y-12 md:grid-cols-2"
                  aria-label={`${productName} wide images`}
                >
                  {wide.map((item, i) => (
                    <li
                      key={item.image.src}
                      className={cx(
                        wide.length % 2 === 1 && i === 0 && 'md:col-span-2',
                      )}
                    >
                      <Figure
                        item={item}
                        sizes={
                          wide.length % 2 === 1 && i === 0
                            ? '(min-width: 1440px) 1320px, 92vw'
                            : '(min-width: 1440px) 650px, (min-width: 768px) 46vw, 92vw'
                        }
                        onOpen={show}
                        triggerRef={(el) => (triggers.current[item.index] = el)}
                      />
                    </li>
                  ))}
                </ul>
              )
            : tall.length > 0 && (
                <ul
                  key="tall"
                  className={styles.tall}
                  aria-label={`${productName} tall images`}
                >
                  {tall.map((item) => (
                    <li
                      key={item.image.src}
                      className={styles[`tall-${item.image.device}`]}
                    >
                      <Figure
                        item={item}
                        sizes="(min-width: 768px) 360px, 46vw"
                        onOpen={show}
                        triggerRef={(el) => (triggers.current[item.index] = el)}
                      />
                    </li>
                  ))}
                </ul>
              ),
        )}
      </div>

      <dialog
        ref={dialogRef}
        aria-labelledby={titleId}
        className={styles.viewer}
        onClose={onClose}
        onKeyDown={onKeyDown}
        onClick={(event) => {
          if (event.target === event.currentTarget) setOpen(null)
        }}
      >
        {current && open !== null && (
          <div className={styles.viewerBody}>
            <div className="flex items-center justify-between gap-4">
              <p className="text-small tabular-nums text-sideband-text-secondary">
                <span id={titleId} className="text-sideband-text">
                  {KIND_LABEL[current.kind]} {open + 1} of {images.length}
                </span>
                <span className="sr-only">, {productName}</span>
              </p>
              <ViewerButton label="Close viewer" onClick={() => setOpen(null)}>
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
                sizes="100vw"
                className={styles.stageImage}
              />
            </div>

            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between md:gap-10">
              <div className="flex max-w-prose flex-col gap-1">
                <p className="text-small text-sideband-text">{current.alt}</p>
                {current.credit && <ImageCredit credit={current.credit} />}
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
    </>
  )
}

function Figure({
  item,
  sizes,
  onOpen,
  triggerRef,
}: {
  item: Item
  sizes: string
  onOpen: (index: number) => void
  triggerRef: (el: HTMLButtonElement | null) => void
}) {
  const { image, index } = item
  return (
    <figure className="flex flex-col gap-4">
      <button
        ref={triggerRef}
        type="button"
        onClick={() => onOpen(index)}
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
        {image.credit && <ImageCredit credit={image.credit} />}
      </figcaption>
    </figure>
  )
}

function ViewerButton({
  label,
  onClick,
  children,
}: {
  label: string
  onClick: () => void
  children: ReactNode
}) {
  return (
    <button
      type="button"
      aria-label={label}
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
