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
        eternal: {
          black: 'var(--eternal-black)',
          surface: 'var(--eternal-surface)',
          'surface-2': 'var(--eternal-surface-2)',
          border: 'var(--eternal-border)',
          'border-strong': 'var(--eternal-border-strong)',
          muted: 'var(--eternal-muted)',
          hairline: 'var(--eternal-hairline)',
          text: 'var(--eternal-text)',
          'text-secondary': 'var(--eternal-text-secondary)',
          accent: 'var(--eternal-accent)',
          'accent-cyan': 'var(--eternal-accent-cyan)',
          'accent-pink': 'var(--eternal-accent-pink)',
          'accent-yellow': 'var(--eternal-accent-yellow)',
        },
      },
      fontFamily: {
        sans: ['var(--font-dm-sans)', 'system-ui', 'sans-serif'],
        display: ['var(--font-dm-sans)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-jetbrains-mono)', 'ui-monospace', 'monospace'],
      },
      animation: {
        'marquee': 'marquee 40s linear infinite',
        'marquee-2': 'marquee-2 40s linear infinite',
        'orb-float': 'orb-float 8s ease-in-out infinite',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-100%)' },
        },
        'marquee-2': {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0%)' },
        },
        'orb-float': {
          '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
          '33%': { transform: 'translate(30px, -20px) scale(1.05)' },
          '66%': { transform: 'translate(-20px, 15px) scale(0.95)' },
        },
      },
    },
  },
  plugins: [],
}

export default config
