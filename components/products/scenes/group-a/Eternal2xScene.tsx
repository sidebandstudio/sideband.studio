import type { SceneProps } from '..'
import { cx } from '@/components/ui/cx'
import { SceneStage, SceneSvg } from './Stage'
import u from './ui.module.css'
import s from './Eternal2xScene.module.css'

/*
 * Eternal2x rebuilds hand-drawn animation inside DaVinci Resolve Studio.
 * The example is the one in its own Pipeline/dedupe.py: nine frames drawn on
 * 2s, A A B B C C C D D. A scan finds the four real drawings and greys the
 * repeats. The drawings go up to the track above on their original frames,
 * C keeps a held frame because it was held longer than the base pattern, and
 * RIFE draws the in-betweens in the other slots (output_time_map: 0.5, 0.5
 * and a third of the way from C to D). Super Scale 2x goes on last.
 */

const DURATION = 12
const STILL = 0.82

const SOURCE = ['A', 'A', 'B', 'B', 'C', 'C', 'C', 'D', 'D']
/** Where the falling ball sits in a cell for each drawing, and for the in-betweens. */
type Pos = [x: number, y: number]
const POS: Record<string, Pos> = {
  A: [14, -16],
  B: [27, -2],
  C: [40, 9],
  D: [53, 14],
}
const TWEENS: Record<number, Pos> = {
  1: [20.5, -9],
  3: [33.5, 3.5],
  6: [44.3, 10.7],
}
const REPEATS = new Set([1, 3, 5, 6, 8])

const V2 = 150
const V1 = 310
const cellX = (i: number) => 104 + 72 * i

function Cell({
  i,
  y,
  pos,
  fill = u.s3,
  ball = u.ink2,
}: {
  i: number
  y: number
  pos: Pos
  fill?: string
  ball?: string
}) {
  return (
    <>
      <rect x={cellX(i)} y={y} width={66} height={70} rx={6} className={fill} />
      <circle
        cx={cellX(i) + pos[0]}
        cy={y + 35 + pos[1]}
        r={9}
        className={ball}
      />
    </>
  )
}

/**
 * The two tracks, V1 the source as drawn and V2 the rebuilt clip. `ruler`
 * numbers the frames above V2, as Resolve's timeline does.
 */
function Tracks({ ruler }: { ruler: boolean }) {
  return (
    <g>
      <text x={40} y={V2 + 48} fontSize={36} className={cx(u.mono, u.muted)}>
        V2
      </text>
      <text x={40} y={V1 + 48} fontSize={36} className={cx(u.mono, u.muted)}>
        V1
      </text>
      {ruler &&
        SOURCE.map((_, i) => (
          <text
            key={i}
            x={cellX(i) + 33}
            y={V2 - 26}
            textAnchor="middle"
            fontSize={28}
            className={cx(u.mono, u.muted)}
          >
            {i + 1}
          </text>
        ))}
      <rect
        x={96}
        y={V2 - 10}
        width={658}
        height={90}
        rx={12}
        className={u.s2}
      />
      <rect
        x={96}
        y={V1 - 10}
        width={658}
        height={90}
        rx={12}
        className={u.s2}
      />

      {/* V1: the source as drawn */}
      {SOURCE.map((d, i) => (
        <g
          key={i}
          className={REPEATS.has(i) ? cx(s.a, s[`dim${i}`]) : undefined}
        >
          <Cell i={i} y={V1} pos={POS[d]} />
        </g>
      ))}
      {[0, 2, 4, 7].map((i) => (
        <rect
          key={i}
          x={cellX(i) - 4}
          y={V1 - 4}
          width={74}
          height={78}
          rx={9}
          className={cx(u.none, u.accLine, s.a, s[`ring${i}`])}
          strokeWidth={2.5}
        />
      ))}
      {SOURCE.map((d, i) => (
        <text
          key={i}
          x={cellX(i) + 33}
          y={V1 + 124}
          textAnchor="middle"
          fontSize={36}
          className={cx(u.mono, REPEATS.has(i) ? u.muted : u.ink2)}
        >
          {d}
        </text>
      ))}
      <rect
        x={100}
        y={V1 - 14}
        width={4}
        height={98}
        rx={2}
        className={cx(u.acc, s.a, s.scan)}
      />

      {/* V2: the rebuilt clip, same length, every drawing on its own frame */}
      {SOURCE.map((_, i) => (
        <rect
          key={i}
          x={cellX(i)}
          y={V2}
          width={66}
          height={70}
          rx={6}
          className={u.s1}
        />
      ))}
      <g className={cx(s.a, s.big)}>
        {[0, 2, 4, 7].map((i) => (
          <g key={i} className={cx(s.a, s[`copy${i}`])}>
            <Cell i={i} y={V2} pos={POS[SOURCE[i]]} ball={u.ink} />
          </g>
        ))}
        <g className={cx(s.a, s.hold)}>
          <Cell i={5} y={V2} pos={POS.C} />
          <Cell i={8} y={V2} pos={POS.D} />
        </g>
        {[1, 3, 6].map((i) => (
          <g key={i} className={cx(s.a, s[`tween${i}`])}>
            <Cell i={i} y={V2} pos={TWEENS[i]} fill={u.accDim} ball={u.acc} />
          </g>
        ))}
      </g>
    </g>
  )
}

/** Super Scale 2x, switched on once the clip is rebuilt. Right edge at x. */
function Badge({ x, y, size }: { x: number; y: number; size: number }) {
  const w = 14 * 0.6 * size + 1.4 * size
  const h = 1.6 * size
  return (
    <g className={cx(s.a, s.badge)}>
      <rect
        x={x - w}
        y={y}
        width={w}
        height={h}
        rx={h / 2}
        className={u.accDim}
      />
      <text
        x={x - w / 2}
        y={y + h / 2 + 0.36 * size}
        textAnchor="middle"
        fontSize={size}
        className={cx(u.mono, u.acc)}
      >
        Super Scale 2x
      </text>
    </g>
  )
}

/** The two legend keys. `row` sets them side by side, else stacked. */
function Legend({
  x,
  y,
  size,
  row,
}: {
  x: number
  y: number
  size: number
  row: boolean
}) {
  const key = size * 0.85
  const second = row
    ? { x: x + key + 0.5 * size + 15 * 0.6 * size + 1.4 * size, y }
    : { x, y: y + 1.55 * size }
  const label = (lx: number, ly: number, text: string) => (
    <text
      x={lx + key + 0.5 * size}
      y={ly + key / 2 + 0.36 * size}
      fontSize={size}
      className={cx(u.mono, u.ink2)}
    >
      {text}
    </text>
  )
  return (
    <>
      <rect
        x={x}
        y={y}
        width={key}
        height={key}
        rx={key / 4}
        className={u.accDim}
      />
      <circle cx={x + key / 2} cy={y + key / 2} r={key / 5} className={u.acc} />
      {label(x, y, 'RIFE in-between')}
      <rect
        x={second.x + 1.25}
        y={second.y + 1.25}
        width={key - 2.5}
        height={key - 2.5}
        rx={key / 4}
        className={cx(u.none, u.accLine)}
        strokeWidth={2.5}
      />
      {label(second.x, second.y, 'Real drawing')}
    </>
  )
}

function Card() {
  return (
    <SceneSvg frame="card" duration={DURATION} still={STILL}>
      <text x={40} y={94} fontSize={36} className={cx(u.mono, u.ink2)}>
        On 2s
      </text>
      <Badge x={754} y={52} size={36} />
      <Tracks ruler={false} />
      <Legend x={104} y={470} size={36} row={false} />
    </SceneSvg>
  )
}

function Hero() {
  // Tracks (x 40–754, y 104–438) at 1.4×, centred under the header row.
  return (
    <SceneSvg frame="hero" duration={DURATION} still={STILL}>
      <text x={246} y={198} fontSize={38} className={cx(u.mono, u.ink2)}>
        On 2s · 4 drawings in 9 frames
      </text>
      <Badge x={1354} y={154} size={38} />
      <g transform="translate(240 136) scale(1.4)">
        <Tracks ruler />
      </g>
      <Legend x={296} y={810} size={40} row />
    </SceneSvg>
  )
}

export default function Eternal2xScene({ variant }: SceneProps) {
  return (
    <SceneStage
      id="eternal2x"
      variant={variant}
      card={<Card />}
      hero={<Hero />}
    />
  )
}
