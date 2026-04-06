export type ProductStatus = 'LIVE' | 'IN DEVELOPMENT' | 'COMING SOON'

export interface Product {
  id: string
  name: string
  tagline: string
  description: string
  status: ProductStatus
  tags: string[]
  url: string | null
  github: string | null
  version: string | null
  accentColor: string
  highlight: string
}

export const products: Product[] = [
  {
    id: 'eternal-monitor',
    name: 'EternalMonitor',
    tagline:
      'Use your iPad as a low-latency Windows display receiver. No dongle. No driver.',
    description:
      'Windows host captures via DXGI Desktop Duplication, transcodes BGRA→YUV420P, encodes H.264 via hardware (per-vendor auto-detect: NVENC, AMF, QuickSync), and streams over fragmented UDP. iPad client reassembles, decodes via VideoToolbox, renders with Metal. Zero-config discovery via mDNS/DNS-SD.',
    status: 'IN DEVELOPMENT',
    tags: [
      'Rust',
      'Swift',
      'DXGI',
      'VideoToolbox',
      'Metal',
      'UDP',
      'mDNS',
      'FFmpeg',
      'H.264',
    ],
    url: 'https://eternalmonitor.dev',
    github: 'https://github.com/whoisaldo/EternalMonitor',
    version: 'v0.1.1-mirror',
    accentColor: '#A855F7',
    highlight: 'Hardware H.264 encode · Metal render · mDNS zero-config',
  },
  {
    id: 'eternal-rich-presence',
    name: 'EternalRichPresence',
    tagline:
      'Discord Rich Presence for Apple Music & Spotify. Live cover art. Zero friction.',
    description:
      'Bridges Windows SMTC (System Media Transport Controls) to Discord Rich Presence. Live cover art upload, Listen Along deep-link via custom eternalrp:// URI scheme, system tray host, portable .exe via PyInstaller. Provider priority: Apple Music → Spotify fallback.',
    status: 'LIVE',
    tags: [
      'Python',
      'pywin32',
      'pypresence',
      'COM/SMTC',
      'PowerShell',
      'PyInstaller',
    ],
    url: null,
    github: 'https://github.com/whoisaldo/Eternal-Rich-Presence',
    version: 'v1.0.0-beta',
    accentColor: '#6366F1',
    highlight: 'SMTC bridge · custom URI scheme · portable .exe',
  },
  {
    id: 'exerly',
    name: 'Exerly Fitness',
    tagline:
      'Cross-platform fitness companion built for people serious about their training.',
    description:
      'Barcode scanning via FatSecret API, 12-step onboarding wizard computing BMI/TDEE/macro targets, AI coaching via Gemini 2.0 Flash. Monorepo with shared Express API serving both web and iOS. iOS client built in SwiftUI with HealthKit sync, barcode scanning, and progress photo compare mode.',
    status: 'IN DEVELOPMENT',
    tags: [
      'SwiftUI',
      'HealthKit',
      'React',
      'TypeScript',
      'Node.js',
      'MongoDB',
      'Gemini AI',
      'DigitalOcean',
      'Tailwind',
    ],
    url: 'https://whoisaldo.github.io/Exerly-Fitness/',
    github: 'https://github.com/whoisaldo/Exerly-Fitness',
    version: null,
    accentColor: '#D946EF',
    highlight:
      'SwiftUI + HealthKit · Gemini 2.0 Flash AI · shared monorepo API',
  },
  {
    id: 'signature-cuts',
    name: 'Signature Cuts 413',
    tagline: 'Modern barbershop booking. No app download. No friction.',
    description:
      'Static Next.js site with Tailwind CSS. SMS and WhatsApp deep-link booking flow with proper URI encoding. Custom domain on Namecheap. Built to be fast, mobile-first, and dead simple for clients.',
    status: 'LIVE',
    tags: ['Next.js', 'Tailwind', 'SMS Booking', 'Static Site'],
    url: 'https://signaturecutschicopee.com',
    github: null,
    version: null,
    accentColor: '#C084FC',
    highlight: 'SMS deep-link booking · mobile-first · zero backend',
  },
]
