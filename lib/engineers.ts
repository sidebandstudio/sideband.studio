export interface ExperienceEntry {
  company: string
  /** Optional company mark. Falls back to a monogram when absent. */
  logo?: string
  /** Mark is already drawn for dark UI — render it as-is, don't recolor. */
  logoOnDark?: boolean
  role: string
  location: string
  startDate: string
  endDate: string
  current?: boolean
  upcoming?: boolean
  emphasis?: boolean
  summary: string
  highlights?: string[]
  skills?: string[]
}

export interface EducationEntry {
  school: string
  degree: string
  dates: string
  honors?: string
}

export interface SkillGroup {
  category: string
  items: string[]
}

export interface FeaturedProject {
  name: string
  blurb: string
  href: string
  internal?: boolean
  /** Links to source rather than a live deployment. */
  source?: boolean
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
  email: string
  github?: string
  linkedin?: string
  website?: string
  resume?: string
  location?: string
}

export interface Engineer {
  id: string
  name: string
  initials: string
  role: string
  shortBio: string
  longBio: string[]
  portrait?: {
    src: string
    width: number
    height: number
  }
  portraitPlaceholder?: string
  prev?: PrevBadgeEntry[]
  experience?: ExperienceEntry[]
  education?: EducationEntry[]
  skills?: SkillGroup[]
  projects?: FeaturedProject[]
  lifestyle?: LifestyleImage[]
  contact: EngineerContact
  accentColor: string
}

export const engineers: Engineer[] = [
  {
    id: 'ali-younes',
    name: 'Ali Younes',
    initials: 'AY',
    role: 'Co-Founder & Lead Engineer',
    shortBio:
      'Full-stack engineer obsessed with systems programming, low-latency streaming, and shipping products that respect the user.',
    longBio: [
      'Ali architects scalable enterprise infrastructure and ships products end-to-end. CS & Political Science at Northeastern University, previously SWE Co-op at Philips in Cambridge, MA — and currently an SDE Intern on AWS CloudFormation in Seattle.',
      'He goes deep where it counts: DXGI capture pipelines, hardware H.264, Metal rendering, UEFI Secure Boot, distributed systems. He stays indie because independence is what lets him build software the way it should be built — fast, honest, and obsessively refined.',
    ],
    portrait: {
      src: '/assets/engineers/ali-younes/portrait.jpg',
      width: 1200,
      height: 1500,
    },
    accentColor: '#A855F7',
    prev: [
      { label: 'AMAZON', sublabel: 'AWS CLOUDFORMATION · SDE INTERN · CURRENT' },
      { label: 'PHILIPS', sublabel: 'SWE CO-OP · CAMBRIDGE, MA' },
      { label: 'NORTHEASTERN', sublabel: 'CS + POLI-SCI · CLASS OF 27' },
    ],
    experience: [
      {
        company: 'Amazon Web Services',
        logo: '/assets/logos/aws.png',
        role: 'SDE Intern · CloudFormation (IaC)',
        location: 'Seattle, WA',
        startDate: 'Jun 2026',
        endDate: 'Sep 2026',
        current: true,
        emphasis: true,
        summary:
          'Infrastructure-as-code work on AWS CloudFormation. Full service-ownership project scope under Principal/Senior SDE mentorship.',
        skills: ['AWS', 'CloudFormation', 'IaC', 'Python', 'Java', 'Go', 'Linux'],
      },
      {
        company: 'Eternal Reverse',
        logo: '/assets/EternalReverse/EternalReverse.png',
        logoOnDark: true,
        role: 'Co-Founder & Lead Engineer',
        location: 'Boston, MA',
        startDate: '2025',
        endDate: 'Present',
        current: true,
        emphasis: true,
        summary:
          'Founded the studio and ships its products end-to-end — Rust/Swift streaming, SwiftUI on iOS, and the Next.js surfaces around them.',
        skills: ['Rust', 'Swift', 'TypeScript', 'Next.js', 'Node.js', 'Studio Ops'],
      },
      {
        company: 'Philips',
        logo: '/assets/logos/philips.png',
        role: 'Software Engineering Co-op',
        location: 'Cambridge, MA',
        startDate: 'Jul 2025',
        endDate: 'May 2026',
        emphasis: true,
        summary:
          'Shipped zero-touch PXE deployment for ~1,000 medical-device Windows machines under FDA-regulated UEFI Secure Boot. Solo project ownership; presented architecture to 50+ engineers.',
        highlights: [
          'Replaced ~1,000 technician-touches per refresh cycle with a fully automated deployment workflow',
          'Contributed to the VM Deployment Manager — post-provisioning automation + metrics pipeline',
          'Authored UEFI Secure Boot / WinPE / BCD pipeline that survives FDA validation',
        ],
        skills: [
          'PowerShell',
          'C#/.NET',
          'Python',
          'FastAPI',
          'Ubuntu',
          'PXE/TFTP',
          'UEFI Secure Boot',
          'WinPE',
          'Nutanix',
          'VMware',
        ],
      },
      {
        company: 'Top Choice Realty',
        logo: '/assets/logos/top-choice-realty.png',
        logoOnDark: true,
        role: 'Frontend Developer Intern',
        location: 'New York, NY',
        startDate: 'Apr 2024',
        endDate: 'Aug 2024',
        summary:
          'Full-stack client-management app serving 20+ agents and 800+ records. Cut record lookup from 5+ minutes to 45 seconds (85% faster), 3× query speed, 90% fewer IT tickets.',
        skills: ['React', 'Python', 'SQL', 'Full-Stack', 'Database Optimization'],
      },
      {
        company: 'Robert DeFalco Realty',
        logo: '/assets/logos/robert-defalco-realty.png',
        logoOnDark: true,
        role: 'Computer Technician Intern',
        location: 'New York, NY',
        startDate: 'Jun 2023',
        endDate: 'Sep 2023',
        summary:
          'Multi-location IT support across 3+ offices. Configured 15+ systems, resolved 25+ issues, maintained 95%+ uptime.',
      },
    ],
    education: [
      {
        school: 'Northeastern University',
        degree: 'B.S. Computer Science & Political Science',
        dates: 'Expected 2027',
        honors: 'GPA 3.5+ · Co-op Program',
      },
    ],
    skills: [
      {
        category: 'Languages',
        items: [
          'TypeScript',
          'JavaScript',
          'C++',
          'C# / .NET',
          'Python',
          'Rust',
          'Swift / SwiftUI',
          'Go',
        ],
      },
      {
        category: 'Frontend',
        items: ['React 19', 'Next.js 14', 'Tailwind CSS', 'Framer Motion'],
      },
      {
        category: 'Backend & Systems',
        items: ['Node.js', 'Express', 'MongoDB', 'SQLite', 'Linux', 'PowerShell'],
      },
      {
        category: 'Cloud & Infrastructure',
        items: [
          'AWS',
          'IaC (CDK / CloudFormation)',
          'UEFI Secure Boot',
          'PXE / TFTP',
          'DevOps',
        ],
      },
      {
        category: 'Platforms',
        items: [
          'DXGI · H.264',
          'VideoToolbox · Metal',
          'HealthKit',
          'Gemini 2.0 Flash',
          'Microservices',
        ],
      },
    ],
    projects: [
      {
        name: 'EternalMonitor',
        blurb:
          'Rust host + SwiftUI iPad client for low-latency wireless desktop streaming. Hardware H.264, Metal render, mDNS zero-config.',
        href: '/products/eternal-monitor',
        internal: true,
        tech: ['Rust', 'Swift', 'DXGI', 'VideoToolbox', 'Metal'],
      },
      {
        name: 'Exerly Fitness',
        blurb:
          'Cross-platform fitness ecosystem. SwiftUI + HealthKit on iOS, React 19 on web, shared Express API, Gemini 2.0 coach.',
        href: '/products/exerly',
        internal: true,
        tech: ['SwiftUI', 'React 19', 'Node', 'Gemini AI'],
      },
      {
        name: 'EternalRichPresence',
        blurb:
          'Windows tray daemon that bridges Apple Music / Spotify to Discord Rich Presence. Live cover art, portable .exe.',
        href: '/products/eternal-rich-presence',
        internal: true,
        tech: ['Python', 'SMTC', 'pypresence'],
      },
      {
        name: 'Signature Cuts 413',
        blurb:
          'Static Next.js site with SMS / WhatsApp deep-link booking. Built free for a local barbershop in Chicopee, MA.',
        href: '/products/signature-cuts',
        internal: true,
        tech: ['Next.js', 'Tailwind', 'Static Export'],
      },
      {
        name: 'Moops',
        blurb:
          'MERN social reading platform — 1M+ books via Google Books API, JWT auth, friend system. Live.',
        href: 'https://moopsbooks.com',
        tech: ['MongoDB', 'Express', 'React', 'Node'],
      },
      {
        name: 'Real-Time Face Analytics',
        blurb:
          '100% client-side facial recognition. Multi-face detection, 7-emotion classification, age + gender estimation. Zero cloud.',
        href: 'https://whoisaldo.github.io/real-time-face-analytics/',
        tech: ['TensorFlow.js', 'face-api.js'],
      },
    ],
    lifestyle: [
      {
        src: '/assets/engineers/ali-younes/lifestyle/image1.jpg',
        alt: 'Ali Younes standing on a city street at golden hour',
      },
      {
        src: '/assets/engineers/ali-younes/lifestyle/bmw-tuning.jpg',
        alt: 'Engine bay of a supercharged Audi S4 mid-tune',
        caption: 'AUDI S4 · B8.5 · 540 WHP',
      },
      {
        src: '/assets/engineers/ali-younes/lifestyle/bmw-module.jpg',
        alt: 'Tuning module hardware',
        caption: 'TUNING MODULE',
      },
      {
        src: '/assets/engineers/ali-younes/lifestyle/carplay-retrofit.jpg',
        alt: 'CarPlay retrofit project',
        caption: 'CARPLAY RETROFIT',
      },
      {
        src: '/assets/engineers/ali-younes/lifestyle/sumo-bot.jpg',
        alt: 'Cornerstone engineering sumo wrestling bot',
        caption: 'SUMO BOT · CORNERSTONE',
      },
      {
        src: '/assets/engineers/ali-younes/lifestyle/computer-builds.jpg',
        alt: 'Personal computer builds',
        caption: 'PC BUILDS',
      },
      {
        src: '/assets/engineers/ali-younes/lifestyle/roblox-dev.jpg',
        alt: 'Roblox game development',
        caption: 'EARLY DAYS · ROBLOX DEV',
      },
      {
        src: '/assets/engineers/ali-younes/lifestyle/wrestling.jpg',
        alt: 'Powerlifting and wrestling',
        caption: 'TOP-3 MA HS POWERLIFTER',
      },
    ],
    contact: {
      email: 'younes.al@northeastern.edu',
      github: 'https://github.com/whoisaldo',
      linkedin: 'https://www.linkedin.com/in/alialdoyounes/',
      website: 'https://aliyounes.dev',
      resume: '/assets/engineers/ali-younes/resume.pdf',
      location: 'Seattle, WA (AWS) · Boston, MA',
    },
  },
  {
    id: 'ali-tleis',
    name: 'Ali Tleis',
    initials: 'AT',
    role: 'Co-Founder, Eternal Reverse · Full-Stack Engineer',
    shortBio:
      'CS @ Northeastern. Co-founder of Eternal Reverse. Web Application Developer at MIT Lincoln Laboratory. Builds production software end-to-end.',
    longBio: [
      'Ali Tleis is a co-founder of Eternal Reverse — the two-person studio shipping six products across desktop, browser, and full-stack. Computer Science at Northeastern University via the co-op program (2024–2028).',
      'Web Application Developer (AI Integration) at MIT Lincoln Laboratory, Jul–Dec 2026. Past frontend co-op at Top Choice Realty in Staten Island. His work spans Next.js / Node web surfaces and Python / Lua / FFmpeg media pipelines.',
    ],
    portrait: {
      src: '/assets/engineers/ali-tleis/portrait.jpg',
      width: 1179,
      height: 1375,
    },
    accentColor: '#6366F1',
    prev: [
      { label: 'MIT LINCOLN LAB', sublabel: 'WEB APP DEV · CURRENT' },
      { label: 'TOP CHOICE REALTY', sublabel: 'FRONTEND CO-OP · SUMMER 25' },
      { label: 'NORTHEASTERN', sublabel: 'CS · CLASS OF 28' },
    ],
    experience: [
      {
        company: 'MIT Lincoln Laboratory',
        logo: '/assets/logos/mit-lincoln-laboratory.png',
        role: 'Web Application Developer (AI Integration)',
        location: 'Lexington, MA',
        startDate: 'Jul 2026',
        endDate: 'Dec 2026',
        current: true,
        emphasis: true,
        summary:
          'Building AI-integrated internal web applications inside MIT’s federally funded R&D center.',
        skills: ['AI Integration', 'Web Apps', 'TypeScript', 'Node.js'],
      },
      {
        company: 'Eternal Reverse',
        logo: '/assets/EternalReverse/EternalReverse.png',
        logoOnDark: true,
        role: 'Co-Founder',
        location: 'Boston, MA',
        startDate: '2025',
        endDate: 'Present',
        current: true,
        emphasis: true,
        summary:
          'Co-founded the two-person dev studio shipping six products across desktop, browser, and full-stack. Combines Next.js / Node web surfaces with Python / Lua / FFmpeg media pipelines.',
        skills: ['Next.js', 'Node.js', 'Python', 'Lua', 'FFmpeg', 'Studio Ops'],
      },
      {
        company: 'Top Choice Realty',
        logo: '/assets/logos/top-choice-realty.png',
        logoOnDark: true,
        role: 'Frontend Developer Intern',
        location: 'Staten Island, NY',
        startDate: 'Jun 2025',
        endDate: 'Sep 2025',
        summary:
          'Full-stack work across UI patterns, schema integrity, and automation pipelines. Engineered JWT auth flows and role-based access control for the firm’s primary real-estate platform.',
        skills: ['React', 'TypeScript', 'Node.js', 'MongoDB', 'JWT Auth', 'RBAC'],
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
          'Workstation provisioning, automation scripting, and deployment standardization across 20+ systems.',
        skills: ['PowerShell', 'Automation', 'Deployment'],
      },
    ],
    education: [
      {
        school: 'Northeastern University',
        degree: 'B.S. Computer Science',
        dates: '2024 – 2028 · Boston, MA',
        honors: 'Co-op Program',
      },
    ],
    skills: [
      {
        category: 'Core Stack',
        items: ['React', 'Next.js', 'Node.js', 'TypeScript', 'MongoDB', 'Tailwind CSS', 'Git'],
      },
      {
        category: 'Languages',
        items: ['TypeScript', 'JavaScript', 'Python', 'Java', 'C++', 'C#', 'Lua', 'Kotlin'],
      },
      {
        category: 'Backend',
        items: ['Express', 'REST APIs', 'JWT Auth', 'Docker', 'Linux'],
      },
      {
        category: 'Media & Automation',
        items: ['OpenCV', 'FFmpeg', 'PowerShell', 'Python / Lua Pipelines'],
      },
      {
        category: 'Other',
        items: ['Azure DevOps', 'Heroku', 'Arduino', 'Gemini API', 'LLM Integration'],
      },
    ],
    projects: [
      {
        name: 'Eternal2x',
        blurb:
          'DaVinci Resolve smart upscale. Motion-aware upscaling automation using Python, Lua, OpenCV, and FFmpeg directly on the Resolve timeline.',
        href: '/products/eternal2x',
        internal: true,
        tech: ['Python', 'Lua', 'OpenCV', 'FFmpeg'],
      },
      {
        name: 'Eternal Summary',
        blurb:
          'Chrome MV3 extension for instant webpage summarization. Server-side proxying via Node / Express on Fly.io, Gemini API on the backend.',
        href: '/products/eternal-summary',
        internal: true,
        tech: ['Chrome MV3', 'Node', 'Express', 'Gemini API'],
      },
      {
        name: 'Top Choice Realty Platform',
        blurb:
          'Full-stack real-estate management with JWT auth and role-based access control. React / TypeScript frontend, Node.js / MongoDB backend.',
        href: 'https://topchoicerealtyny.com',
        tech: ['React', 'TypeScript', 'Node.js', 'MongoDB', 'JWT'],
      },
      {
        name: 'CalorieCalculator',
        blurb:
          'React-based responsive health calculator with strict, state-driven input validation. Designed so no invalid state can produce an output.',
        href: 'https://github.com/Alitleis123/CalorieCalculator',
        source: true,
        tech: ['React', 'TypeScript'],
      },
    ],
    contact: {
      email: 'tleis.a@northeastern.edu',
      github: 'https://github.com/Alitleis123',
      linkedin: 'https://www.linkedin.com/in/ali-tleis-091800247/',
      website: 'https://alitleis.dev',
      resume: '/assets/engineers/ali-tleis/resume.pdf',
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
