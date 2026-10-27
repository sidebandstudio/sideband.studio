'use client'

import Image from 'next/image'
import { useRef, useState, type KeyboardEvent } from 'react'
import type { PortfolioPage } from '@/lib/engineers'
import { ArrowUpRightIcon } from '@/components/ui/Icons'
import { cx } from '@/components/ui/cx'

const shortUrl = (url: string) =>
  url.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '')

function Frames({ page, first }: { page: PortfolioPage; first: string }) {
  const where = shortUrl(page.url)
  return (
    <div className="grid items-end gap-6 lg:grid-cols-[1fr_auto] lg:gap-8">
      <figure className="min-w-0">
        <div
          data-ui
          className="overflow-hidden rounded-panel bg-sideband-surface-2"
        >
          <div className="flex h-10 items-center gap-2 px-4">
            <span aria-hidden="true" className="flex gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-sideband-surface-3" />
              <span className="h-2.5 w-2.5 rounded-full bg-sideband-surface-3" />
              <span className="h-2.5 w-2.5 rounded-full bg-sideband-surface-3" />
            </span>
            <a
              href={page.url}
              target="_blank"
              rel="noopener noreferrer"
              className="mx-auto flex h-7 min-w-0 max-w-[70%] items-center gap-1.5 truncate rounded-full bg-sideband-black/60 px-4 text-small text-sideband-text-secondary transition-colors duration-hover hover:text-sideband-text"
            >
              <span className="truncate">{where}</span>
              <ArrowUpRightIcon size={11} className="shrink-0" />
            </a>
            <span aria-hidden="true" className="w-[46px]" />
          </div>
          <Image
            src={page.desktop.src}
            width={page.desktop.width}
            height={page.desktop.height}
            alt={`${first}'s ${page.label.toLowerCase()} page at ${where}, on a desktop browser`}
            sizes="(min-width: 1440px) 1040px, (min-width: 1024px) 70vw, 100vw"
            className="block h-auto w-full"
          />
        </div>
        <figcaption className="mt-3 text-small text-sideband-muted">
          Desktop, 1440 pixels wide
        </figcaption>
      </figure>
      <figure className="mx-auto w-[min(15rem,70%)] lg:w-[16rem]">
        <div
          data-ui
          className="overflow-hidden rounded-[2.25rem] bg-sideband-surface-2 p-2"
        >
          <Image
            src={page.mobile.src}
            width={page.mobile.width}
            height={page.mobile.height}
            alt={`${first}'s ${page.label.toLowerCase()} page at ${where}, on a phone`}
            sizes="256px"
            className="block h-auto w-full rounded-[1.75rem]"
          />
        </div>
        <figcaption className="mt-3 text-center text-small text-sideband-muted lg:text-left">
          Phone, 390 pixels wide
        </figcaption>
      </figure>
    </div>
  )
}

/**
 * The person's own site, shown through its desktop and phone captures. A
 * site with several entry pages gets a tab per page.
 */
export default function PortfolioViewer({
  pages,
  first,
  idPrefix,
}: {
  pages: PortfolioPage[]
  first: string
  idPrefix: string
}) {
  const [current, setCurrent] = useState(0)
  const tabs = useRef<(HTMLButtonElement | null)[]>([])

  if (pages.length === 1) return <Frames page={pages[0]} first={first} />

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const step = { ArrowRight: 1, ArrowLeft: -1 }[e.key]
    let next: number | undefined
    if (step) next = (current + step + pages.length) % pages.length
    if (e.key === 'Home') next = 0
    if (e.key === 'End') next = pages.length - 1
    if (next === undefined) return
    e.preventDefault()
    setCurrent(next)
    tabs.current[next]?.focus()
  }

  return (
    <div>
      <div
        role="tablist"
        aria-label={`Pages of ${first}'s site`}
        onKeyDown={onKeyDown}
        className="mb-8 inline-flex flex-wrap gap-1 rounded-full bg-sideband-surface p-1"
      >
        {pages.map((page, i) => (
          <button
            key={page.url}
            ref={(el) => {
              tabs.current[i] = el
            }}
            type="button"
            role="tab"
            id={`${idPrefix}-tab-${i}`}
            aria-selected={i === current}
            aria-controls={`${idPrefix}-panel-${i}`}
            tabIndex={i === current ? 0 : -1}
            onClick={() => setCurrent(i)}
            className={cx(
              'h-10 rounded-full px-4 text-small font-medium transition-colors duration-hover ease-standard',
              i === current
                ? 'bg-sideband-surface-3 text-sideband-text'
                : 'text-sideband-text-secondary hover:text-sideband-text',
            )}
          >
            {page.label}
          </button>
        ))}
      </div>
      {pages.map((page, i) => (
        <div
          key={page.url}
          role="tabpanel"
          id={`${idPrefix}-panel-${i}`}
          aria-labelledby={`${idPrefix}-tab-${i}`}
          hidden={i !== current}
        >
          <Frames page={page} first={first} />
        </div>
      ))}
    </div>
  )
}
