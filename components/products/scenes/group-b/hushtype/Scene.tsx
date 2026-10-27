'use client'

import type { CSSProperties } from 'react'
import { cx } from '@/components/ui/cx'
import type { SceneProps } from '../..'
import { Framings, Stage, a, C } from '../Stage'
import m from './scene.module.css'

/**
 * hushtype: hold Option-Space and speak, and the audio stays inside the
 * dotted line, on the Mac. Parakeet V3 writes the raw words, Refine strikes
 * the false start inside its deadline (the ring), and the clean line is pasted
 * into the chat at the cursor. The hero names the 2.5 s deadline and runs it
 * twice: the second time the deadline passes and the raw words are pasted
 * unchanged.
 *
 * The sentence is the one on hushtype.vercel.app's own demo.
 */
export default function HushtypeScene({ variant }: SceneProps) {
  return <Framings variant={variant} card={<Card />} hero={<Hero />} />
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
          y={y + font * 1.15}
          fontSize={font}
          textAnchor="end"
          fill={C.ink2}
        >
          ⌥
        </text>
        <text
          x={x + font * 0.6}
          y={y + h - font * 0.55}
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
        x={24}
        y={40}
        w={752}
        h={532}
        r={28}
        label="Audio stays on your Mac"
        font={36}
      />

      {/* The chat the words land in */}
      <rect x="64" y="84" width="672" height="150" rx="20" fill={C.s2} />
      <circle cx="104" cy="124" r="18" fill={C.s3} />
      <rect x="136" y="104" width="230" height="40" rx="20" fill={C.s3} />
      <rect
        x="156"
        y="120"
        width="170"
        height="8"
        rx="4"
        fill="rgba(255, 255, 255, 0.22)"
      />
      <g className={cx(a, m.cBubble)}>
        <rect x="336" y="164" width="376" height="54" rx="27" fill={C.accent} />
        <text x="356" y="203" fontSize="36" fill={C.ground}>
          Meet me at the cafe.
        </text>
      </g>

      {/* What was said, and what Refine cuts */}
      <g className={cx(a, m.cRaw)}>
        <Raw x={81} y={296} size={36} cutClass={m.cCut} cutOpacity={0.35} />
        <Strike x={81} y={296} size={36} className={m.cStrike} />
      </g>
      <text
        className={cx(a, m.cClean)}
        x="400"
        y="296"
        fontSize="36"
        textAnchor="middle"
        fill={C.ink}
        opacity="0"
      >
        Meet me at the cafe.
      </text>

      {/* The stages, all on the Mac */}
      <g stroke={C.lineStrong} strokeWidth="3">
        <line x1="320" y1="364" x2="348" y2="364" />
        <line x1="556" y1="364" x2="584" y2="364" />
      </g>
      <Chip
        x={84}
        y={336}
        w={236}
        h={56}
        label="Parakeet V3"
        font={36}
        litClass={m.cLitP}
      />
      <Chip
        x={348}
        y={336}
        w={146}
        h={56}
        label="Refine"
        font={36}
        litClass={m.cLitR}
      />
      <Ring
        cx={526}
        cy={364}
        r={17}
        dot={4}
        lit={5}
        a={m.cDot}
        b={m.still}
        step={0.2}
      />
      <Chip
        x={584}
        y={336}
        w={132}
        h={56}
        label="Paste"
        font={36}
        litClass={m.cLitV}
      />

      {/* Hold Option-Space and speak */}
      <Keys
        x={86}
        y={428}
        h={106}
        option={180}
        space={280}
        r={14}
        font={36}
        downClass={m.cDown}
        litClass={m.cLit}
      />
      <Wave
        x={600}
        cy={480}
        heights={[18, 40, 62, 32, 72, 46, 56, 26, 16]}
        bar={8}
        gap={6}
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
        y={70}
        w={1300}
        h={860}
        r={44}
        label="Audio stays on your Mac"
        font={40}
      />

      {/* Hold Option-Space and speak */}
      <Keys
        x={210}
        y={146}
        h={124}
        option={200}
        space={320}
        r={18}
        font={40}
        downClass={m.hDown}
        litClass={m.hLit}
      />
      <Wave
        x={210}
        cy={366}
        heights={[20, 44, 74, 50, 96, 64, 108, 56, 80, 40, 66, 30, 18]}
        bar={12}
        gap={14}
        className={m.hTalk}
      />

      {/* Connectors */}
      <g fill="none" stroke={C.lineStrong} strokeWidth="3">
        <path d="M345 440 V520" />
        <path d="M480 552 H520" />
        <path d="M870 552 H910" />
        <path d="M1120 520 V460" />
      </g>

      {/* The stages: speech to words, cleanup under a deadline, paste */}
      <Chip
        x={210}
        y={520}
        w={270}
        h={64}
        label="Parakeet V3"
        font={40}
        litClass={m.hLitP}
      />
      <Chip
        x={520}
        y={520}
        w={170}
        h={64}
        label="Refine"
        font={40}
        litClass={m.hLitR}
      />
      <g className={cx(a, m.hRing)}>
        <Ring
          cx={732}
          cy={552}
          r={22}
          dot={5.5}
          lit={5}
          a={m.hDotA}
          b={m.hDotB}
          step={0.2}
        />
      </g>
      <text x="770" y="566" fontSize="40" fill={C.muted}>
        2.5 s
      </text>
      <Chip
        x={910}
        y={520}
        w={420}
        h={64}
        label="Paste at the cursor"
        font={40}
        litClass={m.hLitV}
      />

      {/* The words: raw from Parakeet, struck by Refine, then the result */}
      <rect x="210" y="620" width="1200" height="250" rx="26" fill={C.s2} />
      <g className={cx(a, m.hRawP)}>
        <Raw x={250} y={706} size={42} cutClass={m.hCut} cutOpacity={0.35} />
        <Strike x={250} y={706} size={42} className={m.hStrike} />
      </g>
      <path d="M250 748 H1370" stroke={C.line} strokeWidth="2" />
      <text
        className={cx(a, m.hOut1)}
        x="250"
        y="818"
        fontSize="42"
        fill={C.accent}
      >
        Meet me at the cafe.
      </text>
      <g className={cx(a, m.hOut2)} opacity="0">
        <Raw x={250} y={818} size={42} cutClass={m.still} />
      </g>
      <text
        className={cx(a, m.hLabelRaw)}
        x="1370"
        y="818"
        fontSize="38"
        textAnchor="end"
        fill={C.accent}
        opacity="0"
      >
        Raw text kept
      </text>

      {/* The chat */}
      <rect x="830" y="130" width="580" height="330" rx="26" fill={C.s2} />
      <circle cx="878" cy="182" r="24" fill={C.s3} />
      <rect x="918" y="154" width="260" height="56" rx="28" fill={C.s3} />
      <rect
        x="944"
        y="177"
        width="190"
        height="10"
        rx="5"
        fill="rgba(255, 255, 255, 0.22)"
      />
      <g className={cx(a, m.hBubble1)}>
        <rect x="990" y="236" width="400" height="64" rx="32" fill={C.accent} />
        <text x="1014" y="281" fontSize="38" fill={C.ground}>
          Meet me at the cafe.
        </text>
      </g>
      <g className={cx(a, m.hBubble2)} opacity="0">
        <rect
          x="940"
          y="318"
          width="450"
          height="116"
          rx="30"
          fill={C.accent}
        />
        <text x="964" y="365" fontSize="38" fill={C.ground}>
          meet me at the library,
        </text>
        <text x="964" y="413" fontSize="38" fill={C.ground}>
          actually the cafe
        </text>
      </g>
    </Stage>
  )
}
