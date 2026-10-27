import type { ReactNode } from 'react'
import type { SceneProps } from '..'
import { cx } from '@/components/ui/cx'
import { SceneStage, SceneSvg } from './Stage'
import u from './ui.module.css'
import s from './EternalRichPresenceScene.module.css'

/*
 * EternalRichPresence puts the song playing in Apple Music on your Discord
 * profile. The tray app polls the player, uploads the cover art to an image
 * host, and sets a Listening activity with a progress bar and a Join button.
 * A friend clicks Join, Discord hands their copy of the app an eternalrp://
 * link, and their player (here Spotify) starts the same track at the same
 * position, so both bars move together.
 */

const DURATION = 12
const STILL = 0.8

/** Cover art, drawn at the origin at 84×84. */
function Art() {
  return (
    <>
      <rect width={84} height={84} rx={8} className={u.accDim} />
      <circle
        cx={42}
        cy={42}
        r={24}
        className={cx(u.none, u.accLine)}
        strokeWidth={5}
      />
      <circle cx={42} cy={42} r={5} className={u.acc} />
    </>
  )
}

/** A desktop player window with its art, title, artist and progress. */
function Player({
  y,
  art,
  progressClass,
}: {
  y: number
  art: ReactNode
  progressClass: string
}) {
  return (
    <>
      <rect x={40} y={y} width={330} height={150} rx={16} className={u.s2} />
      <rect
        x={60}
        y={y + 20}
        width={110}
        height={110}
        rx={10}
        className={u.s3}
      />
      {art}
      <rect
        x={190}
        y={y + 40}
        width={112}
        height={14}
        rx={7}
        className={u.ink2}
      />
      <rect
        x={190}
        y={y + 64}
        width={80}
        height={12}
        rx={6}
        className={u.muted}
      />
      <rect
        x={190}
        y={y + 110}
        width={160}
        height={6}
        rx={3}
        className={u.s3}
      />
      <rect
        x={190}
        y={y + 110}
        width={160}
        height={6}
        rx={3}
        className={cx(u.acc, s.a, progressClass)}
      />
    </>
  )
}

function Core({ hero }: { hero: boolean }) {
  return (
    <g>
      {/* Your PC: Apple Music and the tray app watching it */}
      <Player
        y={86}
        progressClass={s.progress}
        art={
          <g transform="translate(60 106) scale(1.31)">
            <Art />
          </g>
        }
      />
      <g className={cx(s.a, s.poll)}>
        <rect
          x={318}
          y={100}
          width={38}
          height={38}
          rx={10}
          className={u.acc}
        />
        {[0, 1, 2, 3].map((i) => (
          <rect
            key={i}
            x={326 + i * 6.5}
            y={[112, 108, 116, 110][i]}
            width={3.5}
            height={[14, 22, 8, 18][i]}
            rx={1.75}
            className={u.ink}
          />
        ))}
      </g>

      {/* The image host */}
      <g className={cx(s.a, s.cloud)}>
        <path
          d="M 378 62 a 16 16 0 0 1 2 -32 a 24 24 0 0 1 44 -4 a 18 18 0 0 1 10 36 Z"
          className={u.s3}
        />
      </g>

      {/* Discord profile */}
      <rect x={440} y={70} width={320} height={460} rx={18} className={u.s2} />
      <path
        d="M 440 166 V 88 a 18 18 0 0 1 18 -18 H 742 a 18 18 0 0 1 18 18 V 166 Z"
        className={u.accDim}
      />
      <circle
        cx={496}
        cy={166}
        r={38}
        className={cx(u.s3, u.surfaceLine)}
        strokeWidth={8}
      />
      <rect x={462} y={222} width={130} height={16} rx={8} className={u.ink} />
      <rect x={462} y={248} width={90} height={12} rx={6} className={u.muted} />
      <text x={462} y={300} fontSize={23} className={cx(u.sans, u.ink2)}>
        Listening to Apple Music
      </text>
      <rect x={462} y={318} width={84} height={84} rx={8} className={u.s3} />
      <g className={cx(s.a, s.activity)}>
        <rect
          x={562}
          y={330}
          width={150}
          height={14}
          rx={7}
          className={u.ink2}
        />
        <rect
          x={562}
          y={354}
          width={104}
          height={12}
          rx={6}
          className={u.muted}
        />
        <rect x={562} y={390} width={176} height={6} rx={3} className={u.s3} />
        <rect
          x={562}
          y={390}
          width={176}
          height={6}
          rx={3}
          className={cx(u.acc, s.a, s.progress)}
        />
      </g>
      <g transform="translate(462 318)">
        <g className={cx(s.a, s.art)}>
          <Art />
        </g>
      </g>
      <rect x={462} y={432} width={276} height={48} rx={8} className={u.s3} />
      <rect
        x={462}
        y={432}
        width={276}
        height={48}
        rx={8}
        className={cx(u.acc, s.a, s.press)}
      />
      <text
        x={600}
        y={464}
        textAnchor="middle"
        fontSize={23}
        className={cx(u.sans, u.ink)}
      >
        Join
      </text>
      <g transform="translate(652 452)">
        <g className={cx(s.a, s.pointer)}>
          <path
            d="M 0 0 L 0 30 L 8 23 L 14 36 L 20 33 L 14 21 L 25 21 Z"
            className={cx(u.ink, u.surfaceLine)}
            strokeWidth={2.5}
            strokeLinejoin="round"
          />
        </g>
      </g>

      {/* The friend's PC, which joins */}
      <path
        d="M 600 480 Q 520 560 372 472"
        className={cx(u.none, u.line)}
        strokeWidth={2}
        strokeDasharray="4 8"
      />
      {!hero && (
        <text
          x={498}
          y={572}
          textAnchor="middle"
          fontSize={22}
          className={cx(u.mono, u.muted)}
        >
          eternalrp://sync
        </text>
      )}
      <circle cx={600} cy={480} r={7} className={cx(u.acc, s.a, s.link)} />
      <g className={cx(s.a, s.friend)}>
        <Player
          y={364}
          progressClass={s.friendProgress}
          art={
            <g transform="translate(60 384) scale(1.31)">
              <g className={cx(s.a, s.friendArt)}>
                <Art />
              </g>
            </g>
          }
        />
      </g>
    </g>
  )
}

function Label({
  x,
  y,
  children,
  size = 24,
}: {
  x: number
  y: number
  children: string
  size?: number
}) {
  return (
    <text x={x} y={y} fontSize={size} className={cx(u.sans, u.muted)}>
      {children}
    </text>
  )
}

function Card() {
  return (
    <SceneSvg frame="card" duration={DURATION} still={STILL}>
      <Core hero={false} />
      <Label x={40} y={70}>
        Apple Music
      </Label>
      <Label x={40} y={548}>
        Spotify, a friend’s PC
      </Label>
    </SceneSvg>
  )
}

function Hero() {
  // Core at 1.25×: x 40–760 maps to 350–1250, y 18–572 maps to 154–846.
  return (
    <SceneSvg frame="hero" duration={DURATION} still={STILL}>
      <g transform="translate(300 131) scale(1.25)">
        <Core hero />
      </g>
      <Label x={350} y={218} size={26}>
        Apple Music
      </Label>
      <Label x={350} y={818} size={26}>
        Spotify, a friend’s PC
      </Label>
      <text x={862} y={182} fontSize={22} className={cx(u.mono, u.muted)}>
        litterbox.catbox.moe
      </text>
      <text
        x={922}
        y={884}
        textAnchor="middle"
        fontSize={22}
        className={cx(u.mono, u.muted)}
      >
        eternalrp://sync?track=…&amp;artist=…&amp;pos=…
      </text>
    </SceneSvg>
  )
}

export default function EternalRichPresenceScene({ variant }: SceneProps) {
  return (
    <SceneStage
      id="eternal-rich-presence"
      variant={variant}
      card={<Card />}
      hero={<Hero />}
    />
  )
}
