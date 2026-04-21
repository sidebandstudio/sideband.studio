import type { Metadata } from 'next'
import { Instrument_Serif, DM_Mono } from 'next/font/google'
import '@/styles/globals.css'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import CustomCursor from '@/components/layout/CustomCursor'
import NoiseOverlay from '@/components/ui/NoiseOverlay'

const instrumentSerif = Instrument_Serif({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-instrument-serif',
  display: 'swap',
})

const dmMono = DM_Mono({
  weight: ['300', '400', '500'],
  subsets: ['latin'],
  variable: '--font-dm-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Eternal Reverse — Built to last. Shipped to matter.',
  description:
    'Indie software studio shipping technically ambitious products.',
  metadataBase: new URL('https://eternalreverse.com'),
  openGraph: {
    title: 'Eternal Reverse — Built to last. Shipped to matter.',
    description:
      'Indie software studio shipping technically ambitious products.',
    images: ['/og.png'],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      className={`${instrumentSerif.variable} ${dmMono.variable}`}
    >
      <body className="min-h-screen bg-eternal-black font-mono text-eternal-text antialiased">
        <NoiseOverlay />
        <CustomCursor />
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  )
}
