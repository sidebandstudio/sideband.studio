import type { ProductImageCredit } from '@/lib/products'
import { cx } from '@/components/ui/cx'

const LINK =
  'underline decoration-sideband-muted/60 underline-offset-[3px] transition-colors duration-hover ease-standard hover:text-sideband-text hover:decoration-sideband-text'

/**
 * The attribution an image's source requires: its text, and the license when
 * it has one, each linked when the data has a link. `plain` drops the links,
 * for places that are already inside a link or hidden from assistive tech.
 */
export default function ImageCredit({
  credit,
  className,
  plain = false,
}: {
  credit: ProductImageCredit
  className?: string
  plain?: boolean
}) {
  return (
    <p className={cx('text-small text-sideband-muted', className)}>
      {credit.href && !plain ? (
        <a
          href={credit.href}
          target="_blank"
          rel="noopener noreferrer"
          className={LINK}
        >
          {credit.text}
        </a>
      ) : (
        credit.text
      )}
      {credit.license && (
        <>
          {', '}
          {credit.licenseHref && !plain ? (
            <a
              href={credit.licenseHref}
              target="_blank"
              rel="noopener noreferrer"
              className={LINK}
            >
              {credit.license}
            </a>
          ) : (
            credit.license
          )}
        </>
      )}
    </p>
  )
}
