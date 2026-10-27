'use client'

import { useEffect, useRef, useState, type FormEvent } from 'react'
import Button from '@/components/ui/Button'
import { CheckIcon } from '@/components/ui/Icons'
import { cx } from '@/components/ui/cx'

const ENDPOINT = 'https://formspree.io/f/xkoperoj'
const STUDIO_EMAIL = 'hello@sideband.studio'

type Status = 'idle' | 'sending' | 'sent' | 'error'
type Field = 'name' | 'email' | 'message'
type Values = Record<Field, string>

const EMPTY: Values = { name: '', email: '', message: '' }
const MIN_MESSAGE = 10

function validate(values: Values): Partial<Record<Field, string>> {
  const errors: Partial<Record<Field, string>> = {}
  if (!values.name.trim()) errors.name = 'Enter your name.'
  if (!values.email.trim()) errors.email = 'Enter your email address.'
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim()))
    errors.email = 'Enter an email address like name@example.com.'
  if (values.message.trim().length < MIN_MESSAGE)
    errors.message = `Write at least ${MIN_MESSAGE} characters.`
  return errors
}

function mailto(values: Values) {
  const subject = encodeURIComponent(
    values.name.trim() ? `Message from ${values.name.trim()}` : 'Hello',
  )
  const body = encodeURIComponent(values.message)
  return `mailto:${STUDIO_EMAIL}?subject=${subject}&body=${body}`
}

const FIELD =
  'w-full rounded-inner border bg-sideband-surface-2 px-4 py-3 text-body text-sideband-text transition-colors duration-hover ease-standard placeholder:text-sideband-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-sideband-accent'

/**
 * The studio contact form. Posts JSON to Formspree, which forwards the
 * message to hello@sideband.studio. Validates before sending, and when the
 * request fails it offers the same message as an email instead.
 */
export default function ContactForm() {
  const [values, setValues] = useState<Values>(EMPTY)
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({})
  const [status, setStatus] = useState<Status>('idle')
  const [sentTo, setSentTo] = useState('')
  const refs = {
    name: useRef<HTMLInputElement>(null),
    email: useRef<HTMLInputElement>(null),
    message: useRef<HTMLTextAreaElement>(null),
  }
  const done = useRef<HTMLHeadingElement>(null)
  const [fallback, setFallback] = useState(mailto(EMPTY))

  // Move focus to the confirmation once it is on screen.
  useEffect(() => {
    if (status === 'sent') done.current?.focus()
  }, [status])

  const set = (field: Field, value: string) => {
    setValues((v) => ({ ...v, [field]: value }))
    if (errors[field]) setErrors((e) => ({ ...e, [field]: undefined }))
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const found = validate(values)
    setErrors(found)
    const firstBad = (['name', 'email', 'message'] as Field[]).find(
      (f) => found[f],
    )
    if (firstBad) {
      refs[firstBad].current?.focus()
      return
    }

    setStatus('sending')
    setFallback(mailto(values))
    const honeypot = (
      e.currentTarget.elements.namedItem('_gotcha') as HTMLInputElement | null
    )?.value
    try {
      const res = await fetch(ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          name: values.name.trim(),
          email: values.email.trim(),
          message: values.message.trim(),
          _subject: `Sideband contact form: ${values.name.trim()}`,
          ...(honeypot ? { _gotcha: honeypot } : {}),
        }),
      })
      if (!res.ok) throw new Error(String(res.status))
      setSentTo(values.email.trim())
      setValues(EMPTY)
      setStatus('sent')
    } catch {
      setStatus('error')
    }
  }

  if (status === 'sent') {
    return (
      <div
        role="status"
        className="rounded-panel bg-sideband-surface p-6 md:p-10"
      >
        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-sideband-surface-2 text-sideband-ok">
          <CheckIcon size={20} />
        </span>
        <h2
          ref={done}
          tabIndex={-1}
          className="mt-6 text-lead font-medium text-sideband-text outline-none"
        >
          Message sent
        </h2>
        <p className="mt-3 max-w-prose text-body text-sideband-text-secondary">
          Thanks for writing. Your message is on its way to the studio inbox,
          and any reply goes to{' '}
          <span className="text-sideband-text">{sentTo}</span>.
        </p>
        <div className="mt-8">
          <Button variant="secondary" onClick={() => setStatus('idle')}>
            Send another message
          </Button>
        </div>
      </div>
    )
  }

  const sending = status === 'sending'
  const describe = (f: Field, hint?: string) =>
    [errors[f] ? `${f}-error` : '', hint ?? ''].filter(Boolean).join(' ') ||
    undefined

  return (
    <form
      noValidate
      onSubmit={onSubmit}
      aria-labelledby="form-title"
      className="rounded-panel bg-sideband-surface p-6 md:p-10"
    >
      <h2 id="form-title" className="text-lead font-medium text-sideband-text">
        Send a message
      </h2>
      <p className="mt-2 text-small text-sideband-muted">
        Every field is required.
      </p>

      <div className="mt-8 grid gap-6 sm:grid-cols-2">
        <div>
          <label
            htmlFor="name"
            className="block text-small font-medium text-sideband-text"
          >
            Name
          </label>
          <input
            ref={refs.name}
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            required
            value={values.name}
            onChange={(e) => set('name', e.target.value)}
            aria-invalid={errors.name ? true : undefined}
            aria-describedby={describe('name')}
            className={cx(
              FIELD,
              'mt-2',
              errors.name ? 'border-sideband-danger' : 'border-sideband-border',
            )}
          />
          {errors.name && (
            <p id="name-error" className="mt-2 text-small text-sideband-danger">
              {errors.name}
            </p>
          )}
        </div>
        <div>
          <label
            htmlFor="email"
            className="block text-small font-medium text-sideband-text"
          >
            Email
          </label>
          <input
            ref={refs.email}
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            inputMode="email"
            required
            value={values.email}
            onChange={(e) => set('email', e.target.value)}
            aria-invalid={errors.email ? true : undefined}
            aria-describedby={describe('email')}
            className={cx(
              FIELD,
              'mt-2',
              errors.email
                ? 'border-sideband-danger'
                : 'border-sideband-border',
            )}
          />
          {errors.email && (
            <p
              id="email-error"
              className="mt-2 text-small text-sideband-danger"
            >
              {errors.email}
            </p>
          )}
        </div>
      </div>

      <div className="mt-6">
        <label
          htmlFor="message"
          className="block text-small font-medium text-sideband-text"
        >
          Message
        </label>
        <textarea
          ref={refs.message}
          id="message"
          name="message"
          required
          rows={6}
          minLength={MIN_MESSAGE}
          value={values.message}
          onChange={(e) => set('message', e.target.value)}
          aria-invalid={errors.message ? true : undefined}
          aria-describedby={describe('message', 'message-hint')}
          className={cx(
            FIELD,
            'mt-2 resize-y',
            errors.message
              ? 'border-sideband-danger'
              : 'border-sideband-border',
          )}
        />
        <p
          id="message-hint"
          className={cx(
            'mt-2 text-small',
            errors.message ? 'sr-only' : 'text-sideband-muted',
          )}
        >
          At least {MIN_MESSAGE} characters.
        </p>
        {errors.message && (
          <p
            id="message-error"
            className="mt-2 text-small text-sideband-danger"
          >
            {errors.message}
          </p>
        )}
      </div>

      {/* Formspree drops any submission that fills this in. */}
      <div aria-hidden="true" className="hidden">
        <label htmlFor="_gotcha">Leave this empty</label>
        <input
          id="_gotcha"
          name="_gotcha"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      {status === 'error' && (
        <div
          role="alert"
          className="mt-8 rounded-inner bg-sideband-surface-2 p-5 text-small"
        >
          <p className="font-medium text-sideband-danger">
            Something went wrong. Please try again.
          </p>
          <p className="mt-2 text-sideband-text-secondary">
            The form could not reach the studio inbox. Your message is still
            here, or you can{' '}
            <a
              href={fallback}
              className="text-sideband-text underline decoration-sideband-border-strong underline-offset-4 hover:decoration-sideband-text"
            >
              send it by email to {STUDIO_EMAIL}
            </a>
            .
          </p>
        </div>
      )}

      <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
        <Button type="submit" size="lg" disabled={sending}>
          {sending ? 'Sending…' : 'Send message'}
        </Button>
        <p aria-live="polite" className="text-small text-sideband-muted">
          {sending ? 'Sending your message' : ''}
        </p>
      </div>
    </form>
  )
}
