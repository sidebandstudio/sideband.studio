import Image from 'next/image'
import FadeUp from '@/components/animations/FadeUp'
import type { LifestyleImage } from '@/lib/engineers'

interface LifestyleGalleryProps {
  images: LifestyleImage[]
}

// Predefined span pattern to give a varied, editorial mosaic feel.
const spanPattern = [
  'col-span-2 row-span-2',
  'col-span-1 row-span-1',
  'col-span-1 row-span-1',
  'col-span-1 row-span-2',
  'col-span-1 row-span-1',
  'col-span-1 row-span-1',
  'col-span-2 row-span-1',
  'col-span-1 row-span-1',
]

export default function LifestyleGallery({ images }: LifestyleGalleryProps) {
  return (
    <div className="grid auto-rows-[160px] grid-cols-2 gap-3 md:auto-rows-[200px] md:grid-cols-4">
      {images.map((img, i) => {
        const span = spanPattern[i % spanPattern.length]
        return (
          <FadeUp key={img.src} delay={(i % 4) * 0.05} className={span}>
            <div className="group relative h-full w-full overflow-hidden border border-eternal-border bg-eternal-surface-2">
              <Image
                src={img.src}
                alt={img.alt}
                fill
                sizes="(min-width: 768px) 25vw, 50vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-eternal-black/80 via-transparent to-transparent opacity-90 transition-opacity duration-300 group-hover:opacity-70" />
              {img.caption && (
                <span className="absolute bottom-3 left-3 right-3 font-mono text-[9px] uppercase tracking-[0.22em] text-eternal-text">
                  {img.caption}
                </span>
              )}
            </div>
          </FadeUp>
        )
      })}
    </div>
  )
}
