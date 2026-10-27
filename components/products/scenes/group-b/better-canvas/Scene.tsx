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
 * and wallpaper change together, then a planner task is marked done, which
 * Better Canvas writes back to Canvas. The still frame stops the scan half
 * way, dark and themed above the line, untouched Canvas below it.
 *
 * Course names, task names and the theme name are the ones in the
 * extension's own theme preview.
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
  name: string
}

function Courses({
  courses,
  tone,
  font,
  r,
}: {
  courses: Course[]
  tone: Tone
  font: number
  r: number
}) {
  const t = TONE[tone]
  return (
    <>
      {courses.map((c) => (
        <g key={c.name}>
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
          <text
            x={c.x + font * 0.8}
            y={c.y + c.art + font * 1.6}
            fontSize={font}
            fontWeight="500"
            fill={t.text}
          >
            {c.name}
          </text>
          <rect
            x={c.x + font * 0.8}
            y={c.y + c.art + font * 2.4}
            width={c.w * 0.38}
            height={font * 0.4}
            rx={font * 0.2}
            fill={t.bar}
          />
        </g>
      ))}
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
          <g key={c.name} className={cx(a, m.art)} style={delay(i * step)}>
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

const CARD_COURSES: Course[] = [
  { x: 124, y: 128, w: 200, h: 196, art: 124, name: 'Creative writing' },
  { x: 340, y: 128, w: 200, h: 196, art: 124, name: 'Visual storytelling' },
  { x: 124, y: 340, w: 200, h: 196, art: 124, name: 'Computer science' },
  { x: 340, y: 340, w: 200, h: 196, art: 124, name: 'World history' },
]

function CardTodo({ tone }: { tone: Tone }) {
  const t = TONE[tone]
  return (
    <g>
      <rect
        x="560"
        y="128"
        width="180"
        height="408"
        rx="14"
        fill={t.card}
        stroke={t.edge}
        strokeWidth="2"
      />
      <text x="580" y="166" fontSize="22" fontWeight="500" fill={t.text}>
        To Do
      </text>
      {[196, 262, 328].map((y) => (
        <g key={y}>
          <circle
            cx="590"
            cy={y + 10}
            r="10"
            fill="none"
            stroke={t.bar}
            strokeWidth="2.5"
          />
          <rect x="610" y={y + 4} width="110" height="10" rx="5" fill={t.bar} />
          <rect
            x="610"
            y={y + 24}
            width="70"
            height="8"
            rx="4"
            fill={t.bar}
            opacity="0.6"
          />
        </g>
      ))}
    </g>
  )
}

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
        <text x="124" y="96" fontSize="28" fontWeight="500" fill={C.ink}>
          Dashboard
        </text>
        <Courses courses={CARD_COURSES} tone="dark" font={19} r={14} />
        <ThemeArt courses={CARD_COURSES} step={0.15} />
        <CardTodo tone="dark" />
        {/* The first task, marked done */}
        <g className={cx(a, m.check)}>
          <circle cx="590" cy="206" r="11" fill={C.accent} />
          <path
            d="M584 206 l4 4 l8 -8"
            fill="none"
            stroke={C.ground}
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>
        <rect
          className={cx(a, m.strike)}
          x="606"
          y="208"
          width="118"
          height="3"
          rx="1.5"
          fill={C.accent}
        />
        <rect x="580" y="474" width="140" height="8" rx="4" fill={C.s2} />
        <rect
          className={cx(a, m.progress)}
          x="580"
          y="474"
          width="47"
          height="8"
          rx="4"
          fill={C.accent}
        />
        <text
          className={cx(a, m.zero)}
          x="580"
          y="512"
          fontSize="19"
          fill={C.muted}
          opacity="0"
        >
          0 of 3 done
        </text>
        <text
          className={cx(a, m.one)}
          x="580"
          y="512"
          fontSize="19"
          fill={C.muted}
        >
          1 of 3 done
        </text>

        {/* Canvas as it was, still showing below the scan line */}
        <g clipPath={`url(#${id}-bright)`}>
          <rect
            x={page.x}
            y={page.y}
            width={page.w}
            height={page.h}
            fill={TONE.bright.page}
          />
          <text x="124" y="96" fontSize="28" fontWeight="500" fill={C.ground}>
            Dashboard
          </text>
          <Courses courses={CARD_COURSES} tone="bright" font={19} r={14} />
          <CardTodo tone="bright" />
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
        <rect x="556" y="66" width="184" height="42" rx="21" fill={C.s3} />
        <circle cx="580" cy="87" r="8" fill={C.accent} />
        <text x="596" y="94" fontSize="19" fill={C.ink}>
          Forest Reverie
        </text>
      </g>
    </Stage>
  )
}

const HERO_COURSES: Course[] = [
  { x: 280, y: 204, w: 348, h: 296, art: 190, name: 'Creative writing' },
  { x: 652, y: 204, w: 348, h: 296, art: 190, name: 'Visual storytelling' },
  { x: 280, y: 524, w: 348, h: 296, art: 190, name: 'Computer science' },
  { x: 652, y: 524, w: 348, h: 296, art: 190, name: 'World history' },
]

const COLUMNS = [
  { x: 1048, label: 'To do' },
  { x: 1170, label: 'In progress' },
  { x: 1292, label: 'Done' },
]

function HeroBoard({ tone }: { tone: Tone }) {
  const t = TONE[tone]
  return (
    <g>
      <rect
        x="1030"
        y="204"
        width="390"
        height="296"
        rx="20"
        fill={t.card}
        stroke={t.edge}
        strokeWidth="2"
      />
      <text x="1054" y="248" fontSize="24" fontWeight="500" fill={t.text}>
        Planner
      </text>
      {COLUMNS.map((c) => (
        <g key={c.label}>
          <text x={c.x + 8} y="290" fontSize="19" fill={t.sub}>
            {c.label}
          </text>
          <rect x={c.x} y="302" width="110" height="178" rx="12" fill={t.art} />
        </g>
      ))}
      {[
        // In the dark board the first task is the one being dragged to Done.
        ...(tone === 'bright' ? [[1056, 314]] : []),
        [1056, 384],
        [1178, 314],
      ].map(([x, y]) => (
        <g key={`${x}-${y}`}>
          <rect
            x={x}
            y={y}
            width="94"
            height="58"
            rx="9"
            fill={t.card}
            stroke={t.edge}
            strokeWidth="2"
          />
          <rect
            x={x + 12}
            y={y + 16}
            width="64"
            height="9"
            rx="4.5"
            fill={t.bar}
          />
          <rect
            x={x + 12}
            y={y + 34}
            width="40"
            height="8"
            rx="4"
            fill={t.bar}
            opacity="0.6"
          />
        </g>
      ))}
    </g>
  )
}

function HeroGrader({ tone }: { tone: Tone }) {
  const t = TONE[tone]
  return (
    <g>
      <rect
        x="1046"
        y="572"
        width="236"
        height="232"
        rx="6"
        fill={t.card}
        stroke={t.edge}
        strokeWidth="2"
      />
      {[600, 626, 652, 678, 704, 730, 756].map((y, i) => (
        <rect
          key={y}
          x="1068"
          y={y}
          width={[180, 166, 188, 120, 176, 150, 96][i]}
          height="9"
          rx="4.5"
          fill={t.bar}
        />
      ))}
      <rect x="1296" y="572" width="108" height="232" rx="6" fill={t.art} />
      <text x="1312" y="606" fontSize="18" fill={t.sub}>
        Grade
      </text>
      <rect
        x="1312"
        y="622"
        width="76"
        height="40"
        rx="8"
        fill={t.card}
        stroke={t.edge}
        strokeWidth="2"
      />
      <rect x="1312" y="680" width="76" height="9" rx="4.5" fill={t.bar} />
      <rect x="1312" y="702" width="54" height="9" rx="4.5" fill={t.bar} />
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
        <text x="280" y="160" fontSize="40" fontWeight="500" fill={C.ink}>
          Dashboard
        </text>
        <Courses courses={HERO_COURSES} tone="dark" font={24} r={18} />
        <ThemeArt courses={HERO_COURSES} step={0.15} />
        <HeroBoard tone="dark" />
        <rect
          x="1030"
          y="524"
          width="390"
          height="296"
          rx="20"
          fill={TONE.dark.card}
        />
        <HeroGrader tone="dark" />
        {/* The task dropped on Done, and the check written back to Canvas */}
        <g className={cx(a, m.drag)}>
          <rect
            x="1056"
            y="314"
            width="94"
            height="58"
            rx="9"
            fill={C.s2}
            stroke={C.accent}
            strokeWidth="2.5"
          />
          <rect x="1068" y="330" width="64" height="9" rx="4.5" fill={C.ink2} />
          <rect x="1068" y="348" width="40" height="8" rx="4" fill={C.muted} />
          <g className={cx(a, m.checkH)}>
            <circle cx="1136" cy="330" r="12" fill={C.accent} />
            <path
              d="M1130 330 l4 4 l8 -8"
              fill="none"
              stroke={C.ground}
              strokeWidth="3"
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
          <text x="280" y="160" fontSize="40" fontWeight="500" fill={C.ground}>
            Dashboard
          </text>
          <Courses courses={HERO_COURSES} tone="bright" font={24} r={18} />
          <HeroBoard tone="bright" />
          <rect
            x="1030"
            y="524"
            width="390"
            height="296"
            rx="20"
            fill={TONE.bright.card}
            stroke={TONE.bright.edge}
            strokeWidth="2"
          />
          <HeroGrader tone="bright" />
        </g>

        {/* The frame Canvas embeds SpeedGrader in, which the dark engine also reaches */}
        <rect
          x="1046"
          y="572"
          width="358"
          height="232"
          rx="6"
          fill="none"
          stroke={C.accent}
          strokeOpacity="0.7"
          strokeWidth="2.5"
          strokeDasharray="10 8"
        />
        <text x="1054" y="556" fontSize="20" fill={C.accent}>
          SpeedGrader, in a frame
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
        <rect x="1180" y="114" width="240" height="56" rx="28" fill={C.s3} />
        <circle cx="1212" cy="142" r="10" fill={C.accent} />
        <text x="1234" y="150" fontSize="24" fill={C.ink}>
          Forest Reverie
        </text>
      </g>
      <g className={cx(a, m.saved)}>
        <text x="1406" y="248" fontSize="19" textAnchor="end" fill={C.accent}>
          Done in Canvas
        </text>
      </g>
    </Stage>
  )
}
