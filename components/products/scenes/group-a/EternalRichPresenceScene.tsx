import type { CSSProperties } from 'react'
import type { SceneProps } from '..'
import { cx } from '@/components/ui/cx'
import { SceneStage, SceneSvg } from './Stage'
import u from './ui.module.css'
import s from './EternalRichPresenceScene.module.css'

/*
 * EternalRichPresence puts the song playing in Apple Music on your Discord
 * profile. The tray app polls the player, uploads the cover art to an image
 * host, and sets a Listening activity with the title, the artist and a
 * progress bar. In the hero a friend presses Ask to Join, Discord hands their
 * copy of the app an eternalrp:// link, and their Spotify starts the same
 * track at the same position. The track is the one in the product's real
 * profile capture.
 */

const DURATION = 12
const STILL = 0.8

const TITLE = 'Man On The Moon'
const ARTIST = 'Kid Cudi'

/** Abstract cover art, a crescent moon on a dark square, drawn at the origin. */
function Cover({ size }: { size: number }) {
  const k = size / 100
  return (
    <>
      <rect width={size} height={size} rx={8 * k} className={s.coverBg} />
      <circle cx={50 * k} cy={52 * k} r={27 * k} className={u.acc} />
      <circle cx={63 * k} cy={43 * k} r={24 * k} className={s.coverBg} />
      <circle cx={24 * k} cy={24 * k} r={2.5 * k} className={u.ink2} />
      <circle cx={80 * k} cy={78 * k} r={2 * k} className={u.ink2} />
    </>
  )
}

/** The tray app's icon, equalizer bars on the accent, drawn at the origin. */
function Tray({ size }: { size: number }) {
  const k = size / 40
  return (
    <g className={cx(s.a, s.poll)}>
      <rect width={size} height={size} rx={10 * k} className={u.acc} />
      {[0, 1, 2, 3].map((i) => (
        <rect
          key={i}
          x={(9 + i * 6.5) * k}
          y={[13, 9, 16, 11][i] * k}
          width={3.5 * k}
          height={[14, 22, 8, 18][i] * k}
          rx={1.75 * k}
          className={u.ink}
        />
      ))}
    </g>
  )
}

/** The image host the cover art goes up to, centred on its middle. */
function Cloud({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <path
        className={cx(u.s3, s.a, s.cloud)}
        d="M -46 22 A 22 22 0 0 1 -30 -10 A 30 30 0 0 1 24 -14 A 24 24 0 0 1 46 22 Z"
      />
    </g>
  )
}

/**
 * The Discord profile card, 434 wide, in its own units. The art slot holds
 * the uploaded cover, which flies in from the player (CSS variables set the
 * route). With `join` it adds the Ask to Join button and a friend's pointer.
 */
function Profile({
  art,
  join,
  w = 434,
}: {
  art: CSSProperties
  join?: boolean
  /** Card width. The content is 390 wide, centred. */
  w?: number
}) {
  const h = join ? 546 : 460
  const pad = (w - 390) / 2
  return (
    <>
      <rect width={w} height={h} rx={18} className={u.s2} />
      <path
        d={`M 0 80 V 18 a 18 18 0 0 1 18 -18 H ${w - 18} a 18 18 0 0 1 18 18 V 80 Z`}
        className={s.blurple}
      />
      <circle
        cx={66}
        cy={80}
        r={40}
        className={cx(u.s3, u.surfaceLine)}
        strokeWidth={8}
      />
      <circle cx={66} cy={70} r={14} className={u.muted} />
      <path d="M 40 108 a 26 22 0 0 1 52 0 Z" className={u.muted} />
      <circle
        cx={96}
        cy={110}
        r={11}
        className={cx(s.online, u.surfaceLine)}
        strokeWidth={6}
      />
      <text x={pad} y={166} fontSize={36} className={cx(u.sans, u.ink)}>
        aldobuildstuff
      </text>
      <line x1={pad} y1={192} x2={w - pad} y2={192} className={u.line} />

      {/* The activity fills in once the cover art has a URL */}
      <text
        x={pad}
        y={240}
        fontSize={36}
        className={cx(u.sans, u.ink2, s.a, s.head)}
      >
        Listening to Apple Music
      </text>
      <text
        x={pad}
        y={290}
        fontSize={36}
        className={cx(u.sans, u.ink, s.a, s.song)}
      >
        {TITLE}
      </text>
      <g transform={`translate(${pad} 314)`}>
        <g className={cx(s.a, s.art)} style={art}>
          <Cover size={120} />
        </g>
      </g>
      <g className={cx(s.a, s.row)}>
        <text
          x={pad + 138}
          y={352}
          fontSize={36}
          className={cx(u.sans, u.ink2)}
        >
          {ARTIST}
        </text>
        <rect
          x={pad + 138}
          y={372}
          width={252}
          height={8}
          rx={4}
          className={u.s3}
        />
        <rect
          x={pad + 138}
          y={372}
          width={252}
          height={8}
          rx={4}
          className={cx(u.ink, s.a, s.progress)}
        />
        <text
          x={pad + 138}
          y={424}
          fontSize={36}
          className={cx(u.mono, u.muted)}
        >
          1:21
        </text>
        <text
          x={w - pad}
          y={424}
          textAnchor="end"
          fontSize={36}
          className={cx(u.mono, u.muted)}
        >
          3:27
        </text>
      </g>

      {join && (
        <>
          <rect
            x={22}
            y={460}
            width={390}
            height={60}
            rx={10}
            className={u.s3}
          />
          <rect
            x={22}
            y={460}
            width={390}
            height={60}
            rx={10}
            className={cx(s.blurple, s.a, s.press)}
          />
          <text
            x={217}
            y={502}
            textAnchor="middle"
            fontSize={36}
            className={cx(u.sans, u.ink)}
          >
            Ask to Join
          </text>
          <g transform="translate(342 486)">
            <g className={cx(s.a, s.pointer)}>
              <path
                d="M 0 0 L 0 30 L 8 23 L 14 36 L 20 33 L 14 21 L 25 21 Z"
                className={cx(u.ink, u.surfaceLine)}
                strokeWidth={2.5}
                strokeLinejoin="round"
              />
            </g>
          </g>
        </>
      )}
    </>
  )
}

/** The card's player: a tall window with the art over the title. */
function StackPlayer() {
  return (
    <>
      <rect width={324} height={370} rx={16} className={u.s2} />
      <g transform="translate(72 24)">
        <Cover size={180} />
      </g>
      <g transform="translate(270 22)">
        <Tray size={40} />
      </g>
      <text
        x={162}
        y={256}
        textAnchor="middle"
        fontSize={36}
        className={cx(u.sans, u.ink)}
      >
        {TITLE}
      </text>
      <text
        x={162}
        y={298}
        textAnchor="middle"
        fontSize={36}
        className={cx(u.sans, u.muted)}
      >
        {ARTIST}
      </text>
      <rect x={26} y={328} width={272} height={8} rx={4} className={u.s3} />
      <rect
        x={26}
        y={328}
        width={272}
        height={8}
        rx={4}
        className={cx(u.acc, s.a, s.progress)}
      />
    </>
  )
}

/** The hero's player: a wide window with the art beside the title. */
function RowPlayer({ friend }: { friend?: boolean }) {
  return (
    <>
      <rect width={560} height={200} rx={18} className={u.s2} />
      <rect x={24} y={24} width={152} height={152} rx={12} className={u.s3} />
      {friend && (
        <g className={cx(s.a, s.idle)}>
          <rect
            x={200}
            y={56}
            width={180}
            height={18}
            rx={9}
            className={u.s3}
          />
          <rect
            x={200}
            y={104}
            width={120}
            height={18}
            rx={9}
            className={u.s3}
          />
        </g>
      )}
      <g className={friend ? cx(s.a, s.friend) : undefined}>
        <g transform="translate(24 24)">
          <Cover size={152} />
        </g>
        <text x={200} y={82} fontSize={38} className={cx(u.sans, u.ink)}>
          {TITLE}
        </text>
        <text x={200} y={130} fontSize={38} className={cx(u.sans, u.muted)}>
          {ARTIST}
        </text>
      </g>
      <rect x={200} y={158} width={336} height={8} rx={4} className={u.s3} />
      <rect
        x={200}
        y={158}
        width={336}
        height={8}
        rx={4}
        className={cx(u.acc, s.a, friend ? s.friendProgress : s.progress)}
      />
    </>
  )
}

/** Route of the flying cover art, in the profile's own units. */
function route(
  from: [number, number, number],
  host: [number, number, number],
): CSSProperties {
  return {
    '--from': `translate(${from[0]}px, ${from[1]}px) scale(${from[2]})`,
    '--host': `translate(${host[0]}px, ${host[1]}px) scale(${host[2]})`,
  } as CSSProperties
}

function Card() {
  // Player art centre (184, 254), cloud (345, 36), profile slot (432, 444).
  return (
    <SceneSvg frame="card" duration={DURATION} still={STILL}>
      <path
        d="M 308 140 Q 308 60 326 46"
        className={cx(u.none, u.accLineDim)}
        strokeWidth={3}
        strokeDasharray="2 9"
        strokeLinecap="round"
      />
      <path
        d="M 386 40 Q 434 36 456 70"
        className={cx(u.none, s.blurpleLine)}
        strokeWidth={3}
        strokeDasharray="2 9"
        strokeLinecap="round"
      />
      <Cloud x={345} y={40} />
      <g transform="translate(22 140)">
        <StackPlayer />
      </g>
      <g transform="translate(358 70)">
        <Profile w={418} art={route([-248, -190, 1.5], [-87, -408, 0.35])} />
      </g>
    </SceneSvg>
  )
}

function Hero() {
  // The profile is drawn at 1.15×. Player art centre (250, 300), cloud
  // (825, 150), profile slot (1034, 580): routes are in profile units.
  return (
    <SceneSvg frame="hero" duration={DURATION} still={STILL}>
      <text x={150} y={176} fontSize={38} className={cx(u.sans, u.muted)}>
        Apple Music
      </text>
      <g transform="translate(662 136)">
        <Tray size={48} />
      </g>
      <path
        d="M 718 160 Q 748 150 772 154"
        className={cx(u.none, u.accLineDim)}
        strokeWidth={3}
        strokeDasharray="2 9"
        strokeLinecap="round"
      />
      <path
        d="M 878 150 Q 930 140 960 150"
        className={cx(u.none, s.blurpleLine)}
        strokeWidth={3}
        strokeDasharray="2 9"
        strokeLinecap="round"
      />
      <Cloud x={825} y={154} />
      <text
        x={825}
        y={96}
        textAnchor="middle"
        fontSize={38}
        className={cx(u.mono, u.muted)}
      >
        litterbox.catbox.moe
      </text>
      <g transform="translate(150 200)">
        <RowPlayer />
      </g>

      <text x={150} y={616} fontSize={38} className={cx(u.sans, u.muted)}>
        Spotify, a friend’s PC
      </text>
      <g transform="translate(150 640)">
        <RowPlayer friend />
      </g>

      {/* Ask to Join hands the friend's app an eternalrp:// link */}
      <path
        d="M 965 714 Q 850 790 712 760"
        className={cx(u.none, s.blurpleLine)}
        strokeWidth={3}
        strokeDasharray="2 9"
        strokeLinecap="round"
      />
      <circle cx={965} cy={714} r={9} className={cx(s.blurple, s.a, s.link)} />
      <text x={740} y={880} fontSize={38} className={cx(u.mono, u.muted)}>
        eternalrp://sync
      </text>

      <g transform="translate(940 150) scale(1.15)">
        <Profile join art={route([-682, -244, 1.1], [-182, -374, 0.35])} />
      </g>
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
