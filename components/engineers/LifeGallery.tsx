import Image from 'next/image'
import Reveal from '@/components/ui/Reveal'
import type { LifestyleImage } from '@/lib/engineers'

/** Photos the person published of life away from work, each with its caption. */
export default function LifeGallery({
  images,
  sizes,
}: {
  images: LifestyleImage[]
  /** Real pixel size of each file, keyed by src. */
  sizes: Record<string, { width: number; height: number }>
}) {
  return (
    <ul className="columns-1 gap-6 sm:columns-2 lg:columns-3">
      {images.map((img, i) => {
        const size = sizes[img.src] ?? { width: 1400, height: 1050 }
        return (
          <Reveal
            as="li"
            key={img.src}
            delay={(i % 3) * 70}
            className="mb-6 break-inside-avoid"
          >
            <figure>
              <Image
                src={img.src}
                alt={img.alt}
                width={size.width}
                height={size.height}
                sizes="(min-width: 1024px) 440px, (min-width: 640px) 50vw, 100vw"
                className="block h-auto w-full rounded-panel bg-sideband-surface"
              />
              {img.caption && (
                <figcaption className="mt-3 text-small text-sideband-text-secondary">
                  {img.caption}
                </figcaption>
              )}
            </figure>
          </Reveal>
        )
      })}
    </ul>
  )
}
