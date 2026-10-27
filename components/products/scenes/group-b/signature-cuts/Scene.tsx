'use client'

import { useId, type CSSProperties } from 'react'
import { cx } from '@/components/ui/cx'
import type { SceneProps } from '../..'
import { Stage, a, mono, C } from '../Stage'
import m from './scene.module.css'

/**
 * Signature Cuts 413: the booking form on a customer's phone. A 30-minute
 * slot snaps to 11:00 AM, Send via Text Message folds the form into one text,
 * and it goes straight to the barber's own phone, with no server in between.
 * The hero shows the sms: link switching its separator for iPhone (&body=)
 * and Android (?body=), and the WhatsApp link as the other way out.
 *
 * Every string is from the site: the form's labels, its 30-minute slots, and
 * the lines composeMessage() writes.
 */
export default function SignatureCutsScene({ variant }: SceneProps) {
  return variant === 'hero' ? <Hero /> : <Card />
}

/**
 * The shop's mark: a barber pole in the site's quartz. Drawn for this scene,
 * since the site itself ships no icon. The same mark is ./mark.svg.
 */
export function SignatureCutsMark({
  x,
  y,
  size,
}: {
  x: number
  y: number
  size: number
}) {
  const id = useId().replace(/:/g, '')
  return (
    <svg x={x} y={y} width={size} height={size} viewBox="0 0 512 512">
      <defs>
        <clipPath id={`${id}-pole`}>
          <rect x="196" y="132" width="120" height="248" rx="60" />
        </clipPath>
      </defs>
      <g clipPath={`url(#${id}-pole)`}>
        <rect x="196" y="132" width="120" height="248" fill={C.s3} />
        <g fill={C.accent}>
          <path d="M196 150 L316 82 V126 L196 194 Z" />
          <path d="M196 230 L316 162 V206 L196 274 Z" />
          <path d="M196 310 L316 242 V286 L196 354 Z" />
          <path d="M196 390 L316 322 V366 L196 434 Z" />
        </g>
      </g>
      <rect x="180" y="100" width="152" height="28" rx="14" fill={C.ink} />
      <rect x="180" y="384" width="152" height="28" rx="14" fill={C.ink} />
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
        x={x + font * 0.8}
        y={y + h / 2 + font * 0.36}
        fontSize={font}
        fill={C.ink}
      >
        {text}
      </text>
    </g>
  )
}

const SLOTS = [
  '10:00 AM',
  '10:30 AM',
  '11:00 AM',
  '11:30 AM',
  '12:00 PM',
  '12:30 PM',
]

/** The slot grid. The lit pill snaps from 10:30 AM to 11:00 AM. */
function Slots({
  x,
  y,
  cols,
  w,
  h,
  gap,
  font,
}: {
  x: number
  y: number
  cols: number
  w: number
  h: number
  gap: number
  font: number
}) {
  const pos = (i: number) => ({
    px: x + (i % cols) * (w + gap),
    py: y + Math.floor(i / cols) * (h + gap),
  })
  const from = pos(1)
  const to = pos(2)
  return (
    <g>
      {SLOTS.map((t, i) => {
        const { px, py } = pos(i)
        return (
          <g key={t}>
            <rect
              x={px}
              y={py}
              width={w}
              height={h}
              rx={h * 0.3}
              fill="none"
              stroke={C.lineStrong}
              strokeWidth="2"
            />
            <text
              x={px + w / 2}
              y={py + h / 2 + font * 0.36}
              fontSize={font}
              textAnchor="middle"
              fill={C.muted}
            >
              {t}
            </text>
          </g>
        )
      })}
      <g
        className={cx(a, m.slot)}
        style={
          {
            '--sx': `${from.px - to.px}px`,
            '--sy': `${from.py - to.py}px`,
          } as CSSProperties
        }
      >
        <rect
          x={to.px}
          y={to.py}
          width={w}
          height={h}
          rx={h * 0.3}
          fill={C.accent}
        />
        <text
          className={cx(a, m.slotText)}
          x={to.px + w / 2}
          y={to.py + h / 2 + font * 0.36}
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

function Buttons({
  x,
  y,
  w,
  h,
  gap,
  font,
}: {
  x: number
  y: number
  w: number
  h: number
  gap: number
  font: number
}) {
  const y2 = y + h + gap
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={h * 0.28} fill={C.s3} />
      <text
        x={x + w / 2}
        y={y + h / 2 + font * 0.36}
        fontSize={font}
        textAnchor="middle"
        fill={C.ink2}
      >
        Send via WhatsApp
      </text>
      <rect
        x={x}
        y={y2}
        width={w}
        height={h}
        rx={h * 0.28}
        fill="none"
        stroke={C.lineStrong}
        strokeWidth="2"
      />
      <g className={cx(a, m.press)}>
        <rect
          x={x}
          y={y2}
          width={w}
          height={h}
          rx={h * 0.28}
          fill={C.accent}
          fillOpacity="0.16"
          stroke={C.accent}
          strokeWidth="2.5"
        />
      </g>
      <text
        x={x + w / 2}
        y={y2 + h / 2 + font * 0.36}
        fontSize={font}
        textAnchor="middle"
        fill={C.ink}
      >
        Send via Text Message
      </text>
    </g>
  )
}

/** The text the barber receives, as composeMessage() writes it. */
function Received({
  x,
  y,
  w,
  font,
  lines,
  intro,
}: {
  x: number
  y: number
  w: number
  font: number
  lines: string[]
  intro: boolean
}) {
  const lh = font * 1.4
  const top = intro ? font * 2.9 : font * 1.6
  const h = top + lines.length * lh + font * 0.6
  return (
    <g className={cx(a, m.land)}>
      <rect x={x} y={y} width={w} height={h} rx={font} fill={C.s3} />
      {intro ? (
        <>
          <text
            x={x + font * 0.8}
            y={y + font * 1.6}
            fontSize={font}
            fill={C.ink}
          >
            Hey, I&apos;d like to book
          </text>
          <text
            x={x + font * 0.8}
            y={y + font * 3}
            fontSize={font}
            fill={C.ink}
          >
            an appointment.
          </text>
        </>
      ) : (
        <rect
          x={x + font * 0.8}
          y={y + font * 0.8}
          width={w * 0.6}
          height={font * 0.4}
          rx={font * 0.2}
          fill="rgba(255, 255, 255, 0.3)"
        />
      )}
      {lines.map((l, i) => (
        <text
          key={l}
          x={x + font * 0.8}
          y={y + top + (intro ? lh * 0.4 : 0) + i * lh + font}
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
      <Phone x={70} y={36} w={260} h={528} r={40} inset={12} />
      <g className={cx(a, m.form)}>
        <SignatureCutsMark x={92} y={70} size={40} />
        <text x="134" y="98" fontSize="20" fontWeight="500" fill={C.ink}>
          Signature Cuts
        </text>
        <Field x={96} y={120} w={208} h={44} text="Steve" font={20} />
        <Field x={96} y={174} w={208} h={44} text="Signature Cut" font={20} />
        <Slots x={96} y={234} cols={2} w={99} h={38} gap={10} font={17} />
      </g>
      <Buttons x={96} y={398} w={208} h={44} gap={10} font={18} />

      {/* Phone to phone */}
      <path
        d="M304 474 C 400 474, 380 236, 482 236"
        fill="none"
        stroke={C.lineStrong}
        strokeWidth="3"
        strokeDasharray="2 10"
        strokeLinecap="round"
      />
      <text className={mono} x="352" y="404" fontSize="20" fill={C.accent}>
        sms:
      </text>
      <rect
        className={cx(a, m.fly)}
        x="292"
        y="461"
        width="40"
        height="26"
        rx="13"
        fill={C.accent}
      />

      {/* The barber's own phone */}
      <Phone x={470} y={36} w={260} h={528} r={40} inset={12} />
      <text x="600" y="110" fontSize="18" textAnchor="middle" fill={C.muted}>
        Text Message
      </text>
      <Received
        x={492}
        y={136}
        w={226}
        font={20}
        intro={false}
        lines={['Barber: Steve', 'Service: Signature Cut', 'Time: 11:00 AM']}
      />
      <text x="600" y="520" fontSize="18" textAnchor="middle" fill={C.muted}>
        Steve&apos;s own number
      </text>
    </Stage>
  )
}

function Hero() {
  return (
    <Stage id="signature-cuts" variant="hero" loop={14}>
      <Phone x={250} y={110} w={350} h={780} r={54} inset={16} />
      <g className={cx(a, m.form)}>
        <SignatureCutsMark x={282} y={160} size={56} />
        <text x="340" y="198" fontSize="24" fontWeight="500" fill={C.ink}>
          Signature Cuts 413
        </text>
        <g fontSize="16" fill={C.muted} letterSpacing="1.5">
          <text x="292" y="248">
            YOUR BARBER
          </text>
          <text x="292" y="342">
            SERVICE
          </text>
          <text x="292" y="436">
            PREFERRED TIME
          </text>
        </g>
        <Field x={292} y={260} w={266} h={52} text="Steve" font={22} />
        <Field x={292} y={354} w={266} h={52} text="Signature Cut" font={22} />
        <Slots x={292} y={450} cols={3} w={82} h={44} gap={10} font={16} />
        <text x="425" y="600" fontSize="19" textAnchor="middle" fill={C.ink2}>
          Send your booking to Steve directly:
        </text>
      </g>
      <Buttons x={292} y={624} w={266} h={56} gap={14} font={21} />

      {/* The two ways out, both straight to the barber */}
      <path
        d="M558 722 C 760 722, 800 360, 1000 360"
        fill="none"
        stroke={C.lineStrong}
        strokeWidth="3.5"
        strokeDasharray="2 12"
        strokeLinecap="round"
      />
      <path
        d="M558 652 C 700 652, 760 820, 1000 820"
        fill="none"
        stroke={C.lineStrong}
        strokeWidth="3.5"
        strokeDasharray="2 12"
        strokeLinecap="round"
      />
      <rect
        className={cx(a, m.flyH)}
        x="540"
        y="706"
        width="52"
        height="32"
        rx="16"
        fill={C.accent}
      />
      <rect
        className={cx(a, m.flyW)}
        x="540"
        y="636"
        width="52"
        height="32"
        rx="16"
        fill={C.ink2}
      />

      {/* The link the button opens, per platform */}
      <g>
        <rect x="642" y="150" width="316" height="52" rx="26" fill={C.s2} />
        <rect
          className={cx(a, m.knob)}
          x="648"
          y="156"
          width="150"
          height="40"
          rx="20"
          fill={C.s3}
        />
        <text x="723" y="184" fontSize="21" textAnchor="middle" fill={C.ink}>
          iPhone
        </text>
        <text x="873" y="184" fontSize="21" textAnchor="middle" fill={C.ink}>
          Android
        </text>
        <g className={mono} fontSize="22">
          <text x="642" y="252" fill={C.ink2}>
            sms:<tspan fill={C.muted}>…</tspan>
          </text>
          <text className={cx(a, m.amp)} x="712" y="252" fill={C.accent}>
            &amp;body=
          </text>
          <text
            className={cx(a, m.query)}
            x="712"
            y="252"
            fill={C.accent}
            opacity="0"
          >
            ?body=
          </text>
          <text x="804" y="252" fill={C.ink2}>
            Hey%2C%20I&apos;d
          </text>
          <text x="660" y="860" fill={C.ink2}>
            wa.me/<tspan fill={C.muted}>…</tspan>?text=
          </text>
        </g>
      </g>
      <text x="800" y="640" fontSize="22" textAnchor="middle" fill={C.muted}>
        No server in between
      </text>

      <Phone x={1000} y={110} w={350} h={780} r={54} inset={16} />
      <text x="1175" y="214" fontSize="20" textAnchor="middle" fill={C.muted}>
        Text Message
      </text>
      <Received
        x={1030}
        y={240}
        w={290}
        font={22}
        intro
        lines={[
          'Name: Jordan',
          'Barber: Steve',
          'Service: Signature Cut',
          'Time: 11:00 AM',
        ]}
      />
      <g className={cx(a, m.wa)}>
        <rect x="1030" y="790" width="180" height="48" rx="24" fill={C.s2} />
        <text x="1120" y="822" fontSize="21" textAnchor="middle" fill={C.ink2}>
          WhatsApp
        </text>
      </g>
      <text x="1175" y="860" fontSize="20" textAnchor="middle" fill={C.muted}>
        Steve&apos;s own number
      </text>
    </Stage>
  )
}
