import Image from 'next/image'
import type { ComponentType, CSSProperties } from 'react'
import { getProductById, type Product } from '@/lib/products'
import { cx } from '@/components/ui/cx'
import { scenesA } from './group-a'
import { scenesB } from './group-b'

/**
 * Product scenes: one hand-built, animated SVG per product, drawn in two
 * framings. The contract (sizes, colours, motion) is in DESIGN.md -> Product
 * scenes. Register a scene by adding it to `scenes` under its product id.
 */
export type SceneVariant = 'card' | 'hero'

export interface SceneProps {
  variant: SceneVariant
}

export type SceneMap = Partial<Record<string, ComponentType<SceneProps>>>

/** Scenes are drawn in two groups (group-a, group-b), each registering its own products. */
export const scenes: SceneMap = { ...scenesA, ...scenesB }

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
 * The product's icon on the stage's dot grid, with one short flat bar in the
 * product accent beneath it. No light, no glow: the icon carries the identity.
 * A product with no icon shows its name instead.
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
      <div className="bd-grid scene-grid absolute inset-0 -z-10" />
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-5 md:gap-6">
        {product.icon ? (
          <Image
            src={product.icon.src}
            alt=""
            width={256}
            height={256}
            className={cx(
              'rounded-[22%]',
              hero ? 'h-24 w-24 md:h-36 md:w-36' : 'h-20 w-20',
            )}
          />
        ) : (
          <span className="text-lead font-medium text-sideband-text">
            {product.name}
          </span>
        )}
        <span
          className={cx(
            'block h-1 rounded-full bg-product',
            hero ? 'w-12 md:w-16' : 'w-10',
          )}
        />
      </div>
    </>
  )
}
