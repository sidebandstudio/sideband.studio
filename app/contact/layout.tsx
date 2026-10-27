import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact · Sideband',
  description:
    'Get in touch with the founding engineers of Sideband. We read every message.',
}

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
