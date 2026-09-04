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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${dmSans.variable} ${jetbrainsMono.variable}`}>
      <body className="min-h-screen bg-sideband-black font-sans text-sideband-text antialiased">
        <NoiseOverlay />
        <CustomCursor />
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  )
}
