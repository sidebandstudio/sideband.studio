import Image from 'next/image'
import type { ComponentType, CSSProperties } from 'react'
import { getProductById, type Product } from '@/lib/products'
import { cx } from '@/components/ui/cx'

/**
 * Product scenes: one hand-built, animated SVG per product, drawn in two
 * framings. The contract (sizes, colours, motion) is in DESIGN.md -> Product
 * scenes. Register a scene by adding it to `scenes` under its product id.
 */
export type SceneVariant = 'card' | 'hero'

export interface SceneProps {
  variant: SceneVariant
}

export const scenes: Partial<Record<string, ComponentType<SceneProps>>> = {}

/** Sets --product-accent for everything inside, read by `bg-product`, `bg-product-dim` and scenes. */
export function productAccentStyle(accent: string) {
  return { '--product-accent': accent } as CSSProperties
}

const FRAME: Record<SceneVariant, string> = {
  card: 'aspect-[4/3]',
  hero: 'aspect-[4/3] md:aspect-[16/10]',
}

interface ProductSceneProps {
  id: string
  variant: SceneVariant
  className?: string
}

/**
 * The stage a product scene plays on: a panel-radius surface at the variant's
 * aspect ratio with --product-accent set. Renders the registered scene, or a
 * still fallback built from the product's icon. Decorative: the page always
 * names the product in text next to it.
 */
export function ProductScene({ id, variant, className }: ProductSceneProps) {
  const product = getProductById(id)
  if (!product) return null
  const Scene = scenes[id]

  return (
    <div
      aria-hidden="true"
      style={productAccentStyle(product.accentColor)}
      className={cx(
        'relative isolate overflow-hidden rounded-panel bg-sideband-surface',
        FRAME[variant],
        className,
      )}
    >
      {Scene ? (
        <Scene variant={variant} />
      ) : (
        <SceneFallback product={product} variant={variant} />
      )}
    </div>
  )
}

/**
 * The product's icon under its own light, on the scene's dot grid. A product
 * with no icon shows its name instead.
 */
function SceneFallback({
  product,
  variant,
}: {
  product: Product
  variant: SceneVariant
}) {
  const hero = variant === 'hero'
  return (
    <>
      <div className="bd-grid absolute inset-0 -z-10 opacity-70" />
      <div className="scene-light absolute inset-0 -z-10" />
      <div className="absolute inset-0 grid place-items-center">
        {product.icon ? (
          <Image
            src={product.icon.src}
            alt=""
            width={256}
            height={256}
            className={cx(
              'rounded-[22%]',
              hero ? 'h-24 w-24 md:h-36 md:w-36' : 'h-16 w-16',
            )}
          />
        ) : (
          <span className="text-lead font-medium text-sideband-text">
            {product.name}
          </span>
        )}
      </div>
    </>
  )
}
