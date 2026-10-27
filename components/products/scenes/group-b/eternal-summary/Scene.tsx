'use client'

import { useId, type CSSProperties } from 'react'
import { cx } from '@/components/ui/cx'
import type { SceneProps } from '../..'
import { Framings, Stage, a, mono, C } from '../Stage'
import m from './scene.module.css'

/**
 * Eternal Summary: an article with the side panel docked beside it. The head,
 * middle and tail of the page (50, 20 and 30 percent in `samplePage`) light up
 * and travel to the panel, which fills with the "Worth reading" verdict and a
 * summary with numbered source markers. Marker 2 is opened and its sentence
 * lights up in the article. The hero names the three windows, adds the service
 * worker and the /api/summarize call underneath, and the highlight-to-summarize
 * card.
 */
export default function EternalSummaryScene({ variant }: SceneProps) {
  return <Framings variant={variant} card={<Card />} hero={<Hero />} />
}

const delay = (s: number) => ({ animationDelay: `${s}s` }) as CSSProperties

/** Text runs drawn as bars: [x, y, width]. */
function Lines({
  rows,
  h,
  fill = 'rgba(255, 255, 255, 0.16)',
}: {
  rows: [number, number, number][]
  h: number
  fill?: string
}) {
  return (
    <>
      {rows.map(([x, y, w]) => (
        <rect
          key={`${x}-${y}`}
          x={x}
          y={y}
          width={w}
          height={h}
          rx={h / 2}
          fill={fill}
        />
      ))}
    </>
  )
}

/** The extension's infinity mark, as a stroke. */
function InfinityMark({ x, y, size }: { x: number; y: number; size: number }) {
  const r = size / 4
  return (
    <path
      d={`M${x} ${y} c${-r * 0.6} ${-r} ${-2 * r} ${-r} ${-2 * r} 0 s${r * 1.4} ${r} ${2 * r} 0 s${r * 1.4} ${-r} ${2 * r} 0 s${-r * 1.4} ${r} ${-2 * r} 0`}
      fill="none"
      stroke={C.accent}
      strokeWidth={size / 9}
      strokeLinecap="round"
    />
  )
}

function useClip() {
  return useId().replace(/:/g, '')
}

/** A numbered source marker after a line of the summary. */
function Marker({
  x,
  y,
  r,
  n,
  font,
}: {
  x: number
  y: number
  r: number
  n: number
  font: number
}) {
  return (
    <g>
      <circle cx={x} cy={y} r={r} fill={C.s2} />
      <text
        x={x}
        y={y + font * 0.36}
        fontSize={font}
        textAnchor="middle"
        fill={C.ink2}
      >
        {n}
      </text>
    </g>
  )
}

/** Marker 2 once it has been opened. */
function OpenMarker({
  x,
  y,
  r,
  font,
}: {
  x: number
  y: number
  r: number
  font: number
}) {
  return (
    <g className={cx(a, m.mark)}>
      <circle cx={x} cy={y} r={r} fill={C.accent} />
      <text
        x={x}
        y={y + font * 0.36}
        fontSize={font}
        fontWeight="500"
        textAnchor="middle"
        fill={C.ground}
      >
        2
      </text>
    </g>
  )
}

function Card() {
  const id = useClip()
  return (
    <Stage id="eternal-summary" variant="card" loop={12}>
      <defs>
        <clipPath id={`${id}-win`}>
          <rect x="40" y="92" width="720" height="460" rx="18" />
          <rect x="40" y="92" width="720" height="40" />
        </clipPath>
      </defs>

      {/* Browser window */}
      <rect x="40" y="48" width="720" height="504" rx="18" fill={C.s2} />
      <g fill={C.lineStrong}>
        <circle cx="70" cy="70" r="6" />
        <circle cx="92" cy="70" r="6" />
        <circle cx="114" cy="70" r="6" />
      </g>
      <rect x="146" y="58" width="280" height="24" rx="12" fill={C.s3} />

      <g clipPath={`url(#${id}-win)`}>
        {/* The article, which scrolls a little when source 2 is opened */}
        <g className={cx(a, m.scroll)}>
          <rect x="72" y="118" width="80" height="10" rx="5" fill={C.muted} />
          <Lines
            h={22}
            fill="rgba(255, 255, 255, 0.5)"
            rows={[
              [72, 140, 300],
              [72, 172, 196],
            ]}
          />
          <Lines
            h={10}
            rows={[
              [72, 230, 304],
              [72, 254, 286],
              [72, 278, 298],
              [72, 302, 220],
              [72, 352, 300],
              [72, 376, 306],
              [72, 400, 190],
              [72, 452, 298],
              [72, 476, 280],
              [72, 500, 240],
            ]}
          />
          {/* The sentence source 2 points at */}
          <rect
            className={cx(a, m.cite)}
            x="64"
            y="369"
            width="322"
            height="24"
            rx="6"
            fill={C.accent}
            fillOpacity="0.3"
          />
          {/* The three windows samplePage sends: head, middle, tail */}
          {[
            [214, 112],
            [336, 90],
            [436, 90],
          ].map(([y, h], i) => (
            <rect
              key={y}
              className={cx(a, m.window)}
              style={delay(i * 0.6)}
              x="58"
              y={y}
              width="336"
              height={h}
              rx="10"
              fill={C.accent}
              fillOpacity="0.06"
              stroke={C.accent}
              strokeOpacity="0.55"
              strokeWidth="2"
            />
          ))}
        </g>

        {/* Text strips travelling from each window to the panel */}
        {[
          [100, 254, 0],
          [100, 376, 0.6],
          [100, 476, 1.2],
        ].map(([x, y, d]) => (
          <rect
            key={y}
            className={cx(a, m.strip)}
            style={
              {
                ...delay(d),
                '--dx': `${520 - x}px`,
                '--dy': `${318 - y}px`,
              } as CSSProperties
            }
            x={x}
            y={y}
            width="120"
            height="10"
            rx="5"
            fill={C.accent}
          />
        ))}

        {/* The side panel, docked beside the article */}
        <g className={cx(a, m.panel)}>
          <rect x="412" y="92" width="348" height="460" fill={C.s3} />
          <InfinityMark x={458} y={130} size={48} />
          <g className={cx(a, m.pop)}>
            <rect
              x="432"
              y="160"
              width="280"
              height="56"
              rx="28"
              fill={C.accent}
              fillOpacity="0.16"
            />
            <text
              x="456"
              y="201"
              fontSize="36"
              fontWeight="500"
              fill={C.accent}
            >
              Worth reading
            </text>
          </g>
          {/* The summary, each claim followed by its source */}
          {[
            [262, 206],
            [318, 300],
            [374, 186],
            [430, 136],
          ].map(([y, w], i) => (
            <rect
              key={y}
              className={cx(a, m.grow)}
              style={delay(i * 0.18)}
              x="432"
              y={y - 6}
              width={w}
              height="12"
              rx="6"
              fill={C.ink2}
              fillOpacity="0.7"
            />
          ))}
          <g className={cx(a, m.sources)}>
            <Marker x={676} y={262} r={24} n={1} font={36} />
            <Marker x={656} y={374} r={24} n={2} font={36} />
            <Marker x={606} y={430} r={24} n={3} font={36} />
            <OpenMarker x={656} y={374} r={24} font={36} />
          </g>
          {/* Ask about this page */}
          <rect x="432" y="476" width="308" height="52" rx="14" fill={C.s2} />
          <rect
            x="454"
            y="497"
            width="150"
            height="10"
            rx="5"
            fill={C.muted}
            fillOpacity="0.5"
          />
        </g>
      </g>

      {/* The pointer that opens source 2 */}
      <path
        className={cx(a, m.pointer)}
        d="M0 0 L0 26 L7 19 L12 30 L17 28 L12 17 L21 17 Z"
        transform="translate(668 386)"
        fill={C.ink}
        stroke={C.ground}
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </Stage>
  )
}

function Hero() {
  const id = useClip()
  return (
    <Stage id="eternal-summary" variant="hero" loop={14}>
      <defs>
        <clipPath id={`${id}-win`}>
          <rect x="150" y="110" width="1300" height="650" rx="24" />
          <rect x="150" y="110" width="1300" height="60" />
        </clipPath>
      </defs>

      {/* The page's journey under the window: service worker, then the API */}
      <g fill="none" stroke={C.lineStrong} strokeWidth="3">
        <path d="M500 760 V818" />
        <path d="M670 854 H760" />
        <path d="M1180 854 H1260 V760" />
      </g>
      <rect x="330" y="818" width="340" height="72" rx="36" fill={C.s2} />
      <text x="500" y="867" fontSize="38" textAnchor="middle" fill={C.ink2}>
        Service worker
      </text>
      <rect x="760" y="790" width="420" height="140" rx="24" fill={C.s2} />
      <text
        className={mono}
        x="970"
        y="848"
        fontSize="38"
        textAnchor="middle"
        fill={C.ink}
      >
        /api/summarize
      </text>
      <text x="970" y="902" fontSize="38" textAnchor="middle" fill={C.muted}>
        gemini-2.5-flash
      </text>

      {/* Browser window */}
      <rect x="150" y="50" width="1300" height="710" rx="24" fill={C.s2} />
      <g fill={C.lineStrong}>
        <circle cx="190" cy="80" r="8" />
        <circle cx="218" cy="80" r="8" />
        <circle cx="246" cy="80" r="8" />
      </g>
      <rect x="290" y="64" width="460" height="32" rx="16" fill={C.s3} />

      <g clipPath={`url(#${id}-win)`}>
        <g className={cx(a, m.scroll)}>
          <rect x="230" y="138" width="130" height="14" rx="7" fill={C.muted} />
          <Lines
            h={30}
            fill="rgba(255, 255, 255, 0.5)"
            rows={[
              [230, 164, 540],
              [230, 202, 360],
            ]}
          />
          <Lines
            h={12}
            rows={[
              [234, 316, 580],
              [234, 342, 556],
              [234, 368, 590],
              [234, 394, 420],
              [234, 494, 570],
              [234, 520, 590],
              [234, 546, 380],
              [234, 646, 560],
              [234, 672, 590],
              [234, 698, 540],
              [234, 724, 430],
            ]}
          />
          <rect
            className={cx(a, m.citeHero)}
            x="224"
            y="512"
            width="608"
            height="28"
            rx="7"
            fill={C.accent}
            fillOpacity="0.3"
          />
          {/* The three windows, named on their top edge */}
          {(
            [
              [280, 140, 'Head 50%', 196],
              [458, 114, 'Middle 20%', 222],
              [610, 140, 'Tail 30%', 168],
            ] as const
          ).map(([y, h, label, w], i) => (
            <g key={label} className={cx(a, m.window)} style={delay(i * 0.7)}>
              <rect
                x="210"
                y={y}
                width="640"
                height={h}
                rx="14"
                fill={C.accent}
                fillOpacity="0.06"
                stroke={C.accent}
                strokeOpacity="0.55"
                strokeWidth="2.5"
              />
              <rect x="226" y={y - 24} width={w} height="48" fill={C.s2} />
              <text x="240" y={y + 13} fontSize="38" fill={C.accent}>
                {label}
              </text>
            </g>
          ))}

          {/* Highlight a passage and the Summarize button pops beside it */}
          <rect
            className={cx(a, m.select)}
            x="228"
            y="716"
            width="436"
            height="28"
            rx="6"
            fill={C.ink}
            fillOpacity="0.16"
          />
          <g className={cx(a, m.button)}>
            <rect
              x="510"
              y="648"
              width="236"
              height="56"
              rx="28"
              fill={C.accent}
            />
            <text
              x="628"
              y="689"
              fontSize="38"
              fontWeight="500"
              textAnchor="middle"
              fill={C.ground}
            >
              Summarize
            </text>
          </g>
        </g>

        <g className={cx(a, m.panel)}>
          <rect x="880" y="110" width="570" height="650" fill={C.s3} />
          <InfinityMark x={940} y={170} size={52} />
          <text x="990" y="184" fontSize="40" fontWeight="500" fill={C.ink}>
            Eternal Summary
          </text>
          <g className={cx(a, m.pop)}>
            <rect
              x="912"
              y="226"
              width="300"
              height="64"
              rx="32"
              fill={C.accent}
              fillOpacity="0.16"
            />
            <text
              x="938"
              y="272"
              fontSize="40"
              fontWeight="500"
              fill={C.accent}
            >
              Worth reading
            </text>
            <text
              x="1414"
              y="272"
              fontSize="38"
              textAnchor="end"
              fill={C.muted}
            >
              2 min read
            </text>
          </g>
          {[
            [350, 360],
            [420, 490],
            [490, 330],
            [560, 240],
          ].map(([y, w], i) => (
            <rect
              key={y}
              className={cx(a, m.grow)}
              style={delay(i * 0.16)}
              x="912"
              y={y - 7}
              width={w}
              height="14"
              rx="7"
              fill={C.ink2}
              fillOpacity="0.7"
            />
          ))}
          <g className={cx(a, m.sources)}>
            <Marker x={1312} y={350} r={28} n={1} font={40} />
            <Marker x={1282} y={490} r={28} n={2} font={40} />
            <Marker x={1192} y={560} r={28} n={3} font={40} />
            <OpenMarker x={1282} y={490} r={28} font={40} />
          </g>
          <rect x="912" y="626" width="506" height="68" rx="16" fill={C.s2} />
          <text x="940" y="673" fontSize="38" fill={C.muted}>
            Ask about this page
          </text>
        </g>

        {/* The selection card, anchored beside the passage */}
        <g className={cx(a, m.card)}>
          <rect
            x="470"
            y="540"
            width="370"
            height="150"
            rx="16"
            fill={C.s3}
            stroke={C.lineStrong}
            strokeWidth="2"
          />
          <InfinityMark x={514} y={580} size={40} />
          <Lines
            h={12}
            fill="rgba(255, 255, 255, 0.4)"
            rows={[
              [500, 616, 310],
              [500, 642, 280],
            ]}
          />
        </g>
      </g>

      {/* Text strips: down to the service worker, across to the API */}
      {[
        [300, 342, 0],
        [300, 520, 0.7],
        [300, 672, 1.4],
      ].map(([x, y, d]) => (
        <rect
          key={y}
          className={cx(a, m.trip)}
          style={
            {
              ...delay(d),
              '--x1': `${500 - 40 - x}px`,
              '--y1': `${778 - y}px`,
              '--y2': `${848 - y}px`,
              '--x3': `${700 - x}px`,
            } as CSSProperties
          }
          x={x}
          y={y}
          width="80"
          height="12"
          rx="6"
          fill={C.accent}
        />
      ))}
      <circle
        className={cx(a, m.reply)}
        cx="1260"
        cy="854"
        r="10"
        fill={C.accent}
      />

      <path
        className={cx(a, m.pointerHero)}
        d="M0 0 L0 36 L10 27 L17 42 L24 39 L17 24 L30 24 Z"
        transform="translate(1292 502)"
        fill={C.ink}
        stroke={C.ground}
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
    </Stage>
  )
}
