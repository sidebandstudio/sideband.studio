'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const navLinks = [
  { href: '/products', label: 'Products' },
  { href: '/about', label: 'About' },
  { href: '/careers', label: 'Careers' },
  { href: '/contact', label: 'Contact' },
]

export default function Navbar() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  return (
    <>
      <nav
        className={`fixed left-0 right-0 top-0 z-[100] transition-all duration-300 ${
          scrolled
            ? 'border-b border-eternal-border bg-eternal-black/85 backdrop-blur-md'
            : 'border-b border-transparent bg-transparent'
        }`}
      >
        <div className="inner flex h-[60px] items-center justify-between">
          <Link href="/" className="flex items-center gap-[10px]">
            <Image
              src="/assets/EternalReverse/EternalReverseMiniLogo.png"
              alt="ER"
              width={24}
              height={24}
              className="h-6 w-auto"
            />
            <span className="hidden text-[10px] uppercase tracking-[0.15em] text-eternal-text-secondary sm:inline">
              Eternal Reverse
            </span>
          </Link>

          <div className="hidden items-center gap-8 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`relative font-mono text-[13px] uppercase tracking-wider transition-colors duration-200 ${
                  pathname === link.href ||
                  (link.href === '/products' && pathname.startsWith('/products/'))
                    ? 'text-eternal-accent'
                    : 'text-eternal-text-secondary hover:text-eternal-text'
                }`}
              >
                {link.label}
                {(pathname === link.href ||
                  (link.href === '/products' &&
                    pathname.startsWith('/products/'))) && (
                  <motion.div
                    layoutId="nav-underline"
                    className="absolute -bottom-1 left-0 right-0 h-[2px] bg-eternal-accent"
                    transition={{ duration: 0.2 }}
                  />
                )}
              </Link>
            ))}
            <a
              href="https://github.com/whoisaldo"
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-[13px] uppercase tracking-wider text-eternal-accent transition-colors duration-200 hover:text-eternal-text"
            >
              [ GitHub &rarr; ]
            </a>
          </div>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex flex-col gap-1.5 md:hidden"
            aria-label="Toggle menu"
          >
            <span
              className={`block h-[1.5px] w-5 bg-eternal-text transition-all duration-200 ${
                isOpen ? 'translate-y-[4.5px] rotate-45' : ''
              }`}
            />
            <span
              className={`block h-[1.5px] w-5 bg-eternal-text transition-all duration-200 ${
                isOpen ? 'opacity-0' : ''
              }`}
            />
            <span
              className={`block h-[1.5px] w-5 bg-eternal-text transition-all duration-200 ${
                isOpen ? '-translate-y-[4.5px] -rotate-45' : ''
              }`}
            />
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[99] flex flex-col items-center justify-center bg-eternal-black/98 md:hidden"
          >
            <div className="flex flex-col items-center gap-8">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{
                    delay: i * 0.05,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                >
                  <Link
                    href={link.href}
                    className={`font-display text-4xl transition-colors duration-200 ${
                      pathname === link.href
                        ? 'text-eternal-accent'
                        : 'text-eternal-text hover:text-eternal-accent'
                    }`}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
              <motion.a
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{
                  delay: navLinks.length * 0.05,
                  ease: [0.16, 1, 0.3, 1],
                }}
                href="https://github.com/whoisaldo"
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-sm uppercase tracking-wider text-eternal-accent"
              >
                [ GitHub &rarr; ]
              </motion.a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
