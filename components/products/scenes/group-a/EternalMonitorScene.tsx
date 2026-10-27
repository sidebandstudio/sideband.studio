import type { SceneProps } from '..'
import { cx } from '@/components/ui/cx'
import { SceneStage, SceneSvg } from './Stage'
import u from './ui.module.css'
import s from './EternalMonitorScene.module.css'

/*
 * EternalMonitor turns an iPad into a display for a Windows PC. The loop is
 * one round trip in mirror mode: the Pencil draws on the iPad, the pen input
 * goes back to the PC, the PC app draws the stroke, and the new frame streams
 * to the iPad as UDP fragments. One fragment is lost, the iPad sends a NACK,
 * the host resends it, and the finished frame shows the stroke on the iPad.
 */

const DURATION = 10
const STILL = 0.86

const STROKE =
  'M 92 262 C 114 222, 140 222, 160 248 S 208 282, 230 248 S 258 220, 270 232'

/** The PC's desktop: a drawing app with one canvas. Shared by both screens. */
function Desktop({ strokeClass }: { strokeClass?: string }) {
  return (
    <>
      <rect x={68} y={176} width={224} height={124} rx={6} className={u.s2} />
      <circle cx={80} cy={187} r={3} className={u.muted} />
      <circle cx={91} cy={187} r={3} className={u.muted} />
      <circle cx={102} cy={187} r={3} className={u.muted} />
      <rect x={78} y={198} width={204} height={92} rx={4} className={u.s1} />
      <path
        d={STROKE}
        className={cx(u.none, u.accLine, strokeClass)}
        strokeWidth={5}
        strokeLinecap="round"
      />
    </>
  )
}

/** PC, iPad and the two lanes between them, in the card's 800×600 space. */
function Core({ labels }: { labels: boolean }) {
  return (
    <g>
      {/* Windows PC */}
      <rect x={40} y={150} width={280} height={190} rx={14} className={u.s2} />
      <rect
        x={52}
        y={162}
        width={256}
        height={160}
        rx={6}
        className={u.ground}
      />
      <Desktop />
      <rect
        x={86}
        y={212}
        width={192}
        height={74}
        className={cx(u.s1, s.a, s.coverPc)}
      />
      <rect x={160} y={340} width={40} height={26} className={u.s3} />
      <rect x={120} y={366} width={120} height={10} rx={5} className={u.s3} />

      {/* iPad, mirroring the PC's screen */}
      <rect x={500} y={152} width={260} height={196} rx={24} className={u.s2} />
      <rect
        x={513}
        y={165}
        width={234}
        height={170}
        rx={12}
        className={u.ground}
      />
      <g transform="translate(513 176.85) scale(0.914) translate(-52 -162)">
        <Desktop strokeClass={cx(s.a, s.landed)} />
      </g>

      {/* Apple Pencil, tip on the end of the stroke */}
      <g transform="translate(712.3 240.8)">
        <g className={cx(s.a, s.pencil)}>
          <g transform="rotate(35)">
            <rect
              x={-5}
              y={-150}
              width={10}
              height={128}
              rx={5}
              className={u.ink}
            />
            <path d="M 0 0 L -5 -22 L 5 -22 Z" className={u.muted} />
          </g>
        </g>
      </g>

      {/* Lanes: frames out on top, pen input back below */}
      <line
        x1={334}
        y1={226}
        x2={486}
        y2={226}
        className={u.line}
        strokeWidth={2}
        strokeDasharray="4 8"
      />
      <path
        d="M 478 219 L 486 226 L 478 233"
        className={cx(u.none, u.lineStrong)}
        strokeWidth={2}
      />
      <line
        x1={334}
        y1={290}
        x2={486}
        y2={290}
        className={u.line}
        strokeWidth={2}
        strokeDasharray="4 8"
      />
      <path
        d="M 342 283 L 334 290 L 342 297"
        className={cx(u.none, u.lineStrong)}
        strokeWidth={2}
      />
      {labels && (
        <>
          <text
            x={410}
            y={204}
            textAnchor="middle"
            fontSize={22}
            className={cx(u.mono, u.muted)}
          >
            Frames
          </text>
          <text
            x={410}
            y={326}
            textAnchor="middle"
            fontSize={22}
            className={cx(u.mono, u.muted)}
          >
            Pencil
          </text>
        </>
      )}

      {[s.frag1, s.frag2, s.lost, s.frag4, s.resend].map((c) => (
        <rect
          key={c}
          x={338}
          y={218}
          width={16}
          height={16}
          rx={3}
          className={cx(u.acc, s.a, c)}
        />
      ))}
      <rect
        x={470}
        y={238}
        width={16}
        height={16}
        rx={3}
        className={cx(u.none, u.accLine, s.a, s.nack)}
        strokeWidth={2}
      />
      {[s.input1, s.input2, s.input3].map((c) => (
        <circle key={c} cx={480} cy={290} r={5} className={cx(u.acc, s.a, c)} />
      ))}
    </g>
  )
}

function Chip({
  x,
  y,
  w,
  label,
  selected,
  size = 24,
  font = u.mono,
}: {
  x: number
  y: number
  w: number
  label: string
  selected?: boolean
  size?: number
  font?: string
}) {
  const h = size * 1.85
  return (
    <>
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx={h / 2}
        className={selected ? u.s3 : u.s2}
      />
      <text
        x={x + w / 2}
        y={y + h / 2 + size * 0.36}
        textAnchor="middle"
        fontSize={size}
        className={cx(font, selected ? u.ink : u.muted)}
      >
        {label}
      </text>
    </>
  )
}

function Card() {
  return (
    <SceneSvg frame="card" duration={DURATION} still={STILL}>
      <Core labels />
      <text
        x={180}
        y={414}
        textAnchor="middle"
        fontSize={24}
        className={cx(u.sans, u.muted)}
      >
        Windows PC
      </text>
      <text
        x={630}
        y={414}
        textAnchor="middle"
        fontSize={24}
        className={cx(u.sans, u.muted)}
      >
        iPad
      </text>
      <Chip x={204} y={460} w={262} label="Mirror my screen" selected />
      <Chip x={478} y={460} w={118} label="60 fps" />
    </SceneSvg>
  )
}

function Hero() {
  // Core is drawn at 1.35× and centred under the host's status header.
  return (
    <SceneSvg frame="hero" duration={DURATION} still={STILL}>
      <g transform="translate(0 -36)">
        <circle cx={334} cy={214} r={12} className={cx(u.acc, s.a, s.pulse)} />
        <circle cx={334} cy={214} r={12} className={u.acc} />
        <text x={366} y={226} fontSize={36} className={cx(u.sans, u.ink)}>
          Streaming to iPad
        </text>
        <text x={366} y={266} fontSize={22} className={cx(u.mono, u.muted)}>
          USB · Mirroring · 1920 × 1080 · 60 fps
        </text>
        <rect
          x={846}
          y={190}
          width={440}
          height={56}
          rx={28}
          className={u.s2}
        />
        <Chip
          x={852}
          y={196}
          w={232}
          label="Mirror my screen"
          selected
          size={23}
          font={u.sans}
        />
        <text
          x={1182}
          y={226}
          textAnchor="middle"
          fontSize={23}
          className={cx(u.sans, u.muted)}
        >
          Second screen
        </text>

        <g transform="translate(260 228) scale(1.35)">
          <Core labels />
        </g>
        <text
          x={503}
          y={796}
          textAnchor="middle"
          fontSize={26}
          className={cx(u.sans, u.muted)}
        >
          Windows PC
        </text>
        <text
          x={1110}
          y={796}
          textAnchor="middle"
          fontSize={26}
          className={cx(u.sans, u.muted)}
        >
          iPad
        </text>

        {[
          { x: 314, label: 'Frame rate', value: '60 fps' },
          { x: 640, label: 'Encoder', value: 'H.264 (NVENC)' },
          { x: 1040, label: 'Connection', value: 'Good' },
        ].map((stat) => (
          <g key={stat.label}>
            <text
              x={stat.x}
              y={872}
              fontSize={22}
              className={cx(u.sans, u.muted)}
            >
              {stat.label}
            </text>
            <text
              x={stat.x}
              y={912}
              fontSize={30}
              className={cx(u.mono, u.ink)}
            >
              {stat.value}
            </text>
          </g>
        ))}
      </g>
    </SceneSvg>
  )
}

export default function EternalMonitorScene({ variant }: SceneProps) {
  return (
    <SceneStage
      id="eternal-monitor"
      variant={variant}
      card={<Card />}
      hero={<Hero />}
    />
  )
}
