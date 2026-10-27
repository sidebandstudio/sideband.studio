import Image from 'next/image'
import Link from 'next/link'

const links = [
  { href: '/products', label: 'Products' },
  { href: '/engineers', label: 'Engineers' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
]

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-sideband-border pb-8 pt-10 max-[820px]:pb-[max(32px,env(safe-area-inset-bottom))]">
      <div className="inner flex flex-wrap items-center justify-between gap-6 max-[820px]:flex-col max-[820px]:items-start max-[820px]:gap-7">
        <div className="flex items-center gap-2.5 text-[13px] text-sideband-muted">
          <Image
            src="/assets/sideband/icon.png"
            alt=""
            width={128}
            height={128}
            className="h-5 w-5 rounded-[4px]"
          />
          <span>
            &copy; {new Date().getFullYear()} Sideband &middot; Boston, MA
          </span>
        </div>
        <nav
          aria-label="Footer"
          className="flex flex-wrap justify-end gap-5 max-[820px]:grid max-[820px]:w-full max-[820px]:grid-cols-3 max-[820px]:justify-start max-[820px]:gap-x-5 max-[820px]:gap-y-3.5"
        >
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-[13px] text-sideband-muted transition-colors duration-200 hover:text-sideband-text"
            >
              {l.label}
            </Link>
          ))}
          <a
            href="https://github.com/sidebandstudio"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[13px] text-sideband-muted transition-colors duration-200 hover:text-sideband-text"
          >
            GitHub
          </a>
          <a
            href="mailto:hello@sideband.studio"
            className="text-[13px] text-sideband-muted transition-colors duration-200 hover:text-sideband-text"
          >
            hello@sideband.studio
          </a>
        </nav>
      </div>
    </footer>
  )
}
