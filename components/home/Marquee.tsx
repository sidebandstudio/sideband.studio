import Image from 'next/image'
import Link from 'next/link'
import { products } from '@/lib/products'

export default function Marquee() {
  const items = [...products, ...products]
  return (
    <div
      className="marquee overflow-hidden border-y border-sideband-border py-5 [mask-image:linear-gradient(to_right,transparent,#000_12%,#000_88%,transparent)]"
      aria-label="Products"
    >
      <div className="marquee-track flex w-max items-center gap-12 pr-12">
        {items.map((p, i) => (
          <Link
            key={`${p.id}-${i}`}
            href={`/products/${p.id}`}
            aria-hidden={i >= products.length}
            tabIndex={i >= products.length ? -1 : undefined}
            className="group flex items-center gap-3.5 whitespace-nowrap"
          >
            <Image
              src={p.icon}
              alt=""
              width={72}
              height={72}
              className="h-9 w-9 rounded-[10px] border border-white/[0.08] transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-110"
            />
            <span className="text-[15px] font-medium tracking-[-0.01em] text-sideband-text-secondary transition-colors duration-200 group-hover:text-sideband-text">
              {p.name}
            </span>
            <span className="font-mono text-[10.5px] uppercase tracking-[0.12em] text-sideband-muted">
              {p.status === 'LIVE' ? 'Live' : 'In dev'}
            </span>
          </Link>
        ))}
      </div>
    </div>
  )
}
