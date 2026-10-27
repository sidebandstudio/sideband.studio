'use client'

import type { CSSProperties } from 'react'
import { cx } from '@/components/ui/cx'
import type { SceneProps } from '../..'
import { Framings, Stage, a, C } from '../Stage'
import m from './scene.module.css'

/**
 * Top Choice Realty: a visitor's inquiry flies from a listing to its agent,
 * who is emailed. The agent marks the listing Sold, the buyer form that opens
 * becomes a new row in the customer book, and a line joins the two records,
 * which now point at each other (the sold RPC writes both in one step).
 *
 * The listing and buyer are illustrations, not real records. Field names and
 * statuses (Active, Pending, Sold, email sent) are the app's own.
 */
export default function TopChoiceRealtyScene({ variant }: SceneProps) {
  return <Framings variant={variant} card={<Card />} hero={<Hero />} />
}

/** The brokerage's gold house, as on its site and favicon. */
function House({ x, y, s, w }: { x: number; y: number; s: number; w: number }) {
  return (
    <g
      fill="none"
      stroke={C.accent}
      strokeWidth={w}
      strokeLinejoin="round"
      strokeLinecap="round"
    >
      <path
        d={`M${x - s} ${y - s * 0.1} L${x} ${y - s * 0.95} L${x + s} ${y - s * 0.1} V${y + s * 0.8} H${x - s} Z`}
      />
      <path
        d={`M${x - s * 0.3} ${y + s * 0.8} V${y + s * 0.2} H${x + s * 0.3} V${y + s * 0.8}`}
      />
    </g>
  )
}

/** Active, then Sold. */
function Status({
  x,
  y,
  h,
  font,
}: {
  x: number
  y: number
  h: number
  font: number
}) {
  const wA = font * 3.6
  const wS = font * 2.9
  return (
    <g>
      <g className={cx(a, m.active)} opacity="0">
        <rect
          x={x}
          y={y}
          width={wA}
          height={h}
          rx={h / 2}
          fill={C.ground}
          fillOpacity="0.7"
        />
        <text
          x={x + wA / 2}
          y={y + h / 2 + font * 0.36}
          fontSize={font}
          textAnchor="middle"
          fill={C.ink}
        >
          Active
        </text>
      </g>
      <g className={cx(a, m.sold)}>
        <rect x={x} y={y} width={wS} height={h} rx={h / 2} fill={C.accent} />
        <text
          x={x + wS / 2}
          y={y + h / 2 + font * 0.36}
          fontSize={font}
          fontWeight="500"
          textAnchor="middle"
          fill={C.ground}
        >
          Sold
        </text>
      </g>
    </g>
  )
}

/** A small envelope, the inquiry on its way to the agent. */
function Envelope({ x, y, w }: { x: number; y: number; w: number }) {
  const h = w * 0.68
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={w * 0.1} fill={C.accent} />
      <path
        d={`M${x + w * 0.1} ${y + h * 0.18} L${x + w / 2} ${y + h * 0.58} L${x + w * 0.9} ${y + h * 0.18}`}
        fill="none"
        stroke={C.ground}
        strokeWidth={w * 0.07}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </g>
  )
}

/** The agent: a plain silhouette, no real person. */
function Agent({ cx: x, cy: y, r }: { cx: number; cy: number; r: number }) {
  return (
    <g>
      <circle cx={x} cy={y} r={r} fill={C.s3} />
      <circle cx={x} cy={y - r * 0.22} r={r * 0.3} fill={C.muted} />
      <path
        d={`M${x - r * 0.55} ${y + r * 0.6} q${r * 0.55} ${-r * 0.75} ${r * 1.1} 0`}
        fill={C.muted}
      />
    </g>
  )
}

function Tick({ x, y, s }: { x: number; y: number; s: number }) {
  return (
    <path
      d={`M${x} ${y} l${s * 0.35} ${s * 0.35} l${s * 0.65} ${-s * 0.7}`}
      fill="none"
      stroke={C.accent}
      strokeWidth={s * 0.22}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  )
}

const pos = (x: number, y: number) =>
  ({ '--tx': `${x}px`, '--ty': `${y}px` }) as CSSProperties

function Card() {
  return (
    <Stage id="top-choice-realty" variant="card" loop={13}>
      {/* The listing */}
      <rect x="48" y="64" width="290" height="472" rx="20" fill={C.s2} />
      <path d="M48 244 V84 q0 -20 20 -20 H318 q20 0 20 20 V244 Z" fill={C.s3} />
      <House x={193} y={160} s={46} w={5} />
      <Status x={66} y={82} h={36} font={19} />
      <text x="70" y="294" fontSize="32" fontWeight="500" fill={C.ink}>
        $849,000
      </text>
      <text x="70" y="330" fontSize="19" fill={C.muted}>
        3 beds · 2 baths · 1,450 sqft
      </text>
      <text x="70" y="362" fontSize="19" fill={C.ink2}>
        Staten Island
      </text>
      <rect x="70" y="470" width="246" height="44" rx="22" fill={C.s3} />
      <text x="193" y="499" fontSize="19" textAnchor="middle" fill={C.ink}>
        Contact agent
      </text>

      {/* The agent, emailed */}
      <Agent cx={492} cy={118} r={36} />
      <text x="544" y="112" fontSize="20" fill={C.ink}>
        Listing agent
      </text>
      <g className={cx(a, m.sent)}>
        <Tick x={546} y={136} s={16} />
        <text x="570" y="144" fontSize="18" fill={C.accent}>
          Email sent
        </text>
      </g>

      {/* The customer book */}
      <rect x="400" y="236" width="352" height="300" rx="20" fill={C.s2} />
      <text x="424" y="278" fontSize="22" fontWeight="500" fill={C.ink}>
        Customers
      </text>
      {[372, 420, 468].map((y) => (
        <g key={y} fill="rgba(255, 255, 255, 0.16)">
          <rect x="424" y={y} width="96" height="10" rx="5" />
          <rect x="560" y={y} width="72" height="10" rx="5" />
          <rect x="676" y={y} width="52" height="10" rx="5" />
        </g>
      ))}
      <g className={cx(a, m.row)}>
        <rect
          x="412"
          y="298"
          width="328"
          height="50"
          rx="12"
          fill={C.accent}
          fillOpacity="0.14"
        />
        <text x="424" y="330" fontSize="19" fill={C.ink}>
          J. Rivera
        </text>
        <text x="560" y="330" fontSize="19" fill={C.ink}>
          $849,000
        </text>
        <text x="728" y="330" fontSize="19" textAnchor="end" fill={C.muted}>
          Oct 24
        </text>
      </g>

      {/* The two records, joined */}
      <g className={cx(a, m.link)}>
        <path
          d="M338 300 H376 V323 H412"
          fill="none"
          stroke={C.accent}
          strokeWidth="3"
        />
        <circle cx="338" cy="300" r="6" fill={C.accent} />
        <circle cx="412" cy="323" r="6" fill={C.accent} />
      </g>
      <circle
        className={cx(a, m.pulse)}
        cx="338"
        cy="300"
        r="5"
        fill={C.ink}
        opacity="0"
      />

      {/* The buyer form that opens on Sold, and becomes the row */}
      <g className={cx(a, m.sheet)} style={pos(306, -127)} opacity="0">
        <rect
          x="180"
          y="386"
          width="180"
          height="128"
          rx="14"
          fill={C.s3}
          stroke={C.lineStrong}
          strokeWidth="2"
        />
        <text x="198" y="418" fontSize="17" fill={C.muted}>
          Buyer
        </text>
        <rect x="198" y="430" width="144" height="36" rx="9" fill={C.s1} />
        <text x="210" y="455" fontSize="18" fill={C.ink}>
          J. Rivera
        </text>
        <rect x="198" y="476" width="70" height="24" rx="12" fill={C.accent} />
      </g>

      <g className={cx(a, m.mail)} style={pos(316, -378)} opacity="0">
        <Envelope x={174} y={480} w={38} />
      </g>
    </Stage>
  )
}

function Hero() {
  return (
    <Stage id="top-choice-realty" variant="hero" loop={14}>
      {/* The public listings page */}
      <text x="180" y="168" fontSize="34" fontWeight="500" fill={C.ink}>
        Listings
      </text>
      {['Staten Island', '3+ beds'].map((t, i) => (
        <g key={t}>
          <rect
            x={360 + i * 200}
            y="132"
            width={i ? 128 : 182}
            height="48"
            rx="24"
            fill={C.s2}
          />
          <text
            x={360 + i * 200 + (i ? 64 : 91)}
            y="163"
            fontSize="21"
            textAnchor="middle"
            fill={C.ink2}
          >
            {t}
          </text>
        </g>
      ))}

      {/* The listing this is about */}
      <rect x="180" y="210" width="340" height="600" rx="24" fill={C.s2} />
      <path
        d="M180 440 V234 q0 -24 24 -24 H496 q24 0 24 24 V440 Z"
        fill={C.s3}
      />
      <House x={350} y={330} s={60} w={6} />
      <Status x={202} y={232} h={44} font={22} />
      <text x="206" y="500" fontSize="40" fontWeight="500" fill={C.ink}>
        $849,000
      </text>
      <text x="206" y="544" fontSize="22" fill={C.muted}>
        3 beds · 2 baths · 1,450 sqft
      </text>
      <text x="206" y="582" fontSize="22" fill={C.ink2}>
        Staten Island
      </text>
      <g className={cx(a, m.soldTo)}>
        <text x="206" y="640" fontSize="22" fill={C.accent}>
          Sold to J. Rivera, Oct 24
        </text>
      </g>
      <rect x="206" y="730" width="288" height="54" rx="27" fill={C.s3} />
      <text x="350" y="765" fontSize="22" textAnchor="middle" fill={C.ink}>
        Contact agent
      </text>

      {/* A neighbour on the board */}
      <rect x="550" y="210" width="340" height="600" rx="24" fill={C.s2} />
      <path
        d="M550 440 V234 q0 -24 24 -24 H866 q24 0 24 24 V440 Z"
        fill={C.s3}
      />
      <House x={720} y={330} s={60} w={6} />
      <rect
        x="572"
        y="232"
        width="104"
        height="44"
        rx="22"
        fill={C.ground}
        fillOpacity="0.7"
      />
      <text x="624" y="261" fontSize="22" textAnchor="middle" fill={C.ink2}>
        Pending
      </text>
      <rect
        x="576"
        y="472"
        width="170"
        height="30"
        rx="8"
        fill="rgba(255, 255, 255, 0.22)"
      />
      <rect
        x="576"
        y="526"
        width="230"
        height="14"
        rx="7"
        fill="rgba(255, 255, 255, 0.14)"
      />
      <rect
        x="576"
        y="566"
        width="130"
        height="14"
        rx="7"
        fill="rgba(255, 255, 255, 0.14)"
      />
      <rect x="576" y="730" width="288" height="54" rx="27" fill={C.s3} />

      {/* The agent's back office: inquiries */}
      <rect x="950" y="210" width="480" height="250" rx="24" fill={C.s2} />
      <Agent cx={1012} cy={272} r={36} />
      <text x="1066" y="266" fontSize="24" fontWeight="500" fill={C.ink}>
        Listing agent
      </text>
      <text x="1066" y="296" fontSize="20" fill={C.muted}>
        Inquiries
      </text>
      <rect x="976" y="336" width="428" height="96" rx="16" fill={C.s3} />
      <g className={cx(a, m.inbox)}>
        <Envelope x={998} y={360} w={44} />
        <rect x="1064" y="362" width="170" height="12" rx="6" fill={C.ink2} />
        <rect
          x="1064"
          y="390"
          width="120"
          height="10"
          rx="5"
          fill="rgba(255, 255, 255, 0.22)"
        />
      </g>
      <g className={cx(a, m.sent)}>
        <Tick x={1270} y={380} s={20} />
        <text x="1300" y="390" fontSize="21" fill={C.accent}>
          Email sent
        </text>
      </g>

      {/* The customer book */}
      <rect x="950" y="500" width="480" height="310" rx="24" fill={C.s2} />
      <text x="976" y="550" fontSize="26" fontWeight="500" fill={C.ink}>
        Customers
      </text>
      <g fontSize="18" fill={C.muted}>
        <text x="976" y="590">
          Name
        </text>
        <text x="1150" y="590">
          Price
        </text>
        <text x="1404" y="590" textAnchor="end">
          Sold
        </text>
      </g>
      {[624, 670].map((y) => (
        <g key={y} fill="rgba(255, 255, 255, 0.16)">
          <rect x="976" y={y} width="120" height="12" rx="6" />
          <rect x="1150" y={y} width="96" height="12" rx="6" />
          <rect x="1334" y={y} width="70" height="12" rx="6" />
        </g>
      ))}
      <g className={cx(a, m.row)}>
        <rect
          x="962"
          y="706"
          width="456"
          height="62"
          rx="14"
          fill={C.accent}
          fillOpacity="0.14"
        />
        <House x={984} y={738} s={11} w={2.5} />
        <text x="1008" y="745" fontSize="22" fill={C.ink}>
          J. Rivera
        </text>
        <text x="1150" y="745" fontSize="22" fill={C.ink}>
          $849,000
        </text>
        <text x="1404" y="745" fontSize="22" textAnchor="end" fill={C.muted}>
          Oct 24
        </text>
      </g>

      {/* The two records, joined under the board */}
      <g className={cx(a, m.link)}>
        <path
          d="M350 810 V870 H930 V737 H962"
          fill="none"
          stroke={C.accent}
          strokeWidth="4"
        />
        <circle cx="350" cy="810" r="8" fill={C.accent} />
        <circle cx="962" cy="737" r="8" fill={C.accent} />
      </g>
      <circle
        className={cx(a, m.pulseH)}
        cx="350"
        cy="810"
        r="7"
        fill={C.ink}
        opacity="0"
      />

      <g className={cx(a, m.sheet)} style={pos(750, 15)} opacity="0">
        <rect
          x="290"
          y="636"
          width="300"
          height="172"
          rx="18"
          fill={C.s3}
          stroke={C.lineStrong}
          strokeWidth="2"
        />
        <text x="314" y="674" fontSize="20" fill={C.muted}>
          Buyer
        </text>
        <rect x="314" y="688" width="252" height="46" rx="11" fill={C.s1} />
        <text x="330" y="719" fontSize="22" fill={C.ink}>
          J. Rivera
        </text>
        <rect x="314" y="752" width="110" height="36" rx="18" fill={C.accent} />
        <text x="369" y="777" fontSize="19" textAnchor="middle" fill={C.ground}>
          Save
        </text>
      </g>

      <g className={cx(a, m.mail)} style={pos(666, -392)} opacity="0">
        <Envelope x={326} y={740} w={50} />
      </g>
    </Stage>
  )
}
