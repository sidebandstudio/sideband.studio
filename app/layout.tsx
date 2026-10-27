import type { Metadata, Viewport } from 'next'
import { Hanken_Grotesk, JetBrains_Mono } from 'next/font/google'
import '@/styles/globals.css'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'

// One family for the whole site. next/font downloads it at build time and
// serves it from our own origin. See DESIGN.md -> Type.
const sans = Hanken_Grotesk({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
})

// Only for real code and for text inside product interface fragments.
const mono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Sideband · Independent software studio',
  description:
    'Sideband is an independent software studio. We build the things we wished existed.',
  metadataBase: new URL('https://sideband.studio'),
  openGraph: {
    title: 'Sideband · Independent software studio',
    description:
      'Sideband is an independent software studio. We build the things we wished existed.',
    images: ['/icon.png'],
  },
  twitter: {
    card: 'summary',
    title: 'Sideband · Independent software studio',
    description:
      'Sideband is an independent software studio. We build the things we wished existed.',
    images: ['/icon.png'],
  },
}

export const viewport: Viewport = {
  themeColor: '#0b0b0d',
  colorScheme: 'dark',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${sans.variable} ${mono.variable}`}>
      <body className="flex min-h-screen flex-col bg-sideband-black font-sans text-body text-sideband-text antialiased">
        <a
          href="#main"
          className="fixed left-4 top-3 z-[200] -translate-y-[200%] rounded-full bg-sideband-text px-4 py-2 text-small font-medium text-sideband-black transition-transform duration-ui ease-out focus-visible:translate-y-0"
        >
          Skip to content
        </a>
        <Navbar />
        <main id="main" tabIndex={-1} className="flex-1 outline-none">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}
