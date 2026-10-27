import type { ProductImage } from '@/lib/products'
import { isWideImage } from '@/lib/products-view'
import { cx } from '@/components/ui/cx'
import { ViewableImage } from './ImageViewer'
import styles from './ImageGrid.module.css'

/**
 * A set of a product's images, by index: landscape ones two to a row (the
 * first across the full width when their number is odd), phones, portraits
 * and squares side by side at close to hardware size. The band holding the
 * first image comes first.
 */
export default function ImageGrid({
  images,
  indexes,
  label,
}: {
  images: ProductImage[]
  indexes: number[]
  label: string
}) {
  const wide = indexes.filter((i) => isWideImage(images[i]))
  const tall = indexes.filter((i) => !isWideImage(images[i]))
  const bands = isWideImage(images[indexes[0]])
    ? (['wide', 'tall'] as const)
    : (['tall', 'wide'] as const)

  return (
    <div className="flex flex-col gap-16 md:gap-20">
      {bands.map((band) =>
        band === 'wide'
          ? wide.length > 0 && (
              <ul
                key="wide"
                className="grid gap-x-6 gap-y-12 md:grid-cols-2"
                aria-label={`${label}, landscape`}
              >
                {wide.map((index, i) => {
                  const full = wide.length % 2 === 1 && i === 0
                  return (
                    <li key={index} className={cx(full && 'md:col-span-2')}>
                      <ViewableImage
                        index={index}
                        sizes={
                          full
                            ? '(min-width: 1440px) 1320px, 92vw'
                            : '(min-width: 1440px) 650px, (min-width: 768px) 46vw, 92vw'
                        }
                      />
                    </li>
                  )
                })}
              </ul>
            )
          : tall.length > 0 && (
              <ul
                key="tall"
                className={styles.tall}
                aria-label={`${label}, portrait`}
              >
                {tall.map((index) => (
                  <li
                    key={index}
                    className={styles[`tall-${images[index].device}`]}
                  >
                    <ViewableImage
                      index={index}
                      sizes="(min-width: 768px) 400px, 46vw"
                    />
                  </li>
                ))}
              </ul>
            ),
      )}
    </div>
  )
}
