import type { CSSProperties } from 'react'

/** Sets --product-accent for everything inside, read by `bg-product`, `text-product` and `bg-product-dim`. */
export function productAccentStyle(accent: string) {
  return { '--product-accent': accent } as CSSProperties
}
