/*
 * Engineer profiles. Every fact here comes from the person's own portfolio,
 * resume, GitHub profile or repositories. The source for each one is recorded
 * in the people dossier (sideband-revamp-run/research/people.md). GitHub stats
 * (followers, stars, contributions, languages) are not stored here. They come
 * from the synced GitHub snapshot, keyed by `githubLogin`.
 */

/** One continuous period in a role. */
export interface ExperienceStint {
  startDate: string
  endDate?: string
  /** What the period was, when the role changed terms ("Co-op", "Part-time"). */
  note?: string
}

export interface ExperienceEntry {
  company: string
  /**
   * The organisation the role belongs to when it is published under another
   * name (Amazon Web Services is part of Amazon). Roles group by it.
   */
  org?: string
  /** The company's own site or GitHub org. */
  companyUrl?: string
  /** Optional company mark. Falls back to a monogram when absent. */
  logo?: string
  /** Mark is already drawn for dark UI — render it as-is, don't recolor. */
  logoOnDark?: boolean
  role: string
  /** Omitted when the person has not published one. */
  location?: string
  startDate: string
  /** Omitted for an incoming role that has only a start date. */
  endDate?: string
  /**
   * The separate periods of a role the person left and came back to, newest
   * first. startDate and endDate then span all of them.
   */
  stints?: ExperienceStint[]
  current?: boolean
  upcoming?: boolean
  emphasis?: boolean
  summary: string
  highlights?: string[]
  skills?: string[]
}

export interface EducationEntry {
  school: string
  logo?: string
  logoOnDark?: boolean
  degree: string
  dates: string
  honors?: string
  coursework?: string[]
  activities?: string[]
}

export interface SkillGroup {
  category: string
  items: string[]
}

export interface FeaturedProject {
  name: string
  blurb: string
  /**
   * Where the card links: the product page for Sideband products, otherwise
   * the live site, store listing or source. Absent when nothing public is
   * reachable (private repo, login-walled deployment).
   */
  href?: string
  internal?: boolean
  /** Links to source rather than a live deployment. */
  source?: boolean
  /** Source repository, when public. */
  repo?: string
  /** Set when the project is a Sideband product (id in lib/products.ts). */
  productId?: string
  /** The person's part, when the project is a team effort. */
  role?: string
  /** Featured on the person's own portfolio. The rest is their other work. */
  featured?: boolean
  /** The person's own venture, run outside Sideband. Shown apart from their other work. */
  venture?: boolean
  tech?: string[]
}

export interface LifestyleImage {
  src: string
  alt: string
  caption?: string
}

export interface PrevBadgeEntry {
  label: string
  sublabel?: string
}

export interface EngineerContact {
  /** Public email the person publishes. */
  email: string
  github?: string
  linkedin?: string
  website?: string
  x?: string
  tiktok?: string
  instagram?: string
  resume?: string
  location?: string
}

export interface PortfolioCapture {
  src: string
  width: number
  height: number
}

/** One page of a personal site, captured at 1440x900 and 390x844 (2x). */
export interface PortfolioPage {
  label: string
  url: string
  desktop: PortfolioCapture
  mobile: PortfolioCapture
}

export interface EngineerPortfolio {
  url: string
  /** How the site looks and what it holds, in a sentence or two. */
  summary: string
  pages: PortfolioPage[]
}

export interface Engineer {
  id: string
  name: string
  initials: string
  /** Role at Sideband. */
  role: string
  /** GitHub login, the key into the synced GitHub snapshot. */
  githubLogin: string
  /** One-line summary. */
  shortBio: string
  longBio: string[]
  portrait?: {
    src: string
    width: number
    height: number
  }
  /** Published availability, in the person's words. */
  availability?: string
  spokenLanguages?: string[]
  interests?: string[]
  prev?: PrevBadgeEntry[]
  experience?: ExperienceEntry[]
  education?: EducationEntry[]
  skills?: SkillGroup[]
  projects?: FeaturedProject[]
  portfolio?: EngineerPortfolio
  lifestyle?: LifestyleImage[]
  contact: EngineerContact
  accentColor: string
}

const DESKTOP = { width: 2880, height: 1800 }
const MOBILE = { width: 780, height: 1688 }

function capture(id: string, name: string) {
  return {
    desktop: {
      src: `/assets/engineers/${id}/${name}-desktop.webp`,
      ...DESKTOP,
    },
    mobile: { src: `/assets/engineers/${id}/${name}-mobile.webp`, ...MOBILE },
  }
}

export const engineers: Engineer[] = [
  {
    id: 'ali-younes',
    name: 'Ali Younes',
    initials: 'AY',
    role: 'Founding Engineer',
    githubLogin: 'whoisaldo',
    shortBio:
      'Software engineer on systems, infrastructure, AI tooling and backend. Wrote the Rust host and Swift client behind EternalMonitor.',
    longBio: [
      'Ali, or Aldo, is a fourth-year Computer Science and Political Science student at Northeastern University in Boston. He likes deeply architected systems, and most of his work is automating something tedious. His favorite areas are systems, infrastructure, AI tooling and backend.',
      'He spent Jan to Jun 2026 as an SDE co-op at Philips, where he pitched and shipped a zero-touch PXE deployment platform for a ~1,000-machine fleet with Secure Boot left on, and he is back there part-time. From Jun to Sep 2026 he interned on AWS CloudFormation in Seattle and shipped org-wide policy-based sharing of private resource types on the CloudFormation Registry. He returns to Amazon in July 2027 as an SDE on Amazon Dedicated Cloud.',
      'He also leads Virtual Link at Pinnatec Auto and owns the grading server of Pawtograder, Northeastern’s open-source autograder. At Sideband he wrote the Rust host and Swift client behind EternalMonitor and the SwiftUI app and Node API behind Exerly Fitness. He started the studio because he wants somewhere younger engineers can get mentoring for free.',
      'Off the clock he works on his cars: a 2013 Audi S4 making around 540 whp on a Jackal Stage 2+ tune, a 2013 Audi S6 that runs Virtual Link, and a 2013 BMW 328xi that got a CarPlay retrofit and a custom tune.',
    ],
    portrait: {
      src: '/assets/engineers/ali-younes/portrait.jpg',
      width: 1200,
      height: 1500,
    },
    spokenLanguages: ['English', 'Arabic'],
    interests: ['Cars', 'Fitness'],
    accentColor: '#FCEE0A',
    prev: [
      { label: 'AMAZON', sublabel: 'INCOMING SDE · ADC · JUL 2027' },
      { label: 'PHILIPS', sublabel: 'SDE CO-OP · PART-TIME · CURRENT' },
      { label: 'PINNATEC AUTO', sublabel: 'LEAD FULL STACK · CURRENT' },
      { label: 'AWS', sublabel: 'CLOUDFORMATION · SDE INTERN · 2026' },
    ],
    experience: [
      {
        company: 'Amazon',
        org: 'Amazon',
        companyUrl: 'https://github.com/aws',
        logo: '/assets/logos/aws.png',
        role: 'Software Development Engineer · Amazon Dedicated Cloud',
        startDate: 'Jul 2027',
        upcoming: true,
        emphasis: true,
        summary:
          'Returning to Amazon full-time as a Software Development Engineer on Amazon Dedicated Cloud (ADC), starting July 2027.',
      },
      {
        company: 'Pinnatec Auto',
        companyUrl: 'https://pinnatecauto.com/',
        logo: '/assets/logos/pinnatec-auto.svg',
        role: 'Lead Full Stack Engineer (Part-time)',
        location: 'Worcester, MA',
        startDate: 'Sep 2026',
        endDate: 'Present',
        current: true,
        emphasis: true,
        summary:
          'Lead maintainer and code owner of Virtual Link, Pinnatec’s app-controlled lowering module: an Expo/React Native app, a WordPress/PHP backend and ESP32 firmware.',
        highlights: [
          'Owns Virtual Link, serving 1,000+ users, as lead maintainer on a 3-person team: 41 pull requests merged across the React Native app, the PHP backend and the ESP32 firmware',
          'Stood up CI from zero for both repositories. GitHub Actions verify 7 firmware-to-app contracts, typecheck, lint and test the app on every PR, and build and size-check both firmware images',
          'Branch rulesets require every check, so a pull request merges only when all of them pass',
        ],
        skills: [
          'TypeScript',
          'React Native (Expo)',
          'PHP',
          'WordPress',
          'C++',
          'ESP32',
          'GitHub Actions',
        ],
      },
      {
        company: 'Pawtograder',
        companyUrl: 'https://github.com/pawtograder',
        logo: '/assets/logos/pawtograder.png',
        logoOnDark: true,
        role: 'Backend Engineer · Grading Server',
        location: 'Boston, MA',
        startDate: 'Aug 2026',
        endDate: 'Present',
        current: true,
        summary:
          'Owns the grading server of Northeastern’s open-source autograder, in production for the university’s CS courses, with two other students on a team of eleven.',
        highlights: [
          'The scoring algorithm, the project’s most complex part, turns build, lint, test and pitest mutation results into grades',
          'Every submission runs through a TypeScript GitHub Action in the student’s own repository, and the results come back to Deno edge functions on Supabase',
          'Edge functions are authenticated per submission with a GitHub OIDC token, with gradebook recalculation in Postgres and PL/pgSQL',
        ],
        skills: [
          'TypeScript',
          'Deno',
          'Supabase',
          'Postgres',
          'PL/pgSQL',
          'GitHub Actions',
          'pitest',
        ],
      },
      {
        company: 'Amazon Web Services',
        org: 'Amazon',
        companyUrl: 'https://github.com/aws',
        logo: '/assets/logos/aws.png',
        role: 'SDE Intern · AWS CloudFormation',
        location: 'Seattle, WA',
        startDate: 'Jun 2026',
        endDate: 'Sep 2026',
        emphasis: true,
        summary:
          'Owned the team’s highest-priority feature end to end on the CloudFormation Registry, a tier-1 AWS control plane: org-wide policy-based sharing of private resource types, retiring a re-registration pattern that had cloned a single type into 8,000+ accounts across 8 regions.',
        highlights: [
          'Shipped the feature in production Java across 12 merged code reviews: 2 new APIs, a DynamoDB table and DAO, and an IAM-style policy evaluator with deny-by-default semantics',
          'Cut hot-path DynamoDB cost on ~90% of DescribeType traffic by reordering type resolution so a strongly consistent, uncached read fires only on true misses. Redesigned pagination to bound work, not results',
          'Built a native Kiro tool for dual-model AI code review (GPT + Claude), used across AWS CloudFormation by 100+ people and featured on Kiro’s official LinkedIn',
          'Built a Slack bot whose LLM agent on AWS Bedrock took 15+ handoff tickets per on-call cycle through final review and staging, and ended a 2-day beta pipeline stall with a same-day fix',
        ],
        skills: [
          'Java',
          'AWS CloudFormation',
          'DynamoDB',
          'IAM',
          'AWS Bedrock',
          'Kiro',
        ],
      },
      {
        company: 'Philips',
        logo: '/assets/logos/philips.png',
        role: 'SDE Co-op · System Integration',
        location: 'Cambridge, MA',
        startDate: 'Jan 2026',
        endDate: 'Present',
        stints: [
          { startDate: 'Aug 2026', endDate: 'Present', note: 'Part-time' },
          { startDate: 'Jan 2026', endDate: 'Jun 2026', note: 'Co-op' },
        ],
        current: true,
        emphasis: true,
        summary:
          'Pitched, architected and shipped a zero-touch PXE deployment platform for a ~1,000-machine fleet in Philips’ FDA-regulated Patient Monitoring business, which monitors 600M+ patients a year.',
        highlights: [
          'In production since Apr 2026 and used by 50+ engineers to test high-priority builds. Designed and shipped solo, and presented to 50+ engineers and stakeholders',
          'Stood up the FOG/TFTP server on Ubuntu 24.04 (dnsmasq proxyDHCP, tftpd-hpa) and built a PowerShell WinPE orchestrator with a FastAPI service for MAC-keyed host config, secrets and live deployment status',
          'Kept UEFI Secure Boot enforced with zero per-machine keypresses by PXE-booting Microsoft-signed bootmgfw.efi, with a .NET shim that left the vendor installer unmodified',
          'Wrote the Windows guest post-provisioning layer and a JSON-driven environment-validation pipeline on an internal VM deployment platform',
        ],
        skills: [
          'PowerShell',
          'Python',
          'FastAPI',
          'C#/.NET',
          'Ubuntu',
          'PXE/TFTP',
          'UEFI Secure Boot',
          'WinPE',
          'Nutanix',
          'VMware',
        ],
      },
      {
        company: 'Sideband',
        companyUrl: 'https://sideband.studio',
        logo: '/assets/logos/sideband.png',
        logoOnDark: true,
        role: 'Founding Engineer',
        location: 'Boston, MA',
        startDate: '2025',
        endDate: 'Present',
        current: true,
        emphasis: true,
        summary:
          'Founding engineer of the studio, which began in Boston in 2025 as Eternal Reverse. It started as two people and is five founding engineers now, shipping its own products instead of client work.',
        highlights: [
          'Wrote the Rust host and SwiftUI iPad client behind EternalMonitor',
          'Built the SwiftUI iOS app and Node API behind Exerly Fitness',
          'Built EternalRichPresence and Signature Cuts 413, and most of the studio site',
        ],
        skills: [
          'Rust',
          'Swift',
          'SwiftUI',
          'TypeScript',
          'Next.js',
          'Node.js',
        ],
      },
      {
        company: 'Top Choice Realty',
        companyUrl: 'https://topchoicerealtyny.com/',
        logo: '/assets/logos/top-choice-realty.png',
        logoOnDark: true,
        role: 'Frontend Developer Intern',
        location: 'New York, NY',
        startDate: 'Apr 2024',
        endDate: 'Aug 2024',
        summary:
          'Built and launched a full-stack client-management web app (React, Python, SQL) for the office’s 20+ staff and 800+ client records.',
        highlights: [
          'Cut client lookup time 85%, from 5+ minutes to 45 seconds',
          'Cut IT support tickets 90% with self-serve access to the records',
          'Reworked the queries and added caching for 3x faster data retrieval, giving the team back 15+ hours a week of admin',
        ],
        skills: ['React', 'Python', 'SQL'],
      },
      {
        company: 'Robert DeFalco Realty',
        logo: '/assets/logos/robert-defalco-realty.png',
        logoOnDark: true,
        role: 'Computer Technician Intern',
        location: 'New York, NY',
        startDate: 'Jun 2023',
        endDate: 'Sep 2023',
        summary: 'On-site IT support across three offices.',
        highlights: [
          'Configured 15+ machines on Windows, macOS and Linux',
          'Resolved 25+ issues across operating systems and hardware',
          'Kept 95%+ uptime across every site',
        ],
      },
    ],
    education: [
      {
        school: 'Northeastern University',
        logo: '/assets/logos/northeastern-university.png',
        logoOnDark: true,
        degree: 'B.S. Computer Science & Political Science',
        dates: '2023 – May 2027 (expected)',
        honors: 'Combined major · Co-op program · GPA 3.5+',
        coursework: [
          'Data Structures & Algorithms',
          'Object-Oriented Design',
          'Systems Programming',
          'Database Management',
          'Computer Networks',
        ],
      },
    ],
    skills: [
      {
        category: 'Languages',
        items: [
          'TypeScript',
          'JavaScript',
          'Python',
          'SQL',
          'Java',
          'C++',
          'C#',
          'Rust',
          'Swift',
          'PowerShell',
          'Bash',
          'Go',
        ],
      },
      {
        category: 'Frontend',
        items: [
          'React',
          'React Native (Expo)',
          'Next.js',
          'Tailwind CSS',
          'Framer Motion',
        ],
      },
      {
        category: 'Backend',
        items: [
          'Node.js',
          'Express',
          'FastAPI',
          'Postgres',
          'MongoDB',
          'Deno',
          'Supabase',
          'PHP',
          '.NET',
        ],
      },
      {
        category: 'Systems',
        items: [
          'Rust',
          'C++',
          'ESP32',
          'DXGI',
          'Metal',
          'VideoToolbox',
          'H.264',
        ],
      },
      {
        category: 'Cloud & Infra',
        items: [
          'AWS (CloudFormation, DynamoDB, IAM)',
          'Linux',
          'Docker',
          'GitHub Actions',
          'CI/CD',
        ],
      },
      {
        category: 'AI',
        items: ['OpenAI SDK', 'Claude SDK', 'MCP', 'Ollama', 'AWS Bedrock'],
      },
      {
        category: 'Agents',
        items: [
          'Kiro',
          'Codex',
          'Claude Code',
          'OpenCode',
          'Windsurf',
          'T3 Code',
          'Cursor Bugbot',
          'CodeRabbit',
        ],
      },
      {
        category: 'Tools',
        items: ['Git', 'Vim', 'VS Code', 'Xcode'],
      },
    ],
    projects: [
      {
        name: 'EternalMonitor',
        featured: true,
        blurb:
          'Turns an iPad into a second display for Windows, mirrored or extended, over Wi-Fi or USB. Ali wrote the Rust host and the SwiftUI iPad client, with hardware H.264 encode and decode end to end.',
        href: '/products/eternal-monitor',
        internal: true,
        productId: 'eternal-monitor',
        repo: 'https://github.com/sidebandstudio/EternalMonitor',
        role: 'Lead engineer',
        tech: [
          'Rust',
          'Swift',
          'DXGI',
          'FFmpeg',
          'H.264',
          'HEVC',
          'VideoToolbox',
          'Metal',
          'Opus',
        ],
      },
      {
        name: 'Exerly Fitness',
        featured: true,
        blurb:
          'Fitness app with a React 19 web app, a Node and Express API, an AI coach, and a native SwiftUI iOS client that is built and waiting on App Store review.',
        href: '/products/exerly',
        internal: true,
        productId: 'exerly',
        repo: 'https://github.com/sidebandstudio/Exerly-Fitness',
        role: 'Lead engineer',
        tech: [
          'SwiftUI',
          'HealthKit',
          'React 19',
          'Vite',
          'TypeScript',
          'Node.js',
          'Express',
          'PostgreSQL',
          'Gemini',
        ],
      },
      {
        name: 'EternalRichPresence',
        featured: true,
        blurb:
          'Windows tray app that puts Apple Music and Spotify on your Discord profile, with live cover art and a Listen Along feature built on raw named pipes.',
        href: '/products/eternal-rich-presence',
        internal: true,
        productId: 'eternal-rich-presence',
        repo: 'https://github.com/sidebandstudio/Eternal-Rich-Presence',
        tech: [
          'Python',
          'pypresence',
          'spotipy',
          'WinRT',
          'pywin32',
          'pystray',
          'PyInstaller',
        ],
      },
      {
        name: 'Signature Cuts 413',
        featured: true,
        blurb:
          'Marketing and booking site for a barbershop in Chicopee, MA. Next.js 14 static export with a WhatsApp booking flow, built free of charge.',
        href: '/products/signature-cuts',
        internal: true,
        productId: 'signature-cuts',
        repo: 'https://github.com/whoisaldo/SignatureCuts',
        tech: ['Next.js 14', 'TypeScript', 'Tailwind CSS', 'Framer Motion'],
      },
      {
        name: 'Fade Empire',
        blurb:
          'Booking site for a two-chair barbershop in Chicopee, MA, where Postgres functions reserve each slot and refuse double bookings. Its iPhone app for the barbers is in testing on TestFlight.',
        href: '/products/fade-empire',
        internal: true,
        productId: 'fade-empire',
        tech: ['JavaScript', 'Supabase', 'PostgreSQL', 'Deno', 'SwiftUI'],
      },
      {
        name: 'EternalExchange',
        featured: true,
        blurb:
          'A 39K-line Minecraft alchemy mod for Fabric 1.21.1. A spin-off of ProjectE with a recipe-graph solver that prices every item in the game at world load.',
        href: '/products/eternal-exchange',
        internal: true,
        productId: 'eternal-exchange',
        repo: 'https://github.com/sidebandstudio/EternalExchange',
        tech: [
          'Java 21',
          'Minecraft 1.21.1',
          'Fabric',
          'Mixin',
          'Gradle Loom',
          'night-config',
          'Commons Math',
        ],
      },
      {
        name: 'hushtype',
        blurb:
          'Menu bar dictation app for the Mac, built on the open-source Handy. Hold Option-Space, speak and release, and the text is pasted at the cursor in whatever app is in front. Speech recognition runs on the Mac.',
        href: '/products/hushtype',
        internal: true,
        productId: 'hushtype',
        repo: 'https://github.com/sidebandstudio/hushtype',
        tech: [
          'Rust',
          'Tauri 2',
          'React 19',
          'TypeScript',
          'ONNX Runtime',
          'Parakeet V3',
          'Ollama',
        ],
      },
      {
        name: 'Moops Bookstore',
        featured: true,
        blurb:
          'Social reading tracker with shelves, reviews, clubs and a streak counter, on a MongoDB backend with the Google Books catalogue behind search.',
        href: 'https://moopsbooks.com',
        tech: [
          'React',
          'TypeScript',
          'Node.js',
          'Express',
          'MongoDB',
          'Google Books API',
        ],
      },
      {
        name: 'Real-Time Face Analytics',
        featured: true,
        blurb:
          'Face, emotion, age and gender detection that runs entirely in the browser with TensorFlow.js. No frames leave the device.',
        href: 'https://whoisaldo.github.io/real-time-face-analytics/',
        repo: 'https://github.com/whoisaldo/real-time-face-analytics',
        tech: [
          'React',
          'TypeScript',
          'face-api.js',
          'Redux Toolkit',
          'Tailwind CSS',
          'Vite',
        ],
      },
      {
        name: 'BetterAppleMusic',
        blurb:
          'Windows desktop Apple Music client built on Electron and MusicKit JS, a companion experiment to EternalRichPresence.',
        href: 'https://github.com/whoisaldo/BetterAppleMusic',
        source: true,
        repo: 'https://github.com/whoisaldo/BetterAppleMusic',
        tech: [
          'TypeScript',
          'Electron',
          'React',
          'MusicKit JS',
          'Tailwind CSS',
          'Webpack',
        ],
      },
      {
        name: 'Top Choice Realty',
        blurb:
          'Listings site and agent back office for a New York brokerage. Visitors browse listings and message the listing agent, and agents manage listings, sales and customers.',
        href: '/products/top-choice-realty',
        internal: true,
        productId: 'top-choice-realty',
        repo: 'https://github.com/sidebandstudio/topchoicerealty',
        tech: [
          'TypeScript',
          'React',
          'Vite',
          'Tailwind CSS',
          'TanStack Query',
          'Vercel Functions',
          'Supabase Postgres',
        ],
      },
      {
        name: 'CS3520 · C++',
        blurb:
          'Course work in C++: nested containers, Makefiles, GDB and CLI formatting.',
        href: 'https://github.com/whoisaldo/CS3520-Summer-2025',
        source: true,
        repo: 'https://github.com/whoisaldo/CS3520-Summer-2025',
        tech: ['C++', 'Makefile'],
      },
      {
        name: 'Password Generator',
        blurb:
          'Configurable password generator with a Swing desktop UI and export.',
        href: 'https://github.com/whoisaldo/Password-Generator',
        source: true,
        repo: 'https://github.com/whoisaldo/Password-Generator',
        tech: ['Java', 'Swing'],
      },
      {
        name: 'Grade Calculator',
        blurb: 'Weighted grade calculator with a simple desktop UI.',
        href: 'https://github.com/whoisaldo/Grade-Calculator',
        source: true,
        repo: 'https://github.com/whoisaldo/Grade-Calculator',
        tech: ['Java', 'Swing'],
      },
      {
        name: 'Lua-Roblox-Commands',
        blurb: 'Quick utility commands for Roblox game development.',
        href: 'https://github.com/whoisaldo/Lua-Roblox-Commands',
        source: true,
        repo: 'https://github.com/whoisaldo/Lua-Roblox-Commands',
        tech: ['Lua', 'Roblox'],
      },
    ],
    portfolio: {
      url: 'https://aliyounes.dev',
      summary:
        'A plain dark one-column homepage with writing, an experience timeline and his builds, with photos and stickers in the margins. Behind it sits a cyberpunk playground with a three.js night city, his Audi S4 in 3D and a hidden console.',
      pages: [
        {
          label: 'Home',
          url: 'https://aliyounes.dev/',
          ...capture('ali-younes', 'portfolio'),
        },
      ],
    },
    lifestyle: [
      {
        src: '/assets/engineers/ali-younes/lifestyle/image1.jpg',
        alt: 'Ali Younes working on a laptop at a table by a window',
      },
      {
        src: '/assets/engineers/ali-younes/lifestyle/bmw-tuning.jpg',
        alt: 'The engine bay of a 2013 BMW 328xi with the front end removed to install a cold air intake',
        caption: 'BMW 328XI · COLD AIR INTAKE',
      },
      {
        src: '/assets/engineers/ali-younes/lifestyle/bmw-module.jpg',
        alt: 'A tuning module with its case open, showing a green circuit board next to a flash cable',
        caption: 'BMW 328XI · TUNING MODULE',
      },
      {
        src: '/assets/engineers/ali-younes/lifestyle/carplay-retrofit.jpg',
        alt: 'A car dashboard taken apart to retrofit a CarPlay screen',
        caption: 'CARPLAY RETROFIT',
      },
      {
        src: '/assets/engineers/ali-younes/lifestyle/sumo-bot.jpg',
        alt: 'A sumo robot with a breadboard, microcontroller, ultrasonic sensor and two white plow blades',
        caption: 'SUMO ROBOT · FIRST PLACE',
      },
      {
        src: '/assets/engineers/ali-younes/lifestyle/computer-builds.jpg',
        alt: 'The inside of a personal computer build with a Radeon graphics card',
        caption: 'PC BUILDS',
      },
      {
        src: '/assets/engineers/ali-younes/lifestyle/roblox-dev.jpg',
        alt: 'Roblox Studio with a game level open',
        caption: 'EARLY DAYS · ROBLOX DEV',
      },
      {
        src: '/assets/engineers/ali-younes/lifestyle/wrestling.jpg',
        alt: 'A high school wrestling match on a mat with spectators in the bleachers',
        caption: 'WRESTLING · THIRD IN MASSACHUSETTS',
      },
    ],
    contact: {
      email: 'aldo@sideband.studio',
      github: 'https://github.com/whoisaldo',
      linkedin: 'https://www.linkedin.com/in/alialdoyounes/',
      website: 'https://aliyounes.dev',
      x: 'https://x.com/whoisaldooo',
      resume: '/assets/engineers/ali-younes/resume.pdf',
      location: 'Boston, MA',
    },
  },
  {
    id: 'ali-tleis',
    name: 'Ali Tleis',
    initials: 'AT',
    role: 'Founding Engineer',
    githubLogin: 'Alitleis123',
    shortBio:
      'Web Application Developer at MIT Lincoln Laboratory, where he owns the internal AI search 4,500+ engineers use. Builds Upflow2x at Sideband.',
    longBio: [
      'Ali studies Computer Science and Sociology at Northeastern and lives in Greater Boston. He is on a seven-month co-op at MIT Lincoln Laboratory, where he owns the Laboratory’s internal AI search from the technical proposal to the production release. Its hybrid search and reranking cut query latency 70% and model tokens per request 40%.',
      'Outside work he builds tools for problems he hits himself. He edits anime and shows in After Effects and DaVinci Resolve for 12.7K followers on TikTok, and Upflow2x, first released as Eternal2x, exists because every interpolator he tried smeared the held frames in his edits. On EternalMonitor he owns AMD GPU support, from the AMF encoder to the software fallback.',
      'At Sideband he owns the studio site and product pages and builds the Python and Lua pipeline behind Upflow2x. Away from a screen he lifts. He speaks Arabic and English, and at Northeastern he is in the Video Editing Club and the Arab Student Association.',
    ],
    portrait: {
      src: '/assets/engineers/ali-tleis/portrait.jpg',
      width: 1179,
      height: 1375,
    },
    spokenLanguages: ['Arabic', 'English'],
    interests: ['Weight lifting', 'Video editing'],
    accentColor: '#F2A93B',
    prev: [
      { label: 'MIT LINCOLN LAB', sublabel: 'WEB APP DEV · AI · CURRENT' },
      { label: 'TOP CHOICE REALTY', sublabel: 'FRONTEND INTERN · SUMMER 25' },
      { label: 'NORTHEASTERN', sublabel: 'CS + SOCIOLOGY · CLASS OF 28' },
    ],
    experience: [
      {
        company: 'MIT Lincoln Laboratory',
        companyUrl: 'https://www.ll.mit.edu',
        logo: '/assets/logos/mit-lincoln-laboratory.png',
        role: 'Web Application Developer (AI Integration) Co-op',
        location: 'Lexington, MA',
        startDate: 'Jun 2026',
        endDate: 'Jan 2027',
        current: true,
        emphasis: true,
        summary:
          'Seven-month co-op. Owns the Laboratory’s internal AI search, used by 4,500+ engineers, from the technical proposal to the production release.',
        highlights: [
          'Wrote the technical proposal, then built and shipped the service to production with Java and Spring Boot APIs and Python and FastAPI services',
          'Retrieval combines Solr keyword and vector search, then reranks candidates with Sentence Transformers before the model sees them, cutting query latency 70% and model tokens per request 40%',
          'Integrated internally hosted Llama inference through vLLM with streamed responses, retrieval-grounded prompts and Redis caching for repeated queries',
          'Search results and generated answers keep the source documents’ access controls, with permission-aware retrieval tied to the lab’s identity services',
        ],
        skills: [
          'Java',
          'Spring Boot',
          'Python',
          'FastAPI',
          'Apache Solr',
          'Sentence Transformers',
          'vLLM',
          'Llama',
          'Redis',
          'Kubernetes',
          'Helm',
          'GitLab CI/CD',
        ],
      },
      {
        company: 'Sideband',
        companyUrl: 'https://sideband.studio',
        logo: '/assets/logos/sideband.png',
        logoOnDark: true,
        role: 'Founding Engineer',
        location: 'Boston, MA',
        startDate: 'Jan 2026',
        endDate: 'Present',
        current: true,
        emphasis: true,
        summary:
          'One of five founding engineers at an independent software studio. Builds the studio site and product pages in Next.js and develops products across desktop, browser and web.',
        highlights: [
          'Owns the studio site and product pages, built with the Next.js App Router, strict TypeScript and Tailwind CSS',
          'Builds the Python and Lua pipeline behind Upflow2x, and built Eternal Summary and Better Canvas',
          'Built the engineer roster from structured data, with links between products and the people who build them',
          'Added Playwright checks and a shared copy-style check in CI, and moved the live site and product links through the 2026 rebrand from Eternal Reverse to Sideband',
        ],
        skills: [
          'Next.js',
          'TypeScript',
          'Tailwind CSS',
          'Python',
          'Lua',
          'Playwright',
        ],
      },
      {
        company: 'Top Choice Realty',
        companyUrl: 'https://topchoicerealtyny.com/',
        logo: '/assets/logos/top-choice-realty.png',
        logoOnDark: true,
        role: 'Frontend Developer Intern',
        location: 'Staten Island, NY',
        startDate: 'Jun 2025',
        endDate: 'Sep 2025',
        summary:
          'Frontend internship that also covered the Express APIs, the MongoDB schema and the sync jobs behind them.',
        highlights: [
          'Built the client-intake and agent-dashboard workflows in Next.js from shared React and TypeScript components',
          'Added role-based access and document uploads to the Express APIs, with records in MongoDB Atlas and files in Azure Blob Storage',
          'Automated MongoDB synchronization with Python and C# Azure Functions, cutting manual reconciliation time 30%',
          'Added GitHub Actions workflows for builds, API tests and deployment checks',
        ],
        skills: [
          'Next.js',
          'React',
          'TypeScript',
          'Express',
          'MongoDB Atlas',
          'Azure Functions',
          'Azure Blob Storage',
        ],
      },
      {
        company: 'Robert DeFalco Realty',
        logo: '/assets/logos/robert-defalco-realty.png',
        logoOnDark: true,
        role: 'Computer Technician Intern',
        location: 'Staten Island, NY',
        startDate: 'Jun 2023',
        endDate: 'Sep 2023',
        summary:
          'Workstation provisioning and inventory tooling for an office of 20+ machines.',
        highlights: [
          'Automated provisioning for 20+ workstations with PowerShell, covering software installs, account setup, and Windows and Linux configuration',
          'Wrote a Python inventory utility that flags missing software, outdated systems and configuration differences between machines',
          'Supported Microsoft Intune enrollment and Active Directory account administration',
        ],
        skills: ['PowerShell', 'Python', 'Intune', 'Active Directory'],
      },
    ],
    education: [
      {
        school: 'Northeastern University',
        logo: '/assets/logos/northeastern-university.png',
        logoOnDark: true,
        degree: 'B.S. Computer Science & Sociology',
        dates: '2024 – Aug 2028 (expected) · Boston, MA',
        honors: 'Combined major · Co-op program',
        coursework: [
          'Algorithms & Data Structures',
          'Object-Oriented Design',
          'Artificial Intelligence',
          'Discrete Structures',
          'Programming in C++',
          'Fundamentals of CS 1 & 2',
        ],
        activities: ['Video Editing Club', 'Arab Student Association'],
      },
    ],
    skills: [
      {
        category: 'Languages',
        items: [
          'TypeScript',
          'JavaScript',
          'Python',
          'Java',
          'Rust',
          'C++',
          'C#',
          'Lua',
          'SQL',
        ],
      },
      {
        category: 'Frameworks & Frontend',
        items: [
          'React',
          'Next.js',
          'Spring Boot',
          'FastAPI',
          'Tailwind CSS',
          'Framer Motion',
          'Vite',
          'React Router',
        ],
      },
      {
        category: 'Backend & Tools',
        items: [
          'Node.js / Express',
          'REST APIs',
          'JWT Auth',
          'Git / GitHub',
          'Docker',
          'Kubernetes',
          'Helm',
          'GitLab CI/CD',
          'GitHub Actions',
          'Prometheus',
          'Grafana',
          'Linux',
          'OpenCV',
          'FFmpeg',
          'PowerShell',
          'Azure Functions',
          'Jest',
          'JUnit',
          'Fly.io',
        ],
      },
      {
        category: 'Databases & Search',
        items: [
          'MongoDB',
          'PostgreSQL',
          'MySQL',
          'Redis',
          'Apache Solr',
          'Norconex',
        ],
      },
      {
        category: 'AI & ML',
        items: [
          'LLM Integration',
          'Llama',
          'vLLM',
          'Sentence Transformers',
          'Gemini API',
          'Open-Weight LLMs',
        ],
      },
    ],
    projects: [
      {
        name: 'Upflow2x',
        featured: true,
        blurb:
          'DaVinci Resolve Studio plugin for hand-drawn animation. It finds the real drawings behind duplicated frames, then draws the missing in-betweens with the RIFE network on ONNX Runtime.',
        href: '/products/upflow2x',
        internal: true,
        productId: 'upflow2x',
        repo: 'https://github.com/sidebandstudio/Upflow2x',
        role: 'Creator',
        tech: [
          'Python',
          'Lua',
          'OpenCV',
          'NumPy',
          'ONNX Runtime',
          'RIFE',
          'DaVinci Resolve',
        ],
      },
      {
        name: 'Eternal Summary',
        featured: true,
        blurb:
          'Chrome extension that summarizes the page you are reading, explains what you highlight, and answers follow-ups in a rail beside the article.',
        href: '/products/eternal-summary',
        internal: true,
        productId: 'eternal-summary',
        repo: 'https://github.com/sidebandstudio/Eternal-Summary',
        role: 'Creator',
        tech: [
          'JavaScript',
          'Chrome MV3',
          'Gemini API',
          'Node.js',
          'Express',
          'Vercel',
        ],
      },
      {
        name: 'EternalMonitor',
        featured: true,
        blurb:
          'iPad as a second screen for Windows. Ali owns its AMD GPU support end to end: Rust and FFmpeg AMF H.264 and HEVC encoding, keyframe recovery and the software fallback.',
        href: '/products/eternal-monitor',
        internal: true,
        productId: 'eternal-monitor',
        repo: 'https://github.com/sidebandstudio/EternalMonitor',
        role: 'Contributor · AMD GPU support',
        tech: ['Rust', 'FFmpeg', 'AMF', 'H.264', 'HEVC'],
      },
      {
        // Listed on his portfolio. The product credits Ali Younes alone, so
        // this card claims no part in it and does not link the product page.
        name: 'Exerly Fitness',
        featured: true,
        blurb:
          'A fitness app from the studio. Tracks nutrition, workouts and sleep across native iOS and the web, with adaptive calorie targets and an AI coach.',
        href: 'https://exerlyfitness.com',
        repo: 'https://github.com/sidebandstudio/Exerly-Fitness',
        tech: [
          'SwiftUI',
          'HealthKit',
          'React',
          'TypeScript',
          'Node.js',
          'Express',
          'PostgreSQL',
          'Gemini',
        ],
      },
      {
        name: 'Better Canvas',
        blurb:
          'Canvas LMS customizer for Chrome and Firefox: skins, a kanban planner, Pomodoro, GPA and rubric predictors, and a command palette. Everything stays local, with no accounts and no telemetry.',
        href: '/products/better-canvas',
        internal: true,
        productId: 'better-canvas',
        repo: 'https://github.com/sidebandstudio/Better-Canvas',
        role: 'Creator',
        tech: ['JavaScript', 'Chrome MV3', 'Firefox'],
      },
      {
        name: 'NEU Academic Calendar → ICS',
        blurb:
          'Checks Northeastern’s registrar every Monday and republishes the academic calendar PDFs as subscribable .ics feeds, split by audience and category.',
        href: 'https://github.com/Alitleis123/neu-academic-calendar-ics',
        source: true,
        repo: 'https://github.com/Alitleis123/neu-academic-calendar-ics',
        tech: ['Python', 'pypdf', 'iCalendar', 'GitHub Actions'],
      },
      {
        name: 'Top Choice Realty Platform',
        blurb:
          'Real estate platform for Top Choice Realty: Next.js client intake and agent dashboards on Express APIs, with role-based access, MongoDB Atlas and document uploads in Azure Blob Storage.',
        href: 'https://topchoicerealtyny.com',
        role: 'Frontend Developer Intern',
        tech: ['Next.js', 'React', 'TypeScript', 'Express', 'MongoDB Atlas'],
      },
      {
        name: 'CalorieCalculator',
        blurb:
          'Calorie target calculator: Mifflin-St Jeor for BMR, an activity multiplier for TDEE, then a goal adjustment.',
        href: 'https://github.com/Alitleis123/CalorieCalculator',
        source: true,
        repo: 'https://github.com/Alitleis123/CalorieCalculator',
        tech: ['React', 'Vite', 'Playwright'],
      },
      {
        name: 'CS3520 Coursework',
        blurb: 'C++ coursework from his Summer 1 semester at Northeastern.',
        href: 'https://github.com/Alitleis123/CS3520-Summer-2025',
        source: true,
        repo: 'https://github.com/Alitleis123/CS3520-Summer-2025',
        tech: ['C++', 'Makefile'],
      },
    ],
    portfolio: {
      // The captures leave out his security clearance line, which this site
      // does not show (see the people dossier).
      url: 'https://alitleis.dev',
      summary:
        'Opens on a split screen with two ways in: a recruiter-friendly reading view over a starfield, and an editing suite that rebuilds the whole portfolio as a 75-second video timeline you can scrub, scored to Eyes Without a Face. Warm near-black with a single amber accent.',
      pages: [
        {
          label: 'Chooser',
          url: 'https://alitleis.dev/',
          ...capture('ali-tleis', 'portfolio'),
        },
        {
          label: 'Reading view',
          url: 'https://alitleis.dev/galaxy/',
          ...capture('ali-tleis', 'portfolio-reading'),
        },
        {
          label: 'Editing suite',
          url: 'https://alitleis.dev/studio/',
          ...capture('ali-tleis', 'portfolio-studio'),
        },
      ],
    },
    contact: {
      email: 'tleis.a@northeastern.edu',
      github: 'https://github.com/Alitleis123',
      linkedin: 'https://www.linkedin.com/in/ali-tleis-091800247/',
      website: 'https://alitleis.dev',
      tiktok: 'https://www.tiktok.com/@.justlightt',
      // Linked, not copied: the PDF prints his phone number and his clearance.
      resume: 'https://alitleis.dev/resume/resume.pdf',
      location: 'Greater Boston, MA',
    },
  },
  {
    id: 'karan-anand',
    name: 'Karan Anand',
    initials: 'KA',
    role: 'Founding Engineer',
    githubLogin: 'Karan4248',
    shortBio:
      'Computer Science student at the University of Manitoba and co-founder of Staged, an AI resume builder. Builds things that work, then finds new ways to break them.',
    longBio: [
      'Karan studies Computer Science at the University of Manitoba in Winnipeg and joined Sideband as a founding engineer in 2026, focused on systems design. He likes turning ideas into things people can actually click on.',
      'Before Sideband he co-founded and built Staged, an AI-powered resume builder with live preview, PDF export and Claude-powered content generation. He handled the full-stack development and the Stripe subscription billing, and ran an Instagram page for user acquisition.',
      'For school he built Exercise Tracker, a Java fitness tracker with user profiles, an activity feed and route finding on a grid map. Outside of code he is usually locked into a Valorant match, grinding a Monster Hunter boss, or watching basketball.',
    ],
    portrait: {
      src: '/assets/engineers/karan-anand/portrait.jpg',
      width: 1086,
      height: 1448,
    },
    availability: 'Open to Summer 2027 SWE internships',
    interests: ['Valorant', 'Monster Hunter', 'Basketball'],
    accentColor: '#10B981',
    prev: [
      {
        label: 'SIDEBAND',
        sublabel: 'FOUNDING ENGINEER · SYSTEMS DESIGN · CURRENT',
      },
      { label: 'STAGED', sublabel: 'CO-FOUNDER & DEVELOPER' },
      { label: 'UNIVERSITY OF MANITOBA', sublabel: 'COMPUTER SCIENCE' },
    ],
    experience: [
      {
        company: 'Sideband',
        companyUrl: 'https://sideband.studio',
        logo: '/assets/logos/sideband.png',
        logoOnDark: true,
        role: 'Founding Engineer',
        location: 'Winnipeg, MB (Remote)',
        startDate: 'Aug 2026',
        endDate: 'Present',
        current: true,
        emphasis: true,
        summary:
          'Joined the studio as a founding engineer, working on systems design: architecture and technical planning for the product lineup.',
        skills: ['Systems Design', 'Architecture', 'TypeScript'],
      },
      {
        company: 'Staged',
        logo: '/assets/logos/staged.png',
        logoOnDark: true,
        role: 'Co-Founder & Developer',
        location: 'Winnipeg, MB',
        startDate: 'Apr 2026',
        endDate: 'Jun 2026',
        emphasis: true,
        summary:
          'Co-founded and built Staged, an AI-powered resume builder with live preview, PDF export and Claude-powered content generation.',
        highlights: [
          'Handled the full-stack development',
          'Built Stripe-based subscription billing',
          'Claude-powered bullet polish, summary generation and job-description optimization',
          'Ran an Instagram page for user acquisition',
        ],
        skills: ['TypeScript', 'Supabase', 'Stripe', 'Claude API'],
      },
    ],
    education: [
      {
        school: 'University of Manitoba',
        logo: '/assets/logos/university-of-manitoba.png',
        logoOnDark: true,
        degree: 'B.S. Computer Science',
        dates: '2022 – 2029 (expected) · Winnipeg, MB',
      },
    ],
    skills: [
      {
        category: 'Languages',
        items: ['Java', 'JavaScript', 'TypeScript', 'HTML', 'CSS'],
      },
      {
        category: 'Frameworks & Libraries',
        items: ['React', 'Spring Boot', 'FastAPI'],
      },
      {
        category: 'Tools & Platforms',
        items: ['Maven', 'JUnit', 'Supabase', 'Stripe', 'Claude API'],
      },
    ],
    projects: [
      {
        name: 'Staged',
        featured: true,
        blurb:
          'AI-powered resume builder he co-founded and built: live preview, PDF export, Claude-powered bullet polish, summary generation, job-description optimization and Stripe subscription billing.',
        role: 'Co-Founder & Full-Stack Developer',
        tech: ['TypeScript', 'Supabase', 'Stripe', 'Claude API'],
      },
      {
        name: 'Exercise Tracker',
        featured: true,
        blurb:
          'Java fitness tracker built for a University of Manitoba course: user profiles, follow feeds, activity logging and stack-based route finding around obstacles on a grid map, persisted to JSON.',
        href: 'https://github.com/Karan4248/Exercise-Tracker',
        source: true,
        repo: 'https://github.com/Karan4248/Exercise-Tracker',
        tech: ['Java 17', 'Maven', 'Guava', 'JSON-P'],
      },
      {
        name: 'Automatic Food Ordering System',
        featured: true,
        blurb:
          'Team-built voice and chat food ordering app. Karan cut AI response latency on the ordering path with a local parser for simple orders and concurrent extraction, and fixed cart item parsing.',
        href: 'https://github.com/minhkhoily29/Automatic-Food-Ordering-System',
        source: true,
        repo: 'https://github.com/minhkhoily29/Automatic-Food-Ordering-System',
        role: 'Contributor',
        tech: ['React', 'Vite', 'TypeScript', 'Gemini API', 'Vitest'],
      },
      {
        name: 'Personal Portfolio',
        featured: true,
        blurb:
          'His personal site, built from scratch with React and React Router and deployed on GitHub Pages through GitHub Actions.',
        href: 'https://karan4248.github.io/Portfolio/',
        repo: 'https://github.com/Karan4248/Portfolio',
        tech: ['React', 'React Router', 'Vite', 'CSS', 'GitHub Actions'],
      },
    ],
    portfolio: {
      url: 'https://karan4248.github.io/Portfolio/',
      summary:
        'A monochrome single column in Inter and Space Mono, with a Locked In badge for his games. A Valorant knife hangs from the corner and opens his projects when pulled down, and a basketball rolls across the page when clicked.',
      pages: [
        {
          label: 'Home',
          url: 'https://karan4248.github.io/Portfolio/',
          ...capture('karan-anand', 'portfolio'),
        },
      ],
    },
    contact: {
      email: 'karan.a4248@gmail.com',
      github: 'https://github.com/Karan4248',
      linkedin: 'https://www.linkedin.com/in/karan-anand-19bbb81b3/',
      website: 'https://karan4248.github.io/Portfolio/',
      location: 'Winnipeg, MB',
    },
  },
  {
    id: 'naman-rusia',
    name: 'Naman Rusia',
    initials: 'NR',
    role: 'Founding Engineer',
    githubLogin: 'naman0r',
    shortBio:
      'Software engineer on backend, cloud and systems. Interned on the Sonos iOS app and on Philips Healthcare’s systems integration team.',
    longBio: [
      'Naman studies Computer Science and Business Administration at Northeastern, graduating in May 2028. He grew up in India and Singapore and is based in Boston. He got into software in his first semester of college and has since worked at startups, Philips and Sonos, plus a lot of side projects. Lately he has been interested in backend systems and tools that make building software easier.',
      'In summer 2026 he was a software engineering intern on the Sonos iOS app, where he shipped real-time search suggestions served from an on-device cache and built a reusable diagnostics framework for multi-device homes. Before that, on a Philips Healthcare co-op, he built a provisioning API for the PIC iX patient-monitoring system that cut test setup from 100+ hours to 2.',
      'On campus he is Director of Software at TAMID at Northeastern and a developer at Code4Community. His own projects include TandemCode, a pair-programming interview practice tool with a shared editor and a sandboxed judge, plus Dockmaster and Canvas Buddy. At Sideband he worked on the rebrand from Eternal Reverse and the new studio site. Outside of that he plays guitar, lifts and plays Clash Royale.',
    ],
    portrait: {
      src: '/assets/engineers/naman-rusia/portrait.webp',
      width: 460,
      height: 460,
    },
    availability: 'Open to Spring 2027 and Summer 2027 co-ops and internships',
    interests: [
      'Guitar',
      'Lifting',
      'Clash Royale',
      'Road biking',
      'Rubik’s cubes',
    ],
    accentColor: '#4F8BFF',
    prev: [
      { label: 'SONOS', sublabel: 'iOS SWE INTERN · SUMMER 26' },
      { label: 'PHILIPS HEALTHCARE', sublabel: 'SWE CO-OP · SPRING 26' },
      { label: 'NORTHEASTERN', sublabel: 'CS + BUSINESS · CLASS OF 28' },
    ],
    experience: [
      {
        company: 'Sideband',
        companyUrl: 'https://sideband.studio',
        logo: '/assets/logos/sideband.png',
        logoOnDark: true,
        role: 'Founding Engineer',
        location: 'Boston, MA',
        startDate: 'Aug 2026',
        endDate: 'Present',
        current: true,
        emphasis: true,
        summary:
          'A few friends building things together under one name: display streaming, media pipelines, fitness software and web products, including EternalMonitor and Exerly.',
        highlights: [
          'Worked on the rebrand from Eternal Reverse to Sideband and the new studio site at sideband.studio',
          'TandemCode, his pair-programming practice tool, is mirrored in the studio’s GitHub org',
        ],
        skills: ['Next.js', 'TypeScript'],
      },
      {
        company: 'TAMID at Northeastern',
        companyUrl: 'https://www.nutamidtech.org/',
        logo: '/assets/logos/tamid.png',
        role: 'Director of Software',
        location: 'Boston, MA',
        startDate: 'Jul 2026',
        endDate: 'Present',
        current: true,
        summary:
          'Working with Movo to integrate warehouse cameras into one tracking system.',
      },
      {
        company: 'Sonos',
        companyUrl: 'https://www.sonos.com',
        logo: '/assets/logos/sonos.svg',
        role: 'Software Engineering Intern · iOS App Experience',
        location: 'Boston, MA',
        startDate: 'Jun 2026',
        endDate: 'Aug 2026',
        emphasis: true,
        summary:
          'Sole iOS engineer across 5 feature areas of the Sonos iOS app, shipping 7 features to 10M+ daily active users.',
        highlights: [
          'Shipped real-time search suggestions end to end for 16M+ households, serving instant results from an on-device cache with no extra network calls, with telemetry and a staged rollout',
          'Built a reusable diagnostics framework that detects device, connectivity, configuration and network-topology issues in multi-device homes, and the user-facing UI on top of it',
        ],
        skills: [
          'Swift',
          'SwiftUI',
          'UIKit',
          'Swift Concurrency',
          'Combine',
          'Snowflake',
        ],
      },
      {
        company: 'Philips Healthcare',
        companyUrl: 'https://www.usa.philips.com/healthcare',
        logo: '/assets/logos/philips.png',
        role: 'Software Engineering Co-op · Systems Integration & Automation',
        location: 'Cambridge, MA',
        startDate: 'Jan 2026',
        endDate: 'May 2026',
        emphasis: true,
        summary:
          'Automated deployments for Philips’ PIC iX patient-monitoring system on the Systems Integration team.',
        highlights: [
          'Built a provisioning API for PIC iX that cut test setup from 100+ hours to 2, and the automation framework for performance tests on simulated deployments of up to 2,550 hospital beds',
          'Built a self-scaling monitoring service for thousands of VMs on TimescaleDB that flags anomalies through an AI agent in Teams',
          'Extended deployment automation from virtual machines to physical servers with FOG/PXE network booting',
          'Improved the FastAPI, React and PostgreSQL deployment manager and troubleshot network failures on Linux VMs',
        ],
        skills: [
          'Python',
          'FastAPI',
          'PowerShell',
          'C#/.NET',
          'TimescaleDB',
          'FOG/PXE',
        ],
      },
      {
        company: 'TAMID at Northeastern',
        companyUrl: 'https://www.nutamidtech.org/',
        logo: '/assets/logos/tamid.png',
        role: 'Software Developer',
        location: 'Boston, MA',
        startDate: 'Jan 2026',
        endDate: 'Jul 2026',
        summary:
          'Built a full-stack quant research platform for a Boston hedge fund to generate, backtest and explore trading signals.',
        highlights: [
          'A Python quant engine running as async Redis and RQ jobs behind FastAPI, with a Next.js frontend for interactive analysis',
        ],
        skills: [
          'FastAPI',
          'Redis',
          'Celery',
          'Next.js',
          'Python',
          'PostgreSQL',
        ],
      },
      {
        company: 'TAMID at Northeastern',
        companyUrl: 'https://www.nutamidtech.org/',
        logo: '/assets/logos/tamid.png',
        role: 'Tech Consulting Foundations Instructor',
        location: 'Boston, MA',
        startDate: 'Jan 2026',
        endDate: 'Jul 2026',
        summary:
          'Taught the Tech Consulting Foundations curriculum to 15+ students.',
      },
      {
        company: 'Code4Community',
        companyUrl: 'https://www.c4cneu.com/',
        logo: '/assets/logos/code4community.png',
        role: 'Software Developer',
        location: 'Boston, MA',
        startDate: 'Sep 2025',
        endDate: 'Present',
        current: true,
        summary:
          'Northeastern’s pro-bono software consultancy. Four projects since Sep 2025.',
        highlights: [
          'Blue Hill Observatory (Sep 2026 to now): automating a manual data import and processing pipeline, starting from the database schema he drafted for uploads, observations, historical records and an audit log',
          'Boston Health Care for the Homeless Program (May to Aug 2026) and 826 Boston, a youth writing nonprofit (Jan to Apr 2026)',
          'Core Infrastructure team (Sep to Dec 2025), working on C4C’s internal recruitment dashboard',
        ],
        skills: [
          'TypeScript',
          'NestJS',
          'React',
          'Next.js',
          'PostgreSQL',
          'AWS',
        ],
      },
      {
        company: 'TAMID at Northeastern',
        companyUrl: 'https://www.nutamidtech.org/',
        logo: '/assets/logos/tamid.png',
        role: 'Technical Product Manager (Tech Lead)',
        location: 'Boston, MA',
        startDate: 'Sep 2025',
        endDate: 'Dec 2025',
        summary:
          'Led Foresight, working with a startup in an agile setup to give boutique hotels real-time pricing insights.',
        skills: ['FastAPI', 'PostgreSQL', 'Neon', 'Next.js', 'CI/CD', 'RAG'],
      },
      {
        company: 'Venu AI (YC W21)',
        companyUrl: 'https://www.venu3d.com/',
        logo: '/assets/logos/venu-ai.png',
        role: 'Software Engineering Intern (part-time)',
        location: 'Remote',
        startDate: 'Apr 2025',
        endDate: 'Jul 2025',
        summary: 'TPM and software engineering work on Venu’s CRM.',
        highlights: [
          'Built core CRM workflows and asynchronous background job pipelines with Django, Celery, Redis and PostgreSQL',
          'Optimized slow database queries and high-traffic REST endpoints, cutting API latency by up to 70%',
          'Refactored email-provider integrations so customer emails sent from the CRM were less likely to land in spam',
        ],
        skills: ['Python', 'Django', 'Celery', 'Redis', 'PostgreSQL', 'React'],
      },
      {
        company: 'Auribus Labs',
        role: 'Software Engineering Intern (part-time)',
        location: 'Boston, MA',
        startDate: 'Feb 2025',
        endDate: 'Sep 2025',
        summary:
          'Built a hearing assessment and a prescription healthcare iOS app.',
        highlights: [
          'Built an online hearing test in Next.js, TypeScript, GraphQL and GCP, 95% accurate in early diagnostic evaluations',
          'Built an FDA-compliant prescription healthcare iOS app in Swift and SwiftUI, used by 60+ clinical researchers',
        ],
        skills: [
          'Next.js',
          'TypeScript',
          'GraphQL',
          'Hasura',
          'GCP',
          'SwiftUI',
        ],
      },
      {
        company: 'TAMID at Northeastern',
        companyUrl: 'https://www.nutamidtech.org/',
        logo: '/assets/logos/tamid.png',
        role: 'TCF and Education Member',
        location: 'Boston, MA',
        startDate: 'Jan 2025',
        endDate: 'Aug 2025',
        summary: 'Tech Consulting Foundations and education track member.',
        skills: ['Docker', 'Flask'],
      },
      {
        company: 'Oasis at Northeastern',
        logo: '/assets/logos/oasis.svg',
        role: 'Software Developer',
        location: 'Boston, MA',
        startDate: 'Jan 2025',
        endDate: 'May 2025',
        summary:
          'Built NUtrition, a Northeastern dining hall macronutrient tracker, now in production.',
        skills: ['React', 'Flask', 'Supabase', 'Selenium'],
      },
      {
        company: 'Forge',
        companyUrl: 'https://www.forgenu.com/',
        logo: '/assets/logos/forge.svg',
        role: 'Software Lead · Team BackBuddy',
        location: 'Boston, MA',
        startDate: 'Jan 2025',
        endDate: 'Apr 2025',
        summary:
          'Software lead on BackBuddy, a cross-platform Arduino-integrated mobile app to help improve posture, at Northeastern’s product development studio.',
        skills: ['Embedded', 'React Native', 'Arduino', 'Firebase'],
      },
      {
        company: 'Forge',
        companyUrl: 'https://www.forgenu.com/',
        logo: '/assets/logos/forge.svg',
        role: 'Software Engineer · Team SmartStep',
        location: 'Boston, MA',
        startDate: 'Sep 2024',
        endDate: 'Dec 2024',
        summary:
          'An app for a height-adjusting cane with tracking, to help the elderly climb stairs and find the cane if it is lost.',
        skills: ['React Native', 'Arduino'],
      },
    ],
    education: [
      {
        school: 'Northeastern University',
        logo: '/assets/logos/northeastern-university.png',
        logoOnDark: true,
        degree: 'B.S. Computer Science & Business Administration',
        dates: 'May 2028 (expected) · Boston, MA',
        honors: 'GPA 3.8 / 4.0 · Dean’s List',
        coursework: [
          'Foundations of Artificial Intelligence',
          'Object-Oriented Design',
          'Algorithms and Data',
          'Foundations of Cybersecurity',
          'Database Design',
          'Foundations of Data Science',
          'Discrete Structures',
          'Large Scale Information Storage and Retrieval',
        ],
        activities: [
          'TAMID (Director of Software)',
          'Code4Community',
          'Forge',
          'Oasis',
        ],
      },
      {
        school: 'Singapore American School',
        degree: 'High school',
        dates: 'Class of 2024 · Singapore',
      },
    ],
    skills: [
      {
        category: 'Languages',
        items: [
          'Python',
          'Java',
          'TypeScript',
          'Swift',
          'SQL',
          'C++',
          'Go',
          'HTML/CSS',
        ],
      },
      {
        category: 'Frameworks',
        items: [
          'React',
          'Next.js',
          'SwiftUI',
          'FastAPI',
          'Flask',
          'Django',
          'Node.js',
          '.NET',
          'React Native',
          'GraphQL',
          'PyTest',
        ],
      },
      {
        category: 'Infra & Data',
        items: [
          'AWS',
          'GCP',
          'Azure',
          'Linux',
          'Docker',
          'gVisor',
          'PostgreSQL',
          'TimescaleDB',
          'Redis',
          'Nutanix',
          'FOG/PXE',
          'Grafana',
          'Git',
        ],
      },
    ],
    projects: [
      {
        name: 'TandemCode',
        featured: true,
        blurb:
          'Practice coding interview problems with a partner in one Yjs-synced editor, judged against hidden tests in gVisor sandboxes.',
        href: '/products/tandemcode',
        internal: true,
        productId: 'tandemcode',
        repo: 'https://github.com/naman0r/tandemcode',
        role: 'Solo developer',
        tech: [
          'FastAPI',
          'asyncpg',
          'Postgres 17',
          'WebSockets',
          'Yjs',
          'Monaco',
          'React',
          'gVisor',
          'Docker',
        ],
      },
      {
        name: 'Dockmaster',
        featured: true,
        blurb:
          'Local dev dashboard for your Mac and homelab: finds stray dev servers, repos and worktrees, watches coding agents, and manages remote Macs over SSH.',
        href: 'https://trydockmaster.vercel.app/',
        repo: 'https://github.com/naman0r/dockmaster',
        tech: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Zod', 'Vitest'],
      },
      {
        name: 'Canvas Buddy',
        featured: true,
        blurb:
          'Small terminal app that answers questions about your Canvas classes with cited sources, from local, read-only course storage, using Codex, OpenCode or a local Ollama model. Installs with Homebrew.',
        href: 'https://trycanvasbuddy.vercel.app/',
        repo: 'https://github.com/naman0r/canvas-buddy',
        tech: [
          'Python',
          'Textual',
          'HTTPX',
          'Beautiful Soup',
          'pypdf',
          'Ollama',
          'Homebrew',
        ],
      },
      {
        name: 'Peel',
        blurb:
          'macOS menu bar app that turns anything on screen into a draggable artifact: a PNG, a CSV or a calendar event.',
        href: 'https://github.com/naman0r/Peel',
        source: true,
        repo: 'https://github.com/naman0r/Peel',
        tech: [
          'Swift 6',
          'AppKit',
          'SwiftUI',
          'ScreenCaptureKit',
          'Vision',
          'Foundation Models',
          'EventKit',
        ],
      },
      {
        name: 'Open Brain',
        blurb:
          'Memory for his AI systems: an MCP server over a git-backed markdown vault with keyword retrieval and quarantined writes.',
        href: 'https://github.com/naman0r/open-brain-mcp',
        source: true,
        repo: 'https://github.com/naman0r/open-brain-mcp',
        tech: ['Python', 'MCP', 'FastAPI', 'Pydantic', 'PyYAML'],
      },
      {
        name: 'Git Interviewer',
        blurb:
          'A pre-commit hook that interviews you about your code before it lets you commit. Published on PyPI.',
        href: 'https://pypi.org/project/git-interviewer/',
        repo: 'https://github.com/naman0r/git-interviewer',
        tech: ['Python', 'Typer', 'Rich', 'Gemini API', 'Git hooks'],
      },
      {
        name: 'Foresight',
        blurb:
          'Real-time pricing intelligence for boutique hotels, built by a 12-person TAMID team that he led as technical lead.',
        href: 'https://foresight-tamid.vercel.app',
        repo: 'https://github.com/TamidNu/Foresight',
        role: 'Technical lead',
        tech: [
          'FastAPI',
          'SQLAlchemy',
          'PostgreSQL',
          'Next.js',
          'Clerk',
          'scikit-learn',
        ],
      },
      {
        name: 'Axiom AI',
        blurb:
          'AI student productivity platform that started as EduGenie: upload a syllabus and get notes, study material and calendar tracking for coursework.',
        href: 'https://www.axiomai.space',
        repo: 'https://github.com/naman0r/axiomai',
        tech: [
          'Next.js',
          'TypeScript',
          'Express',
          'Prisma',
          'Supabase',
          'Clerk',
          'React Flow',
        ],
      },
      {
        name: 'Clash Royale RL Bot',
        blurb:
          'Tabular Q-learning agent that plays Clash Royale on an Android emulator, reading the screen with PyAutoGUI image matching and Tesseract OCR. Built for Northeastern’s CS4100.',
        href: 'https://github.com/naman0r/CS4100-CR-bot',
        source: true,
        repo: 'https://github.com/naman0r/CS4100-CR-bot',
        tech: [
          'Python',
          'Q-learning',
          'PyAutoGUI',
          'Tesseract OCR',
          'Matplotlib',
        ],
      },
      {
        name: 'NUtrition',
        blurb:
          'Northeastern dining hall macronutrient tracker, built at Oasis and now in production.',
        href: 'https://nutrition-oasis.vercel.app/',
        repo: 'https://github.com/somshrivastava/NUtrition',
        tech: ['React', 'TypeScript', 'Vite', 'Flask', 'Selenium', 'Supabase'],
      },
      {
        name: 'MindfulMomentum',
        blurb:
          'Habits, journaling and tasks web app with a focus-mode Chrome extension.',
        href: 'https://mindfulmomentum.vercel.app/',
        repo: 'https://github.com/naman0r/MindfulMomentum',
        tech: [
          'React',
          'Vite',
          'Tailwind CSS',
          'Flask',
          'Firebase',
          'Supabase',
          'Chrome MV3',
        ],
      },
      {
        name: 'Market Sentiment Visualizer',
        blurb:
          'A weather forecast for market psychology: one 0 to 100 fear and greed score from VIX, the put/call ratio, sector breadth and a fear and greed proxy, refreshed every 15 minutes in market hours.',
        href: 'https://github.com/naman0r/market-sentiment-visualizer',
        source: true,
        repo: 'https://github.com/naman0r/market-sentiment-visualizer',
        tech: ['React', 'Vite', 'Recharts', 'FastAPI', 'yfinance', 'pandas'],
      },
      {
        name: 'Resume-Tex',
        blurb:
          'Google ADK agent that generates a tailored LaTeX resume from a job description, a context file and your template, editing only the experience and projects sections.',
        href: 'https://github.com/naman0r/resume-tex',
        source: true,
        repo: 'https://github.com/naman0r/resume-tex',
        tech: ['Python', 'Google ADK', 'Gemini', 'LaTeX'],
      },
      {
        name: 'AMA Automator',
        blurb:
          'Internal tool that automates TAMID at Northeastern’s ask-me-anything process on Slack, with auth and a Slack agent built on webhooks.',
        href: 'https://github.com/TamidNu/AMA-Automator',
        source: true,
        repo: 'https://github.com/TamidNu/AMA-Automator',
        tech: ['React', 'Vite', 'Flask', 'Supabase', 'Slack SDK'],
      },
      {
        name: 'TaNews',
        blurb:
          'Full-stack news platform with posting, reading and liking, and separate admin and user roles.',
        href: 'https://github.com/TamidNu/TaNews/tree/naman',
        source: true,
        repo: 'https://github.com/TamidNu/TaNews',
        tech: ['React', 'Vite', 'Flask', 'MySQL', 'Docker'],
      },
      {
        name: 'StudyBuddy',
        blurb:
          'Connects university students with each other to form study groups.',
        href: 'https://github.com/Arshayp/studybuddy-2',
        source: true,
        repo: 'https://github.com/Arshayp/studybuddy-2',
        tech: ['Streamlit', 'Flask', 'MySQL', 'Docker'],
      },
      {
        name: 'BackBuddy',
        blurb:
          'A chair attachment with pressure sensors and inflatable bladders that nudges you back into good posture, paired with a React Native app over Bluetooth.',
        href: 'https://github.com/naman0r/backbuddy-app',
        source: true,
        repo: 'https://github.com/naman0r/backbuddy-app',
        role: 'Software lead, Team BackBuddy at Forge',
        tech: ['React Native', 'Expo', 'Firebase', 'Bluetooth', 'Arduino'],
      },
      {
        name: 'MindMapr',
        blurb:
          'AI study tool that turns students’ notes into easy-to-understand visualizations, with authentication and a MongoDB database.',
        href: 'https://github.com/naman0r/MindMapr',
        source: true,
        repo: 'https://github.com/naman0r/MindMapr',
        tech: ['React', 'React Flow', 'Express', 'MongoDB', 'OpenAI API'],
      },
      {
        name: 'Car2Drvr',
        blurb:
          'Recommends which car to buy based on your needs, with a price range so you do not overpay.',
        href: 'https://car2drvr-finhacks.firebaseapp.com/',
        repo: 'https://github.com/somshrivastava/Car2Drvr',
        tech: [
          'React',
          'Vite',
          'PrimeReact',
          'Express',
          'Firebase Functions',
          'OpenAI API',
        ],
      },
      {
        name: 'Personal Website v1',
        blurb:
          'His first portfolio, an interactive React site with a lot of animation.',
        href: 'https://namanrusia.netlify.app/',
        tech: ['React', 'Framer Motion', 'GSAP', 'PrimeReact', 'JavaScript'],
      },
      {
        name: 'DoNow!',
        blurb:
          'A simple to-do list that lives in a Chrome extension, published on the Chrome Web Store.',
        href: 'https://chromewebstore.google.com/detail/donow-to-do-list/ledniccgbjopheokhlcpaajlblopaegf',
        repo: 'https://github.com/naman0r/doNow_chrome_extension',
        tech: ['HTML', 'CSS', 'JavaScript', 'Chrome MV3'],
      },
    ],
    portfolio: {
      url: 'https://www.namanrusia.dev',
      summary:
        'Dark retro-game look in Departure Mono with a blue and lime palette, over a dithered three.js voxel scene that morphs as you scroll: a draggable globe of the places he has lived, a project cartridge ring and a city built from his GitHub contributions. Press ~ for a built-in terminal.',
      pages: [
        {
          label: 'Home',
          url: 'https://www.namanrusia.dev/',
          ...capture('naman-rusia', 'portfolio'),
        },
      ],
    },
    contact: {
      email: 'rusia.n@northeastern.edu',
      github: 'https://github.com/naman0r',
      linkedin: 'https://www.linkedin.com/in/namanrusia/',
      website: 'https://www.namanrusia.dev',
      x: 'https://x.com/namanrusia1',
      resume: 'https://www.namanrusia.dev/resume.pdf',
      location: 'Boston, MA',
    },
  },
  {
    id: 'david-czartoryski',
    name: 'David Czartoryski',
    initials: 'DC',
    role: 'Founding Engineer',
    githubLogin: 'DavidCzartoryski',
    shortBio:
      'Software engineer, AI infrastructure researcher at Northeastern’s HPC Research Lab, and founder. The work that pulls him in is making things faster, now down to the one slow GPU holding a training job back.',
    longBio: [
      'David studies Computer Science and Business Administration at Northeastern, with a concentration in Corporate Innovation, and graduates in December 2027. Home base is split between Boston, San Francisco and Warsaw. He is an AI infrastructure researcher at Northeastern’s HPC Research Lab, where he builds cross-vendor GPU training and runtime diagnosis systems on the Explorer cluster at MGHPCC.',
      'Most of what he has shipped is a version of the same problem: profiling a system until the bottleneck shows itself, then optimizing the code around it. At Mosaiq Software he replaced a 5-second polling loop with a WebSocket transport that updates in 120 ms. At Summit Partners he cut deployment time 70%. With GPUBridge he made a 1 GB all-reduce across NVIDIA and AMD GPUs 2.7x faster. He is also a software engineer on Pawtograder, Northeastern’s coding and grading platform.',
      'Outside Sideband, in 2024 he founded Hercules Holdings, his own venture studio behind EternalTap, a wallet-native transit fare platform, and CrediMax, a card-rewards app. In 2026 he won 1st place among 250+ participants at the Microsoft x Northeastern AI Hackathon with HuskyClaw. He won the Massachusetts state wrestling title more than once in high school and still wrestles at Northeastern. He speaks English, Polish and Russian and has been to 23 countries.',
    ],
    portrait: {
      src: '/assets/engineers/david-czartoryski/portrait.webp',
      width: 240,
      height: 240,
    },
    availability:
      'Open to new-grad software engineering roles starting after December 2027, private equity and venture roles, and front-office finance',
    spokenLanguages: ['English', 'Polish', 'Russian'],
    interests: [
      'Wrestling',
      'Travel',
      'Fashion',
      'Food',
      'Photography',
      'Cars',
      'Chess',
      'Fitness',
    ],
    accentColor: '#D4A853',
    prev: [
      {
        label: 'NORTHEASTERN HPC RESEARCH LAB',
        sublabel: 'AI INFRASTRUCTURE RESEARCHER · CURRENT',
      },
      { label: 'SUMMIT PARTNERS', sublabel: 'DEVOPS CO-OP · FALL 25' },
      { label: 'NORTHEASTERN', sublabel: 'CS + BUSINESS · DEC 27' },
    ],
    experience: [
      {
        company: 'Sideband',
        companyUrl: 'https://sideband.studio',
        logo: '/assets/logos/sideband.png',
        logoOnDark: true,
        role: 'Founding Engineer',
        location: 'Boston, MA',
        startDate: '2026',
        endDate: 'Present',
        current: true,
        emphasis: true,
        summary: 'Joined the studio as one of its founding engineers.',
      },
      {
        company: 'Northeastern University HPC Research Lab',
        logo: '/assets/logos/northeastern-university.png',
        logoOnDark: true,
        role: 'AI Infrastructure Researcher',
        location: 'Boston, MA · MGHPCC',
        startDate: 'Oct 2026',
        endDate: 'Present',
        current: true,
        emphasis: true,
        summary:
          'Develops GPUBridge and a runtime GPU straggler detector and workload rebalancer on Northeastern’s Explorer cluster at the Massachusetts Green High Performance Computing Center (MGHPCC). The projects began independently and led to this research role.',
        highlights: [
          'Owns the work across distributed communication, GPU kernels, statistical diagnosis and native Rust execution',
          'Evaluates changes with hardware benchmarks, reference-based differential tests and fault injection, preserving numerical behavior and asynchronous resource lifetimes',
        ],
        skills: [
          'PyTorch',
          'Rust',
          'CUDA',
          'ROCm',
          'NCCL / RCCL',
          'Triton',
          'Slurm',
        ],
      },
      {
        company: 'Pawtograder',
        companyUrl: 'https://github.com/pawtograder',
        logo: '/assets/logos/pawtograder.png',
        logoOnDark: true,
        role: 'Software Engineer',
        location: 'Boston, MA',
        startDate: 'Sep 2026',
        endDate: 'Present',
        current: true,
        summary:
          'Operates a production coding and grading platform serving 5,000+ weekly active users across ten Northeastern CS courses, as one of 15 engineers on a subteam of four that owns one service end to end. A capstone with Prof. Jon Bell.',
        highlights: [
          'Set up telemetry for the Next.js and Supabase platform with OpenTelemetry, exporting metrics to Prometheus and visualizing them in Grafana dashboards',
          'Raised survey error-text contrast from 3.98:1 to 5.06:1 after finding 2 WCAG 1.4.3 failures the CI accessibility gate excluded, and extended the axe-core sweep to scan pages mid-interaction, now covering 40 routes',
          'Measured the CI accessibility gate’s recall across 82 axe-core scans with 8 seeded defects. It caught 1 of 8, which made the case for scanning with every rule and in interaction states',
          'Traced 2 test suites crashing on import to a missing jsdom global, exposing 5 real failures hidden in the LLM-hint rate-limiting tests and a CI config that gated only 2 test files',
        ],
        skills: [
          'Next.js',
          'TypeScript',
          'Supabase',
          'OpenTelemetry',
          'Prometheus',
          'Grafana',
          'Playwright',
          'axe-core',
        ],
      },
      {
        company: 'Hercules Holdings',
        role: 'Founder & CEO',
        location: 'Boston, MA',
        startDate: '2024',
        endDate: 'Present',
        current: true,
        emphasis: true,
        summary:
          'His own venture studio and holding company, separate from Sideband. It is behind his govtech fare platform, his consumer fintech app and the AI tooling for his commerce brands, and by his account it has had employees and interns.',
        highlights: [
          'EternalTap, his own venture and not a Sideband product: a wallet-native fare platform for universities and transit agencies, built with a cofounder. He reports a conditional contract covering 22,000+ riders',
          'CrediMax, his own venture: aggregates credit cards through Plaid and surfaces the best card at checkout. He says he negotiated seed terms with venture firms and senior American Express leadership, then walked away from the round',
          'The creative engine, his own venture: an autonomous storefront builder and an ad creative pipeline for his commerce brands. He reports $180K in revenue across the brands and ad production cut from days to 6 minutes',
        ],
      },
      {
        company: 'Mosaiq Software',
        companyUrl: 'https://github.com/mosaiq-software',
        logo: '/assets/logos/mosaiq.png',
        role: 'Full-Stack Software Engineer',
        location: 'Boston, MA',
        startDate: 'Jan 2026',
        endDate: 'May 2026',
        summary:
          'Cut update latency to 120 ms by replacing a 5-second polling loop with a WebSocket transport, unblocking live updates and interactive multi-user workflows the product could not support before.',
        highlights: [
          'Moved the React frontend and Node/Express backend onto shared TypeScript API contracts in a monorepo package, so a breaking change fails the compiler instead of reaching production as a runtime data-flow bug',
        ],
        skills: ['React', 'Node', 'Express', 'TypeScript', 'WebSockets'],
      },
      {
        company: 'Summit Partners',
        companyUrl: 'https://www.summitpartners.com/',
        logo: '/assets/logos/summit-partners.png',
        logoOnDark: true,
        role: 'DevOps Engineer Co-op',
        location: 'Menlo Park, CA',
        startDate: 'Jul 2025',
        endDate: 'Dec 2025',
        emphasis: true,
        summary:
          'Cut deployment time 70% at a $42B+ AUM growth equity firm by automating infrastructure provisioning in Python, Bash and Azure CLI, reclaiming 12 engineer-hours per week from manual runbooks.',
        highlights: [
          'Diagnosed international server connectivity failures through firewall and routing configuration alongside the firm’s lead architect, inside a security-compliant private equity environment',
          'Provisioned 50+ company-issued devices into the firm’s zero-trust endpoint stack (Zscaler, Proofpoint, ThreatLocker), maintaining hybrid fleet compliance in Jamf Pro and NinjaOne',
          'Cut 4 hours per deal review by shipping AI extraction and summarization into the deal spreadsheet workflow, owned end to end from pitch to production as the intern project',
          'Reduced query latency 30% with a Python and SQL service that deduplicated redundant datasets and rewrote the calculation pipelines reading from them',
        ],
        skills: ['Python', 'Bash', 'Azure CLI', 'SQL', 'Jamf Pro'],
      },
      {
        company: 'Whalley Computer Associates',
        companyUrl: 'https://www.wca.com/',
        logo: '/assets/logos/whalley-computer-associates.png',
        role: 'Network Engineer Intern',
        location: 'Southwick, MA',
        startDate: 'Jun 2023',
        endDate: 'Aug 2024',
        summary:
          'Configured hundreds of Cisco switches per rollout with a Python script parameterized for each site’s requirements, replacing switch-by-switch CLI work across state agency and municipal deployments.',
        highlights: [
          'Cut inter-site latency 35% by migrating government sites off 1990s Cat 3 cabling to Cat 8 and replacing the switch hardware behind it',
          'Set up firewall policy, BGP peering and IP addressing at each site, standardizing configuration that had drifted into a different security posture per location',
        ],
        skills: ['Cisco', 'Python', 'BGP', 'Firewalls'],
      },
    ],
    education: [
      {
        school: 'Northeastern University',
        logo: '/assets/logos/northeastern-university.png',
        logoOnDark: true,
        degree:
          'B.S. Computer Science & Business Administration · Concentration in Corporate Innovation',
        dates: 'Dec 2027 (expected) · Boston, MA',
        honors:
          '1st place among 250+ participants, 2026 Microsoft x Northeastern AI Hackathon (AI Builder Blitz)',
        coursework: [
          'Financial Management',
          'CS 4535, the capstone behind the Pawtograder role',
        ],
        activities: [
          'President of the Polish Club (previously VP of the Polish Students Association)',
          'Wrestling',
          'NU AI Club',
        ],
      },
    ],
    skills: [
      {
        category: 'Languages',
        items: [
          'Python',
          'TypeScript',
          'JavaScript',
          'Java',
          'C++',
          'C',
          'Rust',
          'Swift',
          'SQL',
          'Bash',
          'Racket',
          'Liquid',
          'HTML/CSS',
        ],
      },
      {
        category: 'Frameworks & AI',
        items: [
          'React',
          'Next.js',
          'Node.js',
          'Express',
          'FastAPI',
          'Django',
          'Angular',
          'SwiftUI',
          'React Native',
          'LLM APIs',
          'Claude tool use',
          'RAG',
        ],
      },
      {
        category: 'GPU & distributed',
        items: [
          'PyTorch distributed',
          'NCCL',
          'RCCL',
          'Triton',
          'CUDA streams',
          'ROCm',
          'UCX',
          'RDMA / libibverbs (in development)',
          'Slurm',
        ],
      },
      {
        category: 'Infrastructure',
        items: [
          'Git',
          'Linux',
          'Docker',
          'PostgreSQL',
          'Supabase',
          'MongoDB',
          'Azure CLI',
          'GitHub Actions',
          'OpenTelemetry',
          'Prometheus',
          'Grafana',
        ],
      },
      {
        category: 'Networking',
        items: [
          'TCP/IP',
          'BGP',
          'VLANs',
          'Routing & switching',
          'ACLs',
          'Firewall policy',
          'DNS',
        ],
      },
    ],
    projects: [
      {
        name: 'Artemis and GPUBridge',
        featured: true,
        blurb:
          'Two systems for mixed-vendor GPU training. GPUBridge is an open-source PyTorch backend that joins NVIDIA and AMD GPUs in one job, each on its native NCCL or RCCL. It cut a 1 GB cross-vendor all-reduce 2.7x with fp8 compression. Artemis, in development, times the collectives every rank already runs, flags the GPU, link or host that regressed and can rebalance work across the GPUs the job already has.',
        href: 'https://davidczartoryski.com/Artemis/',
        repo: 'https://github.com/DavidCzartoryski/gpubridge',
        role: 'Founder',
        tech: [
          'PyTorch',
          'NCCL',
          'RCCL',
          'Triton',
          'CUDA',
          'ROCm',
          'C',
          'Rust',
          'libibverbs',
          'Slurm',
        ],
      },
      {
        name: 'EternalTap',
        venture: true,
        blurb:
          'His own venture under Hercules Holdings, not a Sideband product. A wallet-native fare platform for universities and transit agencies: it verifies rider eligibility against a university roster, prices MBTA fare rules and issues a signed Apple Wallet pass. He wrote the eligibility engine across 9 MBTA reduced and free fare categories, the rider web app and the native SwiftUI app, and reports a conditional contract covering 22,000+ riders.',
        role: 'Built with a cofounder',
        tech: [
          'Next.js',
          'TypeScript',
          'Prisma',
          'Postgres',
          'Swift',
          'SwiftUI',
          'Apple Wallet',
        ],
      },
      {
        name: 'CrediMax',
        venture: true,
        blurb:
          'His own venture under Hercules Holdings, outside Sideband. Aggregates your credit cards through Plaid and tells you which one to tap at checkout. Built solo end to end: a SwiftUI app with widgets, Live Activities and an Apple Watch complication, a FastAPI and Postgres backend on Plaid’s production environment, and a Claude advisor grounded in card and transfer-partner data.',
        href: 'https://credimax.app/',
        role: 'Solo',
        tech: [
          'Swift',
          'SwiftUI',
          'WidgetKit',
          'FastAPI',
          'Postgres',
          'Plaid',
          'Claude',
          'Stripe',
        ],
      },
      {
        name: 'The creative engine',
        venture: true,
        blurb:
          'His own venture under Hercules Holdings, outside Sideband: the software behind his commerce brands. An autonomous storefront builder regenerates each shop and tunes it against live sales, and an ad creative pipeline takes production from days to 6 minutes by his account. He reports $180K in revenue across the brands.',
        tech: [
          'Python',
          'FastAPI',
          'React',
          'Pillow',
          'Claude',
          'Higgsfield MCP',
          'Shopify',
          'Liquid',
          'Meta CAPI',
        ],
      },
      {
        name: 'HuskyClaw',
        blurb:
          'An agentic assistant for Northeastern students. Text it a task and it plans the work across registration, coursework and recruiting, with every real-world action behind the student’s approval. Won 1st place among 250+ participants at Microsoft’s AI Builder Blitz and is in beta with student testers.',
        href: 'https://whoisaldo.github.io/huskyclaw-demo/',
        role: 'Co-founder',
        tech: ['Claude', 'Agents', 'Human-in-the-loop'],
      },
      {
        name: 'inbox-triage',
        blurb:
          'A Python agent that runs a student’s job hunt from the inbox. It flags assessments, interviews and offers, files bulk mail by moving it rather than deleting, puts interviews on the calendar and tailors a one-page résumé on request.',
        href: 'https://github.com/DavidCzartoryski/inbox-triage',
        source: true,
        repo: 'https://github.com/DavidCzartoryski/inbox-triage',
        tech: [
          'Python',
          'Claude',
          'Claude Code',
          'AppleScript',
          'IMAP',
          'GitHub Actions',
        ],
      },
      {
        name: 'SixthDegree',
        blurb:
          'A local-first Claude agent on macOS that builds a private graph of everyone you know from Contacts, iMessage, LinkedIn exports and dictated notes, finds the shortest chain of people to whoever you need to reach, and drafts the first text. The source is private.',
        tech: ['Python', 'Claude', 'SQLite', 'FastAPI', 'Pydantic'],
      },
      {
        name: 'CookYourBooks',
        blurb:
          'A Java object-oriented programming group project at Northeastern.',
        tech: ['Java'],
      },
    ],
    portfolio: {
      url: 'https://davidczartoryski.com',
      summary:
        'A travel portfolio set as a passport. A boarding pass asks how you would like to board, then a theme song, an alarm-clock intro and a scroll-driven WebGL night flight carry you past his flight log, ventures, wrestling and photos from 23 countries. A recruiter view puts the résumé on one quiet page under a starfield, and Artemis has a product site of its own.',
      pages: [
        {
          label: 'Boarding pass',
          url: 'https://davidczartoryski.com/',
          ...capture('david-czartoryski', 'portfolio'),
        },
        {
          label: 'Passport',
          url: 'https://davidczartoryski.com/?intro=off',
          ...capture('david-czartoryski', 'portfolio-passport'),
        },
        {
          label: 'Recruiter view',
          url: 'https://davidczartoryski.com/recruiter/',
          ...capture('david-czartoryski', 'portfolio-recruiter'),
        },
        {
          label: 'Artemis',
          url: 'https://davidczartoryski.com/Artemis/',
          ...capture('david-czartoryski', 'portfolio-artemis'),
        },
      ],
    },
    contact: {
      email: 'czartoryski.d@northeastern.edu',
      github: 'https://github.com/DavidCzartoryski',
      linkedin: 'https://www.linkedin.com/in/david-czartoryski/',
      website: 'https://davidczartoryski.com',
      instagram: 'https://www.instagram.com/dczar.ski/',
      tiktok: 'https://www.tiktok.com/@dczar.ski',
      resume: 'https://davidczartoryski.com/resume/DavidCzartoryski_Resume.pdf',
      location: 'Boston, MA',
    },
  },
]

export function listEngineers(): Engineer[] {
  return engineers
}

export function getEngineerById(id: string): Engineer | undefined {
  return engineers.find((e) => e.id === id)
}

export function getOtherEngineer(currentId: string): Engineer | undefined {
  const i = engineers.findIndex((e) => e.id === currentId)
  if (i === -1) return undefined
  return engineers[(i + 1) % engineers.length]
}

/** 1-based position of an engineer, zero-padded — e.g. "01". */
export function engineerIndexLabel(id: string): string {
  const i = engineers.findIndex((e) => e.id === id)
  return String(i + 1).padStart(2, '0')
}

/** Total engineer count, zero-padded — e.g. "02". */
export const engineerCountLabel = String(engineers.length).padStart(2, '0')
