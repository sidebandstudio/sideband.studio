# Ali Younes

**Co-Founder & Lead Engineer · Sideband**

> Full-stack engineer focused on systems programming, low-latency streaming, and shipping products that respect the user.

---

## TL;DR

- **SDE Intern at AWS CloudFormation** · Seattle, WA · Jun 2026 – Sep 2026 (current)
- Previously **SDE Co-op at Philips** (System Integration) · Cambridge, MA · Jan 2026 – Jun 2026
- CS + Political Science at **Northeastern University** (Class of 2027, GPA 3.5+)
- Co-founder of Sideband, independent software studio
- Based in **Boston, MA**. In **Seattle, WA** for the AWS internship through Sep 2026

---

## Tagline

Software Engineer architecting scalable enterprise infrastructure. Goes deep where it counts: DXGI capture pipelines, hardware H.264, Metal rendering, UEFI Secure Boot, IAM-style policy evaluation, DynamoDB hot paths.

---

## Experience

### Amazon Web Services · SDE Intern, AWS CloudFormation *(Current)*

**Seattle, WA · Jun 2026 – Sep 2026**

Owned the team’s highest-priority feature end-to-end on the **CloudFormation Registry**, a tier-1 AWS control plane: org-wide policy-based sharing of private resource types, retiring a re-registration pattern that had cloned a single type into 8,000+ accounts across 8 regions.

- Delivered the low-level design ahead of the standard intern schedule, then shipped it in production Java across 12 merged code reviews: 2 new APIs, a DynamoDB table and DAO, and an IAM-style policy evaluator with deny-by-default semantics
- Cut hot-path DynamoDB cost by reordering type resolution so a strongly consistent, uncached read fires only on true misses instead of ~90% of DescribeType traffic. Redesigned pagination to bound work, not results
- Unblocked the team’s stalled beta pipeline with a same-day infrastructure fix
- Built a dual-model AI code-review tool (GPT + Claude), presented org-wide and featured on Kiro’s official LinkedIn

*Stack:* AWS · CloudFormation · Java · DynamoDB · IAM · AWS Organizations · IaC

---

### Philips · SDE Co-op, System Integration

**Cambridge, MA · Jan 2026 – Jun 2026**

Pitched, architected, and shipped a **zero-touch PXE mass-deployment platform** end-to-end across a ~1,000-machine fleet of HP Engage Flex Pro systems for Philips’ FDA-regulated PIC iX patient monitoring infrastructure, replacing a fully manual USB/file-share imaging workflow. Presented the architecture to 50+ engineers and stakeholders.

- Designed a UEFI Secure Boot PXE chain on Microsoft-signed bootmgfw.efi, eliminating per-machine console interaction and custom signing key enrollment while preserving Secure Boot enforcement per PIC iX compliance
- Stood up the FOG/TFTP server on Ubuntu 24.04 (dnsmasq proxyDHCP, tftpd-hpa) and built a PowerShell WinPE orchestrator with a FastAPI service for MAC-keyed host config, secrets, and live deployment status
- Contributed to the VM lifecycle platform (FastAPI, React/TypeScript, PostgreSQL) automating provisioning across Nutanix and VMware vSphere, plus Windows guest post-provisioning over PsExec/WinRM and a PowerShell metrics pipeline

*Stack:* PowerShell · Python · FastAPI · C#/.NET · PostgreSQL · Ubuntu · PXE/TFTP · UEFI Secure Boot · WinPE · Nutanix · VMware vSphere

---

### Top Choice Realty · Frontend Developer Intern

**New York, NY · Apr 2024 – Aug 2024**

Engineered and launched a full-stack client-management web app (React, Python, SQL) for 20+ office staff and 800+ records. Cut client lookup 85% (5+ minutes to 45 seconds), eliminated 90% of IT support tickets with self-serve access, and added caching for 3× faster queries.

*Stack:* React · Python · SQL · Full-Stack · Database Optimization

---

### Robert DeFalco Realty · Computer Technician Intern

**New York, NY · Jun 2023 – Sep 2023**

Multi-location IT support across 3+ offices. Configured 15+ systems, resolved 25+ issues, maintained 95%+ uptime.

---

## Education

**Northeastern University** · B.S. Computer Science & Political Science
*Expected May 2027 · GPA 3.5+ · Co-op Program*

Coursework: Algorithms & Data Structures · Object-Oriented Design · Artificial Intelligence · Database Design.

Activities: Northeastern Wrestling · Powerlifting Club · Arab Student Association.

---

## Skills

**Languages:** TypeScript · JavaScript · Java · C++ · C# · Python · Rust · Swift · SQL (PostgreSQL) · PowerShell · Bash

**Frontend:** React 19 · SwiftUI · Next.js 14 · Vite · Tailwind CSS · Material-UI · Framer Motion

**Backend & Systems:** Node.js · Express · FastAPI · .NET · SQLAlchemy / Alembic · Pydantic · MongoDB · PostgreSQL · Linux (Ubuntu)

**Cloud & Infrastructure:** AWS CloudFormation · DynamoDB · IAM · AWS Organizations · IaC · Nutanix · VMware vSphere · UEFI Secure Boot · PXE / TFTP · WinPE · PsExec / WinRM

**Platforms:** DXGI · H.264 (NVENC / AMF / QSV) · VideoToolbox · Metal · UDP streaming · HealthKit · Gemini 2.0 Flash

**Tooling:** Git / GitHub · Docker · CI/CD · Jest / JUnit

---

## Featured Projects

- **[EternalMonitor](/products/eternal-monitor)** · Low-latency iPad-as-second-display. Rust Windows host captures via DXGI, hardware-encodes H.264 (NVENC / AMF / QSV), and streams over UDP. Swift iPad client decodes with VideoToolbox and renders with Metal. Ships a one-click signed installer with a virtual extended-display driver.
- **[Exerly Fitness](/products/exerly)** · Cross-platform fitness app with 50+ users. SwiftUI iOS client (HealthKit sync, barcode scanning) and React 19 / TypeScript dashboard over a shared Express API on MongoDB Atlas. Gemini 2.0 Flash coach for workout plans and progress analysis.
- **[EternalRichPresence](/products/eternal-rich-presence)** · Windows tray daemon bridging Apple Music / Spotify to Discord Rich Presence. Live cover art, portable .exe.
- **[Signature Cuts 413](/products/signature-cuts)** · Static Next.js site with SMS / WhatsApp deep-link booking. Built free for a local barbershop in Chicopee, MA.
- **Moops** · MERN social reading platform (1M+ books via Google Books API, JWT auth, friend system). https://moopsbooks.com
- **Real-Time Face Analytics** · 100% client-side facial recognition (TensorFlow.js + face-api.js). Multi-face detection, 7-emotion classification, age + gender estimation.

---

## Contact

- **Primary email:** younes.al@northeastern.edu
- **Personal email:** whois.younes@gmail.com
- **Business email:** hello@sideband.studio
- **GitHub:** https://github.com/whoisaldo
- **LinkedIn:** https://www.linkedin.com/in/alialdoyounes/
- **Website:** https://aliyounes.dev
- **Resume:** [/assets/engineers/ali-younes/resume.pdf](/assets/engineers/ali-younes/resume.pdf)

---

## Off Duty

Drives a supercharged Audi S4 (B8.5, 540 whp). Top-3 powerlifter in MA high school. Cyberpunk 2077 + Mr Robot fan. Spends weekends in Claude Code building agentic workflows.
