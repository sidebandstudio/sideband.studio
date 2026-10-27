'use client'

import { useId, type CSSProperties } from 'react'
import { cx } from '@/components/ui/cx'
import type { SceneProps } from '../..'
import { Framings, Stage, a, C } from '../Stage'
import m from './scene.module.css'

/**
 * Better Canvas: a bright Canvas dashboard. A scan line reads each surface's
 * colour on its way down and the page turns dark behind it, the embedded
 * SpeedGrader frame included (hero). A theme pack lands and the course art
 * and wallpaper change together, and Canvas's To Do list becomes the
 * planner, where a task is marked done (a board in the hero, where it is
 * dragged to Done). The still frame stops the scan part way, dark and themed
 * above the line, untouched Canvas below it.
 *
 * Every label is at least 36 units in the card and 38 in the hero, so text
 * that is not the mechanic is drawn as bars. The theme name and the column
 * names are the extension's own.
 */
export default function BetterCanvasScene({ variant }: SceneProps) {
  return <Framings variant={variant} card={<Card />} hero={<Hero />} />
}

const delay = (s: number) => ({ animationDelay: `${s}s` }) as CSSProperties

type Tone = 'bright' | 'dark'

/** Default Canvas is white. Dark is what Better Canvas maps it to. */
const TONE = {
  bright: {
    page: C.ink,
    card: C.ink,
    edge: 'rgba(0, 0, 0, 0.12)',
    art: 'rgba(0, 0, 0, 0.1)',
    bar: 'rgba(0, 0, 0, 0.28)',
    text: C.ground,
    sub: 'rgba(0, 0, 0, 0.55)',
  },
  dark: {
    page: C.s2,
    card: C.s3,
    edge: 'transparent',
    art: C.s1,
    bar: 'rgba(255, 255, 255, 0.22)',
    text: C.ink,
    sub: C.muted,
  },
} as const

interface Course {
  x: number
  y: number
  w: number
  h: number
  art: number
}

/** Course cards. Their names are bars: the cards are not the point. */
function Courses({
  courses,
  tone,
  r,
}: {
  courses: Course[]
  tone: Tone
  r: number
}) {
  const t = TONE[tone]
  return (
    <>
      {courses.map((c, i) => {
        const pad = c.w * 0.09
        const line = (c.h - c.art) / 7
        return (
          <g key={i}>
            <rect
              x={c.x}
              y={c.y}
              width={c.w}
              height={c.h}
              rx={r}
              fill={t.card}
              stroke={t.edge}
              strokeWidth="2"
            />
            <path
              d={`M${c.x} ${c.y + c.art} V${c.y + r} q0 ${-r} ${r} ${-r} H${c.x + c.w - r} q${r} 0 ${r} ${r} V${c.y + c.art} Z`}
              fill={t.art}
            />
            <rect
              x={c.x + pad}
              y={c.y + c.art + line * 2}
              width={c.w * [0.66, 0.74, 0.7, 0.56][i % 4]}
              height={line * 1.1}
              rx={line * 0.55}
              fill={t.text}
              opacity="0.7"
            />
            <rect
              x={c.x + pad}
              y={c.y + c.art + line * 4.3}
              width={c.w * 0.38}
              height={line * 0.8}
              rx={line * 0.4}
              fill={t.bar}
            />
          </g>
        )
      })}
    </>
  )
}

/** A theme pack's course art: a painted hill line in the accent, per card. */
function ThemeArt({ courses, step }: { courses: Course[]; step: number }) {
  const ridges = [
    [0.55, 0.3, 0.7, 0.45],
    [0.4, 0.6, 0.35, 0.5],
    [0.65, 0.4, 0.5, 0.3],
    [0.45, 0.55, 0.6, 0.4],
  ]
  return (
    <>
      {courses.map((c, i) => {
        const [p, q, s, u] = ridges[i % ridges.length]
        const top = c.y + c.art * 0.25
        const span = c.art * 0.75
        const b = c.y + c.art
        const far = `M${c.x} ${b} V${top + span * p} L${c.x + c.w * 0.3} ${top + span * q} L${c.x + c.w * 0.6} ${top + span * s} L${c.x + c.w} ${top + span * u} V${b} Z`
        const near = `M${c.x} ${b} V${top + span * (u + 0.35)} L${c.x + c.w * 0.45} ${top + span * (p + 0.25)} L${c.x + c.w} ${top + span * (q + 0.4)} V${b} Z`
        return (
          <g key={i} className={cx(a, m.art)} style={delay(i * step)}>
            <circle
              cx={c.x + c.w * (0.72 - i * 0.1)}
              cy={c.y + c.art * 0.3}
              r={c.art * 0.1}
              fill={C.accent}
              opacity="0.75"
            />
            <path d={far} fill={C.accent} opacity="0.22" />
            <path d={near} fill={C.accent} opacity="0.5" />
          </g>
        )
      })}
    </>
  )
}

/** The scan line and the soft band of colour it has just read. */
function Scan({
  x,
  y,
  w,
  band,
}: {
  x: number
  y: number
  w: number
  band: number
}) {
  return (
    <g className={cx(a, m.scan)}>
      <rect
        x={x}
        y={y - band}
        width={w}
        height={band}
        fill={C.accent}
        opacity="0.1"
      />
      <rect x={x} y={y - 2} width={w} height="4" fill={C.accent} />
    </g>
  )
}

function useClip() {
  return useId().replace(/:/g, '')
}

/**
 * A list of tasks, as rings and bars. Canvas calls it To Do, and Better
 * Canvas puts its planner in its place.
 */
function TaskList({
  tone,
  x,
  y,
  w,
  h,
  r,
  font,
  rows,
}: {
  tone: Tone
  x: number
  y: number
  w: number
  h: number
  r: number
  font: number
  rows: number[]
}) {
  const t = TONE[tone]
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx={r}
        fill={t.card}
        stroke={t.edge}
        strokeWidth="2"
      />
      <text
        x={x + 22}
        y={y + font * 1.4}
        fontSize={font}
        fontWeight="500"
        fill={t.text}
      >
        {tone === 'bright' ? 'To Do' : 'Planner'}
      </text>
      {rows.map((ry) => (
        <g key={ry}>
          <circle
            cx={x + 36}
            cy={ry + 12}
            r="12"
            fill="none"
            stroke={t.bar}
            strokeWidth="3"
          />
          <rect
            x={x + 62}
            y={ry + 5}
            width={w - 86}
            height="13"
            rx="6.5"
            fill={t.bar}
          />
          <rect
            x={x + 62}
            y={ry + 30}
            width={(w - 86) * 0.6}
            height="10"
            rx="5"
            fill={t.bar}
            opacity="0.6"
          />
        </g>
      ))}
    </g>
  )
}

const CARD_COURSES: Course[] = [
  { x: 120, y: 144, w: 184, h: 188, art: 112 },
  { x: 320, y: 144, w: 184, h: 188, art: 112 },
  { x: 120, y: 348, w: 184, h: 188, art: 112 },
  { x: 320, y: 348, w: 184, h: 188, art: 112 },
]
const CARD_LIST = { x: 520, y: 144, w: 216, h: 392, r: 14, font: 36 }
const CARD_ROWS = [230, 300, 370]

function Card() {
  const id = useClip()
  const page = { x: 40, y: 40, w: 720, h: 520 }
  return (
    <Stage id="better-canvas" variant="card" loop={14}>
      <defs style={{ '--still': 0.42 } as CSSProperties}>
        <clipPath id={`${id}-page`}>
          <rect x={page.x} y={page.y} width={page.w} height={page.h} rx="18" />
        </clipPath>
        <clipPath id={`${id}-bright`}>
          <rect
            className={cx(a, m.reveal)}
            x="96"
            y={page.y}
            width="664"
            height={page.h}
          />
        </clipPath>
      </defs>

      <g clipPath={`url(#${id}-page)`}>
        {/* Dark, as Better Canvas leaves it */}
        <rect
          x={page.x}
          y={page.y}
          width={page.w}
          height={page.h}
          fill={TONE.dark.page}
        />
        <rect
          className={cx(a, m.wall)}
          x={page.x}
          y={page.y}
          width={page.w}
          height={page.h}
          fill={C.accent}
          opacity="0.07"
        />
        <text x="124" y="106" fontSize="40" fontWeight="500" fill={C.ink}>
          Dashboard
        </text>
        <Courses courses={CARD_COURSES} tone="dark" r={14} />
        <ThemeArt courses={CARD_COURSES} step={0.15} />
        <TaskList tone="dark" {...CARD_LIST} rows={CARD_ROWS} />
        {/* The first task, marked done */}
        <g className={cx(a, m.check)}>
          <circle cx="556" cy="242" r="14" fill={C.accent} />
          <path
            d="M549 242 l5 5 l9 -9"
            fill="none"
            stroke={C.ground}
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>
        <rect
          className={cx(a, m.strike)}
          x="578"
          y="240"
          width="138"
          height="4"
          rx="2"
          fill={C.accent}
        />
        <rect x="542" y="494" width="172" height="10" rx="5" fill={C.s2} />
        <rect
          className={cx(a, m.progress)}
          x="542"
          y="494"
          width="57"
          height="10"
          rx="5"
          fill={C.accent}
        />

        {/* Canvas as it was, still showing below the scan line */}
        <g clipPath={`url(#${id}-bright)`}>
          <rect
            x={page.x}
            y={page.y}
            width={page.w}
            height={page.h}
            fill={TONE.bright.page}
          />
          <text x="124" y="106" fontSize="40" fontWeight="500" fill={C.ground}>
            Dashboard
          </text>
          <Courses courses={CARD_COURSES} tone="bright" r={14} />
          <TaskList tone="bright" {...CARD_LIST} rows={CARD_ROWS} />
        </g>

        {/* Canvas's own navigation rail */}
        <rect x={page.x} y={page.y} width="56" height={page.h} fill={C.s3} />
        {[80, 128, 170, 212, 254].map((y, i) => (
          <rect
            key={y}
            x="56"
            y={y}
            width="24"
            height="24"
            rx={i === 0 ? 12 : 6}
            fill="rgba(255, 255, 255, 0.22)"
          />
        ))}

        <g style={{ '--h': `${page.h}px`, '--still': 0.42 } as CSSProperties}>
          <Scan x={96} y={page.y} w={664} band={56} />
        </g>
      </g>

      {/* The theme pack that lands on the dashboard */}
      <g className={cx(a, m.chip)}>
        <rect x="420" y="58" width="316" height="62" rx="31" fill={C.s3} />
        <circle cx="452" cy="89" r="11" fill={C.accent} />
        <text x="476" y="101" fontSize="36" fill={C.ink}>
          Forest Reverie
        </text>
      </g>
    </Stage>
  )
}

const HERO_COURSES: Course[] = [
  { x: 280, y: 220, w: 326, h: 290, art: 180 },
  { x: 630, y: 220, w: 326, h: 290, art: 180 },
  { x: 280, y: 534, w: 326, h: 290, art: 180 },
  { x: 630, y: 534, w: 326, h: 290, art: 180 },
]

/** The two board columns the scene uses, as the planner names them. */
const COLUMNS = [
  { x: 1000, label: 'To do' },
  { x: 1204, label: 'Done' },
]

function HeroBoard() {
  const t = TONE.dark
  return (
    <g>
      <rect x="980" y="220" width="440" height="290" rx="20" fill={t.card} />
      <text x="1006" y="270" fontSize="40" fontWeight="500" fill={t.text}>
        Planner
      </text>
      {COLUMNS.map((c) => (
        <g key={c.label}>
          <text x={c.x + 6} y="334" fontSize="38" fill={t.sub}>
            {c.label}
          </text>
          <rect x={c.x} y="350" width="188" height="142" rx="12" fill={t.art} />
        </g>
      ))}
      {/* The first To do task is the one being dragged to Done. */}
      <rect x="1014" y="426" width="160" height="54" rx="9" fill={t.card} />
      <rect x="1030" y="441" width="104" height="10" rx="5" fill={t.bar} />
      <rect
        x="1030"
        y="460"
        width="64"
        height="8"
        rx="4"
        fill={t.bar}
        opacity="0.6"
      />
    </g>
  )
}

function HeroGrader({ tone }: { tone: Tone }) {
  const t = TONE[tone]
  return (
    <g>
      <rect
        x="1000"
        y="606"
        width="282"
        height="198"
        rx="6"
        fill={t.card}
        stroke={t.edge}
        strokeWidth="2"
      />
      {[632, 660, 688, 716, 744, 772].map((y, i) => (
        <rect
          key={y}
          x="1022"
          y={y}
          width={[226, 204, 236, 150, 214, 120][i]}
          height="10"
          rx="5"
          fill={t.bar}
        />
      ))}
      <rect x="1292" y="606" width="108" height="198" rx="6" fill={t.art} />
      <rect
        x="1308"
        y="626"
        width="76"
        height="44"
        rx="8"
        fill={t.card}
        stroke={t.edge}
        strokeWidth="2"
      />
      <rect x="1308" y="690" width="76" height="10" rx="5" fill={t.bar} />
      <rect x="1308" y="714" width="54" height="10" rx="5" fill={t.bar} />
    </g>
  )
}

function Hero() {
  const id = useClip()
  const page = { x: 150, y: 80, w: 1300, h: 840 }
  const content = { x: 240, w: 1210 }
  return (
    <Stage id="better-canvas" variant="hero" loop={14}>
      <defs style={{ '--still': 0.3 } as CSSProperties}>
        <clipPath id={`${id}-page`}>
          <rect x={page.x} y={page.y} width={page.w} height={page.h} rx="26" />
        </clipPath>
        <clipPath id={`${id}-bright`}>
          <rect
            className={cx(a, m.reveal)}
            x={content.x}
            y={page.y}
            width={content.w}
            height={page.h}
          />
        </clipPath>
      </defs>

      <g clipPath={`url(#${id}-page)`}>
        <rect
          x={page.x}
          y={page.y}
          width={page.w}
          height={page.h}
          fill={TONE.dark.page}
        />
        <rect
          className={cx(a, m.wall)}
          x={page.x}
          y={page.y}
          width={page.w}
          height={page.h}
          fill={C.accent}
          opacity="0.07"
        />
        <text x="280" y="170" fontSize="56" fontWeight="500" fill={C.ink}>
          Dashboard
        </text>
        <Courses courses={HERO_COURSES} tone="dark" r={18} />
        <ThemeArt courses={HERO_COURSES} step={0.15} />
        <HeroBoard />
        <rect
          x="980"
          y="534"
          width="440"
          height="290"
          rx="20"
          fill={TONE.dark.card}
        />
        <HeroGrader tone="dark" />
        {/* The task dropped on Done, which Better Canvas writes back to Canvas */}
        <g className={cx(a, m.drag)}>
          <rect
            x="1014"
            y="362"
            width="160"
            height="54"
            rx="9"
            fill={C.s2}
            stroke={C.accent}
            strokeWidth="2.5"
          />
          <rect x="1030" y="377" width="104" height="10" rx="5" fill={C.ink2} />
          <rect x="1030" y="396" width="64" height="8" rx="4" fill={C.muted} />
          <g className={cx(a, m.checkH)}>
            <circle cx="1154" cy="381" r="13" fill={C.accent} />
            <path
              d="M1147 381 l5 5 l9 -9"
              fill="none"
              stroke={C.ground}
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>
        </g>

        <g clipPath={`url(#${id}-bright)`}>
          <rect
            x={page.x}
            y={page.y}
            width={page.w}
            height={page.h}
            fill={TONE.bright.page}
          />
          <text x="280" y="170" fontSize="56" fontWeight="500" fill={C.ground}>
            Dashboard
          </text>
          <Courses courses={HERO_COURSES} tone="bright" r={18} />
          <TaskList
            tone="bright"
            x={980}
            y={220}
            w={440}
            h={290}
            r={20}
            font={40}
            rows={[312, 376, 440]}
          />
          <rect
            x="980"
            y="534"
            width="440"
            height="290"
            rx="20"
            fill={TONE.bright.card}
            stroke={TONE.bright.edge}
            strokeWidth="2"
          />
          <HeroGrader tone="bright" />
        </g>

        {/* The frame Canvas embeds SpeedGrader in, which the dark engine also reaches */}
        <rect
          x="1000"
          y="606"
          width="400"
          height="198"
          rx="6"
          fill="none"
          stroke={C.accent}
          strokeOpacity="0.7"
          strokeWidth="2.5"
          strokeDasharray="10 8"
        />
        <text x="1004" y="584" fontSize="38" fill={C.accent}>
          SpeedGrader
        </text>

        <rect x={page.x} y={page.y} width="90" height={page.h} fill={C.s3} />
        {[118, 190, 250, 310, 370, 430].map((y, i) => (
          <rect
            key={y}
            x="177"
            y={y}
            width="36"
            height="36"
            rx={i === 0 ? 18 : 9}
            fill="rgba(255, 255, 255, 0.22)"
          />
        ))}

        <g style={{ '--h': `${page.h}px`, '--still': 0.3 } as CSSProperties}>
          <Scan x={content.x} y={page.y} w={content.w} band={80} />
        </g>
      </g>

      <g className={cx(a, m.chip)}>
        <rect x="1044" y="110" width="376" height="72" rx="36" fill={C.s3} />
        <circle cx="1082" cy="146" r="13" fill={C.accent} />
        <text x="1110" y="160" fontSize="40" fill={C.ink}>
          Forest Reverie
        </text>
      </g>
    </Stage>
  )
}
