import type { SceneProps } from '..'
import { cx } from '@/components/ui/cx'
import { SceneStage, SceneSvg } from './Stage'
import u from './ui.module.css'
import s from './TandemCodeScene.module.css'

/*
 * TandemCode is a shared editor for practising interview problems with a
 * partner. The code, the two names, their colours and the order of turns
 * are the site's own hero demo (apps/web/src/components/heroDemo.ts): maya
 * and theo write two_sum line by line in one document, each with a labelled
 * cursor. Run sends it to a sandbox container under gVisor, the visible
 * tests and the locked hidden tests pass one by one, and the verdict reaches
 * both of them. The hero adds the room's Yjs relay, which forwards every
 * update between the two browsers.
 */

const DURATION = 14
const STILL = 0.86

type Who = 'a' | 'b'
const CODE: { who: Who; indent: number; text: string }[] = [
  { who: 'a', indent: 0, text: 'def two_sum(nums, target):' },
  { who: 'a', indent: 1, text: 'seen = {}' },
  { who: 'b', indent: 1, text: 'for i, n in enumerate(nums):' },
  { who: 'b', indent: 2, text: 'if target - n in seen:' },
  { who: 'a', indent: 3, text: 'return [seen[target - n], i]' },
  { who: 'b', indent: 2, text: 'seen[n] = i' },
]

const PEOPLE: Record<Who, { name: string; color: string }> = {
  a: { name: 'maya', color: u.acc },
  b: { name: 'theo', color: s.partner },
}

const KEYWORDS = ['def', 'for', 'in', 'if', 'return']
const BRIGHT = new Set(KEYWORDS)
const BRIGHT_WORD = new Set(KEYWORDS.concat('two_sum', 'enumerate'))

/** Splits a line into runs of bright (keywords, names) and plain text. */
function runs(text: string) {
  const out: [string, boolean][] = []
  for (const t of text.match(/\w+|\s+|[^\w\s]/g) ?? []) {
    const bright = BRIGHT_WORD.has(t)
    const last = out[out.length - 1]
    if (last && (last[1] === bright || /^\s+$/.test(t))) last[0] += t
    else out.push([t, bright])
  }
  return out
}

/**
 * Where the code sits in one framing. `bars` lists the lines drawn as
 * skeleton bars (`bar` units per character) instead of text: at card size
 * only the short lines fit as legible text.
 */
interface Layout {
  x: number
  y: number
  pitch: number
  size: number
  tab: number
  bars: number[]
  bar: number
}

const CARD: Layout = {
  x: 52,
  y: 142,
  pitch: 46,
  size: 36,
  tab: 86.4,
  bars: [2, 3, 4],
  bar: 11,
}
const HERO: Layout = {
  x: 220,
  y: 322,
  pitch: 64,
  size: 40,
  tab: 96,
  bars: [],
  bar: 0,
}

const lineX = (l: Layout, k: number) => l.x + l.tab * CODE[k].indent
const lineY = (l: Layout, k: number) => l.y + l.pitch * k
const lineEnd = (l: Layout, k: number) =>
  lineX(l, k) +
  (l.bars.includes(k) ? l.bar : 0.6 * l.size) * CODE[k].text.length

/** A line as bars: each keyword, and each run of text between them. */
function segments(text: string) {
  const out: { at: number; len: number; kw: boolean }[] = []
  let at = 0
  for (const word of text.split(' ')) {
    const kw = BRIGHT.has(word)
    const last = out[out.length - 1]
    if (last && !kw && !last.kw) last.len = at + word.length - last.at
    else out.push({ at, len: word.length, kw })
    at += word.length + 1
  }
  return out
}

function Line({ l, k }: { l: Layout; k: number }) {
  const x = lineX(l, k)
  const y = lineY(l, k)
  if (l.bars.includes(k)) {
    return (
      <>
        {segments(CODE[k].text).map(({ at, len, kw }) => (
          <rect
            key={at}
            x={x + l.bar * at}
            y={y - 19}
            width={l.bar * len}
            height={14}
            rx={7}
            className={kw ? u.ink2 : u.muted}
          />
        ))}
      </>
    )
  }
  return (
    <text x={x} y={y} fontSize={l.size} className={cx(u.mono, u.pre)}>
      {runs(CODE[k].text).map(([t, bright], i) => (
        <tspan key={i} className={bright ? u.ink : u.ink2}>
          {t}
        </tspan>
      ))}
    </text>
  )
}

/** A cursor with its name flag, at the end of its owner's last line. */
function Caret({ l, k, cls }: { l: Layout; k: number; cls: string }) {
  const { name, color } = PEOPLE[CODE[k].who]
  const x = lineEnd(l, k) + 3
  const y = lineY(l, k)
  const w = 3.1 * l.size
  return (
    <g className={cx(s.a, cls)}>
      <rect
        x={x}
        y={y - 0.8 * l.size}
        width={l.size / 10}
        height={l.size}
        className={color}
      />
      <rect
        x={x + 0.25 * l.size}
        y={y - 0.95 * l.size}
        width={w}
        height={1.2 * l.size}
        rx={6}
        className={color}
      />
      <text
        x={x + 0.25 * l.size + w / 2}
        y={y}
        textAnchor="middle"
        fontSize={l.size}
        className={cx(u.sans, u.ground)}
      >
        {name}
      </text>
    </g>
  )
}

/**
 * The six lines, each with the typing mask that reveals it, and both
 * cursors. Drawn from the last line up, so a mask never hides the
 * descenders of the line above it.
 */
function Code({ l, carets }: { l: Layout; carets: [string, string] }) {
  return (
    <>
      {CODE.map((_, k) => CODE.length - 1 - k).map((k) => (
        <g key={k}>
          <Line l={l} k={k} />
          <rect
            x={lineX(l, k) - 4}
            y={lineY(l, k) - 0.92 * l.size}
            width={lineEnd(l, k) - lineX(l, k) + 10}
            height={1.2 * l.size}
            className={cx(u.s2, s.a, s[`type${k}`])}
          />
        </g>
      ))}
      <Caret l={l} k={4} cls={carets[0]} />
      <Caret l={l} k={5} cls={carets[1]} />
    </>
  )
}

function RunButton({
  x,
  y,
  w,
  h,
  size,
}: {
  x: number
  y: number
  w: number
  h: number
  size: number
}) {
  return (
    <g className={cx(s.a, s.run)}>
      <rect x={x} y={y} width={w} height={h} rx={h / 2} className={u.s3} />
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx={h / 2}
        className={cx(u.acc, s.a, s.runFill)}
      />
      <text
        x={x + w / 2}
        y={y + h / 2 + 0.36 * size}
        textAnchor="middle"
        fontSize={size}
        className={cx(u.sans, u.ink)}
      >
        Run
      </text>
    </g>
  )
}

/** Five tests, the last two hidden (locked). Each turns accent as it passes. */
function Tests({
  x,
  y,
  size,
  gap,
}: {
  x: number
  y: number
  size: number
  gap: number
}) {
  const k = size / 40
  return (
    <>
      {[0, 1, 2, 3, 4].map((i) => {
        const tx = x + (size + gap) * i
        return (
          <g key={i}>
            <rect
              x={tx}
              y={y}
              width={size}
              height={size}
              rx={8}
              className={u.s3}
            />
            {i > 2 && (
              <path
                d={`M ${tx + 14 * k} ${y + 19 * k} v ${-4 * k} a ${6 * k} ${6 * k} 0 0 1 ${12 * k} 0 v ${4 * k} M ${tx + 12 * k} ${y + 19 * k} h ${16 * k} v ${11 * k} h ${-16 * k} Z`}
                className={cx(u.none, u.lineStrong)}
                strokeWidth={2.5}
              />
            )}
            <g className={cx(s.a, s[`pass${i}`])}>
              <rect
                x={tx}
                y={y}
                width={size}
                height={size}
                rx={8}
                className={u.acc}
              />
              <path
                d={`M ${tx + 11 * k} ${y + 21 * k} l ${6 * k} ${6 * k} l ${12 * k} ${-13 * k}`}
                className={cx(u.none, u.groundLine)}
                strokeWidth={3.5}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </g>
          </g>
        )
      })}
    </>
  )
}

function Card() {
  return (
    <SceneSvg frame="card" duration={DURATION} still={STILL}>
      {/* The room's one editor */}
      <rect x={24} y={16} width={752} height={380} rx={16} className={u.s2} />
      <text x={52} y={66} fontSize={36} className={cx(u.mono, u.ink2)}>
        two_sum.py
      </text>
      <RunButton x={648} y={28} w={104} h={48} size={36} />
      <line
        x1={24}
        y1={92}
        x2={776}
        y2={92}
        className={u.line}
        strokeWidth={2}
      />
      <circle cx={700} cy={92} r={8} className={cx(u.acc, s.a, s.pulse)} />
      <Code l={CARD} carets={[s.caretA, s.caretB]} />

      {/* The judge's sandbox, then the verdict both of them see */}
      <rect x={24} y={412} width={752} height={172} rx={16} className={u.s2} />
      <text x={52} y={472} fontSize={36} className={cx(u.sans, u.ink2)}>
        gVisor
      </text>
      <Tests x={454} y={438} size={44} gap={12} />
      <g className={cx(s.a, s.accepted)}>
        <rect
          x={52}
          y={512}
          width={276}
          height={52}
          rx={26}
          className={u.accDim}
        />
        <text x={76} y={551} fontSize={36} className={cx(u.sans, u.acc)}>
          Accepted
        </text>
      </g>
      <circle cx={268} cy={538} r={12} className={cx(u.acc, s.a, s.seenA)} />
      <circle
        cx={302}
        cy={538}
        r={12}
        className={cx(s.partner, s.a, s.seenB)}
      />
    </SceneSvg>
  )
}

function Person({ x, who }: { x: number; who: Who }) {
  const { name, color } = PEOPLE[who]
  return (
    <>
      <rect x={x} y={85} width={232} height={72} rx={36} className={u.s2} />
      <circle cx={x + 44} cy={121} r={14} className={color} />
      <text x={x + 72} y={135} fontSize={40} className={cx(u.sans, u.ink2)}>
        {name}
      </text>
    </>
  )
}

function Hero() {
  return (
    <SceneSvg frame="hero" duration={DURATION} still={STILL}>
      {/* Two browsers in one room. The relay only forwards each update. */}
      {[
        [416, 620],
        [980, 1184],
      ].map(([x1, x2]) => (
        <line
          key={x1}
          x1={x1}
          y1={121}
          x2={x2}
          y2={121}
          className={u.lineStrong}
          strokeWidth={2}
          strokeDasharray="4 8"
        />
      ))}
      <circle cx={426} cy={121} r={8} className={cx(u.acc, s.a, s.toTheo)} />
      <circle
        cx={1174}
        cy={121}
        r={8}
        className={cx(s.partner, s.a, s.toMaya)}
      />
      <Person x={184} who="a" />
      <rect x={620} y={85} width={360} height={72} rx={16} className={u.s3} />
      <text
        x={800}
        y={135}
        textAnchor="middle"
        fontSize={40}
        className={cx(u.sans, u.ink2)}
      >
        Yjs relay
      </text>
      <Person x={1184} who="b" />

      {/* The shared editor */}
      <rect
        x={184}
        y={185}
        width={1232}
        height={590}
        rx={18}
        className={u.s2}
      />
      <text x={220} y={238} fontSize={40} className={cx(u.mono, u.ink2)}>
        two_sum.py
      </text>
      <RunButton x={1280} y={200} w={120} h={52} size={40} />
      <line
        x1={184}
        y1={266}
        x2={1416}
        y2={266}
        className={u.line}
        strokeWidth={2}
      />
      <line
        x1={184}
        y1={680}
        x2={1416}
        y2={680}
        className={u.line}
        strokeWidth={2}
      />
      <circle
        cx={1340}
        cy={266}
        r={9}
        className={cx(u.acc, s.a, s.heroPulse)}
      />
      <Code l={HERO} carets={[s.heroCaretA, s.heroCaretB]} />
      <text
        x={220}
        y={742}
        fontSize={40}
        className={cx(u.sans, u.muted, s.a, s.ready)}
      >
        Ready when you both are.
      </text>
      <g className={cx(s.a, s.accepted)}>
        <rect
          x={212}
          y={700}
          width={232}
          height={56}
          rx={28}
          className={u.accDim}
        />
        <text
          x={328}
          y={742}
          textAnchor="middle"
          fontSize={40}
          className={cx(u.sans, u.acc)}
        >
          Accepted
        </text>
        <text
          x={1284}
          y={742}
          textAnchor="end"
          fontSize={40}
          className={cx(u.sans, u.muted)}
        >
          seen by
        </text>
      </g>
      <circle cx={1318} cy={728} r={16} className={cx(u.acc, s.a, s.seenA)} />
      <circle
        cx={1366}
        cy={728}
        r={16}
        className={cx(s.partner, s.a, s.seenB)}
      />

      {/* The judge's sandbox */}
      <rect
        x={184}
        y={803}
        width={1232}
        height={112}
        rx={18}
        className={u.s2}
      />
      <text x={220} y={873} fontSize={40} className={cx(u.sans, u.ink2)}>
        gVisor
      </text>
      {[
        { x: 364, w: 343, label: '--network none' },
        { x: 723, w: 275, label: '--read-only' },
      ].map((chip) => (
        <g key={chip.label}>
          <rect
            x={chip.x}
            y={831}
            width={chip.w}
            height={56}
            rx={28}
            className={u.s3}
          />
          <text
            x={chip.x + chip.w / 2}
            y={872}
            textAnchor="middle"
            fontSize={38}
            className={cx(u.mono, u.muted)}
          >
            {chip.label}
          </text>
        </g>
      ))}
      <Tests x={1066} y={833} size={52} gap={10} />
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
