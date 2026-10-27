// Every Sideband product. Copy comes from each product's repo, docs, releases
// and live site (sources per product in the research dossier). Repo numbers
// come from the committed GitHub snapshot (lib/data/github.json), regenerated
// by `npm run sync:github`, which reads the `repo:` and `upstreamRepo:` keys
// below.
import { getRepo, repoCodeBytes, type GithubRepo } from '@/lib/github'

export type ProductStatus = 'LIVE' | 'IN DEVELOPMENT'

export type ProductDevice = 'desktop' | 'mobile' | 'ipad' | 'none'

/**
 * What an image is. `screenshot` is a capture of the real product or its site,
 * `artwork` is made art (icons, logos, wallpapers, textures, comparison graphics),
 * `photo` is a photograph.
 */
export type ProductImageKind = 'screenshot' | 'artwork' | 'photo'

/** Attribution that an image's source requires or names. */
export interface ProductImageCredit {
  text: string
  href?: string
  license?: string
  licenseHref?: string
}

export interface ProductImage {
  src: string
  alt: string
  /** Real pixel size of the file. */
  width: number
  height: number
  /** What the image shows: a desktop window or page, a phone, an iPad, or a plain image. */
  device: ProductDevice
  kind: ProductImageKind
  /** Where the original came from: a repo path, a URL, or a capture. */
  source: string
  /** Shown with the image wherever it appears. */
  credit?: ProductImageCredit
}

export interface ProductFeature {
  title: string
  body: string
}

export interface ProductLinks {
  site?: string
  repo?: string
  /** The project this product is developed in or built on, when that is not Sideband's repo. */
  upstream?: string
  download?: string
  store?: string
  docs?: string
}

export interface Product {
  id: string
  name: string
  category: string
  tagline: string
  description: string
  /** Two or three short paragraphs: what it is, who it is for, how it works. */
  overview: string[]
  features: ProductFeature[]
  platforms: string[]
  stack: string[]
  status: ProductStatus
  /** Current version from the latest release or the app manifest. */
  version: string | null
  yearStarted: number
  /** Engineer ids from lib/engineers.ts. */
  engineers: string[]
  /** Credit for the code or idea this product builds on. */
  origin: string | null
  links: ProductLinks
  /**
   * What the repo's LICENSE file says, read by hand, for a license GitHub
   * cannot identify (snapshot license NOASSERTION). productLicense() uses it.
   */
  licenseNote?: string
  /** `owner/name` key into the GitHub snapshot. */
  repo: string
  /** The repo the product is developed in, when `repo` is Sideband's fork of it. Ranking reads this one. */
  upstreamRepo?: string
  accentColor: string
  /** The product's own icon or logo, or null when it has none. */
  icon: ProductImage | null
  /** Real screenshots and photos. The first one is the preview. */
  images: ProductImage[]
}

const ASSETS = '/assets/products'

function image(
  product: string,
  file: string,
  width: number,
  height: number,
  device: ProductDevice,
  kind: ProductImageKind,
  alt: string,
  source: string,
  extra: Pick<ProductImage, 'credit'> = {},
): ProductImage {
  return {
    ...extra,
    src: `${ASSETS}/${product}/${file}`,
    alt,
    width,
    height,
    device,
    kind,
    source,
  }
}

/** The Eternal2x demos use Hero footage. Credit from the Eternal2x README "Credits". */
const HERO_CREDIT: ProductImageCredit = {
  text: 'Footage from Hero by the Blender Foundation, edited by Eternal2x',
  href: 'https://studio.blender.org/projects/hero/',
  license: 'CC BY 4.0',
  licenseHref: 'https://creativecommons.org/licenses/by/4.0/',
}

export const products: Product[] = [
  {
    id: 'eternal-monitor',
    name: 'EternalMonitor',
    category: 'Display streaming',
    tagline: 'Turn your iPad into a screen for your Windows PC.',
    description:
      'EternalMonitor mirrors a Windows PC onto an iPad or makes the iPad a second screen, over Wi-Fi or a USB cable. Touch, keyboard and Apple Pencil input go back to the PC, and PC audio plays on the iPad. It is free and open source.',
    overview: [
      'EternalMonitor is for Windows users with a spare iPad who want an extra screen or a drawing tablet. The Windows app streams the desktop, and the iPad app shows it full screen with touch, keyboard, trackpad and Pencil input.',
      'The Rust host captures the screen with DXGI Desktop Duplication and encodes it on the graphics card with NVENC, AMF or Quick Sync, falling back to x264 when no hardware encoder opens. Frames travel as numbered UDP fragments, or through Apple’s USB service when a cable is plugged in, and bitrate adapts between 4 and 50 Mbps.',
      'The Swift iPad app reassembles each frame, asks again for any fragment that went missing, decodes with VideoToolbox and draws with Metal. Second screen mode turns on a bundled virtual display driver only while an iPad is connected.',
    ],
    features: [
      {
        title: 'Mirror or second screen',
        body: 'The iPad can copy your main screen or become an extra one that exists only while it is connected.',
      },
      {
        title: 'Wi-Fi or USB',
        body: 'Stream over your home network or plug in a cable, and unplugging falls back to Wi-Fi.',
      },
      {
        title: 'Apple Pencil as a real pen',
        body: 'Windows sees the Pencil as a native pen with pressure, tilt and hover.',
      },
      {
        title: 'Touch, keyboard and trackpad',
        body: 'Tap to click, two fingers to scroll, hold to right-click, and hardware keyboards work too.',
      },
      {
        title: 'Encoded on your graphics card',
        body: 'NVIDIA, AMD or Intel encode H.264 by default, or HEVC if you prefer it, at 30, 60, 90 or 120 frames per second.',
      },
      {
        title: 'Loss repair',
        body: 'When a packet goes missing the iPad asks for that piece again right away instead of waiting for the next keyframe.',
      },
      {
        title: 'PC audio on the iPad',
        body: 'Sound from the PC plays on the iPad as Opus and can be muted without stopping the picture.',
      },
      {
        title: 'Pair once',
        body: 'The first Wi-Fi connection takes a six-digit code or a QR scan, and USB needs no code.',
      },
    ],
    platforms: [
      'Windows 10 1809 or later and Windows 11',
      'iPadOS 17 or later',
    ],
    stack: [
      'Rust',
      'Swift',
      'FFmpeg 7',
      'DXGI',
      'VideoToolbox',
      'Metal',
      'Opus',
      'egui',
      'mDNS',
    ],
    status: 'LIVE',
    version: 'v0.3.2',
    yearStarted: 2026,
    engineers: ['ali-younes', 'ali-tleis'],
    origin: null,
    links: {
      site: 'https://eternalmonitor.dev/',
      repo: 'https://github.com/sidebandstudio/EternalMonitor',
      download: 'https://eternalmonitor.dev/download.html',
      store: 'https://testflight.apple.com/join/ppc9QfXc',
      docs: 'https://github.com/sidebandstudio/EternalMonitor/blob/main/SETUP.md',
    },
    repo: 'sidebandstudio/EternalMonitor',
    accentColor: '#E8FF47',
    icon: image(
      'eternal-monitor',
      'icon.webp',
      256,
      256,
      'none',
      'artwork',
      'EternalMonitor icon',
      'repo docs/assets/icon.png',
    ),
    images: [
      image(
        'eternal-monitor',
        'host-stream.webp',
        2080,
        1233,
        'desktop',
        'screenshot',
        'The EternalMonitor Windows app streaming to an iPad Pro over USB',
        'repo docs/assets/hero-pc@2x.webp (egui snapshot render with fixture stats)',
      ),
      image(
        'eternal-monitor',
        'ipad-connect.webp',
        1032,
        1498,
        'ipad',
        'screenshot',
        'The EternalMonitor iPad app connect screen with QR scan, PC search and USB options',
        'repo docs/assets/ipad-app.webp',
      ),
      image(
        'eternal-monitor',
        'host-performance.webp',
        2080,
        1095,
        'desktop',
        'screenshot',
        'The Windows app Performance page with capture, encode and send rates',
        'repo docs/assets/host-performance@2x.webp',
      ),
      image(
        'eternal-monitor',
        'ipad-settings.webp',
        2420,
        1668,
        'ipad',
        'screenshot',
        'iPad settings for touch controls, the Command key and Apple Pencil drawing mode',
        'repo docs/assets/ipad-settings@2x.webp',
      ),
      image(
        'eternal-monitor',
        'ipad-pairing.webp',
        1668,
        2420,
        'ipad',
        'screenshot',
        'The iPad pairing sheet asking for the six-digit code from the PC',
        'repo docs/assets/ipad-pairing@2x.webp',
      ),
      image(
        'eternal-monitor',
        'site-home-desktop.webp',
        2880,
        1800,
        'desktop',
        'screenshot',
        'The eternalmonitor.dev home page',
        'Playwright capture of https://eternalmonitor.dev/ at 1440x900, 2x, 2026-10-26',
      ),
      image(
        'eternal-monitor',
        'site-home-mobile.webp',
        780,
        1688,
        'mobile',
        'screenshot',
        'The eternalmonitor.dev home page on a phone',
        'Playwright capture of https://eternalmonitor.dev/ at 390x844, 2x, 2026-10-26',
      ),
      image(
        'eternal-monitor',
        'site-download-desktop.webp',
        2880,
        1800,
        'desktop',
        'screenshot',
        'The EternalMonitor download page with the Windows installer and the iPad beta',
        'Playwright capture of https://eternalmonitor.dev/download.html at 1440x900, 2x, 2026-10-26',
      ),
    ],
  },
  {
    id: 'eternal-rich-presence',
    name: 'EternalRichPresence',
    category: 'Discord status',
    tagline: 'Show what you play in Apple Music or Spotify on Discord.',
    description:
      'EternalRichPresence is a Windows tray app that puts the song you are playing in Apple Music, iTunes or Spotify on your Discord profile, with the album cover and a progress bar. Friends who run it can press Join to play the same track at the same moment.',
    overview: [
      'Discord shows Spotify listening on its own but has no Apple Music status. EternalRichPresence fills that gap for Windows users who listen in Apple Music or iTunes, and also covers Spotify through a Spotify developer app.',
      'A Python tray app polls every five seconds. It reads iTunes over COM and the Apple Music app through Windows media controls, or Spotify through its Web API, and asks the providers in order until one is playing. It uploads the cover art to a short-lived image host and sends title, artist, cover, timestamps and a join secret to Discord over local IPC.',
      'When a friend presses Join, their copy receives the secret through its own Discord pipe and either starts the track on Spotify at your position or opens an Apple Music search for it. The current code, version 2.0, builds one portable exe with a Discord app already set up. The newest public download is still the February beta, which predates it.',
    ],
    features: [
      {
        title: 'Listening status on Discord',
        body: 'Your profile shows the song, artist and album with a moving progress bar.',
      },
      {
        title: 'Live cover art',
        body: 'The real album artwork from Apple Music or Spotify appears on your status.',
      },
      {
        title: 'Listen Along',
        body: 'Friends press Join and the same track starts on their Spotify at your position, or opens in Apple Music search.',
      },
      {
        title: 'Apple Music and iTunes',
        body: 'It reads iTunes over COM and the Apple Music app through Windows media controls.',
      },
      {
        title: 'Spotify',
        body: 'Connect a Spotify developer app to show Spotify playback and start Listen Along directly.',
      },
      {
        title: 'Tray controls',
        body: 'Pause, reconnect to Discord, copy the Listen Along link or repair it from the tray menu.',
      },
      {
        title: 'Privacy switches',
        body: 'Turn off artwork upload or automatic join acceptance in settings.',
      },
      {
        title: 'Starts with Windows',
        body: 'One toggle launches it at sign-in, and a second launch never starts a duplicate.',
      },
    ],
    platforms: ['Windows 10 and 11 with the Discord desktop app'],
    stack: [
      'Python',
      'pypresence',
      'pywin32',
      'WinRT',
      'spotipy',
      'pystray',
      'PyInstaller',
      'Astro',
    ],
    status: 'LIVE',
    version: 'v1.0.0-beta',
    yearStarted: 2026,
    engineers: ['ali-younes'],
    origin: null,
    links: {
      site: 'https://eternalrichpresence.dev/',
      repo: 'https://github.com/sidebandstudio/Eternal-Rich-Presence',
      download: 'https://eternalrichpresence.dev/releases',
      docs: 'https://eternalrichpresence.dev/setup',
    },
    repo: 'sidebandstudio/Eternal-Rich-Presence',
    accentColor: '#FF6B7D',
    icon: image(
      'eternal-rich-presence',
      'icon.webp',
      512,
      512,
      'none',
      'artwork',
      'EternalRichPresence icon',
      'https://eternalrichpresence.dev/favicon.svg, rasterized at 512px',
    ),
    images: [
      image(
        'eternal-rich-presence',
        'discord-profile.webp',
        759,
        495,
        'none',
        'screenshot',
        'A Discord profile showing EternalRichPresence with cover art, track, artist and Ask to Join',
        'Earlier Sideband site capture public/assets/EternalRichPresence/EternalRichPresenceDiscordProfileView.png (pre 2.0 "Playing" style)',
      ),
      image(
        'eternal-rich-presence',
        'site-home-desktop.webp',
        2880,
        1800,
        'desktop',
        'screenshot',
        'The eternalrichpresence.dev home page',
        'Playwright capture of https://eternalrichpresence.dev/ at 1440x900, 2x, 2026-10-26',
      ),
      image(
        'eternal-rich-presence',
        'site-home-mobile.webp',
        780,
        1688,
        'mobile',
        'screenshot',
        'The eternalrichpresence.dev home page on a phone',
        'Playwright capture of https://eternalrichpresence.dev/ at 390x844, 2x, 2026-10-26',
      ),
      image(
        'eternal-rich-presence',
        'site-setup-desktop.webp',
        2880,
        1800,
        'desktop',
        'screenshot',
        'The EternalRichPresence setup guide',
        'Playwright capture of https://eternalrichpresence.dev/setup at 1440x900, 2x, 2026-10-26',
      ),
    ],
  },
  {
    id: 'exerly',
    name: 'Exerly Fitness',
    category: 'Fitness and nutrition',
    tagline: 'Food, weight and training targets that adapt to your real data.',
    description:
      'Exerly is a training and nutrition tracker with an iPhone app, an Apple Watch app and a web dashboard on one API. It smooths daily weigh-ins into a trend, measures what you burn from your food log, and moves your calorie and macro targets at weekly check-ins.',
    overview: [
      'Exerly is for people who log food and weigh in most days and want targets that follow measured data instead of a formula. It also plans and logs strength training, and it can import a history from MacroFactor.',
      'An Express API on PostgreSQL holds the nutrition engine. Weigh-ins become an exponentially weighted trend, and expenditure comes from intake against how that trend moved, starting from a Mifflin-St Jeor estimate and trusting measured data fully after 28 days.',
      'The SwiftUI app keeps logging offline and syncs with reviewed conflicts. It scans barcodes, reads nutrition labels with Apple Vision, records workouts on the watch with live heart rate and shares data with Apple Health. An MCP server lets a person’s own AI agent read their data and propose changes they approve.',
    ],
    features: [
      {
        title: 'Trend weight',
        body: 'Daily weigh-ins are smoothed into a trend line so progress is judged on the trend and not on single readings.',
      },
      {
        title: 'Measured expenditure',
        body: 'Exerly estimates what you burn from your food log and weight trend, then adjusts targets at weekly check-ins.',
      },
      {
        title: 'Barcode and label logging',
        body: 'Scan a barcode or photograph a nutrition label to log a food with its servings.',
      },
      {
        title: 'Works offline',
        body: 'Logs made without a connection wait on the device and sync later, with a review step when two edits conflict.',
      },
      {
        title: 'Training programs',
        body: 'Exerly builds a workout plan from your setup answers and equipment, and you review each day before saving.',
      },
      {
        title: 'Apple Watch and Health',
        body: 'Record a workout on the watch with live heart rate, and share weight, food and workouts with Apple Health.',
      },
      {
        title: 'Bring your own agent',
        body: 'Connect Claude, ChatGPT or another MCP client to read your data and send proposals you approve or undo.',
      },
      {
        title: 'Export and import',
        body: 'Download your account as JSON, or bring your history over from MacroFactor.',
      },
    ],
    platforms: ['iOS 26', 'watchOS 26', 'Web'],
    stack: [
      'Swift',
      'SwiftUI',
      'SwiftData',
      'HealthKit',
      'React 19',
      'Vite',
      'Express 5',
      'PostgreSQL',
      'MCP',
    ],
    status: 'IN DEVELOPMENT',
    version: null,
    yearStarted: 2025,
    engineers: ['ali-younes'],
    origin: null,
    links: {
      site: 'https://exerlyfitness.com/',
      repo: 'https://github.com/sidebandstudio/Exerly-Fitness',
    },
    repo: 'sidebandstudio/Exerly-Fitness',
    accentColor: '#8B5CF6',
    icon: image(
      'exerly',
      'icon.webp',
      512,
      512,
      'none',
      'artwork',
      'Exerly app icon',
      'repo apps/ios/Exerly/Assets.xcassets/AppIcon.appiconset/AppIcon.png, resized to 512px',
    ),
    images: [
      image(
        'exerly',
        'ios-program-expenditure.webp',
        1170,
        2532,
        'mobile',
        'screenshot',
        'The Exerly iPhone Program screen with measured expenditure and macro targets',
        'repo docs/ios-handoff-evidence/nutrition-program.png',
      ),
      image(
        'exerly',
        'ios-progress-weight.webp',
        1170,
        2532,
        'mobile',
        'screenshot',
        'The Exerly iPhone weight trend chart with scale readings and weekly rate',
        'repo docs/ios-handoff-evidence/progress-weight.png',
      ),
      image(
        'exerly',
        'ios-diary.webp',
        1170,
        2532,
        'mobile',
        'screenshot',
        'The Exerly iPhone diary with breakfast, lunch, dinner and snacks',
        'repo docs/ios-handoff-evidence/diary-yesterday.png',
      ),
      image(
        'exerly',
        'ios-food-detail.webp',
        1206,
        2622,
        'mobile',
        'screenshot',
        'An Exerly food detail screen with quantity, meal and nutrition facts',
        'repo brag-output/composition/assets/ui/phone-portion.png',
      ),
      image(
        'exerly',
        'ios-log-food.webp',
        1206,
        2622,
        'mobile',
        'screenshot',
        'The Exerly log food search with recent foods',
        'repo brag-output/composition/assets/ui/phone-recents.png',
      ),
      image(
        'exerly',
        'web-weight-desktop.webp',
        1280,
        1539,
        'desktop',
        'screenshot',
        'The Exerly web dashboard weight and measurements page',
        'repo docs/production-evidence/weight-web/weight-desktop.png',
      ),
      image(
        'exerly',
        'web-setup-targets-desktop.webp',
        1280,
        1101,
        'desktop',
        'screenshot',
        'The Exerly web setup step that reviews daily calorie and macro targets',
        'repo docs/production-evidence/setup-web/setup-review-desktop.png',
      ),
      image(
        'exerly',
        'site-home-desktop.webp',
        2880,
        1800,
        'desktop',
        'screenshot',
        'The exerlyfitness.com landing page',
        'Playwright capture of https://exerlyfitness.com/ at 1440x900, 2x, 2026-10-26',
      ),
      image(
        'exerly',
        'site-home-mobile.webp',
        780,
        1688,
        'mobile',
        'screenshot',
        'The exerlyfitness.com landing page on a phone',
        'Playwright capture of https://exerlyfitness.com/ at 390x844, 2x, 2026-10-26',
      ),
    ],
  },
  {
    id: 'tandemcode',
    name: 'TandemCode',
    category: 'Interview practice',
    tagline: 'Practice coding interview problems with a partner.',
    description:
      'TandemCode is a web app where two people solve a coding problem in one shared editor, chat, and run their Python against visible and hidden tests. Every room is recorded so the session can be replayed afterwards.',
    overview: [
      'In a coding interview you think aloud while someone watches your code take shape. TandemCode lets two people practice that together: one room, one editor with live cursors, a chat, and one verdict that both see at the same moment.',
      'The React app edits a Monaco editor over a Yjs document. A FastAPI server relays the editor frames between the two browsers without keeping a copy, records them for replay, and rate-limits every socket. Design rooms add a shared whiteboard in the same document.',
      'A run becomes a pending submission that a separate runner claims and judges inside a throwaway container with no network, a read-only disk and gVisor in production. Postgres notifies the room when the verdict lands, and an accepted run can be timed on larger inputs to estimate how it scales. The API, runner and database run on one AWS Lightsail host with Docker Compose and Caddy, and the web app is on Vercel.',
    ],
    features: [
      {
        title: 'Shared editor',
        body: 'Two people edit one Monaco editor and see each other’s cursors live.',
      },
      {
        title: 'Hidden tests',
        body: 'Each problem has visible examples plus hidden tests that report only pass or fail.',
      },
      {
        title: 'One verdict for the room',
        body: 'A run is judged once and the result appears for everyone in the room.',
      },
      {
        title: 'Session replay',
        body: 'After a room closes, anyone who was in it can replay the typing, the chat and every run.',
      },
      {
        title: 'Sandboxed runs',
        body: 'Every run gets its own container with no network and a read-only disk.',
      },
      {
        title: 'Complexity estimate',
        body: 'An accepted run can be timed on bigger inputs to estimate how it scales.',
      },
      {
        title: 'Public or unlisted rooms',
        body: 'Share a room by invite link, or list it and wait for a partner.',
      },
      {
        title: 'Design rooms',
        body: 'A shared whiteboard for system design practice that replays like code.',
      },
    ],
    platforms: ['Web'],
    stack: [
      'React 19',
      'TypeScript',
      'Monaco',
      'Yjs',
      'FastAPI',
      'asyncpg',
      'PostgreSQL',
      'Docker',
      'gVisor',
      'Clerk',
      'Caddy',
      'AWS Lightsail',
      'Vercel',
    ],
    status: 'LIVE',
    version: null,
    yearStarted: 2025,
    engineers: ['naman-rusia'],
    origin:
      'Built by Naman Rusia in naman0r/tandemcode, which the live site deploys from. Sideband keeps a fork in its organization.',
    links: {
      site: 'https://www.tandemcode.space/',
      repo: 'https://github.com/sidebandstudio/TandemCode',
      upstream: 'https://github.com/naman0r/tandemcode',
      docs: 'https://github.com/naman0r/tandemcode/tree/main/docs',
    },
    repo: 'sidebandstudio/TandemCode',
    upstreamRepo: 'naman0r/tandemcode',
    accentColor: '#F97316',
    icon: image(
      'tandemcode',
      'icon.webp',
      512,
      512,
      'none',
      'artwork',
      'TandemCode mascot: two pixel creatures sharing a laptop',
      'repo apps/web/public/mascot.png',
    ),
    images: [
      image(
        'tandemcode',
        'site-home-desktop.webp',
        2880,
        1800,
        'desktop',
        'screenshot',
        'The TandemCode home page with two cursors typing in a shared editor',
        'Playwright capture of https://www.tandemcode.space/ at 1440x900, 2x, 2026-10-26',
      ),
      image(
        'tandemcode',
        'site-home-mobile.webp',
        780,
        1688,
        'mobile',
        'screenshot',
        'The TandemCode home page on a phone',
        'Playwright capture of https://www.tandemcode.space/ at 390x844, 2x, 2026-10-26',
      ),
      image(
        'tandemcode',
        'site-about-desktop.webp',
        2880,
        1800,
        'desktop',
        'screenshot',
        'The TandemCode about page',
        'Playwright capture of https://www.tandemcode.space/about at 1440x900, 2x, 2026-10-26',
      ),
    ],
  },
  {
    id: 'better-canvas',
    name: 'Better Canvas',
    category: 'Browser extension',
    tagline: 'A darker, better organized Canvas for students.',
    description:
      'Better Canvas is a browser extension that restyles the Canvas learning platform. It adds a dark mode that reaches embedded frames, full theme packs, a planner with list, board and time grid views, and grade tools.',
    overview: [
      'Better Canvas is for students who use Canvas every day and want it darker, more personal and better organized, including schools on their own Canvas domains. A few helpers such as roster export and ungraded counts appear only for teachers and TAs.',
      'It is plain JavaScript with no framework. Each feature registers an idempotent apply step that runs on every change Canvas makes to the page, so styling survives its re-renders. The dark mode reads each element’s computed colors and retags only the ones that need changing, and the same engine runs inside SpeedGrader, New Quizzes and other same-origin frames.',
      'Planner and grade data come from the school’s own Canvas API with the student’s existing session, and marking a task done writes back to Canvas. Settings stay in the browser, with no account and no telemetry.',
    ],
    features: [
      {
        title: 'Dark mode everywhere',
        body: 'Dark mode reads each element’s real colors and also reaches SpeedGrader, New Quizzes and other embedded frames.',
      },
      {
        title: 'Theme packs',
        body: 'Themes change the wallpaper, course card art, panels, type and shapes together.',
      },
      {
        title: 'Photo search',
        body: 'Search Openverse for a photo or artwork and apply it as a theme with source and license credits.',
      },
      {
        title: 'Planner board',
        body: 'See Canvas tasks as a list, a board or a day time grid, and dropping a card on Done completes it in Canvas.',
      },
      {
        title: 'Grade tools',
        body: 'Each course grades page gets a goal tracker, a grade-needed-on-final solver and missing-work warnings.',
      },
      {
        title: 'Quiz draft saver',
        body: 'Classic quiz answers are saved locally as you type and offered back if the tab closes.',
      },
      {
        title: 'Command palette',
        body: 'Press Ctrl+K or Cmd+K to jump to any course, tab or command, with every shortcut rebindable.',
      },
      {
        title: 'Local only',
        body: 'Settings and study data stay in the browser, with no account and no telemetry.',
      },
    ],
    platforms: ['Chrome and Chromium browsers', 'Firefox 127 or later'],
    stack: ['JavaScript', 'Manifest V3', 'Canvas REST API', 'Openverse API'],
    status: 'IN DEVELOPMENT',
    version: '3.3.2',
    yearStarted: 2026,
    engineers: ['ali-tleis'],
    origin:
      'An independent build that shares its name and idea with the open-source BetterCanvas by ksucpea. It uses none of that code.',
    links: {
      repo: 'https://github.com/sidebandstudio/Better-Canvas',
    },
    repo: 'sidebandstudio/Better-Canvas',
    accentColor: '#F93D54',
    icon: image(
      'better-canvas',
      'icon.webp',
      128,
      128,
      'none',
      'artwork',
      'Better Canvas icon',
      'repo icons/icon-128.png',
    ),
    images: [
      image(
        'better-canvas',
        'settings-themes.webp',
        2880,
        1800,
        'desktop',
        'screenshot',
        'The Better Canvas settings page with its sample Canvas preview and the theme gallery',
        'Playwright capture of chrome-extension://<id>/src/options/options.html with the unpacked extension (repo 3ba9169, v3.3.2) loaded in Chromium, 1440x900, 2x, 2026-10-26',
      ),
      image(
        'better-canvas',
        'settings-theme-preview.webp',
        2880,
        1800,
        'desktop',
        'screenshot',
        'Better Canvas previewing the Forest Reverie theme on its sample Canvas dashboard',
        'Playwright capture of the same settings page after picking Forest Reverie in the theme gallery, 1440x900, 2x, 2026-10-26',
      ),
      image(
        'better-canvas',
        'theme-anime-night.webp',
        1536,
        1024,
        'none',
        'artwork',
        'The Anime Night theme wallpaper that ships with Better Canvas',
        'repo src/assets/themes/anime-night-wallpaper.webp (theme artwork, made with an image model per docs/artwork-prompts.txt)',
      ),
      image(
        'better-canvas',
        'theme-anime-garden.webp',
        1536,
        1024,
        'none',
        'artwork',
        'The Anime Garden theme wallpaper that ships with Better Canvas',
        'repo src/assets/themes/anime-garden-wallpaper.webp (theme artwork, made with an image model per docs/artwork-prompts.txt)',
      ),
    ],
  },
  {
    id: 'eternal2x',
    name: 'Eternal2x',
    category: 'Video plugin',
    tagline: 'Smooth 2x for hand-drawn animation in DaVinci Resolve.',
    description:
      'Eternal2x is a DaVinci Resolve Studio plugin that finds the real drawings in animation held on 2s or 3s and draws the missing in-betweens with the RIFE network. The rebuilt clip keeps its length and timing, gets a 2x upscale and lands on the track above the original.',
    overview: [
      'Hand-drawn animation often holds each drawing for two or three frames. Eternal2x is for editors working with anime and other drawn footage who want smoother motion without the torn lines that optical-flow retimers leave.',
      'A Lua panel inside Resolve starts a Python worker in the background. OpenCV scores every frame against the last new drawing with a tile-based difference, so a blink still counts as new, and works out whether the clip is on 1s, 2s or 3s. It refuses live action and clips already on 1s.',
      'Practical-RIFE 4.25 runs through ONNX Runtime, on the GPU through DirectML on Windows, and draws each missing frame. Every real drawing stays on its original frame, a quick optical-flow check spots cuts so they snap instead of blending, and the result comes back through the Resolve API with Super Scale applied.',
    ],
    features: [
      {
        title: 'Analyse first',
        body: 'It reports how many frames are unique drawings and whether the clip is on 1s, 2s or 3s without changing anything.',
      },
      {
        title: 'Drawn in-betweens',
        body: 'The RIFE network draws each missing frame, on the GPU on Windows.',
      },
      {
        title: 'Timing stays put',
        body: 'Every drawing starts on its original frame, so cuts and lip sync still line up with the edit.',
      },
      {
        title: 'Holds and cuts respected',
        body: 'Deliberate held poses stay still and scene changes snap instead of blending.',
      },
      {
        title: 'Upscale 2x',
        body: 'The result comes back with Resolve’s Super Scale applied.',
      },
      {
        title: 'Lands above the original',
        body: 'The render goes on the track above the source clip, and Show Original flips between the two.',
      },
      {
        title: 'Grainy source mode',
        body: 'A switch raises the threshold above film grain so held frames are not mistaken for new drawings.',
      },
      {
        title: 'Background render and checked updates',
        body: 'Resolve stays usable while it renders, and updates are verified by checksum before they apply.',
      },
    ],
    platforms: ['Windows 10 and 11', 'macOS 12 or later'],
    stack: [
      'Python',
      'Lua',
      'OpenCV',
      'NumPy',
      'ONNX Runtime',
      'DirectML',
      'RIFE 4.25',
      'DaVinci Resolve API',
    ],
    status: 'LIVE',
    version: 'v0.4.0',
    yearStarted: 2026,
    engineers: ['ali-tleis'],
    origin: null,
    links: {
      site: 'https://eternal2x.com/',
      repo: 'https://github.com/sidebandstudio/Eternal2x.com',
      download: 'https://eternal2x.com/download.html',
      docs: 'https://eternal2x.com/help.html',
    },
    repo: 'sidebandstudio/Eternal2x.com',
    accentColor: '#7C6FEF',
    icon: image(
      'eternal2x',
      'icon.webp',
      512,
      512,
      'none',
      'artwork',
      'Eternal2x neon E2x logo',
      'repo public/logo/Eternal 2x logo 01.png, center crop to square',
    ),
    images: [
      image(
        'eternal2x',
        'resolve-panel.webp',
        1600,
        861,
        'desktop',
        'screenshot',
        'DaVinci Resolve Studio with the Eternal2x panel after a render, the smoothed clip on the track above the original',
        'repo docs/assets/demo/resolve.jpg',
        { credit: HERO_CREDIT },
      ),
      image(
        'eternal2x',
        'frames-compare.webp',
        1200,
        760,
        'none',
        'artwork',
        'Six frames of a walk as drawn on 2s compared with Eternal2x and its new in-betweens',
        'repo docs/assets/demo/frames.jpg',
        { credit: HERO_CREDIT },
      ),
      image(
        'eternal2x',
        'site-home-desktop.webp',
        2880,
        1800,
        'desktop',
        'screenshot',
        'The eternal2x.com home page with the before and after comparison',
        'Playwright capture of https://eternal2x.com/ at 1440x900, 2x, 2026-10-26',
        { credit: HERO_CREDIT },
      ),
      image(
        'eternal2x',
        'site-home-mobile.webp',
        780,
        1688,
        'mobile',
        'screenshot',
        'The eternal2x.com home page on a phone',
        'Playwright capture of https://eternal2x.com/ at 390x844, 2x, 2026-10-26',
        { credit: HERO_CREDIT },
      ),
    ],
  },
  {
    id: 'eternal-summary',
    name: 'Eternal Summary',
    category: 'Browser extension',
    tagline: 'Summarize the page you are reading, with sources you can check.',
    description:
      'Eternal Summary is a Chrome extension that summarizes the page you are on in a panel beside the article. It also summarizes a highlighted passage, answers follow-up questions, and links every answer to the passages it used.',
    overview: [
      'Eternal Summary is for readers who want the gist of an article, doc or research page before deciding whether to read it, and who want answers tied to the page text. It runs in Chrome and other Chromium browsers.',
      'The content script finds the main text container and samples long pages from the start, middle and end rather than only the opening. A small Express server on Vercel holds the Gemini key, calls gemini-2.5-flash with fixed caps and a timeout, and only accepts requests from extensions.',
      'The panel renders in closed shadow roots, so the page can neither restyle it nor press its buttons. Each summary comes with a reading time and a verdict on whether the page is worth reading, and clicking a cited source scrolls to it and highlights it.',
    ],
    features: [
      {
        title: 'One-click page summary',
        body: 'Click the toolbar icon or press Cmd+Shift+S and a summary opens in a panel beside the article.',
      },
      {
        title: 'Four styles',
        body: 'Choose summary, bullets, key points or plain English, and each new style is added below the last.',
      },
      {
        title: 'Worth reading verdict',
        body: 'The header shows reading time and says whether the page is worth reading, a skim or skippable, with the reason.',
      },
      {
        title: 'Clickable sources',
        body: 'Every answer lists the passages it used, and clicking one scrolls to it and highlights it.',
      },
      {
        title: 'Highlight to summarize',
        body: 'Select text and a Summarize button appears, opening a card that follows the passage as you scroll.',
      },
      {
        title: 'Follow-up questions',
        body: 'Ask about the page in the same panel and the answer cites the page where it can.',
      },
      {
        title: 'Thirteen languages',
        body: 'Get answers in thirteen languages while quotes stay in the page’s own words.',
      },
      {
        title: 'Local cache',
        body: 'Summaries stay in your browser for thirty minutes, so reopening a page costs nothing.',
      },
    ],
    platforms: ['Chrome and Chromium browsers'],
    stack: ['JavaScript', 'Manifest V3', 'Express 5', 'Gemini API', 'Vercel'],
    status: 'LIVE',
    version: '1.7.0',
    yearStarted: 2025,
    engineers: ['ali-tleis'],
    origin: null,
    links: {
      site: 'https://sidebandstudio.github.io/Eternal-Summary/',
      repo: 'https://github.com/sidebandstudio/Eternal-Summary',
      store:
        'https://chromewebstore.google.com/detail/eternal-summary/cpdeianknlpdhlbfdgckdcgfglbhkjbf',
    },
    // LICENSE: "Eternal Summary License", copyright Ali Tleis, personal and educational use only.
    licenseNote: 'Eternal Summary License, all rights reserved',
    repo: 'sidebandstudio/Eternal-Summary',
    accentColor: '#7B8CFF',
    icon: image(
      'eternal-summary',
      'icon.webp',
      512,
      512,
      'none',
      'artwork',
      'Eternal Summary icon',
      'repo icons/icon-512.png',
    ),
    images: [
      image(
        'eternal-summary',
        'panel-beside-article.webp',
        2720,
        1720,
        'desktop',
        'screenshot',
        'The Eternal Summary panel beside an article with a summary, a verdict and numbered sources',
        'repo docs/shots/panel.png',
      ),
      image(
        'eternal-summary',
        'bullets-mode.webp',
        2720,
        1720,
        'desktop',
        'screenshot',
        'Eternal Summary in bullets mode',
        'repo docs/shots/bullets.png',
      ),
      image(
        'eternal-summary',
        'follow-up-chat.webp',
        2720,
        1720,
        'desktop',
        'screenshot',
        'A follow-up question thread in the Eternal Summary panel',
        'repo docs/shots/chat.png',
      ),
      image(
        'eternal-summary',
        'selection-card.webp',
        2720,
        1720,
        'desktop',
        'screenshot',
        'An Eternal Summary card anchored to a highlighted passage',
        'repo docs/shots/selection.png',
      ),
      image(
        'eternal-summary',
        'site-home-desktop.webp',
        2880,
        1800,
        'desktop',
        'screenshot',
        'The Eternal Summary site',
        'Playwright capture of https://sidebandstudio.github.io/Eternal-Summary/ at 1440x900, 2x, 2026-10-26',
      ),
      image(
        'eternal-summary',
        'site-home-mobile.webp',
        780,
        1688,
        'mobile',
        'screenshot',
        'The Eternal Summary site on a phone',
        'Playwright capture of https://sidebandstudio.github.io/Eternal-Summary/ at 390x844, 2x, 2026-10-26',
      ),
    ],
  },
  {
    id: 'hushtype',
    name: 'hushtype',
    category: 'Mac dictation',
    tagline: 'Hold a key, speak, and the text appears where you type.',
    description:
      'hushtype is a menu bar dictation app for the Mac. Hold Option-Space, speak and release, and it pastes the text at the cursor in whatever app is in front. Speech recognition runs on the Mac, and an optional local model removes fillers before the paste.',
    overview: [
      'hushtype is for Mac users on Apple silicon who want to dictate into any app without sending their voice to a cloud service. Cleanup changes per app, so chat, email and code editors each get their own wording.',
      'NVIDIA Parakeet V3 transcribes on the Mac. At the start of each recording hushtype reads the frontmost app, window title and browser address through Accessibility and picks a mode. An optional pass through Ollama or any OpenAI-compatible server then strips fillers and false starts under a short deadline.',
      'A hygiene check rejects edits that add words, change numbers or drop a negation, and any timeout or error pastes the raw transcript instead. If the focused control will not take a paste, the text stays on the clipboard with a notice. The Tauri app is built on the open-source Handy.',
    ],
    features: [
      {
        title: 'Hold to talk',
        body: 'Hold Option-Space, speak, and release to paste the text at the cursor.',
      },
      {
        title: 'Recognition on your Mac',
        body: 'Parakeet V3 transcribes locally, so audio is never uploaded.',
      },
      {
        title: 'Optional cleanup',
        body: 'A language model on Ollama or any OpenAI-compatible server removes fillers and false starts.',
      },
      {
        title: 'Raw text when cleanup fails',
        body: 'Timeouts, errors and rejected edits paste exactly what you said, with no error dialog.',
      },
      {
        title: 'Modes per app',
        body: 'Messaging, Email, Code and Default match by app or web address and change wording and style.',
      },
      {
        title: 'Dictionary',
        body: 'Custom words fix names the recognizer mishears, and replacements run last.',
      },
      {
        title: 'Clipboard fallback',
        body: 'If an app will not take the paste, the text stays on the clipboard with a notice.',
      },
      {
        title: 'One-line install',
        body: 'A Terminal command downloads the app and model, checks every SHA-256 and installs to Applications.',
      },
    ],
    platforms: ['macOS 14 or later on Apple silicon'],
    stack: [
      'Rust',
      'Tauri 2',
      'React 19',
      'TypeScript',
      'ONNX Runtime',
      'Parakeet V3',
      'Silero VAD',
      'Ollama',
    ],
    status: 'LIVE',
    version: '0.3.0',
    yearStarted: 2026,
    engineers: ['ali-younes'],
    origin:
      'Built on Handy, an MIT-licensed app by CJ Pais. hushtype itself is proprietary.',
    links: {
      site: 'https://hushtype.vercel.app/',
      repo: 'https://github.com/sidebandstudio/hushtype',
      upstream: 'https://github.com/cjpais/Handy',
      download: 'https://hushtype.vercel.app/#install',
    },
    // LICENSE: "proprietary and confidential", copyright Ali Younes (Sideband Studio).
    licenseNote: 'Proprietary, all rights reserved',
    repo: 'sidebandstudio/hushtype',
    accentColor: '#B2C8A6',
    icon: image(
      'hushtype',
      'icon.webp',
      512,
      512,
      'none',
      'artwork',
      'hushtype app icon',
      'repo website/brand/icon-512.png',
    ),
    images: [
      image(
        'hushtype',
        'app-dictation-dark.webp',
        1092,
        872,
        'desktop',
        'screenshot',
        'hushtype dictation settings in dark mode with the Option-Space shortcut',
        'repo website/images/app-dark.png',
      ),
      image(
        'hushtype',
        'app-modes-light.webp',
        1092,
        972,
        'desktop',
        'screenshot',
        'hushtype mode settings listing Messaging, Email, Code and Default',
        'repo website/images/app-light.png',
      ),
      image(
        'hushtype',
        'site-home-desktop.webp',
        2880,
        1800,
        'desktop',
        'screenshot',
        'The hushtype site with its dictation demo',
        'Playwright capture of https://hushtype.vercel.app/ at 1440x900, 2x, 2026-10-26',
      ),
      image(
        'hushtype',
        'site-home-mobile.webp',
        780,
        1688,
        'mobile',
        'screenshot',
        'The hushtype site on a phone',
        'Playwright capture of https://hushtype.vercel.app/ at 390x844, 2x, 2026-10-26',
      ),
    ],
  },
  {
    id: 'eternal-exchange',
    name: 'EternalExchange',
    category: 'Minecraft mod',
    tagline: 'Equivalent exchange alchemy for Minecraft 1.21.1 on Fabric.',
    description:
      'EternalExchange is a Fabric mod for Minecraft Java 1.21.1 that gives every item an EMC value worked out from the game’s recipes. Players learn an item once, break matter down into EMC, and spend EMC to make anything they have learned.',
    overview: [
      'EternalExchange is for Minecraft Java players and server owners on Fabric 1.21.1 who want equivalent exchange gameplay. It began as a Fabric port of the NeoForge mod ProjectE and keeps its data formats, so ProjectE worlds can move over.',
      'When a world loads, mappers read crafting, smithing, brewing and other recipes into a graph. The solver prices every item with exact fractions, re-pricing anything that depends on a value that changed, and the server sends the results to each client.',
      'A shim layer stands in for the NeoForge APIs the original relied on, and nine Mixins add the hooks NeoForge gave as events. It runs on clients and dedicated servers, and values can be overridden with a JSON file or datapacks.',
    ],
    features: [
      {
        title: 'Recipe-based values',
        body: 'Item values are worked out from the full recipe graph when the world loads, so items from other mods get priced too.',
      },
      {
        title: 'Transmutation Table',
        body: 'Learn an item once, burn matter into EMC, and make any learned item back.',
      },
      {
        title: 'Automation line',
        body: 'Energy Collectors make EMC from light, relays buffer it, and condensers copy a locked item.',
      },
      {
        title: 'Dark and Red Matter gear',
        body: 'Tools, weapons and armor with charge levels, modes and area abilities.',
      },
      {
        title: 'Philosopher’s Stone',
        body: 'Transmute blocks in the world with a live preview overlay.',
      },
      {
        title: 'Alchemical Bags',
        body: 'Color-coded 104-slot bags that travel with the player.',
      },
      {
        title: 'Data-driven values',
        body: 'Override any value with a JSON file, datapack conversions or the config.',
      },
    ],
    platforms: ['Minecraft Java 1.21.1 with Fabric'],
    stack: ['Java 21', 'Fabric Loader', 'Fabric API', 'Mixin', 'Gradle'],
    status: 'LIVE',
    version: 'v1.0.0',
    yearStarted: 2026,
    engineers: ['ali-younes'],
    origin: 'Began as a Fabric port of ProjectE (MIT).',
    links: {
      site: 'https://eternalexchangemod.com/',
      repo: 'https://github.com/sidebandstudio/EternalExchange',
      upstream: 'https://github.com/sinkillerj/ProjectE',
      download: 'https://github.com/sidebandstudio/EternalExchange/releases',
    },
    repo: 'sidebandstudio/EternalExchange',
    accentColor: '#4BD07A',
    icon: image(
      'eternal-exchange',
      'icon.webp',
      512,
      512,
      'none',
      'artwork',
      'EternalExchange mark',
      'https://eternalexchangemod.com/assets/favicon.svg, rasterized at 512px',
    ),
    images: [
      image(
        'eternal-exchange',
        'site-home-desktop.webp',
        2880,
        1800,
        'desktop',
        'screenshot',
        'The eternalexchangemod.com home page with a list of EMC values',
        'Playwright capture of https://eternalexchangemod.com/ at 1440x900, 2x, 2026-10-26',
      ),
      image(
        'eternal-exchange',
        'site-home-mobile.webp',
        780,
        1688,
        'mobile',
        'screenshot',
        'The eternalexchangemod.com home page on a phone',
        'Playwright capture of https://eternalexchangemod.com/ at 390x844, 2x, 2026-10-26',
      ),
    ],
  },
  // Describes what topchoicerealtyny.com serves: branch fleet/recover-local-migration
  // at 2a92bec (open PR #1, not merged). A clean build of that commit reproduces the
  // live index.html, index-bsDzy4H7.js and index-DKQi0Pci.css byte for byte, and the
  // live headers, 405 handling and tcr_session cookie come from its vercel.json and
  // api/ router. main (6ddd9249) is the older Express + MongoDB app and is not deployed.
  {
    id: 'top-choice-realty',
    name: 'Top Choice Realty',
    category: 'Client website',
    tagline: 'Listings site and agent back office for a New York brokerage.',
    description:
      'A website and agent back office for Top Choice Realty LLC, a Staten Island brokerage serving New York and New Jersey. Visitors browse listings and message the listing agent, and signed-in agents manage listings, sales and customers.',
    overview: [
      'The public side lets home buyers filter the brokerage’s listings by keyword, neighborhood, price and bedrooms and send an inquiry that reaches the listing agent by email. Agents and an admin sign in to manage their own listings and customers.',
      'The React app talks to one Vercel function that routes every API path to its own module, over Supabase Postgres. Sessions are signed tokens in an httpOnly cookie, and every agent query is scoped to that agent’s own records.',
      'Marking a listing sold opens a buyer form, and one database call closes the listing and links it to the new customer record. Inquiries are rate limited in the database, since serverless instances do not share memory. The live site runs this rewrite from a branch still in review, and the main branch keeps the earlier Express and MongoDB version.',
    ],
    features: [
      {
        title: 'Listing search',
        body: 'Filter active listings by keyword, neighborhood, price range and bedrooms with paged results.',
      },
      {
        title: 'Inquiry to the listing agent',
        body: 'A buyer sends a message from a listing and the agent gets an email with the listing and the buyer’s details.',
      },
      {
        title: 'Agent dashboard',
        body: 'Agents create, edit, delete and change the status of their own listings.',
      },
      {
        title: 'Sold capture',
        body: 'Setting a listing to sold records the buyer and closes the listing in one step.',
      },
      {
        title: 'Customer book',
        body: 'Agents search customers by name, email or phone and see which home each one bought.',
      },
      {
        title: 'Meet the team',
        body: 'A public page lists the agents with photo, bio and contact details.',
      },
    ],
    platforms: ['Web'],
    stack: [
      'React 18',
      'TypeScript',
      'Vite',
      'Tailwind',
      'TanStack Query',
      'Node.js 22',
      'Vercel Functions',
      'Supabase Postgres',
    ],
    status: 'IN DEVELOPMENT',
    version: null,
    yearStarted: 2025,
    engineers: ['ali-younes', 'ali-tleis'],
    origin: null,
    links: {
      site: 'https://topchoicerealtyny.com/',
      repo: 'https://github.com/sidebandstudio/topchoicerealty',
    },
    repo: 'sidebandstudio/topchoicerealty',
    accentColor: '#D4AF37',
    icon: image(
      'top-choice-realty',
      'icon.webp',
      512,
      512,
      'none',
      'artwork',
      'Top Choice Realty LLC logo',
      'repo apps/web/src/assets/topchoicerealtypfp.jpg, resized to 512px',
    ),
    images: [
      image(
        'top-choice-realty',
        'site-home-desktop.webp',
        2880,
        1800,
        'desktop',
        'screenshot',
        'The Top Choice Realty home page',
        'Playwright capture of https://topchoicerealtyny.com/ at 1440x900, 2x, 2026-10-26',
      ),
      image(
        'top-choice-realty',
        'site-home-mobile.webp',
        780,
        1688,
        'mobile',
        'screenshot',
        'The Top Choice Realty home page on a phone',
        'Playwright capture of https://topchoicerealtyny.com/ at 390x844, 2x, 2026-10-26',
      ),
      image(
        'top-choice-realty',
        'site-login-desktop.webp',
        2880,
        1800,
        'desktop',
        'screenshot',
        'The Top Choice Realty agent login',
        'Playwright capture of https://topchoicerealtyny.com/login at 1440x900, 2x, 2026-10-26',
      ),
    ],
  },
  {
    id: 'signature-cuts',
    name: 'Signature Cuts 413',
    category: 'Client website',
    tagline: 'Book a barber by text message, no app needed.',
    description:
      'A one-page site for Signature Cuts 413, a barbershop in Chicopee, Massachusetts. Customers see services, barbers, hours and directions, and book by filling a short form that opens a ready-written text or WhatsApp message to the barber they picked.',
    overview: [
      'The site is for the shop’s customers, mostly on phones, and for its three barbers, who receive booking requests as texts on their own numbers. There is no booking backend to run or pay for.',
      'It is a static Next.js export published to GitHub Pages on every push. All shop data lives in typed config files: services and prices, barbers and their numbers, and weekly hours that generate 30-minute slots.',
      'The booking form checks the date against the shop’s hours, writes the message and builds an SMS link with the right separator for iPhone or Android, with the body fully encoded so symbols and emoji survive. A WhatsApp link carries the same message.',
    ],
    features: [
      {
        title: 'Text to book',
        body: 'The form writes the booking request and opens your messages app addressed to your barber.',
      },
      {
        title: 'WhatsApp booking',
        body: 'The same request can go out as a WhatsApp message instead.',
      },
      {
        title: 'Pick your barber',
        body: 'Each barber has a profile card, and tapping one preselects them in the form.',
      },
      {
        title: 'Open-hours slots',
        body: 'Time choices follow the shop’s real hours, and closed days and past dates are blocked.',
      },
      {
        title: 'At-home and after-hours',
        body: 'The barber who offers it can take an at-home or out-of-hours request.',
      },
      {
        title: 'Price list',
        body: 'All 11 services are listed with prices from $8 to $45.',
      },
      {
        title: 'Call and directions bar',
        body: 'A fixed bar on phones gives one-tap calling and directions in Apple Maps or Google Maps.',
      },
    ],
    platforms: ['Web'],
    stack: [
      'Next.js 14',
      'React 18',
      'TypeScript',
      'Tailwind',
      'Framer Motion',
      'GitHub Pages',
    ],
    status: 'LIVE',
    version: null,
    yearStarted: 2026,
    engineers: ['ali-younes'],
    origin: null,
    links: {
      site: 'https://signaturecutschicopee.com/',
      repo: 'https://github.com/whoisaldo/SignatureCuts',
    },
    repo: 'whoisaldo/SignatureCuts',
    accentColor: '#D4C5B0',
    icon: null,
    images: [
      image(
        'signature-cuts',
        'site-home-desktop.webp',
        2880,
        1800,
        'desktop',
        'screenshot',
        'The Signature Cuts 413 home page',
        'Playwright capture of https://signaturecutschicopee.com/ at 1440x900, 2x, 2026-10-26',
      ),
      image(
        'signature-cuts',
        'site-home-mobile.webp',
        780,
        1688,
        'mobile',
        'screenshot',
        'The Signature Cuts 413 home page on a phone',
        'Playwright capture of https://signaturecutschicopee.com/ at 390x844, 2x, 2026-10-26',
      ),
      image(
        'signature-cuts',
        'booking-send-mobile.webp',
        780,
        1688,
        'mobile',
        'screenshot',
        'The booking form with a time picked and the WhatsApp and text message send buttons',
        'Playwright capture of the #booking form on https://signaturecutschicopee.com/ after filling it, 390x844, 2x, 2026-10-26',
      ),
      image(
        'signature-cuts',
        'storefront.webp',
        1206,
        1207,
        'none',
        'photo',
        'The Signature Barber Shop storefront in Chicopee',
        'repo public/images/Store-images/StoreFront.jpg',
      ),
    ],
  },
]

export function getProductById(id: string) {
  return products.find((product) => product.id === id)
}

/** The repo ranking reads: where the product is developed. */
export function productRepo(product: Product): GithubRepo {
  const key = product.upstreamRepo ?? product.repo
  const repo = getRepo(key)
  if (!repo) {
    throw new Error(
      `${key} is missing from lib/data/github.json. Run npm run sync:github.`,
    )
  }
  return repo
}

/**
 * OSI-approved licenses, by SPDX id as GitHub reports them. Only these count
 * as open source. https://opensource.org/licenses
 */
const OSI_APPROVED = new Set([
  '0BSD',
  'AFL-3.0',
  'AGPL-3.0',
  'Apache-2.0',
  'Artistic-2.0',
  'BSD-2-Clause',
  'BSD-3-Clause',
  'BSL-1.0',
  'ECL-2.0',
  'EPL-1.0',
  'EPL-2.0',
  'EUPL-1.2',
  'GPL-2.0',
  'GPL-3.0',
  'ISC',
  'LGPL-2.1',
  'LGPL-3.0',
  'MIT',
  'MPL-2.0',
  'MS-PL',
  'MS-RL',
  'OSL-3.0',
  'Unlicense',
  'UPL-1.0',
  'Zlib',
])

export interface ProductLicense {
  /** SPDX id, or null when GitHub cannot identify the license or there is none. */
  spdx: string | null
  name: string
  openSource: boolean
  /** The LICENSE file on GitHub, or null when the repo has none. */
  url: string | null
}

/**
 * The license of the product's own repo (`repo`, not the upstream), from the
 * snapshot's detected license and LICENSE file. Server-side: reads the snapshot.
 *
 * - An identified OSI-approved license is open source.
 * - A LICENSE file GitHub cannot identify (NOASSERTION) is not, and its name
 *   comes from `licenseNote`, read from the file.
 * - No LICENSE file means all rights reserved.
 */
export function productLicense(product: Product): ProductLicense {
  const repo = getRepo(product.repo)
  if (!repo) {
    throw new Error(
      `${product.repo} is missing from lib/data/github.json. Run npm run sync:github.`,
    )
  }
  const url = repo.licenseFile?.url ?? null
  if (!repo.licenseFile) {
    return {
      spdx: null,
      name: 'No license, all rights reserved',
      openSource: false,
      url,
    }
  }
  if (!repo.license || repo.license === 'NOASSERTION') {
    if (!product.licenseNote) {
      throw new Error(
        `${product.repo} has a LICENSE file GitHub cannot identify. Read it and set licenseNote on ${product.id}.`,
      )
    }
    return { spdx: null, name: product.licenseNote, openSource: false, url }
  }
  return {
    spdx: repo.license,
    name: repo.licenseName ?? repo.license,
    openSource: OSI_APPROVED.has(repo.license),
    url,
  }
}

export interface ProductRankInputs {
  stars: number
  forks: number
  downloads: number
  codeBytes: number
  commits: number
  contributors: number
  platforms: number
}

export interface RankedProduct {
  product: Product
  rank: number
  score: number
  popularity: number
  scope: number
  inputs: ProductRankInputs
}

export function rankInputs(product: Product): ProductRankInputs {
  const repo = productRepo(product)
  return {
    stars: repo.stars,
    forks: repo.forks,
    downloads: repo.downloads,
    codeBytes: repoCodeBytes(repo),
    commits: repo.commits,
    contributors: repo.contributors.length,
    platforms: product.platforms.length,
  }
}

/**
 * Products ordered by popularity first, then scope, all from the GitHub
 * snapshot and the platform list. No rank is typed by hand.
 *
 * Each input is log-scaled, log10(1 + x), so a handful of stars still counts
 * and one large repo does not flatten the rest, then divided by the largest
 * value across all products so it lands between 0 and 1.
 *
 *   popularity = mean(stars, forks, release downloads)
 *   scope      = mean(code bytes, default-branch commits, human contributors, platforms)
 *   score      = 0.65 * popularity + 0.35 * scope
 *
 * Popularity carries the larger weight, so real use outranks size, and scope
 * orders the products that nobody has starred or downloaded yet. Ties go to
 * the name. Code bytes count everything in the repo, including code a product
 * inherited (hushtype from Handy, EternalExchange from ProjectE), and their low
 * commit counts pull that back. TandemCode reads its upstream repo, where it
 * is built and deployed from.
 */
export function rankedProducts(): RankedProduct[] {
  const rows = products.map((product) => ({
    product,
    inputs: rankInputs(product),
  }))
  const keys = Object.keys(rows[0].inputs) as (keyof ProductRankInputs)[]
  const max = Object.fromEntries(
    keys.map((k) => [
      k,
      Math.max(...rows.map((r) => Math.log10(1 + r.inputs[k]))),
    ]),
  ) as Record<keyof ProductRankInputs, number>
  const norm = (inputs: ProductRankInputs, k: keyof ProductRankInputs) =>
    max[k] === 0 ? 0 : Math.log10(1 + inputs[k]) / max[k]
  const mean = (inputs: ProductRankInputs, ks: (keyof ProductRankInputs)[]) =>
    ks.reduce((sum, k) => sum + norm(inputs, k), 0) / ks.length

  return rows
    .map(({ product, inputs }) => {
      const popularity = mean(inputs, ['stars', 'forks', 'downloads'])
      const scope = mean(inputs, [
        'codeBytes',
        'commits',
        'contributors',
        'platforms',
      ])
      return {
        product,
        inputs,
        popularity,
        scope,
        score: 0.65 * popularity + 0.35 * scope,
      }
    })
    .sort(
      (a, b) =>
        b.score - a.score || a.product.name.localeCompare(b.product.name),
    )
    .map((row, i) => ({ ...row, rank: i + 1 }))
}

/** Products in ranked order. */
export function productsByRank(): Product[] {
  return rankedProducts().map((r) => r.product)
}
