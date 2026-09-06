import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRightIcon, CheckIcon } from '@/components/ui/Icons'
import { products, type ProductStatus } from '@/lib/products'

const STATUS: Record<ProductStatus, { label: string; dot: string }> = {
  LIVE: { label: 'Live', dot: 'bg-sideband-ok' },
  'IN DEVELOPMENT': { label: 'In development', dot: 'bg-sideband-warn' },
  'COMING SOON': { label: 'Coming soon', dot: 'bg-sideband-muted' },
}

const LIVE = products.filter((p) => p.status === 'LIVE').length
const DEV = products.filter((p) => p.status === 'IN DEVELOPMENT').length
const OPEN = products.filter((p) => p.github).length

export default function ProductGrid() {
  return (
    <section id="products" className="sec">
      <div className="inner">
        <div className="section-head">
          <span className="eyebrow">Products</span>
          <h2 className="display text-balance">What we build</h2>
          <p className="text-pretty">
            Six products across desktop, browser, mobile, and full-stack. Each
            one started as something we wanted for ourselves.
          </p>
        </div>

        <div className="product-grid">
          {products.map((p) => (
            <Link
              key={p.id}
              href={`/products/${p.id}`}
              className="product-cell group"
            >
              <div className="flex items-center gap-3">
                <Image
                  src={p.icon}
                  alt=""
                  width={56}
                  height={56}
                  className="h-7 w-7 shrink-0 rounded-[7px]"
                />
                <span className="min-w-0 flex-1 truncate text-[15px] font-medium tracking-[-0.01em] text-sideband-text">
                  {p.name}
                </span>
                <span className="inline-flex shrink-0 items-center gap-1.5 font-mono text-[10.5px] uppercase tracking-[0.1em] text-sideband-muted">
                  <i
                    className={`block h-1.5 w-1.5 rounded-full ${STATUS[p.status].dot}`}
                  />
                  {STATUS[p.status].label}
                </span>
              </div>
              <p className="text-pretty text-[14px] leading-[1.5] tracking-[-0.003em] text-sideband-text-secondary">
                {p.tagline}
              </p>
              <div className="mt-auto flex items-center justify-between gap-3 pt-1 font-mono text-[11px] text-sideband-muted">
                <span className="truncate">
                  {p.tags.slice(0, 3).join(' · ')}
                </span>
                <ArrowUpRightIcon className="product-arrow shrink-0 text-sideband-text-secondary" />
              </div>
            </Link>
          ))}
        </div>

        <div className="grid-footer">
          <span className="grid-footer-item">
            <CheckIcon /> {LIVE} live
          </span>
          <span className="grid-footer-item">
            <CheckIcon /> {DEV} in active development
          </span>
          <span className="grid-footer-item">
            <CheckIcon /> {OPEN} with public source
          </span>
          <Link
            href="/products"
            className="group ml-auto inline-flex items-center gap-1.5 font-medium text-sideband-text-secondary transition-colors duration-[180ms] hover:text-sideband-text"
          >
            All products
            <ArrowUpRightIcon className="opacity-60 transition-[transform,opacity] duration-[180ms] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100" />
          </Link>
        </div>
      </div>
    </section>
  )
}
