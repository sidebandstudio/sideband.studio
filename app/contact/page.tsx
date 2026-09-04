'use client'

import { useState } from 'react'
import FadeUp from '@/components/animations/FadeUp'
import Button from '@/components/ui/Button'

type Status = 'idle' | 'submitting' | 'success' | 'error'

export default function ContactPage() {
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    message: '',
  })
  const [status, setStatus] = useState<Status>('idle')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus('submitting')

    try {
      const res = await fetch('https://formspree.io/f/xkoperoj', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(formState),
      })

      if (res.ok) {
        setStatus('success')
        setFormState({ name: '', email: '', message: '' })
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-sideband-black px-6 pt-32 pb-24">
      <div className="w-full max-w-xl">
        {/* Hero */}
        <FadeUp>
          <span className="font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-sideband-muted">
            Contact
          </span>
          <h1 className="display mt-3.5 text-[clamp(40px,6vw,72px)]">
            Let&apos;s <em>build.</em>
          </h1>
        </FadeUp>

        {/* Contact Info */}
        <FadeUp delay={0.1}>
          <div className="mt-10 space-y-3">
            <a
              href="mailto:hello@sideband.studio"
              className="flex items-center gap-3 font-mono text-[14px] text-sideband-text-secondary transition-colors duration-200 hover:text-sideband-text"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="shrink-0"
              >
                <rect x="2" y="4" width="20" height="16" rx="2" />
                <path d="M22 7l-10 7L2 7" />
              </svg>
              hello@sideband.studio
            </a>
            <a
              href="https://github.com/sidebandstudio"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 font-mono text-[14px] text-sideband-text-secondary transition-colors duration-200 hover:text-sideband-text"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="shrink-0"
              >
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
              github.com/sidebandstudio
            </a>
          </div>
        </FadeUp>

        {/* Contact Form */}
        <FadeUp delay={0.2}>
          {status === 'success' ? (
            <div className="mt-12 rounded-[10px] border border-sideband-border-strong bg-sideband-surface px-6 py-8 font-mono text-[14px] text-sideband-text">
              <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-sideband-muted">
                Message sent
              </p>
              <p className="mt-2 font-sans text-[15px] text-sideband-text-secondary">
                Thanks for reaching out, we&apos;ll get back to you soon.
              </p>
              <button
                onClick={() => setStatus('idle')}
                className="mt-4 font-sans text-[14px] font-medium text-sideband-text underline decoration-sideband-hairline underline-offset-4 transition-colors hover:decoration-sideband-text"
              >
                Send another
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-12 space-y-6">
              <div>
                <label
                  htmlFor="name"
                  className="mb-2 block font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-sideband-muted"
                >
                  Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={formState.name}
                  onChange={(e) =>
                    setFormState({ ...formState, name: e.target.value })
                  }
                  className="w-full rounded-[10px] border border-sideband-border bg-sideband-surface px-4 py-3 text-[15px] text-sideband-text transition-colors duration-200 placeholder:text-sideband-muted focus:border-sideband-border-strong focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sideband-accent"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-sideband-muted"
                >
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formState.email}
                  onChange={(e) =>
                    setFormState({ ...formState, email: e.target.value })
                  }
                  className="w-full rounded-[10px] border border-sideband-border bg-sideband-surface px-4 py-3 text-[15px] text-sideband-text transition-colors duration-200 placeholder:text-sideband-muted focus:border-sideband-border-strong focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sideband-accent"
                  placeholder="you@example.com"
                />
              </div>
              <div>
                <label
                  htmlFor="message"
                  className="mb-2 block font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-sideband-muted"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={5}
                  value={formState.message}
                  onChange={(e) =>
                    setFormState({ ...formState, message: e.target.value })
                  }
                  className="w-full resize-none rounded-[10px] border border-sideband-border bg-sideband-surface px-4 py-3 text-[15px] text-sideband-text transition-colors duration-200 placeholder:text-sideband-muted focus:border-sideband-border-strong focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sideband-accent"
                  placeholder="What are you working on?"
                />
              </div>

              {status === 'error' && (
                <p role="alert" className="text-[14px] text-sideband-accent-2">
                  Something went wrong. Please try again.
                </p>
              )}

              <Button variant="filled" disabled={status === 'submitting'}>
                {status === 'submitting' ? 'Sending...' : 'Send Message'}
              </Button>
            </form>
          )}
        </FadeUp>
      </div>
    </div>
  )
}
