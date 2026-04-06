'use client'

import { motion } from 'framer-motion'
import { Product } from '@/lib/products'
import StatusBadge from '@/components/ui/StatusBadge'
import Tag from '@/components/ui/Tag'
import MediaPlaceholder from '@/components/ui/MediaPlaceholder'
import GlowButton from '@/components/ui/GlowButton'

interface ProductCardProps {
  product: Product
  index?: number
}

export default function ProductCard({ product, index = 0 }: ProductCardProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 24 }}
      transition={{
        duration: 0.5,
        delay: index * 0.1,
        ease: [0.16, 1, 0.3, 1],
      }}
      className="group flex flex-col rounded-lg border border-eternal-border bg-eternal-surface p-6 transition-all duration-200 hover:-translate-y-[2px]"
      style={
        {
          '--card-accent': product.accentColor,
        } as React.CSSProperties
      }
      whileHover={{
        borderColor: product.accentColor,
        boxShadow: `0 0 30px ${product.accentColor}15`,
      }}
    >
      {/* Header */}
      <div className="flex items-start justify-between">
        <StatusBadge status={product.status} />
        <div className="flex items-center gap-2">
          {product.version && (
            <span className="font-mono text-[10px] text-eternal-muted">
              {product.version}
            </span>
          )}
          {product.url && (
            <a
              href={product.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-eternal-muted transition-colors duration-200 hover:text-eternal-text"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                <polyline points="15 3 21 3 21 9" />
                <line x1="10" y1="14" x2="21" y2="3" />
              </svg>
            </a>
          )}
        </div>
      </div>

      {/* Name */}
      <h3 className="mt-4 font-display text-[28px] leading-tight text-eternal-text">
        {product.name}
      </h3>

      {/* Tagline */}
      <p className="mt-2 font-mono text-[13px] leading-relaxed text-eternal-text-secondary">
        {product.tagline}
      </p>

      {/* Highlight */}
      <p
        className="mt-3 font-mono text-[11px]"
        style={{ color: product.accentColor }}
      >
        {'// '}{product.highlight}
      </p>

      {/* Tags */}
      <div className="mt-4 flex flex-wrap gap-1.5">
        {product.tags.map((tag) => (
          <Tag key={tag} label={tag} />
        ))}
      </div>

      {/* Media Placeholder */}
      <div className="mt-5">
        <MediaPlaceholder />
      </div>

      {/* GitHub Link */}
      {product.github && (
        <div className="mt-5">
          <GlowButton
            variant="ghost"
            href={product.github}
            external
            className="!px-3 !py-1.5 !text-[11px]"
          >
            GitHub &rarr;
          </GlowButton>
        </div>
      )}
    </motion.div>
  )
}
