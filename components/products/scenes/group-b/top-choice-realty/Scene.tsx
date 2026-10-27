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
 * statuses (Active, Sold, email sent) are the app's own.
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
  const wA = font * 4.4
  const wS = font * 3.4
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
      <rect x="40" y="36" width="360" height="316" rx="20" fill={C.s2} />
      <path d="M40 196 V56 q0 -20 20 -20 H380 q20 0 20 20 V196 Z" fill={C.s3} />
      <House x={312} y={124} s={44} w={5} />
      <Status x={60} y={56} h={56} font={36} />
      <text x="64" y="262" fontSize="48" fontWeight="500" fill={C.ink}>
        $849,000
      </text>
      <rect x="64" y="286" width="312" height="44" rx="22" fill={C.s3} />
      <Envelope x={198} y={293} w={44} />

      {/* The agent, emailed */}
      <rect x="440" y="36" width="320" height="316" rx="20" fill={C.s2} />
      <Agent cx={600} cy={118} r={48} />
      <text x="600" y="218" fontSize="36" textAnchor="middle" fill={C.ink}>
        Listing agent
      </text>
      <g className={cx(a, m.sent)}>
        <Tick x={484} y={274} s={28} />
        <text x="526" y="290" fontSize="36" fill={C.accent}>
          Email sent
        </text>
      </g>

      {/* The customer book, its newest row the buyer */}
      <rect x="40" y="388" width="720" height="180" rx="20" fill={C.s2} />
      <text x="70" y="440" fontSize="38" fontWeight="500" fill={C.ink}>
        Customers
      </text>
      <g fill="rgba(255, 255, 255, 0.16)">
        <rect x="74" y="534" width="160" height="12" rx="6" />
        <rect x="360" y="534" width="140" height="12" rx="6" />
        <rect x="646" y="534" width="80" height="12" rx="6" />
      </g>
      <g className={cx(a, m.row)}>
        <rect
          x="54"
          y="458"
          width="692"
          height="60"
          rx="14"
          fill={C.accent}
          fillOpacity="0.14"
        />
        <text x="74" y="501" fontSize="36" fill={C.ink}>
          J. Rivera
        </text>
        <text x="360" y="501" fontSize="36" fill={C.ink}>
          $849,000
        </text>
        <text x="726" y="501" fontSize="36" textAnchor="end" fill={C.muted}>
          Oct 24
        </text>
      </g>

      {/* The two records, joined */}
      <g className={cx(a, m.link)}>
        <path d="M320 352 V458" fill="none" stroke={C.accent} strokeWidth="4" />
        <circle cx="320" cy="352" r="8" fill={C.accent} />
        <circle cx="320" cy="458" r="8" fill={C.accent} />
      </g>
      <circle
        className={cx(a, m.pulse)}
        style={pos(0, 106)}
        cx="320"
        cy="352"
        r="6"
        fill={C.ink}
        opacity="0"
      />

      {/* The buyer form that opens on Sold, and becomes the row */}
      <g className={cx(a, m.sheet)} style={pos(-50, 68)} opacity="0">
        <rect
          x="300"
          y="340"
          width="300"
          height="160"
          rx="16"
          fill={C.s3}
          stroke={C.lineStrong}
          strokeWidth="2"
        />
        <text x="324" y="386" fontSize="36" fill={C.muted}>
          Buyer
        </text>
        <rect x="506" y="362" width="70" height="28" rx="14" fill={C.accent} />
        <rect x="324" y="404" width="252" height="72" rx="12" fill={C.s1} />
        <text x="342" y="453" fontSize="36" fill={C.ink}>
          J. Rivera
        </text>
      </g>

      <g className={cx(a, m.mail)} style={pos(380, -192)} opacity="0">
        <Envelope x={198} y={293} w={44} />
      </g>
    </Stage>
  )
}

function Hero() {
  return (
    <Stage id="top-choice-realty" variant="hero" loop={14}>
      {/* Drawn from y 150, lowered to sit centred in the frame */}
      <g transform="translate(0 20)">
        {/* The listing, which names its buyer once sold */}
        <rect x="170" y="150" width="440" height="660" rx="24" fill={C.s2} />
        <path
          d="M170 440 V174 q0 -24 24 -24 H586 q24 0 24 24 V440 Z"
          fill={C.s3}
        />
        <House x={410} y={318} s={66} w={6} />
        <Status x={196} y={176} h={64} font={40} />
        <text x="202" y="520" fontSize="60" fontWeight="500" fill={C.ink}>
          $849,000
        </text>
        <g className={cx(a, m.soldTo)}>
          <text x="202" y="610" fontSize="40" fill={C.accent}>
            Sold to J. Rivera
          </text>
        </g>
        <rect x="202" y="706" width="376" height="72" rx="36" fill={C.s3} />
        <text x="390" y="756" fontSize="40" textAnchor="middle" fill={C.ink}>
          Contact agent
        </text>

        {/* The agent's back office: the inquiry, emailed */}
        <rect x="670" y="150" width="760" height="270" rx="24" fill={C.s2} />
        <Agent cx={744} cy={222} r={44} />
        <text x="810" y="238" fontSize="44" fontWeight="500" fill={C.ink}>
          Listing agent
        </text>
        <rect x="696" y="296" width="708" height="98" rx="18" fill={C.s3} />
        <g className={cx(a, m.inbox)}>
          <Envelope x={724} y={327} w={52} />
          <rect x="800" y="328" width="220" height="14" rx="7" fill={C.ink2} />
          <rect
            x="800"
            y="356"
            width="150"
            height="12"
            rx="6"
            fill="rgba(255, 255, 255, 0.22)"
          />
        </g>
        <g className={cx(a, m.sent)}>
          <Tick x={1124} y={346} s={28} />
          <text x="1166" y="359" fontSize="40" fill={C.accent}>
            Email sent
          </text>
        </g>

        {/* The customer book, its newest row the buyer */}
        <rect x="670" y="470" width="760" height="340" rx="24" fill={C.s2} />
        <text x="700" y="530" fontSize="44" fontWeight="500" fill={C.ink}>
          Customers
        </text>
        {[668, 712, 756].map((y) => (
          <g key={y} fill="rgba(255, 255, 255, 0.16)">
            <rect x="748" y={y} width="150" height="14" rx="7" />
            <rect x="1000" y={y} width="130" height="14" rx="7" />
            <rect x="1316" y={y} width="80" height="14" rx="7" />
          </g>
        ))}
        <g className={cx(a, m.row)}>
          <rect
            x="684"
            y="556"
            width="732"
            height="80"
            rx="16"
            fill={C.accent}
            fillOpacity="0.14"
          />
          <House x={716} y={594} s={15} w={3} />
          <text x="748" y="610" fontSize="40" fill={C.ink}>
            J. Rivera
          </text>
          <text x="1000" y="610" fontSize="40" fill={C.ink}>
            $849,000
          </text>
          <text x="1396" y="610" fontSize="40" textAnchor="end" fill={C.muted}>
            Oct 24
          </text>
        </g>

        {/* The two records, joined */}
        <g className={cx(a, m.link)}>
          <path
            d="M610 596 H684"
            fill="none"
            stroke={C.accent}
            strokeWidth="4"
          />
          <circle cx="610" cy="596" r="8" fill={C.accent} />
          <circle cx="684" cy="596" r="8" fill={C.accent} />
        </g>
        <circle
          className={cx(a, m.pulse)}
          style={pos(74, 0)}
          cx="610"
          cy="596"
          r="7"
          fill={C.ink}
          opacity="0"
        />

        {/* The buyer form that opens on Sold, and becomes the row */}
        <g className={cx(a, m.sheet)} style={pos(450, -174)} opacity="0">
          <rect
            x="420"
            y="660"
            width="360"
            height="220"
            rx="18"
            fill={C.s3}
            stroke={C.lineStrong}
            strokeWidth="2"
          />
          <text x="448" y="712" fontSize="38" fill={C.muted}>
            Buyer
          </text>
          <rect x="448" y="732" width="304" height="72" rx="12" fill={C.s1} />
          <text x="468" y="781" fontSize="40" fill={C.ink}>
            J. Rivera
          </text>
          <rect
            x="448"
            y="824"
            width="112"
            height="36"
            rx="18"
            fill={C.accent}
          />
        </g>

        <g className={cx(a, m.mail)} style={pos(360, -398)} opacity="0">
          <Envelope x={364} y={725} w={52} />
        </g>
      </g>
    </Stage>
  )
}
