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
  x: 76 + 28 * i,
  y: 168 + 7 * i + n,
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

/** `detail` adds the readouts that are too small to read at card size. */
function Core({ detail }: { detail: boolean }) {
  return (
    <g>
      {/* Weight: readings and trend */}
      <rect x={40} y={50} width={430} height={290} rx={16} className={u.s2} />
      <text x={64} y={92} fontSize={22} className={cx(u.sans, u.ink2)}>
        Weight
      </text>
      <circle cx={300} cy={85} r={5} className={u.muted} />
      <text x={312} y={92} fontSize={22} className={cx(u.sans, u.muted)}>
        Scale
      </text>
      <rect x={374} y={83} width={18} height={4} rx={2} className={u.acc} />
      <text x={400} y={92} fontSize={22} className={cx(u.sans, u.muted)}>
        Trend
      </text>
      <path
        d="M 76 168 C 200 190, 320 230, 440 262"
        className={cx(u.none, u.accLine)}
        strokeWidth={4}
        strokeLinecap="round"
      />
      <rect
        x={70}
        y={140}
        width={378}
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
        y1={310}
        x2={446}
        y2={310}
        className={u.line}
        strokeWidth={2}
      />

      {/* Intake: a week of logged food */}
      <rect x={40} y={364} width={430} height={186} rx={16} className={u.s2} />
      <text x={64} y={404} fontSize={22} className={cx(u.sans, u.ink2)}>
        Intake
      </text>
      {INTAKE.map((h, i) => (
        <rect
          key={i}
          x={64 + 48 * i}
          y={528 - h}
          width={32}
          height={h}
          rx={6}
          className={cx(i === 6 ? u.accSoft : u.s3, s.a, s[`bar${i}`])}
        />
      ))}
      <Barcode x={418} y={400} />
      <rect
        x={420}
        y={410}
        width={28}
        height={16}
        rx={4}
        className={cx(u.acc, s.a, s.food)}
      />

      {/* Measured expenditure */}
      <rect x={494} y={50} width={266} height={290} rx={16} className={u.s2} />
      <text x={516} y={92} fontSize={22} className={cx(u.sans, u.ink2)}>
        Measured expenditure
      </text>
      <g className={cx(s.a, s.measured)}>
        <text x={516} y={166} fontSize={52} className={cx(u.sans, u.ink)}>
          2,460
        </text>
        <text x={516} y={198} fontSize={22} className={cx(u.sans, u.muted)}>
          kcal/day
        </text>
      </g>
      <g className={cx(s.a, s.confidence)}>
        <rect
          x={676}
          y={124}
          width={64}
          height={32}
          rx={16}
          className={u.accDim}
        />
        <text
          x={708}
          y={146}
          textAnchor="middle"
          fontSize={22}
          className={cx(u.sans, u.acc)}
        >
          High
        </text>
      </g>
      {!detail && (
        <g className={cx(s.a, s.confidence)}>
          <rect
            x={516}
            y={262}
            width={222}
            height={8}
            rx={4}
            className={u.s3}
          />
          <rect
            x={588}
            y={262}
            width={92}
            height={8}
            rx={4}
            className={u.accSoft}
          />
          <rect
            x={630}
            y={252}
            width={6}
            height={28}
            rx={3}
            className={u.acc}
          />
        </g>
      )}
      {detail && (
        <>
          <text x={516} y={250} fontSize={19} className={cx(u.sans, u.muted)}>
            Mean intake
          </text>
          <text x={516} y={276} fontSize={21} className={cx(u.mono, u.ink2)}>
            2,210 kcal
          </text>
          <text x={516} y={302} fontSize={19} className={cx(u.sans, u.muted)}>
            Trend
          </text>
          <text x={516} y={328} fontSize={21} className={cx(u.mono, u.ink2)}>
            −0.23 kg a week
          </text>
        </>
      )}

      {/* Targets after the weekly check-in */}
      <rect x={494} y={364} width={266} height={186} rx={16} className={u.s2} />
      <text x={516} y={404} fontSize={22} className={cx(u.sans, u.ink2)}>
        Current targets
      </text>
      <text x={516} y={440} fontSize={22} className={cx(u.sans, u.muted)}>
        Calories
      </text>
      <text
        x={516}
        y={484}
        fontSize={40}
        className={cx(u.sans, u.ink, s.a, s.oldTarget)}
      >
        2,150
      </text>
      <text
        x={516}
        y={484}
        fontSize={40}
        className={cx(u.sans, u.ink, s.a, s.newTarget)}
      >
        2,200
      </text>
      <g className={cx(s.a, s.change)}>
        <rect
          x={650}
          y={456}
          width={76}
          height={32}
          rx={16}
          className={u.accDim}
        />
        <text
          x={688}
          y={478}
          textAnchor="middle"
          fontSize={22}
          className={cx(u.mono, u.acc)}
        >
          +50
        </text>
      </g>
      {detail && (
        <text x={516} y={526} fontSize={21} className={cx(u.mono, u.muted)}>
          Protein 160 g
        </text>
      )}

      <circle cx={440} cy={262} r={6} className={cx(u.acc, s.a, s.flowTrend)} />
      <circle
        cx={368}
        cy={444}
        r={6}
        className={cx(u.acc, s.a, s.flowIntake)}
      />
      <circle
        cx={560}
        cy={210}
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
  // Core (x 40–760, y 50–550) at 1.4×, centred.
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
