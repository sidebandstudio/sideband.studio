'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useState, useEffect, type CSSProperties } from 'react'
import { GitHubIcon } from '@/components/ui/Icons'

const navLinks = [
  { href: '/products', label: 'Products' },
  { href: '/engineers', label: 'Engineers' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
]

/** Section links stay lit on their detail pages, e.g. /products/<id>. */
function isActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`)
}

const delay = (ms: number) => ({ '--d': `${ms}ms` }) as CSSProperties

export default function Navbar() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  return (
    <>
      <nav
        className={`fixed left-0 right-0 top-0 z-[100] border-b bg-sideband-black/75 backdrop-blur-[18px] transition-colors duration-300 ${
          scrolled || isOpen ? 'border-sideband-border' : 'border-transparent'
        }`}
      >
        <div className="inner flex h-[64px] items-center justify-between gap-6">
          <Link
            href="/"
            className="flex items-center gap-2.5 text-sideband-text transition-colors duration-200 hover:text-white"
            aria-label="Sideband home"
          >
            <Image
              src="/assets/sideband/icon.png"
              alt=""
              width={128}
              height={128}
              priority
              className="h-[22px] w-[22px] rounded-[6px]"
            />
            <span className="text-[16px] font-semibold leading-none tracking-[-0.025em]">
              Sideband
            </span>
          </Link>

          <div className="hidden items-center gap-1 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-lg px-3 py-1.5 text-[14px] font-medium tracking-[-0.01em] transition-colors duration-[180ms] hover:bg-white/[0.03] hover:text-sideband-text ${
                  isActive(pathname, link.href)
                    ? 'text-sideband-text'
                    : 'text-sideband-text-secondary'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <a
              href="https://github.com/sidebandstudio"
              target="_blank"
              rel="noopener noreferrer"
              className="ml-3 inline-flex h-9 items-center gap-2 whitespace-nowrap rounded-full border border-sideband-border bg-white/[0.02] px-3.5 text-[13px] font-medium tracking-[-0.01em] text-sideband-text-secondary transition-colors duration-[180ms] hover:border-sideband-border-strong hover:bg-white/[0.04] hover:text-sideband-text"
            >
              <GitHubIcon size={14} />
              GitHub
            </a>
          </div>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex h-9 w-9 flex-col items-center justify-center gap-1.5 md:hidden"
            aria-label="Toggle menu"
            aria-expanded={isOpen}
          >
            <span
              className={`block h-[1.5px] w-5 bg-sideband-text transition-transform duration-200 ${
                isOpen ? 'translate-y-[3.75px] rotate-45' : ''
              }`}
            />
            <span
              className={`block h-[1.5px] w-5 bg-sideband-text transition-transform duration-200 ${
                isOpen ? '-translate-y-[3.75px] -rotate-45' : ''
              }`}
            />
          </button>
        </div>
      </nav>

      {isOpen && (
        <div className="fixed inset-0 top-[64px] z-[99] flex flex-col bg-sideband-black/95 backdrop-blur-[18px] md:hidden">
          <div className="inner flex flex-col gap-1 pt-6">
            {navLinks.map((link, i) => (
              <Link
                key={link.href}
                href={link.href}
                data-rise
                style={delay(i * 50)}
                className={`display rounded-lg px-2 py-3 text-[32px] transition-colors duration-200 ${
                  isActive(pathname, link.href)
                    ? 'text-sideband-text'
                    : 'text-sideband-text-secondary hover:text-sideband-text'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <a
              href="https://github.com/sidebandstudio"
              target="_blank"
              rel="noopener noreferrer"
              data-rise
              style={delay(navLinks.length * 50)}
              className="mt-4 inline-flex items-center gap-2 px-2 text-[15px] font-medium text-sideband-text-secondary"
            >
              <GitHubIcon size={15} />
              GitHub
            </a>
          </div>
        </div>
      )}
    </>
  )
}
