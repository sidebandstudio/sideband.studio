import Image from 'next/image'
import type { ProductDevice } from '@/lib/products'
import { cx } from '@/components/ui/cx'
import styles from './DeviceFrame.module.css'

interface DeviceFrameProps {
  src: string
  alt: string
  width: number
  height: number
  device: ProductDevice
  /** next/image `sizes` for the width the frame is laid out at. */
  sizes: string
  priority?: boolean
  className?: string
}

/**
 * A product image in the hardware it was captured on: a display bezel for a
 * desktop window or page, a phone or an iPad outline, or no frame for artwork
 * and photos. The image keeps its real proportions.
 */
export default function DeviceFrame({
  src,
  alt,
  width,
  height,
  device,
  sizes,
  priority = false,
  className,
}: DeviceFrameProps) {
  return (
    // Never shown past the image's natural size, so the large viewer can
    // always show it at least as large as the page does.
    <div
      className={cx(styles.container, className)}
      style={{ maxWidth: width }}
    >
      <div className={cx(styles.frame, styles[device])}>
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          sizes={sizes}
          priority={priority}
        />
      </div>
    </div>
  )
}
