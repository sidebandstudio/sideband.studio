'use client'

import { type CSSProperties } from 'react'
import { cx } from '@/components/ui/cx'
import type { SceneProps } from '../..'
import { Framings, Stage, a, mono, C } from '../Stage'
import m from './scene.module.css'

/**
 * Signature Cuts 413: the booking form on a customer's phone. A 30-minute
 * slot snaps to 11:00 AM, Send via Text Message folds the form into one text,
 * and it goes straight to the barber's own phone, with no server in between.
 * The hero shows the sms: link switching its separator for iPhone (&body=)
 * and Android (?body=), and the WhatsApp link as the other way out.
 *
 * Every string is from the site: the form's heading, labels and buttons, its
 * 30-minute slots, and the lines composeMessage() writes. Labels are at least
 * 36 units in the card and 38 in the hero, so they stay 12px or larger.
 */
export default function SignatureCutsScene({ variant }: SceneProps) {
  return <Framings variant={variant} card={<Card />} hero={<Hero />} />
}

/**
 * The shop's mark: an SC monogram in the site's cream and quartz, with a
 * diagonal razor cut through both letters. Drawn by Sideband, since the site
 * ships no icon. The tile version is ./mark.svg, which is the product icon.
 * `cut` is the colour behind the mark, so the cut reads as a gap.
 */
export function SignatureCutsMark({
  x,
  y,
  size,
  cut,
}: {
  x: number
  y: number
  size: number
  cut: string
}) {
  return (
    <svg x={x} y={y} width={size} height={size} viewBox="40 60 432 392">
      <g fill="none" strokeWidth="58">
        <path
          stroke={C.ink}
          d="M215 190 V164 A63 63 0 0 0 89 164 V193 A63 63 0 0 0 152 256 A63 63 0 0 1 215 319 V348 A63 63 0 0 1 89 348 V322"
        />
        <path
          stroke={C.accent}
          d="M423 190 V164 A63 63 0 0 0 297 164 V348 A63 63 0 0 0 423 348 V322"
        />
      </g>
      <path d="M30 400 L482 140" stroke={cut} strokeWidth="20" />
    </svg>
  )
}

/** A phone body with its screen. */
function Phone({
  x,
  y,
  w,
  h,
  r,
  inset,
}: {
  x: number
  y: number
  w: number
  h: number
  r: number
  inset: number
}) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={r} fill={C.s3} />
      <rect
        x={x + inset}
        y={y + inset}
        width={w - inset * 2}
        height={h - inset * 2}
        rx={r - inset}
        fill={C.ground}
      />
      <rect
        x={x + w / 2 - w * 0.16}
        y={y + inset + 10}
        width={w * 0.32}
        height={inset * 1.6}
        rx={inset * 0.8}
        fill={C.s3}
      />
    </g>
  )
}

function Field({
  x,
  y,
  w,
  h,
  text,
  font,
}: {
  x: number
  y: number
  w: number
  h: number
  text: string
  font: number
}) {
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx={h * 0.28}
        fill={C.s1}
        stroke={C.lineStrong}
        strokeWidth="2"
      />
      <text
        x={x + font * 0.6}
        y={y + h / 2 + font * 0.36}
        fontSize={font}
        fill={C.ink}
      >
        {text}
      </text>
    </g>
  )
}

/**
 * A column of 30-minute slots. The lit pill snaps from the first slot to the
 * second, 11:00 AM.
 */
function Slots({
  x,
  y,
  w,
  h,
  gap,
  font,
  times,
}: {
  x: number
  y: number
  w: number
  h: number
  gap: number
  font: number
  times: string[]
}) {
  const py = (i: number) => y + i * (h + gap)
  return (
    <g>
      {times.map((t, i) => (
        <g key={t}>
          <rect
            x={x}
            y={py(i)}
            width={w}
            height={h}
            rx={h * 0.3}
            fill="none"
            stroke={C.lineStrong}
            strokeWidth="2"
          />
          <text
            x={x + w / 2}
            y={py(i) + h / 2 + font * 0.36}
            fontSize={font}
            textAnchor="middle"
            fill={C.muted}
          >
            {t}
          </text>
        </g>
      ))}
      <g
        className={cx(a, m.slot)}
        style={{ '--sy': `${py(0) - py(1)}px` } as CSSProperties}
      >
        <rect
          x={x}
          y={py(1)}
          width={w}
          height={h}
          rx={h * 0.3}
          fill={C.accent}
        />
        <text
          className={cx(a, m.slotText)}
          x={x + w / 2}
          y={py(1) + h / 2 + font * 0.36}
          fontSize={font}
          fontWeight="500"
          textAnchor="middle"
          fill={C.ground}
        >
          11:00 AM
        </text>
      </g>
    </g>
  )
}

/** A form button whose label, "Send via …", wraps onto two lines. */
function Button({
  x,
  y,
  w,
  h,
  font,
  label,
  lit,
}: {
  x: number
  y: number
  w: number
  h: number
  font: number
  label: string
  lit?: boolean
}) {
  const cx0 = x + w / 2
  const top = y + h / 2 - font * 0.2
  return (
    <g>
      {lit ? (
        <>
          <rect
            x={x}
            y={y}
            width={w}
            height={h}
            rx={h * 0.22}
            fill="none"
            stroke={C.lineStrong}
            strokeWidth="2"
          />
          <g className={cx(a, m.press)}>
            <rect
              x={x}
              y={y}
              width={w}
              height={h}
              rx={h * 0.22}
              fill={C.accent}
              fillOpacity="0.16"
              stroke={C.accent}
              strokeWidth="2.5"
            />
          </g>
        </>
      ) : (
        <rect x={x} y={y} width={w} height={h} rx={h * 0.22} fill={C.s3} />
      )}
      <text
        x={cx0}
        y={top}
        fontSize={font}
        textAnchor="middle"
        fill={lit ? C.ink : C.ink2}
      >
        Send via
      </text>
      <text
        x={cx0}
        y={top + font * 1.2}
        fontSize={font}
        textAnchor="middle"
        fill={lit ? C.ink : C.ink2}
      >
        {label}
      </text>
    </g>
  )
}

/**
 * The text the barber receives, as composeMessage() writes it. Its opening
 * line ("Hey, I'd like to book an appointment.") is drawn as a bar.
 */
function Received({
  x,
  y,
  w,
  font,
  lines,
}: {
  x: number
  y: number
  w: number
  font: number
  lines: string[]
}) {
  const pad = font * 0.55
  const lh = font * 1.38
  const top = font * 1.3
  const h = top + lines.length * lh + font * 0.5
  return (
    <g className={cx(a, m.land)}>
      <rect x={x} y={y} width={w} height={h} rx={font * 0.6} fill={C.s3} />
      <rect
        x={x + pad}
        y={y + font * 0.6}
        width={w * 0.62}
        height={font * 0.38}
        rx={font * 0.19}
        fill="rgba(255, 255, 255, 0.3)"
      />
      {lines.map((l, i) => (
        <text
          key={l}
          x={x + pad}
          y={y + top + i * lh + font * 0.95}
          fontSize={font}
          fill={C.ink}
        >
          {l}
        </text>
      ))}
    </g>
  )
}

function Card() {
  return (
    <Stage id="signature-cuts" variant="card" loop={12}>
      {/* The customer's phone, with the booking form */}
      <Phone x={36} y={28} w={340} h={544} r={44} inset={12} />
      <g className={cx(a, m.form)}>
        <SignatureCutsMark x={64} y={86} size={46} cut={C.ground} />
        <text x="122" y="122" fontSize="36" fontWeight="600" fill={C.ink}>
          BOOK NOW
        </text>
        <Field x={64} y={152} w={284} h={66} text="Steve" font={36} />
        <Slots
          x={64}
          y={238}
          w={284}
          h={60}
          gap={12}
          font={36}
          times={['10:30 AM', '11:00 AM']}
        />
      </g>
      <Button
        x={64}
        y={392}
        w={284}
        h={112}
        font={36}
        label="Text Message"
        lit
      />

      {/* Phone to phone */}
      <path
        d="M330 448 C 400 448, 380 242, 452 242"
        fill="none"
        stroke={C.lineStrong}
        strokeWidth="3"
        strokeDasharray="2 10"
        strokeLinecap="round"
      />
      <rect
        className={cx(a, m.fly)}
        x="310"
        y="435"
        width="40"
        height="26"
        rx="13"
        fill={C.accent}
      />

      {/* The barber's own phone */}
      <Phone x={424} y={28} w={340} h={544} r={44} inset={12} />
      <text x="594" y="122" fontSize="36" textAnchor="middle" fill={C.muted}>
        Text Message
      </text>
      <Received
        x={452}
        y={156}
        w={284}
        font={36}
        lines={['Barber: Steve', 'Time: 11:00 AM']}
      />
      <text x="594" y="520" fontSize="36" textAnchor="middle" fill={C.muted}>
        Steve&apos;s phone
      </text>
    </Stage>
  )
}

function Hero() {
  return (
    <Stage id="signature-cuts" variant="hero" loop={14}>
      <Phone x={150} y={60} w={440} h={880} r={60} inset={16} />
      <g className={cx(a, m.form)}>
        <SignatureCutsMark x={190} y={114} size={60} cut={C.ground} />
        <text x="266" y="162" fontSize="40" fontWeight="600" fill={C.ink}>
          BOOK NOW
        </text>
        <g fontSize="38" fill={C.muted} letterSpacing="1">
          <text x="190" y="238">
            YOUR BARBER
          </text>
          <text x="190" y="392">
            PREFERRED TIME
          </text>
        </g>
        <Field x={190} y={256} w={360} h={72} text="Steve" font={40} />
        <Slots
          x={190}
          y={410}
          w={360}
          h={64}
          gap={12}
          font={38}
          times={['10:30 AM', '11:00 AM', '11:30 AM']}
        />
      </g>
      <Button x={190} y={652} w={360} h={112} font={38} label="WhatsApp" />
      <Button
        x={190}
        y={780}
        w={360}
        h={112}
        font={38}
        label="Text Message"
        lit
      />

      {/* The two ways out, both straight to the barber */}
      <path
        d="M550 836 C 800 836, 800 400, 1056 400"
        fill="none"
        stroke={C.lineStrong}
        strokeWidth="3.5"
        strokeDasharray="2 12"
        strokeLinecap="round"
      />
      <path
        d="M550 708 C 760 708, 820 802, 1056 802"
        fill="none"
        stroke={C.lineStrong}
        strokeWidth="3.5"
        strokeDasharray="2 12"
        strokeLinecap="round"
      />
      <rect
        className={cx(a, m.flyH)}
        x="524"
        y="820"
        width="52"
        height="32"
        rx="16"
        fill={C.accent}
      />
      <rect
        className={cx(a, m.flyW)}
        x="524"
        y="692"
        width="52"
        height="32"
        rx="16"
        fill={C.ink2}
      />

      {/* The link the button opens, per platform */}
      <g>
        <rect x="630" y="124" width="372" height="64" rx="32" fill={C.s2} />
        <rect
          className={cx(a, m.knob)}
          x="636"
          y="130"
          width="180"
          height="52"
          rx="26"
          fill={C.s3}
        />
        <text x="726" y="169" fontSize="38" textAnchor="middle" fill={C.ink}>
          iPhone
        </text>
        <text x="906" y="169" fontSize="38" textAnchor="middle" fill={C.ink}>
          Android
        </text>
        <g className={mono} fontSize="38">
          <text x="630" y="256" fill={C.ink2}>
            sms:<tspan fill={C.muted}>…</tspan>
          </text>
          <text className={cx(a, m.amp)} x="744" y="256" fill={C.accent}>
            &amp;body=
          </text>
          <text
            className={cx(a, m.query)}
            x="744"
            y="256"
            fill={C.accent}
            opacity="0"
          >
            ?body=
          </text>
          <text x="630" y="900" fill={C.ink2}>
            wa.me/<tspan fill={C.muted}>…</tspan>?text=
          </text>
        </g>
      </g>
      <text x="630" y="338" fontSize="38" fill={C.muted}>
        No server in between
      </text>

      <Phone x={1040} y={60} w={420} h={880} r={60} inset={16} />
      <text x="1250" y="170" fontSize="38" textAnchor="middle" fill={C.muted}>
        Text Message
      </text>
      <Received
        x={1080}
        y={206}
        w={340}
        font={38}
        lines={['Name: Jordan', 'Barber: Steve', 'Time: 11:00 AM']}
      />
      <g className={cx(a, m.wa)}>
        <rect x="1080" y="770" width="230" height="64" rx="32" fill={C.s2} />
        <text x="1195" y="815" fontSize="38" textAnchor="middle" fill={C.ink2}>
          WhatsApp
        </text>
      </g>
      <text x="1250" y="890" fontSize="38" textAnchor="middle" fill={C.muted}>
        Steve&apos;s own number
      </text>
    </Stage>
  )
}
