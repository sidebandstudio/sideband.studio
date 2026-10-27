'use client'

import type { CSSProperties } from 'react'
import { cx } from '@/components/ui/cx'
import type { SceneProps } from '../..'
import { Stage, a, C } from '../Stage'
import m from './scene.module.css'

/**
 * hushtype: hold Option-Space and speak, and everything happens inside the
 * dotted line, on the Mac. Parakeet V3 writes the raw words, Refine strikes
 * the false start inside its 2.5 s deadline (the ring), and the clean line is
 * pasted into the chat at the cursor. The hero runs it twice: the second time
 * the deadline passes and the raw words are pasted unchanged.
 *
 * The sentence is the one on hushtype.vercel.app's own demo.
 */
export default function HushtypeScene({ variant }: SceneProps) {
  return variant === 'hero' ? <Hero /> : <Card />
}

const delay = (s: number) => ({ animationDelay: `${s}s` }) as CSSProperties

/** Widths of the sentence's parts per unit of font size, in Hanken Grotesk. */
const W = { head: 5.014, cut: 8.616, tail: 3.589, space: 0.259 }

/** "meet me at the library, actually the cafe", with the cut part separable. */
function Raw({
  x,
  y,
  size,
  cutClass,
  cutOpacity = 1,
}: {
  x: number
  y: number
  size: number
  cutClass: string
  cutOpacity?: number
}) {
  const cutX = x + (W.head + W.space) * size
  const tailX = cutX + (W.cut + W.space) * size
  return (
    <g fontSize={size} fill={C.ink}>
      <text x={x} y={y}>
        meet me at
      </text>
      <text className={cx(a, cutClass)} x={cutX} y={y} opacity={cutOpacity}>
        the library, actually
      </text>
      <text x={tailX} y={y}>
        the cafe
      </text>
    </g>
  )
}

/** The struck-through line over "the library, actually". */
function Strike({
  x,
  y,
  size,
  className,
}: {
  x: number
  y: number
  size: number
  className: string
}) {
  const cutX = x + (W.head + W.space) * size
  return (
    <rect
      className={cx(a, className)}
      x={cutX - 4}
      y={y - size * 0.34}
      width={W.cut * size + 8}
      height={Math.max(3, size / 9)}
      rx="1.5"
      fill={C.accent}
    />
  )
}

/** Option and Space, drawn as keycaps that press down together. */
function Keys({
  x,
  y,
  h,
  option,
  space,
  r,
  font,
  downClass,
  litClass,
}: {
  x: number
  y: number
  h: number
  option: number
  space: number
  r: number
  font: number
  downClass: string
  litClass: string
}) {
  const gap = h * 0.2
  const keys = [
    { kx: x, w: option },
    { kx: x + option + gap, w: space },
  ]
  return (
    <g>
      {keys.map(({ kx, w }) => (
        <rect
          key={kx}
          x={kx}
          y={y + h * 0.08}
          width={w}
          height={h}
          rx={r}
          fill={C.s2}
        />
      ))}
      <g className={cx(a, downClass)}>
        {keys.map(({ kx, w }) => (
          <g key={kx}>
            <rect x={kx} y={y} width={w} height={h} rx={r} fill={C.s3} />
            <rect
              className={cx(a, litClass)}
              x={kx}
              y={y}
              width={w}
              height={h}
              rx={r}
              fill={C.accent}
              opacity="0"
            />
          </g>
        ))}
        <text
          x={x + option - font * 0.6}
          y={y + font * 1.3}
          fontSize={font}
          textAnchor="end"
          fill={C.ink2}
        >
          ⌥
        </text>
        <text
          x={x + font * 0.6}
          y={y + h - font * 0.6}
          fontSize={font}
          fill={C.ink2}
        >
          option
        </text>
      </g>
    </g>
  )
}

/** Microphone level: bars that move only while the keys are held. */
function Wave({
  x,
  cy,
  heights,
  bar,
  gap,
  className,
}: {
  x: number
  cy: number
  heights: number[]
  bar: number
  gap: number
  className: string
}) {
  return (
    <g fill={C.accent}>
      {heights.map((h, i) => (
        <rect
          key={i}
          className={cx(a, className)}
          style={delay(i * 0.09)}
          x={x + i * (bar + gap)}
          y={cy - h / 2}
          width={bar}
          height={h}
          rx={bar / 2}
        />
      ))}
    </g>
  )
}

/** The deadline ring: eight dots, lit one by one while Refine works. */
function Ring({
  cx: x,
  cy: y,
  r,
  dot,
  lit,
  a: litA,
  b: litB,
  step,
}: {
  cx: number
  cy: number
  r: number
  dot: number
  lit: number
  a: string
  b: string
  step: number
}) {
  return (
    <g fill={C.accent}>
      {Array.from({ length: 8 }, (_, i) => {
        const t = (i / 8) * Math.PI * 2 - Math.PI / 2
        return (
          <circle
            key={i}
            className={cx(a, i < 5 ? litA : litB)}
            style={delay(i * step)}
            cx={x + r * Math.cos(t)}
            cy={y + r * Math.sin(t)}
            r={dot}
            opacity={i < lit ? 1 : 0.25}
          />
        )
      })}
    </g>
  )
}

/** The dotted line round the scene: the Mac, which the audio never leaves. */
function Boundary({
  x,
  y,
  w,
  h,
  r,
  label,
  font,
}: {
  x: number
  y: number
  w: number
  h: number
  r: number
  label: string
  font: number
}) {
  const tabW = label.length * font * 0.56 + font * 1.6
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx={r}
        fill="none"
        stroke={C.accent}
        strokeOpacity="0.4"
        strokeWidth={font / 7}
        strokeDasharray={`0.1 ${font / 2}`}
        strokeLinecap="round"
      />
      <rect
        x={x + w / 2 - tabW / 2}
        y={y - font * 0.75}
        width={tabW}
        height={font * 1.5}
        fill={C.s1}
      />
      <text
        x={x + w / 2}
        y={y + font * 0.35}
        fontSize={font}
        textAnchor="middle"
        fill={C.accent}
      >
        {label}
      </text>
    </g>
  )
}

function Chip({
  x,
  y,
  w,
  h,
  label,
  font,
  litClass,
}: {
  x: number
  y: number
  w: number
  h: number
  label: string
  font: number
  litClass: string
}) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={h / 2} fill={C.s2} />
      <rect
        className={cx(a, litClass)}
        x={x}
        y={y}
        width={w}
        height={h}
        rx={h / 2}
        fill={C.accent}
        fillOpacity="0.2"
        stroke={C.accent}
        strokeOpacity="0.6"
        strokeWidth="2"
        opacity="0"
      />
      <text
        x={x + w / 2}
        y={y + h / 2 + font * 0.36}
        fontSize={font}
        textAnchor="middle"
        fill={C.ink}
      >
        {label}
      </text>
    </g>
  )
}

function Card() {
  return (
    <Stage id="hushtype" variant="card" loop={12}>
      <Boundary
        x={28}
        y={30}
        w={744}
        h={542}
        r={28}
        label="On your Mac"
        font={22}
      />

      {/* The chat the words land in */}
      <rect x="72" y="64" width="656" height="172" rx="20" fill={C.s2} />
      <circle cx="110" cy="100" r="15" fill={C.s3} />
      <text x="136" y="108" fontSize="22" fill={C.ink2}>
        Nora
      </text>
      <rect x="96" y="128" width="240" height="40" rx="20" fill={C.s3} />
      <rect
        x="116"
        y="144"
        width="176"
        height="8"
        rx="4"
        fill="rgba(255, 255, 255, 0.22)"
      />
      <g className={cx(a, m.cBubble)}>
        <rect x="454" y="178" width="250" height="44" rx="22" fill={C.accent} />
        <text x="470" y="208" fontSize="24" fill={C.ground}>
          Meet me at the cafe.
        </text>
      </g>

      {/* What was said, and what Refine cuts */}
      <g className={cx(a, m.cRaw)}>
        <Raw x={170} y={306} size={26} cutClass={m.cCut} cutOpacity={0.35} />
        <Strike x={170} y={306} size={26} className={m.cStrike} />
      </g>
      <text
        className={cx(a, m.cClean)}
        x="400"
        y="306"
        fontSize="26"
        textAnchor="middle"
        fill={C.ink}
        opacity="0"
      >
        Meet me at the cafe.
      </text>

      {/* The stages, all on the Mac */}
      <g stroke={C.lineStrong} strokeWidth="3">
        <line x1="320" y1="372" x2="354" y2="372" />
        <line x1="509" y1="372" x2="540" y2="372" />
      </g>
      <Chip
        x={170}
        y={350}
        w={150}
        h={44}
        label="Parakeet V3"
        font={22}
        litClass={m.cLitP}
      />
      <Chip
        x={354}
        y={350}
        w={104}
        h={44}
        label="Refine"
        font={22}
        litClass={m.cLitR}
      />
      <Ring
        cx={484}
        cy={372}
        r={15}
        dot={3.6}
        lit={5}
        a={m.cDot}
        b={m.still}
        step={0.2}
      />
      <Chip
        x={540}
        y={350}
        w={96}
        h={44}
        label="Paste"
        font={22}
        litClass={m.cLitV}
      />

      {/* Hold Option-Space and speak */}
      <Keys
        x={136}
        y={436}
        h={70}
        option={130}
        space={255}
        r={12}
        font={20}
        downClass={m.cDown}
        litClass={m.cLit}
      />
      <Wave
        x={568}
        cy={474}
        heights={[14, 30, 46, 24, 54, 34, 42, 20, 12]}
        bar={6}
        gap={5}
        className={m.cTalk}
      />
    </Stage>
  )
}

function Hero() {
  return (
    <Stage id="hushtype" variant="hero" loop={18}>
      <Boundary
        x={150}
        y={80}
        w={1300}
        h={840}
        r={44}
        label="Runs on your Mac"
        font={28}
      />

      <g transform="translate(0 80)">
        {/* Hold Option-Space and speak */}
        <Wave
          x={214}
          cy={250}
          heights={[18, 40, 70, 46, 90, 60, 104, 52, 76, 34, 20]}
          bar={10}
          gap={14}
          className={m.hTalk}
        />
        <Keys
          x={200}
          y={500}
          h={90}
          option={128}
          space={190}
          r={16}
          font={24}
          downClass={m.hDown}
          litClass={m.hLit}
        />
        <text x="200" y="650" fontSize="22" fill={C.muted}>
          Hold Option-Space, speak
        </text>

        {/* Connectors */}
        <g fill="none" stroke={C.lineStrong} strokeWidth="3">
          <path d="M490 250 H560" />
          <path d="M805 300 V340" />
          <path d="M805 560 V600" />
          <path d="M1050 655 H1080 V380 H1110" />
        </g>

        {/* Stage 1: speech to raw words */}
        <rect x="560" y="140" width="490" height="160" rx="22" fill={C.s2} />
        <rect
          className={cx(a, m.hLitP)}
          x="560"
          y="140"
          width="490"
          height="160"
          rx="22"
          fill={C.accent}
          fillOpacity="0.12"
          stroke={C.accent}
          strokeOpacity="0.5"
          strokeWidth="2"
          opacity="0"
        />
        <text x="592" y="190" fontSize="26" fontWeight="500" fill={C.ink}>
          Parakeet V3
        </text>
        <text x="1018" y="190" fontSize="22" textAnchor="end" fill={C.muted}>
          Speech to text
        </text>
        <g className={cx(a, m.hRawP)}>
          <Raw x={592} y={262} size={24} cutClass={m.still} />
        </g>

        {/* Stage 2: Refine, under a deadline */}
        <rect x="560" y="340" width="490" height="220" rx="22" fill={C.s2} />
        <rect
          className={cx(a, m.hLitR)}
          x="560"
          y="340"
          width="490"
          height="220"
          rx="22"
          fill={C.accent}
          fillOpacity="0.12"
          stroke={C.accent}
          strokeOpacity="0.5"
          strokeWidth="2"
          opacity="0"
        />
        <text x="592" y="390" fontSize="26" fontWeight="500" fill={C.ink}>
          Refine
        </text>
        <text
          className={cx(a, m.hLabel)}
          x="682"
          y="390"
          fontSize="22"
          fill={C.muted}
        >
          Messaging mode
        </text>
        <g className={cx(a, m.hRing)}>
          <Ring
            cx={1000}
            cy={382}
            r={20}
            dot={4.5}
            lit={5}
            a={m.hDotA}
            b={m.hDotB}
            step={0.2}
          />
        </g>
        <text x="962" y="390" fontSize="22" textAnchor="end" fill={C.muted}>
          2.5 s
        </text>
        <text
          className={cx(a, m.hLabelRaw)}
          x="682"
          y="390"
          fontSize="22"
          fill={C.accent}
          opacity="0"
        >
          Raw text kept
        </text>
        <g className={cx(a, m.hInput)}>
          <Raw x={592} y={456} size={24} cutClass={m.hCut} cutOpacity={0.35} />
          <Strike x={592} y={456} size={24} className={m.hStrike} />
        </g>
        <path d="M592 482 H1018" stroke={C.line} strokeWidth="2" />
        <text
          className={cx(a, m.hOut1)}
          x="592"
          y="526"
          fontSize="24"
          fill={C.accent}
        >
          Meet me at the cafe.
        </text>
        <g className={cx(a, m.hOut2)} opacity="0">
          <Raw x={592} y={526} size={24} cutClass={m.still} />
        </g>

        {/* Stage 3: paste at the cursor */}
        <rect x="560" y="600" width="490" height="110" rx="22" fill={C.s2} />
        <rect
          className={cx(a, m.hLitV)}
          x="560"
          y="600"
          width="490"
          height="110"
          rx="22"
          fill={C.accent}
          fillOpacity="0.12"
          stroke={C.accent}
          strokeOpacity="0.5"
          strokeWidth="2"
          opacity="0"
        />
        <text x="592" y="664" fontSize="26" fontWeight="500" fill={C.ink}>
          Paste at the cursor
        </text>
        <rect x="1006" y="634" width="4" height="42" rx="2" fill={C.accent} />

        {/* The chat */}
        <rect x="1110" y="140" width="300" height="570" rx="26" fill={C.s2} />
        <circle cx="1152" cy="186" r="20" fill={C.s3} />
        <text x="1184" y="194" fontSize="24" fill={C.ink2}>
          Nora
        </text>
        <rect x="1130" y="236" width="210" height="52" rx="26" fill={C.s3} />
        <rect
          x="1154"
          y="257"
          width="150"
          height="10"
          rx="5"
          fill="rgba(255, 255, 255, 0.22)"
        />
        <g className={cx(a, m.hBubble1)}>
          <rect
            x="1140"
            y="320"
            width="250"
            height="52"
            rx="26"
            fill={C.accent}
          />
          <text x="1159" y="354" fontSize="24" fill={C.ground}>
            Meet me at the cafe.
          </text>
        </g>
        <g className={cx(a, m.hBubble2)} opacity="0">
          <rect
            x="1118"
            y="392"
            width="282"
            height="88"
            rx="26"
            fill={C.accent}
          />
          <text x="1138" y="428" fontSize="24" fill={C.ground}>
            meet me at the library,
          </text>
          <text x="1138" y="460" fontSize="24" fill={C.ground}>
            actually the cafe
          </text>
        </g>
      </g>
    </Stage>
  )
}
