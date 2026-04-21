export type ProductStatus = 'LIVE' | 'IN DEVELOPMENT' | 'COMING SOON'

export type ProductDevice = 'browser' | 'phone' | 'ipad' | 'terminal'

export interface ProductStat {
  label: string
  value: string
}

export interface ProductGalleryItem {
  src: string
  device: ProductDevice
  label: string
  sub: string
}

export interface ProductArchitectureStep {
  step: string
  title: string
  body: string
}

export interface ProductDetail {
  accentColor: string
  tagline: string
  stats: ProductStat[]
  gallery: ProductGalleryItem[]
  architecture: ProductArchitectureStep[]
  highlights: string[]
}

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
  images: string[]
  cardHero: string | 'branded'
  detail: ProductDetail
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
    tags: ['Rust', 'Swift', 'DXGI', 'VideoToolbox', 'Metal', 'UDP', 'mDNS', 'H.264'],
    url: 'https://eternalmonitor.dev',
    github: 'https://github.com/whoisaldo/EternalMonitor',
    version: 'v0.1.1-mirror',
    accentColor: '#A855F7',
    highlight: 'Hardware H.264 encode · Metal render · mDNS zero-config',
    images: [
      '/assets/EternalMonitor/EternalMonitorIpadView.png',
      '/assets/EternalMonitor/EternalMonitorPCView.png',
    ],
    cardHero: 'branded',
    detail: {
      accentColor: '#A855F7',
      tagline:
        'iPad as a low-latency Windows display receiver. No dongle. No driver. No subscription.',
      stats: [
        { label: 'Encode Stack', value: 'H.264' },
        { label: 'Renderer', value: 'Metal' },
        { label: 'Discovery', value: 'mDNS' },
        { label: 'Language', value: 'Rust + Swift' },
      ],
      gallery: [
        {
          src: '/assets/EternalMonitor/EternalMonitorIpadView.png',
          device: 'ipad',
          label: 'iPad Client',
          sub: 'Metal GPU Renderer',
        },
        {
          src: '/assets/EternalMonitor/EternalMonitorPCView.png',
          device: 'browser',
          label: 'Windows Host',
          sub: 'DXGI Capture + H.264 Encode',
        },
      ],
      architecture: [
        {
          step: '01',
          title: 'DXGI Desktop Duplication',
          body: 'The Windows host uses the DXGI Desktop Duplication API to capture the full display framebuffer at up to 60fps with near-zero CPU cost, leveraging the GPU directly.',
        },
        {
          step: '02',
          title: 'Hardware H.264 Encoding',
          body: 'Captured BGRA frames are converted to YUV420P then hardware-encoded. The encoder is auto-selected: NVENC for NVIDIA, AMF for AMD, QuickSync for Intel. No software fallback.',
        },
        {
          step: '03',
          title: 'Fragmented UDP Streaming',
          body: 'Encoded NAL units are fragmented and streamed over UDP with sequence numbers and reassembly buffers on the receiving end. Zero TCP handshake overhead.',
        },
        {
          step: '04',
          title: 'mDNS Zero-Config Discovery',
          body: 'The iPad client discovers the Windows host on the local network via mDNS/DNS-SD, so there is no IP address entry and no config files. Open the app and connect.',
        },
        {
          step: '05',
          title: 'VideoToolbox + Metal Render',
          body: 'The iPad decodes H.264 frames via Apple VideoToolbox for hardware-accelerated decoding, then renders each frame with Metal, bypassing UIKit for maximum throughput.',
        },
      ],
      highlights: [
        'Written in Rust (host) and Swift (iPad client) for memory safety and zero-cost abstractions',
        'Per-vendor hardware encoder auto-detection with no manual configuration required',
        'Fragmented UDP with custom reassembly that handles packet reordering and loss gracefully',
        'Metal rendering pipeline bypasses UIKit for the lowest possible display latency',
      ],
    },
  },
  {
    id: 'eternal-rich-presence',
    name: 'EternalRichPresence',
    tagline:
      'Discord Rich Presence for Apple Music & Spotify. Live cover art. Zero friction.',
    description:
      'Bridges Windows SMTC to Discord Rich Presence. Live cover art upload, Listen Along deep-link via custom eternalrp:// URI scheme, system tray host, portable .exe via PyInstaller. Provider priority: Apple Music → Spotify fallback.',
    status: 'LIVE',
    tags: ['Python', 'pywin32', 'pypresence', 'COM/SMTC', 'PyInstaller'],
    url: null,
    github: 'https://github.com/whoisaldo/Eternal-Rich-Presence',
    version: 'v1.0.0-beta',
    accentColor: '#6366F1',
    highlight: 'SMTC bridge · custom URI scheme · portable .exe',
    images: [
      '/assets/EternalRichPresence/EternalRichPresenceDiscordProfileView.png',
      '/assets/EternalRichPresence/EternalRichPresenceTerminal.png',
    ],
    cardHero: '/assets/EternalRichPresence/EternalRichPresenceDiscordProfileView.png',
    detail: {
      accentColor: '#6366F1',
      tagline:
        'Discord Rich Presence for Apple Music & Spotify on Windows. Live cover art. Portable .exe.',
      stats: [
        { label: 'Platform', value: 'Windows' },
        { label: 'Bridge', value: 'SMTC → RPC' },
        { label: 'Ships as', value: '.exe' },
        { label: 'Language', value: 'Python' },
      ],
      gallery: [
        {
          src: '/assets/EternalRichPresence/EternalRichPresenceDiscordProfileView.png',
          device: 'browser',
          label: 'Discord Profile',
          sub: 'Live Rich Presence Active',
        },
        {
          src: '/assets/EternalRichPresence/EternalRichPresenceTerminal.png',
          device: 'terminal',
          label: 'Host Process',
          sub: 'SMTC → RPC Bridge Running',
        },
      ],
      architecture: [
        {
          step: '01',
          title: 'Windows SMTC Polling',
          body: 'The daemon reads the Windows System Media Transport Controls via the Windows Runtime COM interface, capturing title, artist, album, and playback state.',
        },
        {
          step: '02',
          title: 'Provider Priority Logic',
          body: 'Apple Music takes priority over Spotify. The system detects which app is actively playing and routes to the correct provider, falling back gracefully on switches.',
        },
        {
          step: '03',
          title: 'Cover Art Upload',
          body: "Album artwork is fetched from the media session, uploaded to Discord's CDN via the Rich Presence asset API, and embedded in the presence payload as a live image.",
        },
        {
          step: '04',
          title: 'Discord RPC Bridge',
          body: 'pypresence handles the Discord IPC socket connection. The presence payload is updated on every track change with title, artist, album art, and elapsed time.',
        },
        {
          step: '05',
          title: 'Listen Along URI Scheme',
          body: 'A custom eternalrp:// URI scheme is registered on install, enabling clickable Listen Along deep-links that route friends directly to the currently playing track.',
        },
      ],
      highlights: [
        'Portable single .exe via PyInstaller with no Python install required on the target machine',
        'Live album artwork upload to Discord CDN on every track change',
        'Custom URI scheme registration for Listen Along deep-links',
        'System tray host that runs silently in the background with zero window chrome',
      ],
    },
  },
  {
    id: 'exerly',
    name: 'Exerly Fitness',
    tagline:
      'Cross-platform fitness companion built for people serious about their training.',
    description:
      'Barcode scanning via FatSecret API, 12-step onboarding wizard computing BMI/TDEE/macro targets, AI coaching via Gemini 2.0 Flash. Monorepo with shared Express API serving both web and iOS. SwiftUI + HealthKit on mobile.',
    status: 'IN DEVELOPMENT',
    tags: ['SwiftUI', 'HealthKit', 'React', 'TypeScript', 'Node.js', 'MongoDB', 'Gemini AI'],
    url: 'https://whoisaldo.github.io/Exerly-Fitness/',
    github: 'https://github.com/whoisaldo/Exerly-Fitness',
    version: null,
    accentColor: '#D946EF',
    highlight: 'SwiftUI + HealthKit · Gemini 2.0 Flash AI · shared monorepo API',
    images: [
      '/assets/ExerlyFitness/ExerlyFitnessPhoneView1.png',
      '/assets/ExerlyFitness/ExerlyWebViewDashboard.png',
    ],
    cardHero: 'branded',
    detail: {
      accentColor: '#D946EF',
      tagline:
        'Cross-platform fitness companion. AI coaching, barcode scanning, HealthKit sync. Built for serious training.',
      stats: [
        { label: 'AI Model', value: 'Gemini 2.0' },
        { label: 'Mobile', value: 'SwiftUI' },
        { label: 'Health', value: 'HealthKit' },
        { label: 'API', value: 'Monorepo' },
      ],
      gallery: [
        {
          src: '/assets/ExerlyFitness/ExerlyWebViewLandingPage.png',
          device: 'browser',
          label: 'Landing Page',
          sub: 'Web Client',
        },
        {
          src: '/assets/ExerlyFitness/ExerlyFitnessPhoneView1.png',
          device: 'phone',
          label: 'iOS - Splash',
          sub: 'SwiftUI Onboarding',
        },
        {
          src: '/assets/ExerlyFitness/ExerlyWebViewDashboard.png',
          device: 'browser',
          label: 'Dashboard',
          sub: 'Progress Overview',
        },
        {
          src: '/assets/ExerlyFitness/ExerlyFitnessPhoneView2.png',
          device: 'phone',
          label: 'iOS - Tracking',
          sub: 'Daily Log View',
        },
        {
          src: '/assets/ExerlyFitness/ExerlyWebViewAICoach.png',
          device: 'browser',
          label: 'AI Coach',
          sub: 'Gemini 2.0 Flash',
        },
        {
          src: '/assets/ExerlyFitness/ExerlyFitnessPhoneView3.png',
          device: 'phone',
          label: 'iOS - Progress',
          sub: 'Training Stats',
        },
        {
          src: '/assets/ExerlyFitness/ExerlyWebViewFoodTracker.png',
          device: 'browser',
          label: 'Food Tracker',
          sub: 'Barcode + Manual Entry',
        },
        {
          src: '/assets/ExerlyFitness/ExerlyWebViewSignup-Login.png',
          device: 'browser',
          label: 'Auth Flow',
          sub: 'Signup & Login',
        },
        {
          src: '/assets/ExerlyFitness/ExerlyWebViewProfileView.png',
          device: 'browser',
          label: 'Profile',
          sub: 'Macro Targets + Stats',
        },
      ],
      architecture: [
        {
          step: '01',
          title: '12-Step Onboarding Wizard',
          body: 'A guided onboarding flow collects height, weight, age, activity level, and goals. BMI, TDEE, and macro targets are computed client-side and stored to the user profile.',
        },
        {
          step: '02',
          title: 'Barcode Scanning via FatSecret',
          body: 'The iOS client uses the camera to scan barcodes. Product data is resolved via the FatSecret API, pre-populating nutrition info for one-tap food logging. The web client supports manual entry.',
        },
        {
          step: '03',
          title: 'Gemini 2.0 Flash AI Coaching',
          body: 'The AI coach sends context-aware prompts to Gemini 2.0 Flash, including recent workouts, current macros, and goals. Responses are streamed in real time and saved to coaching history.',
        },
        {
          step: '04',
          title: 'SwiftUI + HealthKit on iOS',
          body: 'The native iOS client syncs steps, active calories, and workout data from HealthKit. Progress photo compare mode stores photos locally with date metadata for visual tracking.',
        },
        {
          step: '05',
          title: 'Shared Monorepo API',
          body: 'A single Express + Node.js API serves both the web client and iOS app. MongoDB stores user data, logs, and coach history. It is hosted on DigitalOcean with environment parity between dev and prod.',
        },
      ],
      highlights: [
        'Single Express API shared between web and iOS with zero code duplication',
        'Gemini 2.0 Flash streams coaching responses in real time with full user context',
        'SwiftUI progress photo compare mode for side-by-side visual progress tracking',
        'Barcode scanner auto-resolves nutrition data with no manual entry required',
      ],
    },
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
    images: [
      '/assets/SignatureCuts/SignatureCutsWebView.png',
      '/assets/SignatureCuts/SignatureCutsPhoneView.png',
    ],
    cardHero: '/assets/SignatureCuts/SignatureCutsWebView.png',
    detail: {
      accentColor: '#C084FC',
      tagline:
        'Modern barbershop booking for Signature Cuts in Chicopee, MA. Two taps to book. Zero backend.',
      stats: [
        { label: 'Framework', value: 'Next.js' },
        { label: 'Booking', value: 'SMS + WA' },
        { label: 'Backend', value: 'None' },
        { label: 'Hosting', value: 'Static' },
      ],
      gallery: [
        {
          src: '/assets/SignatureCuts/SignatureCutsWebView.png',
          device: 'browser',
          label: 'Web View',
          sub: 'Full Site',
        },
        {
          src: '/assets/SignatureCuts/SignatureCutsPhoneView.png',
          device: 'phone',
          label: 'Mobile View',
          sub: 'Primary Use Case',
        },
      ],
      architecture: [
        {
          step: '01',
          title: 'Static Next.js Export',
          body: 'The site is built as a fully static Next.js export with no server, no API routes, and no database. Every page is pre-rendered HTML and deployed to a custom Namecheap domain.',
        },
        {
          step: '02',
          title: 'SMS Deep-Link Encoding',
          body: 'The booking button generates an sms:// URI with a pre-encoded message body covering customer name, service selection, and preferred time. Tapping opens the native SMS app ready to send.',
        },
        {
          step: '03',
          title: 'WhatsApp Booking Flow',
          body: 'A parallel WhatsApp deep-link using the wa.me API provides an alternative booking path. Both flows encode the barbershop phone number and pre-filled message with proper URI encoding.',
        },
        {
          step: '04',
          title: 'Mobile-First Design',
          body: 'Every layout decision prioritized the mobile viewport. Touch targets, font sizes, and scroll behavior were designed for a customer standing outside the shop deciding whether to walk in.',
        },
      ],
      highlights: [
        'Zero backend with no server costs, maintenance, or downtime risk',
        'SMS and WhatsApp booking flows that cover both customer segments in Chicopee',
        'Fully static export for instant load on any connection',
        'Built free of charge for a local business',
      ],
    },
  },
]

export function getProductById(id: string) {
  return products.find((product) => product.id === id)
}
