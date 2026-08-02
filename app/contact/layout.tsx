import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact — Eternal Reverse',
  description:
    'Get in touch with the founders of Eternal Reverse. We read every message.',
}

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
