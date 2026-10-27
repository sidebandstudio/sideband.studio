import type { SceneProps } from '..'
import { cx } from '@/components/ui/cx'
import { SceneStage, SceneSvg } from './Stage'
import u from './ui.module.css'
import s from './EternalExchangeScene.module.css'

/*
 * EternalExchange gives every Minecraft item an EMC value when a world
 * loads. Base values come from the mod's defaults (coal 128, stick 4,
 * diamond 8,192 in pe_custom_conversions/defaults.json) and the graph mapper
 * solves the rest from recipes: a torch is (128 + 4) / 4 = 33, a diamond
 * pickaxe is 3 × 8,192 + 2 × 4 = 24,584. Then a diamond goes into the
 * Transmutation Table: it burns into 8,192 EMC, the table learns it, and EMC
 * is spent on coal, which was learned before.
 */

const DURATION = 12
const STILL = 0.86

/** 8×8 pixel items. a accent, l light, m mid, k dark. */
const ITEMS = {
  coal: [
    '........',
    '..mmmm..',
    '.mmkmmm.',
    '.mmmmkm.',
    '.mkmmmm.',
    '.mmmmmm.',
    '..mmmm..',
    '........',
  ],
  stick: [
    '......mm',
    '.....mm.',
    '....mm..',
    '...mm...',
    '..mm....',
    '.mm.....',
    'mm......',
    '........',
  ],
  diamond: [
    '..aaaa..',
    '.alaaaa.',
    'alaaaaaa',
    'aaaaaaaa',
    '.aaaaaa.',
    '..aaaa..',
    '...aa...',
    '........',
  ],
  torch: [
    '...ll...',
    '...ll...',
    '...mm...',
    '...mm...',
    '...mm...',
    '...mm...',
    '...mm...',
    '........',
  ],
  pickaxe: [
    '.aaaaa..',
    '......a.',
    '....m..a',
    '...m...a',
    '..m.....',
    '.m......',
    'm.......',
    '........',
  ],
}
type Item = keyof typeof ITEMS

const PAINT: Record<string, string> = {
  a: u.acc,
  l: u.ink,
  m: u.muted,
  k: u.ground,
}

/** One path per colour, so an item is two or three nodes. */
function paths(rows: string[]) {
  const d: Record<string, string> = {}
  rows.forEach((row, y) =>
    row.split('').forEach((c, x) => {
      if (c !== '.') d[c] = `${d[c] ?? ''}M${x} ${y}h1v1h-1z`
    }),
  )
  return Object.entries(d)
}

const PATHS = Object.fromEntries(
  Object.entries(ITEMS).map(([k, rows]) => [k, paths(rows)]),
) as Record<Item, [string, string][]>

/** An item icon with its top-left corner at x, y, `size` units square. */
function Icon({
  item,
  x,
  y,
  size = 40,
}: {
  item: Item
  x: number
  y: number
  size?: number
}) {
  return (
    <g transform={`translate(${x} ${y}) scale(${size / 8})`}>
      {PATHS[item].map(([c, d]) => (
        <path key={c} d={d} className={PAINT[c]} />
      ))}
    </g>
  )
}

/** A graph node: item tile with its value under it. */
function Node({
  item,
  x,
  y,
  value,
  valueClass,
}: {
  item: Item
  x: number
  y: number
  value: string
  valueClass?: string
}) {
  return (
    <>
      <rect x={x} y={y} width={64} height={64} rx={10} className={u.s2} />
      <Icon item={item} x={x + 12} y={y + 12} />
      <text
        x={x + 32}
        y={y + 94}
        textAnchor="middle"
        fontSize={24}
        className={cx(u.mono, u.ink, valueClass)}
      >
        {value}
      </text>
    </>
  )
}

const TABLE = { x: 610, y: 290 }
const SLOTS: { angle: number; item?: Item; learn?: boolean }[] = [
  { angle: -150, item: 'coal' },
  { angle: -90, item: 'diamond', learn: true },
  { angle: -30, item: 'torch' },
  { angle: 30 },
  { angle: 150, item: 'stick' },
]

function Core() {
  return (
    <g>
      {/* Recipe edges */}
      {[
        [120, 132, 300, 202],
        [120, 282, 300, 202],
        [120, 282, 300, 362],
        [120, 432, 300, 362],
      ].map(([x1, y1, x2, y2], i) => (
        <line
          key={i}
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
          className={u.line}
          strokeWidth={2}
        />
      ))}
      <text x={206} y={426} fontSize={22} className={cx(u.mono, u.muted)}>
        ×3
      </text>
      <text x={200} y={346} fontSize={22} className={cx(u.mono, u.muted)}>
        ×2
      </text>

      {/* Base values, then the values the mapper solves */}
      <Node item="coal" x={56} y={100} value="128" />
      <Node item="stick" x={56} y={250} value="4" />
      <Node item="diamond" x={56} y={400} value="8,192" />
      <Node
        item="torch"
        x={300}
        y={170}
        value="33"
        valueClass={cx(s.a, s.torchValue)}
      />
      <Node
        item="pickaxe"
        x={300}
        y={330}
        value="24,584"
        valueClass={cx(s.a, s.pickValue)}
      />
      <circle cx={120} cy={132} r={6} className={cx(u.acc, s.a, s.flowCoal)} />
      <circle
        cx={120}
        cy={282}
        r={6}
        className={cx(u.acc, s.a, s.flowStickTorch)}
      />
      <circle
        cx={120}
        cy={282}
        r={6}
        className={cx(u.acc, s.a, s.flowStickPick)}
      />
      <circle
        cx={120}
        cy={432}
        r={6}
        className={cx(u.acc, s.a, s.flowDiamond)}
      />

      {/* Transmutation Table */}
      <circle
        cx={TABLE.x}
        cy={TABLE.y}
        r={124}
        className={cx(u.none, u.accLineDim)}
        strokeWidth={2}
      />
      <circle
        cx={TABLE.x}
        cy={TABLE.y}
        r={78}
        className={cx(u.none, u.line)}
        strokeWidth={2}
      />
      <rect
        x={TABLE.x - 26}
        y={TABLE.y - 26}
        width={52}
        height={52}
        rx={10}
        className={u.s2}
      />
      {SLOTS.map(({ angle, item, learn }) => {
        const r = (angle * Math.PI) / 180
        const cx0 = Math.round(TABLE.x + 124 * Math.cos(r))
        const cy0 = Math.round(TABLE.y + 124 * Math.sin(r))
        return (
          <g key={angle}>
            <rect
              x={cx0 - 22}
              y={cy0 - 22}
              width={44}
              height={44}
              rx={10}
              className={u.s3}
            />
            {item && (
              <g className={learn ? cx(s.a, s.learn) : undefined}>
                <Icon item={item} x={cx0 - 14} y={cy0 - 14} size={28} />
              </g>
            )}
          </g>
        )
      })}
      <circle
        cx={TABLE.x}
        cy={TABLE.y}
        r={34}
        className={cx(u.none, u.accLine, s.a, s.burst)}
        strokeWidth={3}
      />
      <g className={cx(s.a, s.make)}>
        <Icon item="coal" x={TABLE.x - 20} y={TABLE.y + 70} />
      </g>
      <g className={cx(s.a, s.burn)}>
        <Icon item="diamond" x={68} y={412} />
      </g>

      {[
        { text: 'EMC 0', c: s.emc0 },
        { text: 'EMC 8,192', c: s.emcIn },
        { text: 'EMC 8,064', c: s.emcOut },
      ].map(({ text, c }) => (
        <text
          key={text}
          x={TABLE.x}
          y={118}
          textAnchor="middle"
          fontSize={28}
          className={cx(u.mono, u.ink, s.a, c)}
        >
          {text}
        </text>
      ))}
      <text
        x={TABLE.x}
        y={462}
        textAnchor="middle"
        fontSize={22}
        className={cx(u.sans, u.muted)}
      >
        Transmutation Table
      </text>
    </g>
  )
}

function Card() {
  return (
    <SceneSvg frame="card" duration={DURATION} still={STILL}>
      <g transform="translate(0 20)">
        <Core />
      </g>
    </SceneSvg>
  )
}

function Hero() {
  // Core (x 56–736, y 94–494) at 1.35×, centred.
  return (
    <SceneSvg frame="hero" duration={DURATION} still={STILL}>
      <g transform="translate(265 100) scale(1.35)">
        <Core />
      </g>
    </SceneSvg>
  )
}

export default function EternalExchangeScene({ variant }: SceneProps) {
  return (
    <SceneStage
      id="eternal-exchange"
      variant={variant}
      card={<Card />}
      hero={<Hero />}
    />
  )
}
