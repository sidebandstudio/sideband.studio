import type { Config } from 'tailwindcss'
import plugin from 'tailwindcss/plugin'

/**
 * Sideband colour tokens. This object is the single source of truth: Tailwind
 * gets the values as the `sideband-*` colour scale (so opacity modifiers like
 * `bg-sideband-black/80` work) and the plugin below writes the same values to
 * `--sideband-*` CSS variables for styles/globals.css and inline styles.
 * See DESIGN.md -> Colour.
 */
const sideband = {
  // Ground and the three surface steps above it.
  black: '#0b0b0d',
  surface: '#131316',
  'surface-2': '#1b1b1f',
  'surface-3': '#25252a',
  // Lines. Use sparingly: tone steps separate surfaces first.
  border: 'rgba(255, 255, 255, 0.08)',
  'border-strong': 'rgba(255, 255, 255, 0.14)',
  hairline: '#2c2c33',
  // Ink.
  text: '#f3f2ef',
  'text-secondary': '#bdbcc4',
  muted: '#8f8e98',
  // Brand. Accent is the mark's upper band, violet its lower band.
  accent: '#f931ab',
  'accent-hover': '#ff5cbe',
  'accent-ink': '#1a0611',
  'accent-dim': 'rgba(249, 49, 171, 0.14)',
  violet: '#7f46f5',
  'violet-dim': 'rgba(127, 70, 245, 0.16)',
  // Status.
  ok: '#4ade80',
  warn: '#f5b83d',
  danger: '#f87171',
}

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        sideband,
        // Per-product accent. Set --product-accent on a wrapper with
        // productAccentStyle() from components/products/accent.
        product: {
          DEFAULT: 'var(--product-accent)',
          dim: 'color-mix(in srgb, var(--product-accent) 16%, transparent)',
        },
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        display: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'ui-monospace', 'monospace'],
      },
      // Five steps. Nothing else on new pages. See DESIGN.md -> Type.
      fontSize: {
        display: [
          'clamp(2.75rem, 1.2rem + 5.6vw, 6.5rem)',
          { lineHeight: '0.95', letterSpacing: '-0.045em', fontWeight: '500' },
        ],
        head: [
          'clamp(2rem, 1.25rem + 2.6vw, 3.5rem)',
          { lineHeight: '1', letterSpacing: '-0.035em', fontWeight: '500' },
        ],
        lead: [
          'clamp(1.25rem, 1.1rem + 0.5vw, 1.5rem)',
          { lineHeight: '1.35', letterSpacing: '-0.015em' },
        ],
        body: [
          'clamp(1rem, 0.96rem + 0.2vw, 1.125rem)',
          { lineHeight: '1.55', letterSpacing: '-0.005em' },
        ],
        small: ['0.875rem', { lineHeight: '1.45', letterSpacing: '0' }],
      },
      spacing: {
        gutter: 'clamp(1.25rem, 0.5rem + 3vw, 2.5rem)',
        // Padding on each side of a section, so two neighbours sit 2x apart
        // (about 130px on a phone, 195px at 1440).
        section: 'clamp(4rem, 2rem + 4.5vw, 7.5rem)',
        nav: '4rem',
      },
      maxWidth: {
        container: '87.5rem',
        narrow: '55rem',
        prose: '40rem',
      },
      borderRadius: {
        panel: '1.25rem',
        inner: '0.75rem',
      },
      transitionDuration: {
        press: '120ms',
        hover: '180ms',
        ui: '320ms',
        enter: '720ms',
      },
      transitionTimingFunction: {
        out: 'cubic-bezier(0.16, 1, 0.3, 1)',
        standard: 'cubic-bezier(0.2, 0, 0, 1)',
        'in-out': 'cubic-bezier(0.65, 0, 0.35, 1)',
      },
    },
  },
  plugins: [
    plugin(({ addBase }) => {
      addBase({
        ':root': {
          ...Object.fromEntries(
            Object.entries(sideband).map(([k, v]) => [`--sideband-${k}`, v]),
          ),
          '--product-accent': sideband.accent,
        },
      })
    }),
  ],
}

export default config
