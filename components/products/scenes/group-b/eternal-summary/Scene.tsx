'use client'

import { useId, type CSSProperties } from 'react'
import { cx } from '@/components/ui/cx'
import type { SceneProps } from '../..'
import { Stage, a, mono, C } from '../Stage'
import m from './scene.module.css'

/**
 * Eternal Summary: an article with the side panel docked beside it. The head,
 * middle and tail of the page (50, 20 and 30 percent in `samplePage`) light up
 * and travel to the panel, which fills with a summary, the "Worth reading"
 * verdict and numbered sources. Source 2 is opened and its sentence lights up
 * in the article. The hero adds the service worker and the /api/summarize
 * call underneath, and the highlight-to-summarize card.
 */
export default function EternalSummaryScene({ variant }: SceneProps) {
  return variant === 'hero' ? <Hero /> : <Card />
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

function Card() {
  const id = useClip()
  return (
    <Stage id="eternal-summary" variant="card" loop={12}>
      <defs>
        <clipPath id={`${id}-win`}>
          <rect x="48" y="100" width="704" height="444" rx="18" />
          <rect x="48" y="100" width="704" height="40" />
        </clipPath>
      </defs>

      {/* Browser window */}
      <rect x="48" y="56" width="704" height="488" rx="18" fill={C.s2} />
      <g fill={C.lineStrong}>
        <circle cx="78" cy="78" r="6" />
        <circle cx="100" cy="78" r="6" />
        <circle cx="122" cy="78" r="6" />
      </g>
      <rect x="156" y="66" width="300" height="24" rx="12" fill={C.s3} />

      <g clipPath={`url(#${id}-win)`}>
        {/* The article, which scrolls a little when source 2 is opened */}
        <g className={cx(a, m.scroll)}>
          <rect x="84" y="132" width="86" height="10" rx="5" fill={C.muted} />
          <Lines
            h={22}
            fill="rgba(255, 255, 255, 0.5)"
            rows={[
              [84, 156, 330],
              [84, 188, 220],
            ]}
          />
          <Lines
            h={9}
            rows={[
              [84, 244, 340],
              [84, 266, 320],
              [84, 288, 336],
              [84, 310, 250],
              [84, 362, 330],
              [84, 384, 340],
              [84, 406, 210],
              [84, 458, 336],
              [84, 480, 318],
              [84, 502, 280],
            ]}
          />
          {/* The sentence source 2 points at */}
          <rect
            className={cx(a, m.cite)}
            x="78"
            y="377"
            width="352"
            height="19"
            rx="5"
            fill={C.accent}
            fillOpacity="0.3"
          />
          {/* The three windows samplePage sends: head, middle, tail */}
          {[
            [232, 92],
            [350, 70],
            [446, 70],
          ].map(([y, h], i) => (
            <rect
              key={y}
              className={cx(a, m.window)}
              style={delay(i * 0.6)}
              x="72"
              y={y}
              width="364"
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
          [100, 272, 0],
          [100, 382, 0.6],
          [100, 478, 1.2],
        ].map(([x, y, d]) => (
          <rect
            key={y}
            className={cx(a, m.strip)}
            style={
              {
                ...delay(d),
                '--dx': `${500 - x}px`,
                '--dy': `${250 - y}px`,
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
          <rect x="468" y="100" width="284" height="444" fill={C.s3} />
          <InfinityMark x={500} y={130} size={30} />
          <text x="530" y="128" fontSize="22" fontWeight="500" fill={C.ink}>
            Eternal Summary
          </text>
          <text x="530" y="154" fontSize="18" fill={C.muted}>
            2 min read
          </text>
          <g className={cx(a, m.pop)}>
            <rect
              x="488"
              y="178"
              width="156"
              height="36"
              rx="18"
              fill={C.accent}
              fillOpacity="0.16"
            />
            <text
              x="506"
              y="202"
              fontSize="20"
              fontWeight="500"
              fill={C.accent}
            >
              Worth reading
            </text>
          </g>
          {[238, 262, 286, 310, 334].map((y, i) => (
            <rect
              key={y}
              className={cx(a, m.grow)}
              style={delay(i * 0.18)}
              x="490"
              y={y}
              width={[236, 220, 240, 228, 150][i]}
              height="10"
              rx="5"
              fill={C.ink2}
              fillOpacity="0.7"
            />
          ))}
          <g className={cx(a, m.sources)}>
            <text x="490" y="416" fontSize="20" fill={C.muted}>
              Sources
            </text>
            {[1, 2, 3].map((n, i) => (
              <g key={n}>
                <circle cx={598 + i * 40} cy="409" r="16" fill={C.s2} />
                <text
                  x={598 + i * 40}
                  y="415"
                  fontSize="17"
                  textAnchor="middle"
                  fill={C.ink2}
                >
                  {n}
                </text>
              </g>
            ))}
            <g className={cx(a, m.mark)}>
              <circle cx="638" cy="409" r="16" fill={C.accent} />
              <text
                x="638"
                y="415"
                fontSize="17"
                fontWeight="500"
                textAnchor="middle"
                fill={C.ground}
              >
                2
              </text>
            </g>
          </g>
          <rect x="488" y="470" width="244" height="46" rx="12" fill={C.s2} />
          <text x="506" y="499" fontSize="19" fill={C.muted}>
            Ask about this page
          </text>
        </g>
      </g>

      {/* The pointer that opens source 2 */}
      <path
        className={cx(a, m.pointer)}
        d="M0 0 L0 26 L7 19 L12 30 L17 28 L12 17 L21 17 Z"
        transform="translate(650 420)"
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
          <rect x="170" y="126" width="1260" height="634" rx="24" />
          <rect x="170" y="126" width="1260" height="60" />
        </clipPath>
      </defs>

      {/* The page's journey under the window: service worker, then the API */}
      <g fill="none" stroke={C.lineStrong} strokeWidth="3">
        <path d="M470 760 V860 H560" />
        <path d="M800 860 H880" />
        <path d="M1220 860 H1260 V760" />
      </g>
      <rect x="560" y="824" width="240" height="72" rx="36" fill={C.s2} />
      <text x="680" y="870" fontSize="26" textAnchor="middle" fill={C.ink2}>
        Service worker
      </text>
      <rect x="880" y="810" width="340" height="100" rx="24" fill={C.s2} />
      <text
        className={mono}
        x="1050"
        y="852"
        fontSize="26"
        textAnchor="middle"
        fill={C.ink}
      >
        /api/summarize
      </text>
      <text x="1050" y="888" fontSize="22" textAnchor="middle" fill={C.muted}>
        gemini-2.5-flash
      </text>

      {/* Browser window */}
      <rect x="170" y="70" width="1260" height="690" rx="24" fill={C.s2} />
      <g fill={C.lineStrong}>
        <circle cx="210" cy="98" r="8" />
        <circle cx="238" cy="98" r="8" />
        <circle cx="266" cy="98" r="8" />
      </g>
      <rect x="310" y="82" width="460" height="32" rx="16" fill={C.s3} />

      <g clipPath={`url(#${id}-win)`}>
        <g className={cx(a, m.scroll)}>
          <rect x="250" y="168" width="130" height="14" rx="7" fill={C.muted} />
          <Lines
            h={34}
            fill="rgba(255, 255, 255, 0.5)"
            rows={[
              [250, 198, 560],
              [250, 244, 380],
            ]}
          />
          <Lines
            h={12}
            rows={[
              [250, 330, 580],
              [250, 360, 560],
              [250, 390, 590],
              [250, 420, 540],
              [250, 450, 380],
              [250, 512, 570],
              [250, 542, 590],
              [250, 572, 430],
              [250, 634, 360],
              [250, 664, 580],
              [250, 694, 556],
              [250, 724, 420],
            ]}
          />
          <rect
            className={cx(a, m.citeHero)}
            x="242"
            y="533"
            width="606"
            height="30"
            rx="7"
            fill={C.accent}
            fillOpacity="0.3"
          />
          {[
            [312, 168, 'Head 50%'],
            [494, 106, 'Middle 20%'],
            [616, 138, 'Tail 30%'],
          ].map(([y, h, label], i) => (
            <g key={label} className={cx(a, m.window)} style={delay(i * 0.7)}>
              <rect
                x="232"
                y={y}
                width="624"
                height={h}
                rx="14"
                fill={C.accent}
                fillOpacity="0.06"
                stroke={C.accent}
                strokeOpacity="0.55"
                strokeWidth="2.5"
              />
              <text
                x="846"
                y={Number(y) - 12}
                fontSize="22"
                textAnchor="end"
                fill={C.accent}
              >
                {label}
              </text>
            </g>
          ))}

          {/* Highlight a passage and the Summarize button pops beside it */}
          <rect
            className={cx(a, m.select)}
            x="246"
            y="686"
            width="440"
            height="28"
            rx="6"
            fill={C.ink}
            fillOpacity="0.16"
          />
          <g className={cx(a, m.button)}>
            <rect
              x="540"
              y="630"
              width="150"
              height="42"
              rx="21"
              fill={C.accent}
            />
            <text
              x="615"
              y="658"
              fontSize="22"
              fontWeight="500"
              textAnchor="middle"
              fill={C.ground}
            >
              Summarize
            </text>
          </g>
        </g>

        <g className={cx(a, m.panel)}>
          <rect x="920" y="126" width="510" height="634" fill={C.s3} />
          <InfinityMark x={986} y={178} size={46} />
          <text x="1030" y="172" fontSize="30" fontWeight="500" fill={C.ink}>
            Eternal Summary
          </text>
          <text x="1030" y="206" fontSize="22" fill={C.muted}>
            2 min read
          </text>
          <g className={cx(a, m.pop)}>
            <text
              x="960"
              y="268"
              fontSize="24"
              fontWeight="500"
              fill={C.accent}
            >
              Worth reading
            </text>
            <rect
              x="1126"
              y="254"
              width="240"
              height="12"
              rx="6"
              fill={C.ink2}
              fillOpacity="0.4"
            />
          </g>
          <rect x="956" y="300" width="438" height="56" rx="28" fill={C.s2} />
          <rect x="962" y="306" width="140" height="44" rx="22" fill={C.s3} />
          {['Summary', 'Bullets', 'Key points'].map((t, i) => (
            <text
              key={t}
              x={1032 + i * 140}
              y="336"
              fontSize="21"
              textAnchor="middle"
              fill={i === 0 ? C.ink : C.muted}
            >
              {t}
            </text>
          ))}
          {[394, 426, 458, 490, 522, 554].map((y, i) => (
            <rect
              key={y}
              className={cx(a, m.grow)}
              style={delay(i * 0.16)}
              x="972"
              y={y}
              width={[404, 380, 410, 392, 400, 260][i]}
              height="13"
              rx="6.5"
              fill={C.ink2}
              fillOpacity="0.7"
            />
          ))}
          <rect
            x="956"
            y="390"
            width="4"
            height="180"
            rx="2"
            fill={C.lineStrong}
          />
          <g className={cx(a, m.sources)}>
            <text x="972" y="636" fontSize="24" fill={C.muted}>
              Sources
            </text>
            {[1, 2, 3].map((n, i) => (
              <g key={n}>
                <circle cx={1090 + i * 54} cy="628" r="22" fill={C.s2} />
                <text
                  x={1090 + i * 54}
                  y="636"
                  fontSize="22"
                  textAnchor="middle"
                  fill={C.ink2}
                >
                  {n}
                </text>
              </g>
            ))}
            <g className={cx(a, m.mark)}>
              <circle cx="1144" cy="628" r="22" fill={C.accent} />
              <text
                x="1144"
                y="636"
                fontSize="22"
                fontWeight="500"
                textAnchor="middle"
                fill={C.ground}
              >
                2
              </text>
            </g>
          </g>
          <rect x="956" y="686" width="438" height="52" rx="14" fill={C.s2} />
          <text x="980" y="720" fontSize="22" fill={C.muted}>
            Ask about this page
          </text>
        </g>

        {/* The selection card, anchored beside the passage */}
        <g className={cx(a, m.card)}>
          <rect
            x="520"
            y="520"
            width="330"
            height="136"
            rx="16"
            fill={C.s3}
            stroke={C.lineStrong}
            strokeWidth="2"
          />
          <InfinityMark x={558} y={554} size={30} />
          <text x="586" y="562" fontSize="22" fontWeight="500" fill={C.ink}>
            Selection
          </text>
          <Lines
            h={11}
            fill="rgba(255, 255, 255, 0.4)"
            rows={[
              [544, 590, 280],
              [544, 614, 250],
            ]}
          />
        </g>
      </g>

      {/* Text strips: down to the service worker, across to the API */}
      {[
        [300, 396, 0],
        [300, 548, 0.7],
        [300, 680, 1.4],
      ].map(([x, y, d]) => (
        <rect
          key={y}
          className={cx(a, m.trip)}
          style={
            {
              ...delay(d),
              '--x1': `${470 - x - 40}px`,
              '--y1': `${780 - y}px`,
              '--y2': `${860 - y - 6}px`,
              '--x3': `${870 - x - 80}px`,
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
        cx="1240"
        cy="860"
        r="10"
        fill={C.accent}
      />

      <path
        className={cx(a, m.pointerHero)}
        d="M0 0 L0 36 L10 27 L17 42 L24 39 L17 24 L30 24 Z"
        transform="translate(1160 650)"
        fill={C.ink}
        stroke={C.ground}
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
    </Stage>
  )
}
