import type { Metadata } from 'next'
import { DM_Sans, JetBrains_Mono } from 'next/font/google'
import '@/styles/globals.css'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import CustomCursor from '@/components/layout/CustomCursor'
import NoiseOverlay from '@/components/ui/NoiseOverlay'

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-dm-sans',
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-jetbrains-mono',
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
    images: [
      {
        url: '/assets/EternalReverse/EternalReverse.png',
        width: 1882,
        height: 778,
        alt: 'Eternal Reverse',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Eternal Reverse — Built to last. Shipped to matter.',
    description:
      'Indie software studio shipping technically ambitious products.',
    images: ['/assets/EternalReverse/EternalReverse.png'],
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
      className={`${dmSans.variable} ${jetbrainsMono.variable}`}
    >
      <body className="min-h-screen bg-eternal-black font-sans text-eternal-text antialiased">
        <NoiseOverlay />
        <CustomCursor />
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  )
}
