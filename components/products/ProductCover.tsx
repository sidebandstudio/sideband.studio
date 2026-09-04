import Image from 'next/image'
import type { CoverShot, Product } from '@/lib/products'

/**
 * A product cover composed from the product's own screenshots: the primary
 * screen fills the card as a window, and a phone, tablet, or terminal sits
 * over its corner. Fills whatever box it is placed in, so the parent sets the
 * aspect ratio.
 */

const SIZES = '(min-width: 1024px) 45vw, 90vw'

function Chrome({ hostname }: { hostname?: string }) {
  return (
    <div className="flex h-[7%] min-h-[18px] items-center gap-1 border-b border-white/[0.06] bg-[#141221] px-[3%]">
      <i className="block h-[6px] w-[6px] rounded-full bg-white/[0.12]" />
      <i className="block h-[6px] w-[6px] rounded-full bg-white/[0.12]" />
      <i className="block h-[6px] w-[6px] rounded-full bg-white/[0.12]" />
      {hostname && (
        <span className="ml-2 hidden rounded-[4px] bg-white/[0.05] px-2 py-[2px] font-mono text-[10px] leading-none text-sideband-muted min-[900px]:inline-block">
          {hostname}
        </span>
      )}
    </div>
  )
}

function Primary({ shot, hostname }: { shot: CoverShot; hostname?: string }) {
  if (shot.kind === 'card') {
    return (
      <div className="absolute left-[7%] top-[9%] w-[62%] overflow-hidden rounded-[10px] border border-white/[0.09] bg-[#1a1a1e] shadow-[0_24px_60px_-20px_rgba(0,0,0,0.8)]">
        <div className="relative aspect-[3/2]">
          <Image
            src={shot.src}
            alt={shot.alt}
            fill
            sizes={SIZES}
            className="object-cover"
          />
        </div>
      </div>
    )
  }
  return (
    <div className="absolute left-[6%] top-[9%] w-[100%] overflow-hidden rounded-[10px] border border-white/[0.09] bg-[#0d0b1a] shadow-[0_24px_60px_-20px_rgba(0,0,0,0.8)]">
      <Chrome hostname={hostname} />
      <div className="relative aspect-[16/10]">
        <Image
          src={shot.src}
          alt={shot.alt}
          fill
          sizes={SIZES}
          className="object-cover object-left-top"
        />
      </div>
    </div>
  )
}

function Secondary({ shot }: { shot: CoverShot }) {
  if (shot.kind === 'phone') {
    return (
      <div className="absolute -bottom-[10%] right-[5%] w-[24%] overflow-hidden rounded-[12%/6%] border-[3px] border-[#2c2c2c] bg-[#0b0b0b] shadow-[0_24px_60px_-16px_rgba(0,0,0,0.9)] min-[900px]:border-[5px]">
        <div className="relative aspect-[9/19]">
          <Image
            src={shot.src}
            alt={shot.alt}
            fill
            sizes="20vw"
            className="object-cover object-top"
          />
        </div>
      </div>
    )
  }
  if (shot.kind === 'tablet') {
    return (
      <div className="absolute -bottom-[14%] right-[4%] w-[36%] overflow-hidden rounded-[6%/4.5%] border-[3px] border-[#2c2c2c] bg-[#0b0b0b] shadow-[0_24px_60px_-16px_rgba(0,0,0,0.9)] min-[900px]:border-[5px]">
        <div className="relative aspect-[3/4]">
          <Image
            src={shot.src}
            alt={shot.alt}
            fill
            sizes="30vw"
            className="object-cover object-top"
          />
        </div>
      </div>
    )
  }
  // terminal
  return (
    <div className="absolute -bottom-[6%] -right-[3%] w-[58%] overflow-hidden rounded-[10px] border border-white/[0.09] bg-[#0a0913] shadow-[0_24px_60px_-16px_rgba(0,0,0,0.9)]">
      <Chrome />
      <div className="relative aspect-[16/10]">
        <Image
          src={shot.src}
          alt={shot.alt}
          fill
          sizes="35vw"
          className="object-cover object-left-top"
        />
      </div>
    </div>
  )
}

export default function ProductCover({ product }: { product: Product }) {
  // Only custom domains earn a spot in the chrome. GitHub Pages hosts read as
  // unfinished next to the product's own name.
  const host = product.url ? new URL(product.url).hostname : ''
  const hostname = host && !host.endsWith('github.io') ? host : undefined
  return (
    <div className="absolute inset-0 overflow-hidden bg-sideband-surface">
      {/* A little of the brand light behind the screens. */}
      <div
        aria-hidden
        className="absolute -right-[10%] -top-[30%] h-[80%] w-[60%] rounded-full bg-sideband-accent opacity-[0.12] blur-3xl"
      />
      <Primary shot={product.cover.primary} hostname={hostname} />
      {product.cover.secondary && <Secondary shot={product.cover.secondary} />}
    </div>
  )
}
