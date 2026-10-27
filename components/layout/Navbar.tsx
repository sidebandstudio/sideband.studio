'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
} from 'react'
import Button from '@/components/ui/Button'
import { GitHubIcon } from '@/components/ui/Icons'
import { cx } from '@/components/ui/cx'

const links = [
  { href: '/products', label: 'Products' },
  { href: '/engineers', label: 'Engineers' },
  { href: '/about', label: 'About' },
]

/** Section links stay lit on their detail pages, e.g. /products/<id>. */
function isActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`)
}

const FOCUSABLE = 'a[href], button:not([disabled])'

export default function Navbar() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const barRef = useRef<HTMLElement>(null)
  const toggleRef = useRef<HTMLButtonElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  const close = useCallback((returnFocus: boolean) => {
    setOpen(false)
    if (returnFocus) toggleRef.current?.focus()
  }, [])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // A route change closes the menu.
  useEffect(() => {
    setOpen(false)
  }, [pathname])

  // While open: lock page scroll, move focus into the menu, keep Tab inside
  // the bar and menu, close on Escape or when the viewport grows past mobile.
  useEffect(() => {
    if (!open) return
    const root = document.documentElement
    const prevOverflow = root.style.overflow
    root.style.overflow = 'hidden'
    menuRef.current?.querySelector<HTMLElement>(FOCUSABLE)?.focus()

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        close(true)
        return
      }
      if (e.key !== 'Tab') return
      const items = [barRef.current, menuRef.current].flatMap((el, i) =>
        Array.from(
          el?.querySelectorAll<HTMLElement>(
            i === 0 ? '[data-nav-mobile]' : FOCUSABLE,
          ) ?? [],
        ),
      )
      if (items.length === 0) return
      const first = items[0]
      const last = items[items.length - 1]
      const index = items.indexOf(document.activeElement as HTMLElement)
      if (e.shiftKey && (index <= 0 || index === -1)) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && (index === items.length - 1 || index === -1)) {
        e.preventDefault()
        first.focus()
      }
    }
    const mq = window.matchMedia('(min-width: 768px)')
    const onWide = () => mq.matches && close(false)

    document.addEventListener('keydown', onKey)
    mq.addEventListener('change', onWide)
    return () => {
      root.style.overflow = prevOverflow
      document.removeEventListener('keydown', onKey)
      mq.removeEventListener('change', onWide)
    }
  }, [open, close])

  return (
    <header
      ref={barRef}
      className={cx(
        'fixed inset-x-0 top-0 z-[100] transition-colors duration-ui ease-standard',
        // No backdrop-filter while open: it would make the bar the containing
        // block of the fixed menu panel.
        open
          ? 'bg-sideband-black'
          : scrolled
            ? 'bg-sideband-black/75 backdrop-blur-xl backdrop-saturate-150'
            : 'bg-transparent',
      )}
    >
      <nav
        aria-label="Main"
        className="mx-auto flex h-nav w-full max-w-container items-center justify-between gap-6 px-gutter"
      >
        <Link
          href="/"
          data-nav-mobile
          aria-label="Sideband home"
          className="-ml-1 flex items-center gap-2.5 rounded-full py-1 pl-1 pr-2 text-sideband-text"
        >
          <Image
            src="/assets/sideband/icon.png"
            alt=""
            width={128}
            height={128}
            priority
            className="h-6 w-6"
          />
          <span className="text-[1.0625rem] font-semibold leading-none tracking-[-0.03em]">
            Sideband
          </span>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {links.map((link) => {
            const active = isActive(pathname, link.href)
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? 'page' : undefined}
                className={cx(
                  'rounded-full px-3.5 py-2 text-small font-medium transition-colors duration-hover ease-standard',
                  active
                    ? 'bg-white/[0.07] text-sideband-text'
                    : 'text-sideband-text-secondary hover:text-sideband-text',
                )}
              >
                {link.label}
              </Link>
            )
          })}
        </div>

        <div className="flex items-center gap-2">
          <Button href="/contact" className="hidden md:inline-flex">
            Contact
          </Button>
          <button
            ref={toggleRef}
            type="button"
            data-nav-mobile
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? 'Close menu' : 'Open menu'}
            className="-mr-2 grid h-11 w-11 place-items-center rounded-full transition-colors duration-hover hover:bg-white/[0.06] md:hidden"
          >
            <span aria-hidden="true" className="relative block h-3 w-5">
              <span
                className={cx(
                  'absolute left-0 h-[1.5px] w-5 rounded-full bg-sideband-text transition-transform duration-ui ease-out',
                  open ? 'top-[5px] rotate-45' : 'top-0',
                )}
              />
              <span
                className={cx(
                  'absolute left-0 h-[1.5px] w-5 rounded-full bg-sideband-text transition-transform duration-ui ease-out',
                  open ? 'top-[5px] -rotate-45' : 'top-[10px]',
                )}
              />
            </span>
          </button>
        </div>
      </nav>

      <div
        ref={menuRef}
        id="mobile-menu"
        hidden={!open}
        className="fixed inset-x-0 bottom-0 top-nav overflow-y-auto bg-sideband-black md:hidden"
      >
        <nav
          aria-label="Mobile"
          className="flex min-h-full flex-col px-gutter pb-[max(2rem,env(safe-area-inset-bottom))] pt-6"
        >
          <ul className="flex flex-col">
            {links.map((link, i) => {
              const active = isActive(pathname, link.href)
              return (
                <li
                  key={link.href}
                  data-rise
                  style={{ '--d': `${i * 50}ms` } as CSSProperties}
                >
                  <Link
                    href={link.href}
                    aria-current={active ? 'page' : undefined}
                    onClick={() => setOpen(false)}
                    className={cx(
                      'flex items-center justify-between py-3 text-head transition-colors duration-hover',
                      active
                        ? 'text-sideband-text'
                        : 'text-sideband-text-secondary hover:text-sideband-text',
                    )}
                  >
                    {link.label}
                    {active && (
                      <span
                        aria-hidden="true"
                        className="h-2 w-2 rounded-full bg-sideband-accent"
                      />
                    )}
                  </Link>
                </li>
              )
            })}
          </ul>
          <div
            data-rise
            style={{ '--d': `${links.length * 50}ms` } as CSSProperties}
            className="mt-auto flex flex-col gap-5 pt-10"
          >
            <Button
              href="/contact"
              size="lg"
              onClick={() => setOpen(false)}
              className="w-full"
            >
              Contact
            </Button>
            <div className="flex items-center justify-between text-small text-sideband-text-secondary">
              <a
                href="mailto:hello@sideband.studio"
                className="py-2 transition-colors hover:text-sideband-text"
              >
                hello@sideband.studio
              </a>
              <a
                href="https://github.com/sidebandstudio"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 py-2 transition-colors hover:text-sideband-text"
              >
                <GitHubIcon size={15} />
                GitHub
              </a>
            </div>
          </div>
        </nav>
      </div>
    </header>
  )
}
