import type { ReactNode } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import Container from '@/components/ui/Container'
import { GitHubIcon } from '@/components/ui/Icons'
import { engineers } from '@/lib/engineers'
import { productsByRank } from '@/lib/products'

interface FooterLink {
  href: string
  label: ReactNode
  external?: boolean
}

const columns: { title: string; links: FooterLink[] }[] = [
  {
    title: 'Products',
    // In rank order, as on the products page. A server component, so the
    // GitHub snapshot the ranking reads stays out of the browser.
    links: productsByRank().map((p) => ({
      href: `/products/${p.id}`,
      label: p.name,
    })),
  },
  {
    title: 'Studio',
    links: [
      { href: '/products', label: 'All products' },
      { href: '/engineers', label: 'Engineers' },
      { href: '/about', label: 'About' },
      { href: '/contact', label: 'Contact' },
    ],
  },
  {
    title: 'Engineers',
    links: engineers.map((e) => ({
      href: `/engineers/${e.id}`,
      label: e.name,
    })),
  },
  {
    title: 'Contact',
    links: [
      // May break after the @: on a 320px phone the address is wider than
      // its column. A span, so the break is not a flex item of the link.
      {
        href: 'mailto:hello@sideband.studio',
        label: (
          <span>
            hello@
            <wbr />
            sideband.studio
          </span>
        ),
      },
      {
        href: 'https://github.com/sidebandstudio',
        label: 'GitHub',
        external: true,
      },
    ],
  },
]

const LINK =
  'inline-flex items-center gap-2 py-1 text-small text-sideband-text-secondary transition-colors duration-hover ease-standard hover:text-sideband-text'

export default function Footer() {
  return (
    <footer className="bg-sideband-surface pb-[max(2rem,env(safe-area-inset-bottom))] pt-20 md:pt-24">
      <Container>
        <div className="grid grid-cols-2 gap-x-8 gap-y-12 lg:grid-cols-[1.4fr_repeat(4,1fr)]">
          <div className="col-span-2 flex flex-col gap-4 lg:col-span-1">
            <Link
              href="/"
              aria-label="Sideband home"
              className="flex w-fit items-center gap-2.5 text-sideband-text"
            >
              <Image
                src="/assets/sideband/icon.png"
                alt=""
                width={128}
                height={128}
                className="h-7 w-7"
              />
              <span className="text-[1.25rem] font-semibold leading-none tracking-[-0.03em]">
                Sideband
              </span>
            </Link>
            <p className="max-w-[18rem] text-small text-sideband-text-secondary">
              An independent software studio in Boston, MA.
            </p>
          </div>

          {columns.map((col) => (
            <nav key={col.title} aria-label={col.title}>
              <h2 className="mb-3 text-small font-medium text-sideband-text">
                {col.title}
              </h2>
              <ul className="flex flex-col">
                {col.links.map((l) => (
                  <li key={l.href}>
                    {l.href.startsWith('/') ? (
                      <Link href={l.href} className={LINK}>
                        {l.label}
                      </Link>
                    ) : (
                      <a
                        href={l.href}
                        className={LINK}
                        {...(l.external
                          ? { target: '_blank', rel: 'noopener noreferrer' }
                          : {})}
                      >
                        {l.external && <GitHubIcon size={14} />}
                        {l.label}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <p className="mt-16 text-small text-sideband-muted md:mt-20">
          &copy; {new Date().getFullYear()} Sideband
        </p>
      </Container>
    </footer>
  )
}
