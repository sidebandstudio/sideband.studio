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
      'Full-stack engineer focused on systems programming, low-latency streaming, and shipping products that respect the user.',
    longBio: [
      'Ali architects scalable enterprise infrastructure and ships products end-to-end. CS & Political Science at Northeastern University, previously SDE Co-op at Philips in Cambridge, MA, and currently an SDE Intern on AWS CloudFormation in Seattle, where he shipped org-wide policy-based sharing of private resource types on the CloudFormation Registry, a tier-1 AWS control plane.',
      'He goes deep where it counts: DXGI capture pipelines, hardware H.264, Metal rendering, UEFI Secure Boot, IAM-style policy evaluation, DynamoDB hot paths.',
    ],
    portrait: {
      src: '/assets/engineers/ali-younes/portrait.jpg',
      width: 1200,
      height: 1500,
    },
    accentColor: '#A855F7',
    prev: [
      {
        label: 'AMAZON',
        sublabel: 'AWS CLOUDFORMATION · SDE INTERN · CURRENT',
      },
      { label: 'PHILIPS', sublabel: 'SDE CO-OP · CAMBRIDGE, MA' },
      { label: 'NORTHEASTERN', sublabel: 'CS + POLI-SCI · CLASS OF 27' },
    ],
    experience: [
      {
        company: 'Amazon Web Services',
        logo: '/assets/logos/aws.png',
        role: 'SDE Intern · AWS CloudFormation',
        location: 'Seattle, WA',
        startDate: 'Jun 2026',
        endDate: 'Sep 2026',
        current: true,
        emphasis: true,
        summary:
          'Owned the team’s highest-priority feature end-to-end on the CloudFormation Registry, a tier-1 AWS control plane: org-wide policy-based sharing of private resource types, retiring a re-registration pattern that had cloned a single type into 8,000+ accounts across 8 regions.',
        highlights: [
          'Delivered the low-level design ahead of the standard intern schedule, then shipped it in production Java across 12 merged code reviews: 2 new APIs, a DynamoDB table and DAO, and an IAM-style policy evaluator with deny-by-default semantics',
          'Cut hot-path DynamoDB cost by reordering type resolution so a strongly consistent, uncached read fires only on true misses instead of ~90% of DescribeType traffic. Redesigned pagination to bound work, not results',
          'Unblocked the team’s stalled beta pipeline with a same-day infrastructure fix',
          'Built a dual-model AI code-review tool (GPT + Claude), presented org-wide and featured on Kiro’s official LinkedIn',
        ],
        skills: [
          'AWS',
          'CloudFormation',
          'Java',
          'DynamoDB',
          'IAM',
          'AWS Organizations',
          'IaC',
        ],
      },
      {
        company: 'Sideband',
        role: 'Co-Founder & Lead Engineer',
        location: 'Boston, MA',
        startDate: '2025',
        endDate: 'Present',
        current: true,
        emphasis: true,
        summary:
          'Founded the studio and ships its products end-to-end: Rust/Swift streaming, SwiftUI on iOS, and the Next.js surfaces around them.',
        skills: [
          'Rust',
          'Swift',
          'TypeScript',
          'Next.js',
          'Node.js',
          'Studio Ops',
        ],
      },
      {
        company: 'Philips',
        logo: '/assets/logos/philips.png',
        role: 'SDE Co-op · System Integration',
        location: 'Cambridge, MA',
        startDate: 'Jan 2026',
        endDate: 'Jun 2026',
        emphasis: true,
        summary:
          'Pitched, architected, and shipped a zero-touch PXE mass-deployment platform end-to-end across a ~1,000-machine fleet of HP Engage Flex Pro systems for Philips’ FDA-regulated PIC iX patient monitoring infrastructure, replacing a fully manual USB/file-share imaging workflow. Presented the architecture to 50+ engineers and stakeholders.',
        highlights: [
          'Designed a UEFI Secure Boot PXE chain on Microsoft-signed bootmgfw.efi, eliminating per-machine console interaction and custom signing key enrollment while preserving Secure Boot enforcement per PIC iX compliance',
          'Stood up the FOG/TFTP server on Ubuntu 24.04 (dnsmasq proxyDHCP, tftpd-hpa) and built a PowerShell WinPE orchestrator with a FastAPI service for MAC-keyed host config, secrets, and live deployment status',
          'Contributed to the VM lifecycle platform (FastAPI, React/TypeScript, PostgreSQL) automating provisioning across Nutanix and VMware vSphere, plus Windows guest post-provisioning over PsExec/WinRM and a PowerShell metrics pipeline',
        ],
        skills: [
          'PowerShell',
          'Python',
          'FastAPI',
          'C#/.NET',
          'PostgreSQL',
          'Ubuntu',
          'PXE/TFTP',
          'UEFI Secure Boot',
          'WinPE',
          'Nutanix',
          'VMware vSphere',
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
          'Engineered and launched a full-stack client-management web app (React, Python, SQL) for 20+ office staff and 800+ records. Cut client lookup 85% (5+ minutes to 45 seconds), eliminated 90% of IT support tickets with self-serve access, and added caching for 3× faster queries.',
        skills: [
          'React',
          'Python',
          'SQL',
          'Full-Stack',
          'Database Optimization',
        ],
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
        dates: 'Expected May 2027',
        honors: 'GPA 3.5+ · Co-op Program',
      },
    ],
    skills: [
      {
        category: 'Languages',
        items: [
          'TypeScript',
          'JavaScript',
          'Java',
          'C++',
          'C#',
          'Python',
          'Rust',
          'Swift',
          'SQL (PostgreSQL)',
          'PowerShell',
          'Bash',
        ],
      },
      {
        category: 'Frontend',
        items: [
          'React 19',
          'SwiftUI',
          'Next.js 14',
          'Vite',
          'Tailwind CSS',
          'Material-UI',
          'Framer Motion',
        ],
      },
      {
        category: 'Backend & Systems',
        items: [
          'Node.js',
          'Express',
          'FastAPI',
          '.NET',
          'SQLAlchemy / Alembic',
          'Pydantic',
          'MongoDB',
          'PostgreSQL',
          'Linux (Ubuntu)',
        ],
      },
      {
        category: 'Cloud & Infrastructure',
        items: [
          'AWS CloudFormation',
          'DynamoDB',
          'IAM',
          'AWS Organizations',
          'IaC',
          'Nutanix',
          'VMware vSphere',
          'UEFI Secure Boot',
          'PXE / TFTP',
          'WinPE',
          'PsExec / WinRM',
        ],
      },
      {
        category: 'Platforms',
        items: [
          'DXGI · H.264 (NVENC / AMF / QSV)',
          'VideoToolbox · Metal',
          'UDP streaming',
          'HealthKit',
          'Gemini 2.0 Flash',
        ],
      },
      {
        category: 'Tooling',
        items: ['Git / GitHub', 'Docker', 'CI/CD', 'Jest / JUnit'],
      },
    ],
    projects: [
      {
        name: 'EternalMonitor',
        blurb:
          'Low-latency iPad-as-second-display. Rust Windows host captures via DXGI, hardware-encodes H.264 (NVENC / AMF / QSV), and streams over UDP. Swift iPad client decodes with VideoToolbox and renders with Metal. Ships a one-click signed installer with a virtual extended-display driver.',
        href: '/products/eternal-monitor',
        internal: true,
        tech: [
          'Rust',
          'Swift',
          'DXGI',
          'H.264',
          'VideoToolbox',
          'Metal',
          'UDP',
        ],
      },
      {
        name: 'Exerly Fitness',
        blurb:
          'Cross-platform fitness app with 50+ users. SwiftUI iOS client (HealthKit sync, barcode scanning) and React 19 / TypeScript dashboard over a shared Express API on MongoDB Atlas. Gemini 2.0 Flash coach for workout plans and progress analysis.',
        href: '/products/exerly',
        internal: true,
        tech: [
          'SwiftUI',
          'React 19',
          'TypeScript',
          'Node',
          'MongoDB',
          'Gemini AI',
        ],
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
          'MERN social reading platform: 1M+ books via Google Books API, JWT auth, friend system. Live.',
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
    role: 'Co-Founder · Full-Stack Engineer',
    shortBio:
      'CS @ Northeastern. Co-founder of Sideband. Web Application Developer at MIT Lincoln Laboratory. Builds production software end-to-end.',
    longBio: [
      'Ali Tleis is a co-founder of Sideband, the studio shipping six products across desktop, browser, and full-stack. Computer Science at Northeastern University via the co-op program (2024–2028).',
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
        company: 'Sideband',
        role: 'Co-Founder',
        location: 'Boston, MA',
        startDate: '2025',
        endDate: 'Present',
        current: true,
        emphasis: true,
        summary:
          'Co-founded the dev studio shipping six products across desktop, browser, and full-stack. Combines Next.js / Node web surfaces with Python / Lua / FFmpeg media pipelines.',
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
        skills: [
          'React',
          'TypeScript',
          'Node.js',
          'MongoDB',
          'JWT Auth',
          'RBAC',
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
        items: [
          'React',
          'Next.js',
          'Node.js',
          'TypeScript',
          'MongoDB',
          'Tailwind CSS',
          'Git',
        ],
      },
      {
        category: 'Languages',
        items: [
          'TypeScript',
          'JavaScript',
          'Python',
          'Java',
          'C++',
          'C#',
          'Lua',
          'Kotlin',
        ],
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
        items: [
          'Azure DevOps',
          'Heroku',
          'Arduino',
          'Gemini API',
          'LLM Integration',
        ],
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
  {
    id: 'karan-anand',
    name: 'Karan Anand',
    initials: 'KA',
    role: 'Co-Founder & Systems Design Engineer',
    shortBio:
      'Systems design engineer and co-founder of Staged, an AI-powered resume builder. Ships quality solutions without compromising on time.',
    longBio: [
      'Karan is a Computer Science student at the University of Manitoba and joined Sideband as its third co-founder, focused on systems design: architecture that holds up under real constraints, not just on paper.',
      'He previously co-founded and built Staged, an AI-powered resume builder with live preview, PDF export, and Claude-powered content generation, owning full-stack development, Stripe subscription billing, and Instagram-led user acquisition. He treats time and quality as the same problem: the right design up front is what makes both possible at once, rather than trading one for the other. Off the clock he is usually locked into Valorant, grinding a Monster Hunter boss, or watching basketball.',
    ],
    portrait: {
      src: '/assets/engineers/karan-anand/portrait.jpg',
      width: 1086,
      height: 1448,
    },
    accentColor: '#10B981',
    prev: [
      {
        label: 'SIDEBAND',
        sublabel: 'CO-FOUNDER · SYSTEMS DESIGN · CURRENT',
      },
      { label: 'STAGED', sublabel: 'CO-FOUNDER & DEVELOPER' },
      { label: 'UNIVERSITY OF MANITOBA', sublabel: 'CS · IN PROGRESS' },
    ],
    experience: [
      {
        company: 'Sideband',
        role: 'Co-Founder & Systems Design Engineer',
        location: 'Winnipeg, MB (Remote)',
        startDate: '2026',
        endDate: 'Present',
        current: true,
        emphasis: true,
        summary:
          'Joined as the studio’s third co-founder, bringing a systems design discipline to the product lineup: architecture and technical planning that holds up under real constraints.',
        skills: ['Systems Design', 'Architecture', 'TypeScript', 'Studio Ops'],
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
          'Co-founded and built an AI-powered resume builder with live preview, PDF export, and Claude-powered content generation. Owned full-stack development and Stripe subscription billing, and ran an Instagram page for user acquisition.',
        skills: ['TypeScript', 'React', 'Supabase', 'Stripe', 'Claude API'],
      },
      {
        company: 'University of Manitoba',
        logo: '/assets/logos/university-of-manitoba.png',
        logoOnDark: true,
        role: 'B.S. Computer Science',
        location: 'Winnipeg, MB',
        startDate: '2022',
        endDate: 'Expected 2029',
        current: true,
        summary:
          'Studying Computer Science while co-founding and shipping production software at Sideband and Staged.',
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
        blurb:
          'AI-powered resume builder, co-founded and built. Live preview, PDF export, Claude-powered bullet polish, summary generation, job-description optimization, and Stripe subscription billing.',
        href: 'https://resume-builder-drab-sigma.vercel.app',
        tech: ['TypeScript', 'Supabase', 'Stripe', 'Claude API'],
      },
      {
        name: 'Exercise Tracker',
        blurb:
          'Fitness tracking app with user profiles, an activity feed, and route logging, persisted to JSON.',
        href: 'https://github.com/Karan4248/Exercise-Tracker',
        source: true,
        tech: ['Java', 'Maven', 'JUnit', 'JSON'],
      },
      {
        name: 'Food Ordering System',
        blurb:
          'Group-built food ordering platform, contributed the domain model and shopping cart logic.',
        href: 'https://github.com/minhkhoily29/Food-Ordering-System',
        source: true,
        tech: ['Java', 'JavaScript'],
      },
      {
        name: 'Personal Portfolio',
        blurb:
          'Personal site and project archive, built from scratch with React.',
        href: 'https://karan4248.github.io/Portfolio/',
        tech: ['React', 'JavaScript', 'CSS'],
      },
    ],
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
    role: 'Co-Founder',
    shortBio: 'Fourth co-founder. Full dossier in progress.',
    longBio: ['WIP'],
    accentColor: '#F59E0B',
    prev: [{ label: 'SIDEBAND', sublabel: 'CO-FOUNDER · CURRENT' }],
    contact: {
      email: 'hello@sideband.studio',
      github: 'https://github.com/naman0r',
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
