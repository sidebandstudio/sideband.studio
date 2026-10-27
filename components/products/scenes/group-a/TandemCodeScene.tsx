import type { SceneProps } from '..'
import { cx } from '@/components/ui/cx'
import { SceneStage, SceneSvg } from './Stage'
import u from './ui.module.css'
import s from './TandemCodeScene.module.css'

/*
 * TandemCode is a shared editor for practising interview problems with a
 * partner. The code, the two names and the order of turns are the site's
 * own hero demo (apps/web/src/components/heroDemo.ts): maya and theo write
 * two_sum line by line in one document. Run sends it to a sandbox container
 * with no network and a read-only filesystem under gVisor, the visible tests
 * and the locked hidden tests pass one by one, and both see Accepted. The
 * hero adds the room's Yjs relay, which forwards every update between the
 * two browsers.
 */

const DURATION = 14
const STILL = 0.86

type Kind = 'kw' | 'fn' | 'plain'
const CODE: { indent: number; who: 'a' | 'b'; tokens: [string, Kind][] }[] = [
  {
    indent: 0,
    who: 'a',
    tokens: [
      ['def', 'kw'],
      [' ', 'plain'],
      ['two_sum', 'fn'],
      ['(nums, target):', 'plain'],
    ],
  },
  { indent: 1, who: 'a', tokens: [['seen = {}', 'plain']] },
  {
    indent: 1,
    who: 'b',
    tokens: [
      ['for', 'kw'],
      [' i, n ', 'plain'],
      ['in', 'kw'],
      [' enumerate(nums):', 'plain'],
    ],
  },
  {
    indent: 2,
    who: 'b',
    tokens: [
      ['if', 'kw'],
      [' target - n ', 'plain'],
      ['in', 'kw'],
      [' seen:', 'plain'],
    ],
  },
  {
    indent: 3,
    who: 'a',
    tokens: [
      ['return', 'kw'],
      [' [seen[target - n], i]', 'plain'],
    ],
  },
  { indent: 2, who: 'b', tokens: [['seen[n] = i', 'plain']] },
]

/** JetBrains Mono advances 0.6em, so at 22 units a character is 13.2 wide. */
const CHAR = 13.2
const lineX = (k: number) => 68 + 52.8 * CODE[k].indent
const lineY = (k: number) => 132 + 40 * k
const lineEnd = (k: number) =>
  lineX(k) + CHAR * CODE[k].tokens.reduce((n, [t]) => n + t.length, 0)

const INK: Record<Kind, string> = { kw: u.ink, fn: u.ink, plain: u.ink2 }

function Caret({
  line,
  color,
  cls,
}: {
  line: number
  color: string
  cls: string
}) {
  const x = lineEnd(line)
  const y = lineY(line)
  return (
    <g className={cx(s.a, cls)}>
      <rect x={x} y={y - 22} width={3} height={28} className={color} />
      <rect x={x} y={y - 30} width={11} height={8} rx={2} className={color} />
    </g>
  )
}

function Core() {
  return (
    <g>
      {/* The room's editor */}
      <rect x={40} y={40} width={720} height={380} rx={16} className={u.s2} />
      <line
        x1={40}
        y1={96}
        x2={760}
        y2={96}
        className={u.line}
        strokeWidth={2}
      />
      <text x={68} y={76} fontSize={22} className={cx(u.sans, u.ink2)}>
        Two Sum
      </text>
      <circle cx={594} cy={68} r={12} className={u.acc} />
      <circle cx={626} cy={68} r={12} className={u.ink2} />
      <g className={cx(s.a, s.run)}>
        <rect x={660} y={52} width={80} height={34} rx={17} className={u.s3} />
        <rect
          x={660}
          y={52}
          width={80}
          height={34}
          rx={17}
          className={cx(u.acc, s.a, s.runFill)}
        />
        <text
          x={700}
          y={76}
          textAnchor="middle"
          fontSize={22}
          className={cx(u.sans, u.ink)}
        >
          Run
        </text>
      </g>

      {CODE.map((line, k) => (
        <text
          key={k}
          x={lineX(k)}
          y={lineY(k)}
          fontSize={22}
          className={cx(u.mono, u.pre)}
        >
          {line.tokens.map(([t, kind], i) => (
            <tspan key={i} className={INK[kind]}>
              {t}
            </tspan>
          ))}
        </text>
      ))}
      {CODE.map((_, k) => (
        <rect
          key={k}
          x={lineX(k) - 2}
          y={lineY(k) - 26}
          width={lineEnd(k) - lineX(k) + 8}
          height={36}
          className={cx(u.s2, s.a, s[`type${k}`])}
        />
      ))}
      <Caret line={4} color={u.acc} cls={s.caretA} />
      <Caret line={5} color={u.ink} cls={s.caretB} />

      <g className={cx(s.a, s.accepted)}>
        <rect
          x={560}
          y={362}
          width={176}
          height={40}
          rx={20}
          className={u.accDim}
        />
        <text
          x={648}
          y={389}
          textAnchor="middle"
          fontSize={22}
          className={cx(u.sans, u.acc)}
        >
          Accepted
        </text>
      </g>
      <circle cx={700} cy={96} r={7} className={cx(u.acc, s.a, s.pulse)} />

      {/* The judge's sandbox */}
      <rect x={40} y={444} width={720} height={116} rx={16} className={u.s2} />
      <text x={68} y={486} fontSize={24} className={cx(u.sans, u.ink2)}>
        gVisor
      </text>
      {[
        { x: 68, w: 213, label: '--network none' },
        { x: 293, w: 173, label: '--read-only' },
      ].map((chip) => (
        <g key={chip.label}>
          <rect
            x={chip.x}
            y={504}
            width={chip.w}
            height={36}
            rx={18}
            className={u.s3}
          />
          <text
            x={chip.x + chip.w / 2}
            y={529}
            textAnchor="middle"
            fontSize={22}
            className={cx(u.mono, u.muted)}
          >
            {chip.label}
          </text>
        </g>
      ))}
      {[0, 1, 2, 3, 4].map((i) => {
        const x = 520 + 46 * i
        const y = 482
        return (
          <g key={i}>
            <rect x={x} y={y} width={40} height={40} rx={8} className={u.s3} />
            {i > 2 && (
              <path
                d={`M ${x + 14} ${y + 19} v -4 a 6 6 0 0 1 12 0 v 4 M ${x + 12} ${y + 19} h 16 v 11 h -16 Z`}
                className={cx(u.none, u.lineStrong)}
                strokeWidth={2.5}
              />
            )}
            <g className={cx(s.a, s[`pass${i}`])}>
              <rect
                x={x}
                y={y}
                width={40}
                height={40}
                rx={8}
                className={u.acc}
              />
              <path
                d={`M ${x + 11} ${y + 21} l 6 6 l 12 -13`}
                className={cx(u.none, u.groundLine)}
                strokeWidth={3.5}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </g>
          </g>
        )
      })}
    </g>
  )
}

function Card() {
  return (
    <SceneSvg frame="card" duration={DURATION} still={STILL}>
      <Core />
    </SceneSvg>
  )
}

function Person({
  y,
  name,
  color,
}: {
  y: number
  name: string
  color: string
}) {
  return (
    <>
      <rect x={1060} y={y} width={360} height={80} rx={16} className={u.s2} />
      <circle cx={1100} cy={y + 40} r={12} className={color} />
      <text x={1126} y={y + 49} fontSize={26} className={cx(u.sans, u.ink2)}>
        {name}
      </text>
    </>
  )
}

function Hero() {
  // Core at 1.15×: x 40–760 maps to 146–974. The relay column sits right.
  return (
    <SceneSvg frame="hero" duration={DURATION} still={STILL}>
      <g transform="translate(100 155) scale(1.15)">
        <Core />
      </g>
      <line
        x1={1240}
        y1={270}
        x2={1240}
        y2={730}
        className={u.line}
        strokeWidth={2}
        strokeDasharray="4 8"
      />
      <Person y={190} name="maya" color={u.acc} />
      <rect x={1060} y={452} width={360} height={96} rx={16} className={u.s3} />
      <text
        x={1240}
        y={493}
        textAnchor="middle"
        fontSize={22}
        className={cx(u.mono, u.ink2)}
      >
        /ws/yjs/&#123;id&#125;
      </text>
      <text
        x={1240}
        y={524}
        textAnchor="middle"
        fontSize={22}
        className={cx(u.sans, u.muted)}
      >
        Forwards each update
      </text>
      <Person y={730} name="theo" color={u.ink2} />
      <circle cx={1240} cy={270} r={7} className={cx(u.acc, s.a, s.down)} />
      <circle cx={1240} cy={730} r={7} className={cx(u.ink, s.a, s.up)} />
    </SceneSvg>
  )
}

export default function TandemCodeScene({ variant }: SceneProps) {
  return (
    <SceneStage
      id="tandemcode"
      variant={variant}
      card={<Card />}
      hero={<Hero />}
    />
  )
}
