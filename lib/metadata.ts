import type { Metadata } from 'next'

export const SITE_URL = 'https://sideband.studio'

/** The studio's Discord server, linked from the footer and the contact page. */
export const DISCORD_URL = 'https://discord.gg/zq3qqSdwgG'

export interface SocialImage {
  url: string
  width: number
  height: number
  alt: string
}

/** The studio icon (app/icon.png), for pages without a picture of their own. */
export const STUDIO_IMAGE: SocialImage = {
  url: '/icon.png',
  width: 256,
  height: 256,
  alt: 'The Sideband mark',
}

/**
 * Title, description, canonical URL, Open Graph and Twitter card for one page.
 * Next replaces a parent's openGraph and twitter wholesale rather than merging
 * them, so every page sets all of them here. Paths resolve against
 * metadataBase (SITE_URL) in app/layout.tsx.
 */
export function pageMetadata({
  title,
  description,
  path,
  socialTitle = title,
  image = STUDIO_IMAGE,
  type = 'website',
}: {
  title: string
  description: string
  path: string
  /** A different title for link previews, when the page title is a list. */
  socialTitle?: string
  image?: SocialImage
  type?: 'website' | 'profile'
}): Metadata {
  // A wide picture gets the large card. The square icon and portraits read
  // better small.
  const large = image.width / image.height > 1.2
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title: socialTitle,
      description,
      url: path,
      siteName: 'Sideband',
      type,
      images: [image],
    },
    twitter: {
      card: large ? 'summary_large_image' : 'summary',
      title: socialTitle,
      description,
      images: [image.url],
    },
  }
}
