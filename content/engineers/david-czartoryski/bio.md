# David Czartoryski

**Founding Engineer · Sideband**

> "The work that actually pulls me in is making things faster."

Portfolio: https://davidczartoryski.com · GitHub: [@DavidCzartoryski](https://github.com/DavidCzartoryski)

---

## In his words

- "I build AI infrastructure, distributed systems, and the products around them."
- "The work that actually pulls me in is making things faster. Load balancing, cutting latency, runtime, and cost: profiling a system until the bottleneck shows itself, then optimizing the code around it."
- On GPU clusters: "A training cluster only moves as fast as its slowest GPU."
- On wrestling: "Cutting weight teaches you to ship on a deadline. Six minutes on the mat teaches you that preparation is the whole game."
- "Between flights I am usually eating something I cannot pronounce yet, trying to pronounce it anyway, and filming the attempt."

---

## Now

- **Founding Engineer at Sideband** since Oct 2026
- **AI Infrastructure Researcher, Northeastern University HPC Research Lab** since Oct 2026, on the Explorer cluster at MGHPCC
- **Software Engineer, Pawtograder** since Sep 2026
- **Founder & CEO, Hercules Holdings**, his own venture studio outside Sideband, since 2024
- B.S. Computer Science & Business Administration at **Northeastern University**, concentration in Corporate Innovation, expected Dec 2027
- Open to new-grad software engineering roles starting after December 2027, private equity and venture roles, and front-office finance
- Based in **Boston, MA**, with home bases in San Francisco and Warsaw too

---

## Experience

### Sideband · Founding Engineer

**Boston, MA · Oct 2026 – Present**

Joined the studio in October 2026 as its fifth founding engineer.

### Northeastern University HPC Research Lab · AI Infrastructure Researcher

**Boston, MA · MGHPCC · Oct 2026 – Present**

- Develops GPUBridge and a runtime GPU straggler detector and workload rebalancer on Northeastern's Explorer cluster at the Massachusetts Green High Performance Computing Center (MGHPCC). The projects began independently and led to this research role.
- Owns the work across distributed communication, GPU kernels, statistical diagnosis and native Rust execution
- Evaluates changes with hardware benchmarks, reference-based differential tests and fault injection, preserving numerical behavior and asynchronous resource lifetimes

### Pawtograder · Software Engineer

**Boston, MA · Sep 2026 – Present**

- Operates a production coding and grading platform serving 5,000+ weekly active users across ten Northeastern CS courses, as one of 15 engineers on a subteam of four that owns one service end to end
- Set up telemetry for the Next.js and Supabase platform with OpenTelemetry, exporting metrics to Prometheus and visualizing them in Grafana dashboards
- Raised survey error-text contrast from 3.98:1 to 5.06:1 after finding 2 WCAG 1.4.3 failures the CI accessibility gate excluded, and extended the axe-core sweep to 40 routes, scanned mid-interaction
- Measured the CI accessibility gate's recall across 82 axe-core scans with 8 seeded defects. It caught 1 of 8.
- Traced 2 test suites crashing on import to a missing jsdom global, exposing 5 real failures in the LLM-hint rate-limiting tests and a CI config that gated only 2 test files
- A capstone with Prof. Jon Bell

### Hercules Holdings · Founder & CEO

**Boston, MA · 2024 – Present**

His own venture studio and holding company, separate from Sideband. It is behind his govtech fare platform, his consumer fintech app and the AI tooling for his commerce brands, and by his account it has had employees and interns. The figures below are his own, from https://davidczartoryski.com/#cargo and https://davidczartoryski.com/recruiter/.

- **EternalTap** (his venture, not a Sideband product): a wallet-native fare platform for universities and transit agencies, built with a cofounder. He reports a conditional contract covering 22,000+ riders.
- **CrediMax** ([credimax.app](https://credimax.app/)): aggregates credit cards through Plaid and surfaces the best card at checkout. He says he negotiated seed terms with venture firms and senior American Express leadership, then walked away from the round.
- **The creative engine**: an autonomous storefront builder and an ad creative pipeline for his commerce brands. He reports $180K in revenue across the brands and ad production cut from days to 6 minutes.

### Mosaiq Software · Full-Stack Software Engineer

**Boston, MA · Jan 2026 – May 2026**

- Cut update latency to 120 ms by replacing a 5-second polling loop with a WebSocket transport
- Moved the React frontend and Node/Express backend onto shared TypeScript API contracts in a monorepo package, so a breaking change fails the compiler instead of reaching production

### Summit Partners · DevOps Engineer Co-op

**Menlo Park, CA · Jul 2025 – Dec 2025**

- Cut deployment time 70% at a $42B+ AUM growth equity firm by automating infrastructure provisioning in Python, Bash and Azure CLI, reclaiming 12 engineer-hours per week
- Diagnosed international server connectivity failures through firewall and routing configuration alongside the firm's lead architect
- Provisioned 50+ company-issued devices into the firm's zero-trust endpoint stack (Zscaler, Proofpoint, ThreatLocker), with fleet compliance in Jamf Pro and NinjaOne
- Cut 4 hours per deal review by shipping AI extraction and summarization into the deal spreadsheet workflow
- Reduced query latency 30% with a Python and SQL service that deduplicated redundant datasets

### Whalley Computer Associates · Network Engineer Intern

**Southwick, MA · Jun 2023 – Aug 2024**

- Configured hundreds of Cisco switches per rollout with a Python script parameterized for each site
- Cut inter-site latency 35% by migrating government sites off 1990s Cat 3 cabling to Cat 8 and replacing the switch hardware behind it
- Set up firewall policy, BGP peering and IP addressing at each site

---

## Education

**Northeastern University**, Boston, MA. B.S. Computer Science & Business Administration, concentration in Corporate Innovation. Expected Dec 2027.

- 1st place among 250+ participants at the 2026 Microsoft x Northeastern AI Hackathon (AI Builder Blitz) with HuskyClaw
- Coursework includes Financial Management and CS 4535, the capstone behind the Pawtograder role
- President of the Polish Club (previously VP of the Polish Students Association), wrestling at Northeastern, NU AI Club

---

## Projects

- **Artemis and GPUBridge** · [GPUBridge](https://github.com/DavidCzartoryski/gpubridge) is an open-source PyTorch backend that joins NVIDIA and AMD GPUs in one training job. It cut a 1 GB cross-vendor all-reduce 2.7x with fp8 compression. [Artemis](https://davidczartoryski.com/Artemis/), in development, finds the GPU, link or host that slowed a running job and can rebalance work.
- **EternalTap** · his own Hercules Holdings venture, not a Sideband product. Wallet-native transit fare platform, built with a cofounder. Sold to universities and agencies, so there is no public site.
- **CrediMax** · his own Hercules Holdings venture. [credimax.app](https://credimax.app/). Tells you which card to tap at checkout. Built solo.
- **The creative engine** · his own Hercules Holdings venture: storefront builder and ad creative pipeline for his commerce brands
- **HuskyClaw** · agentic assistant for Northeastern students, 1st place at AI Builder Blitz. [20-second demo](https://whoisaldo.github.io/huskyclaw-demo/).
- **inbox-triage** · [repo](https://github.com/DavidCzartoryski/inbox-triage). An email agent for students job-hunting. It never deletes.
- **SixthDegree** · local-first Claude agent that maps who you know. Private.
- **CookYourBooks** · Java object-oriented programming group project

---

## Off Duty

Wrestling (Massachusetts state champion more than once in high school, still wrestling at Northeastern) · travel, 23 countries · fashion · food · photography · cars · chess · fitness. Speaks English, Polish and Russian.

---

## Contact

- Email: czartoryski.d@northeastern.edu
- LinkedIn: https://www.linkedin.com/in/david-czartoryski/
- Instagram and TikTok: @dczar.ski
- Résumé: https://davidczartoryski.com/resume/DavidCzartoryski_Resume.pdf
