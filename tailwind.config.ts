import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        sideband: {
          black: 'var(--sideband-black)',
          surface: 'var(--sideband-surface)',
          'surface-2': 'var(--sideband-surface-2)',
          border: 'var(--sideband-border)',
          'border-strong': 'var(--sideband-border-strong)',
          muted: 'var(--sideband-muted)',
          hairline: 'var(--sideband-hairline)',
          text: 'var(--sideband-text)',
          'text-secondary': 'var(--sideband-text-secondary)',
          accent: 'var(--sideband-accent)',
        },
      },
      fontFamily: {
        sans: ['var(--font-dm-sans)', 'system-ui', 'sans-serif'],
        display: ['var(--font-dm-sans)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-jetbrains-mono)', 'ui-monospace', 'monospace'],
      },
    },
  },
  plugins: [],
}

export default config
