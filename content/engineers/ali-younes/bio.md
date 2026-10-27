# Ali Younes

**Founding Engineer · Sideband**

> "I like to work with deeply architected systems. Most of my work tends to revolve around automating, but I usually just kinda build a solution to anything really. My favorite areas are systems, infrastructure, AI tooling and backend."

Portfolio: https://aliyounes.dev · GitHub: [@whoisaldo](https://github.com/whoisaldo)

---

## In his words

- "Hi! I'm Ali, or you can call me Aldo. I'm a fourth year studying computer science and political science at Northeastern University in Boston."
- "The work I did at Philips and AWS is what I've enjoyed the most so far."
- "I write systems software, iOS apps, and the web front-ends that sit on top of them. Most of what is on this site exists because something I wanted did not do what I asked, or cost too much."
- "I over-engineer, and I keep the result intuitive. Whoever is using it should never have to know what is underneath."
- "It started at 12. I scripted other people's Roblox games, got paid in Robux, and cashed it out through DevEx for gaming PC parts my family could not have bought me."
- On Sideband: "I started it because I want somewhere younger engineers can get mentoring for free as I get better at this."
- On EternalMonitor: "I refused to pay $40 for an iPad-as-second-display app that lagged. So I wrote my own."

---

## Now

- **Incoming:** Software Development Engineer, Amazon Dedicated Cloud (ADC), starting July 2027
- **Philips:** SDE Co-op, System Integration, back part-time since Aug 2026
- **Pinnatec Auto:** Lead Full Stack Engineer (part-time) on Virtual Link, since Sep 2026
- **Pawtograder:** Backend Engineer on the grading server, since Aug 2026
- **Sideband:** Founding engineer
- Based in **Boston, MA**

---

## Experience

### Pinnatec Auto · Lead Full Stack Engineer (Part-time)

**Worcester, MA · Sep 2026 – Present**

Lead maintainer and code owner of Virtual Link, Pinnatec's app-controlled lowering module: an Expo/React Native app, a WordPress/PHP backend and ESP32 firmware.

- Owns Virtual Link, serving 1,000+ users, as lead maintainer on a 3-person team: 41 pull requests merged across the app, the backend and the firmware
- Stood up CI from zero for both repositories. GitHub Actions verify 7 firmware-to-app contracts, typecheck, lint and test the app on every PR, and build and size-check both firmware images. Branch rulesets require every check.

### Pawtograder · Backend Engineer, Grading Server

**Boston, MA · Aug 2026 – Present**

Owns the grading server of Northeastern's open-source autograder, in production for the university's CS courses, with two other students on a team of eleven. The scoring algorithm turns build, lint, test and pitest mutation results into grades. Submissions run through a TypeScript GitHub Action in the student's repository and report back to Deno edge functions on Supabase, authenticated per submission with a GitHub OIDC token.

### Amazon Web Services · SDE Intern, AWS CloudFormation

**Seattle, WA · Jun 2026 – Sep 2026**

Owned the team's highest-priority feature end to end on the CloudFormation Registry, a tier-1 AWS control plane: org-wide policy-based sharing of private resource types. It retired a re-registration pattern that had cloned a single resource type into 8,000+ accounts across 8 regions.

- Shipped it in production Java across 12 merged code reviews: 2 new APIs, a DynamoDB table and DAO, and an IAM-style policy evaluator with deny-by-default semantics
- Cut hot-path DynamoDB cost on ~90% of DescribeType traffic by reordering type resolution so a strongly consistent, uncached read fires only on true misses
- Built a native Kiro tool for dual-model AI code review (GPT + Claude), used across AWS CloudFormation by 100+ people and featured on Kiro's official LinkedIn
- Built a Slack bot whose LLM agent on AWS Bedrock took 15+ handoff tickets per on-call cycle through final review and staging
- Ended a 2-day beta pipeline stall with a same-day fix to an unowned infrastructure defect

### Philips · SDE Co-op, System Integration

**Cambridge, MA · Jan 2026 – Jun 2026, part-time since Aug 2026**

Pitched, architected and shipped a zero-touch PXE deployment platform for a ~1,000-machine fleet in Philips' FDA-regulated Patient Monitoring business, which monitors 600M+ patients a year. In production since Apr 2026 and used by 50+ engineers to test high-priority builds.

- Stood up the FOG/TFTP server on Ubuntu 24.04 (dnsmasq proxyDHCP, tftpd-hpa) and built a PowerShell WinPE orchestrator with a FastAPI service for MAC-keyed host config, secrets and live deployment status
- Kept UEFI Secure Boot enforced with zero per-machine keypresses by PXE-booting Microsoft-signed bootmgfw.efi, with a .NET shim that left the vendor installer unmodified
- Wrote the Windows guest post-provisioning layer and a JSON-driven environment-validation pipeline on an internal VM deployment platform

He wrote up the Secure Boot work in [Zero-touch Windows deployment with Secure Boot still on](https://aliyounes.dev/blog/zero-touch-secure-boot).

### Sideband · Founding Engineer

**Boston, MA · 2025 – Present**

Founding engineer of the studio, which began in Boston in 2025 as Eternal Reverse. It started as two people and is five founding engineers now. Wrote the Rust host and SwiftUI client behind EternalMonitor, the SwiftUI iOS app and Node API behind Exerly Fitness, and most of the studio site.

### Top Choice Realty · Frontend Developer Intern

**New York, NY · Apr 2024 – Aug 2024**

Built and launched a full-stack client-management web app (React, Python, SQL) for 20+ office staff. Cut client lookup time 85% (5+ minutes to 45 seconds), cut IT support tickets 90% with self-serve access to 800+ records, and added caching for 3x faster queries.

### Robert DeFalco Realty · Computer Technician Intern

**New York, NY · Jun 2023 – Sep 2023**

On-site IT support across three offices. Configured 15+ machines on Windows, macOS and Linux, resolved 25+ issues and kept 95%+ uptime.

---

## Education

**Northeastern University** · B.S. Computer Science & Political Science (combined major)
_2023 – May 2027 (expected) · Co-op program_

Coursework: Data Structures & Algorithms · Object-Oriented Design · Systems Programming · Database Management · Computer Networks

---

## Projects

- **[EternalMonitor](/products/eternal-monitor)** · iPad as a second display for Windows, mirrored or extended, over Wi-Fi or USB. Rust host and SwiftUI client with hardware H.264 encode and decode end to end.
- **[Exerly Fitness](/products/exerly)** · React 19 web app, Node/Express API, an AI coach, and a native SwiftUI iOS client waiting on App Store review.
- **[EternalRichPresence](/products/eternal-rich-presence)** · Windows tray app that puts Apple Music and Spotify on your Discord profile, with a Listen Along feature built on raw named pipes.
- **[Signature Cuts 413](/products/signature-cuts)** · Marketing and booking site for a Chicopee barbershop, built free of charge.
- **[Fade Empire](/products/fade-empire)** · Booking site for a Chicopee barbershop with race-safe Postgres booking, and an iPhone app for its barbers in testing on TestFlight.
- **[EternalExchange](/products/eternal-exchange)** · A 39K-line Minecraft alchemy mod for Fabric 1.21.1 with a recipe-graph solver that prices every item at world load. Written up in [Porting ProjectE to Fabric](https://aliyounes.dev/blog/porting-projecte-to-fabric).
- **[hushtype](/products/hushtype)** · Menu bar dictation app for the Mac, built on the open-source Handy. Hold Option-Space, speak and release, and the text is pasted at the cursor.
- **[Moops Bookstore](https://moopsbooks.com)** · Social reading tracker with shelves, reviews, clubs and a streak counter.
- **[Real-Time Face Analytics](https://whoisaldo.github.io/real-time-face-analytics/)** · Face, emotion, age and gender detection entirely in the browser with TensorFlow.js.

Other work:

- **[BetterAppleMusic](https://github.com/whoisaldo/BetterAppleMusic)** · Windows Apple Music client on Electron and MusicKit JS.
- **[Top Choice Realty](/products/top-choice-realty)** · Listings site and agent back office for a New York brokerage. Visitors browse listings and message the listing agent, and agents manage listings, sales and customers.
- **[CS3520 · C++](https://github.com/whoisaldo/CS3520-Summer-2025)** · Course work: nested containers, Makefiles, GDB and CLI formatting.
- **[Password Generator](https://github.com/whoisaldo/Password-Generator)** · Configurable password generator with a Swing desktop UI and export.
- **[Grade Calculator](https://github.com/whoisaldo/Grade-Calculator)** · Weighted grade calculator with a simple desktop UI.
- **[Lua-Roblox-Commands](https://github.com/whoisaldo/Lua-Roblox-Commands)** · Quick utility commands for Roblox game development.

---

## Skills

**Languages:** TypeScript · JavaScript · Python · SQL · Java · C++ · C# · Rust · Swift · PowerShell · Bash · Go

**Frontend:** React · React Native (Expo) · Next.js · Tailwind CSS · Framer Motion

**Backend:** Node.js · Express · FastAPI · Postgres · MongoDB · Deno · Supabase · PHP · .NET

**Systems:** Rust · C++ · ESP32 · DXGI · Metal · VideoToolbox · H.264

**Cloud & Infra:** AWS (CloudFormation, DynamoDB, IAM) · Linux · Docker · GitHub Actions · CI/CD

**AI:** OpenAI SDK · Claude SDK · MCP · Ollama · AWS Bedrock

**Agents:** Kiro · Codex · Claude Code · OpenCode · Windsurf · T3 Code · Cursor Bugbot · CodeRabbit

---

## Contact

- **Email:** aldo@sideband.studio
- **Studio:** hello@sideband.studio
- **GitHub:** https://github.com/whoisaldo
- **LinkedIn:** https://www.linkedin.com/in/alialdoyounes/
- **X:** https://x.com/whoisaldooo
- **Website:** https://aliyounes.dev
- **Resume:** [/assets/engineers/ali-younes/resume.pdf](/assets/engineers/ali-younes/resume.pdf)

---

## Off duty

The S6 runs its 4.0 twin-turbo V8 on a Stage 1 Integrated Engineering tune, and the 328xi also got a cold air intake. "Cars, phones, breadboards. If it has screws in it I have probably had it open." He placed third in Massachusetts in high school wrestling, and his sumo robot won first place in a computer engineering course.
