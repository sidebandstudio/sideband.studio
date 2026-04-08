'use client'

import { useState } from 'react'
import FadeUp from '@/components/animations/FadeUp'
import GlowButton from '@/components/ui/GlowButton'

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
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
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
    <div className="flex min-h-screen items-center justify-center bg-eternal-black px-6 pt-32 pb-24">
      <div className="w-full max-w-xl">
        {/* Hero */}
        <FadeUp>
          <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-eternal-accent">
            [ CONTACT ]
          </span>
          <h1 className="mt-4 font-display text-5xl text-eternal-text md:text-7xl">
            Let&apos;s build<span className="text-eternal-accent">.</span>
          </h1>
        </FadeUp>

        {/* Contact Info */}
        <FadeUp delay={0.1}>
          <div className="mt-10 space-y-3">
            <a
              href="mailto:hello@eternalreverse.com"
              className="flex items-center gap-3 font-mono text-[14px] text-eternal-text-secondary transition-colors duration-200 hover:text-eternal-accent"
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
              hello@eternalreverse.com
            </a>
            <a
              href="https://github.com/whoisaldo"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 font-mono text-[14px] text-eternal-text-secondary transition-colors duration-200 hover:text-eternal-accent"
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
              github.com/whoisaldo
            </a>
            <a
              href="https://linkedin.com/in/ali-younes-41a2b4296"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 font-mono text-[14px] text-eternal-text-secondary transition-colors duration-200 hover:text-eternal-accent"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="shrink-0"
              >
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
              linkedin.com/in/ali-younes-41a2b4296
            </a>
          </div>
        </FadeUp>

        {/* Contact Form */}
        <FadeUp delay={0.2}>
          {status === 'success' ? (
            <div className="mt-12 border border-eternal-accent bg-eternal-surface px-6 py-8 font-mono text-[14px] text-eternal-accent">
              <p className="text-[11px] uppercase tracking-wider">[ MESSAGE SENT ]</p>
              <p className="mt-2 text-eternal-text-secondary">
                Thanks for reaching out — I&apos;ll get back to you soon.
              </p>
              <button
                onClick={() => setStatus('idle')}
                className="mt-4 text-[11px] uppercase tracking-wider text-eternal-accent underline underline-offset-4 transition-opacity hover:opacity-70"
              >
                Send another
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-12 space-y-6">
              <div>
                <label
                  htmlFor="name"
                  className="mb-2 block font-mono text-[11px] uppercase tracking-wider text-eternal-text-secondary"
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
                  className="w-full border border-eternal-border bg-eternal-surface px-4 py-3 font-mono text-[14px] text-eternal-text outline-none transition-colors duration-200 placeholder:text-eternal-muted focus:border-eternal-accent"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block font-mono text-[11px] uppercase tracking-wider text-eternal-text-secondary"
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
                  className="w-full border border-eternal-border bg-eternal-surface px-4 py-3 font-mono text-[14px] text-eternal-text outline-none transition-colors duration-200 placeholder:text-eternal-muted focus:border-eternal-accent"
                  placeholder="you@example.com"
                />
              </div>
              <div>
                <label
                  htmlFor="message"
                  className="mb-2 block font-mono text-[11px] uppercase tracking-wider text-eternal-text-secondary"
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
                  className="w-full resize-none border border-eternal-border bg-eternal-surface px-4 py-3 font-mono text-[14px] text-eternal-text outline-none transition-colors duration-200 placeholder:text-eternal-muted focus:border-eternal-accent"
                  placeholder="What are you working on?"
                />
              </div>

              {status === 'error' && (
                <p className="font-mono text-[11px] uppercase tracking-wider text-red-500">
                  Something went wrong — please try again.
                </p>
              )}

              <GlowButton variant="filled" disabled={status === 'submitting'}>
                {status === 'submitting' ? 'Sending...' : 'Send Message'}
              </GlowButton>
            </form>
          )}
        </FadeUp>
      </div>
    </div>
  )
}
