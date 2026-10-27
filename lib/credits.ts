// Every attribution the site's media needs, gathered from the `credit` on
// product images and video cuts in lib/products.ts. The footer lists them
// under Credits. Server-only: lib/products.ts reads the GitHub snapshot.
import {
  products,
  type ProductImageCredit,
  type ProductImageKind,
} from '@/lib/products'

export interface CreditEntry {
  credit: ProductImageCredit
  /** Where it applies, one line per product, such as "Upflow2x: 4 artwork images and both product videos". */
  uses: string[]
}

const KIND: Record<ProductImageKind, [string, string]> = {
  screenshot: ['screenshot', 'screenshots'],
  artwork: ['artwork image', 'artwork images'],
  photo: ['photo', 'photos'],
}

function list(parts: string[]) {
  return parts.length < 2
    ? parts.join('')
    : `${parts.slice(0, -1).join(', ')} and ${parts.at(-1)}`
}

/** Each unique credit once, with the products and media it applies to. */
export function siteCredits(): CreditEntry[] {
  const entries = new Map<string, CreditEntry>()
  for (const product of products) {
    const found = new Map<
      string,
      { credit: ProductImageCredit; media: string[] }
    >()
    const add = (credit: ProductImageCredit | undefined, media: string) => {
      if (!credit) return
      const key = JSON.stringify([
        credit.text,
        credit.href,
        credit.license,
        credit.licenseHref,
      ])
      if (!found.has(key)) found.set(key, { credit, media: [] })
      found.get(key)!.media.push(media)
    }
    for (const image of product.images) add(image.credit, image.kind)
    add(product.video.hero.credit, 'hero')
    add(product.video.card.credit, 'card')

    for (const [key, { credit, media }] of Array.from(found)) {
      const parts: string[] = []
      for (const kind of Object.keys(KIND) as ProductImageKind[]) {
        const n = media.filter((m) => m === kind).length
        if (n) parts.push(`${n} ${KIND[kind][n > 1 ? 1 : 0]}`)
      }
      const hero = media.includes('hero')
      const card = media.includes('card')
      if (hero && card) parts.push('both product videos')
      else if (hero || card) parts.push(`the ${hero ? 'hero' : 'card'} video`)
      if (!entries.has(key)) entries.set(key, { credit, uses: [] })
      entries.get(key)!.uses.push(`${product.name}: ${list(parts)}`)
    }
  }
  return Array.from(entries.values())
}
