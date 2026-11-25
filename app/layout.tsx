import type { Metadata, Viewport } from 'next'
import '@fontsource-variable/hanken-grotesk'
import '@fontsource-variable/jetbrains-mono'
import '@/styles/globals.css'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { SITE_URL, STUDIO_IMAGE } from '@/lib/metadata'

// Defaults for pages that set none of their own (the not-found page). Every
// route sets its full metadata through pageMetadata() in lib/metadata.ts.
export const metadata: Metadata = {
  title: 'Sideband · Independent software studio',
  description:
    'Sideband is an independent software studio. We build the things we wished existed.',
  metadataBase: new URL(SITE_URL),
  openGraph: { siteName: 'Sideband', images: [STUDIO_IMAGE] },
  twitter: { card: 'summary', images: [STUDIO_IMAGE.url] },
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
    <html lang="en">
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
