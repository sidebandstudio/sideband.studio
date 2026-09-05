import Button from '@/components/ui/Button'
import {
  ArrowUpRightIcon,
  CheckIcon,
  GitHubIcon,
  RepoIcon,
} from '@/components/ui/Icons'
import { products } from '@/lib/products'

const REPOS = [
  ...products.flatMap((p) =>
    p.github
      ? [
          {
            id: p.id,
            href: p.github,
            path: p.github.replace('https://github.com/', ''),
            lang: p.tags[0],
            live: p.status === 'LIVE',
          },
        ]
      : [],
  ),
  // The site you are reading is public too.
  {
    id: 'site',
    href: 'https://github.com/sidebandstudio/sideband.studio',
    path: 'sidebandstudio/sideband.studio',
    lang: 'Next.js',
    live: true,
  },
]

const LIVE = products.filter((p) => p.status === 'LIVE').length

const PITCH = [
  ['Read the code.', 'The repos are public, issues and all.'],
  ['File an issue.', 'Bugs and ideas go straight to the people who wrote it.'],
  ['Follow along.', 'Watch a repo and see each release as it lands.'],
]

export default function OpenSource() {
  return (
    <section id="open-source" className="sec">
      <div className="inner">
        <div className="section-head mx-auto text-center">
          <span className="eyebrow">Open source</span>
          <h2 className="display mx-auto text-balance">
            Everything we ship ends up on GitHub.
          </h2>
        </div>

        <div className="open-grid">
          <div className="tile">
            <div className="flex items-center gap-1.5 border-b border-sideband-border bg-white/[0.02] px-3.5 py-2.5">
              <i className="block h-2.5 w-2.5 rounded-full bg-white/[0.08]" />
              <i className="block h-2.5 w-2.5 rounded-full bg-white/[0.08]" />
              <i className="block h-2.5 w-2.5 rounded-full bg-white/[0.08]" />
              <span className="ml-2.5 flex-1 text-center font-mono text-[11px] text-sideband-muted">
                github.com
              </span>
            </div>
            <ul className="-mt-px">
              {REPOS.map((r) => (
                <li key={r.id}>
                  <a
                    href={r.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="repo-row group"
                  >
                    <RepoIcon className="shrink-0 text-sideband-muted" />
                    <span className="min-w-0 flex-1 truncate font-mono text-[13px] text-sideband-text">
                      {r.path}
                    </span>
                    <span className="hidden shrink-0 font-mono text-[11px] text-sideband-muted min-[480px]:inline">
                      {r.lang}
                    </span>
                    <span
                      className={`block h-1.5 w-1.5 shrink-0 rounded-full ${
                        r.live ? 'bg-sideband-ok' : 'bg-sideband-warn'
                      }`}
                      aria-label={r.live ? 'Live' : 'In development'}
                      role="img"
                    />
                    <ArrowUpRightIcon className="product-arrow shrink-0 text-sideband-text-secondary" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="tile open-pitch">
            <ul className="flex flex-col gap-4">
              {PITCH.map(([lead, rest]) => (
                <li
                  key={lead}
                  className="flex items-start gap-3 text-[15px] leading-[1.5] text-sideband-text-secondary"
                >
                  <span className="pitch-mark" aria-hidden="true">
                    <CheckIcon size={13} />
                  </span>
                  <span>
                    <strong className="font-semibold text-sideband-text">
                      {lead}
                    </strong>{' '}
                    {rest}
                  </span>
                </li>
              ))}
            </ul>

            <div className="flex flex-col gap-[18px]">
              <div className="flex items-center gap-2 font-mono text-[11px] text-sideband-muted">
                <span>{REPOS.length} public repos</span>
                <span aria-hidden="true">&middot;</span>
                <span>{LIVE} live products</span>
              </div>
              <div className="flex flex-wrap items-center gap-4">
                <Button href="https://github.com/sidebandstudio" external>
                  <GitHubIcon size={14} />
                  Sideband on GitHub
                </Button>
                <a
                  href="mailto:hello@sideband.studio"
                  className="group inline-flex items-center gap-1.5 text-[13px] font-medium text-sideband-text-secondary transition-colors duration-[180ms] hover:text-sideband-text"
                >
                  hello@sideband.studio
                  <ArrowUpRightIcon
                    size={12}
                    className="opacity-60 transition-[transform,opacity] duration-[180ms] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100"
                  />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
