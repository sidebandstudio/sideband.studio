import type { SceneProps } from '..'
import { cx } from '@/components/ui/cx'
import { SceneStage, SceneSvg } from './Stage'
import u from './ui.module.css'
import s from './ExerlyScene.module.css'

/*
 * Exerly turns daily weigh-ins and logged food into calorie targets.
 * Noisy scale readings get a smoothed trend (an EWMA in apps/api/lib/
 * nutrition.js), logged meals fill each day's intake, and the two meet in
 * an energy balance: intake minus the change in stored energy is measured
 * expenditure. At the weekly check-in that number moves the targets.
 * The figures are sample values that agree with each other: a 250 kcal
 * daily deficit is about 0.23 kg a week at 7,700 kcal per kg.
 */

const DURATION = 12
const STILL = 0.86

const NOISE = [-14, 10, -6, 16, -12, 4, -18, 8, 12, -8, 14, -10, 6, -4]
const READINGS = NOISE.map((n, i) => ({
  x: 72 + 23 * i,
  y: 160 + 7 * i + n,
}))
const INTAKE = [88, 104, 76, 96, 110, 92, 84]

function Barcode({ x, y }: { x: number; y: number }) {
  const bars = [0, 4, 7, 12, 15, 20, 24, 27, 32]
  return (
    <path
      d={bars
        .map((b, i) => `M${x + b} ${y}v34h${i % 3 === 0 ? 2.5 : 1.5}v-34z`)
        .join('')}
      className={u.ink2}
    />
  )
}

/**
 * Both framings draw this, the hero at 1.4×. Every label is at least 36
 * units, so it reads at the smallest card. `detail` adds the protein target,
 * which only has room to read in the hero.
 */
function Core({ detail }: { detail: boolean }) {
  return (
    <g>
      {/* Weight: readings and trend */}
      <rect x={40} y={40} width={360} height={290} rx={16} className={u.s2} />
      <text x={64} y={92} fontSize={36} className={cx(u.sans, u.ink2)}>
        Weight
      </text>
      <rect x={246} y={78} width={24} height={6} rx={3} className={u.acc} />
      <text
        x={376}
        y={92}
        textAnchor="end"
        fontSize={36}
        className={cx(u.sans, u.acc)}
      >
        Trend
      </text>
      <path
        d="M 72 160 C 172 178, 272 216, 371 250"
        className={cx(u.none, u.accLine)}
        strokeWidth={4}
        strokeLinecap="round"
      />
      <rect
        x={66}
        y={132}
        width={312}
        height={140}
        className={cx(u.s2, s.a, s.trendCover)}
      />
      {READINGS.map((p, i) => (
        <circle
          key={i}
          cx={p.x}
          cy={p.y}
          r={5}
          className={cx(u.muted, s.a, s[`dot${i}`])}
        />
      ))}
      <line
        x1={64}
        y1={304}
        x2={376}
        y2={304}
        className={u.line}
        strokeWidth={2}
      />

      {/* Intake: a week of logged food */}
      <rect x={40} y={354} width={360} height={206} rx={16} className={u.s2} />
      <text x={64} y={404} fontSize={36} className={cx(u.sans, u.ink2)}>
        Intake
      </text>
      {INTAKE.map((h, i) => (
        <rect
          key={i}
          x={64 + 42 * i}
          y={536 - h}
          width={28}
          height={h}
          rx={6}
          className={cx(i === 6 ? u.accSoft : u.s3, s.a, s[`bar${i}`])}
        />
      ))}
      <Barcode x={342} y={374} />
      <rect
        x={344}
        y={384}
        width={28}
        height={16}
        rx={4}
        className={cx(u.acc, s.a, s.food)}
      />

      {/* Measured expenditure */}
      <rect x={424} y={40} width={336} height={290} rx={16} className={u.s2} />
      <text x={448} y={88} fontSize={36} className={cx(u.sans, u.ink2)}>
        Measured
      </text>
      <text x={448} y={128} fontSize={36} className={cx(u.sans, u.ink2)}>
        expenditure
      </text>
      <g className={cx(s.a, s.measured)}>
        <text x={448} y={206} fontSize={56} className={cx(u.sans, u.ink)}>
          2,460
        </text>
        <text x={448} y={248} fontSize={36} className={cx(u.sans, u.muted)}>
          kcal/day
        </text>
      </g>
      <g className={cx(s.a, s.confidence)}>
        <rect
          x={628}
          y={164}
          width={108}
          height={50}
          rx={25}
          className={u.accDim}
        />
        <text
          x={682}
          y={202}
          textAnchor="middle"
          fontSize={36}
          className={cx(u.sans, u.acc)}
        >
          High
        </text>
        <rect x={448} y={284} width={288} height={8} rx={4} className={u.s3} />
        <rect
          x={530}
          y={284}
          width={112}
          height={8}
          rx={4}
          className={u.accSoft}
        />
        <rect x={583} y={274} width={6} height={28} rx={3} className={u.acc} />
      </g>

      {/* Targets after the weekly check-in */}
      <rect x={424} y={354} width={336} height={206} rx={16} className={u.s2} />
      <text x={448} y={404} fontSize={36} className={cx(u.sans, u.ink2)}>
        Calorie target
      </text>
      <text
        x={448}
        y={490}
        fontSize={56}
        className={cx(u.sans, u.ink, s.a, s.oldTarget)}
      >
        2,150
      </text>
      <text
        x={448}
        y={490}
        fontSize={56}
        className={cx(u.sans, u.ink, s.a, s.newTarget)}
      >
        2,200
      </text>
      <g className={cx(s.a, s.change)}>
        <rect
          x={628}
          y={448}
          width={108}
          height={50}
          rx={25}
          className={u.accDim}
        />
        <text
          x={682}
          y={486}
          textAnchor="middle"
          fontSize={36}
          className={cx(u.mono, u.acc)}
        >
          +50
        </text>
      </g>
      {detail && (
        <text x={448} y={540} fontSize={28} className={cx(u.mono, u.muted)}>
          Protein 160 g
        </text>
      )}

      <circle cx={371} cy={250} r={6} className={cx(u.acc, s.a, s.flowTrend)} />
      <circle
        cx={330}
        cy={452}
        r={6}
        className={cx(u.acc, s.a, s.flowIntake)}
      />
      <circle
        cx={560}
        cy={256}
        r={6}
        className={cx(u.acc, s.a, s.flowTarget)}
      />
    </g>
  )
}

function Card() {
  return (
    <SceneSvg frame="card" duration={DURATION} still={STILL}>
      <Core detail={false} />
    </SceneSvg>
  )
}

function Hero() {
  // Core (x 40–760, y 40–560) at 1.4×, centred.
  return (
    <SceneSvg frame="hero" duration={DURATION} still={STILL}>
      <g transform="translate(240 80) scale(1.4)">
        <Core detail />
      </g>
    </SceneSvg>
  )
}

export default function ExerlyScene({ variant }: SceneProps) {
  return (
    <SceneStage id="exerly" variant={variant} card={<Card />} hero={<Hero />} />
  )
}
