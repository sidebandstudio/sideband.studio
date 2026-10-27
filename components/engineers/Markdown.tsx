import Link from 'next/link'
import type { Block, Inline } from '@/lib/engineers-bio'
import { cx } from '@/components/ui/cx'

const LINK =
  'text-sideband-text underline decoration-sideband-border-strong underline-offset-4 transition-colors duration-hover ease-standard hover:decoration-sideband-text'

/** Inline Markdown from a bio: bold, italic, code and links. */
export function InlineText({ content }: { content: Inline[] }) {
  return (
    <>
      {content.map((node, i) => {
        switch (node.type) {
          case 'text':
            return node.text
          case 'strong':
            return (
              <strong key={i} className="font-medium text-sideband-text">
                <InlineText content={node.children} />
              </strong>
            )
          case 'em':
            return (
              <em key={i}>
                <InlineText content={node.children} />
              </em>
            )
          case 'code':
            return (
              <code
                key={i}
                className="rounded-[6px] bg-sideband-surface-2 px-1.5 py-0.5 font-mono text-[0.85em]"
              >
                {node.text}
              </code>
            )
          case 'link':
            return node.href.startsWith('/') ? (
              <Link key={i} href={node.href} className={LINK}>
                <InlineText content={node.children} />
              </Link>
            ) : (
              <a
                key={i}
                href={node.href}
                target="_blank"
                rel="noopener noreferrer"
                className={LINK}
              >
                <InlineText content={node.children} />
              </a>
            )
        }
      })}
    </>
  )
}

/** Block Markdown from a bio, set in running text. */
export function Blocks({
  blocks,
  className,
  listId,
}: {
  blocks: Block[]
  className?: string
  /** Id for the first list, so a disclosure can shorten it. */
  listId?: string
}) {
  const firstList = blocks.findIndex((b) => b.type === 'list')
  return (
    <div className={cx('space-y-5 text-body text-sideband-text', className)}>
      {blocks.map((block, i) => {
        switch (block.type) {
          case 'paragraph':
            return (
              <p key={i}>
                <InlineText content={block.content} />
              </p>
            )
          case 'heading':
            return (
              <h4 key={i} className="text-lead font-medium">
                <InlineText content={block.content} />
              </h4>
            )
          case 'quote':
            return (
              <blockquote key={i} className="text-lead">
                <InlineText content={block.content} />
              </blockquote>
            )
          case 'list':
            return (
              <ul
                key={i}
                id={i === firstList ? listId : undefined}
                className="space-y-3"
              >
                {block.items.map((item, j) => (
                  <li key={j} className="flex gap-3">
                    <span
                      aria-hidden="true"
                      className="mt-[0.7em] block h-1 w-1 shrink-0 rounded-full bg-sideband-muted"
                    />
                    <span>
                      <InlineText content={item} />
                    </span>
                  </li>
                ))}
              </ul>
            )
        }
      })}
    </div>
  )
}
