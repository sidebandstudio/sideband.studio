import type { ProductImageCredit } from '@/lib/products'

/**
 * The attribution an image's source requires. `plain` drops the links, for
 * places that are already inside a link or hidden from assistive tech.
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
    <p
      className={className}
      style={{
        fontSize: 11,
        lineHeight: 1.6,
        color: 'var(--sideband-text-secondary)',
      }}
    >
      {credit.href && !plain ? (
        <a
          href={credit.href}
          target="_blank"
          rel="noopener noreferrer"
          className="underline underline-offset-2 hover:text-sideband-text"
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
              className="underline underline-offset-2 hover:text-sideband-text"
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
